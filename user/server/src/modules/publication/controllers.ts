import { Request, Response } from "express";

import AppError from "../../configs/error";
import imagekit from "../../configs/imageKit";
import { reviewPublication } from "./services";
import Publication, { PublicationDocument } from "../../models/publication";
import asyncHandler from "../../utils/asyncHandler";
import { validateUser } from "../../utils/validateUser";
import { Notification } from "../../models/notification";
import { validateMerchant } from "../../utils/validateMerchant";
import uploadPublicationFile from "../../utils/uploadPublication";
import { buildPublicationApprovedNotification } from "./notifications";
import {
  addSchema,
  fetchSchema,
  filterByCategorySchema,
  SearchByTitleSchema,
} from "./validation";
import { getReviewStatsMap, mapPublicationsWithStats } from "./utils";
import getPagination from "../../utils/getPagination";
import validateData from "../../utils/validateData";

const STARTER_LIMIT = 5;
const PRO_LIMIT = 25;

export const add = asyncHandler(async (req: Request, res: Response) => {
  const { user, userId } = await validateUser(req);
  const merchant = await validateMerchant(userId);

  const parsed = validateData(req, res, addSchema, "body");
  if (!parsed) return;

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
  } = parsed;

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
  const fileRes = await uploadPublicationFile(
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

  // Send notification
  const message = buildPublicationApprovedNotification(user.name, title);
  await Notification.create({
    user: userId,
    subject: `Publication Approved: ${title}`,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Publication has been added successfully",
  });
});

export const fetch = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateData(req, res, fetchSchema, "query");
  if (!parsed) return;

  const { language, page, limit } = parsed;
  const { pageSize, skip } = getPagination(page, limit);

  // Using an aggregation pipeline to add a computed field "preferred" which is 1 if publication.language matches the requested language, otherwise 0. Then we sort by "preferred" (descending) then by createdAt.
  const pubsAgg = await Publication.aggregate([
    {
      $addFields: {
        preferred: {
          $cond: [{ $eq: ["$language", language] }, 1, 0],
        },
      },
    },
    { $sort: { preferred: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: pageSize },
    // Remove the temporary "preferred" field
    { $project: { preferred: 0 } },
  ]);

  if (pubsAgg.length === 0) {
    return res.status(200).json({
      success: true,
      publications: [],
      totalPages: 0,
    });
  }

  // Get total publications count regardless of language
  const totalPubs = await Publication.countDocuments();

  // Extract publication IDs for review aggregation
  const pubIds = pubsAgg.map((pub) => pub._id);

  // Aggregate reviews: group reviews by publication id
  const reviewStatsMap = await getReviewStatsMap(pubIds);

  // Map over the publications and add review stats if available
  const pubs = mapPublicationsWithStats(pubsAgg, reviewStatsMap);

  return res.status(200).json({
    success: true,
    pubs,
    totalPages: Math.ceil(totalPubs / pageSize),
  });
});

export const searchByTitle = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = validateData(req, res, SearchByTitleSchema, "query");
    if (!parsed) return;

    const { title, page, limit } = parsed;
    const { pageSize, skip } = getPagination(page, limit);

    // Use regex for case-insensitive search
    const publications: PublicationDocument[] = await Publication.find({
      title: { $regex: new RegExp(title, "i") },
    })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    if (publications.length === 0) {
      return res.status(200).json({
        success: true,
        pubs: [],
        totalPages: 0,
      });
    }

    const totalPubs = await Publication.countDocuments({
      title: { $regex: new RegExp(title, "i") },
    });
    const pubIds = publications.map((pub) => pub._id);
    const reviewStatsMap = await getReviewStatsMap(pubIds);
    const pubs = mapPublicationsWithStats(publications, reviewStatsMap);

    return res.status(200).json({
      success: true,
      pubs,
      totalPages: Math.ceil(totalPubs / pageSize),
    });
  }
);

export const filterByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = validateData(req, res, filterByCategorySchema, "query");
    if (!parsed) return;

    const { category, language, page, limit } = parsed;
    const { pageSize, skip } = getPagination(page, limit);

    const pubsAgg = await Publication.aggregate([
      {
        $match: {
          category: { $regex: new RegExp(category, "i") },
        },
      },
      {
        $addFields: {
          preferred: { $cond: [{ $eq: ["$language", language] }, 1, 0] },
        },
      },
      { $sort: { preferred: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      { $project: { preferred: 0 } },
    ]);

    if (pubsAgg.length === 0) {
      return res.status(200).json({
        success: true,
        pubs: [],
        totalPages: 0,
      });
    }

    const totalPubs = await Publication.countDocuments({
      category: { $regex: new RegExp(category, "i") },
    });
    const pubIds = pubsAgg.map((p) => p._id);
    const reviewStatsMap = await getReviewStatsMap(pubIds);
    const pubs = mapPublicationsWithStats(pubsAgg, reviewStatsMap);

    return res.status(200).json({
      success: true,
      pubs,
      totalPages: Math.ceil(totalPubs / pageSize),
    });
  }
);
