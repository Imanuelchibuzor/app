import { Request, Response } from "express";
import axios from "axios";

import AppError from "../../configs/error";
import { Merchant } from "../../models/merchant";
import asyncHandler from "../../utils/asyncHandler";
import { validateUser } from "../../utils/validateUser";
import { validateMerchant } from "../../utils/validateMerchant";
import { Notification } from "../../models/notification";
import { buildSubscriptionSuccessfulNotification } from "./notifications";
import validateData from "../../utils/validateData";
import getPagination from "../../utils/getPagination";
import Publication from "../../models/publication";
import { Affiliate } from "../../models/affiliate";
import {
  verifySubscriptionSchema,
  accountSchema,
  fetchDashboardSchema,
} from "./validation";

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});

const PRO_PLAN_AMOUNT = 1000;
const PREMIUM_PLAN_AMOUNT = 10000;

export const createStarterMerchant = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { user, userId } = await validateUser(req);

    // Check if merchant profile already exists
    const existingMerchant = await Merchant.findOne({ user: userId }).exec();
    if (existingMerchant) {
      // If the merchant already has a paid plan, block onboarding
      if (
        existingMerchant.plan === "pro" ||
        existingMerchant.plan === "premium"
      ) {
        throw new AppError("You are already on a paid plan.", 400, {
          code: "ALREADY_ON_PAID_PLAN",
        });
      }

      // Otherwise a merchant profile already exists (starter)
      throw new AppError("Merchant already exists.", 400, {
        code: "MERCHANT_EXISTS",
      });
    }

    // Create new merchant record
    const merchant = new Merchant({ user: userId });
    await merchant.save();

    // Send notification
    const features = {
      a: "Up to 5 publications",
      b: "Up to 10 promotions",
      c: "₦2,500",
      d: "10%",
      e: "Payout on Fridays",
    };
    const message = buildSubscriptionSuccessfulNotification({
      name: user.name,
      plan: "Starter",
      features,
    });
    await Notification.create({
      user: userId,
      subject: "Starter Subscription Successful",
      message,
    });

    return res.status(201).json({ success: true, plan: "Starter" });
  }
);

export const initializeProSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, userId } = await validateUser(req);

    // Check if merchant is already on paid plan
    const payingMerchant = await Merchant.findOne({ user: userId }).exec();
    if (payingMerchant) {
      if (payingMerchant.plan === "pro" || payingMerchant.plan === "premium") {
        throw new AppError("You are already on a paid plan.", 400, {
          code: "ALREADY_ON_PAID_PLAN",
        });
      }
    }

    const payload = {
      email: user.email,
      amount: Math.round(PRO_PLAN_AMOUNT * 100),
      plan: "PLN_ynpdl73ponbvvj5", // Add real plan here
    };

    const response = await paystack.post("/transaction/initialize", payload);
    if (!response.data || !response.data.status) {
      throw new AppError("Paystack initialization returned an error", 500, {
        code: "PAYSTACK_INIT_ERROR",
      });
    }

    const data = response.data.data;
    return res.json({ reference: data.reference });
  }
);

export const verifyProSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const parsed = validateData(req, res, verifySubscriptionSchema, "body");
    if (!parsed) return;

    const { reference } = parsed;

    const verifyResp = await paystack.get(`/transaction/verify/${reference}`);
    const verified = verifyResp.data;
    if (!verified || !verified.data) {
      throw new AppError("Paystack verification returned an error", 500, {
        code: "PAYSTACK_VERIFY_ERROR",
      });
    }

    // ensure payment succeeded
    const tx = verified.data;
    if (tx.status !== "success") {
      throw new AppError("Payment failed", 400, { code: "PAYMENT_FAILED" });
    }

    // Create new merchant record or upgrade existing merchant to "Pro" and update subscription details
    const existingMerchant = await Merchant.findOne({ user: userId }).exec();
    if (!existingMerchant) {
      const merchant = new Merchant({
        user: userId,
        plan: "pro",
        subscriptionId: reference,
      });
      await merchant.save();
    } else {
      existingMerchant.plan = "pro";
      existingMerchant.subscriptionId = reference;
      await existingMerchant.save();
    }

    return res.status(200).json({ success: true, plan: "Pro" });
  }
);

export const initializePremiumSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, userId } = await validateUser(req);

    // Check if merchant is already on premium plan
    const premiumMerchant = await Merchant.findOne({
      user: userId,
      plan: "premium",
    }).exec();
    if (premiumMerchant) {
      throw new AppError("You are already on premium plan.", 400, {
        code: "ALREADY_ON_PREMIUM_PLAN",
      });
    }

    const payload = {
      email: user.email,
      amount: Math.round(PREMIUM_PLAN_AMOUNT * 100),
      plan: "PLN_ynpdl73ponbvvj5", // Add real plan here
    };

    const response = await paystack.post("/transaction/initialize", payload);
    if (!response.data || !response.data.status) {
      throw new AppError("Paystack initialization returned an error", 500, {
        code: "PAYSTACK_INIT_ERROR",
      });
    }

    const data = response.data.data;
    return res.json({ reference: data.reference });
  }
);

