// File Upload Configuration 
import config from "@config/config";
import path from "path";

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Configuration
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: any) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        return {
            folder: "uploads",
            public_id: `${baseName}_${Date.now()}`,
        };
    },
});

export { storage, cloudinary };