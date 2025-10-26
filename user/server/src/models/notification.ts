import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationDocument = INotification & Document;

const NotificationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
