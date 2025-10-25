import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMerchant {
  user: Types.ObjectId | string;

  // Subscription info
  plan: string;
  status: string;
  subscriptionId: string;

  // Wallet info
  totalEarnings: number;
  totalWithdrawals: number;

  // Bank info
  account: {
    code: string;
    number: string;
    bank: string;
    name: string;
    transferRecipient: string;
  };
}

export type MerchantDocument = IMerchant & Document;

const MerchantSchema: Schema<MerchantDocument> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },

    // Subscription info
    plan: {
      type: String,
      enum: ["starter", "pro", "premium"],
      default: "starter",
      index: true,
    },
    status: {
      type: String,
      enum: [ "active", "cancelled"],
      default: "active",
      index: true,
    },
    subscriptionId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    // Wallet info
    totalEarnings: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },

    // Bank info
    account: {
      code: { type: String, trim: true, default: "" },
      number: { type: String, trim: true, default: "" },
      bank: { type: String, trim: true, default: "" },
      name: { type: String, trim: true, default: "" },
      transferRecipient: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

export const Merchant = mongoose.model<MerchantDocument>("Merchant", MerchantSchema);


