import { Request, Response } from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import validationError from "@utils/validationError";

import {UserModel, UserServicesStatus, UserStatus} from "@models/feUser.model";
import {UserModel as BeUserModel} from "@models/beUser.model";
import {OrganizationModel, OrganizationStatus} from "@models/feOrganization.model";
import {CrmPaymentModel} from "@models/feCrmPayment.model";
import {CrmAcquisitionLeadModel, CrmAcquisitionLeadStatus} from "@models/feCrmAcquisitionLead.model";
import {WsCountryModel} from "@models/feWsCountry.model";
import {UmRoleModel} from "@models/beUmRole.model";

const getUsers = catchAsync(async (req: Request, res: Response) => {
    const {cityIds, locationIds, createdAtFrom, createdAtTo, agentNumber} = req.query;

    const conditions = { status: { $ne: UserStatus.deleted } } as any;
    if (cityIds) Object.assign(conditions, {"city._id": cityIds})
    if (locationIds) Object.assign(conditions, {"location._id": locationIds})
    if (agentNumber) Object.assign(conditions, {"phone.phone": agentNumber})

    if (createdAtFrom && typeof createdAtFrom === "string") Object.assign(conditions, { createdAt: { $gte: new Date(`${new Date(createdAtFrom).toLocaleDateString('fr-CA')}T00:00:00.0Z`) } })
    if (createdAtTo && typeof createdAtTo === "string") Object.assign(conditions, { createdAt: { ...conditions.createdAt, $lte: new Date(`${new Date(createdAtTo).toLocaleDateString('fr-CA')}T23:59:59.0Z`) } })

    const users = await UserModel
        .find(conditions)
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 })
        .lean();

    const total = await UserModel.countDocuments(conditions);
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: users };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserModel
        .findOne({ _id: req.params._id })
        .lean();

    const transactions = await CrmPaymentModel.find({"user._id": req.params._id}).lean();

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        Object.assign(transaction, {lead: await CrmAcquisitionLeadModel.findOne({_id: transaction.leadId}, {"acquisition.name": true})})
    }

    if (user) Object.assign(user, {transactions});

    return apiResponse(res, httpStatus.OK, { data: user });
});

const addUser = catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, countryId, phone, gender, email } = req.body;
    const country = await WsCountryModel.findOne({_id: countryId}, {name: true, code: true});

    let user = await UserModel.findOne(
        {
            "phone.country._id": country?._id,
            "phone.phone": phone,
            status: UserStatus.active
        },
        {
            firstName: true,
            lastName: true,
            photo: true,
        }
    );

    if (user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "This user already exists on the system!"});

    const newUser = new UserModel({firstName, lastName, phone: {country: country, phone}, gender, email});

    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const valid = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Validation Required"}, valid);
    }

    const save = await newUser.save()
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "User Created" });
});

const addVendor = catchAsync(async (req: Request, res: Response) => {
    const { organizationId, userId, department, designation, employeeId, overview } = req.body;
    const organization = await OrganizationModel.findOne({_id: organizationId}, {name: true}).lean();

    const update = await UserModel.updateOne({_id: userId}, {
        "services.vendor.isVendor": true,
        "services.vendor.organization": organization,
        "services.vendor.department": department,
        "services.vendor.employeeId": employeeId,
        "services.vendor.designation": designation,
        "services.vendor.overview": overview,
        "services.vendor.status": UserServicesStatus.approved
    })

    let user = await UserModel.findOne({_id: userId}).lean();
    const role = await UmRoleModel.findOne({_id: "6555c72a669a5dbc8adc2d11", isSystemDefined: true}, {name: true})

    console.log(role)

    const newUser = new BeUserModel({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        photo: user?.photo ?? "",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        gender: user?.gender?.toLowerCase() ?? "",
        password: "123456",
        superAdmin: false,
        username: user?.email ?? "",
        role,
        vendor: {_id: user?._id, ...user?.services?.vendor}
    });

    console.log(newUser)

    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const valid = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Validation Required"}, valid);
    }

    const save = await newUser.save()
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "User Created" });
});

const getVendors = catchAsync(async (req: Request, res: Response) => {
    const vendors = await UserModel
        .find({ "services.vendor.isVendor": true, status: { $ne: UserStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 })
        .lean();

    const total = await UserModel.countDocuments({ "services.vendor.isVendor": true, status: { $ne: UserStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: vendors };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getVendor = catchAsync(async (req: Request, res: Response) => {
    const vendor = await UserModel
        .findOne({ _id: req.params._id })
        .lean();

    const organizationId = vendor?.services?.vendor?.organization?._id ?? null;

    // const savingsPackages = await CrmSavingsPackageModel.find({"organization._id": organizationId}).lean();
    // const loanPackages = await CrmLoanPackageModel.find({"organization._id": organizationId}).lean();
    // const savingsApplications = await CrmSavingsApplicationModel.find({"package.organization._id": organizationId}).lean();
    // const loanApplications = await CrmLoanApplicationModel.find({"package.organization._id": organizationId}).lean();
    //
    // if (vendor) Object.assign(vendor, {
    //     packages: {savings: savingsPackages, loan: loanPackages},
    //     applications: {savings: savingsApplications, loan: loanApplications}
    // })

    return apiResponse(res, httpStatus.OK, { data: vendor });
});

// Organizations
const addOrganization = catchAsync(async (req: Request, res: Response) => {
    const { name, status, description } = req.body;

    const newOrganization = new OrganizationModel({ name, status, description });

    const err = newOrganization.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: "Validation Required" }, validation);
    }

    const save = await newOrganization.save();
    return apiResponse(res, httpStatus.CREATED, { data: save, message: "Organization Created" });
});

const updateOrganization = catchAsync(async (req: Request, res: Response) => {
    const { name, description, status } = req.body;

    await OrganizationModel.updateOne({ _id: req.params._id }, { $set: { name, status, description } });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Updated" });
});

const getOrganizations = catchAsync(async (req: Request, res: Response) => {
    const organizations = await OrganizationModel
        .find({ status: { $ne: OrganizationStatus.deleted } })
        .skip(parseInt(req.query.perPage as string) * (parseInt(req.query.page as string) - 1))
        .limit(parseInt(req.query.perPage as string))
        .sort({ createdAt: -1 });
    const total = await OrganizationModel.countDocuments({ status: { $ne: OrganizationStatus.deleted } });
    const response = { page: parseInt(req.query.page as string), perPage: parseInt(req.query.perPage as string), total, data: organizations };
    return apiResponse(res, httpStatus.OK, { data: response });
});

const getOrganization = catchAsync(async (req: Request, res: Response) => {
    const { _id } = req.params;
    const organizationInfo = await OrganizationModel.findOne({ _id });
    return apiResponse(res, httpStatus.OK, { data: organizationInfo });
});

const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
    await OrganizationModel.updateOne({ _id: req.params._id }, { status: OrganizationStatus.deleted });
    return apiResponse(res, httpStatus.ACCEPTED, { message: "Deleted" });
});

export {
    getUsers,
    getUser,
    addUser,
    getVendors,
    getVendor,
    addVendor,

    getOrganizations,
    addOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
};
