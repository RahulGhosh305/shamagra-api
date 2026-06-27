"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActivity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const beUserActivity_model_1 = require("@models/beUserActivity.model");
const generateActivity = async (params) => {
    const content = { dataId: params.dataId, permission: params.permission, title: params.title };
    if (params.user)
        Object.assign(content, { user: params.user });
    if (params.description)
        Object.assign(content, { description: params.description });
    if (params.reason)
        Object.assign(content, { reason: params.reason });
    const newActivity = new beUserActivity_model_1.UserActivityModel(content);
    const err = newActivity.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return null;
    }
    const save = await newActivity.save();
    if (save)
        return save;
    return null;
};
exports.generateActivity = generateActivity;
