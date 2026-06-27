import express, { Router } from "express";
import { isAuthenticated, isScopePermitted } from "@middlewares/auth.middleware";
import {
    addRole, getRoles, deleteRole, getRole, updateRole,
    getUsers, addUser, updateUser, getUser, deleteUser,
    getRolesPermissions, updateRolesPermissions
} from "src/controllers/back-end/um.controller";
import {
    getRoles as getRolesValidation, getRole as getRoleValidation, addRole as addRoleValidation, updateRole as updateRoleValidation, deleteRole as deleteRoleValidation,
    getRolesPermissions as getRolesPermissionsValidation, updateRolesPermissions as updateRolesPermissionsValidation,
    getUsers as getUsersValidation, addUser as addUserValidation, getUser as getUserValidation, updateUser as updateUserValidation, deleteUser as deleteUserValidation,
} from "../../validations/back-end/um.validation";

const router: Router = express.Router();

router.get("/roles", isAuthenticated, isScopePermitted('um_roles_index'), getRolesValidation, getRoles);
router.get("/roles/:_id", isAuthenticated, isScopePermitted('um_roles_index'), getRoleValidation, getRole);
router.post("/roles", isAuthenticated, isScopePermitted('um_roles_create'), addRoleValidation, addRole);
router.put("/roles/:_id", isAuthenticated, isScopePermitted('um_roles_update'), updateRoleValidation, updateRole);
router.delete("/roles/:_id", isAuthenticated, isScopePermitted('um_roles_delete'), deleteRoleValidation, deleteRole);

router.get("/roles-permissions/:_id", isAuthenticated, isScopePermitted('um_roles_permissions_index'), getRolesPermissionsValidation, getRolesPermissions);
router.put("/roles-permissions", isAuthenticated, isScopePermitted('um_roles_permissions_index'), updateRolesPermissionsValidation, updateRolesPermissions);

router.get("/users", isAuthenticated, isScopePermitted('um_users_index'), getUsersValidation, getUsers);
router.post("/users", isAuthenticated, isScopePermitted('um_users_create'), addUserValidation, addUser);
router.get("/users/:_id", isAuthenticated, isScopePermitted('um_users_index'), getUserValidation, getUser);
router.put("/users/:_id", isAuthenticated, isScopePermitted('um_users_update'), updateUserValidation, updateUser);
router.delete("/users/:_id", isAuthenticated, isScopePermitted('um_users_delete'), deleteUserValidation, deleteUser);

export default router;
