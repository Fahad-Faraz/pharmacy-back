import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProductsAdvanced,
} from "../controllers/productController.js";
import { importProducts } from "../controllers/importController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/search", searchProductsAdvanced);

router.post(
  "/import-pdf",
  protect,
  adminOnly,
  upload.single("file"),
  
);
router.post(
  "/products",
  protect,
  adminOnly,
  upload.single("file"),
  importProducts
);

router.post("/", protect, adminOnly, addProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;