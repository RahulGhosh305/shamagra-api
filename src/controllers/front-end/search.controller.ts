import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import {
  WorkspaceProductModel,
  WorkspaceProductStatus,
} from "@models/feWorkspaceProduct.model";

const escapeRegex = (text: string) => {
  return text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const { q, category, author, price, page, limit, sort } = req.query;

  const conditions: any = { status: WorkspaceProductStatus.active };

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

  let sortObj: any = { createdAt: -1 };
  if (String(price) === "LowToHigh") {
    sortObj = { "pricing.discountPrice": 1 };
  } else if (String(price) === "HighToLow") {
    sortObj = { "pricing.discountPrice": -1 };
  } else if (sort) {
    // allow custom sort like `price:asc` or `price:desc` or `createdAt:desc`
    const s = String(sort).split(":");
    if (s.length === 2) {
      const key = s[0];
      const dir = s[1].toLowerCase() === "asc" ? 1 : -1;
      sortObj = { [key]: dir };
    }
  }

  const total = await WorkspaceProductModel.countDocuments(conditions);
  const items = await WorkspaceProductModel.find(conditions)
    .skip(skip)
    .limit(perPage)
    .sort(sortObj)
    .lean();

  return apiResponse(res, httpStatus.OK, {
    data: { items, total, page: pageNum, limit: perPage },
  });
});

export { searchProducts };
