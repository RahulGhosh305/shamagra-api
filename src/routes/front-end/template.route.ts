import express from "express";
const router = express.Router();

import { isClientAuthenticated } from "@middlewares/auth.middleware";

import { getCategoryWise } from "src/controllers/front-end/categories.controller";

router.get("/category/:_id", isClientAuthenticated, getCategoryWise);

export default router;
