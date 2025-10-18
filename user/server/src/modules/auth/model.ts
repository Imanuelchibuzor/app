import mongoose, { Document, Schema } from "mongoose";

export interface IPendingUser {
  name: string;
  email: string;
  password: string;
  language: string;
  otp: number;
  otpExpires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  language: string;
  avatar?: {
    id?: string;
    url?: string;
  };
  passwordResetOtp?: number | null;
  passwordResetExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PendingUserDocument = IPendingUser & Document;
export type UserDocument = IUser & Document;

const PendingUserSchema: Schema<PendingUserDocument> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    language: { type: String, default: "en" },
    otp: { type: Number, required: true },
    otpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

const UserSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    language: { type: String, default: "en" },
    avatar: {
      id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    passwordResetOtp: { type: Number, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const PendingUser = mongoose.model<PendingUserDocument>(
  "PendingUser",
  PendingUserSchema
);
const User = mongoose.model<UserDocument>("User", UserSchema);

export { User, PendingUser };
