import express from "express";
const router = express.Router();
import { isAuthenticated, isScopePermitted } from "@middlewares/auth.middleware";
import {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    getVendors,
    getVendor,
    addVendor,

    getOrganizations,
    addOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
} from "src/controllers/back-end/clients.controllers";
import {
    getUsers as getUsersValidation,
    getUser as getUserValidation,
    addUser as addUserValidation,
    updateUser as updateUserValidation,
    deleteUser as deleteUserValidation,
    getVendors as getVendorsValidation,
    getVendor as getVendorValidation,
    addVendor as addVendorValidation,

    getOrganizations as getOrganizationsValidation,
    addOrganization as addOrganizationValidation,
    getOrganization as getOrganizationValidation,
    updateOrganization as updateOrganizationValidation,
    deleteOrganization as deleteOrganizationValidation,
} from "@validations/back-end/clients.validation";

router.get("/users", isAuthenticated, isScopePermitted('crm_clients_users_index'), getUsersValidation, getUsers);
router.get("/users/:_id", isAuthenticated, isScopePermitted('crm_clients_users_index'), getUserValidation, getUser);
router.post("/users", isAuthenticated, isScopePermitted('crm_clients_users_create'), addUserValidation, addUser);
router.put("/users/:_id", isAuthenticated, isScopePermitted('crm_clients_users_update'), updateUserValidation, updateUser);
router.delete("/users/:_id", isAuthenticated, isScopePermitted('crm_clients_users_delete'), deleteUserValidation, deleteUser);

router.get("/vendors", isAuthenticated, isScopePermitted('crm_clients_vendors_index'), getVendorsValidation, getVendors);
router.post("/vendors", isAuthenticated, isScopePermitted('crm_clients_vendors_create'), addVendorValidation, addVendor);
router.get("/vendors/:_id", isAuthenticated, isScopePermitted('crm_clients_vendors_index'), getVendorValidation, getVendor);

router.get("/organizations", isAuthenticated, isScopePermitted('crm_clients_organizations_index'), getOrganizationsValidation, getOrganizations);
router.post("/organizations", isAuthenticated, isScopePermitted('crm_clients_organizations_create'), addOrganizationValidation, addOrganization);
router.get("/organizations/:_id", isAuthenticated, isScopePermitted('crm_clients_organizations_index'), getOrganizationValidation, getOrganization);
router.put("/organizations/:_id", isAuthenticated, isScopePermitted('crm_clients_organizations_update'), updateOrganizationValidation, updateOrganization);
router.delete("/organizations/:_id", isAuthenticated, isScopePermitted('crm_clients_organizations_delete'), deleteOrganizationValidation, deleteOrganization);

export default router;
