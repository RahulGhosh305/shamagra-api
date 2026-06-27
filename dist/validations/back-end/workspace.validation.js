"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.addOrder = exports.getOrder = exports.getOrders = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProduct = exports.getProducts = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
// GET ALL PRODUCTS VALIDATION
const getProducts = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    }),
});
exports.getProducts = getProducts;
// GET SINGLE PRODUCT VALIDATION
const getProduct = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
});
exports.getProduct = getProduct;
// ADD PRODUCT VALIDATION
const addProduct = (0, validate_1.validate)({
    body: joi_1.default.object({
        productCode: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        subTitle: joi_1.default.string().required(),
        author: joi_1.default.string().required(),
        descriptionShort: joi_1.default.string().required().allow(null).allow(""),
        authorDescription: joi_1.default.string().required().allow(null).allow(""),
        descriptionLong: joi_1.default.string().required().allow(null).allow(""),
        originalPrice: joi_1.default.number().required(),
        discountPrice: joi_1.default.number().required(),
        discountPercentage: joi_1.default.number(),
        averageScore: joi_1.default.string(),
        totalReviews: joi_1.default.string(),
        status: joi_1.default.string().required(),
        categoryId: joi_1.default.string().required(),
        format: joi_1.default.string().required(),
        totalPages: joi_1.default.string().required(),
        publishDate: joi_1.default.date().required(),
        language: joi_1.default.string().required(),
        originCountry: joi_1.default.string().required(),
        dimensions: joi_1.default.string().required(),
        weight: joi_1.default.string().required(),
        sku: joi_1.default.string().required(),
        features: joi_1.default.array().items(joi_1.default.string()),
        // images: Joi.array().items(Joi.string()).required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        file: joi_1.default.string().required().allow(null).allow(""),
        freeShippingThreshold: joi_1.default.string(),
        returnPolicy: joi_1.default.string(),
        secureShopping: joi_1.default.string(),
    }),
});
exports.addProduct = addProduct;
// UPDATE PRODUCT VALIDATION
const updateProduct = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        productCode: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        subTitle: joi_1.default.string().required(),
        author: joi_1.default.string().required(),
        descriptionShort: joi_1.default.string().required().allow(null).allow(""),
        authorDescription: joi_1.default.string().required().allow(null).allow(""),
        descriptionLong: joi_1.default.string().required().allow(null).allow(""),
        originalPrice: joi_1.default.number().required(),
        discountPrice: joi_1.default.number().required(),
        discountPercentage: joi_1.default.number(),
        averageScore: joi_1.default.string(),
        totalReviews: joi_1.default.string(),
        status: joi_1.default.string().required(),
        categoryId: joi_1.default.string().required(),
        format: joi_1.default.string().required(),
        totalPages: joi_1.default.string().required(),
        publishDate: joi_1.default.date().required(),
        language: joi_1.default.string().required(),
        originCountry: joi_1.default.string().required(),
        dimensions: joi_1.default.string().required(),
        weight: joi_1.default.string().required(),
        sku: joi_1.default.string().required(),
        features: joi_1.default.array().items(joi_1.default.string()),
        // images: Joi.array().items(Joi.string()).required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        file: joi_1.default.string().required().allow(null).allow(""),
        freeShippingThreshold: joi_1.default.string(),
        returnPolicy: joi_1.default.string(),
        secureShopping: joi_1.default.string(),
    }),
});
exports.updateProduct = updateProduct;
// DELETE PRODUCT VALIDATION
const deleteProduct = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
});
exports.deleteProduct = deleteProduct;
// GET ALL ORDERS VALIDATION
const getOrders = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    }),
});
exports.getOrders = getOrders;
// GET SINGLE ORDER VALIDATION
const getOrder = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
});
exports.getOrder = getOrder;
// ADD ORDER VALIDATION
const addOrder = (0, validate_1.validate)({
    body: joi_1.default.object({
        user: joi_1.default.object({
            _id: joi_1.default.string().required(),
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            phone: joi_1.default.string().required(),
        }).required(),
        items: joi_1.default.array()
            .items(joi_1.default.object({
            productId: joi_1.default.string().required(),
            productTitle: joi_1.default.string().required(),
            productCode: joi_1.default.string().required(),
            quantity: joi_1.default.number().required(),
            unitPrice: joi_1.default.number().required(),
            subtotal: joi_1.default.number().required(),
        }))
            .required(),
        shippingAddress: joi_1.default.object({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
            companyName: joi_1.default.string().optional(),
            streetAddress: joi_1.default.string().required(),
            apartment: joi_1.default.string().optional(),
            city: joi_1.default.string().required(),
            district: joi_1.default.string().required(),
            thana: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            zipCode: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
        }).required(),
        pricing: joi_1.default.object({
            subtotal: joi_1.default.number().required(),
            shippingCharge: joi_1.default.number().required(),
            taxAmount: joi_1.default.number().required(),
            totalAmount: joi_1.default.number().required(),
        }).required(),
        payment: joi_1.default.object({
            method: joi_1.default.string().valid("cod", "mobile", "bank").required(),
            status: joi_1.default.string()
                .valid("pending", "completed", "failed", "refunded")
                .required(),
            transactionId: joi_1.default.string().optional(),
        }).required(),
        orderNotes: joi_1.default.string().optional(),
        orderStatus: joi_1.default.string()
            .valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned")
            .required(),
    }),
});
exports.addOrder = addOrder;
// UPDATE ORDER VALIDATION
const updateOrder = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        user: joi_1.default.object({
            _id: joi_1.default.string().optional(),
            firstName: joi_1.default.string().optional(),
            lastName: joi_1.default.string().optional(),
            email: joi_1.default.string().email().optional(),
            phone: joi_1.default.string().optional(),
        }).optional(),
        items: joi_1.default.array()
            .items(joi_1.default.object({
            productId: joi_1.default.string().optional(),
            productTitle: joi_1.default.string().optional(),
            productCode: joi_1.default.string().optional(),
            quantity: joi_1.default.number().optional(),
            unitPrice: joi_1.default.number().optional(),
            subtotal: joi_1.default.number().optional(),
        }))
            .optional(),
        shippingAddress: joi_1.default.object({
            firstName: joi_1.default.string().optional(),
            lastName: joi_1.default.string().optional(),
            companyName: joi_1.default.string().optional(),
            streetAddress: joi_1.default.string().optional(),
            apartment: joi_1.default.string().optional(),
            city: joi_1.default.string().optional(),
            district: joi_1.default.string().optional(),
            thana: joi_1.default.string().optional(),
            country: joi_1.default.string().optional(),
            state: joi_1.default.string().optional(),
            zipCode: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            email: joi_1.default.string().email().optional(),
        }).optional(),
        pricing: joi_1.default.object({
            subtotal: joi_1.default.number().optional(),
            shippingCharge: joi_1.default.number().optional(),
            taxAmount: joi_1.default.number().optional(),
            totalAmount: joi_1.default.number().optional(),
        }).optional(),
        payment: joi_1.default.object({
            method: joi_1.default.string().valid("cod", "mobile", "bank").optional(),
            status: joi_1.default.string()
                .valid("pending", "completed", "failed", "refunded")
                .optional(),
            transactionId: joi_1.default.string().optional(),
        }).optional(),
        orderNotes: joi_1.default.string().optional(),
        orderStatus: joi_1.default.string()
            .valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned")
            .required(),
    }),
});
exports.updateOrder = updateOrder;
// CANCEL ORDER VALIDATION
const deleteOrder = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
});
exports.deleteOrder = deleteOrder;
