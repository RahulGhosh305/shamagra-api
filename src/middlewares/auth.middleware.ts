import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import moment from 'moment';

import catchAsyncErr from "@utils/catchAsync";
import ApiError from "@utils/apiError";

import { OAuthAccessTokenModel as BeOAuthAccessTokenModel } from '@models/beOAuthAccessToken.model';
import { OAuthRefreshTokenModel as BeOAuthRefreshTokenModel } from '@models/beOAuthRefreshToken.model';
import { OAuthAccessTokenModel as FeOAuthAccessTokenModel } from '@models/feOAuthAccessToken.model';
import { OAuthRefreshTokenModel as FeOAuthRefreshTokenModel } from '@models/feOAuthRefreshToken.model';
import { UserModel } from '@models/beUser.model';
import { UmRoleModel } from '@models/beUmRole.model';

const verifyCallback = (req: any, resolve: () => void, reject: (error: ApiError) => void) => async (
    err: Error,
    user: any,
    info: any
) => {
    if (err || !info || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, 'Session expired. Please login again.');
        return reject(error);
    }

    if (info.platform) {
        if (info.platform === 'front-end') {
            const oAuthTokenDetail = await FeOAuthAccessTokenModel.findOne({
                accessToken: req?.headers?.authorization?.split(' ')[1],
                revoked: false,
                expires: { $gte: moment().format() },
            });

            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await FeOAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail.accessToken,
                    revoked: false,
                    expires: { $gte: moment().format() },
                });

                if (oAuthRefreshDetail) {
                    req.user = user;
                    req.access = oAuthTokenDetail;
                    req.refresh = oAuthRefreshDetail;

                    return resolve();
                }
            }
        } else if (info.platform === 'back-end') {
            const oAuthTokenDetail = await BeOAuthAccessTokenModel.findOne({
                accessToken: req.headers.authorization.split(' ')[1],
                revoked: false,
                expires: { $gte: moment().format() },
            });

            if (oAuthTokenDetail) {
                const oAuthRefreshDetail = await BeOAuthRefreshTokenModel.findOne({
                    accessToken: oAuthTokenDetail?.accessToken,
                    revoked: false,
                    expires: { $gte: moment().format() },
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

    const error = new ApiError(httpStatus.UNAUTHORIZED, 'Session expired. Please login again.');
    return reject(error);
};

const isAuthenticated = catchAsyncErr(async (req: Request, res: Response, next: NextFunction) => {
    return new Promise<void>((resolve, reject) => {
        return passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

const clientVerifyCallback = (req: any, resolve: () => void, reject: (error: ApiError) => void) => async (
    err: Error,
    user: any,
    info: any
) => {
    if (err || info || !user) {
        const error = new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid client.');
        return reject(error);
    }

    req.client = user;
    return resolve();
};

const isClientAuthenticated = catchAsyncErr(async (req: Request, res: Response, next: NextFunction) => {
    return new Promise<void>((resolve, reject) => {
        return passport.authenticate('basic', clientVerifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

const isScopePermitted = (scope: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'].split(' ');
        if (authHeader && authHeader.length > 1) {
            const accessToken = authHeader[1];
            const oAuthTokenDetail = await BeOAuthAccessTokenModel.findOne({
                accessToken: accessToken,
                revoked: false,
                expires: { $gte: moment().format() },
            });

            if (oAuthTokenDetail) {
                const userDetails = await UserModel.findOne({ _id: oAuthTokenDetail.user });
                if (userDetails) {
                    if (userDetails.superAdmin) next();
                    else {
                        const roleDetails = await UmRoleModel.findOne({ _id: userDetails.role._id });
                        const isScope = roleDetails?.permissions.find((x: string) => x === scope);
                        if (isScope) next();
                        else return res.status(400).json('Access Denied');
                    }
                } else return res.status(400).json('Access Denied');
            } else return res.status(400).json('Access Denied');
        } else return res.status(400).json('Access Denied');
    };
};

export {
    isAuthenticated,
    isClientAuthenticated,
    isScopePermitted,
};
