import { z } from "zod";

export const fetchSchema = z.object({
  page: z.string().min(1, "Page is required"),
  limit: z.string().min(1, "Limit is required"),
}).superRefine((data, ctx) => {
  // Page must be a valid number
  if (Number.isNaN(Number(data.page)) || Number(data.page) <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["page"],
      message: "Page must be a positive number",
    });
  }

  // Limit must be a valid number
  if (Number.isNaN(Number(data.limit)) || Number(data.limit) <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["limit"],
      message: "Limit must be a positive number",
    });
  }
});

export const markAsReadSchema = z.object({
  id: z.string().min(1, "Notification ID is required"),
}).superRefine((data, ctx) => {
  // ID must be a valid ObjectId
  if (!z.string().uuid().safeParse(data.id).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["id"],
      message: "Invalid notification ID",
    });
  }
});

export type FetchInput = z.infer<typeof fetchSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
