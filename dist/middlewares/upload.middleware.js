"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Cloudinary Upload Middleware
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinaryConfig_1 = require("@config/cloudinaryConfig");
function uploadMiddleware(folderName) {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinaryConfig_1.cloudinary,
        params: (req, file) => {
            const folderPath = `${folderName.trim()}`; // Update the folder path here
            const fileExtension = path_1.default.extname(file.originalname).substring(1);
            const publicId = `${file.fieldname}-${Date.now()}`;
            return {
                folder: folderPath,
                public_id: publicId,
                format: fileExtension,
            };
        },
    });
    return (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
        },
    });
}
exports.default = uploadMiddleware;
