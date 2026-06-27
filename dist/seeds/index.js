"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeedRunnable = void 0;
const logger_1 = __importDefault(require("@config/logger"));
const beUser_seed_1 = require("./beUser.seed");
const beRole_seed_1 = require("./beRole.seed");
const bePermissions_seed_1 = require("./bePermissions.seed");
const runStep = async (name, fn) => {
    try {
        await fn();
        logger_1.default.info(`${name} success.`);
    }
    catch (error) {
        logger_1.default.error(`${name} failed.`);
        throw error;
    }
};
const updateSeedRunnable = async () => {
    try {
        await runStep("Role seeding", beRole_seed_1.addRole);
        await runStep("Permissions seeding", bePermissions_seed_1.addPermissions);
        await runStep("User seeding", beUser_seed_1.addUser);
    }
    catch (_a) {
        logger_1.default.error("Seeding stopped due to error");
    }
};
exports.updateSeedRunnable = updateSeedRunnable;
