import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    customer_code: { type: String, unique: true },
    type: {
      type: String,
      enum: ["retailer", "wholesaler"],
      default: "retailer",
    },
    total_purchase: { type: Number, default: 0 },
    pending_balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);