import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import validationError from "@utils/validationError";

import { WsCountryModel, WsCountryStatus } from "@models/feWsCountry.model";
import { WsCityModel, WsCityStatus } from "@models/feWsCity.model";
import { WsLocationModel, WsLocationStatus } from "@models/feWsLocation.model";
import { WsAreaModel, WsAreaStatus } from "@models/feWsArea.model";
import { WsBannerModel, WsBannerStatus } from "@models/feWsBanner.model";
import { WsCategoryModel, WsCategoryStatus } from "@models/feWsCategory.model";
import { WsBrandModel, WsBrandStatus } from "@models/feWsBrand.model";
import { WsSubCategoryModel, WsSubCategoryStatus } from "@models/feWsSubCategory.model";
import { WsBlogModel, WsBlogStatus } from "@models/feWsBlog.model";
import { WsAuthorModel, WsAuthorStatus } from "@models/beWsAuthor.model";


// Areas
// const addArea = catchAsync(async (req: Request, res: Response) => {
//     const { name, latitude, longitude, status, countryId, cityId, locationId } = req.body;

//     const country = await WsCountryModel.findOne(
//         { _id: countryId },
//         { name: true, code: true, latitude: true, longitude: true }
//     );
//     const city = await WsCityModel.findOne(
//         { _id: cityId },
//         { name: true, latitude: true, longitude: true }
//     );
//     const location = await WsLocationModel.findOne(
//         { _id: locationId },
//         { name: true, latitude: true, longitude: true }
//     );

//     const newArea = new WsAreaModel({ name, country, city, location, latitude, longitude, status });

//     const err = newArea.validateSync();
//     if (err instanceof mongoose.Error) {
//         const validation = await validationError.requiredCheck(err.errors);
//         return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
//     }
//     const save = await newArea.save();
//     return apiResponse(res, httpStatus.CREATED, { data: save, message: "Area Created" });
// });

// const updateArea = catchAsync(async (req: Request, res: Response) => {
//     const { name, latitude, longitude, status, countryId, cityId, locationId } = req.body;

//     const country = await WsCountryModel.findOne(
//         { _id: countryId },
//         { name: true, code: true, latitude: true, longitude: true }
//     );
//     const city = await WsCityModel.findOne(
//         { _id: cityId },
//         { name: true, latitude: true, longitude: true }
//     );
//     const location = await WsLocationModel.findOne(
//         { _id: locationId },
//         { name: true, latitude: true, longitude: true }
//     );

//     await WsAreaModel.updateOne({ _id: req.params.id }, { name, country, city, location, latitude, longitude, status });
//     return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated." });
// });

// const getAreas = catchAsync(async (req: Request, res: Response) => {
//     const areas = await WsAreaModel
//         .find({ status: { $ne: WsAreaStatus.deleted } })
//         .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
//         .limit(parseInt(req.query.perPage as string))
//         .sort({ createdAt: -1 });

//     const total = await WsAreaModel.countDocuments({ status: { $ne: WsAreaStatus.deleted } });
//     const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: areas };
//     return apiResponse(res, httpStatus.OK, { data: response });
// });

// const getArea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const area = await WsAreaModel.findOne({ _id: id });
//     return apiResponse(res, httpStatus.OK, { data: area });
// });

// const deleteArea = catchAsync(async (req: Request, res: Response) => {
//     await WsAreaModel.updateOne({ _id: req.params.id }, { $set: { status: WsAreaStatus.deleted } });
//     return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
// });

// Banners
const addBanner = catchAsync(async (req: Request, res: Response) => {
    const { name, photo, page, dataId, status, position, bannerPlace, description } = req.body;
    const newBanner = new WsBannerModel({ name, photo, page, dataId, status, position, bannerPlace, description });

    const err = newBanner.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }

    const save = await newBanner.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "Banner Created" });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
    const { name, photo, status, position, bannerPlace, description } = req.body;
    await WsBannerModel.updateOne({ _id: req.params.id }, { $set: { name, photo, status, position, bannerPlace, description } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});

const getBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await WsBannerModel
        .find({ status: { $ne: WsBannerStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ position: 1 });

    const total = await WsBannerModel.countDocuments({ status: { $ne: WsBannerStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: banners };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getBanner = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryInfo = await WsBannerModel.findOne({ _id: id });
    return apiResponse(res, httpStatus.OK, { data: categoryInfo });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
    // @to-do can't be deleted if live courses involved

    await WsBannerModel.updateOne({ _id: req.params.id }, { $set: { status: WsBannerStatus.deleted } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

// Authors
const addAuthor = catchAsync(async (req: Request, res: Response) => {
    const { name, photo, description, position, isDisabled, status } = req.body;
    const newAuthor = new WsAuthorModel({ name, photo, description, position, isDisabled, status });

    const err = newAuthor.validateSync();
    if (err instanceof mongoose.Error.ValidationError) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }

    const response = await newAuthor.save();
    return apiResponse(res, httpStatus.CREATED, { data: response, message: "Author Added" });
});

const getAuthors = catchAsync(async (req: Request, res: Response) => {
    const authors = await WsAuthorModel
        .find({ status: { $ne: WsAuthorStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ position: 1 });

    const total = await WsAuthorModel.countDocuments({ status: { $ne: WsAuthorStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: authors };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getAuthor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = await WsAuthorModel.findOne({ _id: id });
    return apiResponse(res, httpStatus.OK, { data: author });
});

const updateAuthor = catchAsync(async (req: Request, res: Response) => {
    const { name, photo, description, position, isDisabled, status } = req.body;
    await WsAuthorModel.updateOne({ _id: req.params.id }, { $set: { name, photo, description, position, isDisabled, status } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});

const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
    await WsAuthorModel.updateOne({ _id: req.params.id }, { $set: { status: WsAuthorStatus.deleted } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Author Deleted" });
});

// Category
const addCategory = catchAsync(async (req: Request, res: Response) => {
    const newCategory = new WsCategoryModel(req.body);

    const err = newCategory.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }

    const save = await newCategory.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "Category Created" });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, photo, color, isDisabled, description, position, status } = req.body;
    await WsCategoryModel.updateOne({ _id: req.params.id }, { $set: { name, photo, color, isDisabled, position, description, status } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Category Updated." });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await WsCategoryModel
        .find({ status: { $ne: WsCategoryStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ position: 1 });

    const total = await WsCategoryModel.countDocuments({ status: { $ne: WsCategoryStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: categories };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await WsCategoryModel.findOne({ _id: id });
    return apiResponse(res, httpStatus.OK, { data: category });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await WsCategoryModel.updateOne({ _id: req.params.id }, { $set: { status: WsCategoryStatus.deleted } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

// Sub Category
const addSubCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId, name, photo, color, description, status } = req.body;
    const category = await WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    const newSubCategory = new WsSubCategoryModel({ category, name, photo, color, description, status });

    const err = newSubCategory.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, { message: "Validation Required" }, validation);
    }

    const save = await newSubCategory.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "Sub Category Created" });
});

const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId, name, photo, color, description, status } = req.body;
    const category = await WsCategoryModel.findOne({ _id: categoryId }, { name: true });
    await WsSubCategoryModel.updateOne({ _id: req.params.id }, { $set: { category, name, photo, color, description, status } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Sub Category Updated." });
});

const getSubCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await WsSubCategoryModel
        .find({ status: { $ne: WsSubCategoryStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 });

    const total = await WsSubCategoryModel.countDocuments({ status: { $ne: WsSubCategoryStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: categories };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getSubCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await WsSubCategoryModel.findOne({ _id: id });
    return apiResponse(res, httpStatus.OK, { data: category });
});

const deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
    await WsSubCategoryModel.updateOne({ _id: req.params.id }, { $set: { status: WsSubCategoryStatus.deleted } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

export {
    addAuthor, getAuthors, getAuthor, updateAuthor, deleteAuthor,
    addBanner, getBanners, deleteBanner, getBanner, updateBanner,
    addCategory, getCategories, getCategory, updateCategory, deleteCategory,
    addSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory,
};
