import express, { Request } from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import passport from "passport";

import config from "@config/config";
import morgan from "@config/morgan";
import passportHttpInit from "@config/passportHttp";
import passportJwtInit from "@config/passportJwt";
import expressSlowDown from "@config/expressSlowDowner";
import expressRateLimit from "@config/expressRateLimiter";
import initRoutes from "@routes/index";

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize({
  replaceWith: '_'
}));
app.use(compression());
const corsOrigins = config.corsOrigins === '*' 
  ? '*' 
  : config.corsOrigins.split(',').map((o: string) => o.trim());

app.use(cors({ origin: corsOrigins, credentials: true }));
app.options('*', cors({ origin: corsOrigins, credentials: true }));
app.use(passport.initialize());

passport.use("basic", passportHttpInit);
passport.use("jwt", passportJwtInit);

if (config.env === "production") {
  app.use(expressSlowDown);
  app.use(expressRateLimit);
}

// All Routes Initialization
initRoutes(app);

export default app;
