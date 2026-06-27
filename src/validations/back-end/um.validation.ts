import Joi from "joi";
import { validate } from "@utils/validate";

const getRoles = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getRole = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const addRole = validate({
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const updateRole = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const deleteRole = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const getRolesPermissions = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const updateRolesPermissions = validate({
    body: Joi.object({
        roleId: Joi.string().required(),
        permissions: Joi.array().items(Joi.string().required())
    })
});

const addUser = validate({
    body: Joi.object({
        roleId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.number().required(),
        gender: Joi.string().required(),
        fathersName: Joi.string().allow(''),
        fathersPhone: Joi.number().allow(''),
        mothersName: Joi.string().allow(''),
        mothersPhone: Joi.string().allow(''),
        presentAddress: Joi.string().allow(''),
        permanentAddress: Joi.string().allow(''),
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        superAdmin: Joi.boolean().required(),
        vendorId: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const getUser = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const updateUser = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        roleId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.number().required(),
        gender: Joi.string().required(),
        fathersName: Joi.string().allow(""),
        fathersPhone: Joi.number().allow(""),
        mothersName: Joi.string().allow(""),
        mothersPhone: Joi.string().allow(""),
        presentAddress: Joi.string().allow(""),
        permanentAddress: Joi.string().allow(""),
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        superAdmin: Joi.boolean().required(),
        vendorId: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const deleteUser = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const getUsers = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});


export {
    getRoles,
    getRole,
    addRole,
    updateRole,
    deleteRole,

    getRolesPermissions,
    updateRolesPermissions,

    getUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser,
}
