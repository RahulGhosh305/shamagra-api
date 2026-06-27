import logger from "@config/logger";
import { UmRoleModel } from "@models/beUmRole.model";
import { ROLES, STATUS } from "@constant/app.constant";

export const addRole = async () => {
    try {
        const result = await UmRoleModel.updateOne(
            { name: ROLES.SUPER_ADMIN },
            {
                $setOnInsert: {
                    name: ROLES.SUPER_ADMIN,
                    description: "System Core Defined Role",
                    status: STATUS.ACTIVE,
                    isSystemDefined: true
                }
            },
            { upsert: true }
        );
        if (result.upsertedCount > 0) {
            logger.info(`${ROLES.SUPER_ADMIN} role created successfully.`);
        } else {
            logger.error(`${ROLES.SUPER_ADMIN} role already exists.`);
        }

    } catch (error) {
        logger.error(`${ROLES.SUPER_ADMIN} role creation failed.`);
        throw error;
    }
};