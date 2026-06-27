import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import { OrderModel, OrderStatus, PaymentStatus } from "@models/feOrder.model";
import { WorkspaceProductModel } from "@models/feWorkspaceProduct.model";

interface OrderRequestBody {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    companyName?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    district: string;
    thana: string;
    country: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  payment: {
    method: "cod" | "mobile" | "bank";
    transactionId?: string;
  };
  orderNotes?: string;
}

const addOrder = catchAsync(async (req: Request, res: Response) => {
  const { user, items, shippingAddress, payment, orderNotes } =
    req.body as OrderRequestBody;

  // Validation
  if (!user || !user._id) {
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "User information is required",
    });
  }

  if (!items || items.length === 0) {
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "Order must contain at least one item",
    });
  }

  if (!shippingAddress) {
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "Shipping address is required",
    });
  }

  if (!payment || !payment.method) {
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "Payment method is required",
    });
  }

  if (payment.method === "mobile" && !payment.transactionId) {
    return apiResponse(res, httpStatus.BAD_REQUEST, {
      message: "Transaction ID is required for mobile banking",
    });
  }

  try {
    // Validate product IDs before querying
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return apiResponse(res, httpStatus.BAD_REQUEST, {
          message: `Invalid product ID format: ${item.productId}`,
        });
      }
    }

    // Get product details for each item
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await WorkspaceProductModel.findById(item.productId);

      if (!product) {
        return apiResponse(res, httpStatus.BAD_REQUEST, {
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const unitPrice =
        product.pricing.discountPrice || product.pricing.originalPrice;
      const itemSubtotal = unitPrice * item.quantity;

      orderItems.push({
        productId: new mongoose.Types.ObjectId(item.productId),
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
    const lastOrder = await OrderModel.find().limit(1).sort({ $natural: -1 });
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
    const newOrder = new OrderModel({
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
        status:
          payment.method === "cod"
            ? PaymentStatus.pending
            : PaymentStatus.pending,
        transactionId: payment.transactionId || null,
      },
      orderNotes,
      orderStatus: OrderStatus.pending,
    });

    await newOrder.save();

    return apiResponse(res, httpStatus.CREATED, {
      message: "Order created successfully",
      data: newOrder.toJSON(),
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return apiResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
      message: error.message || "Failed to create order",
    });
  }
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  // For now, return all orders (you might want to add user filtering later)
  const orders = await OrderModel.find({}).sort({
    createdAt: -1,
  });

  return apiResponse(res, httpStatus.OK, { data: orders });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const query = mongoose.Types.ObjectId.isValid(orderId)
    ? { $or: [{ _id: orderId }, { orderNumber: orderId }] }
    : { orderNumber: orderId };

  const order = await OrderModel.findOne(query);

  if (!order) {
    return apiResponse(res, httpStatus.NOT_FOUND, {
      message: "Order not found",
    });
  }

  return apiResponse(res, httpStatus.OK, { data: order });
});

export { addOrder, getOrders, getOrderById };
