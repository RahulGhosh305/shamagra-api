"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryWise = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feWorkspaceProduct_model_1 = require("@models/feWorkspaceProduct.model");
const getCategoryWise = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    // Find all products where category._id matches the provided _id
    const products = await feWorkspaceProduct_model_1.WorkspaceProductModel.find({
        "category._id": _id,
        status: "active",
    }).lean();
    // Return the product list
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: products });
});
exports.getCategoryWise = getCategoryWise;
