"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.modelValidationCheck = exports.uniqueCheck = void 0;
const http_status_1 = __importDefault(require("http-status"));
const joi_1 = __importDefault(require("joi"));
const lodash_1 = require("lodash");
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const uniqueCheck = async (isUnique) => {
    let validationError = {};
    Object.keys(isUnique).forEach((key) => {
        validationError[key] = `"${isUnique[key]}" is already been taken.`;
    });
    return validationError;
};
exports.uniqueCheck = uniqueCheck;
const modelValidationCheck = async (errors) => {
    let validationError = {};
    errors &&
        Object.keys(errors).forEach((key) => {
            validationError[errors[key].path] = errors[key].message;
        });
    return validationError;
};
exports.modelValidationCheck = modelValidationCheck;
const validate = (schema) => async (req, res, next) => {
    const validSchema = (0, lodash_1.pick)(schema, ["params", "query", "body"]);
    const object = (0, lodash_1.pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: "key" } })
        .validate(object, { abortEarly: false });
    if (error) {
        const message = error && error.details && error.details.length ? error.details[0].message : "Validation Error!";
        const err = {};
        error.details.forEach((e) => {
            err[e.path[1]] = e.message.toString();
        });
        return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message }, err);
    }
    Object.assign(req, value);
    return next();
};
exports.validate = validate;
