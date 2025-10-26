import { Request, Response } from "express";

import AppError from "../../configs/error";
import Publication from "../../models/publication";
import asyncHandler from "../../utils/asyncHandler";
import { addPublicationSchema } from "./validation";
import { validateUser } from "../../utils/validateUser";
import { validateMerchant } from "../../utils/validateMerchant";
import { reviewPublication } from "./services";
import imagekit from "../../configs/imageKit";
import uploadProductFile from "../../utils/uploadPublication";

const STARTER_LIMIT = 5;
const PRO_LIMIT = 25;

export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = await validateUser(req);
  const merchant = await validateMerchant(userId);

  const parseResult = addPublicationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }

  const pubs = await Publication.find({ vendor: merchant._id }).exec();
  if (merchant.plan === "starter" && pubs.length >= STARTER_LIMIT) {
    throw new AppError("You have reached your starter plan limit.", 400, {
      code: "STARTER_PLAN_LIMIT",
    });
  } else if (merchant.plan === "pro" && pubs.length >= PRO_LIMIT) {
    throw new AppError("You have reached your pro plan limit.", 400, {
      code: "PRO_PLAN_LIMIT",
    });
  }

  const {
    title,
    author,
    language,
    category,
    pages,
    description,
    isRegistered,
    hasExplicitContent,
    price,
    discount,
    enableDownloads,
    enableAffiliates,
    affiliateCommission,
  } = parseResult.data;

  // Prevent dupliate titles for the same merchant
  const exists = await Publication.findOne({
    vendor: merchant._id,
    title,
  }).exec();
  if (exists) {
    throw new AppError("You already have a publication with this title.", 400, {
      code: "PUBLICATION_EXISTS",
    });
  }

  const files = req.files as
    | { [field: string]: Express.Multer.File[] }
    | undefined;
  if (!files?.file?.length || !files?.cover?.length) {
    throw new AppError("No PDF or cover image provided.", 400, {
      code: "NO_FILES",
    });
  }

  // Review Publication
  const info = {
    title,
    author,
    language,
    pages,
    description,
  };

  const response = await reviewPublication(info, files);
  if (response.error) {
    throw new AppError(response.error, 400, {
      code: "REVIEW_ERROR",
    });
  } else if (response.status === "Not Approved") {
    throw new AppError(response.reason, 400, {
      code: "NOT_APPROVED",
    });
  }

  const registrationStatus = isRegistered === "yes" ? true : false;
  const explicitStatus = hasExplicitContent === "yes" ? true : false;
  const affiliatesStatus = enableAffiliates === "yes" ? true : false;

  // Upload files to ImageKit
  // Cover Image
  const coverName = `cover_${merchant._id}_${title}_${Date.now()}`;
  const coverOptions = {
    file: files.cover[0].buffer,
    fileName: coverName,
    folder: "/covers/",
    useUniqueFileName: false,
  };
  const coverRes = await imagekit.upload(coverOptions);
  const coverUrl = coverRes.url;
  const coverId = coverRes.fileId;

  // PDF File
  const pdfFile = files.file[0];
  const pdfName = `ebook_${merchant._id}_${title.replace(/\s+/g, "_")}`;
  const fileRes = await uploadProductFile(
    pdfFile.buffer,
    pdfName,
    pdfFile.mimetype
  );
  const fileUrl = fileRes.url;
  const fileId = fileRes.fileId;

  // Create publication
  await Publication.create({
    vendor: merchant._id,
    title,
    author,
    language,
    category,
    pages: Number(pages),
    description,
    isRegistered: registrationStatus,
    hasExplicitContent: explicitStatus,
    file: { id: fileId, url: fileUrl },
    cover: { id: coverId, url: coverUrl },
    price: Number(price),
    discount: Number(discount),
    enableDownloads,
    enableAffiliates: affiliatesStatus,
    affiliateCommission: Number(affiliateCommission),
    status: "approved",
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Publication has been added successfully",
    });
});
