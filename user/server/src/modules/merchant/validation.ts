import { z } from "zod";

export const verifySubscriptionSchema = z.object({
  reference: z.string().min(1, "Reference is required"),
});

export const accountSchema = z.object({
  number: z.string().min(1, "Account number is required"),
  code: z.string().min(1, "Bank code is required"),
});

export const fetchDashboardSchema = z
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

export type VerifySubscriptionInput = z.infer<typeof verifySubscriptionSchema>;
export type VerifyAccountInput = z.infer<typeof accountSchema>;
export type FetchDashboardInput = z.infer<typeof fetchDashboardSchema>;
