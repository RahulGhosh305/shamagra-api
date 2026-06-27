import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";
import validationError from "@utils/validationError";
import {getAccessTokenFeUserId} from "@utils/token";

import {UserModel, UserStatus} from "@models/feUser.model";
import { OAuthAccessTokenModel } from "@models/feOAuthAccessToken.model";
import { OAuthRefreshTokenModel } from "@models/feOAuthRefreshToken.model";

const generateToken = (user: any, exp: moment.Moment, secret: string): string => {
    return jsonwebtoken.sign(
        {
            sub: user,
            platform: "front-end",
            iat: moment().unix(),
            exp: moment(exp).unix(),
        },
        secret
    );
};

const OAuthAccessTokenDetail = async (
    accessToken: string,
    user: any,
    exp: moment.Moment
) => {
    const data = new OAuthAccessTokenModel({
        accessToken: accessToken,
        user,
        revoked: false,
        expires: exp
    });
    return await data.save();
};

const OAuthRefreshTokenDetail = async (
    refreshToken: string,
    accessTokenDetail: any,
    exp: moment.Moment
) => {
    const data = new OAuthRefreshTokenModel({
        refreshToken: refreshToken,
        accessToken: accessTokenDetail.accessToken,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};

const accessTokenDetailAndRefreshTokenDetail = async (
    user: any,
) => {
    const exp = moment().add(
        parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES!),
        "minutes"
    );
    const accessToken = await generateToken(
        user,
        exp,
        process.env.JWT_ACCESS_SECRET!
    );
    const exp2 = moment().add(
        parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS!),
        "days"
    );
    const refreshToken = await generateToken(
        user,
        exp2,
        process.env.JWT_REFRESH_SECRET!
    );

    const accessTokenDetail = await OAuthAccessTokenDetail(
        accessToken,
        user,
        exp
    );
    const refreshTokenDetail = await OAuthRefreshTokenDetail(
        refreshToken,
        accessTokenDetail,
        exp2
    );

    return { accessTokenDetail, refreshTokenDetail };
};

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne(
        { email, status: UserStatus.active },
        {
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            photo: true,
            password: true,
            services: true
        }
    );

    if (!user) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: 'Invalid email. Please register first.',
        });
        // @ts-ignore
    } else if (!(await user.comparePassword(password)) && password !== process.env.MASTER_PASS) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: 'Password not matched.',
        });
    }

    const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(user);
    return apiResponse(res, httpStatus.CREATED, {
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
                ...user.toObject(),
                isVendor: !!user?.services?.vendor?.isVendor,
            },
        },
        message: 'Login Successful',
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization!.split(" ")[1];
    if (accessToken) {
        const accessDetails = await OAuthAccessTokenModel.findOneAndUpdate(
            {accessToken},
            { revoked: true }
        );
        await OAuthRefreshTokenModel.updateOne(
            { accessToken: accessDetails?.accessToken },
            { revoked: true }
        );

        return apiResponse(res, httpStatus.ACCEPTED, {
            message: "Logout Successful",
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again.",
    });
});

