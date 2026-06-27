"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsBlogStatus = exports.WsBlogModel = void 0;
const mongoose_1 = require("mongoose");
const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});
exports.WsBlogStatus = documentStatus;
const documentPages = Object.freeze({
    landing: 'landing',
    null: null,
});
const documentPositions = Object.freeze({
    landingSlider: 'landingSlider'
});
const documentSchema = new mongoose_1.Schema({
    name: { type: String, required: true, },
    photo: { type: String, required: false, default: null, },
    description: { type: String, required: true, },
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_ws_blog", documentSchema);
exports.WsBlogModel = documentModel;
