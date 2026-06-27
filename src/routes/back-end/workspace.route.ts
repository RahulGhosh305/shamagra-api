import express, { Router } from "express";
import {
  isAuthenticated,
  isScopePermitted,
} from "@middlewares/auth.middleware";
import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "src/controllers/back-end/workspace.controller";
import {
  getProducts as getProductsValidation,
  getProduct as getProductValidation,
  addProduct as addProductValidation,
  updateProduct as updateProductValidation,
  deleteProduct as deleteProductValidation,
} from "@validations/back-end/workspace.validation";
import {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "@controllers/back-end/workspace.controller";
import {
  getOrders as getOrdersValidation,
  getOrder as getOrderValidation,
  addOrder as addOrderValidation,
  updateOrder as updateOrderValidation,
  deleteOrder as deleteOrderValidation,
} from "@validations/back-end/workspace.validation";

const router: Router = express.Router();

// Products
router.get(
  "/products",
  isAuthenticated,
  isScopePermitted("workspace_products_index"),
  getProductsValidation,
  getProducts,
);
router.get(
  "/products/:_id",
  isAuthenticated,
  isScopePermitted("workspace_products_index"),
  getProductValidation,
  getProduct,
);
router.post(
  "/products",
  isAuthenticated,
  isScopePermitted("workspace_products_create"),
  addProductValidation,
  addProduct,
);
router.put(
  "/products/:_id",
  isAuthenticated,
  isScopePermitted("workspace_products_update"),
  updateProductValidation,
  updateProduct,
);
router.delete(
  "/products/:_id",
  isAuthenticated,
  isScopePermitted("workspace_products_delete"),
  deleteProductValidation,
  deleteProduct,
);

// Orders
router.get(
  "/orders",
  isAuthenticated,
  isScopePermitted("workspace_orders_index"),
  getOrdersValidation,
  getOrders,
);
router.get(
  "/orders/:_id",
  isAuthenticated,
  isScopePermitted("workspace_orders_index"),
  getOrderValidation,
  getOrder,
);
router.post(
  "/orders",
  isAuthenticated,
  isScopePermitted("workspace_orders_create"),
  addOrderValidation,
  addOrder,
);
router.put(
  "/orders/:_id",
  isAuthenticated,
  isScopePermitted("workspace_orders_update"),
  updateOrderValidation,
  updateOrder,
);
router.delete(
  "/orders/:_id",
  isAuthenticated,
  isScopePermitted("workspace_orders_delete"),
  deleteOrderValidation,
  deleteOrder,
);

export default router;
