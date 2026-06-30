import Product from "../models/Product.js";
import { PDFParse } from "pdf-parse";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      product_type,
      mrp,
      purchase_price,
      trade_price,
      company_name,
      generic_name,
      fixed_price,
      quantity,
      barcode,
      prefix,
      unit_structure,
      expiry_date,
      discount,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product ka naam zaroori hai" });
    }

    const product = await Product.create({
      name: name.trim(),
      product_type: product_type || "company",
      mrp: mrp || 0,
      purchase_price: purchase_price || 0,
      trade_price: trade_price || 0,
      company_name: company_name || null,
      generic_name: generic_name || null,
      fixed_price: fixed_price || null,
      quantity: quantity || 0,
      barcode: barcode || null,
      prefix: prefix || null,
      unit_structure: unit_structure || {
        box: { strips: 1 },
        strip: { tablets: 10 },
      },
      expiry_date: expiry_date || null,
      discount: discount || 0,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || "";
    const company = req.query.company || "";

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company_name: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
        { generic_name: { $regex: search, $options: "i" } },
      ];
    }

    if (company) {
      query.company_name = { $regex: company, $options: "i" };
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product nahi mila" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product nahi mila" });
    }

    res.json({ message: "Product delete ho gaya" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { company_name: { $regex: q, $options: "i" } },
        { generic_name: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchProductsAdvanced = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { company_name: { $regex: q, $options: "i" } },
        { barcode: { $regex: q, $options: "i" } },
        { generic_name: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const importProductsPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file required",
      });
    }

    // PDF se text extract karo
    const parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    await parser.destroy();

    const fullText = data.text;

    console.log(fullText);

    res.json({
      success: true,
      extractedText: fullText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};