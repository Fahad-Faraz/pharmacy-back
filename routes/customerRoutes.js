import express from "express";
import {
  createCustomer,
  searchCustomer,
  getCustomers,
  receivePayment,
  getCustomerTransactions,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCustomer);
router.get("/search", protect, searchCustomer);
router.get("/", protect, getCustomers);
router.post("/:id/payment", protect, receivePayment);
router.get("/:id/transactions", protect, getCustomerTransactions);

export default router;