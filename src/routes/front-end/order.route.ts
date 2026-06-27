import express from "express";
const router = express.Router();

import { isAuthenticated } from "@middlewares/auth.middleware";
import {
  addOrder,
  getOrders,
  getOrderById,
} from "src/controllers/front-end/order.controller";

// Place new order
router.post("/order", addOrder);
router.get("/order/:orderId", getOrderById);

export default router;
