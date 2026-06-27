import mongoose, { Schema, Document, model } from "mongoose";
interface DocumentType extends Document {
  category: {
    _id: string;
    name: string;
  };
  photo: string;
  file: string;
  product: {
    productCode: string;
    title: string;
    subTitle: string;
    author: string;
  };
  rating: {
    averageScore: string;
    totalReviews: string;
  };
  pricing: {
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
  };
  authorDescription: string;
  description: {
    short: string;
    long: string;
  };
  shippingInfo: {
    freeShippingThreshold: string;
    returnPolicy: string;
    secureShopping: string;
  };
  specifications: {
    format: string;
    totalPages: string;
    publishDate: Date;
    language: string;
    originCountry: string;
    dimensions: string;
    weight: string;
    sku: string;
    category: string;
  };
  features: string[];
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentStatus = Object.freeze({
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
});

const categorySchema = new Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "fe_ws_category",
    },
    name: { type: String, required: false, default: null },
  },
  { _id: false },
);

const descriptionSchema = new Schema(
  {
    short: { type: String, required: false, default: null },
    long: { type: String, required: false, default: null },
  },
  { _id: false },
);

const pricingSchema = new Schema({
  originalPrice: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  currency: { type: String, default: "৳" },
}, { _id: false });

const productSchema = new Schema({
  productCode: { type: String, required: false, default: null },
  title: { type: String, required: false, default: null },
  subTitle: { type: String, required: false, default: null },
  author: { type: String, required: false, default: null },
}, { _id: false });

const shippingSchema = new Schema({
  freeShippingThreshold: { type: String, default: null },
  returnPolicy: { type: String, default: null },
  secureShopping: { type: String, default: null },
}, { _id: false });

const specificationSchema = new Schema({
  format: { type: String, default: null },
  totalPages: { type: String, default: null },
  publishDate: { type: String, default: null }, // Date ও ব্যবহার করা যাবে
  language: { type: String, default: "English" },
  originCountry: { type: String, default: null },
  dimensions: { type: String, default: null },
  weight: { type: String, default: null },
  sku: { type: String, default: null },
  category: { type: categorySchema, required: true },
}, { _id: false });



const ratingSchema = new Schema({
  averageScore: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { _id: false });

const documentSchema = new Schema(
  {
    product: { type: productSchema, required: true },
    photo: { type: String, required: false, default: null },
    file: { type: String, required: false, default: null },
    pricing: { type: pricingSchema, default: () => ({}) },
    rating: { type: ratingSchema, default: () => ({}) },
    shippingInfo: { type: shippingSchema, default: () => ({}) },
    specifications: { type: specificationSchema, default: () => ({}) },
    authorDescription: { type: String, required: false, default: null },
    description: {
      type: descriptionSchema,
      required: false,
      default: () => ({}),
    },
    features: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(documentStatus),
      required: false,
      default: documentStatus.active,
    },
  },
  { timestamps: true },
);

documentSchema.methods.toJSON = function () {
  let obj = this.toObject();

  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const documentModel = model<DocumentType>(
  "fe_workspace_product",
  documentSchema,
);
export {
  documentModel as WorkspaceProductModel,
  documentStatus as WorkspaceProductStatus,
};
