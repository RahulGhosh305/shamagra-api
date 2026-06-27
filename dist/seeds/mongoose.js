"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_1.default.connect((_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : "").catch((err) => {
    console.log("Mongoose connection error: " + err);
});
mongoose_1.default.connection.once("open", () => {
    console.log("Mongoose connected.");
    mongoose_1.default.connection.on("connected", () => {
        console.log("Mongoose event connected");
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("Mongoose event disconnected");
    });
    mongoose_1.default.connection.on("reconnected", () => {
        console.log("Mongoose event reconnected");
    });
    mongoose_1.default.connection.on("error", (error) => {
        console.log("Mongoose event error");
        console.log(error);
    });
});
exports.default = mongoose_1.default;
