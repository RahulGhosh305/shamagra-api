import Joi from "joi";
import { validate } from "@utils/validate";

const login = validate({
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
});

const changePassword = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        password: Joi.string().required(),
        currentPassword: Joi.string().required(),
    }),
});

export {
    login,
    changePassword
}
