import mongoose, { Schema, Document, model } from "mongoose";

interface DocumentType extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema(
  {
    productId: { type: mongoose.Types.ObjectId, ref: "fe_workspace_product", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "fe_user", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false, default: null },
  },
  { timestamps: true }
);

const documentModel = model<DocumentType>("fe_review", documentSchema);
export { documentModel as ReviewModel };
