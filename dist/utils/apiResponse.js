"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {Response} res
 * @param {number} status
 * @param {Object | Array<Object>} data
 * @param {Object=} optional
 * @return {this}
 * @constructor
 */
const apiResponse = (res, status, data = {}, optional = {}) => {
    const returnObject = {};
    returnObject["data"] = (data === null || data === void 0 ? void 0 : data.data) ? data.data : null;
    returnObject["message"] = (data === null || data === void 0 ? void 0 : data.message) ? data.message : null;
    returnObject["stack"] = typeof optional !== "undefined" && Object.keys(optional).length > 0 ? optional : null;
    res.status(status);
    return res.json(returnObject);
};
exports.default = apiResponse;
