import validationError from "@utils/validationError";
import { UserModel } from "@models/beUser.model";
import { UmRoleModel } from "@models/beUmRole.model";
import logger from "@config/logger";
import { ROLES } from "@constant/app.constant";

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

export const addUser = async () => {
    try {
        const role = await UmRoleModel.findOne({ name: ROLES.SUPER_ADMIN });

        if (!role) {
            throw new Error(`${ROLES.SUPER_ADMIN} role not found.`);
        }

        const userContent = {
            firstName: "Rahul",
            lastName: "Ghosh",
            username: "rghosh",
            password: "123456",
            phone: "01521450727",
            email: "rahul.info305@gmail.com",
        };

        const user = new UserModel({
            ...userContent,
            role: {
                _id: role._id,
                name: role.name
            },
            superAdmin: role.name === ROLES.SUPER_ADMIN ? true : false,
        });

        // @ts-ignore
        const isUnique = await UserModel.isUnique(
            userContent.username,
            userContent.email
        );

        const validation = await validationError.uniqueCheck(isUnique);

        if (Object.keys(validation).length > 0) {
            logger.error(`${ROLES.SUPER_ADMIN} validation error.`);
            return;
        }

        const newUser = await user.save();
        console.log(newUser);
        logger.info(`${ROLES.SUPER_ADMIN} user created.`);

    } catch (error) {
        logger.error(`${ROLES.SUPER_ADMIN} user creation failed.`);
        throw error;
    }
};