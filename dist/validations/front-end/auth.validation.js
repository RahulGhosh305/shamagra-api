"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccount = exports.fileUpload = exports.renew = exports.resetPassword = exports.lostPassword = exports.removeProfilePhoto = exports.uploadProfilePhoto = exports.changePassword = exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const register = (0, validate_1.validate)({
    body: joi_1.default.object({
        firstName: joi_1.default.string().required().label(`"First Name" is required`),
        lastName: joi_1.default.string().required().label(`"Last Name" is required`),
        email: joi_1.default.string().required().label(`"Email" is required`),
        phone: joi_1.default.string().allow(null, '').optional().label(`"Phone is required"`),
        password: joi_1.default.string().min(6).required().label(`"Password" is required`),
    }),
});
exports.register = register;
const login = (0, validate_1.validate)({
    body: joi_1.default.object({
        email: joi_1.default.string().allow(null, '').required(),
        password: joi_1.default.string().allow(null, '').required().label(`"Password" is required`),
    }),
});
exports.login = login;
const changePassword = (0, validate_1.validate)({
    body: joi_1.default.object({
        newPassword: joi_1.default.string().min(6).required(),
        currentPassword: joi_1.default.string().min(6).required(),
    }),
});
exports.changePassword = changePassword;
const uploadProfilePhoto = (0, validate_1.validate)({
    body: joi_1.default.object({
        photo: joi_1.default.string().required().label(`"Photo" is required`),
    }),
});
exports.uploadProfilePhoto = uploadProfilePhoto;
const removeProfilePhoto = (0, validate_1.validate)({
    body: joi_1.default.object({
        photo: joi_1.default.string().required(),
    }),
});
exports.removeProfilePhoto = removeProfilePhoto;
const lostPassword = (0, validate_1.validate)({
    body: joi_1.default.object({
        email: joi_1.default.string().required(),
    }),
});
exports.lostPassword = lostPassword;
const resetPassword = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        newPassword: joi_1.default.string().required(),
    }),
});
exports.resetPassword = resetPassword;
const renew = (0, validate_1.validate)({
    body: joi_1.default.object({
        access: joi_1.default.string().required(),
        refresh: joi_1.default.string().required(),
        fcm: joi_1.default.string().required(),
    }),
});
exports.renew = renew;
const closeAccount = (0, validate_1.validate)({
    body: joi_1.default.object({
        reason: joi_1.default.string().required(),
    }),
});
exports.closeAccount = closeAccount;
const fileUpload = (0, validate_1.validate)({
    body: joi_1.default.object({
        file: joi_1.default.string().required(),
    }),
});
exports.fileUpload = fileUpload;
