import mongoose from "mongoose";
import validationError from "@utils/validationError";
import {UserNotificationModel} from "@models/feUserNotification.model";

const generateNotification = async (params: {
    user: any,
    dataId: string,
    title: string,
    description: string,
    thumbnail?: string,
    type?: string,
    isRedirect?: boolean,
}) => {
    const content = { dataId: params.dataId, title: params.title, description: params.description };

    if (params.user) Object.assign(content, {receiver: params.user})
    if (params.thumbnail) Object.assign(content, {thumbnail: params.thumbnail})
    if (params.type) Object.assign(content, {type: params.type})
    if (params.isRedirect) Object.assign(content, {isRedirect: params.isRedirect})

    console.log(content)

    const newNotification = new UserNotificationModel(content);

    const err = newNotification.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return null;
    }

    const save = await newNotification.save();
    if (save) return save;

    return null;
};

export {generateNotification};
