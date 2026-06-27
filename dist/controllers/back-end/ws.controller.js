"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.getBlogs = exports.addBlog = exports.deleteBrand = exports.updateBrand = exports.getBrand = exports.getBrands = exports.addBrand = exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategory = exports.getSubCategories = exports.addSubCategory = exports.deleteAuthor = exports.updateAuthor = exports.getAuthor = exports.getAuthors = exports.addAuthor = exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.addCategory = exports.updateBanner = exports.getBanner = exports.deleteBanner = exports.getBanners = exports.addBanner = exports.deleteArea = exports.updateArea = exports.getArea = exports.getAreas = exports.addArea = exports.deleteLocation = exports.updateLocation = exports.getLocation = exports.getLocations = exports.addLocation = exports.deleteCity = exports.updateCity = exports.getCity = exports.getCities = exports.addCity = exports.deleteCountry = exports.updateCountry = exports.getCountry = exports.getCountries = exports.addCountry = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const feWsCountry_model_1 = require("@models/feWsCountry.model");
const feWsCity_model_1 = require("@models/feWsCity.model");
const feWsLocation_model_1 = require("@models/feWsLocation.model");
const feWsArea_model_1 = require("@models/feWsArea.model");
const feWsBanner_model_1 = require("@models/feWsBanner.model");
const feWsCategory_model_1 = require("@models/feWsCategory.model");
const feWsBrand_model_1 = require("@models/feWsBrand.model");
const feWsSubCategory_model_1 = require("@models/feWsSubCategory.model");
const feWsBlog_model_1 = require("@models/feWsBlog.model");
const beWsAuthor_model_1 = require("@models/beWsAuthor.model");
// Country
const addCountry = (0, catchAsync_1.default)(async (req, res) => {
    const newCountry = new feWsCountry_model_1.WsCountryModel(req.body);
    const err = newCountry.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newCountry.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Country Created" });
});
exports.addCountry = addCountry;
const updateCountry = (0, catchAsync_1.default)(async (req, res) => {
    const { name, code, latitude, longitude, status } = req.body;
    await feWsCountry_model_1.WsCountryModel.updateOne({ _id: req.params.id }, { $set: { name, code, latitude, longitude, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateCountry = updateCountry;
const getCountries = (0, catchAsync_1.default)(async (req, res) => {
    const countries = await feWsCountry_model_1.WsCountryModel
        .find({ status: { $ne: feWsCountry_model_1.WsCountryStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsCountry_model_1.WsCountryModel.countDocuments({ status: { $ne: feWsCountry_model_1.WsCountryStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: countries };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getCountries = getCountries;
const getCountry = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const countryInfo = await feWsCountry_model_1.WsCountryModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: countryInfo });
});
exports.getCountry = getCountry;
const deleteCountry = (0, catchAsync_1.default)(async (req, res) => {
    // @to-do can't be deleted if live country involved
    await feWsCountry_model_1.WsCountryModel.updateOne({ _id: req.params.id }, { $set: { status: feWsCountry_model_1.WsCountryStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteCountry = deleteCountry;
// City
const addCity = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    const newCity = new feWsCity_model_1.WsCityModel({ name, country, latitude, longitude, status });
    const err = newCity.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newCity.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "City Created" });
});
exports.addCity = addCity;
const updateCity = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    await feWsCity_model_1.WsCityModel.updateOne({ _id: req.params.id }, { name, country, latitude, longitude, status });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateCity = updateCity;
const getCities = (0, catchAsync_1.default)(async (req, res) => {
    const cities = await feWsCity_model_1.WsCityModel
        .find({ status: { $ne: feWsCity_model_1.WsCityStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsCity_model_1.WsCityModel.countDocuments({ status: { $ne: feWsCity_model_1.WsCityStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: cities };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getCities = getCities;
const getCity = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const cityInfo = await feWsCity_model_1.WsCityModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: cityInfo });
});
exports.getCity = getCity;
const deleteCity = (0, catchAsync_1.default)(async (req, res) => {
    // @to-do can't be deleted if live city involved
    await feWsCity_model_1.WsCityModel.updateOne({ _id: req.params.id }, { $set: { status: feWsCity_model_1.WsCityStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: feWsCity_model_1.WsCityStatus.deleted });
});
exports.deleteCity = deleteCity;
// Locations
const addLocation = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId, cityId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    const city = await feWsCity_model_1.WsCityModel.findOne({ _id: cityId }, { name: true, latitude: true, longitude: true });
    const newLocation = new feWsLocation_model_1.WsLocationModel({ name, country, city, latitude, longitude, status });
    const err = newLocation.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newLocation.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Location Created" });
});
exports.addLocation = addLocation;
const updateLocation = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId, cityId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    const city = await feWsCity_model_1.WsCityModel.findOne({ _id: cityId }, { name: true, latitude: true, longitude: true });
    await feWsLocation_model_1.WsLocationModel.updateOne({ _id: req.params.id }, { name, country, city, latitude, longitude, status });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateLocation = updateLocation;
const getLocations = (0, catchAsync_1.default)(async (req, res) => {
    const locations = await feWsLocation_model_1.WsLocationModel
        .find({ status: { $ne: feWsLocation_model_1.WsLocationStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsLocation_model_1.WsLocationModel.countDocuments({ status: { $ne: feWsLocation_model_1.WsLocationStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: locations };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getLocations = getLocations;
const getLocation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const locationInfo = await feWsLocation_model_1.WsLocationModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: locationInfo });
});
exports.getLocation = getLocation;
const deleteLocation = (0, catchAsync_1.default)(async (req, res) => {
    // @to-do can't be deleted if live location involved
    await feWsLocation_model_1.WsLocationModel.updateOne({ _id: req.params.id }, { $set: { status: feWsLocation_model_1.WsLocationStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteLocation = deleteLocation;
// Areas
const addArea = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId, cityId, locationId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    const city = await feWsCity_model_1.WsCityModel.findOne({ _id: cityId }, { name: true, latitude: true, longitude: true });
    const location = await feWsLocation_model_1.WsLocationModel.findOne({ _id: locationId }, { name: true, latitude: true, longitude: true });
    const newArea = new feWsArea_model_1.WsAreaModel({ name, country, city, location, latitude, longitude, status });
    const err = newArea.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newArea.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Area Created" });
});
exports.addArea = addArea;
const updateArea = (0, catchAsync_1.default)(async (req, res) => {
    const { name, latitude, longitude, status, countryId, cityId, locationId } = req.body;
    const country = await feWsCountry_model_1.WsCountryModel.findOne({ _id: countryId }, { name: true, code: true, latitude: true, longitude: true });
    const city = await feWsCity_model_1.WsCityModel.findOne({ _id: cityId }, { name: true, latitude: true, longitude: true });
    const location = await feWsLocation_model_1.WsLocationModel.findOne({ _id: locationId }, { name: true, latitude: true, longitude: true });
    await feWsArea_model_1.WsAreaModel.updateOne({ _id: req.params.id }, { name, country, city, location, latitude, longitude, status });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated." });
});
exports.updateArea = updateArea;
const getAreas = (0, catchAsync_1.default)(async (req, res) => {
    const areas = await feWsArea_model_1.WsAreaModel
        .find({ status: { $ne: feWsArea_model_1.WsAreaStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsArea_model_1.WsAreaModel.countDocuments({ status: { $ne: feWsArea_model_1.WsAreaStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: areas };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getAreas = getAreas;
const getArea = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const area = await feWsArea_model_1.WsAreaModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: area });
});
exports.getArea = getArea;
const deleteArea = (0, catchAsync_1.default)(async (req, res) => {
    await feWsArea_model_1.WsAreaModel.updateOne({ _id: req.params.id }, { $set: { status: feWsArea_model_1.WsAreaStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteArea = deleteArea;
// Banners
const addBanner = (0, catchAsync_1.default)(async (req, res) => {
    const { name, photo, page, dataId, status, position, bannerPlace, description } = req.body;
    const newBanner = new feWsBanner_model_1.WsBannerModel({ name, photo, page, dataId, status, position, bannerPlace, description });
    const err = newBanner.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newBanner.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Banner Created" });
});
exports.addBanner = addBanner;
const updateBanner = (0, catchAsync_1.default)(async (req, res) => {
    const { name, photo, status, position, bannerPlace, description } = req.body;
    await feWsBanner_model_1.WsBannerModel.updateOne({ _id: req.params.id }, { $set: { name, photo, status, position, bannerPlace, description } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateBanner = updateBanner;
const getBanners = (0, catchAsync_1.default)(async (req, res) => {
    const banners = await feWsBanner_model_1.WsBannerModel
        .find({ status: { $ne: feWsBanner_model_1.WsBannerStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ position: 1 });
    const total = await feWsBanner_model_1.WsBannerModel.countDocuments({ status: { $ne: feWsBanner_model_1.WsBannerStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: banners };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getBanners = getBanners;
const getBanner = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const categoryInfo = await feWsBanner_model_1.WsBannerModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: categoryInfo });
});
exports.getBanner = getBanner;
const deleteBanner = (0, catchAsync_1.default)(async (req, res) => {
    // @to-do can't be deleted if live courses involved
    await feWsBanner_model_1.WsBannerModel.updateOne({ _id: req.params.id }, { $set: { status: feWsBanner_model_1.WsBannerStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteBanner = deleteBanner;
// Authors
const addAuthor = (0, catchAsync_1.default)(async (req, res) => {
    const { name, description, position, isDisabled, status } = req.body;
    const newAuthor = new beWsAuthor_model_1.WsAuthorModel({ name, description, position, isDisabled, status });
    const err = newAuthor.validateSync();
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const response = await newAuthor.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: response, message: "Author Added" });
});
exports.addAuthor = addAuthor;
const getAuthors = (0, catchAsync_1.default)(async (req, res) => {
    const authors = await beWsAuthor_model_1.WsAuthorModel
        .find({ status: { $ne: beWsAuthor_model_1.WsAuthorStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ position: 1 });
    const total = await beWsAuthor_model_1.WsAuthorModel.countDocuments({ status: { $ne: beWsAuthor_model_1.WsAuthorStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: authors };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getAuthors = getAuthors;
const getAuthor = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const author = await beWsAuthor_model_1.WsAuthorModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: author });
});
exports.getAuthor = getAuthor;
const updateAuthor = (0, catchAsync_1.default)(async (req, res) => {
    const { name, description, position, isDisabled, status } = req.body;
    await beWsAuthor_model_1.WsAuthorModel.updateOne({ _id: req.params.id }, { $set: { name, description, position, isDisabled, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateAuthor = updateAuthor;
const deleteAuthor = (0, catchAsync_1.default)(async (req, res) => {
    await beWsAuthor_model_1.WsAuthorModel.updateOne({ _id: req.params.id }, { $set: { status: beWsAuthor_model_1.WsAuthorStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Author Deleted" });
});
exports.deleteAuthor = deleteAuthor;
// Category
const addCategory = (0, catchAsync_1.default)(async (req, res) => {
    const newCategory = new feWsCategory_model_1.WsCategoryModel(req.body);
    const err = newCategory.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newCategory.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Category Created" });
});
exports.addCategory = addCategory;
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { name, photo, color, isDisabled, description, position, status } = req.body;
    await feWsCategory_model_1.WsCategoryModel.updateOne({ _id: req.params.id }, { $set: { name, photo, color, isDisabled, position, description, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Category Updated." });
});
exports.updateCategory = updateCategory;
const getCategories = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await feWsCategory_model_1.WsCategoryModel
        .find({ status: { $ne: feWsCategory_model_1.WsCategoryStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ position: 1 });
    const total = await feWsCategory_model_1.WsCategoryModel.countDocuments({ status: { $ne: feWsCategory_model_1.WsCategoryStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: categories };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getCategories = getCategories;
const getCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const category = await feWsCategory_model_1.WsCategoryModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: category });
});
exports.getCategory = getCategory;
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    await feWsCategory_model_1.WsCategoryModel.updateOne({ _id: req.params.id }, { $set: { status: feWsCategory_model_1.WsCategoryStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteCategory = deleteCategory;
// Sub Category
const addSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { categoryId, name, photo, color, description, status } = req.body;
    const category = await feWsCategory_model_1.WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    const newSubCategory = new feWsSubCategory_model_1.WsSubCategoryModel({ category, name, photo, color, description, status });
    const err = newSubCategory.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newSubCategory.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Sub Category Created" });
});
exports.addSubCategory = addSubCategory;
const updateSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { categoryId, name, photo, color, description, status } = req.body;
    const category = await feWsCategory_model_1.WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    await feWsSubCategory_model_1.WsSubCategoryModel.updateOne({ _id: req.params.id }, { $set: { category, name, photo, color, description, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Sub Category Updated." });
});
exports.updateSubCategory = updateSubCategory;
const getSubCategories = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await feWsSubCategory_model_1.WsSubCategoryModel
        .find({ status: { $ne: feWsSubCategory_model_1.WsSubCategoryStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsSubCategory_model_1.WsSubCategoryModel.countDocuments({ status: { $ne: feWsSubCategory_model_1.WsSubCategoryStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: categories };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getSubCategories = getSubCategories;
const getSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const category = await feWsSubCategory_model_1.WsSubCategoryModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: category });
});
exports.getSubCategory = getSubCategory;
const deleteSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    await feWsSubCategory_model_1.WsSubCategoryModel.updateOne({ _id: req.params.id }, { $set: { status: feWsSubCategory_model_1.WsSubCategoryStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteSubCategory = deleteSubCategory;
// Brand
const addBrand = (0, catchAsync_1.default)(async (req, res) => {
    const newBrand = new feWsBrand_model_1.WsBrandModel(req.body);
    const err = newBrand.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newBrand.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Brand Created" });
});
exports.addBrand = addBrand;
const updateBrand = (0, catchAsync_1.default)(async (req, res) => {
    const { name, photo, description, status } = req.body;
    await feWsBrand_model_1.WsBrandModel.updateOne({ _id: req.params.id }, { $set: { name, photo, description, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Brand Updated." });
});
exports.updateBrand = updateBrand;
const getBrands = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await feWsBrand_model_1.WsBrandModel
        .find({ status: { $ne: feWsBrand_model_1.WsBrandStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsBrand_model_1.WsBrandModel.countDocuments({ status: { $ne: feWsBrand_model_1.WsBrandStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: categories };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getBrands = getBrands;
const getBrand = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const category = await feWsBrand_model_1.WsBrandModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: category });
});
exports.getBrand = getBrand;
const deleteBrand = (0, catchAsync_1.default)(async (req, res) => {
    await feWsBrand_model_1.WsBrandModel.updateOne({ _id: req.params.id }, { $set: { status: feWsBrand_model_1.WsBrandStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteBrand = deleteBrand;
// Blog
const addBlog = (0, catchAsync_1.default)(async (req, res) => {
    const newBlog = new feWsBlog_model_1.WsBlogModel(req.body);
    const err = newBlog.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }
    const save = await newBlog.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Blog Created" });
});
exports.addBlog = addBlog;
const updateBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { name, photo, description, status } = req.body;
    await feWsBlog_model_1.WsBlogModel.updateOne({ _id: req.params.id }, { $set: { name, photo, description, status } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Blog Updated." });
});
exports.updateBlog = updateBlog;
const getBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const blogs = await feWsBlog_model_1.WsBlogModel
        .find({ status: { $ne: feWsBlog_model_1.WsBlogStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await feWsBlog_model_1.WsBlogModel.countDocuments({ status: { $ne: feWsBlog_model_1.WsBlogStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: blogs };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getBlogs = getBlogs;
const getBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const blog = await feWsBlog_model_1.WsBlogModel.findOne({ _id: id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: blog });
});
exports.getBlog = getBlog;
const deleteBlog = (0, catchAsync_1.default)(async (req, res) => {
    await feWsBlog_model_1.WsBlogModel.updateOne({ _id: req.params.id }, { $set: { status: feWsBlog_model_1.WsBlogStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteBlog = deleteBlog;
