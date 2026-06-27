import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import validationError from "@utils/validationError";

import {
  WorkspaceProductModel,
  WorkspaceProductStatus,
} from "@models/feWorkspaceProduct.model";
import { WsCategoryModel } from "@models/feWsCategory.model";
import { OrderModel, OrderStatus } from "@models/feOrder.model";

// GET ALL PRODUCTS
const getProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await WorkspaceProductModel.find({
    status: { $ne: WorkspaceProductStatus.deleted },
  })
    .skip(
      parseInt(req.query.perPage as string) *
      (parseInt(req.query.page as string) - 1),
    )
    .limit(parseInt(req.query.perPage as string))
    .sort({ createdAt: -1 });

  const total = await WorkspaceProductModel.countDocuments({
    status: { $ne: WorkspaceProductStatus.deleted },
  });
  const response = {
    page: parseInt(req.query.page as string),
    perPage: parseInt(req.query.perPage as string),
    total,
    data: products,
  };
  return apiResponse(res, httpStatus.OK, { data: response });
});

// GET SINGLE PRODUCT
const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const productInfo = await WorkspaceProductModel.findOne({ _id });
  return apiResponse(res, httpStatus.OK, { data: productInfo });
});

// ADD PRODUCT
const addProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    productCode,
    title,
    subTitle,
    author,
    descriptionShort,
    authorDescription,
    descriptionLong,
    originalPrice,
    discountPrice,
    discountPercentage,
    averageScore,
    totalReviews,
    status,
    categoryId,
    format,
    totalPages,
    publishDate,
    language,
    originCountry,
    dimensions,
    weight,
    sku,
    features,
    photo,
    file,
    freeShippingThreshold,
    returnPolicy,
    secureShopping,
  } = req.body;

  const category = await WsCategoryModel.findOne(
    { _id: categoryId },
    { name: true },
  );

  const newProduct = new WorkspaceProductModel({
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
  if (err instanceof mongoose.Error) {
    const validation = await validationError.requiredCheck(err.errors);
    return apiResponse(
      res,
      httpStatus.UNPROCESSABLE_ENTITY,
      { message: "Validation Required" },
      validation,
    );
  }
  const save = await newProduct.save();
  return apiResponse(res, httpStatus.CREATED, {
    data: save,
    message: "Product Created",
  });
});

// UPDATE PRODUCT
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    productCode,
    title,
    subTitle,
    author,
    descriptionShort,
    authorDescription,
    descriptionLong,
    originalPrice,
    discountPrice,
    discountPercentage,
    averageScore,
    totalReviews,
    status,
    categoryId,
    format,
    totalPages,
    publishDate,
    language,
    originCountry,
    dimensions,
    weight,
    sku,
    features,
    photo,
    file,
    freeShippingThreshold,
    returnPolicy,
    secureShopping,
  } = req.body;

  const category = await WsCategoryModel.findOne(
    { _id: categoryId },
    { name: true },
  );

  await WorkspaceProductModel.updateOne(
    { _id: req.params._id },
    {
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
    },
  );
  return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated." });
});

// DELETE PRODUCT
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await WorkspaceProductModel.updateOne(
    { _id: req.params._id },
    { $set: { status: WorkspaceProductStatus.deleted } },
  );
  return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

// GET ALL ORDERS
const getOrders = catchAsync(async (req: Request, res: Response) => {
  const query = { orderStatus: { $ne: OrderStatus.deleted } };

  const orders = await OrderModel.find(query)
    .skip(
      parseInt(req.query.perPage as string) *
      (parseInt(req.query.page as string) - 1),
    )
    .limit(parseInt(req.query.perPage as string))
    .sort({ createdAt: -1 });

  const total = await OrderModel.countDocuments(query);
  const response = {
    page: parseInt(req.query.page as string),
    perPage: parseInt(req.query.perPage as string),
    total,
    data: orders,
  };
  return apiResponse(res, httpStatus.OK, { data: response });
});

// GET SINGLE ORDER
const getOrder = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const orderInfo = await OrderModel.findOne({ _id });
  return apiResponse(res, httpStatus.OK, { data: orderInfo });
});

// ADD ORDER
const addOrder = catchAsync(async (req: Request, res: Response) => {
  const {
    user,
    items,
    shippingAddress,
    pricing,
    payment,
    orderNotes,
    orderStatus,
  } = req.body;

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const newOrder = new OrderModel({
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
  if (err instanceof mongoose.Error) {
    const validation = await validationError.requiredCheck(err.errors);
    return apiResponse(
      res,
      httpStatus.UNPROCESSABLE_ENTITY,
      { message: "Validation Required" },
      validation,
    );
  }
  const save = await newOrder.save();
  return apiResponse(res, httpStatus.CREATED, {
    data: save,
    message: "Order Created",
  });
});

// UPDATE ORDER
const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderStatus } = req.body;

  await OrderModel.updateOne(
    { _id: req.params._id },
    {
      $set: {
        orderStatus,
      },
    },
  );
  return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated." });
});

// DELETE ORDER (CANCEL ORDER)
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await OrderModel.updateOne(
    { _id: req.params._id },
    { $set: { orderStatus: OrderStatus.deleted } },
  );
  return apiResponse(res, httpStatus.ACCEPTED, { message: "Order deleted" });
});

export {
  // Product controllers
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  // Order controllers
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
