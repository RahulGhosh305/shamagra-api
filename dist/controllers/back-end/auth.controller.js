"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const beUser_model_1 = require("@models/beUser.model");
const beUmRole_model_1 = require("@models/beUmRole.model");
const beOAuthAccessToken_model_1 = require("@models/beOAuthAccessToken.model");
const beOAuthRefreshToken_model_1 = require("@models/beOAuthRefreshToken.model");
const generateToken = (user, exp, secret) => {
    return jsonwebtoken_1.default.sign({
        sub: user,
        platform: 'back-end',
        iat: (0, moment_1.default)().unix(),
        exp: exp.unix(),
    }, secret);
};
const OAuthAccessTokenDetail = async (accessToken, user, permissions, exp) => {
    const data = new beOAuthAccessToken_model_1.OAuthAccessTokenModel({
        accessToken: accessToken,
        user: user,
        scopes: permissions,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};
const OAuthRefreshTokenDetail = async (refreshToken, accessTokenDetail, exp) => {
    const data = new beOAuthRefreshToken_model_1.OAuthRefreshTokenModel({
        refreshToken: refreshToken,
        accessToken: accessTokenDetail.accessToken,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};
const accessTokenDetailAndRefreshTokenDetail = async (user, permissions) => {
    var _a, _b, _c, _d;
    const exp = (0, moment_1.default)().add(parseInt((_a = process.env.JWT_ACCESS_EXPIRATION_MINUTES) !== null && _a !== void 0 ? _a : ""), 'minutes');
    const accessToken = await generateToken(user, exp, (_b = process.env.JWT_ACCESS_SECRET) !== null && _b !== void 0 ? _b : "");
    const exp2 = (0, moment_1.default)().add(parseInt((_c = process.env.JWT_REFRESH_EXPIRATION_DAYS) !== null && _c !== void 0 ? _c : ""), 'days');
    const refreshToken = await generateToken(user, exp2, (_d = process.env.JWT_REFRESH_SECRET) !== null && _d !== void 0 ? _d : "");
    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, permissions, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken, accessTokenDetail, exp2);
    return { accessTokenDetail, refreshTokenDetail };
};
const login = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await beUser_model_1.UserModel.findOne({
        status: beUser_model_1.UserStatus.active,
        $or: [{ email: email }, { username: email }],
    });
    if (!user) {
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, {
            message: 'Invalid email or username. Please register first.',
        });
        // @ts-ignore
    }
    else if (!(await user.comparePassword(password))) {
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, {
            message: 'Password not matched.',
        });
    }
    const roleInfo = await beUmRole_model_1.UmRoleModel.findOne({ _id: user.role._id, status: beUmRole_model_1.UmRoleStatus.active });
    const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(user, roleInfo && roleInfo.permissions ? roleInfo.permissions : []);
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, {
        data: {
            access: {
                token: accessTokenDetail.accessToken,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail.refreshToken,
                expires: refreshTokenDetail.expires,
            },
            user: user,
            scopes: roleInfo && roleInfo.permissions ? roleInfo.permissions : [],
        },
        message: 'Login Successful',
    });
});
exports.login = login;
const logout = (0, catchAsync_1.default)(async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (accessToken) {
        const accessDetails = await beOAuthAccessToken_model_1.OAuthAccessTokenModel.findOneAndUpdate({ accessToken }, { revoked: true });
        await beOAuthRefreshToken_model_1.OAuthRefreshTokenModel.updateOne({ accessToken: accessDetails === null || accessDetails === void 0 ? void 0 : accessDetails.accessToken }, { revoked: true });
        return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, {
            message: 'Logout Successful',
        });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.UNAUTHORIZED, {
        message: 'Session expired. Please login again.',
    });
});
exports.logout = logout;
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { currentPassword, password, _id } = req.body;
    const user = await beUser_model_1.UserModel.findOne({ _id });
    if (user === null || user === void 0 ? void 0 : user._id) {
        const passMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (passMatch) {
            const pass = await bcrypt_1.default.hash(password, 8);
            await beUser_model_1.UserModel.updateOne({ _id: _id }, { $set: { password: pass } });
            return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: 'Password Updated' });
        }
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: 'Current Password Not Matched' });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: 'User not Found' });
});
exports.changePassword = changePassword;
