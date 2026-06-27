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
exports.UserPaymentMethodModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const documentType = Object.freeze({ mfs: 'mfs', bank: 'bank' });
const countrySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_country', default: null },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
}, { _id: false });
const feUserPhoneSchema = new mongoose_1.Schema({
    phone: { type: String, required: false, default: null },
    country: { type: countrySchema, required: true, default: () => ({}) },
}, { _id: false });
const feUserSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    phone: { type: feUserPhoneSchema, required: false, default: () => ({}) },
    photo: { type: String, required: false, default: null },
}, { _id: false });
const documentSchema = new mongoose_1.Schema({
    user: { type: feUserSchema, required: false, default: () => ({}) },
    type: { type: String, enum: Object.values(documentType), required: true },
    mfsName: { type: String, required: false, default: null },
    mfsNumber: { type: String, required: false, default: null },
    bankName: { type: String, required: false, default: null },
    bankBranch: { type: String, required: false, default: null },
    bankAcc: { type: String, required: false, default: null },
    bankAcHolder: { type: String, required: false, default: null },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_user_payment_method", documentSchema);
exports.UserPaymentMethodModel = documentModel;
