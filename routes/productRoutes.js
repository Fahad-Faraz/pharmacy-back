import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProductsAdvanced,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// FIX: /search must come BEFORE /:id — otherwise Express matches "search" as an id param
router.get("/search", searchProductsAdvanced);
router.post("/", protect, adminOnly, addProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
