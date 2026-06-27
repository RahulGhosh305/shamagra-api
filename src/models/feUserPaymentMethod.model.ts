import mongoose, {Schema, Document, model} from "mongoose";

const documentType = Object.freeze({ mfs: 'mfs', bank: 'bank' });

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

interface DocumentType extends Document {
    user: {
        _id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        photo: string;
    };
    type: string,
    mfsName: string,
    mfsNumber: string,
    bankName: string,
    bankBranch: string,
    bankAcc: string,
    bankAcHolder: string
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema(
    {
        user: { type: feUserSchema, required: false, default: () => ({}) },
        type: { type: String, enum: Object.values(documentType), required: true },
        mfsName: { type: String, required: false, default: null },
        mfsNumber: { type: String, required: false, default: null },
        bankName: { type: String, required: false, default: null },
        bankBranch: { type: String, required: false, default: null },
        bankAcc: { type: String, required: false, default: null },
        bankAcHolder: { type: String, required: false, default: null },
    },
    { timestamps: true }
);

documentSchema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const documentModel = model<DocumentType>("fe_user_payment_method", documentSchema);
export {documentModel as UserPaymentMethodModel}