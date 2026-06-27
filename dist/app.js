"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const xssClean = require("xss-clean");
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("@config/config"));
const morgan_1 = __importDefault(require("@config/morgan"));
const passportHttp_1 = __importDefault(require("@config/passportHttp"));
const passportJwt_1 = __importDefault(require("@config/passportJwt"));
const expressSlowDowner_1 = __importDefault(require("@config/expressSlowDowner"));
const expressRateLimiter_1 = __importDefault(require("@config/expressRateLimiter"));
const index_1 = __importDefault(require("@routes/index"));
const app = (0, express_1.default)();
app.use(morgan_1.default.successHandler);
app.use(morgan_1.default.errorHandler);
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(xssClean());
app.use((0, express_mongo_sanitize_1.default)({
    replaceWith: '_'
}));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.options(config_1.default.corsOrigins, (0, cors_1.default)());
app.use(passport_1.default.initialize());
passport_1.default.use("basic", passportHttp_1.default);
passport_1.default.use("jwt", passportJwt_1.default);
if (config_1.default.env === "production") {
    app.use(expressSlowDowner_1.default);
    app.use(expressRateLimiter_1.default);
}
// All Routes Initialization
(0, index_1.default)(app);
exports.default = app;
