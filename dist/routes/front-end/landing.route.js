"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = require("@middlewares/auth.middleware");
const landing_controller_1 = require("src/controllers/front-end/landing.controller");
router.get("/products", landing_controller_1.getProducts);
router.get("/product/:_id", landing_controller_1.getProduct);
router.get("/blogs", auth_middleware_1.isClientAuthenticated, landing_controller_1.getBlogs);
router.get("/blog/:_id", auth_middleware_1.isClientAuthenticated, landing_controller_1.getBlog);
router.post("/product/:_id/review", auth_middleware_1.isAuthenticated, landing_controller_1.addReview);
exports.default = router;
