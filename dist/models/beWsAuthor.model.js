"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAuthorStatus = exports.WsAuthorModel = void 0;
const mongoose_1 = require("mongoose");
const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});
exports.WsAuthorStatus = documentStatus;
const documentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    position: { type: Number, default: 0 },
    isDisabled: { type: Boolean, default: false },
    status: { type: String, default: documentStatus.active, enum: Object.values(documentStatus) },
}, {
    timestamps: true,
    collection: 'be_ws_authors'
});
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("be_ws_author", documentSchema);
exports.WsAuthorModel = documentModel;
