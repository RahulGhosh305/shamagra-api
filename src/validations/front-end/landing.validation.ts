import Joi from "joi";
import { validate } from "@utils/validate";

const addPaymentMethod = validate({
    body: Joi.object({
        type: Joi.string().required(),
        mfsName: Joi.string().allow(null, '').required(),
        mfsNumber: Joi.string().allow(null, '').required(),
        bankName: Joi.string().allow(null, '').required(),
        bankBranch: Joi.string().allow(null, '').required(),
        bankAcc: Joi.string().allow(null, '').required(),
        bankAcHolder: Joi.string().allow(null, '').required(),
    }),
});

const updatePaymentMethod = validate({
    params: Joi.object({
        _id: Joi.string().required(),
    }),
    body: Joi.object({
        type: Joi.string().required(),
        mfsName: Joi.string().allow(null, '').required(),
        mfsNumber: Joi.string().allow(null, '').required(),
        bankName: Joi.string().allow(null, '').required(),
        bankBranch: Joi.string().allow(null, '').required(),
        bankAcc: Joi.string().allow(null, '').required(),
        bankAcHolder: Joi.string().allow(null, '').required(),
    }),
});

const withdrawPayment = validate({
    body: Joi.object({
        paymentMethodId: Joi.string().required(),
    }),
});

export {
    addPaymentMethod,
    updatePaymentMethod,
    withdrawPayment
}
