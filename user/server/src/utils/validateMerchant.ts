import { Types } from "mongoose";

import { Merchant, MerchantDocument } from "../models/merchant";
import AppError from "../configs/error";

export async function validateMerchant(
  id: Types.ObjectId | string
): Promise<MerchantDocument> {
  const merchant = (await Merchant.findOne({
    user: id,
  }).exec()) as MerchantDocument | null;
  if (!merchant) {
    throw new AppError("Merchant not found.", 404, {
      code: "MERCHANT_NOT_FOUND",
    });
  }

  return merchant;
}
