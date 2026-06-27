"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = exports.addOrder = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feOrder_model_1 = require("@models/feOrder.model");
const feWorkspaceProduct_model_1 = require("@models/feWorkspaceProduct.model");
const addOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { user, items, shippingAddress, payment, orderNotes } = req.body;
    // Validation
    if (!user || !user._id) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "User information is required",
        });
    }
    if (!items || items.length === 0) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Order must contain at least one item",
        });
    }
    if (!shippingAddress) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Shipping address is required",
        });
    }
    if (!payment || !payment.method) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Payment method is required",
        });
    }
    if (payment.method === "mobile" && !payment.transactionId) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Transaction ID is required for mobile banking",
        });
    }
    try {
        // Validate product IDs before querying
        for (const item of items) {
            if (!mongoose_1.default.Types.ObjectId.isValid(item.productId)) {
                return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
                    message: `Invalid product ID format: ${item.productId}`,
                });
            }
        }
        // Get product details for each item
        const orderItems = [];
        let subtotal = 0;
        for (const item of items) {
            const product = await feWorkspaceProduct_model_1.WorkspaceProductModel.findById(item.productId);
            if (!product) {
                return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
                    message: `Product with ID ${item.productId} not found`,
                });
            }
            const unitPrice = product.pricing.discountPrice || product.pricing.originalPrice;
            const itemSubtotal = unitPrice * item.quantity;
            orderItems.push({
                productId: new mongoose_1.default.Types.ObjectId(item.productId),
                productTitle: product.product.title,
                productCode: product.product.productCode,
                quantity: item.quantity,
                unitPrice,
                subtotal: itemSubtotal,
            });
            subtotal += itemSubtotal;
        }
        // Calculate pricing (you can add tax and shipping logic here)
        const shippingCharge = subtotal > 500 ? 0 : 50; // Free shipping for orders over 500
        const taxAmount = Math.round(subtotal * 0.05); // 5% tax
        const totalAmount = subtotal + shippingCharge + taxAmount;
        // Generate order number
        const lastOrder = await feOrder_model_1.OrderModel.find().limit(1).sort({ $natural: -1 });
        let orderNum = 1;
        if (lastOrder && lastOrder.length > 0) {
            const lastOrderNum = lastOrder[0].orderNumber;
            if (lastOrderNum && lastOrderNum.startsWith("ORD_")) {
                const numPart = lastOrderNum.split("ORD_")[1];
                orderNum = parseInt(numPart) + 1;
            }
        }
        const orderNumber = `ORD_${orderNum}`;
        // Create order
        const newOrder = new feOrder_model_1.OrderModel({
            user: {
                _id: user._id,
                firstName: user.firstName || shippingAddress.firstName,
                lastName: user.lastName || shippingAddress.lastName,
                email: user.email || shippingAddress.email,
                phone: user.phone || shippingAddress.phone,
            },
            orderNumber,
            items: orderItems,
            shippingAddress,
            pricing: {
                subtotal,
                shippingCharge,
                taxAmount,
                totalAmount,
            },
            payment: {
                method: payment.method,
                status: payment.method === "cod"
                    ? feOrder_model_1.PaymentStatus.pending
                    : feOrder_model_1.PaymentStatus.pending,
                transactionId: payment.transactionId || null,
            },
            orderNotes,
            orderStatus: feOrder_model_1.OrderStatus.pending,
        });
        await newOrder.save();
        return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, {
            message: "Order created successfully",
            data: newOrder.toJSON(),
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return (0, apiResponse_1.default)(res, http_status_1.default.INTERNAL_SERVER_ERROR, {
            message: error.message || "Failed to create order",
        });
    }
});
exports.addOrder = addOrder;
const getOrders = (0, catchAsync_1.default)(async (req, res) => {
    // For now, return all orders (you might want to add user filtering later)
    const orders = await feOrder_model_1.OrderModel.find({}).sort({
        createdAt: -1,
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: orders });
});
exports.getOrders = getOrders;
const getOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const query = mongoose_1.default.Types.ObjectId.isValid(orderId)
        ? { $or: [{ _id: orderId }, { orderNumber: orderId }] }
        : { orderNumber: orderId };
    const order = await feOrder_model_1.OrderModel.findOne(query);
    if (!order) {
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_FOUND, {
            message: "Order not found",
        });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: order });
});
exports.getOrderById = getOrderById;
