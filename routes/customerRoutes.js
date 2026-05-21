import express from "express";
import {
  createCustomer,
  searchCustomer,
  getCustomers,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/search", searchCustomer);
router.get("/", getCustomers);

export default router;