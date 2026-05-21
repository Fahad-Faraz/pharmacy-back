import Invoice from "../models/Invoice.js";

// GET ALL INVOICES (FILTER + SEARCH)
export const getInvoices = async (req, res) => {
  try {
    const { customerId, from, to } = req.query;

    let filter = {};

    if (customerId) {
      filter.customer = customerId;
    }

    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const invoices = await Invoice.find(filter)
      .populate("customer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
