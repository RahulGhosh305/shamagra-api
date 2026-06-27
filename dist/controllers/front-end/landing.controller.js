"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.getBlog = exports.getBlogs = exports.getProduct = exports.getProducts = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feWorkspaceProduct_model_1 = require("@models/feWorkspaceProduct.model");
const feWsBlog_model_1 = require("@models/feWsBlog.model");
const feReview_model_1 = require("@models/feReview.model");
const getProducts = (0, catchAsync_1.default)(async (req, res) => {
    const { limit, category, author, price } = req.query;
    const conditions = {
        status: feWorkspaceProduct_model_1.WorkspaceProductStatus.active,
    };
    if (category) {
        const categories = String(category)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        if (categories.length) {
            conditions["specifications.category.name"] = { $in: categories };
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
    if (price === "Free") {
        conditions["pricing.discountPrice"] = 0;
    }
    const sort = { createdAt: -1 };
    if (price === "LowToHigh") {
        sort["pricing.discountPrice"] = 1;
    }
    else if (price === "HighToLow") {
        sort["pricing.discountPrice"] = -1;
    }
    const products = await feWorkspaceProduct_model_1.WorkspaceProductModel.find(conditions)
        .limit(Number(limit) || 0)
        .sort(sort);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: products });
});
exports.getProducts = getProducts;
const getProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const product = await feWorkspaceProduct_model_1.WorkspaceProductModel.findOne({ _id }).lean();
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: product });
});
exports.getProduct = getProduct;
const getBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const blogs = await feWsBlog_model_1.WsBlogModel.find({ status: feWsBlog_model_1.WsBlogStatus.active }).lean();
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: blogs });
});
exports.getBlogs = getBlogs;
const getBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const blog = await feWsBlog_model_1.WsBlogModel.findOne({ _id }).lean();
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: blog });
});
exports.getBlog = getBlog;
// ADD REVIEW
const addReview = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params; // Product ID
    const { rating, comment } = req.body;
    const user = req.user;
    if (!user || !user._id) {
        return (0, apiResponse_1.default)(res, http_status_1.default.UNAUTHORIZED, { message: "Please login to review." });
    }
    const userId = user._id;
    const userName = (user === null || user === void 0 ? void 0 : user.firstName) ? `${user.firstName} ${user.lastName || ''}` : "Anonymous";
    const existingReview = await feReview_model_1.ReviewModel.findOne({ productId: _id, userId });
    let actionMessage = "Review added successfully";
    if (existingReview) {
        if (existingReview.rating === rating) {
            // Toggle off (remove review if clicked the exact same rating)
            await feReview_model_1.ReviewModel.deleteOne({ _id: existingReview._id });
            actionMessage = "Review removed";
        }
        else {
            // Update existing review
            existingReview.rating = rating;
            if (comment !== undefined)
                existingReview.comment = comment;
            await existingReview.save();
            actionMessage = "Review updated successfully";
        }
    }
    else {
        // Create new review
        const newReview = new feReview_model_1.ReviewModel({
            productId: _id,
            userId,
            userName,
            rating,
            comment,
        });
        await newReview.save();
    }
    // Recalculate average rating
    const reviews = await feReview_model_1.ReviewModel.find({ productId: _id });
    const totalReviews = reviews.length;
    const averageScore = totalReviews > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0;
    await feWorkspaceProduct_model_1.WorkspaceProductModel.updateOne({ _id }, {
        $set: {
            "rating.averageScore": averageScore,
            "rating.totalReviews": totalReviews,
        },
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { message: actionMessage });
});
exports.addReview = addReview;
