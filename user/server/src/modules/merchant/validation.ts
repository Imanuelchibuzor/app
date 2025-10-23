import { z } from "zod";

export const initializeSubscriptionSchema = z.object({
  email: z.string().email("Email is required"),
});

export const verifySubscriptionSchema = z.object({
  reference: z.string("Reference is required"),
});

export const accountSchema = z.object({
  number: z.string("Account number is required"),
  code: z.string("Bank code is required"),
});

export type InitializeSubscriptionInput = z.infer<typeof initializeSubscriptionSchema>;
export type VerifySubscriptionInput = z.infer<typeof verifySubscriptionSchema>;
export type VerifyAccountInput = z.infer<typeof accountSchema>;
