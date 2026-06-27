import expressRateLimiter from "express-rate-limit";
import config from "@config/config";

const expressRateLimit = expressRateLimiter({
    windowMs: config.expressSlow.windowBlockSec * 1000,
    max: config.expressSlow.perWindowMaxReq,
    message: `You have exceeded the ${config.expressSlow.perWindowMaxReq} requests in ${config.expressSlow.windowBlockSec} seconds limit!`,
});

export default expressRateLimit;