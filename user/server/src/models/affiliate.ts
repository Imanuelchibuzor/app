import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAffiliate {
  merchant: Types.ObjectId;
  publication: Types.ObjectId;
  link: string;
  cover: string;
  title: string;
  enablesDownload: boolean;
  totalClicks: number;
  uniqueClicks: number;
  conversions: number;
  commissions: number;
  createdAt: Date;
}

export type AffiliateDocument = IAffiliate & Document;

const AffiliateSchema = new Schema(
  {
    merchant: {
      type: Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },
    publication: {
      type: Types.ObjectId,
      ref: "Publication",
      required: true,
      index: true,
    },
    link: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    enableDownloads: { type: Boolean, required: true },
    totalClicks: { type: Number, default: 0 },
    uniqueClicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    commissions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Affiliate = mongoose.model<AffiliateDocument>(
  "Affiliate",
  AffiliateSchema
);
