import mongoose, {Schema, Document, model} from "mongoose";

interface DocumentType extends Document {
    name: string;
    displayName: string;
    group: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        displayName: { type: String, required: true },
        group: { type: String, required: true },
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

const documentModel = model<DocumentType>("be_um_permission", documentSchema);
export {documentModel as UmPermissionModel}
