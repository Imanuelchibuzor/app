import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPublication {
  _id: Types.ObjectId;
  vendor: Types.ObjectId | string;
  title: string;
  author: string;
  language: string;
  category: string;
  pages: Number;
  description: string;
  isRegistered: boolean;
  hasExplicitContent: boolean;
  file: {
    id: string;
    url: string;
  };
  cover: {
    id: string;
    url: string;
  };
  price: number;
  discount: number;
  enableDownloads: boolean;
  enableAffiliates: boolean;
  affiliateCommission: number;
  status: string;
  unitsSold: number;
  earnings: number;
}

export type PublicationDocument = IPublication & Document;

const PublicationSchema: Schema<PublicationDocument> = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },
    title: { type: String, required: true, index: true },
    author: { type: String, required: true },
    language: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    pages: { type: Number, required: true },
    description: { type: String, required: true },
    isRegistered: { type: Boolean, required: true, default: false },
    hasExplicitContent: { type: Boolean, required: true },
    file: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    cover: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    price: { type: Number, required: true, index: true },
    discount: { type: Number, default: 0 },
    enableDownloads: { type: Boolean, required: true, index: true },
    enableAffiliates: { type: Boolean, required: true, index: true },
    affiliateCommission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "paused"],
      default: "pending",
      index: true,
    },
    unitsSold: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create compound index for faster search and sorting
PublicationSchema.index({ vendor: 1, title: 1, createdAt: 1 });

export const Publication = mongoose.model<PublicationDocument>(
  "Publication",
  PublicationSchema
);

export default Publication;
