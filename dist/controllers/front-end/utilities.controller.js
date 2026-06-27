"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContents = exports.getBrands = exports.getAuthors = exports.getCategories = exports.getAreas = exports.getLocations = exports.getCities = exports.getCountries = exports.getUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feUser_model_1 = require("@models/feUser.model");
const feWsCountry_model_1 = require("@models/feWsCountry.model");
const feWsCity_model_1 = require("@models/feWsCity.model");
const feWsLocation_model_1 = require("@models/feWsLocation.model");
const feWsCategory_model_1 = require("@models/feWsCategory.model");
const beWsAuthor_model_1 = require("@models/beWsAuthor.model");
const feWsBrand_model_1 = require("@models/feWsBrand.model");
const feWsBanner_model_1 = require("@models/feWsBanner.model");
const feWsArea_model_1 = require("@models/feWsArea.model");
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
    const { _id } = req.query;
    const fields = { name: true, code: true };
    const conditions = { status: { $eq: feWsCountry_model_1.WsCountryStatus.active } };
    if (_id)
        Object.assign(conditions, { _id });
    const countries = await feWsCountry_model_1.WsCountryModel.find(conditions, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: countries });
});
exports.getCountries = getCountries;
const getCities = (0, catchAsync_1.default)(async (req, res) => {
    const { countryId, _id } = req.query;
    const fields = { name: true };
    const conditions = { status: feWsCity_model_1.WsCityStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    if (countryId)
        Object.assign(conditions, { "country._id": countryId });
    const cities = await feWsCity_model_1.WsCityModel.find(conditions, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: cities });
});
exports.getCities = getCities;
const getLocations = (0, catchAsync_1.default)(async (req, res) => {
    const { countryId, cityId, _id } = req.query;
    const fields = { name: true };
    const conditions = { status: feWsLocation_model_1.WsLocationStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    if (countryId)
        Object.assign(conditions, { "country._id": countryId });
    if (cityId)
        Object.assign(conditions, { "city._id": cityId });
    const locations = await feWsLocation_model_1.WsLocationModel.find(conditions, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: locations });
});
exports.getLocations = getLocations;
const getAreas = (0, catchAsync_1.default)(async (req, res) => {
    const { countryId, cityId, locationId, _id } = req.query;
    const fields = { name: true };
    const conditions = { status: feWsArea_model_1.WsAreaStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    if (countryId)
        Object.assign(conditions, { "country._id": countryId });
    if (cityId)
        Object.assign(conditions, { "city._id": cityId });
    if (locationId)
        Object.assign(conditions, { "location._id": locationId });
    const areas = await feWsArea_model_1.WsAreaModel.find(conditions, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: areas });
});
exports.getAreas = getAreas;
const getCategories = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.query;
    const fields = {
        name: true,
        photo: true,
        isDisabled: true,
        description: true,
    };
    const conditions = { status: feWsCategory_model_1.WsCategoryStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    const categories = await feWsCategory_model_1.WsCategoryModel.find(conditions, fields).sort({
        position: 1,
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: categories });
});
exports.getCategories = getCategories;
const getAuthors = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.query;
    const fields = {
        name: true,
        description: true,
        isDisabled: true,
    };
    const conditions = { status: beWsAuthor_model_1.WsAuthorStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    const authors = await beWsAuthor_model_1.WsAuthorModel.find(conditions, fields).sort({
        position: 1,
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: authors });
});
exports.getAuthors = getAuthors;
const getBrands = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.query;
    const fields = { name: true, photo: true };
    const conditions = { status: feWsBrand_model_1.WsBrandStatus.active };
    if (_id)
        Object.assign(conditions, { _id });
    const brands = await feWsBrand_model_1.WsBrandModel.find(conditions, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: brands });
});
exports.getBrands = getBrands;
// const getBanners = catchAsync(async (req: Request, res: Response) => {
//   const { _id } = req.query;
//   const fields = {
//     name: true,
//     photo: true,
//     description: true,
//     page: true,
//     position: true,
//     dataId: true,
//   };
//   const conditions = {
//     status: WsBannerStatus.active,
//     position: WsBannerPositions.landingSlider,
//   };
//   if (_id) Object.assign(conditions, { _id });
//   const banners = await WsBannerModel.find(conditions, fields);
//   return apiResponse(res, httpStatus.OK, { data: banners });
// });
// const getHighlights = catchAsync(async (req: Request, res: Response) => {
//   const { _id } = req.query;
//   const fields = {
//     name: true,
//     photo: true,
//     description: true,
//     page: true,
//     position: true,
//     dataId: true,
//   };
//   const conditions = {
//     status: WsBannerStatus.active,
//     position: WsBannerPositions.highlights,
//   };
//   if (_id) Object.assign(conditions, { _id });
//   const banners = await WsBannerModel.find(conditions, fields);
//   return apiResponse(res, httpStatus.OK, { data: banners });
// });
const getContents = (0, catchAsync_1.default)(async (req, res) => {
    const fields = {
        name: true,
        photo: true,
        description: true,
        page: true,
        position: true,
        bannerPlace: true,
        dataId: true,
    };
    const banners = await feWsBanner_model_1.WsBannerModel.find({
        status: feWsBanner_model_1.WsBannerStatus.active,
        bannerPlace: {
            $in: [
                feWsBanner_model_1.WsBannerPositions.heroSlider,
                feWsBanner_model_1.WsBannerPositions.appDownload,
                feWsBanner_model_1.WsBannerPositions.footerBanner
            ],
        },
    }, fields);
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, {
        data: {
            heroSlider: banners.filter((item) => item.bannerPlace === feWsBanner_model_1.WsBannerPositions.heroSlider).sort((a, b) => (a.position || 0) - (b.position || 0)),
            appDownload: banners.filter((item) => item.bannerPlace === feWsBanner_model_1.WsBannerPositions.appDownload).sort((a, b) => (a.position || 0) - (b.position || 0)),
            footerBanner: banners.filter((item) => item.bannerPlace === feWsBanner_model_1.WsBannerPositions.footerBanner).sort((a, b) => (a.position || 0) - (b.position || 0)),
        },
    });
});
exports.getContents = getContents;
