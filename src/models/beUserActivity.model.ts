import mongoose, {Schema, Document, model} from "mongoose";

const userSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    phone: { type: String, required: false, default: null },
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
    dataId: mongoose.Types.ObjectId;
    permission: string;
    title: string;
    description: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema(
    {
        user: { type: userSchema, required: false, default: () => ({}) },
        dataId: { type: mongoose.Types.ObjectId, required: true },
        permission: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: false, default: null },
        reason: { type: String, required: false, default: null },
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

const documentModel = model<DocumentType>("be_user_activity", documentSchema);
export {documentModel as UserActivityModel}