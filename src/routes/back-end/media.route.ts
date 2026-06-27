import express from "express";
const router = express.Router();

import { isAuthenticated } from "@middlewares/auth.middleware";
import { uploadFile } from "@controllers/back-end/media.controller";
import uploadMiddleware from "@middlewares/upload.middleware";

const upload = uploadMiddleware("myMedia");

router.post("/upload", isAuthenticated, upload.array("file"), uploadFile);

export default router;