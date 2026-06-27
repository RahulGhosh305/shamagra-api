import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

import apiResponse from '@utils/apiResponse';
import catchAsync from '@utils/catchAsync';

import {UserModel, UserStatus} from '@models/beUser.model';
import {UmRoleModel, UmRoleStatus} from '@models/beUmRole.model';
import { OAuthAccessTokenModel } from '@models/beOAuthAccessToken.model';
import { OAuthRefreshTokenModel } from '@models/beOAuthRefreshToken.model';

const generateToken = (user: any, exp: moment.Moment, secret: string) => {
    return jwt.sign(
        {
            sub: user,
            platform: 'back-end',
            iat: moment().unix(),
            exp: exp.unix(),
        },
        secret
    );
};

const OAuthAccessTokenDetail = async (accessToken: string, user: any, permissions: string[], exp: moment.Moment) => {
    const data = new OAuthAccessTokenModel({
        accessToken: accessToken,
        user: user,
        scopes: permissions,
        revoked: false,
        expires: exp,
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

const accessTokenDetailAndRefreshTokenDetail = async (user: any, permissions: string[]) => {
    const exp = moment().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? ""), 'minutes');
    const accessToken = await generateToken(user, exp, process.env.JWT_ACCESS_SECRET ?? "");
    const exp2 = moment().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? ""), 'days');
    const refreshToken = await generateToken(user, exp2, process.env.JWT_REFRESH_SECRET ?? "");

    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, permissions, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken, accessTokenDetail, exp2);

    return { accessTokenDetail, refreshTokenDetail };
};

const login = catchAsync(async (req: any, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        status: UserStatus.active,
        $or: [{ email: email }, { username: email }],
    });

    if (!user) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: 'Invalid email or username. Please register first.',
        });
    // @ts-ignore
    } else if (!(await user.comparePassword(password))) {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: 'Password not matched.',
        });
    }

    const roleInfo = await UmRoleModel.findOne({ _id: user.role._id, status: UmRoleStatus.active });

    const { accessTokenDetail, refreshTokenDetail } = await accessTokenDetailAndRefreshTokenDetail(
        user,
        roleInfo && roleInfo.permissions ? roleInfo.permissions : []
    );

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
            scopes: roleInfo && roleInfo.permissions ? roleInfo.permissions : [],
        },
        message: 'Login Successful',
    });
});

const logout = catchAsync(async (req: any, res: Response) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (accessToken) {
        const accessDetails = await OAuthAccessTokenModel.findOneAndUpdate({accessToken}, { revoked: true });
        await OAuthRefreshTokenModel.updateOne({ accessToken: accessDetails?.accessToken }, { revoked: true });

        return apiResponse(res, httpStatus.ACCEPTED, {
            message: 'Logout Successful',
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: 'Session expired. Please login again.',
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { currentPassword, password, _id } = req.body;
    const user = await UserModel.findOne({ _id });
    if (user?._id) {
        const passMatch = await bcrypt.compare(currentPassword, user.password);
        if (passMatch) {
            const pass = await bcrypt.hash(password, 8);
            await UserModel.updateOne({ _id: _id }, { $set: { password: pass } });
            return apiResponse(res, httpStatus.ACCEPTED, { message: 'Password Updated' });
        }
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: 'Current Password Not Matched' });
    }
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, { message: 'User not Found' });
});

export { login, logout, changePassword };
