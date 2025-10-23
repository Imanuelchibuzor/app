import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  language: z.string().default("en"),
});

export const sendOtpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  language: z.string().default("en"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.number().min(6, "Please enter a valid OTP"),
})

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  language: z.string().default("en"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.number().min(6, "Please enter a valid OTP"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof signUpSchema>;
export type ResendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
