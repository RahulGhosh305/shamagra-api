import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import {CrmAcquisitionLeadModel, CrmAcquisitionLeadStatus} from "@models/feCrmAcquisitionLead.model";

const leadQuarterStats = catchAsync(async (req: Request, res: Response) => {
    const {organization} = req.query;
    const date      = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const monthArray = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const quarterLeadPendingConditions = { createdAt: {$gte: firstDay}, status: {$ne: CrmAcquisitionLeadStatus.pending} };
    if (organization) Object.assign(quarterLeadPendingConditions, {"acquisition.organizations._id": organization});
    const quarterLeadPendingData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadPendingConditions },
            { $group: { _id: {month: {$month: "$createdAt"}}, count: { $sum: "$acquisition.commission" } } },
            { $sort: {"_id.month": 1} },
            { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
        ]
    );

    const quarterLeadApprovedConditions = { createdAt: {$gte: firstDay}, status: {$ne: CrmAcquisitionLeadStatus.approved} };
    if (organization) Object.assign(quarterLeadApprovedConditions, {"acquisition.organizations._id": organization});
    const quarterLeadApprovedData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadApprovedConditions },
            { $group: { _id: {month: {$month: "$createdAt"}}, count: { $sum: "$acquisition.commission" } } },
            { $sort: {"_id.month": 1} },
            { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
        ]
    );

    const quarterLeadDeclinedConditions = { createdAt: {$gte: firstDay}, status: {$ne: CrmAcquisitionLeadStatus.declined} };
    if (organization) Object.assign(quarterLeadDeclinedConditions, {"acquisition.organizations._id": organization});
    const quarterLeadDeclinedData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadDeclinedConditions },
            { $group: { _id: {month: {$month: "$createdAt"}}, count: { $sum: "$acquisition.commission" } } },
            { $sort: {"_id.month": 1} },
            { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
        ]
    );

    const stats = [] as any;

    for (let i = 0; i < monthArray.length; i++) {
        const month = monthArray[i];
        const pendingLead = quarterLeadPendingData.find((item) => item.month === month);
        const approvedLead = quarterLeadApprovedData.find((item) => item.month === month);
        const declinedLead = quarterLeadDeclinedData.find((item) => item.month === month);

        if (month) stats.push({
            date: `${month}, ${date.getFullYear()}`,
            Pending: pendingLead && pendingLead?.month && pendingLead.month === month ? pendingLead.count : 0,
            Approved: approvedLead && approvedLead?.month && approvedLead.month === month ? approvedLead.count : 0,
            Declined: declinedLead && declinedLead?.month && declinedLead.month === month ? declinedLead.count : 0,
        })
    }

    return apiResponse(res, httpStatus.OK, {
        data: {stats}
    });
});

export { leadQuarterStats };
