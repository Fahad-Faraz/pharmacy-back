import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import { analyticsRoutes, demandRoutes, purchaseRoutes, importRoutes, migrationRoutes } from "./routes/otherRoutes.js";


dotenv.config();

const app = express();

// FIX: multer needed for CSV import endpoints (req.file was always undefined without it)
const upload = multer({ dest: "uploads/" });



// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/import", importRoutes);
app.use("/api/demand", demandRoutes);
app.use("/api/migration", migrationRoutes);

// DB connect
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});
// FIX: global error handler must be LAST, after all routes
app.use(errorHandler);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});