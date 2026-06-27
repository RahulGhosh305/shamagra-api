import expressSlowDowner from "express-slow-down";
import config from "@config/config";

const expressSlowDown = expressSlowDowner({
    windowMs: config.expressSlow.windowBlockSec * 1000,
    delayAfter: config.expressSlow.perWindowMaxReq,
    delayMs: config.expressSlow.windowDelay * 1000,
});

export default expressSlowDown;