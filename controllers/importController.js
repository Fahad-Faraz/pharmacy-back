import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { parseCSV } from "../utils/csvParser.js";

// 📦 IMPORT PRODUCTS
export const importProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });
    const data = await parseCSV(req.file.path);

    for (let item of data) {
      await Product.create({
        name: item.name,
        prefix: item.prefix,
        company_name: item.company_name,
        product_type: item.product_type || "company",
        fixed_price: item.fixed_price ? Number(item.fixed_price) : null,
        quantity: Number(item.quantity) || 0,
        trade_price: Number(item.trade_price) || 0,
        purchase_price: Number(item.purchase_price) || 0,
        mrp: Number(item.mrp) || 0,
        discount: Number(item.discount) || 0,
        unit_structure: {
          box: { strips: Number(item.box_strips) || 1 },
          strip: { tablets: Number(item.strip_tablets) || 1 },
        },
      });
    }

    res.json({ message: "Products imported successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 IMPORT CUSTOMERS
export const importCustomers = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });
    const data = await parseCSV(req.file.path);

    for (let item of data) {
      await Customer.create({
        customer_name: item.customer_name,
        customer_code: item.customer_code,
        type: item.type || "retailer",
        pending_balance: Number(item.pending_balance) || 0,
      });
    }

    res.json({ message: "Customers imported successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
