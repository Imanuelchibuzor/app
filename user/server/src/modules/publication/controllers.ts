import { Request, Response } from "express";

import AppError from "../../configs/error";
import { Review } from "../../models/review";
import imagekit from "../../configs/imageKit";
import { reviewPublication } from "./services";
import { Affiliate } from "../../models/affiliate";
import asyncHandler from "../../utils/asyncHandler";
import validateData from "../../utils/validateData";
import getPagination from "../../utils/getPagination";
import { validateUser } from "../../utils/validateUser";
import { Notification } from "../../models/notification";
import { validateMerchant } from "../../utils/validateMerchant";
import uploadPublicationFile from "../../utils/uploadPublication";
import { getReviewStatsMap, mapPublicationsWithStats } from "./utils";
import { buildPromoteSuccessNotification, buildPublicationApprovedNotification } from "./notifications";
import Publication, { PublicationDocument } from "../../models/publication";
import {
  addSchema,
  fetchByIdSchema,
  fetchSchema,
  filterByCategorySchema,
  PromoteSchema,
  SearchByTitleSchema,
} from "./validation";

type PlanFeatures = {
  id: string;
  listings: number;
  promotions: number;
};

const getPlanFeatures = (plan: string): PlanFeatures => {
  if (plan === "starter") {
    return {
      id: "starter",
      listings: 5,
      promotions: 10,
    };
  }
  return {
    id: "pro",
    listings: 25,
    promotions: 50,
  };
};

