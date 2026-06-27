import mongoose, {Schema, Document, model} from "mongoose";

const documentStatus = Object.freeze({
    pending: 'pending',
    approved: 'approved',
    declined: 'declined',
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
    user: {
        _id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: {
            phone: string;
            country: {
                _id: mongoose.Types.ObjectId;
                name: string;
                code: string;
            };
        };
        photo: string;
    };
    acquisition: {
        _id: mongoose.Types.ObjectId;
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
        commission: number;
        description: string;
        form: {
            steps: {
                _id: string,
                title: string;
                fields: {
                    title: string;
                    type: keyof typeof documentFormFieldType;
                    dropdowns: {
                        label: string;
                        value: string;
                    }[];
                    isRequired: boolean;
                    isLongText: boolean;
                    isMultipleFile: boolean;
                    isMultipleMedia: boolean;
                    isMultipleDropdown: boolean;
                    position: number;
                    value: string;
                    isDeclined: boolean;
                    declineReason: string;
                }[];
                isDeclined: boolean;
                position: number;
            }[];
        };
    };
    remarks: {
        user: {
            _id: mongoose.Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            photo: string;
        };
        remark: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    status: keyof typeof documentStatus;
    createdAt: Date;
    updatedAt: Date;
}

const countrySchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_country', default: null },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
}, { _id : false });

const feUserPhoneSchema = new Schema({
    phone: { type: String, required: false, default: null },
    country: { type: countrySchema, required: true, default: () => ({}) },
}, { _id : false });

const feUserSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    phone: { type: feUserPhoneSchema, required: false, default: () => ({}) },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const beUserSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'be_user' },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: false, default: null },
    phone: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null },
},{ _id : false });

const organizationSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
},{ _id : false });

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
    value: { type: String, required: false, default: null },
    isDeclined: { type: Boolean, required: false, default: false },
    declineReason: { type: String, required: false, default: null },
}, { timestamps: true });

const formStepsSchema = new Schema({
    title: { type: String, required: false, default: null },
    fields: [{ type: formStepsFieldsSchema, required: false, default: [] }],
    position: { type: Number, required: false, default: 0 },
    isDeclined: { type: Boolean, required: false, default: false },
}, { timestamps: true });

const formSchema = new Schema({
    steps: [{ type: formStepsSchema, required: false, default: [] }],
}, { timestamps: true });

const acquisitionSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_crm_acquisition_form' },
    organization: { type: organizationSchema, required: false, default: () => ({}) },
    categories: [{ type: categorySchema, required: false, default: [] }],
    subCategories: [{ type: categorySchema, required: false, default: [] }],
    brands: [{ type: brandSchema, required: false, default: [] }],
    name: { type: String, required: true },
    photo: { type: String, required: false, default: null },
    commission: { type: Number, required: false, default: null },
    description: { type: String, required: false, default: null },
    form: { type: formSchema, required: false, default: () => ({}) },
}, { _id: false });

const remarkSchema = new Schema({
    user: { type: beUserSchema, required: false, default: () => ({}) },
    remark: { type: String, required: false, default: null },
},{ timestamps: true });

const documentSchema = new Schema(
    {
        user: { type: feUserSchema, required: false, default: () => ({}) },
        acquisition: { type: acquisitionSchema, required: false, default: () => ({}) },
        remarks: [{ type: remarkSchema, required: false, default: [] }],
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.pending },
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

const documentModel = model<DocumentType>("fe_crm_acquisition_lead", documentSchema);
export {documentModel as CrmAcquisitionLeadModel, documentStatus as CrmAcquisitionLeadStatus}