import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { parseCSV } from "../utils/csvParser.js";

// 📦 IMPORT PRODUCTS
export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "CSV file is required",
      });
    }

    const data = await parseCSV(req.file.buffer);

    const validProducts = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (
        !item.name ||
        !item.company_name ||
        !item.mrp ||
        !item.trade_price
      ) {
        errors.push({
          row: i + 2,
          reason:
            "Name, Company, MRP and Trade Price required",
        });

        continue;
      }

      validProducts.push({
        name: item.name,
        prefix: item.prefix || null,
        company_name: item.company_name,
        product_type:
          item.product_type || "company",

        fixed_price: item.fixed_price
          ? Number(item.fixed_price)
          : null,

        quantity:
          Number(item.quantity) || 0,

        trade_price:
          Number(item.trade_price) || 0,

        purchase_price:
          Number(item.purchase_price) || 0,

        mrp: Number(item.mrp) || 0,

        discount:
          Number(item.discount) || 0,

        generic_name:
          item.generic_name || null,

        barcode:
          item.barcode || null,

        expiry_date:
          item.expiry_date || null,

        unit_structure: {
          box: {
            strips:
              Number(item.box_strips) || 1,
          },
          strip: {
            tablets:
              Number(item.strip_tablets) || 1,
          },
        },
      });
    }

    if (validProducts.length > 0) {
      await Product.insertMany(validProducts);
    }

    res.json({
      imported: validProducts.length,
      failed: errors.length,
      errors,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const importCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "CSV file required",
      });
    }

    res.json({
      message: "Customer import endpoint ready",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};