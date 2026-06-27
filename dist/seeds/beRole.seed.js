"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRole = void 0;
const logger_1 = __importDefault(require("@config/logger"));
const beUmRole_model_1 = require("@models/beUmRole.model");
const app_constant_1 = require("@constant/app.constant");
const addRole = async () => {
    try {
        const result = await beUmRole_model_1.UmRoleModel.updateOne({ name: app_constant_1.ROLES.SUPER_ADMIN }, {
            $setOnInsert: {
                name: app_constant_1.ROLES.SUPER_ADMIN,
                description: "System Core Defined Role",
                status: app_constant_1.STATUS.ACTIVE,
                isSystemDefined: true
            }
        }, { upsert: true });
        if (result.upsertedCount > 0) {
            logger_1.default.info(`${app_constant_1.ROLES.SUPER_ADMIN} role created successfully.`);
        }
        else {
            logger_1.default.error(`${app_constant_1.ROLES.SUPER_ADMIN} role already exists.`);
        }
    }
    catch (error) {
        logger_1.default.error(`${app_constant_1.ROLES.SUPER_ADMIN} role creation failed.`);
        throw error;
    }
};
exports.addRole = addRole;
