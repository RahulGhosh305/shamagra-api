import express from "express";
const router = express.Router();

import { isAuthenticated, isClientAuthenticated } from "@middlewares/auth.middleware";

import {
    register,
    login,
    changePassword,
    uploadProfilePhoto,
    removeProfilePhoto,
    lostPassword,
    resetPassword,
    logout,
    renew,
    fileUpload,
    closeAccount
} from "src/controllers/front-end/auth.controller";
import {
    register as registerValidation,
    login as loginValidation,
    changePassword as changePasswordValidation,
    uploadProfilePhoto as uploadProfilePhotoValidation,
    lostPassword as lostPasswordValidation,
    resetPassword as resetPasswordValidation,
    renew as renewValidation,
    fileUpload as fileUploadValidation,
    closeAccount as closeAccountValidation
} from "@validations/front-end/auth.validation";

router.post("/register", isClientAuthenticated, registerValidation, register);
router.post("/login", isClientAuthenticated, loginValidation, login);
router.put("/change-password", isAuthenticated, changePasswordValidation, changePassword);
router.post("/upload-profile-photo", isAuthenticated, uploadProfilePhotoValidation, uploadProfilePhoto);
router.delete("/remove-profile-photo", isAuthenticated, removeProfilePhoto);
router.post("/file-upload", isAuthenticated, fileUploadValidation, fileUpload);
router.post("/lost-password", isClientAuthenticated, lostPasswordValidation, lostPassword);
router.post("/reset-password", isClientAuthenticated, resetPasswordValidation, resetPassword);
router.post("/renew", isClientAuthenticated, renewValidation, renew);
router.post("/close-account", isAuthenticated, closeAccountValidation, closeAccount);
router.delete("/logout", isAuthenticated, logout);

export default router;