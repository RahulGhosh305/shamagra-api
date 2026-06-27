"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeUserInfoByAccessToken = exports.getAccessTokenBeUserId = exports.getFeUserInfoByAccessToken = exports.getAccessTokenFeUserId = void 0;
const feOAuthAccessToken_model_1 = require("@models/feOAuthAccessToken.model");
const beOAuthAccessToken_model_1 = require("@models/beOAuthAccessToken.model");
const getAccessTokenFeUserId = async (req) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await feOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({ accessToken }, { user: true, _id: false });
        if (tokenInfo) {
            return tokenInfo.user._id;
        }
        else {
            return null;
        }
    }
    return null;
};
exports.getAccessTokenFeUserId = getAccessTokenFeUserId;
const getAccessTokenBeUserId = async (req) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await beOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({ accessToken }, { user: true, _id: false });
        if (tokenInfo) {
            return tokenInfo.user._id;
        }
        else {
            return null;
        }
    }
    return null;
};
exports.getAccessTokenBeUserId = getAccessTokenBeUserId;
const getFeUserInfoByAccessToken = async (req) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await feOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({ accessToken }, { user: true, _id: false }).populate('user._id', 'firstName lastName photo email phone');
        if (tokenInfo) {
            return tokenInfo.user._id;
        }
        else {
            return null;
        }
    }
    return null;
};
exports.getFeUserInfoByAccessToken = getFeUserInfoByAccessToken;
const getBeUserInfoByAccessToken = async (req) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if (accessToken) {
        const tokenInfo = await beOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({ accessToken }, { user: true, _id: false }).populate('user._id', 'firstName lastName phone photo email');
        if (tokenInfo) {
            return tokenInfo.user._id;
        }
        else {
            return null;
        }
    }
    return null;
};
exports.getBeUserInfoByAccessToken = getBeUserInfoByAccessToken;
