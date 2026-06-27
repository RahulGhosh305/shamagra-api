import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

const documentFormFieldType = Object.freeze({
    text: 'text',
    email: 'email',
    number: 'number',
    enum: 'enum',
    boolean: 'boolean',
    dropdown: 'dropdown',
    date: 'date',
    datetime: 'datetime',
    media: 'media',
    file: 'file',
});

interface DocumentType extends Document {
    categories: {
        _id: mongoose.Types.ObjectId;
        name: string;
        photo: string;
    }[];
    subCategories: {
        _id: mongoose.Types.ObjectId;
        name: string;
        photo: string;
    }[];
    brands: {
        _id: mongoose.Types.ObjectId;
        name: string;
        photo: string;
    }[];
    name: string;
    photo: string;
    description: string;
    form: {
        steps: {
            title: string;
            fields: {
                title: string;
                type: string;
                position: number;
                dropdowns: {
                    label: string;
                    value: string;
                }[];
                isRequired: boolean;
                isLongText: boolean;
                isMultipleFile: boolean;
                isMultipleMedia: boolean;
                isMultipleDropdown: boolean;
            }[];
            position: number;
        }[];
    };
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_ws_category' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const subCategorySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_ws_sub_category' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const organizationSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
},{ _id : false });

const brandSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_ws_brand' },
    name: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const fieldDropdownSchema = new Schema({
    label: { type: String, required: false, default: null },
    value: { type: String, required: false, default: null },
}, { _id: false });

const formStepsFieldsSchema = new Schema({
    title: { type: String, required: false, default: null },
    type: { type: String, enum: Object.values(documentFormFieldType), required: false, default: documentFormFieldType.text },
    dropdowns: [{ type: fieldDropdownSchema, required: false, default: [] }],
    isRequired: { type: Boolean, required: false, default: false },
    isLongText: { type: Boolean, required: false, default: false },
    isMultipleFile: { type: Boolean, required: false, default: false },
    isMultipleMedia: { type: Boolean, required: false, default: false },
    isMultipleDropdown: { type: Boolean, required: false, default: false },
    position: { type: Number, required: false, default: 0 },
}, { timestamps: true });

const formStepsSchema = new Schema({
    title: { type: String, required: false, default: null },
    fields: [{ type: formStepsFieldsSchema, required: false, default: [] }],
    position: { type: Number, required: false, default: 0 },
}, { timestamps: true });

const formSchema = new Schema({
    steps: [{ type: formStepsSchema, required: false, default: [] }],
}, { timestamps: true });

const documentSchema = new Schema(
    {
        organization: { type: organizationSchema, required: false, default: () => ({}) },
        categories: [{ type: categorySchema, required: false, default: [] }],
        subCategories: [{ type: subCategorySchema, required: false, default: [] }],
        brands: [{ type: brandSchema, required: false, default: [] }],
        name: { type: String, required: true },
        photo: { type: String, required: false, default: null },
        commission: { type: Number, required: false, default: null },
        description: { type: String, required: false, default: null },
        form: { type: formSchema, required: false, default: () => ({}) },
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active },
        expiredAt: { type: Date, required: false, default: null },
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

const documentModel = model<DocumentType>("fe_crm_acquisition_form", documentSchema);
export {documentModel as CrmAcquisitionFormModel, documentStatus as CrmAcquisitionFormStatus}