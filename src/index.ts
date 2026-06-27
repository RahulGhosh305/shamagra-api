const mongoose = require("mongoose");
import app from "./app";
import config from "@config/config";
import logger from "@config/logger";

let server: any;

// MongoDB Connect + Server Start
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });
}).catch((err: any) => {
    logger.error('MongoDB connection failed', err);
    process.exit(1);
});

// Server Exit Handler
const exitHandler = async () => {
    try {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
            });
        }

        await mongoose.connection.close();
        logger.info('MongoDB connection closed');

        process.exit(0);
    } catch (err) {
        logger.error('Error during shutdown', err);
        process.exit(1);
    }
};

// SIGTERM Handler
process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    exitHandler();
});

// SIGINT Handler
process.on('SIGINT', () => {
    logger.info('SIGINT received');
    exitHandler();
});

// Unexpected Error Handler
const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    process.exit(1);
};

// Uncaught Exception Handler
process.on('uncaughtException', unexpectedErrorHandler);

// Unhandled Rejection Handler
process.on('unhandledRejection', unexpectedErrorHandler);

