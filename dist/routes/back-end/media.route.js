"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = require("@middlewares/auth.middleware");
const media_controller_1 = require("@controllers/back-end/media.controller");
const upload_middleware_1 = __importDefault(require("@middlewares/upload.middleware"));
const upload = (0, upload_middleware_1.default)("myMedia");
router.post("/upload", auth_middleware_1.isAuthenticated, upload.array("file"), media_controller_1.uploadFile);
exports.default = router;
