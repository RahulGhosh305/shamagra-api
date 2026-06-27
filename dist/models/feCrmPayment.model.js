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
exports.CrmPaymentStatus = exports.CrmPaymentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({
    generated: 'generated',
    withdrawn: 'withdrawn',
    disbursed: 'disbursed',
});
exports.CrmPaymentStatus = documentStatus;
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
    invoiceNo: { type: String, required: false, default: null },
    leadId: { type: mongoose_1.default.Types.ObjectId, required: false, default: null },
    amount: { type: Number, required: true, default: null },
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.generated },
}, { timestamps: true });
documentSchema.pre("save", async function (next) {
    let payment = this;
    const prevPayment = await documentModel.find().limit(1).sort({ $natural: -1 });
    let prevInvoiceNo = null;
    if (prevPayment && prevPayment.length)
        prevInvoiceNo = prevPayment[0].invoiceNo.split('_');
    if (payment.isModified("invoiceNo"))
        payment.invoiceNo = prevInvoiceNo ? `INV_${parseInt(prevInvoiceNo[1]) + 1}` : `INV_1`;
    next();
});
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_crm_payment", documentSchema);
exports.CrmPaymentModel = documentModel;
