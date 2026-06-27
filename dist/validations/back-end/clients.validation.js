"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getOrganization = exports.addOrganization = exports.getOrganizations = exports.addVendor = exports.getVendor = exports.getVendors = exports.addUser = exports.getUser = exports.getUsers = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const getUsers = (0, validate_1.validate)({
    query: joi_1.default.object({
        cityIds: joi_1.default.string().optional().allow("").allow(null),
        locationIds: joi_1.default.string().optional().allow("").allow(null),
        createdAtFrom: joi_1.default.string().optional().allow("").allow(null),
        createdAtTo: joi_1.default.string().optional().allow("").allow(null),
        agentNumber: joi_1.default.string().optional().allow("").allow(null),
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getUsers = getUsers;
const getUser = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getUser = getUser;
const addUser = (0, validate_1.validate)({
    body: joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        countryId: joi_1.default.string().required(),
        phone: joi_1.default.string().required(),
        gender: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
    })
});
exports.addUser = addUser;
const getVendors = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getVendors = getVendors;
const getVendor = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getVendor = getVendor;
const addVendor = (0, validate_1.validate)({
    body: joi_1.default.object({
        organizationId: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
        department: joi_1.default.string().required().allow("").allow(null),
        employeeId: joi_1.default.string().required().allow("").allow(null),
        designation: joi_1.default.string().required().allow("").allow(null),
        overview: joi_1.default.string().required().allow("").allow(null),
    })
});
exports.addVendor = addVendor;
const getOrganizations = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getOrganizations = getOrganizations;
const addOrganization = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.addOrganization = addOrganization;
const getOrganization = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getOrganization = getOrganization;
const updateOrganization = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.updateOrganization = updateOrganization;
const deleteOrganization = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.deleteOrganization = deleteOrganization;
