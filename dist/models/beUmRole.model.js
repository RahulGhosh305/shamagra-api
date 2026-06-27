"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmRoleStatus = exports.UmRoleModel = void 0;
const mongoose_1 = require("mongoose");
const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});
exports.UmRoleStatus = documentStatus;
const documentSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: false, default: null },
    isSystemDefined: { type: Boolean, required: false, default: false },
    permissions: [{ type: String, required: false, default: [] }],
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("be_um_role", documentSchema);
exports.UmRoleModel = documentModel;
