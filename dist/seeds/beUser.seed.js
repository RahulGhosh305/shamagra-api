"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const validationError_1 = __importDefault(require("@utils/validationError"));
const beUser_model_1 = require("@models/beUser.model");
const beUmRole_model_1 = require("@models/beUmRole.model");
const logger_1 = __importDefault(require("@config/logger"));
const app_constant_1 = require("@constant/app.constant");
// export const addSuperAdmin = () => {
//     setTimeout(async () => {
//         const userContent = {
//             firstName: "Rahul",
//             lastName: "Ghosh",
//             username: "rghosh",
//             password: "123456",
//             phone: "01521450727",
//             email: "rahul.info305@gmail.com",
//             superAdmin: true,
//         };
//         const user = new UserModel(userContent);
//         const role = await UmRoleModel.findOne({ name: "Super Admin" });
//         // @ts-ignore
//         const validation = await validationError.uniqueCheck(await UserModel.isUnique(userContent.username, userContent.email));
//         if (Object.keys(validation).length === 0) {
//             const newUser = await user.save();
//             console.log(newUser);
//         } else {
//             console.log(validation);
//         }
//     }, 1100);
// }
const addUser = async () => {
    try {
        const role = await beUmRole_model_1.UmRoleModel.findOne({ name: app_constant_1.ROLES.SUPER_ADMIN });
        if (!role) {
            throw new Error(`${app_constant_1.ROLES.SUPER_ADMIN} role not found.`);
        }
        const userContent = {
            firstName: "Rahul",
            lastName: "Ghosh",
            username: "rghosh",
            password: "123456",
            phone: "01521450727",
            email: "rahul.info305@gmail.com",
        };
        const user = new beUser_model_1.UserModel(Object.assign(Object.assign({}, userContent), { role: {
                _id: role._id,
                name: role.name
            }, superAdmin: role.name === app_constant_1.ROLES.SUPER_ADMIN ? true : false }));
        // @ts-ignore
        const isUnique = await beUser_model_1.UserModel.isUnique(userContent.username, userContent.email);
        const validation = await validationError_1.default.uniqueCheck(isUnique);
        if (Object.keys(validation).length > 0) {
            logger_1.default.error(`${app_constant_1.ROLES.SUPER_ADMIN} validation error.`);
            return;
        }
        const newUser = await user.save();
        console.log(newUser);
        logger_1.default.info(`${app_constant_1.ROLES.SUPER_ADMIN} user created.`);
    }
    catch (error) {
        logger_1.default.error(`${app_constant_1.ROLES.SUPER_ADMIN} user creation failed.`);
        throw error;
    }
};
exports.addUser = addUser;
