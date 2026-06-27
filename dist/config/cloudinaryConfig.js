"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.storage = void 0;
// File Upload Configuration 
const config_1 = __importDefault(require("@config/config"));
const path_1 = __importDefault(require("path"));
const cloudinary = require("cloudinary").v2;
exports.cloudinary = cloudinary;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Cloudinary Configuration
cloudinary.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret,
});
// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext);
        return {
            folder: "uploads",
            public_id: `${baseName}_${Date.now()}`,
        };
    },
});
exports.storage = storage;
