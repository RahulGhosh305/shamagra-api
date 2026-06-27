"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmPermissionModel = void 0;
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    displayName: { type: String, required: true },
    group: { type: String, required: true },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("be_um_permission", documentSchema);
exports.UmPermissionModel = documentModel;
