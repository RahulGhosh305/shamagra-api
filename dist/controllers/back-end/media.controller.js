"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
// Cloudinary Upload File
const uploadFile = (0, catchAsync_1.default)(async (req, res) => {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const fileData = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
        return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: fileData });
    }
    else if (req.file) {
        return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: { url: req.file.path, public_id: req.file.filename } });
    }
    else {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, { message: "No file(s) uploaded" });
    }
});
exports.uploadFile = uploadFile;
