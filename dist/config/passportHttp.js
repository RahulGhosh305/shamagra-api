"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_http_1 = __importDefault(require("passport-http"));
const passportHttpInit = new passport_http_1.default.BasicStrategy(async (name, secret, done) => {
    const client = name === process.env.JWT_BASIC_USER &&
        secret === process.env.JWT_BASIC_SECRET
        ? { name, secret }
        : null;
    if (!client)
        return done("invalid client", "client");
    return done(null, { name, secret });
});
exports.default = passportHttpInit;
