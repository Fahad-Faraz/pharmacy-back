import Product from "../models/Product.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    // FIX: validate required fields instead of blindly saving req.body
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
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (
      (product_type === "company" || !product_type) &&
      (mrp === undefined || mrp === null)
    ) {
      return res.status(400).json({ message: "MRP is required for company products" });
    }

    const product = await Product.create({
      name,
      product_type: product_type || "company",
      mrp,
      purchase_price,
      trade_price,
      company_name,
      generic_name,
      fixed_price,
      quantity: quantity || 0,
      barcode,
      prefix,
      unit_structure,
      expiry_date,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PRODUCTS (paginated + search + filter)
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

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    // FIX: was missing try/catch — crashes server on bad ID
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    // FIX: was missing try/catch — crashes server on bad ID
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH (basic)
export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q;

    // FIX: guard against empty query — $regex with undefined crashes Mongo
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { company_name: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH ADVANCED (with barcode)
export const searchProductsAdvanced = async (req, res) => {
  try {
    const q = req.query.q;

    // FIX: guard against empty query
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { company_name: { $regex: q, $options: "i" } },
        { barcode: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
