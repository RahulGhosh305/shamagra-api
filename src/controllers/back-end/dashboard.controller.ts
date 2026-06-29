import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "@utils/catchAsync";
import apiResponse from "@utils/apiResponse";

import { CrmAcquisitionLeadModel, CrmAcquisitionLeadStatus } from "@models/feCrmAcquisitionLead.model";
import { OrderModel, OrderStatus } from "@models/feOrder.model";

const leadQuarterStats = catchAsync(async (req: Request, res: Response) => {
    const { organization } = req.query;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const monthArray = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const quarterLeadPendingConditions = { createdAt: { $gte: firstDay }, status: { $ne: CrmAcquisitionLeadStatus.pending } };
    if (organization) Object.assign(quarterLeadPendingConditions, { "acquisition.organizations._id": organization });
    const quarterLeadPendingData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadPendingConditions },
            { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
            { $sort: { "_id.month": 1 } },
            { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
        ]
    );

    const quarterLeadApprovedConditions = { createdAt: { $gte: firstDay }, status: { $ne: CrmAcquisitionLeadStatus.approved } };
    if (organization) Object.assign(quarterLeadApprovedConditions, { "acquisition.organizations._id": organization });
    const quarterLeadApprovedData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadApprovedConditions },
            { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
            { $sort: { "_id.month": 1 } },
            { $addFields: { month: { $let: { vars: { monthsInString: monthArray }, in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] } } } } },
        ]
    );

    const quarterLeadDeclinedConditions = { createdAt: { $gte: firstDay }, status: { $ne: CrmAcquisitionLeadStatus.declined } };
    if (organization) Object.assign(quarterLeadDeclinedConditions, { "acquisition.organizations._id": organization });
    const quarterLeadDeclinedData = await CrmAcquisitionLeadModel.aggregate(
        [
            { $match: quarterLeadDeclinedConditions },
            { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: "$acquisition.commission" } } },
            { $sort: { "_id.month": 1 } },
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
        data: { stats }
    });
});

const salesOrderStats = catchAsync(async (req: Request, res: Response) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Orders
    const totalOrder = await OrderModel.countDocuments({
        orderStatus: { $nin: [OrderStatus.deleted] }
    });
    const todayOrder = await OrderModel.countDocuments({
        createdAt: { $gte: startOfToday },
        orderStatus: { $nin: [OrderStatus.deleted] }
    });

    // Pending Orders
    const totalPendingOrder = await OrderModel.countDocuments({
        orderStatus: OrderStatus.pending
    });
    const todayPendingOrder = await OrderModel.countDocuments({
        createdAt: { $gte: startOfToday },
        orderStatus: OrderStatus.pending
    });

    // Completed Orders
    const totalCompletedOrder = await OrderModel.countDocuments({
        orderStatus: OrderStatus.delivered
    });
    const todayCompletedOrder = await OrderModel.countDocuments({
        createdAt: { $gte: startOfToday },
        orderStatus: OrderStatus.delivered
    });

    // Total Revenue
    const totalRevenueAggregation = await OrderModel.aggregate([
        {
            $match: {
                orderStatus: { $nin: [OrderStatus.cancelled, OrderStatus.returned, OrderStatus.deleted] }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$pricing.totalAmount" }
            }
        }
    ]);
    const totalRevenue = totalRevenueAggregation.length > 0 ? totalRevenueAggregation[0].totalRevenue : 0;

    // Today Revenue
    const todayRevenueAggregation = await OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfToday },
                orderStatus: { $nin: [OrderStatus.cancelled, OrderStatus.returned, OrderStatus.deleted] }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$pricing.totalAmount" }
            }
        }
    ]);
    const todayRevenue = todayRevenueAggregation.length > 0 ? todayRevenueAggregation[0].totalRevenue : 0;

    return apiResponse(res, httpStatus.OK, {
        data: {
            totalOrder,
            todayOrder,
            totalPendingOrder,
            todayPendingOrder,
            totalCompletedOrder,
            todayCompletedOrder,
            totalRevenue,
            todayRevenue
        }
    });
});

export { leadQuarterStats, salesOrderStats };
