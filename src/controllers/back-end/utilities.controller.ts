import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import { UmRoleModel, UmRoleStatus } from "@models/beUmRole.model";
import { UserModel, UserServicesStatus, UserStatus } from "@models/feUser.model";
import { WsCategoryModel, WsCategoryStatus } from "@models/feWsCategory.model";
import { WsBrandModel, WsBrandStatus } from "@models/feWsBrand.model";
import { WsCountryModel, WsCountryStatus } from "@models/feWsCountry.model";
import { WsCityModel, WsCityStatus } from "@models/feWsCity.model";
import { WsLocationModel, WsLocationStatus } from "@models/feWsLocation.model";
import { OrganizationModel, OrganizationStatus } from "@models/feOrganization.model";
import { WsSubCategoryModel, WsSubCategoryStatus } from "@models/feWsSubCategory.model";

const getRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await UmRoleModel.find({ status: { $eq: UmRoleStatus.active } });
    return apiResponse(res, httpStatus.OK, { data: roles });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
    const { email, phone } = req.query;
    const conditions = { status: UserStatus.active };

    email ? Object.assign(conditions, { email }) : null;
    phone ? Object.assign(conditions, { phone }) : null;

    const users = await UserModel.findOne(conditions, {
        firstName: true,
        lastName: true,
        photo: true,
        email: true,
        phone: true,
    });
    return apiResponse(res, httpStatus.OK, { data: users });
});

const getCountries = catchAsync(async (req: Request, res: Response) => {
    const countries = await WsCountryModel.find({ status: { $eq: WsCountryStatus.active } });
    return apiResponse(res, httpStatus.OK, { data: countries });
});

const getCities = catchAsync(async (req: Request, res: Response) => {
    const { countryId } = req.query;
    const conditions = { status: WsCityStatus.active };
    countryId ? Object.assign(conditions, { "country._id": countryId }) : null;

    const cities = await WsCityModel.find(conditions, { name: true });
    return apiResponse(res, httpStatus.OK, { data: cities });
})

const getLocations = catchAsync(async (req: Request, res: Response) => {
    const { cityId } = req.query;
    const conditions = { status: WsLocationStatus.active };
    cityId ? Object.assign(conditions, { "city._id": cityId }) : null;

    const locations = await WsLocationModel.find(conditions, { name: true });
    return apiResponse(res, httpStatus.OK, { data: locations });
})

const getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await WsCategoryModel.find({ status: { $eq: WsCategoryStatus.active } });
    return apiResponse(res, httpStatus.OK, { data: categories });
});

const getSubCategories = catchAsync(async (req: Request, res: Response) => {
    const { categoryIds } = req.query;
    const conditions = { status: WsSubCategoryStatus.active };
    categoryIds && typeof categoryIds === "string" ? Object.assign(conditions, { "category._id": { $in: categoryIds.split(",") } }) : null;

    const subCategories = await WsSubCategoryModel.find(conditions, { name: true });
    return apiResponse(res, httpStatus.OK, { data: subCategories });
})

const getBrands = catchAsync(async (req: Request, res: Response) => {
    const brands = await WsBrandModel.find({ status: { $eq: WsBrandStatus.active } });
    return apiResponse(res, httpStatus.OK, { data: brands });
});

const getVendors = catchAsync(async (req: Request, res: Response) => {
    const conditions = { status: UserStatus.active, "services.vendor.isVendor": true, "services.vendor.status": UserServicesStatus.approved };
    const vendors = await UserModel.find(conditions, { firstName: true, lastName: true, services: true });
    return apiResponse(res, httpStatus.OK, { data: vendors });
})

const getUsers = catchAsync(async (req: Request, res: Response) => {
    const conditions = { status: UserStatus.active, firstName: { $ne: null } };
    const users = await UserModel.find(conditions, { firstName: true, lastName: true, phone: true });
    return apiResponse(res, httpStatus.OK, { data: users });
})

const getOrganizations = catchAsync(async (req: Request, res: Response) => {
    const organizations = await OrganizationModel.find({ status: { $eq: OrganizationStatus.active } });
    return apiResponse(res, httpStatus.OK, { data: organizations });
});

export {
    getRoles,
    getUser,
    getCountries,
    getCities,
    getLocations,
    getCategories,
    getSubCategories,
    getBrands,
    getUsers,
    getVendors,
    getOrganizations
};
