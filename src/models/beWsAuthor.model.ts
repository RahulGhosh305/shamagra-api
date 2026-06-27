import mongoose, { Document, model, Schema, Types } from 'mongoose';

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

interface DocumentType extends Document {
    name: string;
    description: string;
    position?: number;
    isDisabled?: boolean;
    status?: keyof typeof documentStatus;
}

const documentSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: null },
        position: { type: Number, default: 0 },
        isDisabled: { type: Boolean, default: false },
        status: { type: String, default: documentStatus.active, enum: Object.values(documentStatus) },
    },
    {
        timestamps: true,
        collection: 'be_ws_authors'
    }
);

documentSchema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const documentModel = model<DocumentType>("be_ws_author", documentSchema);
export { documentModel as WsAuthorModel, documentStatus as WsAuthorStatus }
