import express from "express";
import { createInvoice, returnInvoice, generateInvoicePDF } from "../controllers/invoiceController.js";
import { getInvoices } from "../controllers/invoiceListController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.post("/return", protect, returnInvoice);
router.get("/:id/pdf", protect, generateInvoicePDF);
router.get("/", protect, getInvoices);

export default router;