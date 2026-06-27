"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("@middlewares/auth.middleware");
const workspace_controller_1 = require("src/controllers/back-end/workspace.controller");
const workspace_validation_1 = require("@validations/back-end/workspace.validation");
const workspace_controller_2 = require("@controllers/back-end/workspace.controller");
const workspace_validation_2 = require("@validations/back-end/workspace.validation");
const router = express_1.default.Router();
// Products
router.get("/products", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_products_index"), workspace_validation_1.getProducts, workspace_controller_1.getProducts);
router.get("/products/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_products_index"), workspace_validation_1.getProduct, workspace_controller_1.getProduct);
router.post("/products", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_products_create"), workspace_validation_1.addProduct, workspace_controller_1.addProduct);
router.put("/products/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_products_update"), workspace_validation_1.updateProduct, workspace_controller_1.updateProduct);
router.delete("/products/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_products_delete"), workspace_validation_1.deleteProduct, workspace_controller_1.deleteProduct);
// Orders
router.get("/orders", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_orders_index"), workspace_validation_2.getOrders, workspace_controller_2.getOrders);
router.get("/orders/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_orders_index"), workspace_validation_2.getOrder, workspace_controller_2.getOrder);
router.post("/orders", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_orders_create"), workspace_validation_2.addOrder, workspace_controller_2.addOrder);
router.put("/orders/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_orders_update"), workspace_validation_2.updateOrder, workspace_controller_2.updateOrder);
router.delete("/orders/:_id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.isScopePermitted)("workspace_orders_delete"), workspace_validation_2.deleteOrder, workspace_controller_2.deleteOrder);
exports.default = router;
