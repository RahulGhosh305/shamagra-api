import passportJwt from "passport-jwt";
import { Request } from "express";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import catchAsync from "@utils/catchAsync";
import { UserModel as BeUserModel } from "@models/beUser.model";
import { UserModel as FeUserModel } from "@models/feUser.model";

const passportJwtInit = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_ACCESS_SECRET,
    },
    catchAsync(async (jwtPayload: any, done: VerifiedCallback) => {
        if (!jwtPayload.platform) return done(true, false);

        let user = null;

        if (jwtPayload.platform === "front-end")
            user = await FeUserModel.findOne({ _id: jwtPayload.sub._id });
        else if (jwtPayload.platform === "back-end")
            user = await BeUserModel.findOne({ _id: jwtPayload.sub._id });
        else return done(true, false);

        if (!user) return done(true, false);

        return done(false, user, jwtPayload);
    })
);

export default passportJwtInit;
