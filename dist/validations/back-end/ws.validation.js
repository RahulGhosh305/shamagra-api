"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.addBlog = exports.getBlog = exports.getBlogs = exports.deleteBrand = exports.updateBrand = exports.addBrand = exports.getBrand = exports.getBrands = exports.deleteSubCategory = exports.updateSubCategory = exports.addSubCategory = exports.getSubCategory = exports.getSubCategories = exports.deleteAuthor = exports.updateAuthor = exports.addAuthor = exports.getAuthor = exports.getAuthors = exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategory = exports.getCategories = exports.deleteBanner = exports.updateBanner = exports.addBanner = exports.getBanner = exports.getBanners = exports.deleteArea = exports.updateArea = exports.addArea = exports.getArea = exports.getAreas = exports.deleteLocation = exports.updateLocation = exports.addLocation = exports.getLocation = exports.getLocations = exports.deleteCity = exports.updateCity = exports.addCity = exports.getCity = exports.getCities = exports.deleteCountry = exports.updateCountry = exports.addCountry = exports.getCountry = exports.getCountries = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const getCountries = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getCountries = getCountries;
const getCountry = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getCountry = getCountry;
const addCountry = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        code: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addCountry = addCountry;
const updateCountry = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        code: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateCountry = updateCountry;
const deleteCountry = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteCountry = deleteCountry;
const getCities = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getCities = getCities;
const getCity = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getCity = getCity;
const addCity = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addCity = addCity;
const updateCity = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateCity = updateCity;
const deleteCity = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteCity = deleteCity;
const getLocations = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getLocations = getLocations;
const getLocation = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getLocation = getLocation;
const addLocation = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        cityId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addLocation = addLocation;
const updateLocation = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        cityId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateLocation = updateLocation;
const deleteLocation = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteLocation = deleteLocation;
const getAreas = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getAreas = getAreas;
const getArea = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getArea = getArea;
const addArea = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        cityId: joi_1.default.string().required(),
        locationId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addArea = addArea;
const updateArea = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        cityId: joi_1.default.string().required(),
        locationId: joi_1.default.string().required(),
        latitude: joi_1.default.number().required().allow(null).allow(""),
        longitude: joi_1.default.number().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateArea = updateArea;
const deleteArea = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteArea = deleteArea;
const getBanners = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getBanners = getBanners;
const getBanner = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getBanner = getBanner;
const addBanner = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required(),
        page: joi_1.default.string().optional(),
        description: joi_1.default.string().required(),
        position: joi_1.default.number().required(),
        bannerPlace: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.addBanner = addBanner;
const updateBanner = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        page: joi_1.default.string().optional(),
        photo: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        position: joi_1.default.number().required(),
        bannerPlace: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.updateBanner = updateBanner;
const deleteBanner = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteBanner = deleteBanner;
const getCategories = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getCategories = getCategories;
const getCategory = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getCategory = getCategory;
const addCategory = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        isDisabled: joi_1.default.boolean().required(),
        position: joi_1.default.number().required(),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addCategory = addCategory;
const updateCategory = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        isDisabled: joi_1.default.boolean().required(),
        position: joi_1.default.number().required(),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateCategory = updateCategory;
const deleteCategory = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteCategory = deleteCategory;
const getAuthors = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getAuthors = getAuthors;
const getAuthor = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getAuthor = getAuthor;
const addAuthor = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        isDisabled: joi_1.default.boolean().required(),
        position: joi_1.default.number().required(),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addAuthor = addAuthor;
const updateAuthor = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        isDisabled: joi_1.default.boolean().required(),
        position: joi_1.default.number().required(),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateAuthor = updateAuthor;
const deleteAuthor = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteAuthor = deleteAuthor;
const getSubCategories = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getSubCategories = getSubCategories;
const getSubCategory = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getSubCategory = getSubCategory;
const addSubCategory = (0, validate_1.validate)({
    body: joi_1.default.object({
        categoryId: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        color: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addSubCategory = addSubCategory;
const updateSubCategory = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        categoryId: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        color: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateSubCategory = updateSubCategory;
const deleteSubCategory = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteSubCategory = deleteSubCategory;
const getBrands = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getBrands = getBrands;
const getBrand = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getBrand = getBrand;
const addBrand = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addBrand = addBrand;
const updateBrand = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateBrand = updateBrand;
const deleteBrand = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteBrand = deleteBrand;
const getBlogs = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getBlogs = getBlogs;
const getBlog = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.getBlog = getBlog;
const addBlog = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addBlog = addBlog;
const updateBlog = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        photo: joi_1.default.string().required().allow(null).allow(""),
        description: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateBlog = updateBlog;
const deleteBlog = (0, validate_1.validate)({
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    })
});
exports.deleteBlog = deleteBlog;
