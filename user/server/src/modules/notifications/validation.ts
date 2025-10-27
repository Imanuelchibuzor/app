import { z } from "zod";
import { Types } from "mongoose";

// Coerce numeric strings => numbers and validate
export const fetchSchema = z
  .object({
    page: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : v),
      z.string().min(1, "Page is required")
    ),
    limit: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : v),
      z.string().min(1, "Limit is required")
    ),
  })
  .superRefine((data, ctx) => {
    const pageNum = Number(data.page);
    const limitNum = Number(data.limit);

    if (Number.isNaN(pageNum) || pageNum <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["page"],
        message: "Page must be a positive number",
      });
    }
    if (Number.isNaN(limitNum) || limitNum <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["limit"],
        message: "Limit must be a positive number",
      });
    }
  });

export const markAsReadSchema = z
  .object({
    id: z.string().min(1, "Notification ID is required"),
  })
  .superRefine((data, ctx) => {
    // ID must be a valid ObjectId
    if (!Types.ObjectId.isValid(data.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id"],
        message: "Invalid notification ID",
      });
    }
  });

export type FetchInput = z.infer<typeof fetchSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
