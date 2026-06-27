import {Response} from "express";

/**
 * @param {Response} res
 * @param {number} status
 * @param {Object | Array<Object>} data
 * @param {Object=} optional
 * @return {this}
 * @constructor
 */
const apiResponse = (res: Response, status: number, data = {} as {data?: any, message?: any}, optional = {}) => {
    const returnObject = {} as {data: any, message: string | null, stack: any};

    returnObject["data"] = data?.data ? data.data : null;
    returnObject["message"] = data?.message ? data.message : null;
    returnObject["stack"] = typeof optional !== "undefined" && Object.keys(optional).length > 0 ? optional : null;

    res.status(status);
    return res.json(returnObject);
};

export default apiResponse;