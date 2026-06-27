import mongoose, {Schema, Document, model} from "mongoose";

const documentType = Object.freeze({ lead: 'lead' });

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
    dataId: string,
    title: string,
    description: string,
    thumbnail: string,
    type: string,
    isSeen: boolean,
    isRedirect: boolean,
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema(
    {
        receiver: { type: feUserSchema, required: false, default: () => ({}) },
        sender: { type: feUserSchema, required: false, default: () => ({}) },
        dataId: { type: mongoose.Types.ObjectId, required: false, default: null },
        title: { type: String, required: false, default: null },
        description: { type: String, required: false, default: null },
        thumbnail: { type: String, required: false, default: null },
        type: { type: String, enum: Object.values(documentType), required: true },
        isSeen: { type: Boolean, required: false, default: false },
        isRedirect: { type: Boolean, required: false, default: false },
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

const documentModel = model<DocumentType>("fe_user_notification", documentSchema);
export {documentModel as UserNotificationModel, documentType as UserNotificationType}