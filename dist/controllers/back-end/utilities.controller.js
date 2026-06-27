"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizations = exports.getVendors = exports.getUsers = exports.getBrands = exports.getSubCategories = exports.getCategories = exports.getLocations = exports.getCities = exports.getCountries = exports.getUser = exports.getRoles = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const beUmRole_model_1 = require("@models/beUmRole.model");
const feUser_model_1 = require("@models/feUser.model");
const feWsCategory_model_1 = require("@models/feWsCategory.model");
const feWsBrand_model_1 = require("@models/feWsBrand.model");
const feWsCountry_model_1 = require("@models/feWsCountry.model");
const feWsCity_model_1 = require("@models/feWsCity.model");
const feWsLocation_model_1 = require("@models/feWsLocation.model");
const feOrganization_model_1 = require("@models/feOrganization.model");
const feWsSubCategory_model_1 = require("@models/feWsSubCategory.model");
const getRoles = (0, catchAsync_1.default)(async (req, res) => {
    const roles = await beUmRole_model_1.UmRoleModel.find({ status: { $eq: beUmRole_model_1.UmRoleStatus.active } });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: roles });
});
exports.getRoles = getRoles;
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const { email, phone } = req.query;
    const conditions = { status: feUser_model_1.UserStatus.active };
    email ? Object.assign(conditions, { email }) : null;
    phone ? Object.assign(conditions, { phone }) : null;
    const users = await feUser_model_1.UserModel.findOne(conditions, {
        firstName: true,
        lastName: true,
        photo: true,
        email: true,
        phone: true,
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: users });
});
exports.getUser = getUser;
const getCountries = (0, catchAsync_1.default)(async (req, res) => {
    const countries = await feWsCountry_model_1.WsCountryModel.find({ status: { $eq: feWsCountry_model_1.WsCountryStatus.active } });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: countries });
});
exports.getCountries = getCountries;
const getCities = (0, catchAsync_1.default)(async (req, res) => {
    const { countryId } = req.query;
    const conditions = { status: feWsCity_model_1.WsCityStatus.active };
    countryId ? Object.assign(conditions, { "country._id": countryId }) : null;
    const cities = await feWsCity_model_1.WsCityModel.find(conditions, { name: true });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: cities });
});
exports.getCities = getCities;
const getLocations = (0, catchAsync_1.default)(async (req, res) => {
    const { cityId } = req.query;
    const conditions = { status: feWsLocation_model_1.WsLocationStatus.active };
    cityId ? Object.assign(conditions, { "city._id": cityId }) : null;
    const locations = await feWsLocation_model_1.WsLocationModel.find(conditions, { name: true });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: locations });
});
exports.getLocations = getLocations;
const getCategories = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await feWsCategory_model_1.WsCategoryModel.find({ status: { $eq: feWsCategory_model_1.WsCategoryStatus.active } });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: categories });
});
exports.getCategories = getCategories;
const getSubCategories = (0, catchAsync_1.default)(async (req, res) => {
    const { categoryIds } = req.query;
    const conditions = { status: feWsSubCategory_model_1.WsSubCategoryStatus.active };
    categoryIds && typeof categoryIds === "string" ? Object.assign(conditions, { "category._id": { $in: categoryIds.split(",") } }) : null;
    const subCategories = await feWsSubCategory_model_1.WsSubCategoryModel.find(conditions, { name: true });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: subCategories });
});
exports.getSubCategories = getSubCategories;
const getBrands = (0, catchAsync_1.default)(async (req, res) => {
    const brands = await feWsBrand_model_1.WsBrandModel.find({ status: { $eq: feWsBrand_model_1.WsBrandStatus.active } });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: brands });
});
exports.getBrands = getBrands;
const getVendors = (0, catchAsync_1.default)(async (req, res) => {
    const conditions = { status: feUser_model_1.UserStatus.active, "services.vendor.isVendor": true, "services.vendor.status": feUser_model_1.UserServicesStatus.approved };
    const vendors = await feUser_model_1.UserModel.find(conditions, { firstName: true, lastName: true, services: true });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: vendors });
});
exports.getVendors = getVendors;
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const conditions = { status: feUser_model_1.UserStatus.active, firstName: { $ne: null } };
    const users = await feUser_model_1.UserModel.find(conditions, { firstName: true, lastName: true, phone: true });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: users });
});
exports.getUsers = getUsers;
const getOrganizations = (0, catchAsync_1.default)(async (req, res) => {
    const organizations = await feOrganization_model_1.OrganizationModel.find({ status: { $eq: feOrganization_model_1.OrganizationStatus.active } });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: organizations });
});
exports.getOrganizations = getOrganizations;
