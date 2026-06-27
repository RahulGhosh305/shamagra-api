import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

const categorySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_ws_category' },
    name: { type: String, required: false, default: null },
},{ _id : false });

interface DocumentType extends Document {
    category: {
        _id?: mongoose.Types.ObjectId | null;
        name?: string | null;
    };
    name: string;
    photo: string;
    color?: string | null;
    description?: string | null;
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema(
    {
        name: { type: String, required: true },
        category: { type: categorySchema, required: true },
        photo: { type: String, required: false, default: null },
        color: { type: String, required: false, default: null },
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

const documentModel = model<DocumentType>("fe_ws_sub_category", documentSchema);
export {documentModel as WsSubCategoryModel, documentStatus as WsSubCategoryStatus}