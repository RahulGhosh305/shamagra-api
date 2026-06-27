import Joi from "joi";
import { validate } from "@utils/validate";

const register = validate({
    body: Joi.object({
        firstName: Joi.string().required().label(`"First Name" is required`),
        lastName: Joi.string().required().label(`"Last Name" is required`),
        email: Joi.string().required().label(`"Email" is required`),
        phone: Joi.string().allow(null, '').optional().label(`"Phone is required"`),
        password: Joi.string().min(6).required().label(`"Password" is required`),
    }),
});

const login = validate({
    body: Joi.object({
        email: Joi.string().allow(null, '').required(),
        password: Joi.string().allow(null, '').required().label(`"Password" is required`),
    }),
});

const changePassword = validate({
    body: Joi.object({
        newPassword: Joi.string().min(6).required(),
        currentPassword: Joi.string().min(6).required(),
    }),
});

const uploadProfilePhoto = validate({
    body: Joi.object({
        photo: Joi.string().required().label(`"Photo" is required`),
    }),
});

const removeProfilePhoto = validate({
    body: Joi.object({
        photo: Joi.string().required(),
    }),
});

const lostPassword = validate({
    body: Joi.object({
        email: Joi.string().required(),
    }),
});

const resetPassword = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        newPassword: Joi.string().required(),
    }),
});

const renew = validate({
    body: Joi.object({
        access: Joi.string().required(),
        refresh: Joi.string().required(),
        fcm: Joi.string().required(),
    }),
});

const closeAccount = validate({
    body: Joi.object({
        reason: Joi.string().required(),
    }),
});

const fileUpload = validate({
    body: Joi.object({
        file: Joi.string().required(),
    }),
});

export {
    register,
    login,
    changePassword,
    uploadProfilePhoto,
    removeProfilePhoto,
    lostPassword,
    resetPassword,
    renew,
    fileUpload,
    closeAccount
}
