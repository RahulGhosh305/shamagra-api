"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const config_1 = __importDefault(require("@config/config"));
const expressSlowDown = (0, express_slow_down_1.default)({
    windowMs: config_1.default.expressSlow.windowBlockSec * 1000,
    delayAfter: config_1.default.expressSlow.perWindowMaxReq,
    delayMs: config_1.default.expressSlow.windowDelay * 1000,
});
exports.default = expressSlowDown;
