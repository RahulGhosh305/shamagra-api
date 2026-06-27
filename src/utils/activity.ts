import mongoose from "mongoose";
import validationError from "@utils/validationError";
import {UserActivityModel} from "@models/beUserActivity.model";

const generateActivity = async (params: {
    user: any,
    dataId: string,
    permission: string,
    title: string,
    description?: string,
    reason?: string
}) => {
    const content = { dataId: params.dataId, permission: params.permission, title: params.title };

    if (params.user) Object.assign(content, {user: params.user})
    if (params.description) Object.assign(content, {description: params.description})
    if (params.reason) Object.assign(content, {reason: params.reason})

    const newActivity = new UserActivityModel(content);

    const err = newActivity.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return null;
    }

    const save = await newActivity.save();
    if (save) return save;

    return null;
};

export { generateActivity };
