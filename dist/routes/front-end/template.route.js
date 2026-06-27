"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = require("@middlewares/auth.middleware");
const categories_controller_1 = require("src/controllers/front-end/categories.controller");
router.get("/category/:_id", auth_middleware_1.isClientAuthenticated, categories_controller_1.getCategoryWise);
exports.default = router;
