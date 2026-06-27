"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config_1 = __importDefault(require("@config/config"));
const enumerateErrorFormat = winston.format((info) => {
    if (info === null || info === void 0 ? void 0 : info.stack)
        Object.assign(info, { message: info.stack });
    return info;
});
const logger = winston.createLogger({
    level: config_1.default.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(enumerateErrorFormat(), config_1.default.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(), winston.format.splat(), winston.format.printf((params) => `${params.level}: ${params.message}`)),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});
exports.default = logger;
