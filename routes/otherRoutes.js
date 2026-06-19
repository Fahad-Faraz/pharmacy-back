// routes/analyticsRoutes.js
import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
const r1 = express.Router();
r1.get("/", protect, getAnalytics);
export { r1 as analyticsRoutes };

// routes/demandRoutes.js
import { getDemandList } from "../controllers/demandController.js";
const r2 = express.Router();
r2.get("/", protect, getDemandList);
export { r2 as demandRoutes };

// routes/purchaseRoutes.js
import { addPurchase } from "../controllers/purchaseController.js";
import { adminOnly } from "../middleware/authMiddleware.js";
const r3 = express.Router();
r3.post("/", protect, adminOnly, addPurchase);
export { r3 as purchaseRoutes };

// routes/importRoutes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  importProducts,
  importCustomers,
} from "../controllers/importController.js";

const r4 = express.Router();

r4.post(
  "/products",
  protect,
  adminOnly,
  upload.single("file"),
  importProducts
);

r4.post(
  "/customers",
  protect,
  adminOnly,
  upload.single("file"),
  importCustomers
);

export { r4 as importRoutes };

// routes/migrationRoutes.js
import { migrateCustomers, migrateProducts } from "../controllers/migrationController.js";
const r5 = express.Router();
r5.post("/customers", protect, adminOnly, migrateCustomers);
r5.post("/products", protect, adminOnly, migrateProducts);
export { r5 as migrationRoutes };
