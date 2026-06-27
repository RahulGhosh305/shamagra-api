"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScopePermitted = exports.isClientAuthenticated = exports.isAuthenticated = void 0;
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiError_1 = __importDefault(require("@utils/apiError"));
const beOAuthAccessToken_model_1 = require("@models/beOAuthAccessToken.model");
const beOAuthRefreshToken_model_1 = require("@models/beOAuthRefreshToken.model");
const feOAuthAccessToken_model_1 = require("@models/feOAuthAccessToken.model");
const feOAuthRefreshToken_model_1 = require("@models/feOAuthRefreshToken.model");
const beUser_model_1 = require("@models/beUser.model");
const beUmRole_model_1 = require("@models/beUmRole.model");
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
    var _a, _b;
    if (err || !info || !user) {
        const error = new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Session expired. Please login again.');
        return reject(error);
    }
    if (info.platform) {
        if (info.platform === 'front-end') {
            const oAuthTokenDetail = await feOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({
                accessToken: (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1],
                revoked: false,
                expires: { $gte: (0, moment_1.default)().format() },
            });
            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await feOAuthRefreshToken_model_1.OAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail.accessToken,
                    revoked: false,
                    expires: { $gte: (0, moment_1.default)().format() },
                });
                if (oAuthRefreshDetail) {
                    req.user = user;
                    req.access = oAuthTokenDetail;
                    req.refresh = oAuthRefreshDetail;
                    return resolve();
                }
            }
        }
        else if (info.platform === 'back-end') {
            const oAuthTokenDetail = await beOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({
                accessToken: req.headers.authorization.split(' ')[1],
                revoked: false,
                expires: { $gte: (0, moment_1.default)().format() },
            });
            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await beOAuthRefreshToken_model_1.OAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail === null || oAuthTokenDetail === void 0 ? void 0 : oAuthTokenDetail.accessToken,
                    revoked: false,
                    expires: { $gte: (0, moment_1.default)().format() },
                });
                if (oAuthRefreshDetail) {
                    req.user = user;
                    req.access = oAuthTokenDetail;
                    req.refresh = oAuthRefreshDetail;
                    return resolve();
                }
            }
        }
    }
    const error = new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Session expired. Please login again.');
    return reject(error);
};
const isAuthenticated = (0, catchAsync_1.default)(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});
exports.isAuthenticated = isAuthenticated;
const clientVerifyCallback = (req, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
        const error = new apiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Invalid client.');
        return reject(error);
    }
    req.client = user;
    return resolve();
};
const isClientAuthenticated = (0, catchAsync_1.default)(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport_1.default.authenticate('basic', clientVerifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});
exports.isClientAuthenticated = isClientAuthenticated;
const isScopePermitted = (scope) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'].split(' ');
        if (authHeader && authHeader.length > 1) {
            const accessToken = authHeader[1];
            const oAuthTokenDetail = await beOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({
                accessToken: accessToken,
                revoked: false,
                expires: { $gte: (0, moment_1.default)().format() },
            });
            if (oAuthTokenDetail) {
                const userDetails = await beUser_model_1.UserModel.findOne({ _id: oAuthTokenDetail.user });
                if (userDetails) {
                    if (userDetails.superAdmin)
                        next();
                    else {
                        const roleDetails = await beUmRole_model_1.UmRoleModel.findOne({ _id: userDetails.role._id });
                        const isScope = roleDetails === null || roleDetails === void 0 ? void 0 : roleDetails.permissions.find((x) => x === scope);
                        if (isScope)
                            next();
                        else
                            return res.status(400).json('Access Denied');
                    }
                }
                else
                    return res.status(400).json('Access Denied');
            }
            else
                return res.status(400).json('Access Denied');
        }
        else
            return res.status(400).json('Access Denied');
    };
};
exports.isScopePermitted = isScopePermitted;
