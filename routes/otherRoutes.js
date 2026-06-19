import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import { getAnalytics } from "../controllers/analyticsController.js";
import { getDemandList } from "../controllers/demandController.js";
import { addPurchase } from "../controllers/purchaseController.js";
import {
  importProducts,
  importCustomers,
} from "../controllers/importController.js";
import {
  migrateCustomers,
  migrateProducts,
} from "../controllers/migrationController.js";

const router = express.Router();

// analytics
router.get("/analytics", protect, getAnalytics);

// demand
router.get("/demand", protect, getDemandList);

// purchase
router.post("/purchase", protect, adminOnly, addPurchase);

// import
router.post("/import/products", protect, adminOnly, importProducts);
router.post("/import/customers", protect, adminOnly, importCustomers);

// migration
router.post("/migration/customers", protect, adminOnly, migrateCustomers);
router.post("/migration/products", protect, adminOnly, migrateProducts);

export default router;