import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import {
  UserModel,
  UserServicesStatus,
  UserStatus,
} from "@models/feUser.model";
import { WsCountryModel, WsCountryStatus } from "@models/feWsCountry.model";
import { WsCityModel, WsCityStatus } from "@models/feWsCity.model";
import { WsLocationModel, WsLocationStatus } from "@models/feWsLocation.model";
import { WsCategoryModel, WsCategoryStatus } from "@models/feWsCategory.model";
import { WsAuthorModel, WsAuthorStatus } from "@models/beWsAuthor.model";
import { WsBrandModel, WsBrandStatus } from "@models/feWsBrand.model";
import {
  WsBannerModel,
  WsBannerPositions,
  WsBannerStatus,
} from "@models/feWsBanner.model";
import { WsAreaModel, WsAreaStatus } from "@models/feWsArea.model";

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
  const { _id } = req.query;

  const fields = { name: true, code: true };
  const conditions = { status: { $eq: WsCountryStatus.active } };
  if (_id) Object.assign(conditions, { _id });

  const countries = await WsCountryModel.find(conditions, fields);
  return apiResponse(res, httpStatus.OK, { data: countries });
});

const getCities = catchAsync(async (req: Request, res: Response) => {
  const { countryId, _id } = req.query;

  const fields = { name: true };
  const conditions = { status: WsCityStatus.active };
  if (_id) Object.assign(conditions, { _id });
  if (countryId) Object.assign(conditions, { "country._id": countryId });

  const cities = await WsCityModel.find(conditions, fields);
  return apiResponse(res, httpStatus.OK, { data: cities });
});

const getLocations = catchAsync(async (req: Request, res: Response) => {
  const { countryId, cityId, _id } = req.query;

  const fields = { name: true };
  const conditions = { status: WsLocationStatus.active };
  if (_id) Object.assign(conditions, { _id });
  if (countryId) Object.assign(conditions, { "country._id": countryId });
  if (cityId) Object.assign(conditions, { "city._id": cityId });

  const locations = await WsLocationModel.find(conditions, fields);
  return apiResponse(res, httpStatus.OK, { data: locations });
});

const getAreas = catchAsync(async (req: Request, res: Response) => {
  const { countryId, cityId, locationId, _id } = req.query;

  const fields = { name: true };
  const conditions = { status: WsAreaStatus.active };
  if (_id) Object.assign(conditions, { _id });
  if (countryId) Object.assign(conditions, { "country._id": countryId });
  if (cityId) Object.assign(conditions, { "city._id": cityId });
  if (locationId) Object.assign(conditions, { "location._id": locationId });

  const areas = await WsAreaModel.find(conditions, fields);
  return apiResponse(res, httpStatus.OK, { data: areas });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.query;

  const fields = {
    name: true,
    photo: true,
    isDisabled: true,
    description: true,
  };
  const conditions = { status: WsCategoryStatus.active };
  if (_id) Object.assign(conditions, { _id });

  const categories = await WsCategoryModel.find(conditions, fields).sort({
    position: 1,
  });
  return apiResponse(res, httpStatus.OK, { data: categories });
});

const getAuthors = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.query;

  const fields = {
    name: true,
    description: true,
    isDisabled: true,
  };
  const conditions = { status: WsAuthorStatus.active };
  if (_id) Object.assign(conditions, { _id });

  const authors = await WsAuthorModel.find(conditions, fields).sort({
    position: 1,
  });
  return apiResponse(res, httpStatus.OK, { data: authors });
});

const getBrands = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.query;

  const fields = { name: true, photo: true };
  const conditions = { status: WsBrandStatus.active };
  if (_id) Object.assign(conditions, { _id });

  const brands = await WsBrandModel.find(conditions, fields);
  return apiResponse(res, httpStatus.OK, { data: brands });
});

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

const getContents = catchAsync(async (req: Request, res: Response) => {
  const fields = {
    name: true,
    photo: true,
    description: true,
    page: true,
    position: true,
    bannerPlace: true,
    dataId: true,
  };

  const banners = await WsBannerModel.find(
    {
      status: WsBannerStatus.active,
      bannerPlace: {
        $in: [
          WsBannerPositions.heroSlider,
          WsBannerPositions.promoBanner,
          WsBannerPositions.adsBanner,
          WsBannerPositions.preFBanner
        ],
      },
    },
    fields
  );

  return apiResponse(res, httpStatus.OK, {
    data: {
      heroSlider: banners.filter(
        (item) => item.bannerPlace === WsBannerPositions.heroSlider
      ).sort((a, b) => (a.position || 0) - (b.position || 0)),
      promoBanner: banners.filter(
        (item) => item.bannerPlace === WsBannerPositions.promoBanner
      ).sort((a, b) => (a.position || 0) - (b.position || 0)),
      adsBanner: banners.filter(
        (item) => item.bannerPlace === WsBannerPositions.adsBanner
      ).sort((a, b) => (a.position || 0) - (b.position || 0)),
      preFBanner: banners.filter(
        (item) => item.bannerPlace === WsBannerPositions.preFBanner
      ).sort((a, b) => (a.position || 0) - (b.position || 0)),
    },
  });
});

export {
  getUser,
  getCountries,
  getCities,
  getLocations,
  getAreas,
  getCategories,
  getAuthors,
  getBrands,
  // getBanners,
  // getHighlights,
  getContents
};
