import { Request, Response } from "express";
import httpStatus from "http-status";
import apiResponse from "@utils/apiResponse";
import catchAsync from "@utils/catchAsync";

// Cloudinary Upload File
const uploadFile = catchAsync(async (req: Request, res: Response) => {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const fileData = req.files.map((f: any) => ({ url: f.path, public_id: f.filename }));
        return apiResponse(res, httpStatus.OK, { data: fileData });
    } else if (req.file) {
        return apiResponse(res, httpStatus.OK, { data: { url: req.file.path, public_id: req.file.filename } });
    } else {
        return apiResponse(res, httpStatus.BAD_REQUEST, { message: "No file(s) uploaded" });
    }
});

export {
    uploadFile
};
