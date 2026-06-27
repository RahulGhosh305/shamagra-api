import express, { Router } from "express";
import { isAuthenticated } from "@middlewares/auth.middleware";
import {
    getRoles,
    getUser,
    getCountries,
    getCities,
    getLocations,
    getCategories,
    getSubCategories,
    getBrands,
    getVendors,
    getUsers,
    getOrganizations
} from "src/controllers/back-end/utilities.controller";

const router: Router = express.Router();

router.get("/roles", isAuthenticated, getRoles);
router.get("/user", isAuthenticated, getUser);
router.get("/countries", isAuthenticated, getCountries);
router.get("/cities", isAuthenticated, getCities);
router.get("/locations", isAuthenticated, getLocations);
router.get("/categories", isAuthenticated, getCategories);
router.get("/sub-categories", isAuthenticated, getSubCategories);
router.get("/brands", isAuthenticated, getBrands);
router.get("/vendors", isAuthenticated, getVendors);
router.get("/users", isAuthenticated, getUsers);
router.get("/organizations", isAuthenticated, getOrganizations);

export default router;