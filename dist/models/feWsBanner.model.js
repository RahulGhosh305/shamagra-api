"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsBannerPositions = exports.WsBannerPages = exports.WsBannerStatus = exports.WsBannerModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({
    active: "active",
    inactive: "inactive",
    deleted: "deleted",
});
exports.WsBannerStatus = documentStatus;
const documentPages = Object.freeze({
    landing: "landing",
    null: null,
});
exports.WsBannerPages = documentPages;
const documentPositions = Object.freeze({
    heroSlider: "heroSlider",
    appDownload: "appDownload",
    footerBanner: "footerBanner",
});
exports.WsBannerPositions = documentPositions;
const documentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    page: {
        type: String,
        enum: Object.values(documentPages),
        required: false,
        default: null,
    },
    dataId: { type: mongoose_1.default.Types.ObjectId, required: false, default: null },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: Number, required: false, default: null },
    bannerPlace: {
        type: String,
        enum: Object.values(documentPositions),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(documentStatus),
        required: false,
        default: documentStatus.active,
    },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_ws_banner", documentSchema);
exports.WsBannerModel = documentModel;
