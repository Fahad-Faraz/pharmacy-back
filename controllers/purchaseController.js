import Product from "../models/Product.js";

export const addPurchase = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array zaroori hai" });
    }

    const results = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product nahi mila: ${item.productId}` });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Quantity 0 se zyada honi chahiye" });
      }

      // Stock add karo
      product.quantity += Number(item.quantity);

      // Prices update karo agar diye hain
      if (item.mrp && Number(item.mrp) > 0) {
        product.mrp = Number(item.mrp);
      }
      if (item.trade_price && Number(item.trade_price) > 0) {
        product.trade_price = Number(item.trade_price);
      }
      if (item.purchase_price && Number(item.purchase_price) > 0) {
        product.purchase_price = Number(item.purchase_price);
      }

      await product.save();

      results.push({
        name: product.name,
        addedQty: Number(item.quantity),
        newStock: product.quantity,
      });
    }

    res.json({ message: "Stock update ho gaya", updated: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};