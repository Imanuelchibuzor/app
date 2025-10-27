import { Types } from "mongoose";

import { PublicationDocument } from "../../models/publication";
import { Review } from "../../models/review";

/**
 * Aggregate review stats for an array of publication ids and return a lookup map:
 * { [pubIdString]: { avgRating: number } }
 */
export async function getReviewStatsMap(pubIds: (Types.ObjectId | string)[]) {
  if (!pubIds || pubIds.length === 0) return {};

  const reviewsAgg = await Review.aggregate([
    { $match: { publication: { $in: pubIds } } },
    {
      $group: {
        _id: "$publication",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const map: Record<string, { avgRating: number }> = {};
  reviewsAgg.forEach((r: any) => {
    // ensure toString is safe for ObjectId or string
    map[String(r._id)] = { avgRating: r.avgRating ?? 0 };
  });
  return map;
}

/**
 * Map publication documents (or plain objects) into the API shape and merge review stats.
 * documents may be Mongoose docs or plain objects (lean()).
 */
export function mapPublicationsWithStats(
  publications: Array<PublicationDocument | any>,
  reviewStatsMap: Record<string, { avgRating: number }>
) {
  return publications.map((pub) => {
    const idStr = String(pub._id);
    const stats = reviewStatsMap[idStr] ?? { avgRating: 0 };

    return {
      id: idStr,
      title: pub.title,
      author: pub.author,
      cover: pub.cover?.url ?? null,
      price: pub.price,
      discount: pub.discount ?? 0,
      avgRating: stats.avgRating,
    };
  });
}
