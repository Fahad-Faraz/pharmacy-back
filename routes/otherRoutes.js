import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import { getAnalytics } from "../controllers/analyticsController.js";
import { getDemandList } from "../controllers/demandController.js";
import { addPurchase } from "../controllers/purchaseController.js";

import {
  importProducts,
  importCustomers,
  exportCompanyProducts,
} from "../controllers/importController.js";

import {
  migrateCustomers,
  migrateProducts,
} from "../controllers/migrationController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// analytics
router.get("/analytics", protect, getAnalytics);

// demand
router.get("/demand", protect, getDemandList);

// purchase
router.post("/purchase", protect, adminOnly, addPurchase);

// import
router.post(
  "/import/products",
  protect,
  adminOnly,
  upload.single("file"),
  importProducts
);

router.post(
  "/import/customers",
  protect,
  adminOnly,
  upload.single("file"),
  importCustomers
);

// ✅ Export Company CSV
router.get(
  "/export/company/:company",
  protect,
  adminOnly,
  exportCompanyProducts
);

// migration
router.post(
  "/migration/customers",
  protect,
  adminOnly,
  migrateCustomers
);

router.post(
  "/migration/products",
  protect,
  adminOnly,
  migrateProducts
);

export default router;