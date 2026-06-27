"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceProductStatus = exports.WorkspaceProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({
    active: "active",
    inactive: "inactive",
    deleted: "deleted",
});
exports.WorkspaceProductStatus = documentStatus;
const categorySchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false,
        ref: "fe_ws_category",
    },
    name: { type: String, required: false, default: null },
}, { _id: false });
const descriptionSchema = new mongoose_1.Schema({
    short: { type: String, required: false, default: null },
    long: { type: String, required: false, default: null },
}, { _id: false });
const pricingSchema = new mongoose_1.Schema({
    originalPrice: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    currency: { type: String, default: "৳" },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    productCode: { type: String, required: false, default: null },
    title: { type: String, required: false, default: null },
    subTitle: { type: String, required: false, default: null },
    author: { type: String, required: false, default: null },
}, { _id: false });
const shippingSchema = new mongoose_1.Schema({
    freeShippingThreshold: { type: String, default: null },
    returnPolicy: { type: String, default: null },
    secureShopping: { type: String, default: null },
}, { _id: false });
const specificationSchema = new mongoose_1.Schema({
    format: { type: String, default: null },
    totalPages: { type: String, default: null },
    publishDate: { type: String, default: null },
    language: { type: String, default: "English" },
    originCountry: { type: String, default: null },
    dimensions: { type: String, default: null },
    weight: { type: String, default: null },
    sku: { type: String, default: null },
    category: { type: categorySchema, required: true },
}, { _id: false });
const ratingSchema = new mongoose_1.Schema({
    averageScore: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, { _id: false });
const documentSchema = new mongoose_1.Schema({
    product: { type: productSchema, required: true },
    photo: { type: String, required: false, default: null },
    file: { type: String, required: false, default: null },
    pricing: { type: pricingSchema, default: () => ({}) },
    rating: { type: ratingSchema, default: () => ({}) },
    shippingInfo: { type: shippingSchema, default: () => ({}) },
    specifications: { type: specificationSchema, default: () => ({}) },
    authorDescription: { type: String, required: false, default: null },
    description: {
        type: descriptionSchema,
        required: false,
        default: () => ({}),
    },
    features: [{ type: String }],
    status: {
        type: String,
        enum: Object.values(documentStatus),
        required: false,
        default: documentStatus.active,
    },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_workspace_product", documentSchema);
exports.WorkspaceProductModel = documentModel;
