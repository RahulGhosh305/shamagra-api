import { OAuthAccessTokenModel as FeOAuthAccessTokenModel } from "@models/feOAuthAccessToken.model";
import { OAuthAccessTokenModel as BeOAuthAccessTokenModel } from "@models/beOAuthAccessToken.model";

const getAccessTokenFeUserId = async (req: any) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await FeOAuthAccessTokenModel.findOne(
            { accessToken },
            { user: true, _id: false }
        );
        if (tokenInfo) {
            return tokenInfo.user._id;
        } else {
            return null;
        }
    }
    return null;
};

const getAccessTokenBeUserId = async (req: any) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await BeOAuthAccessTokenModel.findOne(
            { accessToken },
            { user: true, _id: false }
        );
        if (tokenInfo) {
            return tokenInfo.user._id;
        } else {
            return null;
        }
    }
    return null;
};

const getFeUserInfoByAccessToken = async (req: any) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await FeOAuthAccessTokenModel.findOne(
            { accessToken },
            { user: true, _id: false }
        ).populate('user._id', 'firstName lastName photo email phone');
        if (tokenInfo) {
            return tokenInfo.user._id;
        } else {
            return null;
        }
    }
    return null;
};

const getBeUserInfoByAccessToken = async (req: any) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await BeOAuthAccessTokenModel.findOne(
            { accessToken },
            { user: true, _id: false }
        ).populate('user._id', 'firstName lastName phone photo email');
        if (tokenInfo) {
            return tokenInfo.user._id;
        } else {
            return null;
        }
    }
    return null;
};

export {
    getAccessTokenFeUserId,
    getFeUserInfoByAccessToken,
    getAccessTokenBeUserId,
    getBeUserInfoByAccessToken
};
