"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawPayment = exports.updatePaymentMethod = exports.addPaymentMethod = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const addPaymentMethod = (0, validate_1.validate)({
    body: joi_1.default.object({
        type: joi_1.default.string().required(),
        mfsName: joi_1.default.string().allow(null, '').required(),
        mfsNumber: joi_1.default.string().allow(null, '').required(),
        bankName: joi_1.default.string().allow(null, '').required(),
        bankBranch: joi_1.default.string().allow(null, '').required(),
        bankAcc: joi_1.default.string().allow(null, '').required(),
        bankAcHolder: joi_1.default.string().allow(null, '').required(),
    }),
});
exports.addPaymentMethod = addPaymentMethod;
const updatePaymentMethod = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        type: joi_1.default.string().required(),
        mfsName: joi_1.default.string().allow(null, '').required(),
        mfsNumber: joi_1.default.string().allow(null, '').required(),
        bankName: joi_1.default.string().allow(null, '').required(),
        bankBranch: joi_1.default.string().allow(null, '').required(),
        bankAcc: joi_1.default.string().allow(null, '').required(),
        bankAcHolder: joi_1.default.string().allow(null, '').required(),
    }),
});
exports.updatePaymentMethod = updatePaymentMethod;
const withdrawPayment = (0, validate_1.validate)({
    body: joi_1.default.object({
        paymentMethodId: joi_1.default.string().required(),
    }),
});
exports.withdrawPayment = withdrawPayment;
