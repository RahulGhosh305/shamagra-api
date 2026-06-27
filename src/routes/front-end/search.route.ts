import { searchProducts } from "@controllers/front-end/search.controller";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", searchProducts);

export default router;
