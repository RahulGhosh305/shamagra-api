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
exports.PaymentStatus = exports.OrderStatus = exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderStatus = Object.freeze({
    pending: "pending",
    confirmed: "confirmed",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
    returned: "returned",
    active: "active",
    inactive: "inactive",
    deleted: "deleted",
});
exports.OrderStatus = orderStatus;
const paymentStatus = Object.freeze({
    pending: "pending",
    completed: "completed",
    failed: "failed",
    refunded: "refunded",
});
exports.PaymentStatus = paymentStatus;
const countrySchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false,
        ref: "fe_country",
        default: null,
    },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
}, { _id: false });
const orderItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "fe_workspace_product",
        required: true,
    },
    productTitle: { type: String, required: true },
    productCode: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
}, { _id: true });
const shippingAddressSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: false, default: null },
    streetAddress: { type: String, required: true },
    apartment: { type: String, required: false, default: null },
    city: { type: String, required: true },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
}, { _id: true });
const pricingSchema = new mongoose_1.Schema({
    subtotal: { type: Number, required: true, default: 0 },
    shippingCharge: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
}, { _id: false });
const paymentSchema = new mongoose_1.Schema({
    method: {
        type: String,
        enum: ["cod", "mobile", "bank"],
        required: true,
        default: "cod",
    },
    status: {
        type: String,
        enum: Object.values(paymentStatus),
        required: false,
        default: paymentStatus.pending,
    },
    transactionId: { type: String, required: false, default: null },
}, { _id: false });
const feUserSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, ref: "fe_user", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    user: { type: feUserSchema, required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [{ type: orderItemSchema, required: true }],
    shippingAddress: { type: shippingAddressSchema, required: true },
    pricing: { type: pricingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    orderNotes: { type: String, required: false, default: null },
    orderStatus: {
        type: String,
        enum: Object.values(orderStatus),
        required: false,
        default: orderStatus.pending,
    },
}, { timestamps: true });
// Pre-save hook to generate order number (disabled - now handled in controller)
orderSchema.pre("save", async function (next) {
    // Order number is now generated in the controller
    next();
});
orderSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;
    return obj;
};
const orderModel = (0, mongoose_1.model)("fe_order", orderSchema);
exports.OrderModel = orderModel;
