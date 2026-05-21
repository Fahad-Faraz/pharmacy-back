import Customer from "../models/Customer.js";
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
