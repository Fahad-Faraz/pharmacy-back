import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";
import { generateCustomerCode } from "../utils/helpers.js";

// CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const { customer_name, type, pending_balance } = req.body;

    if (!customer_name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await Customer.create({
      customer_name,
      customer_code: generateCustomerCode(),
      type: type || "retailer",
      pending_balance: pending_balance || 0,
    });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH CUSTOMERS
export const searchCustomer = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const customers = await Customer.find({
      $or: [
        { customer_name: { $regex: q, $options: "i" } },
        { customer_code: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RECEIVE PAYMENT — pending balance kam karo + transaction record karo
export const receivePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, note } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Valid amount zaroori hai" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer nahi mila" });
    }

    if (Number(amount) > customer.pending_balance) {
      return res.status(400).json({
        message: `Amount zyada hai. Balance sirf Rs.${customer.pending_balance.toFixed(0)} hai`,
      });
    }

    // Balance update karo
    customer.pending_balance = Number(
      (customer.pending_balance - Number(amount)).toFixed(2)
    );
    await customer.save();

    // Transaction record karo
    await Transaction.create({
      customer: id,
      amount: Number(amount),
      type: "credit",
      note: note || "Payment received",
    });

    res.json({
      message: "Payment receive ho gaya",
      newBalance: customer.pending_balance,
      customer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CUSTOMER TRANSACTIONS — full ledger
export const getCustomerTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await Transaction.find({ customer: id })
      .sort({ createdAt: 1 })
      .populate("invoice", "_id");

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};