import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

interface DocumentType extends Document {
    name: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema(
    {
        name: { type: String, required: true, },
        description: { type: String, required: true },
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

const documentModel = model<DocumentType>("fe_organization", documentSchema);
export {
    documentModel as OrganizationModel,
    documentStatus as OrganizationStatus,
}

