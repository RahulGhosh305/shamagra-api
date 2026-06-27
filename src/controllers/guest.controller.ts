import {Request, Response} from "express";
import httpStatus from "http-status";
import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

const baseUrl = catchAsync(async (req: Request, res: Response) => {
    return apiResponse(res, httpStatus.OK, {message: "welcome to home page."});
});

export {
    baseUrl,
}