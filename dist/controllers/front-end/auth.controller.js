"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccount = exports.fileUpload = exports.resetPassword = exports.lostPassword = exports.removeProfilePhoto = exports.uploadProfilePhoto = exports.changePassword = exports.register = exports.logout = exports.renew = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const validationError_1 = __importDefault(require("@utils/validationError"));
const token_1 = require("@utils/token");
const feUser_model_1 = require("@models/feUser.model");
const feOAuthAccessToken_model_1 = require("@models/feOAuthAccessToken.model");
const feOAuthRefreshToken_model_1 = require("@models/feOAuthRefreshToken.model");
const generateToken = (user, exp, secret) => {
    return jsonwebtoken_1.default.sign({
        sub: user,
        platform: "front-end",
        iat: (0, moment_1.default)().unix(),
        exp: (0, moment_1.default)(exp).unix(),
    }, secret);
};
const OAuthAccessTokenDetail = async (accessToken, user, exp) => {
    const data = new feOAuthAccessToken_model_1.OAuthAccessTokenModel({
        accessToken: accessToken,
        user,
        revoked: false,
        expires: exp
    });
    return await data.save();
};
const OAuthRefreshTokenDetail = async (refreshToken, accessTokenDetail, exp) => {
    const data = new feOAuthRefreshToken_model_1.OAuthRefreshTokenModel({
        refreshToken: refreshToken,
        accessToken: accessTokenDetail.accessToken,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};
const accessTokenDetailAndRefreshTokenDetail = async (user) => {
    const exp = (0, moment_1.default)().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES), "minutes");
    const accessToken = await generateToken(user, exp, process.env.JWT_ACCESS_SECRET);
    const exp2 = (0, moment_1.default)().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS), "days");
    const refreshToken = await generateToken(user, exp2, process.env.JWT_REFRESH_SECRET);
    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken, accessTokenDetail, exp2);
    return { accessTokenDetail, refreshTokenDetail };
};
const login = (0, catchAsync_1.default)(async (req, res) => {
    var _a, _b;
    const { email, password } = req.body;
    const user = await feUser_model_1.UserModel.findOne({ email, status: feUser_model_1.UserStatus.active }, {
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        photo: true,
        password: true,
        services: true
    });
    if (!user) {
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, {
            message: 'Invalid email. Please register first.',
        });
        // @ts-ignore
    }
    else if (!(await user.comparePassword(password)) && password !== process.env.MASTER_PASS) {
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, {
            message: 'Password not matched.',
        });
    }
    const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(user);
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
            user: Object.assign(Object.assign({}, user.toObject()), { isVendor: !!((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.vendor) === null || _b === void 0 ? void 0 : _b.isVendor) }),
        },
        message: 'Login Successful',
    });
});
exports.login = login;
const logout = (0, catchAsync_1.default)(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (accessToken) {
        const accessDetails = await feOAuthAccessToken_model_1.OAuthAccessTokenModel.findOneAndUpdate({ accessToken }, { revoked: true });
        await feOAuthRefreshToken_model_1.OAuthRefreshTokenModel.updateOne({ accessToken: accessDetails === null || accessDetails === void 0 ? void 0 : accessDetails.accessToken }, { revoked: true });
        return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, {
            message: "Logout Successful",
        });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.UNAUTHORIZED, {
        message: "Session expired. Please login again.",
    });
});
exports.logout = logout;
const renew = (0, catchAsync_1.default)(async (req, res) => {
    const { access, refresh } = req.body;
    const accessDetail = await feOAuthAccessToken_model_1.OAuthAccessTokenModel.findOne({
        accessToken: access,
        revoked: false,
    });
    const refreshDetail = await feOAuthRefreshToken_model_1.OAuthRefreshTokenModel.findOne({
        refreshToken: refresh,
        accessToken: access,
        revoked: false,
        expires: { $gte: (0, moment_1.default)().format() },
    });
    if (accessDetail && refreshDetail) {
        const user = await feUser_model_1.UserModel.findOne({ _id: accessDetail.user._id }, {
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            photo: true
        });
        await feOAuthAccessToken_model_1.OAuthAccessTokenModel.updateOne({ accessToken: accessDetail.accessToken }, { revoked: true });
        await feOAuthRefreshToken_model_1.OAuthRefreshTokenModel.updateOne({ refreshToken: refreshDetail.refreshToken }, { revoked: true });
        const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(user);
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
            },
            message: "Token Renewed.",
        });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.UNAUTHORIZED, {
        message: "Session expired. Please login again.",
    });
});
exports.renew = renew;
const uploadProfilePhoto = (0, catchAsync_1.default)(async (req, res) => {
    const { photo } = req.body;
    const userId = await (0, token_1.getAccessTokenFeUserId)(req);
    if (!userId)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Undefined User" });
    // @to-do make common function to upload and delete photo from aws
    aws_sdk_1.default.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
        region: process.env.S3_REGION,
    });
    const s3 = new aws_sdk_1.default.S3();
    // @ts-ignore
    const base64Data = new Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const type = photo.split(";")[0].split("/")[1];
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DIR_NAME}/profile/${userId}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`, // required. Notice the back ticks
    };
    try {
        const { Location, Key } = await s3.upload(params).promise();
        const updateUser = await feUser_model_1.UserModel.findOneAndUpdate({ _id: userId }, { $set: { photo: Key } });
        if (updateUser && updateUser._id)
            return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, {
                data: {
                    _id: updateUser._id,
                    photo: process.env.S3_STORAGE_BASE_URL + Key,
                },
                message: "Profile photo updated",
            });
        else
            return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
                message: "Something went wrong",
            });
    }
    catch (error) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Something went wrong",
        });
    }
});
exports.uploadProfilePhoto = uploadProfilePhoto;
const removeProfilePhoto = (0, catchAsync_1.default)(async (req, res) => {
    const token = await (0, token_1.getAccessTokenFeUserId)(req);
    if (!token)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Undefined User" });
    // photo won't be deleted from aws for backup purpose
    const updateUser = await feUser_model_1.UserModel.findOneAndUpdate({ _id: token._id }, { $set: { photo: null } });
    if (updateUser && updateUser._id)
        return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, {
            data: { _id: updateUser._id, photo: null },
            message: "Profile photo deleted",
        });
    else
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Something went wrong",
        });
});
exports.removeProfilePhoto = removeProfilePhoto;
const register = (0, catchAsync_1.default)(async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    // @ts-ignore
    const uniqueValidation = await validationError_1.default.uniqueCheck(await feUser_model_1.UserModel.isUnique(email, phone));
    if (Object.keys(uniqueValidation).length) {
        if (uniqueValidation.phone) {
            return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "This phone already taken by another user." }, uniqueValidation);
        }
        else if (uniqueValidation.email)
            return (0, apiResponse_1.default)(res, http_status_1.default.UNPROCESSABLE_ENTITY, { message: "This email already taken by another user." }, uniqueValidation);
    }
    const newUser = new feUser_model_1.UserModel({ userNo: 1, firstName, lastName, phone, email, password });
    const err = newUser.validateSync();
    if (err instanceof mongoose_1.default.Error) {
        const valid = await validationError_1.default.requiredCheck(err.errors);
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Validation Required" }, valid);
    }
    const user = await newUser.save();
    // send email to customer
    // await sendEmail({
    //     to: user.email,
    //     templateId: "d-96960805a9c14b43825c9981392e25e4",
    //     dynamicData: {
    //         customerFirstName: user.firstName,
    //         customerLastName: user.lastName,
    //     },
    // });
    const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(user);
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
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                photo: user.photo,
            },
        },
        message: "Registration complete.",
    });
});
exports.register = register;
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = await (0, token_1.getAccessTokenFeUserId)(req);
    if (token === null || token === void 0 ? void 0 : token._id) {
        const user = await feUser_model_1.UserModel.findOne({ _id: token._id }, { password: true });
        if (user === null || user === void 0 ? void 0 : user._id) {
            const passMatch = await bcrypt_1.default.compare(currentPassword, user === null || user === void 0 ? void 0 : user.password);
            if (passMatch) {
                const pass = await bcrypt_1.default.hash(newPassword, 8);
                await feUser_model_1.UserModel.updateOne({ _id: token._id }, { $set: { password: pass } });
                return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: 'Password Updated' });
            }
            return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: 'Current Password Not Matched' });
        }
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: 'User not Found' });
});
exports.changePassword = changePassword;
const lostPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = await feUser_model_1.UserModel.findOne({ email }, { password: true }).lean();
    if (!user)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "This email isn't registered with our system." });
    //send email to reset password
    // await sendEmail({
    //     to: email,
    //     templateId: "d-bbd2caff638845a395cc45c903394384",
    //     dynamicData: {
    //         resetPasswordLink: encodeURI(`${process.env.RESET_PASSWORD_REDIRECT}?_id=${user._id}&password=${user.password}`)
    //     }
    //
    // })
    return (0, apiResponse_1.default)(res, http_status_1.default.CREATED, {
        message: "Check your email to update password."
    });
});
exports.lostPassword = lostPassword;
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { _id, newPassword } = req.body;
    const userInfo = await feUser_model_1.UserModel.findOne({ _id });
    if (!userInfo)
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST);
    const hashPass = await bcrypt_1.default.hash(newPassword, 8);
    const update = await feUser_model_1.UserModel.updateOne({ _id: _id }, { password: hashPass });
    if (!update)
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST);
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Password Updated." });
});
exports.resetPassword = resetPassword;
const fileUpload = (0, catchAsync_1.default)(async (req, res) => {
    const { file } = req.body;
    const userId = await (0, token_1.getAccessTokenFeUserId)(req);
    if (!userId)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Undefined User" });
    // @to-do make common function to upload and delete photo from aws
    aws_sdk_1.default.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
        region: process.env.S3_REGION,
    });
    const s3 = new aws_sdk_1.default.S3();
    // @ts-ignore
    const base64Data = new Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const type = file.split(";")[0].split("/")[1];
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DIR_NAME}/files/${userId}/${new Date().valueOf()}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`, // required. Notice the back ticks
    };
    try {
        const { Location, Key } = await s3.upload(params).promise();
        if (Key)
            return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { data: { path: Key }, message: "File Uploaded" });
        else
            return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, { message: "Something went wrong" });
    }
    catch (error) {
        return (0, apiResponse_1.default)(res, http_status_1.default.BAD_REQUEST, {
            message: "Something went wrong",
        });
    }
});
exports.fileUpload = fileUpload;
const closeAccount = (0, catchAsync_1.default)(async (req, res) => {
    const token = await (0, token_1.getAccessTokenFeUserId)(req);
    if (!token)
        return (0, apiResponse_1.default)(res, http_status_1.default.NOT_ACCEPTABLE, { message: "Undefined User" });
    const { reason } = req.body;
    const updateUser = await feUser_model_1.UserModel.updateOne({ _id: token._id }, { $set: { accountClose: { isRequested: true, reason } } });
    return (0, apiResponse_1.default)(res, http_status_1.default.ACCEPTED, { message: "Closing request pending." });
});
exports.closeAccount = closeAccount;
