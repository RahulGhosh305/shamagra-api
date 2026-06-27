import express from "express";
const router = express.Router();

import { isClientAuthenticated, isAuthenticated } from "@middlewares/auth.middleware";

import { getProducts, getProduct, getBlogs, getBlog, addReview } from "src/controllers/front-end/landing.controller";

router.get("/products", getProducts);
router.get("/product/:_id", getProduct);
router.get("/blogs", isClientAuthenticated, getBlogs);
router.get("/blog/:_id", isClientAuthenticated, getBlog);
router.post("/product/:_id/review", isAuthenticated, addReview);

export default router;