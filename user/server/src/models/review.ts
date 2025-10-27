import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview {
  user: Types.ObjectId;
  publication: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export type ReviewDocument = IReview & Document;

const ReviewSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    publication: {
      type: Types.ObjectId,
      ref: "Publication",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model<ReviewDocument>("Review", ReviewSchema);
