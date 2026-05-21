import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["debit", "credit"], required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);