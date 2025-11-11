import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  listProducts,
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productSchema, productUpdateSchema,getProductSchema } from "../validations/product.validation.js";


//Admin APIs
const router = express.Router();
router.post("/", verifyToken, isAdmin, validate(productSchema), createProduct);
router.put("/:id", verifyToken, isAdmin, validate(productUpdateSchema), updateProduct);
router.post("/:id", verifyToken, isAdmin, deleteProduct);

//Cutomer API
router.get("/", verifyToken,validate(getProductSchema), listProducts);
router.get("/:id", verifyToken, getProductById);

export default router;
