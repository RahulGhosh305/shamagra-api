"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SENDGRID_API_KEY) !== null && _b !== void 0 ? _b : "");
const sendEmail = async ({ to, subject, text, html, templateId, dynamicData, }) => {
    const msg = { to, from: 'FitHobo.com <info@fithobo.com>', subject };
    if (text)
        Object.assign(msg, { text });
    if (html)
        Object.assign(msg, { html });
    if (templateId)
        Object.assign(msg, { template_id: templateId });
    if (dynamicData)
        Object.assign(msg, { dynamic_template_data: dynamicData });
    try {
        // @ts-ignore
        await mail_1.default.send(msg);
        return true;
    }
    catch (error) {
        console.error(error);
        console.log(error);
        return false;
    }
};
exports.sendEmail = sendEmail;
