"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feWorkspaceProduct_model_1 = require("@models/feWorkspaceProduct.model");
const escapeRegex = (text) => {
    return text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};
const searchProducts = (0, catchAsync_1.default)(async (req, res) => {
    const { q, category, author, price, page, limit, sort } = req.query;
    const conditions = { status: feWorkspaceProduct_model_1.WorkspaceProductStatus.active };
    if (category) {
        const categories = String(category)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        if (categories.length) {
            conditions["category.name"] = { $in: categories };
        }
    }
    if (author) {
        const authors = String(author)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        if (authors.length) {
            conditions["product.author"] = { $in: authors };
        }
    }
    if (q) {
        const text = String(q).trim();
        if (text.length) {
            const regex = new RegExp(escapeRegex(text), "i");
            conditions["$or"] = [
                { "product.title": regex },
                { "product.subTitle": regex },
                { "product.author": regex },
                { "description.short": regex },
                { "description.long": regex },
                { "category.name": regex },
            ];
        }
    }
    const pageNum = Math.max(Number(page) || 1, 1);
    const perPage = Math.max(Number(limit) || 20, 1);
    const skip = (pageNum - 1) * perPage;
    let sortObj = { createdAt: -1 };
    if (String(price) === "LowToHigh") {
        sortObj = { "pricing.discountPrice": 1 };
    }
    else if (String(price) === "HighToLow") {
        sortObj = { "pricing.discountPrice": -1 };
    }
    else if (sort) {
        // allow custom sort like `price:asc` or `price:desc` or `createdAt:desc`
        const s = String(sort).split(":");
        if (s.length === 2) {
            const key = s[0];
            const dir = s[1].toLowerCase() === "asc" ? 1 : -1;
            sortObj = { [key]: dir };
        }
    }
    const total = await feWorkspaceProduct_model_1.WorkspaceProductModel.countDocuments(conditions);
    const items = await feWorkspaceProduct_model_1.WorkspaceProductModel.find(conditions)
        .skip(skip)
        .limit(perPage)
        .sort(sortObj)
        .lean();
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, {
        data: { items, total, page: pageNum, limit: perPage },
    });
});
exports.searchProducts = searchProducts;
