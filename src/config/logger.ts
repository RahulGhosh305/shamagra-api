const winston = require("winston");
import config from "@config/config";

const enumerateErrorFormat = winston.format((info: Error) => {
    if (info?.stack) Object.assign(info, { message: info.stack });
    return info;
});

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf((params: {level: string, message: string}) => `${params.level}: ${params.message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

export default logger;
