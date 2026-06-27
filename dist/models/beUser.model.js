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
exports.UserIdentityType = exports.UserGender = exports.UserStatus = exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({ active: 'active', inactive: 'inactive', deleted: 'deleted' });
exports.UserStatus = documentStatus;
const documentGender = Object.freeze({ male: 'male', female: 'female' });
exports.UserGender = documentGender;
const documentIdentityType = Object.freeze({ nid: 'nid', passport: 'passport', birthCertificate: 'birth_certificate' });
exports.UserIdentityType = documentIdentityType;
const roleSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'be_um_role' },
    name: { type: String, required: false, default: null }
}, { _id: false });
const departmentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'be_um_department' },
    name: { type: String, required: false, default: null }
}, { _id: false });
const teamSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'be_um_team' },
    name: { type: String, required: false, default: null }
}, { _id: false });
const accessSchema = new mongoose_1.Schema({
    inTime: { type: String, required: false, default: null },
    outTime: { type: String, required: false, default: null },
    ip: { type: String, required: false, default: null },
    accessWithoutIp: { type: Boolean, required: false, default: false },
}, { _id: false });
const identitySchema = new mongoose_1.Schema([{
        type: { type: String, enum: Object.values(documentIdentityType), required: false, default: null },
        identity: { type: String, required: false, default: null },
    }, { _id: false }]);
const personalSchema = new mongoose_1.Schema({
    dateOfBirth: { type: Date, required: false, default: null },
    birthPlace: { type: String, required: false, default: null },
    bloodGroup: { type: String, required: false, default: null },
    fathersName: { type: String, required: false, default: null },
    fathersPhone: { type: String, required: false, default: null },
    fathersOccupation: { type: String, required: false, default: null },
    mothersName: { type: String, required: false, default: null },
    mothersPhone: { type: String, required: false, default: null },
    mothersOccupation: { type: String, required: false, default: null },
    identity: { type: identitySchema, required: false },
    religion: { type: String, required: false, default: null },
    presentAddress: { type: String, required: false, default: null },
    permanentAddress: { type: String, required: false, default: null },
}, { _id: false });
const emergencySchema = new mongoose_1.Schema([{
        name: { type: String, required: false, default: null },
        number: { type: String, required: false, default: null },
        relation: { type: String, required: false, default: null },
        address: { type: String, required: false, default: null },
    }, { _id: false }]);
const officeSchema = new mongoose_1.Schema({
    designation: { type: String, required: false, default: null },
    joiningDate: { type: Date, required: false, default: null },
    resignationDate: { type: Date, required: false, default: null },
    lastWorkingDate: { type: Date, required: false, default: null },
}, { _id: false });
const vendorOrganizationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
}, { _id: false });
const vendorSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_user' },
    isVendor: { type: Boolean, required: false, default: false },
    organization: { type: vendorOrganizationSchema, required: false, default: () => ({}) },
    designation: { type: String, required: false, default: null },
    employeeId: { type: String, required: false, default: null },
    department: { type: String, required: false, default: null },
    overview: { type: String, required: false, default: null },
    status: { type: String, required: false, default: null },
}, { _id: false });
const documentSchema = new mongoose_1.Schema({
    role: { type: roleSchema, required: false, default: () => ({}) },
    department: { type: departmentSchema, required: false, default: () => ({}) },
    team: { type: teamSchema, required: false, default: () => ({}) },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    phone: { type: String, required: false, default: null },
    gender: { type: String, enum: Object.values(documentGender), required: false, default: documentGender.male },
    photo: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, validate: { validator: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value), message: "Invalid email format", }, },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, },
    password: { type: String, required: true, },
    personal: { type: personalSchema, required: false, default: () => ({}) },
    emergency: { type: emergencySchema, required: false, default: () => ({}) },
    office: { type: officeSchema, required: false, default: () => ({}) },
    access: { type: accessSchema, required: false, default: () => ({}) },
    vendor: { type: vendorSchema, required: false, default: () => ({}) },
    superAdmin: { type: Boolean, required: true, },
    status: { type: String, enum: Object.values(documentStatus), default: documentStatus.active },
}, { timestamps: true });
documentSchema.pre("save", async function (next) {
    let user = this;
    if (!user.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hashSync(user.password, salt);
    return next();
});
documentSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt_1.default.compare(candidatePassword, user.password).catch(() => false);
};
documentSchema.statics.isUnique = async function (username, email) {
    const user = await this.findOne({
        $or: [{ email }, { username }]
    });
    if (!user) {
        return true;
    }
    else if (user.username === username && user.email === email) {
        return { username, email };
    }
    else if (user.email === email) {
        return { email };
    }
    else if (user.username === username) {
        return { username };
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
const documentModel = mongoose_1.default.model("be_user", documentSchema);
exports.UserModel = documentModel;
