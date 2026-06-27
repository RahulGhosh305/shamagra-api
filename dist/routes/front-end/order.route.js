"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_controller_1 = require("src/controllers/front-end/order.controller");
// Place new order
router.post("/order", order_controller_1.addOrder);
router.get("/order/:orderId", order_controller_1.getOrderById);
exports.default = router;
