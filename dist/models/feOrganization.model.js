"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStatus = exports.OrganizationModel = void 0;
const mongoose_1 = require("mongoose");
const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});
exports.OrganizationStatus = documentStatus;
const documentSchema = new mongoose_1.Schema({
    name: { type: String, required: true, },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_organization", documentSchema);
exports.OrganizationModel = documentModel;
