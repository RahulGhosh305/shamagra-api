"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadQuarterStats = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("@utils/catchAsync"));
const apiResponse_1 = __importDefault(require("@utils/apiResponse"));
const feCrmAcquisitionLead_model_1 = require("@models/feCrmAcquisitionLead.model");
const leadQuarterStats = (0, catchAsync_1.default)(async (req, res) => {
    const { organization } = req.query;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const monthArray = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const quarterLeadPendingConditions = { createdAt: { $gte: firstDay }, status: { $ne: feCrmAcquisitionLead_model_1.CrmAcquisitionLeadStatus.pending } };
    if (organization)
        Object.assign(quarterLeadPendingConditions, { "acquisition.organizations._id": organization });
    const quarterLeadPendingData = await feCrmAcquisitionLead_model_1.CrmAcquisitionLeadModel.aggregate([
        { $match: quarterLeadPendingConditions },
        { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
        { $sort: { "_id.month": 1 } },
        { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
    ]);
    const quarterLeadApprovedConditions = { createdAt: { $gte: firstDay }, status: { $ne: feCrmAcquisitionLead_model_1.CrmAcquisitionLeadStatus.approved } };
    if (organization)
        Object.assign(quarterLeadApprovedConditions, { "acquisition.organizations._id": organization });
    const quarterLeadApprovedData = await feCrmAcquisitionLead_model_1.CrmAcquisitionLeadModel.aggregate([
        { $match: quarterLeadApprovedConditions },
        { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
        { $sort: { "_id.month": 1 } },
        { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
    ]);
    const quarterLeadDeclinedConditions = { createdAt: { $gte: firstDay }, status: { $ne: feCrmAcquisitionLead_model_1.CrmAcquisitionLeadStatus.declined } };
    if (organization)
        Object.assign(quarterLeadDeclinedConditions, { "acquisition.organizations._id": organization });
    const quarterLeadDeclinedData = await feCrmAcquisitionLead_model_1.CrmAcquisitionLeadModel.aggregate([
        { $match: quarterLeadDeclinedConditions },
        { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
        { $sort: { "_id.month": 1 } },
        { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
    ]);
    const stats = [];
    for (let i = 0; i < monthArray.length; i++) {
        const month = monthArray[i];
        const pendingLead = quarterLeadPendingData.find((item) => item.month === month);
        const approvedLead = quarterLeadApprovedData.find((item) => item.month === month);
        const declinedLead = quarterLeadDeclinedData.find((item) => item.month === month);
        if (month)
            stats.push({
                date: `${month}, ${date.getFullYear()}`,
                Pending: pendingLead && (pendingLead === null || pendingLead === void 0 ? void 0 : pendingLead.month) && pendingLead.month === month ? pendingLead.count : 0,
                Approved: approvedLead && (approvedLead === null || approvedLead === void 0 ? void 0 : approvedLead.month) && approvedLead.month === month ? approvedLead.count : 0,
                Declined: declinedLead && (declinedLead === null || declinedLead === void 0 ? void 0 : declinedLead.month) && declinedLead.month === month ? declinedLead.count : 0,
            });
    }
    return (0, apiResponse_1.default)(res, http_status_1.default.OK, {
        data: { stats }
    });
});
exports.leadQuarterStats = leadQuarterStats;
