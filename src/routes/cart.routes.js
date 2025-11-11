import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
  checkoutCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addToCartSchema, removeFromCartSchema } from "../validations/cart.validation.js";

const router = express.Router();

router.post("/add", verifyToken, validate(addToCartSchema), addToCart);
router.post("/remove", verifyToken, validate(removeFromCartSchema), removeFromCart);
router.get("/", verifyToken, getCart);

export default router;
