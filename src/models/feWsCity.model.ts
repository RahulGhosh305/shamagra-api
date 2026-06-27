import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

const countrySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_ws_country' },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
    latitude: { type: Number, required: false, default: null },
    longitude: { type: Number, required: false, default: null }
},{ _id : false });

interface DocumentType extends Document {
    name: string;
    country: {
        _id?: mongoose.Types.ObjectId | null;
        name?: string | null;
        code?: string | null;
        latitude?: number | null;
        longitude?: number | null;
    };
    latitude?: number | null;
    longitude?: number | null;
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}


const documentSchema = new Schema(
    {
        name: { type: String, required: true },
        country: { type: countrySchema, required: true },
        latitude: { type: Number, required: false, default: null },
        longitude: { type: Number, required: false, default: null },
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

const documentModel = model<DocumentType>("fe_ws_city", documentSchema);
export {documentModel as WsCityModel, documentStatus as WsCityStatus}

