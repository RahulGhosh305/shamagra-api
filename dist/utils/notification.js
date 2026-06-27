"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const feUserNotification_model_1 = require("@models/feUserNotification.model");
const generateNotification = async (params) => {
    const content = { dataId: params.dataId, title: params.title, description: params.description };
    if (params.user)
        Object.assign(content, { receiver: params.user });
    if (params.thumbnail)
        Object.assign(content, { thumbnail: params.thumbnail });
    if (params.type)
        Object.assign(content, { type: params.type });
    if (params.isRedirect)
        Object.assign(content, { isRedirect: params.isRedirect });
    console.log(content);
    const newNotification = new feUserNotification_model_1.UserNotificationModel(content);
    const err = newNotification.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return null;
    }
    const save = await newNotification.save();
    if (save)
        return save;
    return null;
};
exports.generateNotification = generateNotification;