export const verifyPremiumSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const parsed = validateData(req, res, verifySubscriptionSchema, "body");
    if (!parsed) return;

    const { reference } = parsed;

    const verifyResp = await paystack.get(`/transaction/verify/${reference}`);
    const verified = verifyResp.data;
    if (!verified || !verified.data) {
      throw new AppError("Paystack verification returned an error", 500, {
        code: "PAYSTACK_VERIFY_ERROR",
      });
    }

    // ensure payment succeeded
    const tx = verified.data;
    if (tx.status !== "success") {
      throw new AppError("Payment failed", 400, { code: "PAYMENT_FAILED" });
    }

    // Create new merchant record or upgrade existing merchant to "Premium" and update subscription details
    const existingMerchant = await Merchant.findOne({ user: userId }).exec();
    if (!existingMerchant) {
      const merchant = new Merchant({
        user: userId,
        plan: "premium",
        subscriptionId: reference,
      });
      await merchant.save();
    } else {
      existingMerchant.plan = "premium";
      existingMerchant.subscriptionId = reference;
      await existingMerchant.save();
    }

    return res.status(200).json({ success: true, plan: "Premium" });
  }
);

export const fetchAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const merchant = await Merchant.findOne({ user: userId }).exec();
    if (!merchant) {
      throw new AppError("Merchant not found", 404, {
        code: "MERCHANT_NOT_FOUND",
      });
    }

    const account = {
      code: merchant.account.code,
      name: merchant.account.name,
      number: merchant.account.number,
    };

    return res.status(200).json({ success: true, account });
  }
);

export const listBanks = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await paystack.get("/bank", {
    params: { country: "nigeria" },
  });

  // data.data is an array of { name, slug, code, longcode, ... }
  const banks = data.data.map(
    ({ name, code }: { name: string; code: string }) => ({ name, code })
  );
  res.json({ success: true, banks });
});

export const verifyAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = validateData(req, res, accountSchema, "body");
    if (!parsed) return;

    const { number, code } = parsed;

    const { data } = await paystack.get("/bank/resolve", {
      params: {
        account_number: number,
        bank_code: code,
      },
    });
    if (!data.status) {
      throw new AppError(data.message, 400, {
        code: "ACCOUNT_VERIFICATION_FAILED",
      });
    }

    const info = {
      code: code,
      number: data.data.account_number,
      name: data.data.account_name,
    };

    return res.json({ success: true, info });
  }
);

export const saveAccount = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = await validateUser(req);
  const merchant = await validateMerchant(userId);

  const parsed = validateData(req, res, accountSchema, "body");
  if (!parsed) return;

  const { number, code } = parsed;

  // Verify account
  const { data: rd } = await paystack.get("/bank/resolve", {
    params: {
      account_number: number,
      bank_code: code,
    },
  });
  if (!rd.status) {
    throw new AppError(rd.message, 400, {
      code: "ACCOUNT_VERIFICATION_FAILED",
    });
  }

  // Get bank
  const { data: banks } = await paystack.get("/bank");
  const bank = banks.data.find((b: any) => b.code === code);

  // Create transfer recipient
  const tr = await paystack.post("/transferrecipient", {
    type: "nuban",
    name: rd.data.account_name,
    account_number: number,
    bank_code: code,
    currency: "NGN",
  });
  if (!tr.data.status) {
    throw new AppError(tr.data.message, 400, {
      code: "RECIPIENT_CREATION_FAILED",
    });
  }

  // Update the merchant record
  merchant.account = {
    code: code,
    number: number,
    bank: bank.name,
    name: rd.data.account_name,
    transferRecipient: tr.data.data.recipient_code,
  };
  await merchant.save();

  return res.json({
    success: true,
    message: "Account saved successfully",
    account: {
      code: merchant.account.code,
      name: merchant.account.name,
      number: merchant.account.number,
    },
  });
});

export const fetchVendorDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const merchant = await validateMerchant(userId);
    const parsed = validateData(req, res, fetchDashboardSchema, "query");
    if (!parsed) return;

    const { page, limit } = parsed;
    const { pageSize, skip } = getPagination(page, limit);

    // Fetch paginated vendor publications
    const vendorPubs = await Publication.find({ vendor: merchant._id })
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Get total number of vendor publications
    const totalPubs = await Publication.countDocuments({
      vendor: merchant._id,
    });
    const totalPages = Math.ceil(totalPubs / pageSize);

    // Get global totals
    const globalTotals = await Publication.aggregate([
      { $match: { vendor: merchant._id } },
      {
        $group: {
          _id: null,
          totalUnitsSold: { $sum: "$unitsSold" },
          totalEarnings: { $sum: "$earnings" },
        },
      },
    ]);

    const totalUnitsSold = globalTotals[0]?.totalUnitsSold ?? 0;
    const totalEarnings = globalTotals[0]?.totalEarnings ?? 0;

    // Get affiliates for each paginated publication
    const affiliates = await Affiliate.aggregate([
      { $match: { publication: { $in: vendorPubs.map((p) => p._id) } } },
      { $group: { _id: "$publication", totalAffiliates: { $sum: 1 } } },
    ]);

    const affiliatesMap: Record<string, number> = {};
    affiliates.forEach((pub) => {
      affiliatesMap[pub._id.toString()] = pub.totalAffiliates;
    });

    // return an object for each publication
    const pubs = vendorPubs.map((p: any) => ({
      id: p._id,
      title: p.title,
      cover: p.cover?.url ?? null,
      enableDownloads: p.enableDownloads,
      affiliates: affiliatesMap[String(p._id)] ?? 0,
      unitsSold: p.unitsSold,
      earnings: p.earnings,
    }));

    return res.status(200).json({
      success: true,
      pubs,
      totalPubs,
      totalUnitsSold,
      totalEarnings,
      totalPages,
    });
  }
);
