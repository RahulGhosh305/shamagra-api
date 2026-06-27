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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServicesStatus = exports.UserGender = exports.UserStatus = exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({ active: 'active', inactive: 'inactive', deleted: 'deleted' });
exports.UserStatus = documentStatus;
const documentGender = Object.freeze({ male: 'male', female: 'female', other: 'other', null: null });
exports.UserGender = documentGender;
const documentFileType = Object.freeze({ nid: 'nid', null: null });
const documentServicesStatus = Object.freeze({ requested: 'requested', rejected: 'rejected', approved: 'approved', null: null });
exports.UserServicesStatus = documentServicesStatus;
const fileSchema = new mongoose_1.Schema({
    name: { type: String, required: false, default: null },
    uid: { type: String, required: false, default: null },
    file: { type: String, required: false, default: null },
    type: { type: String, enum: Object.values(documentFileType), required: false, default: documentFileType.null }
}, { _id: false });
const otpSchema = new mongoose_1.Schema({
    otp: { type: String, required: false, default: null },
    verified: { type: Boolean, required: false, default: false }
}, { _id: false });
const organizationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
}, { _id: false });
const organizationBranchSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_organization_branch' },
    name: { type: String, required: false, default: null },
}, { _id: false });
const vendorSchema = new mongoose_1.Schema({
    isVendor: { type: Boolean, required: false, default: false },
    organization: { type: organizationSchema, required: false, default: () => ({}) },
    branch: { type: organizationBranchSchema, required: false, default: () => ({}) },
    designation: { type: String, required: false, default: null },
    employeeId: { type: String, required: false, default: null },
    department: { type: String, required: false, default: null },
    overview: { type: String, required: false, default: null },
    status: { type: String, enum: Object.values(documentServicesStatus), required: false, default: null }
}, { _id: false });
const servicesSchema = new mongoose_1.Schema({
    vendor: { type: vendorSchema, required: false, default: () => ({}) },
}, { _id: false });
const socialSchema = new mongoose_1.Schema({
    facebook: { type: String, required: false, default: null },
    linkedin: { type: String, required: false, default: null },
    instagram: { type: String, required: false, default: null },
    twitter: { type: String, required: false, default: null },
}, { _id: false });
const personalSchema = new mongoose_1.Schema({
    fathersName: { type: String, required: false, default: null },
    mothersName: { type: String, required: false, default: null },
    presentAddress: { type: String, required: false, default: null },
    permanentAddress: { type: String, required: false, default: null },
    occupation: { type: String, required: false, default: null },
    dateOfBirth: { type: Date, required: false, default: null },
    isMarried: { type: Boolean, required: false, default: false },
    spouseName: { type: String, required: false, default: null },
    nationality: { type: String, required: false, default: null },
    religion: { type: String, required: false, default: null },
    monthlyIncome: { type: Number, required: false, default: null },
    nid: { type: fileSchema, required: false, default: () => ({}) },
}, { _id: false });
const accountCloseSchema = new mongoose_1.Schema({
    isRequested: { type: Boolean, required: false, default: false },
    reason: { type: String, required: false, default: null },
}, { _id: false });
const documentSchema = new mongoose_1.Schema({
    userNo: { type: String, required: false, default: null, },
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    otp: { type: otpSchema, required: false, default: () => ({}) },
    password: { type: String, required: true },
    gender: { type: String, enum: Object.values(documentGender), required: false, default: documentGender.null },
    photo: { type: String, required: false, default: null },
    overview: { type: String, required: false, default: null },
    services: { type: servicesSchema, required: false, default: () => ({}) },
    social: { type: socialSchema, required: false, default: () => ({}) },
    personal: { type: personalSchema, required: false, default: () => ({}) },
    accountClose: { type: accountCloseSchema, required: false, default: () => ({}) },
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active }
}, { timestamps: true });
documentSchema.pre("save", async function (next) {
    var _a;
    // @ts-ignore
    let user = this;
    if (!user.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hashSync((_a = user.password) !== null && _a !== void 0 ? _a : "", salt);
    const prevUser = await documentModel.find().limit(1).sort({ $natural: -1 });
    let serialNumber = 1;
    if (prevUser.length > 0) {
        const prevUserNo = prevUser[0].userNo.split('-');
        serialNumber = parseInt(prevUserNo[1].slice(-5)) + 1;
    }
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    user.userNo = `DFL-${currentYear}${currentMonth}${serialNumber.toString().padStart(5, '0')}`;
    return next();
});
documentSchema.methods.comparePassword = async function (candidatePassword) {
    var _a;
    const user = this;
    return bcrypt_1.default.compare(candidatePassword, (_a = user.password) !== null && _a !== void 0 ? _a : "").catch(() => false);
};
documentSchema.statics.isUnique = async function (email, phone) {
    const user = await this.findOne({
        $or: [
            { email },
            { phone }
        ]
    }, { email: true, phone: true });
    if (!user) {
        return true;
    }
    else if (email && user.email === email) {
        return { email };
    }
    else if (phone && user.phone === phone) {
        return { phone };
    }
    return true;
};
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = mongoose_1.default.model("fe_user", documentSchema);
exports.UserModel = documentModel;
