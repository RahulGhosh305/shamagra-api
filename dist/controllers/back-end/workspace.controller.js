"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrder = exports.getOrders = exports.addOrder = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const feWorkspaceProduct_model_1 = require("@models/feWorkspaceProduct.model");
const feWsCategory_model_1 = require("@models/feWsCategory.model");
const feOrder_model_1 = require("@models/feOrder.model");
// GET ALL PRODUCTS
const getProducts = (0, catchAsync_1.default)(async (req, res) => {
    const products = await feWorkspaceProduct_model_1.WorkspaceProductModel.find({
        status: { $ne: feWorkspaceProduct_model_1.WorkspaceProductStatus.deleted },
    })
        .skip(parseInt(req.query.perPage) *
        (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWorkspaceProduct_model_1.WorkspaceProductModel.countDocuments({
        status: { $ne: feWorkspaceProduct_model_1.WorkspaceProductStatus.deleted },
    });
    const response = {
        page: parseInt(req.query.page),
        perPage: parseInt(req.query.perPage),
        total,
        data: products,
    };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getProducts = getProducts;
// GET SINGLE PRODUCT
const getProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const productInfo = await feWorkspaceProduct_model_1.WorkspaceProductModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: productInfo });
});
exports.getProduct = getProduct;
// ADD PRODUCT
const addProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { productCode, title, subTitle, author, descriptionShort, authorDescription, descriptionLong, originalPrice, discountPrice, discountPercentage, averageScore, totalReviews, status, categoryId, format, totalPages, publishDate, language, originCountry, dimensions, weight, sku, features, photo, file, freeShippingThreshold, returnPolicy, secureShopping, } = req.body;
    const category = await feWsCategory_model_1.WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    const newProduct = new feWorkspaceProduct_model_1.WorkspaceProductModel({
        product: {
            productCode,
            title,
            subTitle,
            author,
        },
        pricing: {
            originalPrice,
            discountPrice,
            discountPercentage,
        },
        rating: {
            averageScore,
            totalReviews,
        },
        status,
        specifications: {
            format,
            totalPages,
            publishDate,
            language,
            originCountry,
            dimensions,
            weight,
            sku,
            category,
        },
        features,
        photo,
        file,
        shippingInfo: {
            freeShippingThreshold,
            returnPolicy,
            secureShopping,
        },
        description: {
            short: descriptionShort,
            long: descriptionLong,
        },
        authorDescription,
    });
    const err = newProduct.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newProduct.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, {
        data: save,
        message: "Product Created",
    });
});
exports.addProduct = addProduct;
// UPDATE PRODUCT
const updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { productCode, title, subTitle, author, descriptionShort, authorDescription, descriptionLong, originalPrice, discountPrice, discountPercentage, averageScore, totalReviews, status, categoryId, format, totalPages, publishDate, language, originCountry, dimensions, weight, sku, features, photo, file, freeShippingThreshold, returnPolicy, secureShopping, } = req.body;
    const category = await feWsCategory_model_1.WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    await feWorkspaceProduct_model_1.WorkspaceProductModel.updateOne({ _id: req.params._id }, {
        product: {
            productCode,
            title,
            subTitle,
            author,
        },
        pricing: {
            originalPrice,
            discountPrice,
            discountPercentage,
        },
        rating: {
            averageScore,
            totalReviews,
        },
        status,
        specifications: {
            format,
            totalPages,
            publishDate,
            language,
            originCountry,
            dimensions,
            weight,
            sku,
            category,
        },
        features,
        photo,
        file,
        shippingInfo: {
            freeShippingThreshold,
            returnPolicy,
            secureShopping,
        },
        description: {
            short: descriptionShort,
            long: descriptionLong,
        },
        authorDescription,
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateProduct = updateProduct;
// DELETE PRODUCT
const deleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    await feWorkspaceProduct_model_1.WorkspaceProductModel.updateOne({ _id: req.params._id }, { $set: { status: feWorkspaceProduct_model_1.WorkspaceProductStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteProduct = deleteProduct;
// GET ALL ORDERS
const getOrders = (0, catchAsync_1.default)(async (req, res) => {
    const query = { orderStatus: { $ne: feOrder_model_1.OrderStatus.deleted } };
    const orders = await feOrder_model_1.OrderModel.find(query)
        .skip(parseInt(req.query.perPage) *
        (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feOrder_model_1.OrderModel.countDocuments(query);
    const response = {
        page: parseInt(req.query.page),
        perPage: parseInt(req.query.perPage),
        total,
        data: orders,
    };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getOrders = getOrders;
// GET SINGLE ORDER
const getOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const orderInfo = await feOrder_model_1.OrderModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: orderInfo });
});
exports.getOrder = getOrder;
// ADD ORDER
const addOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { user, items, shippingAddress, pricing, payment, orderNotes, orderStatus, } = req.body;
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = new feOrder_model_1.OrderModel({
        user,
        orderNumber,
        items,
        shippingAddress,
        pricing,
        payment,
        orderNotes,
        orderStatus,
    });
    const err = newOrder.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newOrder.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, {
        data: save,
        message: "Order Created",
    });
});
exports.addOrder = addOrder;
// UPDATE ORDER
const updateOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { orderStatus } = req.body;
    await feOrder_model_1.OrderModel.updateOne({ _id: req.params._id }, {
        $set: {
            orderStatus,
        },
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateOrder = updateOrder;
// DELETE ORDER (CANCEL ORDER)
const deleteOrder = (0, catchAsync_1.default)(async (req, res) => {
    await feOrder_model_1.OrderModel.updateOne({ _id: req.params._id }, { $set: { orderStatus: feOrder_model_1.OrderStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Order deleted" });
});
exports.deleteOrder = deleteOrder;