export const add = asyncHandler(async (req: Request, res: Response) => {
  const { user, userId } = await validateUser(req);
  const merchant = await validateMerchant(userId);

  const parsed = validateData(req, res, addSchema, "body");
  if (!parsed) return;

  const plan = getPlanFeatures(merchant.plan);
  const pubs = await Publication.find({ vendor: merchant._id }).exec();
  if (merchant.plan === "starter" && pubs.length >= plan.listings) {
    throw new AppError("You have reached your starter plan limit.", 400, {
      code: "STARTER_PLAN_LIMIT",
    });
  } else if (merchant.plan === "pro" && pubs.length >= plan.listings) {
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

  const { forAffiliates, language, page, limit } = parsed;
  const { pageSize, skip } = getPagination(page, limit);
  const affiliatesEnabled = forAffiliates === "yes" ? true : false;

  // Match filter depending on affiliatesEnabled.
  // If affiliatesEnabled is true, filter by enableAffiliates: true
  // Otherwise we keep an empty filter (match all).
  const baseMatch: Record<string, any> = affiliatesEnabled
    ? { enableAffiliates: true }
    : {};

  // Aggregation pipeline:
  // 1. Match (applies affiliates filter if needed)
  // 2. Add 'preferred' computed field for language preference
  // 3. Sort by preferred then createdAt
  // 4. Apply pagination (skip / limit)
  // 5. Remove temporary 'preferred' field in projection
  const pipeline: any[] = [
    { $match: baseMatch },
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
    { $project: { preferred: 0 } },
  ];

  const pubsAgg = await Publication.aggregate(pipeline);

  if (pubsAgg.length === 0) {
    return res.status(200).json({
      success: true,
      publications: [],
      totalPages: 0,
    });
  }

  // Get total publications
  const totalFilter = baseMatch;
  const totalPubs = await Publication.countDocuments(totalFilter);

  // Extract publication IDs for review aggregation
  const pubIds = pubsAgg.map((pub) => pub._id);

  // Aggregate reviews: group reviews by publication id
  const reviewStatsMap = await getReviewStatsMap(pubIds);

  // Map over the publications and add review stats if available
  const pubs = mapPublicationsWithStats(
    affiliatesEnabled,
    pubsAgg,
    reviewStatsMap
  );

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

    const { forAffiliates, title, page, limit } = parsed;
    const { pageSize, skip } = getPagination(page, limit);
    const affiliatesEnabled = forAffiliates === "yes" ? true : false;

    // Filter for query
    const filter: Record<string, any> = affiliatesEnabled
      ? { enableAffiliates: true, title: { $regex: new RegExp(title, "i") } }
      : { title: { $regex: new RegExp(title, "i") } };

    // Use regex for case-insensitive search
    const publications: PublicationDocument[] = await Publication.find(filter)
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
    const pubs = mapPublicationsWithStats(
      affiliatesEnabled,
      publications,
      reviewStatsMap
    );

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

    const { forAffiliates, category, language, page, limit } = parsed;
    const { pageSize, skip } = getPagination(page, limit);

    // Create filter for query
    const affiliatesEnabled = forAffiliates === "yes" ? true : false;
    const baseMatch: Record<string, any> = affiliatesEnabled
      ? {
          enableAffiliates: true,
          category: { $regex: new RegExp(category, "i") },
        }
      : { category: { $regex: new RegExp(category, "i") } };

    const pipeline: any[] = [
      { $match: baseMatch },
      {
        $addFields: {
          preferred: { $cond: [{ $eq: ["$language", language] }, 1, 0] },
        },
      },
      { $sort: { preferred: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      { $project: { preferred: 0 } },
    ];

    const pubsAgg = await Publication.aggregate(pipeline);

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
    const pubs = mapPublicationsWithStats(
      affiliatesEnabled,
      pubsAgg,
      reviewStatsMap
    );

    return res.status(200).json({
      success: true,
      pubs,
      totalPages: Math.ceil(totalPubs / pageSize),
    });
  }
);

export const fetchById = asyncHandler(async (req: Request, res: Response) => {
  const parsed = validateData(req, res, fetchByIdSchema, "query");
  if (!parsed) return;

  const { id, forAffiliates } = parsed;
  const affiliatesEnabled = forAffiliates === "yes" ? true : false;

  const pub = await Publication.findById(id);
  if (!pub) {
    throw new AppError("Publication not found", 404, { code: "PUB_NOT_FOUND" });
  }

  // Aggregate reviews to get total reviews and average rating
  const reviewStats = await Review.aggregate([
    { $match: { publication: id } },
    {
      $group: {
        _id: "$product",
        reviewCount: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  let reviewCount = 0;
  let avgRating = 0;
  if (reviewStats.length > 0) {
    reviewCount = reviewStats[0].reviewCount;
    avgRating = reviewStats[0].avgRating;
  }

  // Fetch the 12 most recent reviews with user details
  const reviews = await Review.find({ product: id })
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("user", "avatar name")
    .exec();

  // Map reviews to include the required fields
  const mappedReviews = reviews.map((review: any) => ({
    id: review._id,
    avatar: review.user?.avatar?.url || "",
    name: review.user?.name || "",
    date: new Date(review.updatedAt).toLocaleDateString(),
    rating: review.rating,
    comment: review.comment,
  }));

  return res.status(200).json({
    success: true,
    pub: {
      id: pub._id,
      title: pub.title,
      author: pub.author,
      cover: pub.cover.url,
      description: pub.description,
      language: pub.language,
      pages: pub.pages,
      price: pub.price,
      discount: pub.discount,
      enableDownloads: pub.enableDownloads,
      hasExplicitContent: pub.hasExplicitContent,
      commission: affiliatesEnabled ? pub.affiliateCommission : null,
      reviewCount,
      avgRating,
      reviews: mappedReviews,
    },
  });
});

export const promote = asyncHandler(async (req: Request, res: Response) => {
  const { user, userId } = await validateUser(req);
  const merchant = await validateMerchant(userId);

  const parsed = validateData(req, res, PromoteSchema, "body");
  if (!parsed) return;

  const plan = getPlanFeatures(merchant.plan);
  const pubs = await Affiliate.find({ merchant: merchant._id }).exec();
  if (merchant.plan === "starter" && pubs.length >= plan.promotions) {
    throw new AppError("You have reached your starter plan limit.", 400, {
      code: "STARTER_PLAN_LIMIT",
    });
  } else if (merchant.plan === "pro" && pubs.length >= plan.promotions) {
    throw new AppError("You have reached your pro plan limit.", 400, {
      code: "PRO_PLAN_LIMIT",
    });
  }

  const { id } = parsed;
  const pub = await Publication.findById(id);
  if (!pub) {
    throw new AppError("Publication not found", 404);
  }

  const exists = await Affiliate.findOne({
    merchant: merchant._id,
    publication: id,
  }).exec();

  if (exists) {
    throw new AppError("You're already promoting this publication", 400, {
      code: "PROMOTION_EXISTS",
    });
  }

  const affiliateLink = `saerv.com/pub/${id}?ref=${merchant._id}`;

  await Affiliate.create({
    merchant: merchant._id,
    publication: id,
    link: affiliateLink,
    cover: pub.cover.url,
    title: pub.title,
    enableDownloads: pub.enableDownloads,
  });

  // Send notification
  const message = buildPromoteSuccessNotification(user.name, pub.title);
  await Notification.create({
    user: userId,
    subject: `Promotion Successful: ${pub.title}`,
    message,
  });

  return res.status(200).json({
    success: true,
    link: affiliateLink,
  });
});
