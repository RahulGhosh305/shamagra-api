import bcrypt from "bcrypt";
import mongoose, { Schema, Document, model } from "mongoose";

export interface DocumentType extends Document {
    role: {
        _id?: mongoose.Types.ObjectId;
        name?: string | null;
    };
    department: {
        _id?: mongoose.Types.ObjectId;
        name?: string | null;
    };
    team: {
        _id?: mongoose.Types.ObjectId;
        name?: string | null;
    };
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    gender?: string;
    photo?: string | null;
    email: string;
    username: string;
    password: string;
    personal: {
        dateOfBirth?: Date | null;
        birthPlace?: string | null;
        bloodGroup?: string | null;
        fathersName?: string | null;
        fathersPhone?: string | null;
        fathersOccupation?: string | null;
        mothersName?: string | null;
        mothersPhone?: string | null;
        mothersOccupation?: string | null;
        identity?: {
            type?: string;
            identity?: string;
        }[];
        religion?: string | null;
        presentAddress?: string | null;
        permanentAddress?: string | null;
    };
    emergency: {
        name?: string | null;
        number?: string | null;
        relation?: string | null;
        address?: string | null;
    }[];
    office: {
        designation?: string | null;
        joiningDate?: Date | null;
        resignationDate?: Date | null;
        lastWorkingDate?: Date | null;
    };
    access: {
        inTime?: string | null;
        outTime?: string | null;
        ip?: string | null;
        accessWithoutIp?: boolean;
    };
    superAdmin: boolean;
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentStatus = Object.freeze({ active: 'active', inactive: 'inactive', deleted: 'deleted' });
const documentGender = Object.freeze({ male: 'male', female: 'female' });
const documentIdentityType = Object.freeze({ nid: 'nid', passport: 'passport', birthCertificate: 'birth_certificate' });

const roleSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'be_um_role' },
    name: { type: String, required: false, default: null }
}, { _id: false });

const departmentSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'be_um_department' },
    name: { type: String, required: false, default: null }
}, { _id: false });

const teamSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'be_um_team' },
    name: { type: String, required: false, default: null }
}, { _id: false });

const accessSchema = new Schema({
    inTime: { type: String, required: false, default: null },
    outTime: { type: String, required: false, default: null },
    ip: { type: String, required: false, default: null },
    accessWithoutIp: { type: Boolean, required: false, default: false },
}, { _id: false });

const identitySchema = new Schema([{
    type: { type: String, enum: Object.values(documentIdentityType), required: false, default: null },
    identity: { type: String, required: false, default: null },
}, { _id: false }]);

const personalSchema = new Schema({
    dateOfBirth: { type: Date, required: false, default: null },
    birthPlace: { type: String, required: false, default: null },
    bloodGroup: { type: String, required: false, default: null },
    fathersName: { type: String, required: false, default: null },
    fathersPhone: { type: String, required: false, default: null },
    fathersOccupation: { type: String, required: false, default: null },
    mothersName: { type: String, required: false, default: null },
    mothersPhone: { type: String, required: false, default: null },
    mothersOccupation: { type: String, required: false, default: null },
    identity: { type: identitySchema, required: false },
    religion: { type: String, required: false, default: null },
    presentAddress: { type: String, required: false, default: null },
    permanentAddress: { type: String, required: false, default: null },
}, { _id: false });

const emergencySchema = new Schema([{
    name: { type: String, required: false, default: null },
    number: { type: String, required: false, default: null },
    relation: { type: String, required: false, default: null },
    address: { type: String, required: false, default: null },
}, { _id: false }]);

const officeSchema = new Schema({
    designation: { type: String, required: false, default: null },
    joiningDate: { type: Date, required: false, default: null },
    resignationDate: { type: Date, required: false, default: null },
    lastWorkingDate: { type: Date, required: false, default: null },
}, { _id: false });

const vendorOrganizationSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_organization' },
    name: { type: String, required: false, default: null },
}, { _id: false });

const vendorSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: false, ref: 'fe_user' },
    isVendor: { type: Boolean, required: false, default: false },
    organization: { type: vendorOrganizationSchema, required: false, default: () => ({}) },
    designation: { type: String, required: false, default: null },
    employeeId: { type: String, required: false, default: null },
    department: { type: String, required: false, default: null },
    overview: { type: String, required: false, default: null },
    status: { type: String, required: false, default: null },
}, { _id: false });

const documentSchema = new Schema(
    {
        role: { type: roleSchema, required: false, default: () => ({}) },
        department: { type: departmentSchema, required: false, default: () => ({}) },
        team: { type: teamSchema, required: false, default: () => ({}) },
        firstName: { type: String, required: false, default: null },
        lastName: { type: String, required: false, default: null },
        phone: { type: String, required: false, default: null },
        gender: { type: String, enum: Object.values(documentGender), required: false, default: documentGender.male },
        photo: { type: String, required: false, default: null },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true, validate: { validator: (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value), message: "Invalid email format", }, },
        username: { type: String, required: true, unique: true, trim: true, lowercase: true, },
        password: { type: String, required: true, },
        personal: { type: personalSchema, required: false, default: () => ({}) },
        emergency: { type: emergencySchema, required: false, default: () => ({}) },
        office: { type: officeSchema, required: false, default: () => ({}) },
        access: { type: accessSchema, required: false, default: () => ({}) },
        vendor: { type: vendorSchema, required: false, default: () => ({}) },
        superAdmin: { type: Boolean, required: true, },
        status: { type: String, enum: Object.values(documentStatus), default: documentStatus.active },
    },
    { timestamps: true }
);

documentSchema.pre("save", async function (next: any) {
    let user = this as DocumentType;
    if (!user.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hashSync(user.password, salt);
    return next();
});

documentSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as DocumentType;
    return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

documentSchema.statics.isUnique = async function (username: string, email: string) {
    const user = await this.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        return true;
    } else if (user.username === username && user.email === email) {
        return { username, email };
    } else if (user.email === email) {
        return { email };
    } else if (user.username === username) {
        return { username };
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

const documentModel = mongoose.model<DocumentType>("be_user", documentSchema);
export { documentModel as UserModel, documentStatus as UserStatus, documentGender as UserGender, documentIdentityType as UserIdentityType };
