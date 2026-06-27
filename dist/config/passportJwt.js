"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const beUser_model_1 = require("@models/beUser.model");
const feUser_model_1 = require("@models/feUser.model");
const passportJwtInit = new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
}, (0, catchAsync_1.default)(async (jwtPayload, done) => {
    if (!jwtPayload.platform)
        return done(true, false);
    let user = null;
    if (jwtPayload.platform === "front-end")
        user = await feUser_model_1.UserModel.findOne({ _id: jwtPayload.sub._id });
    else if (jwtPayload.platform === "back-end")
        user = await beUser_model_1.UserModel.findOne({ _id: jwtPayload.sub._id });
    else
        return done(true, false);
    if (!user)
        return done(true, false);
    return done(false, user, jwtPayload);
}));
exports.default = passportJwtInit;
