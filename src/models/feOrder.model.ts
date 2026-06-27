import mongoose, { Schema, Document, model } from "mongoose";

const orderStatus = Object.freeze({
  pending: "pending",
  confirmed: "confirmed",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  returned: "returned",
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
});

const paymentStatus = Object.freeze({
  pending: "pending",
  completed: "completed",
  failed: "failed",
  refunded: "refunded",
});

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  _id?: mongoose.Types.ObjectId;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  companyName?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  district: string;
  thana: string;
  country: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  _id?: mongoose.Types.ObjectId;
}

interface DocumentType extends Document {
  user: {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  pricing: {
    subtotal: number;
    shippingCharge: number;
    taxAmount: number;
    totalAmount: number;
  };
  payment: {
    method: "cod" | "mobile" | "bank";
    status: keyof typeof paymentStatus;
    transactionId?: string;
  };
  orderNotes?: string;
  orderStatus: keyof typeof orderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "fe_country",
      default: null,
    },
    name: { type: String, required: false, default: null },
    code: { type: String, required: false, default: null },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "fe_workspace_product",
      required: true,
    },
    productTitle: { type: String, required: true },
    productCode: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: true },
);

const shippingAddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: false, default: null },
    streetAddress: { type: String, required: true },
    apartment: { type: String, required: false, default: null },
    city: { type: String, required: true },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: true },
);

const pricingSchema = new Schema(
  {
    subtotal: { type: Number, required: true, default: 0 },
    shippingCharge: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { _id: false },
);

const paymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["cod", "mobile", "bank"],
      required: true,
      default: "cod",
    },
    status: {
      type: String,
      enum: Object.values(paymentStatus),
      required: false,
      default: paymentStatus.pending,
    },
    transactionId: { type: String, required: false, default: null },
  },
  { _id: false },
);

const feUserSchema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, ref: "fe_user", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: feUserSchema, required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [{ type: orderItemSchema, required: true }],
    shippingAddress: { type: shippingAddressSchema, required: true },
    pricing: { type: pricingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    orderNotes: { type: String, required: false, default: null },
    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      required: false,
      default: orderStatus.pending,
    },
  },
  { timestamps: true },
);

// Pre-save hook to generate order number (disabled - now handled in controller)
orderSchema.pre("save", async function (next: any) {
  // Order number is now generated in the controller
  next();
});

orderSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  return obj;
};

const orderModel = model<DocumentType>("fe_order", orderSchema);
export {
  orderModel as OrderModel,
  orderStatus as OrderStatus,
  paymentStatus as PaymentStatus,
};
