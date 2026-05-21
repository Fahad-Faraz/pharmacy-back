import express from "express";
import { createInvoice, returnInvoice } from "../controllers/invoiceController.js";
import { getInvoices } from "../controllers/invoiceListController.js";
// FIX: protect was used on returnInvoice route but never imported
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createInvoice);
router.post("/return", protect, returnInvoice); // protect was already correct, just needed the import
router.get("/", getInvoices);

export default router;