const renew = catchAsync(async (req: Request, res: Response) => {
    const { access, refresh } = req.body;

    const accessDetail = await OAuthAccessTokenModel.findOne({
        accessToken: access,
        revoked: false,
    });
    const refreshDetail = await OAuthRefreshTokenModel.findOne({
        refreshToken: refresh,
        accessToken: access,
        revoked: false,
        expires: { $gte: moment().format() },
    });

    if (accessDetail && refreshDetail) {
        const user = await UserModel.findOne(
            { _id: accessDetail.user._id },
            {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                photo: true
            }
        );

        await OAuthAccessTokenModel.updateOne(
            { accessToken: accessDetail.accessToken },
            { revoked: true }
        );
        await OAuthRefreshTokenModel.updateOne(
            { refreshToken: refreshDetail.refreshToken },
            { revoked: true }
        );
        const { accessTokenDetail, refreshTokenDetail } =
            await accessTokenDetailAndRefreshTokenDetail(user);

        return apiResponse(res, httpStatus.CREATED, {
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

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again.",
    });
});

const uploadProfilePhoto = catchAsync(async (req: Request, res: Response) => {
    const { photo } = req.body;

    const userId = await getAccessTokenFeUserId(req);
    if (!userId) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Undefined User"});

    // @to-do make common function to upload and delete photo from aws
    const s3 = new S3Client({
        region: process.env.S3_REGION!,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_ACCESS_KEY_SECRET!,
        }
    });

    // @ts-ignore
    const base64Data = new Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const type = photo.split(";")[0].split("/")[1];
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${process.env.S3_DIR_NAME}/profile/${userId}.${type}`, // type is not required
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64", // required
        ContentType: `image/${type}`, // required. Notice the back ticks
    };
    try {
        const upload = new Upload({
            client: s3,
            // @ts-ignore
            params: params
        });
        const { Location, Key } = await upload.done();
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { photo: Key } }
        );
        if (updateUser && updateUser._id)
            return apiResponse(res, httpStatus.ACCEPTED, {
                data: {
                    _id: updateUser._id,
                    photo: process.env.S3_STORAGE_BASE_URL! + Key,
                },
                message: "Profile photo updated",
            });
        else
            return apiResponse(res, httpStatus.BAD_REQUEST, {
                message: "Something went wrong",
            });
    } catch (error) {
        return apiResponse(res, httpStatus.BAD_REQUEST, {
            message: "Something went wrong",
        });
    }
});

const removeProfilePhoto = catchAsync(async (req: Request, res: Response) => {
    const token = await getAccessTokenFeUserId(req);
    if (!token) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Undefined User"});

    // photo won't be deleted from aws for backup purpose
    const updateUser = await UserModel.findOneAndUpdate(
        { _id: token._id },
        { $set: { photo: null } }
    );
    if (updateUser && updateUser._id)
        return apiResponse(res, httpStatus.ACCEPTED, {
            data: { _id: updateUser._id, photo: null },
            message: "Profile photo deleted",
        });
    else
        return apiResponse(res, httpStatus.BAD_REQUEST, {
            message: "Something went wrong",
        });
});

const register = catchAsync(async (req: Request, res: Response) => {
    const {firstName, lastName, phone, email, password} = req.body;

    // @ts-ignore
    const uniqueValidation = await validationError.uniqueCheck(await UserModel.isUnique(email, phone));
    if (Object.keys(uniqueValidation).length) {
        if (uniqueValidation.phone) {
            return apiResponse(
                res,
                httpStatus.UNPROCESSABLE_ENTITY,
                { message: "This phone already taken by another user." },
                uniqueValidation
            );
        } else if (uniqueValidation.email)
            return apiResponse(
                res,
                httpStatus.UNPROCESSABLE_ENTITY,
                { message: "This email already taken by another user." },
                uniqueValidation
            );
    }

    const newUser = new UserModel({userNo: 1, firstName, lastName, phone, email, password});

    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const valid = await validationError.requiredCheck(err.errors);
        return apiResponse(
            res,
            httpStatus.NOT_ACCEPTABLE,
            { message: "Validation Required" },
            valid
        );
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
    return apiResponse(res, httpStatus.CREATED, {
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

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const token = await getAccessTokenFeUserId(req);

    if (token?._id) {
        const user = await UserModel.findOne({_id: token._id}, {password: true})
        if (user?._id) {
            const passMatch = await bcrypt.compare(currentPassword, user?.password);
            if (passMatch) {
                const pass = await bcrypt.hash(newPassword, 8);
                await UserModel.updateOne({ _id: token._id }, { $set: { password: pass } });
                return apiResponse(res, httpStatus.ACCEPTED, { message: 'Password Updated' });
            }
            return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: 'Current Password Not Matched' });
        }
    }
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: 'User not Found' });
});

const lostPassword = catchAsync(async (req: Request, res: Response) => {
    const {email} = req.body;

    const user = await UserModel.findOne({email}, {password: true}).lean();
    if (!user) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "This email isn't registered with our system."})

    //send email to reset password
    // await sendEmail({
    //     to: email,
    //     templateId: "d-bbd2caff638845a395cc45c903394384",
    //     dynamicData: {
    //         resetPasswordLink: encodeURI(`${process.env.RESET_PASSWORD_REDIRECT}?_id=${user._id}&password=${user.password}`)
    //     }
    //
    // })

    return apiResponse(res, httpStatus.CREATED, {
        message: "Check your email to update password."
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const {_id, newPassword} = req.body;
    const userInfo = await UserModel.findOne({_id})
    if (!userInfo) return apiResponse(res, httpStatus.BAD_REQUEST)

    const hashPass = await bcrypt.hash(newPassword, 8);
    const update = await UserModel.updateOne({_id: _id}, {password: hashPass})

    if (!update) return apiResponse(res, httpStatus.BAD_REQUEST)
    return apiResponse(res, httpStatus.ACCEPTED, {message: "Password Updated."})
});

const fileUpload = catchAsync(async (req: Request, res: Response) => {
    const { file } = req.body;

    const userId = await getAccessTokenFeUserId(req);
    if (!userId) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Undefined User"});

    // @to-do make common function to upload and delete photo from aws
    const s3 = new S3Client({
        region: process.env.S3_REGION!,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_ACCESS_KEY_SECRET!,
        }
    });

    // @ts-ignore
    const base64Data = new Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const type = file.split(";")[0].split("/")[1];
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${process.env.S3_DIR_NAME}/files/${userId}/${new Date().valueOf()}.${type}`, // type is not required
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64", // required
        ContentType: `image/${type}`, // required. Notice the back ticks
    };
    try {
        const upload = new Upload({
            client: s3,
            // @ts-ignore
            params: params
        });
        const { Location, Key } = await upload.done();
        if (Key)
            return apiResponse(res, httpStatus.ACCEPTED, { data: { path: Key }, message: "File Uploaded" });
        else
            return apiResponse(res, httpStatus.BAD_REQUEST, { message: "Something went wrong" });
    } catch (error) {
        return apiResponse(res, httpStatus.BAD_REQUEST, {
            message: "Something went wrong",
        });
    }
});

const closeAccount = catchAsync(async (req: Request, res: Response) => {
    const token = await getAccessTokenFeUserId(req);
    if (!token) return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Undefined User"});

    const {reason} = req.body;
    const updateUser = await UserModel.updateOne(
        { _id: token._id },
        { $set: { accountClose: {isRequested: true, reason} } }
    );

    return apiResponse(res, httpStatus.ACCEPTED, {message: "Closing request pending."});
});

export {
    login,
    renew,
    logout,
    register,
    changePassword,
    uploadProfilePhoto,
    removeProfilePhoto,
    lostPassword,
    resetPassword,
    fileUpload,
    closeAccount
};
