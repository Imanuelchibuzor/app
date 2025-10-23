import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import axios from "axios";

import { User } from "../../models/user";
import Merchant from "../../models/merchant";
import AppError from "../../configs/error";

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});

export const createStarterMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    // Unauthorized / not logged in
    throw new AppError("Unauthorized. Please log in.", 401, { code: "UNAUTHORIZED" });
  }

  // Validate userId is a valid ObjectId (optional but recommended)
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", 400, { code: "INVALID_USER_ID" });
  }

  // Ensure user exists
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new AppError("User not found.", 404, { code: "USER_NOT_FOUND" });
  }

  // Check if merchant profile already exists
  const existingMerchant = await Merchant.findOne({ user: userId }).exec();
  if (existingMerchant) {
    // If the merchant already has a paid plan, block onboarding
    if (existingMerchant.plan === "pro" || existingMerchant.plan === "premium") {
      throw new AppError("You are already on a paid plan.", 400, { code: "ALREADY_ON_PAID_PLAN" });
    }

    // Otherwise a merchant profile already exists (starter)
    throw new AppError("Merchant already exists.", 400, { code: "MERCHANT_EXISTS" });
  }

  // Create new merchant record
  const merchant = new Merchant({ user: userId });
  await merchant.save();

  const payload = {
    id: user._id,
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
    language: user?.language,
    isMerchant: true,
  }

  return res.status(201).json({
    success: true,
    message: "You have been successfully onboarded as a Starter merchant.",
    user: payload
  });
};