import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import {
  WorkspaceProductModel,
  WorkspaceProductStatus,
} from "@models/feWorkspaceProduct.model";
import { WsBlogModel, WsBlogStatus } from "@models/feWsBlog.model";
import { ReviewModel } from "@models/feReview.model";

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { limit, category, author, price } = req.query;

  const conditions: any = {
    status: WorkspaceProductStatus.active,
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

  const sort: any = { createdAt: -1 };
  if (price === "LowToHigh") {
    sort["pricing.discountPrice"] = 1;
  } else if (price === "HighToLow") {
    sort["pricing.discountPrice"] = -1;
  }

  const products = await WorkspaceProductModel.find(conditions)
    .limit(Number(limit) || 0)
    .sort(sort);

  return apiResponse(res, httpStatus.OK, { data: products });
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const product = await WorkspaceProductModel.findOne({ _id }).lean();
  return apiResponse(res, httpStatus.OK, { data: product });
});

const getBlogs = catchAsync(async (req: Request, res: Response) => {
  const blogs = await WsBlogModel.find({ status: WsBlogStatus.active }).lean();
  return apiResponse(res, httpStatus.OK, { data: blogs });
});

const getBlog = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const blog = await WsBlogModel.findOne({ _id }).lean();
  return apiResponse(res, httpStatus.OK, { data: blog });
});

// ADD REVIEW
const addReview = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params; // Product ID
  const { rating, comment } = req.body;
  const user = (req as any).user;

  if (!user || !user._id) {
    return apiResponse(res, httpStatus.UNAUTHORIZED, { message: "Please login to review." });
  }

  const userId = user._id;
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "Anonymous";

  const existingReview = await ReviewModel.findOne({ productId: _id, userId });
  let actionMessage = "Review added successfully";

  if (existingReview) {
    if (existingReview.rating === rating) {
      // Toggle off (remove review if clicked the exact same rating)
      await ReviewModel.deleteOne({ _id: existingReview._id });
      actionMessage = "Review removed";
    } else {
      // Update existing review
      existingReview.rating = rating;
      if (comment !== undefined) existingReview.comment = comment;
      await existingReview.save();
      actionMessage = "Review updated successfully";
    }
  } else {
    // Create new review
    const newReview = new ReviewModel({
      productId: _id,
      userId,
      userName,
      rating,
      comment,
    });
    await newReview.save();
  }

  // Recalculate average rating
  const reviews = await ReviewModel.find({ productId: _id });
  const totalReviews = reviews.length;
  const averageScore = totalReviews > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0;

  await WorkspaceProductModel.updateOne(
    { _id },
    {
      $set: {
        "rating.averageScore": averageScore,
        "rating.totalReviews": totalReviews,
      },
    }
  );

  return apiResponse(res, httpStatus.OK, { message: actionMessage });
});

export { getProducts, getProduct, getBlogs, getBlog, addReview };
