import bcrypt from "bcrypt";
import mongoose, { Schema, Document, model } from "mongoose";

interface DocumentType extends Document {
    userNo: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    otp: {
        otp: string;
        verified: boolean;
    };
    password: string;
    gender: keyof typeof documentGender;
    photo: string;
    overview: string;
    services: {
        vendor: {
            isVendor: boolean;
            organization: {
                _id: mongoose.Types.ObjectId;
                name: string;
            };
            branch: {
                _id: mongoose.Types.ObjectId;
                name: string;
            };
            designation: string;
            employeeId: string;
            department: string;
            overview: string;
            status: keyof typeof documentServicesStatus | null;
        };
    };
    social: {
        facebook: string;
        linkedin: string;
        instagram: string;
        twitter: string;
    };
    personal: {
        fathersName: string;
        mothersName: string;
        presentAddress: string;
        permanentAddress: string;
        occupation: string;
        dateOfBirth: Date;
        isMarried: boolean;
        spouseName: string;
        nationality: string;
        religion: string;
        monthlyIncome: number | null;
        nid: {
            name: string;
            uid: string;
            file: string;
            type: keyof typeof documentFileType;
        };
    };
    accountClose: {
        isRequested: boolean;
        reason: string
    }
    status: keyof typeof documentStatus;
    createdAt: Date;
    updatedAt: Date;
}

const documentStatus = Object.freeze({ active: 'active', inactive: 'inactive', deleted: 'deleted' });
const documentGender = Object.freeze({ male: 'male', female: 'female', other: 'other', null: null });
const documentFileType = Object.freeze({ nid: 'nid', null: null });
const documentServicesStatus = Object.freeze({ requested: 'requested', rejected: 'rejected', approved: 'approved', null: null });

const fileSchema = new Schema({
    name: { type: String, required: false, default: null },
    uid: { type: String, required: false, default: null },
    file: { type: String, required: false, default: null },
    type: { type: String, enum: Object.values(documentFileType), required: false, default: documentFileType.null }
}, { _id: false });

const otpSchema = new Schema({
    otp: { type: String, required: false, default: null },
    verified: { type: Boolean, required: false, default: false }
}, { _id: false });

const organizationSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
}, { _id: false });

const organizationBranchSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_organization_branch' },
    name: { type: String, required: false, default: null },
}, { _id: false });

const vendorSchema = new Schema({
    isVendor: { type: Boolean, required: false, default: false },
    organization: { type: organizationSchema, required: false, default: () => ({}) },
    branch: { type: organizationBranchSchema, required: false, default: () => ({}) },
    designation: { type: String, required: false, default: null },
    employeeId: { type: String, required: false, default: null },
    department: { type: String, required: false, default: null },
    overview: { type: String, required: false, default: null },
    status: { type: String, enum: Object.values(documentServicesStatus), required: false, default: null }
}, { _id: false });

const servicesSchema = new Schema({
    vendor: { type: vendorSchema, required: false, default: () => ({}) },
}, { _id: false });

const socialSchema = new Schema({
    facebook: { type: String, required: false, default: null },
    linkedin: { type: String, required: false, default: null },
    instagram: { type: String, required: false, default: null },
    twitter: { type: String, required: false, default: null },
}, { _id: false });

const personalSchema = new Schema({
    fathersName: { type: String, required: false, default: null },
    mothersName: { type: String, required: false, default: null },
    presentAddress: { type: String, required: false, default: null },
    permanentAddress: { type: String, required: false, default: null },
    occupation: { type: String, required: false, default: null },
    dateOfBirth: { type: Date, required: false, default: null },
    isMarried: { type: Boolean, required: false, default: false },
    spouseName: { type: String, required: false, default: null },
    nationality: { type: String, required: false, default: null },
    religion: { type: String, required: false, default: null },
    monthlyIncome: { type: Number, required: false, default: null },
    nid: { type: fileSchema, required: false, default: () => ({}) },
}, { _id: false });

const accountCloseSchema = new Schema({
    isRequested: { type: Boolean, required: false, default: false },
    reason: { type: String, required: false, default: null },
}, { _id: false });

const documentSchema = new Schema(
    {
        userNo: { type: String, required: false, default: null, },
        firstName: { type: String, required: true, },
        lastName: { type: String, required: true, },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        otp: { type: otpSchema, required: false, default: () => ({}) },
        password: { type: String, required: true },
        gender: { type: String, enum: Object.values(documentGender), required: false, default: documentGender.null },
        photo: { type: String, required: false, default: null },
        overview: { type: String, required: false, default: null },
        services: { type: servicesSchema, required: false, default: () => ({}) },
        social: { type: socialSchema, required: false, default: () => ({}) },
        personal: { type: personalSchema, required: false, default: () => ({}) },
        accountClose: { type: accountCloseSchema, required: false, default: () => ({}) },
        status: { type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active }
    },
    { timestamps: true }
);

documentSchema.pre("save", async function (next: any) {
    // @ts-ignore
    let user = this as DocumentType;
    if (!user.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hashSync(user.password ?? "", salt);

    const prevUser = await documentModel.find().limit(1).sort({ $natural: -1 })
    let serialNumber = 1;

    if (prevUser.length > 0) {
        const prevUserNo = prevUser[0].userNo.split('-');
        serialNumber = parseInt(prevUserNo[1].slice(-5)) + 1;
    }

    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    user.userNo = `DFL-${currentYear}${currentMonth}${serialNumber.toString().padStart(5, '0')}`;

    return next();
});

documentSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as DocumentType;
    return bcrypt.compare(candidatePassword, user.password ?? "").catch(() => false);
};

documentSchema.statics.isUnique = async function (email: string, phone: string) {
    const user = await this.findOne({
        $or: [
            { email },
            { phone }
        ]
    }, { email: true, phone: true });
    if (!user) {
        return true;
    } else if (email && user.email === email) {
        return { email };
    } else if (phone && user.phone === phone) {
        return { phone };
    }
    return true;
};

documentSchema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const documentModel = mongoose.model<DocumentType>("fe_user", documentSchema);
export { documentModel as UserModel, documentStatus as UserStatus, documentGender as UserGender, documentServicesStatus as UserServicesStatus };
