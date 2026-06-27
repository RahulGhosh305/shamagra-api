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
exports.CrmAcquisitionFormStatus = exports.CrmAcquisitionFormModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});
exports.CrmAcquisitionFormStatus = documentStatus;
const documentFormFieldType = Object.freeze({
    text: 'text',
    email: 'email',
    number: 'number',
    enum: 'enum',
    boolean: 'boolean',
    dropdown: 'dropdown',
    date: 'date',
    datetime: 'datetime',
    media: 'media',
    file: 'file',
});
const categorySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_ws_category' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
}, { _id: false });
const subCategorySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_ws_sub_category' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
}, { _id: false });
const organizationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
}, { _id: false });
const brandSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: false, ref: 'fe_ws_brand' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
}, { _id: false });
const fieldDropdownSchema = new mongoose_1.Schema({
    label: { type: String, required: false, default: null },
    value: { type: String, required: false, default: null },
}, { _id: false });
const formStepsFieldsSchema = new mongoose_1.Schema({
    title: { type: String, required: false, default: null },
    type: { type: String, enum: Object.values(documentFormFieldType), required: false, default: documentFormFieldType.text },
    dropdowns: [{ type: fieldDropdownSchema, required: false, default: [] }],
    isRequired: { type: Boolean, required: false, default: false },
    isLongText: { type: Boolean, required: false, default: false },
    isMultipleFile: { type: Boolean, required: false, default: false },
    isMultipleMedia: { type: Boolean, required: false, default: false },
    isMultipleDropdown: { type: Boolean, required: false, default: false },
    position: { type: Number, required: false, default: 0 },
}, { timestamps: true });
const formStepsSchema = new mongoose_1.Schema({
    title: { type: String, required: false, default: null },
    fields: [{ type: formStepsFieldsSchema, required: false, default: [] }],
    position: { type: Number, required: false, default: 0 },
}, { timestamps: true });
const formSchema = new mongoose_1.Schema({
    steps: [{ type: formStepsSchema, required: false, default: [] }],
}, { timestamps: true });
const documentSchema = new mongoose_1.Schema({
    organization: { type: organizationSchema, required: false, default: () => ({}) },
    categories: [{ type: categorySchema, required: false, default: [] }],
    subCategories: [{ type: subCategorySchema, required: false, default: [] }],
    brands: [{ type: brandSchema, required: false, default: [] }],
    name: { type: String, required: true },
    photo: { type: String, required: false, default: null },
    commission: { type: Number, required: false, default: null },
    description: { type: String, required: false, default: null },
    form: { type: formSchema, required: false, default: () => ({}) },
    status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
    expiredAt: { type: Date, required: false, default: null },
}, { timestamps: true });
documentSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};
const documentModel = (0, mongoose_1.model)("fe_crm_acquisition_form", documentSchema);
exports.CrmAcquisitionFormModel = documentModel;
