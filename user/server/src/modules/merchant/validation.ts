import { z } from "zod";

export const verifySubscriptionSchema = z.object({
  reference: z.string().min(1, "Reference is required"),
});

export const accountSchema = z.object({
  number: z.string().min(1, "Account number is required"),
  code: z.string().min(1, "Bank code is required"),
});

export type VerifySubscriptionInput = z.infer<typeof verifySubscriptionSchema>;
export type VerifyAccountInput = z.infer<typeof accountSchema>;
