import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import { WorkspaceProductModel } from "@models/feWorkspaceProduct.model";

const getCategoryWise = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;

  // Find all products where category._id matches the provided _id
  const products = await WorkspaceProductModel.find({
    "category._id": _id,
    status: "active",
  }).lean();

  // Return the product list
  return apiResponse(res, httpStatus.OK, { data: products });
});

export { getCategoryWise };
