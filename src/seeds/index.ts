import logger from "@config/logger";
import { addUser } from "./beUser.seed";
import { addRole } from "./beRole.seed";
import { addPermissions } from "./bePermissions.seed";

const runStep = async (name: string, fn: Function) => {
    try {
        await fn();
        logger.info(`${name} success.`);
    } catch (error: any) {
        logger.error(`${name} failed.`);
        throw error;
    }
};

export const updateSeedRunnable = async (): Promise<void> => {
    try {
        await runStep("Role seeding", addRole);
        await runStep("Permissions seeding", addPermissions);
        await runStep("User seeding", addUser);
    } catch {
        logger.error("Seeding stopped due to error");
    }
};