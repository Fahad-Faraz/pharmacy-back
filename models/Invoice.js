import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    invoice_type: {
      type: String,
      enum: ["retailer", "wholesaler"],
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
        discount: { type: Number, default: 0 },
        total: Number,
      },
    ],
    subtotal: { type: Number, default: 0 },
    previous_balance: { type: Number, default: 0 },
    grand_total: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    remaining_balance: { type: Number, default: 0 },
    date: {
      day: Number,
      month: Number,
      year: Number,
    },
    isReturned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);