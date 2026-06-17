import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

export const createInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerId, products, paid_amount, invoice_type } = req.body;

    // FIX: validate required fields upfront
    if (!products || !Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Products array is required" });
    }

    if (!invoice_type) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invoice type is required" });
    }

    // FIX: wholesaler invoice needs a customer
    if (invoice_type === "wholesaler" && !customerId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Customer is required for wholesaler invoices" });
    }

    let subtotal = 0;

    for (let item of products) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      let price = 0;
      let finalQty = item.quantity;

      if (product.product_type === "general") {
        price = product.fixed_price;
      } else if (product.product_type === "company") {
        let tabletQty = 0;

        if (item.unit === "box") {
          tabletQty =
            item.quantity *
            product.unit_structure.box.strips *
            product.unit_structure.strip.tablets;
        } else if (item.unit === "strip") {
          tabletQty = item.quantity * product.unit_structure.strip.tablets;
        } else {
          tabletQty = item.quantity;
        }

        finalQty = tabletQty;
        price = product.mrp;
      } else if (
        product.product_type === "local" ||
        product.product_type === "franchise"
      ) {
        price = product.fixed_price;
      }

      // STOCK CHECK
      if (product.product_type !== "general") {
        if (product.quantity - finalQty < 0) {
          throw new Error(`Insufficient stock for: ${product.name}`);
        }
      }

      // STOCK UPDATE
      if (product.product_type !== "general") {
        product.quantity -= finalQty;
        await product.save({ session });
      }

      item.name = product.name;
      item.price = price;
      item.total = finalQty * price - (item.discount || 0);

      subtotal += item.total;
    }

    // CUSTOMER BALANCE
    let previous_balance = 0;

    if (invoice_type === "wholesaler") {
      const customer = await Customer.findById(customerId).session(session);

      if (!customer) {
        throw new Error("Customer not found");
      }

      previous_balance = customer.pending_balance || 0;
    }

    const grand_total = subtotal + previous_balance;
    const remaining_balance = grand_total - (paid_amount || 0);

    const invoice = await Invoice.create(
      [
        {
          customer: customerId || null,
          invoice_type,
          products,
          subtotal,
          previous_balance,
          grand_total,
          paid_amount: paid_amount || 0,
          remaining_balance,
          isReturned: false,
          date: {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
      ],
      { session }
    );

    // CUSTOMER UPDATE for wholesaler
    if (invoice_type === "wholesaler") {
      const customer = await Customer.findById(customerId).session(session);

      if (customer) {
        customer.pending_balance = remaining_balance;
        customer.total_purchase += grand_total;
        await customer.save({ session });

        await Transaction.create(
  [
    {
      customer: customerId,
      invoice: invoice[0]._id,
      amount: subtotal,
      type: "debit",
      note: "Invoice Sale",
    },
  ],
  { session }
);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.json(invoice[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

export const returnInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    const invoice = await Invoice.findById(invoiceId).session(session);

    if (!invoice) throw new Error("Invoice not found");

    // FIX: simplified — if already returned, deny everyone
    if (invoice.isReturned) {
      throw new Error("Invoice already returned");
    }

    // restore stock
    for (let item of invoice.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { quantity: item.quantity } },
        { session }
      );
    }

    if (invoice.invoice_type === "wholesaler") {
      await Customer.updateOne(
        { _id: invoice.customer },
        {
          $inc: {
            pending_balance: -invoice.grand_total,
            total_purchase: -invoice.grand_total,
          },
        },
        { session }
      );

      await Transaction.create(
  [
    {
      customer: invoice.customer,
      invoice: invoice._id,
      amount: invoice.subtotal,
      type: "credit",
      note: "Invoice Returned",
    },
  ],
  { session }
);
    }

    invoice.isReturned = true;
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Return & Refund Processed" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
