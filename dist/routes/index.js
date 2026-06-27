"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const apiError_1 = __importDefault(require("@utils/apiError"));
const guest_route_1 = __importDefault(require("@routes/guest.route"));
const auth_route_1 = __importDefault(require("@routes/back-end/auth.route"));
const utilities_route_1 = __importDefault(require("@routes/back-end/utilities.route"));
const dashboard_route_1 = __importDefault(require("@routes/back-end/dashboard.route"));
const um_route_1 = __importDefault(require("@routes/back-end/um.route"));
const ws_route_1 = __importDefault(require("@routes/back-end/ws.route"));
const workspace_route_1 = __importDefault(require("@routes/back-end/workspace.route"));
const clients_route_1 = __importDefault(require("@routes/back-end/clients.route"));
const media_route_1 = __importDefault(require("@routes/back-end/media.route"));
const auth_route_2 = __importDefault(require("@routes/front-end/auth.route"));
const utilities_route_2 = __importDefault(require("@routes/front-end/utilities.route"));
const landing_route_1 = __importDefault(require("@routes/front-end/landing.route"));
const order_route_1 = __importDefault(require("@routes/front-end/order.route"));
const template_route_1 = __importDefault(require("@routes/front-end/template.route"));
const search_route_1 = __importDefault(require("@routes/front-end/search.route"));
const initRoutes = (app) => {
    app.use("/", guest_route_1.default);
    // Back-end routes
    app.use("/back-end/auth", auth_route_1.default);
    app.use("/back-end/utilities", utilities_route_1.default);
    app.use("/back-end/dashboard", dashboard_route_1.default);
    app.use("/back-end/user-management", um_route_1.default);
    app.use("/back-end/web-setup", ws_route_1.default);
    app.use("/back-end/workspace", workspace_route_1.default);
    app.use("/back-end/clients", clients_route_1.default);
    app.use("/back-end/media-files", media_route_1.default);
    // Front-end routes
    app.use("/front-end/auth", auth_route_2.default);
    app.use("/front-end/utilities", utilities_route_2.default);
    app.use("/front-end/landing", landing_route_1.default);
    app.use("/front-end/search", search_route_1.default);
    app.use("/front-end/template", template_route_1.default);
    app.use("/front-end/checkout", order_route_1.default);
    app.use((req, res, next) => {
        const error = new apiError_1.default(http_status_1.default.NOT_FOUND, "Invalid URL");
        return next(error);
    });
    app.use((error, req, res, next) => {
        const status = error.statusCode || res.statusCode || 500;
        const stack = process.env.NODE_ENVIRONMENT !== "production" ? error.stack : {};
        return (0, apiResponse_1.default)(res, status, { message: error.message }, stack);
    });
};
exports.default = initRoutes;
