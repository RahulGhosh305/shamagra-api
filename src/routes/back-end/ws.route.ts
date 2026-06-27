import express, { Router } from "express";
import { isAuthenticated, isScopePermitted } from "@middlewares/auth.middleware";
import {
    addAuthor, getAuthors, getAuthor, updateAuthor, deleteAuthor,
    addBanner, getBanners, deleteBanner, getBanner, updateBanner,
    addCategory, getCategories, getCategory, updateCategory, deleteCategory,
    addSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory,
} from "src/controllers/back-end/ws.controller";
import {
    getAuthors as getAuthorsValidation, getAuthor as getAuthorValidation, addAuthor as addAuthorValidation, updateAuthor as updateAuthorValidation, deleteAuthor as deleteAuthorValidation,
    getBanners as getBannersValidation, getBanner as getBannerValidation, addBanner as addBannerValidation, updateBanner as updateBannerValidation, deleteBanner as deleteBannerValidation,
    getCategories as getCategoriesValidation, getCategory as getCategoryValidation, addCategory as addCategoryValidation, updateCategory as updateCategoryValidation, deleteCategory as deleteCategoryValidation,
    getSubCategories as getSubCategoriesValidation, getSubCategory as getSubCategoryValidation, addSubCategory as addSubCategoryValidation, updateSubCategory as updateSubCategoryValidation, deleteSubCategory as deleteSubCategoryValidation,
} from "@validations/back-end/ws.validation";

const router: Router = express.Router();

router.get("/banners", isAuthenticated, isScopePermitted('ws_banners_index'), getBannersValidation, getBanners);
router.get("/banners/:id", isAuthenticated, isScopePermitted('ws_banners_index'), getBannerValidation, getBanner);
router.post("/banners", isAuthenticated, isScopePermitted('ws_banners_create'), addBannerValidation, addBanner);
router.put("/banners/:id", isAuthenticated, isScopePermitted('ws_banners_update'), updateBannerValidation, updateBanner);
router.delete("/banners/:id", isAuthenticated, isScopePermitted('ws_banners_delete'), deleteBannerValidation, deleteBanner);

router.get("/categories", isAuthenticated, isScopePermitted('ws_categories_index'), getCategoriesValidation, getCategories);
router.get("/categories/:id", isAuthenticated, isScopePermitted('ws_categories_index'), getCategoryValidation, getCategory);
router.post("/categories", isAuthenticated, isScopePermitted('ws_categories_create'), addCategoryValidation, addCategory);
router.put("/categories/:id", isAuthenticated, isScopePermitted('ws_categories_update'), updateCategoryValidation, updateCategory);
router.delete("/categories/:id", isAuthenticated, isScopePermitted('ws_categories_delete'), deleteCategoryValidation, deleteCategory);

router.get("/authors", isAuthenticated, isScopePermitted('ws_authors_index'), getAuthorsValidation, getAuthors);
router.get("/authors/:id", isAuthenticated, isScopePermitted('ws_authors_index'), getAuthorValidation, getAuthor);
router.post("/authors", isAuthenticated, isScopePermitted('ws_authors_create'), addAuthorValidation, addAuthor);
router.put("/authors/:id", isAuthenticated, isScopePermitted('ws_authors_update'), updateAuthorValidation, updateAuthor);
router.delete("/authors/:id", isAuthenticated, isScopePermitted('ws_authors_delete'), deleteAuthorValidation, deleteAuthor);

router.get("/sub-categories", isAuthenticated, isScopePermitted('ws_sub_categories_index'), getSubCategoriesValidation, getSubCategories);
router.get("/sub-categories/:id", isAuthenticated, isScopePermitted('ws_sub_categories_index'), getSubCategoryValidation, getSubCategory);
router.post("/sub-categories", isAuthenticated, isScopePermitted('ws_sub_categories_create'), addSubCategoryValidation, addSubCategory);
router.put("/sub-categories/:id", isAuthenticated, isScopePermitted('ws_sub_categories_update'), updateSubCategoryValidation, updateSubCategory);
router.delete("/sub-categories/:id", isAuthenticated, isScopePermitted('ws_sub_categories_delete'), deleteSubCategoryValidation, deleteSubCategory);

export default router;
