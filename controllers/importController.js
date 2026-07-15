import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

import { Parser } from "json2csv";

import { parseCSV } from "../utils/csvParser.js";
import { parseExcel } from "../utils/excelParser.js";

// 📦 IMPORT PRODUCTS
 export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload CSV or Excel file",
      });
    }

    const fileName = req.file.originalname.toLowerCase();


    let rows = [];

if (fileName.endsWith(".csv")) {
  rows = await parseCSV(req.file.buffer);
} else if (
  fileName.endsWith(".xlsx") ||
  fileName.endsWith(".xls")
) {
  rows = await parseExcel(req.file.buffer);
} else {
  return res.status(400).json({
    success: false,
    message: "Only CSV and Excel files are allowed",
  });
}

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    const errors = [];

    const productsToInsert = [];
        for (let i = 0; i < rows.length; i++) {
      const item = rows[i];

      if (
        !item.name ||
        !item.company_name ||
        !item.mrp ||
        !item.trade_price
      ) {
        skipped++;

        errors.push({
          row: i + 2,
          reason:
            "Name, Company, MRP and Trade Price required",
        });

        continue;
      }

      const existing =
        await Product.findOne({
          name: item.name.trim(),
        });

      if (existing) {
        existing.quantity +=
          Number(item.quantity) || 0;

        existing.trade_price =
          Number(item.trade_price) ||
          existing.trade_price;

        existing.purchase_price =
          Number(item.purchase_price) ||
          existing.purchase_price;

        existing.mrp =
          Number(item.mrp) ||
          existing.mrp;

        existing.discount =
          Number(item.discount) ||
          existing.discount;

        existing.company_name =
          item.company_name ||
          existing.company_name;

        existing.generic_name =
          item.generic_name ||
          existing.generic_name;

        existing.barcode =
          item.barcode ||
          existing.barcode;

        existing.expiry_date =
          item.expiry_date ||
          existing.expiry_date;

        await existing.save();

        updated++;

        continue;
      }

      productsToInsert.push({
        name: item.name.trim(),

        company_name:
          item.company_name,

        product_type:
          item.product_type ||
          "company",

        generic_name:
          item.generic_name || null,

        prefix:
          item.prefix || null,

        barcode:
          item.barcode || null,

        quantity:
          Number(item.quantity) || 0,

        mrp:
          Number(item.mrp) || 0,

        trade_price:
          Number(item.trade_price) || 0,

        purchase_price:
          Number(item.purchase_price) || 0,

        fixed_price:
          item.fixed_price
            ? Number(item.fixed_price)
            : null,

        discount:
          Number(item.discount) || 0,

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
           // Bulk insert new products
    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
      imported = productsToInsert.length;
    }

    return res.status(200).json({
      success: true,
      message: "Products imported successfully.",

      summary: {
        imported,
        updated,
        skipped,
        total: rows.length,
      },

      errors,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
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
export const exportCompanyProducts = async (req, res) => {
  try {
    const { company } = req.params;

    const products = await Product.find({
      company_name: {
        $regex: company,
        $options: "i",
      },
    }).lean();

    if (!products.length) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    const parser = new Parser();

    const csv = parser.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment(`${company}-products.csv`);

    return res.send(csv);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};