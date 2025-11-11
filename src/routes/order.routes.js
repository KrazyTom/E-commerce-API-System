import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getMyOrders);

router.get("/all", verifyToken, isAdmin, getAllOrders);

export default router;
