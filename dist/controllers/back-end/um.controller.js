"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getTeams = exports.addTeam = exports.getTeam = exports.deleteDepartment = exports.updateDepartment = exports.getDepartment = exports.addDepartment = exports.getDepartments = exports.updateRolesPermissions = exports.getRolesPermissions = exports.deleteUser = exports.getUser = exports.updateUser = exports.addUser = exports.getUsers = exports.updateRole = exports.deleteRole = exports.getRole = exports.getRoles = exports.addRole = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const beUmRole_model_1 = require("@models/beUmRole.model");
const beUmDepartment_model_1 = require("@models/beUmDepartment.model");
const beUmTeam_model_1 = require("@models/beUmTeam.model");
const beUmPermission_model_1 = require("@models/beUmPermission.model");
const beUser_model_1 = require("@models/beUser.model");
const feUser_model_1 = require("@models/feUser.model");
const addRole = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    const newRole = new beUmRole_model_1.UmRoleModel({ name, status, description, permissions: [] });
    const err = newRole.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }
    const save = await newRole.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Role Created" });
});
exports.addRole = addRole;
const updateRole = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    await beUmRole_model_1.UmRoleModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateRole = updateRole;
const getRoles = (0, catchAsync_1.default)(async (req, res) => {
    const roles = await beUmRole_model_1.UmRoleModel
        .find({ status: { $ne: beUmRole_model_1.UmRoleStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await beUmRole_model_1.UmRoleModel.countDocuments({ status: { $ne: beUmRole_model_1.UmRoleStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: roles };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getRoles = getRoles;
const getRole = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const roleInfo = await beUmRole_model_1.UmRoleModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: roleInfo });
});
exports.getRole = getRole;
const deleteRole = (0, catchAsync_1.default)(async (req, res) => {
    await beUmRole_model_1.UmRoleModel.updateOne({ _id: req.params._id }, { $set: { status: beUmRole_model_1.UmRoleStatus.deleted } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteRole = deleteRole;
//// User Functions ////
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await beUser_model_1.UserModel
        .find({ status: { $ne: beUser_model_1.UserStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await beUser_model_1.UserModel.countDocuments({ status: { $ne: beUser_model_1.UserStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: users };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getUsers = getUsers;
const addUser = (0, catchAsync_1.default)(async (req, res) => {
    var _a;
    const { roleId, vendorId } = req.body;
    const role = await beUmRole_model_1.UmRoleModel.findOne({ _id: roleId }, { name: true });
    const vendor = vendorId ? await feUser_model_1.UserModel.findOne({ _id: vendorId }, { services: true }).lean() : null;
    const personal = {
        fathersName: req.body.fathersName,
        fathersPhone: req.body.fathersPhone,
        mothersName: req.body.mothersName,
        mothersPhone: req.body.mothersPhone,
        presentAddress: req.body.presentAddress,
        permanentAddress: req.body.permanentAddress
    };
    const { firstName, lastName, phone, gender, email, username, superAdmin, status } = req.body;
    const content = { firstName, lastName, phone, gender, role, personal, email, username, superAdmin, status, password: 123456 };
    if (vendor)
        Object.assign(content, { vendor: Object.assign({ _id: vendorId }, (_a = vendor === null || vendor === void 0 ? void 0 : vendor.services) === null || _a === void 0 ? void 0 : _a.vendor) });
    const newUser = new beUser_model_1.UserModel(content);
    const err = newUser.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }
    const save = await newUser.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "User Created" });
});
exports.addUser = addUser;
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const userinfo = await beUser_model_1.UserModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: userinfo });
});
exports.getUser = getUser;
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    var _a;
    const { roleId, vendorId } = req.body;
    const role = await beUmRole_model_1.UmRoleModel.findOne({ _id: roleId });
    const vendor = vendorId ? await feUser_model_1.UserModel.findOne({ _id: vendorId }, { services: true }).lean() : null;
    const personal = {
        fathersName: req.body.fathersName,
        fathersPhone: req.body.fathersPhone,
        mothersName: req.body.mothersName,
        mothersPhone: req.body.mothersPhone,
        presentAddress: req.body.presentAddress,
        permanentAddress: req.body.permanentAddress
    };
    const { firstName, lastName, phone, gender, email, username, superAdmin, status } = req.body;
    const content = { firstName, lastName, phone, gender, role, personal, email, username, superAdmin, status };
    if (vendor)
        Object.assign(content, { vendor: Object.assign({ _id: vendorId }, (_a = vendor === null || vendor === void 0 ? void 0 : vendor.services) === null || _a === void 0 ? void 0 : _a.vendor) });
    await beUser_model_1.UserModel.updateOne({ _id: req.params._id }, { $set: content });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateUser = updateUser;
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    await beUser_model_1.UserModel.updateOne({ _id: req.params._id }, { status: beUser_model_1.UserStatus.deleted });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteUser = deleteUser;
// roles permissions
const getRolesPermissions = (0, catchAsync_1.default)(async (req, res) => {
    const checked = await beUmRole_model_1.UmRoleModel.findOne({ _id: req.params._id });
    const rolesPermissions = await beUmPermission_model_1.UmPermissionModel.find();
    const groupNames = [];
    await rolesPermissions.forEach((data) => groupNames.indexOf(data.group) === -1 ? groupNames.push(data.group) : '');
    const groups = [];
    await groupNames.forEach((data) => groups.push({ group: data, permissions: [], checked: [] }));
    await groups.forEach((group) => {
        rolesPermissions.forEach((permission) => {
            if (group.group === permission.group) {
                group.permissions.push({ label: permission.displayName, value: permission.name });
                if ((checked === null || checked === void 0 ? void 0 : checked.permissions.indexOf(permission.name)) !== -1) {
                    group.checked.push(permission.name);
                }
            }
        });
    });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: groups });
});
exports.getRolesPermissions = getRolesPermissions;
const updateRolesPermissions = (0, catchAsync_1.default)(async (req, res) => {
    const { roleId, permissions } = req.body;
    await beUmRole_model_1.UmRoleModel.updateOne({ _id: roleId }, { $set: { permissions } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateRolesPermissions = updateRolesPermissions;
// Department
const addDepartment = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    const newDepartment = new beUmDepartment_model_1.UmDepartmentModel({ name, status, description });
    const err = newDepartment.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }
    const save = await newDepartment.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Department Created" });
});
exports.addDepartment = addDepartment;
const updateDepartment = (0, catchAsync_1.default)(async (req, res) => {
    const { name, description, status } = req.body;
    await beUmDepartment_model_1.UmDepartmentModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateDepartment = updateDepartment;
const getDepartments = (0, catchAsync_1.default)(async (req, res) => {
    const departments = await beUmDepartment_model_1.UmDepartmentModel
        .find({ status: { $ne: beUmDepartment_model_1.UmDepartmentStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await beUmDepartment_model_1.UmDepartmentModel.countDocuments({ status: { $ne: beUmDepartment_model_1.UmDepartmentStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: departments };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getDepartments = getDepartments;
const getDepartment = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const departmentInfo = await beUmDepartment_model_1.UmDepartmentModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: departmentInfo });
});
exports.getDepartment = getDepartment;
const deleteDepartment = (0, catchAsync_1.default)(async (req, res) => {
    await beUmDepartment_model_1.UmDepartmentModel.updateOne({ _id: req.params._id }, { status: beUmDepartment_model_1.UmDepartmentStatus.deleted });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteDepartment = deleteDepartment;
// Teams
const addTeam = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    const newTeam = new beUmTeam_model_1.UmTeamModel({ name, status, description });
    const err = newTeam.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const validation = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }
    const save = await newTeam.save();
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, { data: save, message: "Team Created" });
});
exports.addTeam = addTeam;
const updateTeam = (0, catchAsync_1.default)(async (req, res) => {
    const { name, status, description } = req.body;
    await beUmTeam_model_1.UmTeamModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Updated" });
});
exports.updateTeam = updateTeam;
const getTeams = (0, catchAsync_1.default)(async (req, res) => {
    const teams = await beUmTeam_model_1.UmTeamModel
        .find({ status: { $ne: beUmTeam_model_1.UmTeamStatus.deleted } })
        .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
        .limit(parseInt(req.query.perPage))
        .sort({ createdAt: -1 });
    const total = await beUmTeam_model_1.UmTeamModel.countDocuments({ status: { $ne: beUmTeam_model_1.UmTeamStatus.deleted } });
    const response = { page: parseInt(req.query.page), perPage: parseInt(req.query.perPage), total, data: teams };
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: response });
});
exports.getTeams = getTeams;
const getTeam = (0, catchAsync_1.default)(async (req, res) => {
    const { _id } = req.params;
    const teamInfo = await beUmTeam_model_1.UmTeamModel.findOne({ _id });
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, { data: teamInfo });
});
exports.getTeam = getTeam;
const deleteTeam = (0, catchAsync_1.default)(async (req, res) => {
    await beUmTeam_model_1.UmTeamModel.updateOne({ _id: req.params._id }, { status: beUmTeam_model_1.UmTeamStatus.deleted });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Deleted" });
});
exports.deleteTeam = deleteTeam;
