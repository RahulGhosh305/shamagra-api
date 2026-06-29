import express, { Router } from "express";
import { isAuthenticated, isScopePermitted } from "@middlewares/auth.middleware";
import { leadQuarterStats, salesOrderStats } from "src/controllers/back-end/dashboard.controller";

const router: Router = express.Router();

router.get("/lead-quarter-stats", isAuthenticated, isScopePermitted('dashboard_index'), leadQuarterStats);
router.get("/sales-order-stats", isAuthenticated, isScopePermitted('dashboard_index'), salesOrderStats);

export default router;
