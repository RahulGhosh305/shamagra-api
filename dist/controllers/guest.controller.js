"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUrl = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const baseUrl = (0, catchAsync_1.default)(async (req, res) => {
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { message: "welcome to home page." });
});
exports.baseUrl = baseUrl;
