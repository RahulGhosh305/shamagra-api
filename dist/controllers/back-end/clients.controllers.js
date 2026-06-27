"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getOrganization = exports.addOrganization = exports.getOrganizations = exports.addVendor = exports.getVendor = exports.getVendors = exports.addUser = exports.getUser = exports.getUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const feUser_model_1 = require("@models/feUser.model");
const beUser_model_1 = require("@models/beUser.model");
const feOrganization_model_1 = require("@models/feOrganization.model");
const feCrmPayment_model_1 = require("@models/feCrmPayment.model");
const feCrmAcquisitionLead_model_1 = require("@models/feCrmAcquisitionLead.model");
const feWsCountry_model_1 = require("@models/feWsCountry.model");
const beUmRole_model_1 = require("@models/beUmRole.model");
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const { cityIds, locationIds, createdAtFrom, createdAtTo, agentNumber } = req.query;
    const conditions = { status: { $ne: feUser_model_1.UserStatus.deleted } };
    if (cityIds)
        Object.assign(conditions, { "city._id": cityIds });
    if (locationIds)
        Object.assign(conditions, { "location._id": locationIds });
    if (agentNumber)
        Object.assign(conditions, { "phone.phone": agentNumber });
    if (createdAtFrom && typeof createdAtFrom === "string")
        Object.assign(conditions, { createdAt: { $gte: new Date(`${new Date(createdAtFrom).toLocaleDateString('fr-CA')}T00:00:00.0Z`) } });
    if (createdAtTo && typeof createdAtTo === "string")
        Object.assign(conditions, { createdAt: Object.assign(Object.assign({}, conditions.createdAt), { $lte: new Date(`${new Date(createdAtTo).toLocaleDateString('fr-CA')}T23:59:59.0Z`) }) });
    const users = await feUser_model_1.UserModel
        .find(conditions)
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 })
        .lean();
    const total = await feUser_model_1.UserModel.countDocuments(conditions);
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: users };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getUsers = getUsers;
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await feUser_model_1.UserModel
        .findOne({ _id: req.params._id })
        .lean();
    const transactions = await feCrmPayment_model_1.CrmPaymentModel.find({ "user._id": req.params._id }).lean();
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        Object.assign(transaction, { lead: await feCrmAcquisitionLead_model_1.CrmAcquisitionLeadModel.findOne({ _id: transaction.leadId }, { "acquisition.name": true }) });
    }
    if (user)
        Object.assign(user, { transactions });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: user });
});
exports.getUser = getUser;
const addUser = (0, catchAsync_1.default)(async (req, res) => {
    const { firstName, lastName, countryId, phone, gender, email } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true });
    let user = await feUser_model_1.UserModel.findOne({
        "phone.country._id": country === null || country === void 0 ? void 0 : country._id,
        "phone.phone": phone,
        status: feUser_model_1.UserStatus.active
    }, {
        firstName: true,
        lastName: true,
        photo: true,
    });
    if (user)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "This user already exists on the system!" });
    const newUser = new feUser_model_1.UserModel({ firstName, lastName, phone: { country: country, phone }, gender, email });
    const err = newUser.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const valid = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, valid);
    }
    const save = await newUser.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "User Created" });
});
exports.addUser = addUser;
const addVendor = (0, catchAsync_1.default)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { organizationId, userId, department, designation, employeeId, overview } = req.body;
    const organization = await feOrganization_model_1.OrganizationModel.findOne({ _id: organizationId }, { name: true }).lean();
    const update = await feUser_model_1.UserModel.updateOne({ _id: userId }, {
        "services.vendor.isVendor": true,
        "services.vendor.organization": organization,
        "services.vendor.department": department,
        "services.vendor.employeeId": employeeId,
        "services.vendor.designation": designation,
        "services.vendor.overview": overview,
        "services.vendor.status": feUser_model_1.UserServicesStatus.approved
    });
    let user = await feUser_model_1.UserModel.findOne({ _id: userId }).lean();
    const role = await beUmRole_model_1.UmRoleModel.findOne({ _id: "6555c72a669a5dbc8adc2d11", isSystemDefined: true }, { name: true });
    console.log(role);
    const newUser = new beUser_model_1.UserModel({
        firstName: (_a = user === null || user === void 0 ? void 0 : user.firstName) !== null && _a !== void 0 ? _a : "",
        lastName: (_b = user === null || user === void 0 ? void 0 : user.lastName) !== null && _b !== void 0 ? _b : "",
        photo: (_c = user === null || user === void 0 ? void 0 : user.photo) !== null && _c !== void 0 ? _c : "",
        phone: (_d = user === null || user === void 0 ? void 0 : user.phone) !== null && _d !== void 0 ? _d : "",
        email: (_e = user === null || user === void 0 ? void 0 : user.email) !== null && _e !== void 0 ? _e : "",
        gender: (_g = (_f = user === null || user === void 0 ? void 0 : user.gender) === null || _f === void 0 ? void 0 : _f.toLowerCase()) !== null && _g !== void 0 ? _g : "",
        password: "123456",
        superAdmin: false,
        username: (_h = user === null || user === void 0 ? void 0 : user.email) !== null && _h !== void 0 ? _h : "",
        role,
        vendor: Object.assign({ _id: user === null || user === void 0 ? void 0 : user._id }, (_j = user === null || user === void 0 ? void 0 : user.services) === null || _j === void 0 ? void 0 : _j.vendor)
    });
    console.log(newUser);
    const err = newUser.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const valid = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, valid);
    }
    const save = await newUser.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "User Created" });
});
exports.addVendor = addVendor;
const getVendors = (0, catchAsync_1.default)(async (req, res) => {
    const vendors = await feUser_model_1.UserModel
        .find({ "services.vendor.isVendor": true, status: { $ne: feUser_model_1.UserStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 })
        .lean();
    const total = await feUser_model_1.UserModel.countDocuments({ "services.vendor.isVendor": true, status: { $ne: feUser_model_1.UserStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: vendors };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getVendors = getVendors;
const getVendor = (0, catchAsync_1.default)(async (req, res) => {
    var _a, _b, _c, _d;
    const vendor = await feUser_model_1.UserModel
        .findOne({ _id: req.params._id })
        .lean();
    const organizationId = (_d = (_c = (_b = (_a = vendor === null || vendor === void 0 ? void 0 : vendor.services) === null || _a === void 0 ? void 0 : _a.vendor) === null || _b === void 0 ? void 0 : _b.organization) === null || _c === void 0 ? void 0 : _c._id) !== null && _d !== void 0 ? _d : null;
    // const savingsPackages = await CrmSavingsPackageModel.find({"organization._id": organizationId}).lean();
    // const loanPackages = await CrmLoanPackageModel.find({"organization._id": organizationId}).lean();
    // const savingsApplications = await CrmSavingsApplicationModel.find({"package.organization._id": organizationId}).lean();
    // const loanApplications = await CrmLoanApplicationModel.find({"package.organization._id": organizationId}).lean();
    //
    // if (vendor) Object.assign(vendor, {
    //     packages: {savings: savingsPackages, loan: loanPackages},
    //     applications: {savings: savingsApplications, loan: loanApplications}
    // })
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: vendor });
});
exports.getVendor = getVendor;
// Organizations
const addOrganization = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    const newOrganization = new feOrganization_model_1.OrganizationModel({ name, status, description });
    const err = newOrganization.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }
    const save = await newOrganization.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Organization Created" });
});
exports.addOrganization = addOrganization;
const updateOrganization = (0, catchAsync_1.default)(async (req, res) => {
    const { name, description, status } = req.body;
    await feOrganization_model_1.OrganizationModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateOrganization = updateOrganization;
const getOrganizations = (0, catchAsync_1.default)(async (req, res) => {
    const organizations = await feOrganization_model_1.OrganizationModel
        .find({ status: { $ne: feOrganization_model_1.OrganizationStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feOrganization_model_1.OrganizationModel.countDocuments({ status: { $ne: feOrganization_model_1.OrganizationStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: organizations };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getOrganizations = getOrganizations;
const getOrganization = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const organizationInfo = await feOrganization_model_1.OrganizationModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: organizationInfo });
});
exports.getOrganization = getOrganization;
const deleteOrganization = (0, catchAsync_1.default)(async (req, res) => {
    await feOrganization_model_1.OrganizationModel.updateOne({ _id: req.params._id }, { status: feOrganization_model_1.OrganizationStatus.deleted });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteOrganization = deleteOrganization;
