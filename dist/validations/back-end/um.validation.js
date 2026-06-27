"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getTeam = exports.addTeam = exports.getTeams = exports.deleteDepartment = exports.updateDepartment = exports.getDepartment = exports.addDepartment = exports.getDepartments = exports.deleteUser = exports.updateUser = exports.getUser = exports.addUser = exports.getUsers = exports.updateRolesPermissions = exports.getRolesPermissions = exports.deleteRole = exports.updateRole = exports.addRole = exports.getRole = exports.getRoles = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("@utils/validate");
const getRoles = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getRoles = getRoles;
const getRole = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getRole = getRole;
const addRole = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.addRole = addRole;
const updateRole = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.updateRole = updateRole;
const deleteRole = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.deleteRole = deleteRole;
const getRolesPermissions = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getRolesPermissions = getRolesPermissions;
const updateRolesPermissions = (0, validate_1.validate)({
    body: joi_1.default.object({
        roleId: joi_1.default.string().required(),
        permissions: joi_1.default.array().items(joi_1.default.string().required())
    })
});
exports.updateRolesPermissions = updateRolesPermissions;
const addUser = (0, validate_1.validate)({
    body: joi_1.default.object({
        roleId: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        phone: joi_1.default.number().required(),
        gender: joi_1.default.string().required(),
        fathersName: joi_1.default.string().allow(''),
        fathersPhone: joi_1.default.number().allow(''),
        mothersName: joi_1.default.string().allow(''),
        mothersPhone: joi_1.default.string().allow(''),
        presentAddress: joi_1.default.string().allow(''),
        permanentAddress: joi_1.default.string().allow(''),
        email: joi_1.default.string().email().required(),
        username: joi_1.default.string().required(),
        superAdmin: joi_1.default.boolean().required(),
        vendorId: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.addUser = addUser;
const getUser = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getUser = getUser;
const updateUser = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        roleId: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        phone: joi_1.default.number().required(),
        gender: joi_1.default.string().required(),
        fathersName: joi_1.default.string().allow(""),
        fathersPhone: joi_1.default.number().allow(""),
        mothersName: joi_1.default.string().allow(""),
        mothersPhone: joi_1.default.string().allow(""),
        presentAddress: joi_1.default.string().allow(""),
        permanentAddress: joi_1.default.string().allow(""),
        email: joi_1.default.string().email().required(),
        username: joi_1.default.string().required(),
        superAdmin: joi_1.default.boolean().required(),
        vendorId: joi_1.default.string().required().allow(null).allow(""),
        status: joi_1.default.string().required(),
    })
});
exports.updateUser = updateUser;
const deleteUser = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.deleteUser = deleteUser;
const getUsers = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getUsers = getUsers;
const getDepartments = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getDepartments = getDepartments;
const addDepartment = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.addDepartment = addDepartment;
const getDepartment = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getDepartment = getDepartment;
const updateDepartment = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.deleteDepartment = deleteDepartment;
const getTeams = (0, validate_1.validate)({
    query: joi_1.default.object({
        page: joi_1.default.string().optional(),
        perPage: joi_1.default.string().optional(),
    })
});
exports.getTeams = getTeams;
const addTeam = (0, validate_1.validate)({
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.addTeam = addTeam;
const getTeam = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.getTeam = getTeam;
const updateTeam = (0, validate_1.validate)({
    body: joi_1.default.object({
        _id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    })
});
exports.updateTeam = updateTeam;
const deleteTeam = (0, validate_1.validate)({
    params: joi_1.default.object({
        _id: joi_1.default.string().required(),
    })
});
exports.deleteTeam = deleteTeam;
