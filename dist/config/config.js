"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object()
    .keys({
    // Express Configuration
    NODE_ENVIRONMENT: Joi.string().valid('production', 'development').required(),
    HOST_NAME: Joi.string().default("localhost"),
    HOST_PORT: Joi.number().default(3000),
    CORS_ORIGIN: Joi.string().default("*"),
    // Mongoose Configuration
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    // JWT Configuration
    JWT_ACCESS_SECRET: Joi.string().required().description('JWT access secret key'),
    JWT_REFRESH_SECRET: Joi.string().required().description('JWT refresh secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    // Slow Down Configuration
    WINDOW_BLOCK_SECOND: Joi.number().default(30).description('slow down blocks after 30 seconds'),
    PER_WINDOW_MAX_REQUEST: Joi.number().default(30).description('max 30 request per window'),
    RESPONSE_DELAY_SECOND: Joi.number().default(.5).description('slow down request .5 seconds'),
    // Cloudinary Configuration
    CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
    CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API key'),
    CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API secret'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error)
    throw new Error(`Config validation error: ${error.message}`);
exports.default = {
    env: envVars.NODE_ENVIRONMENT,
    host: envVars.HOST_NAME,
    port: envVars.HOST_PORT,
    corsOrigins: envVars.CORS_ORIGIN,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        accessSecret: envVars.JWT_ACCESS_SECRET,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    expressSlow: {
        windowBlockSec: envVars.WINDOW_BLOCK_SECOND,
        perWindowMaxReq: envVars.PER_WINDOW_MAX_REQUEST,
        windowDelay: envVars.RESPONSE_DELAY_SECOND
    },
    cloudinary: {
        cloudName: envVars.CLOUD_NAME,
        apiKey: envVars.CLOUDINARY_API_KEY,
        apiSecret: envVars.CLOUDINARY_API_SECRET,
    }
};
