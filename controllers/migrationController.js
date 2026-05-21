import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { parseCSV } from "../utils/csvParser.js";

export const migrateCustomers = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });
    const data = await parseCSV(req.file.path);

    for (let c of data) {
      await Customer.create({
        customer_name: c.customer_name,
        customer_code: c.customer_code,
        pending_balance: Number(c.pending_balance) || 0,
        total_purchase: Number(c.total_purchase) || 0,
      });
    }

    res.json({ message: "Customers migrated successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const migrateProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });
    const data = await parseCSV(req.file.path);

    for (let p of data) {
      await Product.create({
        name: p.name,
        company_name: p.company_name,
        quantity: Number(p.quantity) || 0,
        purchase_price: Number(p.purchase_price) || 0,
        mrp: Number(p.mrp) || 0,
      });
    }

    res.json({ message: "Products migrated successfully", count: data.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
