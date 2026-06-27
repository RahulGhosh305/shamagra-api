import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import validationError from "@utils/validationError";

import { UmRoleModel, UmRoleStatus } from "@models/beUmRole.model";
import { UmDepartmentModel, UmDepartmentStatus } from "@models/beUmDepartment.model";
import { UmTeamModel, UmTeamStatus } from "@models/beUmTeam.model";
import { UmPermissionModel } from "@models/beUmPermission.model";
import { UserModel, UserStatus } from "@models/beUser.model";
import { UserModel as FeUserModel, UserStatus as FeUserStatus } from "@models/feUser.model";

const addRole = catchAsync(async (req: Request, res: Response) => {
    const { name, status, description } = req.body;
    const newRole = new UmRoleModel({ name, status, description, permissions: [] });

    const err = newRole.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(
            res,
            httpStatus.NOT_ACCEPTABLE,
            { message: "Validation Required" },
            validation
        );
    }

    const save = await newRole.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "Role Created" });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
    const { name, status, description } = req.body;
    await UmRoleModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});

const getRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await UmRoleModel
        .find({ status: { $ne: UmRoleStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 });

    const total = await UmRoleModel.countDocuments({ status: { $ne: UmRoleStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: roles };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getRole = catchAsync(async (req: Request, res: Response) => {
    const { _id } = req.params;
    const roleInfo = await UmRoleModel.findOne({ _id });
    return apiResponse(res, httpStatus.OK, { data: roleInfo });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
    await UmRoleModel.updateOne({ _id: req.params._id }, { $set: { status: UmRoleStatus.deleted } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

//// User Functions ////
const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserModel
        .find({ status: { $ne: UserStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments({ status: { $ne: UserStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: users };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const addUser = catchAsync(async (req: Request, res: Response) => {
    const { roleId, vendorId } = req.body;
    const role = await UmRoleModel.findOne({ _id: roleId }, { name: true });
    const vendor = vendorId ? await FeUserModel.findOne({ _id: vendorId }, { services: true }).lean() : null;

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
    if (vendor) Object.assign(content, { vendor: { _id: vendorId, ...vendor?.services?.vendor } });

    const newUser = new UserModel(content);

    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }

    const save = await newUser.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "User Created" });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
    const { _id } = req.params;
    const userinfo = await UserModel.findOne({ _id });
    return apiResponse(res, httpStatus.OK, { data: userinfo });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { roleId, vendorId } = req.body;
    const role = await UmRoleModel.findOne({ _id: roleId });
    const vendor = vendorId ? await FeUserModel.findOne({ _id: vendorId }, { services: true }).lean() : null;

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
    if (vendor) Object.assign(content, { vendor: { _id: vendorId, ...vendor?.services?.vendor } });

    await UserModel.updateOne({ _id: req.params._id }, { $set: content });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    await UserModel.updateOne({ _id: req.params._id }, { status: UserStatus.deleted });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

// roles permissions
const getRolesPermissions = catchAsync(async (req: Request, res: Response) => {
    const checked = await UmRoleModel.findOne({ _id: req.params._id });
    const rolesPermissions = await UmPermissionModel.find();

    const groupNames: string[] = [];
    await rolesPermissions.forEach((data) => groupNames.indexOf(data.group) === -1 ? groupNames.push(data.group) : '');

    const groups: { group: string; permissions: { label: string; value: string }[]; checked: string[] }[] = [];
    await groupNames.forEach((data) => groups.push({ group: data, permissions: [], checked: [] }));

    await groups.forEach((group) => {
        rolesPermissions.forEach((permission) => {
            if (group.group === permission.group) {
                group.permissions.push({ label: permission.displayName, value: permission.name });
                if (checked?.permissions.indexOf(permission.name) !== -1) {
                    group.checked.push(permission.name);
                }
            }
        });
    });

    return apiResponse(res, httpStatus.OK, { data: groups });
});

const updateRolesPermissions = catchAsync(async (req: Request, res: Response) => {
    const { roleId, permissions } = req.body;
    await UmRoleModel.updateOne({ _id: roleId }, { $set: { permissions } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});


// Teams
// const addTeam = catchAsync(async (req: Request, res: Response) => {
//     const { name, status, description } = req.body;
//     const newTeam = new UmTeamModel({ name, status, description });

//     const err = newTeam.validateSync();
//     if (err instanceof mongoose.Error) {
//         const validation = await validationError.requiredCheck(err.errors);
//         return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
//     }

//     const save = await newTeam.save();
//     return apiResponse(res, httpStatus.CREATED, { data: save, message: "Team Created" });
// });

// const updateTeam = catchAsync(async (req: Request, res: Response) => {
//     const { name, status, description } = req.body;
//     await UmTeamModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
//     return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
// });

// const getTeams = catchAsync(async (req: Request, res: Response) => {
//     const teams = await UmTeamModel
//         .find({ status: { $ne: UmTeamStatus.deleted } })
//         .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
//         .limit(parseInt(req.query.perPage as string))
//         .sort({ createdAt: -1 });

//     const total = await UmTeamModel.countDocuments({ status: { $ne: UmTeamStatus.deleted } });
//     const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: teams };
//     return apiResponse(res, httpStatus.OK, { data: response });
// });

// const getTeam = catchAsync(async (req: Request, res: Response) => {
//     const { _id } = req.params;
//     const teamInfo = await UmTeamModel.findOne({ _id });
//     return apiResponse(res, httpStatus.OK, { data: teamInfo });
// });

// const deleteTeam = catchAsync(async (req: Request, res: Response) => {
//     await UmTeamModel.updateOne({ _id: req.params._id }, { status: UmTeamStatus.deleted });
//     return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
// });

export {
    addRole, getRoles, getRole, deleteRole, updateRole,
    getUsers, addUser, updateUser, getUser, deleteUser,
    getRolesPermissions, updateRolesPermissions
};
