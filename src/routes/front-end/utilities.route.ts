import express, { Router } from "express";
import {
  isAuthenticated,
  isClientAuthenticated,
} from "@middlewares/auth.middleware";
import {
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
} from "src/controllers/front-end/utilities.controller";

const router: Router = express.Router();

router.get("/user", isAuthenticated, getUser);
router.get("/countries", isClientAuthenticated, getCountries);
router.get("/cities", isClientAuthenticated, getCities);
router.get("/locations", isClientAuthenticated, getLocations);
router.get("/areas", isClientAuthenticated, getAreas);
router.get("/categories", isClientAuthenticated, getCategories);
router.get("/authors", isClientAuthenticated, getAuthors);
router.get("/brands", isClientAuthenticated, getBrands);
// router.get("/banners", isClientAuthenticated, getBanners);
// router.get("/banners", getBanners);
// router.get("/highlights", getHighlights);
router.get("/contents", getContents);

export default router;
