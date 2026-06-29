import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import apiResponse from "@utils/apiResponse";
import ApiError from "@utils/apiError";

import guestRoute from "@routes/guest.route";

import beAuthRoute from "@routes/back-end/auth.route";
import beUtilitiesRoute from "@routes/back-end/utilities.route";
import beDashboardRoute from "@routes/back-end/dashboard.route";
import beUmRoute from "@routes/back-end/um.route";
import beWsRoute from "@routes/back-end/ws.route";
import beWorkspaceRoute from "@routes/back-end/workspace.route";
import beClientsRoute from "@routes/back-end/clients.route";
import beMediaFilesRoute from "@routes/back-end/media.route";

import feAuthRoute from "@routes/front-end/auth.route";
import feUtilitiesRoute from "@routes/front-end/utilities.route";
import feLandingRoute from "@routes/front-end/landing.route";
import feOrderRoute from "@routes/front-end/order.route";
import feTemplateRoute from "@routes/front-end/template.route";
import feSearchRoute from "@routes/front-end/search.route";

const initRoutes = (app: any) => {
  app.use("/", guestRoute);

  // Back-end routes
  app.use("/back-end/auth", beAuthRoute);
  app.use("/back-end/dashboard", beDashboardRoute);
  app.use("/back-end/user-management", beUmRoute);
  app.use("/back-end/web-setup", beWsRoute);
  app.use("/back-end/workspace", beWorkspaceRoute);
  app.use("/back-end/clients", beClientsRoute);
  app.use("/back-end/utilities", beUtilitiesRoute);
  app.use("/back-end/media-files", beMediaFilesRoute);

  // Front-end routes
  app.use("/front-end/auth", feAuthRoute);
  app.use("/front-end/landing", feLandingRoute);
  app.use("/front-end/checkout", feOrderRoute);
  app.use("/front-end/search", feSearchRoute);
  app.use("/front-end/utilities", feUtilitiesRoute);
  app.use("/front-end/template", feTemplateRoute);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError(httpStatus.NOT_FOUND, "Invalid URL");
    return next(error);
  });

  app.use(
    (error: ApiError, req: Request, res: Response, next: NextFunction) => {
      const status = error.statusCode || res.statusCode || 500;
      const stack =
        process.env.NODE_ENVIRONMENT !== "production" ? error.stack : {};

      return apiResponse(res, status, { message: error.message }, stack);
    },
  );
};

export default initRoutes;
