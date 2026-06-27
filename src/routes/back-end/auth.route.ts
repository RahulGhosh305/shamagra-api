import express from "express";
const router = express.Router();

import { isAuthenticated, isClientAuthenticated } from "@middlewares/auth.middleware";
import { login as loginValidation, changePassword as changePasswordValidation } from "@validations/back-end/auth.validation";

import { login, logout, changePassword } from "src/controllers/back-end/auth.controller";

router.post("/login", isClientAuthenticated, loginValidation, login);
router.put("/change-password", isAuthenticated, changePasswordValidation, changePassword);
router.delete("/logout", isAuthenticated, logout);

export default router;