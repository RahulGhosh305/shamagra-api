"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const axios_1 = __importDefault(require("axios"));
const sendSms = async (number, message) => {
    // return await axios({
    //     method: 'post',
    //     url: process.env.SSL_SMS_URL,
    //     data: {
    //         api_token: process.env.SSL_SMS_API_TOKEN,
    //         sid: process.env.SSL_SMS_SID,
    //         msisdn: number,
    //         sms: message,
    //         csms_id: process.env.SSL_SMS_CSMSID,
    //     },
    //     headers: {'Content-Type': 'application/json'}
    // })
    //     .then(function (response) {
    //         //handle success
    //         console.log(response)
    //         return true;
    //     })
    //     .catch(function (response) {
    //         //handle error
    //         console.log(response)
    //         return true;
    //     })
    return await (0, axios_1.default)({
        method: 'post',
        url: `${process.env.MT_BASE_URL}/send-sms`,
        data: {
            sender_id: process.env.MT_SENDER_ID,
            receiver: number,
            message,
            remove_duplicate: true
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${process.env.MT_AUTH_TOKEN}`
        }
    })
        .then(function (response) {
        //handle success
        console.log(response);
        return true;
    })
        .catch(function (response) {
        //handle error
        console.log(response);
        return true;
    });
};
exports.sendSms = sendSms;
