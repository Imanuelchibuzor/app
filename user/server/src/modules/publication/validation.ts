import { z } from "zod";

export const addPublicationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    language: z.string().min(1, "Language is required"),
    category: z.string().min(1, "Category is required"),
    pages: z.string().min(1, "Number of pages is required"),
    description: z.string().min(1, "Description is required"),
    isRegistered: z.enum(["yes", "no"], {
      error: "Registeration status is required",
    }),
    hasExplicitContent: z.enum(["yes", "no"], {
      error: "Explicit content status is required",
    }),
    price: z.string().min(1, "Price is required"),
    discount: z
      .string()
      .min(1, "Discount must be a positive number")
      .optional(),
    enableDownloads: z.enum(["yes", "no"], {
      error: "Download status is required",
    }),
    enableAffiliates: z.enum(["yes", "no"], {
      error: "Affiliate status is required",
    }),
    affiliateCommission: z
      .string()
      .min(1, "Affiliate commission is required")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Pages must be a valid number
    if (Number.isNaN(Number(data.pages)) || Number(data.pages) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pages"],
        message: "Number of pages must be a positive number",
      });
    }

    // Price must be a valid number
    if (Number.isNaN(Number(data.price)) || Number(data.price) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Price must be a positive number",
      });
    }

    // Discount must be a valid number
    if (
      data.discount !== undefined &&
      data.discount !== null &&
      (Number.isNaN(Number(data.discount)) ||
        Number(data.discount) < 0 ||
        Number(data.discount) > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discount"],
        message: "Discount must be a positive number",
      });
    }

    // Registered products are not allowed
    if (data.isRegistered === "yes") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isRegistered"],
        message: "Registered products are currently not allowed",
      });
    }

    // If affiliates enabled, affiliateCommission must be provided and valid
    if (data.enableAffiliates === "yes") {
      if (
        data.affiliateCommission === undefined ||
        data.affiliateCommission === null ||
        Number.isNaN(Number(data.affiliateCommission)) ||
        Number(data.affiliateCommission) <= 0 ||
        Number(data.affiliateCommission) > 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["affiliateCommission"],
          message:
            "Affiliate commission is required when affiliates are enabled",
        });
      } else if (typeof data.affiliateCommission === "number") {
        if (data.affiliateCommission <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["affiliateCommission"],
            message: "Affiliate commission must be greater than 0",
          });
        } else if (data.affiliateCommission > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["affiliateCommission"],
            message: "Affiliate commission must be less than or equal to 100",
          });
        }
      }
    }
  });

export type AddPublicationInput = z.infer<typeof addPublicationSchema>;
