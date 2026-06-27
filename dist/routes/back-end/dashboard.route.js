"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("@middlewares/auth.middleware");
const dashboard_controller_1 = require("src/controllers/back-end/dashboard.controller");
const router = express_1.default.Router();
router.get("/lead-quarter-stats", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)('dashboard_index'), dashboard_controller_1.leadQuarterStats);
exports.default = router;
