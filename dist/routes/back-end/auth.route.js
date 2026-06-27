"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = require("@middlewares/auth.middleware");
const auth_validation_1 = require("@validations/back-end/auth.validation");
const auth_controller_1 = require("src/controllers/back-end/auth.controller");
router.post("/login", auth_middleware_1.isClientAuthenticated, auth_validation_1.login, auth_controller_1.login);
router.put("/change-password", auth_middleware_1.isAuthenticated, auth_validation_1.changePassword, auth_controller_1.changePassword);
router.delete("/logout", auth_middleware_1.isAuthenticated, auth_controller_1.logout);
exports.default = router;
