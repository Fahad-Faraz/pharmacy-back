import Product from "../models/Product.js";

// 📉 LOW STOCK + COMPANY GROUP
export const getDemandList = async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $lte: 10 },
    });

    const grouped = {};

    for (let p of products) {
      const key = p.company_name || "Unbranded";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push({
        name: p.name,
        quantity: p.quantity,
      });
    }

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
