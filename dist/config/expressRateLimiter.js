"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("@config/config"));
const expressRateLimit = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.expressSlow.windowBlockSec * 1000,
    max: config_1.default.expressSlow.perWindowMaxReq,
    message: `You have exceeded the ${config_1.default.expressSlow.perWindowMaxReq} requests in ${config_1.default.expressSlow.windowBlockSec} seconds limit!`,
});
exports.default = expressRateLimit;
