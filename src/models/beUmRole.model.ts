import mongoose, { Schema, Document, model } from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

interface DocumentType extends Document {
    name: string;
    description?: string | null;
    isSystemDefined?: boolean;
    permissions: string[];
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema(
    {
        name: { type: String, unique: true, required: true, trim: true },
        description: { type: String, required: false, default: null },
        isSystemDefined: { type: Boolean, required: false, default: false },
        permissions: [{ type: String, required: false, default: [] }],
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

const documentModel = model<DocumentType>("be_um_role", documentSchema);
export { documentModel as UmRoleModel, documentStatus as UmRoleStatus }
