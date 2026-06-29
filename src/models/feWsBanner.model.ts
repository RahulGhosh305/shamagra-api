import mongoose, { Schema, Document, model } from "mongoose";

const documentStatus = Object.freeze({
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
});

const documentPages = Object.freeze({
  landing: "landing",
  null: null,
});

const documentPositions = Object.freeze({
  heroSlider: "Hero Slider",
  promoBanner: "Promotional Banner",
  adsBanner: "Advertisement Banner",
  preFBanner: "Pre Footer Banner",
});

interface DocumentType extends Document {
  name: string;
  page?: keyof typeof documentPages | null;
  dataId?: mongoose.Types.ObjectId | null;
  photo: string;
  description: string;
  position: number;
  bannerPlace: typeof documentPositions[keyof typeof documentPositions];
  status?: keyof typeof documentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    page: {
      type: String,
      enum: Object.values(documentPages),
      required: false,
      default: null,
    },
    dataId: { type: mongoose.Types.ObjectId, required: false, default: null },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: Number, required: false, default: null },
    bannerPlace: {
      type: String,
      enum: Object.values(documentPositions),
      required: true,
    },
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

const documentModel = model<DocumentType>("fe_ws_banner", documentSchema);
export {
  documentModel as WsBannerModel,
  documentStatus as WsBannerStatus,
  documentPages as WsBannerPages,
  documentPositions as WsBannerPositions,
};
