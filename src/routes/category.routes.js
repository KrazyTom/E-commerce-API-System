import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  getCategoryById,
} from "../controllers/category.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { categorySchema, categoryUpdateSchema } from "../validations/category.validation.js";

const router = express.Router();


router.post("/", verifyToken, isAdmin, validate(categorySchema), createCategory);
router.put("/:id", verifyToken, isAdmin, validate(categoryUpdateSchema), updateCategory);
router.post("/:id", verifyToken, isAdmin, deleteCategory);

router.get("/", listCategories);
router.get("/:id", getCategoryById);

export default router;
