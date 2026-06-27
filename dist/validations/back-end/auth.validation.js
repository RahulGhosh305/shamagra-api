"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const login = (0, validate_1.validate)({
    body: joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
});
exports.login = login;
const changePassword = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        currentPassword: joi_1.default.string().required(),
    }),
});
exports.changePassword = changePassword;
