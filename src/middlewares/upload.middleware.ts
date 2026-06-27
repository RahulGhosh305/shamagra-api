// Cloudinary Upload Middleware
import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "@config/cloudinaryConfig";

function uploadMiddleware(folderName: string) {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req: any, file: any) => {
            const folderPath = `${folderName.trim()}`; // Update the folder path here
            const fileExtension = path.extname(file.originalname).substring(1);
            const publicId = `${file.fieldname}-${Date.now()}`;

            return {
                folder: folderPath,
                public_id: publicId,
                format: fileExtension,
            };
        },
    });

    return multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
        },
    });
}

export default uploadMiddleware;