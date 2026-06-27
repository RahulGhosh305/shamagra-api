import mongoose, {Schema, Document, model} from "mongoose";
import bcrypt from "bcrypt";

const documentStatus = Object.freeze({
    generated: 'generated',
    withdrawn: 'withdrawn',
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
    invoiceNo: string;
    leadId: mongoose.Types.ObjectId;
    amount: number;
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

const documentSchema = new Schema(
    {
        user: { type: feUserSchema, required: false, default: () => ({}) },
        invoiceNo: { type: String, required: false, default: null },
        leadId: { type: mongoose.Types.ObjectId, required: false, default: null },
        amount: { type: Number, required: true, default: null },
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.generated },
    },
    { timestamps: true }
);

documentSchema.pre("save", async function (next: any) {
    let payment = this as DocumentType;
    const prevPayment = await documentModel.find().limit(1).sort({$natural:-1})

    let prevInvoiceNo = null;
    if (prevPayment && prevPayment.length) prevInvoiceNo = prevPayment[0].invoiceNo.split('_');
    if (payment.isModified("invoiceNo")) payment.invoiceNo = prevInvoiceNo ? `INV_${parseInt(prevInvoiceNo[1]) + 1}` : `INV_1`;

    next();
});

documentSchema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const documentModel = model<DocumentType>("fe_crm_payment", documentSchema);
export {documentModel as CrmPaymentModel, documentStatus as CrmPaymentStatus}