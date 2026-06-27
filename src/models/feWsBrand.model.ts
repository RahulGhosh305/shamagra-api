import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

interface DocumentType extends Document {
    name: string;
    photo: string;
    description?: string | null;
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema(
    {
        name: { type: String, required: true },
        photo: { type: String, required: false, default: null },
        description: { type: String, required: false, default: null },
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
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

const documentModel = model<DocumentType>("fe_ws_brand", documentSchema);
export {documentModel as WsBrandModel, documentStatus as WsBrandStatus}