"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("@config/config"));
const logger_1 = __importDefault(require("@config/logger"));
let server;
// MongoDB Connect + Server Start
mongoose.connect(config_1.default.mongoose.url, config_1.default.mongoose.options).then(() => {
    logger_1.default.info('Connected to MongoDB');
    server = app_1.default.listen(config_1.default.port, () => {
        logger_1.default.info(`Listening to port ${config_1.default.port}`);
    });
}).catch((err) => {
    logger_1.default.error('MongoDB connection failed', err);
    process.exit(1);
});
// Server Exit Handler
const exitHandler = async () => {
    try {
        if (server) {
            server.close(() => {
                logger_1.default.info('Server closed');
            });
        }
        await mongoose.connection.close();
        logger_1.default.info('MongoDB connection closed');
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error('Error during shutdown', err);
        process.exit(1);
    }
};
// SIGTERM Handler
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received');
    exitHandler();
});
// SIGINT Handler
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT received');
    exitHandler();
});
// Unexpected Error Handler
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    process.exit(1);
};
// Uncaught Exception Handler
process.on('uncaughtException', unexpectedErrorHandler);
// Unhandled Rejection Handler
process.on('unhandledRejection', unexpectedErrorHandler);
