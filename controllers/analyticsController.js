import Invoice from "../models/Invoice.js";

// 📊 DAILY / MONTHLY / YEARLY SALES + PROFIT
export const getAnalytics = async (req, res) => {
  try {
    // FIX: populate products.product so we can access purchase_price
    const invoices = await Invoice.find({ isReturned: false }).populate(
      "products.product"
    );

    let totalSales = 0;
    let totalProfit = 0;

    let daily = {};
    let monthly = {};
    let yearly = {};

    for (let inv of invoices) {
      const dateKey = `${inv.date.day}-${inv.date.month}-${inv.date.year}`;

      totalSales += inv.grand_total;

      let cost = 0;

      for (let item of inv.products) {
        // FIX: use item.product (populated doc) instead of undefined `product`
        // Also guard against null (product deleted after invoice was made)
        if (item.product && item.product.purchase_price) {
          cost += item.product.purchase_price * item.quantity;
        }
      }

      const profit = inv.grand_total - cost;
      totalProfit += profit;

      // DAILY
      daily[dateKey] = (daily[dateKey] || 0) + inv.grand_total;

      // MONTHLY
      const mKey = `${inv.date.month}-${inv.date.year}`;
      monthly[mKey] = (monthly[mKey] || 0) + inv.grand_total;

      // YEARLY
      yearly[inv.date.year] = (yearly[inv.date.year] || 0) + inv.grand_total;
    }

    res.json({
      totalSales,
      totalProfit,
      daily,
      monthly,
      yearly,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
