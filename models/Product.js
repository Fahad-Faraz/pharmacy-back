import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // REQUIRED FIELDS (must for manual + import)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company_name: {
      type: String,
      required: true,
      trim: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
      mrp: Number(mrp) || 0
    },

    trade_price: {
      type: Number,
      required: true,
      min: 0,
    },

    // OPTIONAL FIELDS
    product_type: {
      type: String,
      enum: ["company", "local", "franchise", "general"],
      default: "company",
    },

    generic_name: { type: String, default: null },

    prefix: {
      type: String,
      enum: ["Tab", "Cap", "Inj", "Syp", "Eye Drop", "Nasal spray", "Drop"],
      default: null,
    },

    fixed_price: { type: Number, default: null },

    quantity: { type: Number, default: 0 },

    unit_structure: {
      box: { strips: { type: Number, default: 1 } },
      strip: { tablets: { type: Number, default: 1 } },
    },

    purchase_price: { type: Number, default: 0 },

    discount: { type: Number, default: 0 },

    expiry_date: { type: Date, default: null },

    barcode: { type: String, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);