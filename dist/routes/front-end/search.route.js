"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_controller_1 = require("@controllers/front-end/search.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", search_controller_1.searchProducts);
exports.default = router;
