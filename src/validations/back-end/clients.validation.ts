import Joi from "joi";
import { validate } from "@utils/validate";

const getUsers = validate({
    query: Joi.object({
        cityIds: Joi.string().optional().allow("").allow(null),
        locationIds: Joi.string().optional().allow("").allow(null),
        createdAtFrom: Joi.string().optional().allow("").allow(null),
        createdAtTo: Joi.string().optional().allow("").allow(null),
        agentNumber: Joi.string().optional().allow("").allow(null),
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getUser = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const addUser = validate({
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        countryId: Joi.string().optional().allow("").allow(null),
        phone: Joi.string().required(),
        gender: Joi.string().required(),
        email: Joi.string().required(),
    })
});

const updateUser = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        countryId: Joi.string().optional().allow("").allow(null),
        phone: Joi.string().required(),
        gender: Joi.string().required(),
        email: Joi.string().required(),
    })
});

const deleteUser = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const getVendors = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getVendor = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const addVendor = validate({
    body: Joi.object({
        organizationId: Joi.string().required(),
        userId: Joi.string().required(),
        department: Joi.string().required().allow("").allow(null),
        employeeId: Joi.string().required().allow("").allow(null),
        designation: Joi.string().required().allow("").allow(null),
        overview: Joi.string().required().allow("").allow(null),
    })
});

const getOrganizations = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const addOrganization = validate({
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const getOrganization = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

const updateOrganization = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const deleteOrganization = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    })
});

export {
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
}
