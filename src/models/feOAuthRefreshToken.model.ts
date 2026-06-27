import mongoose, {Schema, Document, model} from "mongoose";

interface DocumentType extends Document {
    user: {
        _id?: mongoose.Types.ObjectId;
        firstName?: string | null;
        lastName?: string | null;
        photo?: string | null;
    };
    accessToken: string;
    refreshToken: string;
    revoked?: boolean;
    expires: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
},{ _id: false });

const documentSchema = new Schema(
    {
        user: { type: userSchema, required: false, default: () => ({}) },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        revoked: { type: Boolean, required: false, default: false },
        expires: { type: Date, required: true },
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

const documentModel = model<DocumentType>("fe_o_auth_refresh_token", documentSchema);
export {documentModel as OAuthRefreshTokenModel}

