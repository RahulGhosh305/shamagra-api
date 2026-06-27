import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    generated: 'generated',
    disbursed: 'disbursed',
});

interface DocumentType extends Document {
    user: {
        _id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: {
            phone: string;
            country: {
                _id: mongoose.Types.ObjectId;
                name: string;
                code: string;
            };
        };
        photo: string;
    };
    requestNo: string;
    amount: number;
    payments: {
        _id: mongoose.Types.ObjectId;
        invoiceNo: string;
        leadId: mongoose.Types.ObjectId;
        amount: number;
    }[];
    paymentMethod: {
        _id: string,
        type: string,
        mfsName: string,
        mfsNumber: string,
        bankName: string,
        bankBranch: string,
        bankAcc: string,
        bankAcHolder: string
    }
    status: keyof typeof documentStatus;
    createdAt: Date;
    updatedAt: Date;
}


const countrySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_country', default: null },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
}, { _id : false });

const feUserPhoneSchema = new Schema({
    phone: { type: String, required: false, default: null },
    country: { type: countrySchema, required: true, default: () => ({}) },
}, { _id : false });

const feUserSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    phone: { type: feUserPhoneSchema, required: false, default: () => ({}) },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const paymentSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_crm_payment' },
    invoiceNo: { type: String, required: false, default: null },
    leadId: { type: mongoose.Types.ObjectId, required: false, default: null },
    amount: { type: Number, required: true, default: null },
},{ _id : false });

const paymentMethodSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user_payment_method' },
    type: { type: String, required: false, default: null },
    mfsName: { type: String, required: false, default: null },
    mfsNumber: { type: String, required: false, default: null },
    bankName: { type: String, required: false, default: null },
    bankBranch: { type: String, required: false, default: null },
    bankAcc: { type: String, required: false, default: null },
    bankAcHolder: { type: String, required: false, default: null },
},{ _id : false });

const documentSchema = new Schema(
    {
        user: { type: feUserSchema, required: false, default: () => ({}) },
        requestNo: { type: String, required: false, default: null },
        amount: { type: Number, required: true },
        payments: [{ type: paymentSchema, required: false, default: [] }],
        paymentMethod: { type: paymentMethodSchema, required: false, default: () => ({}) },
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.generated },
    },
    { timestamps: true }
);

documentSchema.pre("save", async function (next: any) {
    let withdraw = this as unknown as DocumentType;
    const prevWithdraw = await documentModel.find().limit(1).sort({$natural:-1})

    let prevRequestNo = null;
    if (prevWithdraw && prevWithdraw.length) prevRequestNo = prevWithdraw[0].requestNo.split('_');
    if (withdraw.isModified("requestNo")) withdraw.requestNo = prevRequestNo ? `REQ_${parseInt(prevRequestNo[1]) + 1}` : `REQ_1`;

    next();
});

documentSchema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const documentModel = model<DocumentType>("fe_crm_withdraw", documentSchema);
export {documentModel as CrmWithdrawModel, documentStatus as CrmWithdrawStatus}