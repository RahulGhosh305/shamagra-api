"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
exports.default = (fn) => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(err => (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, { message: 'message' in err ? err.message : 'Something went wrong' }));
};
