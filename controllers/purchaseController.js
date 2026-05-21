import Product from "../models/Product.js";

export const addPurchase = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    for (let item of products) {
      const product = await Product.findById(item.productId);

      // FIX: was missing null check — crashes with "cannot read property of null"
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }

      product.quantity += Number(item.quantity);

      if (item.purchase_price && item.purchase_price > 0) {
        product.purchase_price = item.purchase_price;
      }

      await product.save();
    }

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
