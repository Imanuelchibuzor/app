import { Request, Response } from "express";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User, PendingUser } from "../../models/user";
import {
  signUpSchema,
  sendOtpSchema,
  verifyEmailSchema,
  signInSchema,
  resetPasswordSchema,
} from "./validation";
import AppError from "../../configs/error";
import * as authService from "./services";
import { sendEmail } from "../../configs/postmark";
import { asyncHandler } from "../../utils/asyncHandler";
import { buildWelcomeEmail, buildResetPasswordEmail } from "./mails";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_REDIRECT_URI = process.env.NODE_ENV === "development" ? process.env.GOOGLE_REDIRECT_URI_DEV : process.env.GOOGLE_REDIRECT_URI as string;
const CLIENT_URL = process.env.CLIENT as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
  throw new AppError("Missing Google OAuth env vars", 500, { code: "MISSING_GOOGLE_CONFIG", isOperational: false });
}

const generateOTP = (): number => Math.floor(100000 + Math.random() * 900000);
const isProd = process.env.NODE_ENV === "production";

const getJWTSecret = () => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new AppError("JWT_SECRET not configured", 500, {
      code: "MISSING_JWT_SECRET",
      isOperational: false,
    });
  }
  return key;
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Google Auth
export const googleRedirect = (req: Request, res: Response): void => {
  const state = randomBytes(12).toString("hex");
  // store state in a short-lived cookie to validate callback (CSRF protection)
  res.cookie("oauth_state", state, { httpOnly: true, maxAge: 5 * 60 * 1000, sameSite: "lax" });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account", // force account chooser
    state,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(url);
};

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const { code, state } = req.query as { code?: string; state?: string };

  const cookieState = req.cookies?.oauth_state;
  // basic state check
  if (!state || !cookieState || state !== cookieState) {
    throw new AppError("Invalid OAuth state", 400, { code: "INVALID_OAUTH_STATE" });
  }

  if (!code) throw new AppError("Missing code in callback", 400, { code: "MISSING_CODE" });

  // authService should exchange code, verify id_token, find-or-create user, return { token, user, redirectUrl? }
  const result = await authService.handleGoogleCallback(code, GOOGLE_REDIRECT_URI);

  // clear the state cookie
  res.clearCookie("oauth_state");

  // set auth cookie (HTTP-only) and redirect to client
  res.cookie("token", result.token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("user_preview", result.user, {
    httpOnly: false, // intentionally readable by JS
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  res.redirect(CLIENT_URL);
});

// Manual Auth
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body using Zod
  const parseResult = signUpSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }

  const { name, email, password, language } = parseResult.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // Check for pending unverified user
  const pendingUser = await PendingUser.findOne({ email });
  if (pendingUser) {
    throw new AppError("OTP already sent. Please verify your email.", 400, {
      code: "OTP_ALREADY_SENT",
    });
  }

  // Generate OTP
  const otp = generateOTP();

  // Save pending user
  await PendingUser.create({
    name,
    email,
    password: await hashPassword(password),
    language,
    otp,
    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
  });

  // Send verification email
  const subject = "Verify your email address - Saerv";
  const html = buildWelcomeEmail(name, otp);
  await sendEmail({ email, subject, html });

  // Set temporary cookie for verification
  res.cookie("user_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message:
      "OTP sent to email. Please verify the OTP to complete registration.",
  });
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body using Zod
  const parseResult = sendOtpSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }

  const { email, language } = parseResult.data;

  const pendingUser = await PendingUser.findOne({ email });
  if (!pendingUser) {
    throw new AppError("No pending verification found.", 404, {
      code: "PENDING_NOT_FOUND",
    });
  }

  // Generate and save new OTP
  const newOtp = generateOTP();
  pendingUser.otp = newOtp;
  pendingUser.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await pendingUser.save();

  const { name } = pendingUser;
  // const lang = language ?? (pendingUser.language as string) ?? "en";

  const subject = "Resend Email Verification OTP - Saerv";
  const html = buildWelcomeEmail(name, newOtp);
  await sendEmail({ email, subject, html });

  res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body using Zod
  const parseResult = verifyEmailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }

  const { email, otp } = parseResult.data;

  // Find pending user
  const pendingUser = await PendingUser.findOne({ email });
  if (!pendingUser)
    throw new AppError("Pending registration not found", 400, {
      code: "PENDING_NOT_FOUND",
    });

  // Check OTP match
  if (pendingUser.otp !== otp) {
    throw new AppError("Incorrect OTP", 400, { code: "INCORRECT_OTP" });
  }

  // Check expiry
  if (
    !pendingUser.otpExpires ||
    pendingUser.otpExpires.getTime() < Date.now()
  ) {
    // Remove only the OTP fields, keep the pending user record
    await PendingUser.updateOne(
      { email },
      { $unset: { otp: 1, otpExpires: 1 } }
    );

    throw new AppError("OTP expired. Request a new one.", 400, {
      code: "OTP_EXPIRED",
    });
  }

  // Move user from PendingUser -> User
  const newUser = await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
    language: pendingUser.language,
  });

  // Remove pending record
  await PendingUser.deleteOne({ email });

  // Create token
  const key = getJWTSecret();
  const token = jwt.sign({ id: newUser._id }, key, {
    expiresIn: "1d",
  });

  // Set cookie options
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Respond with safe user data
  res.status(200).json({
    success: true,
    message: "Email verified. Account created successfully.",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      language: newUser.language,
      avatar: newUser.avatar,
    },
  });
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body using Zod
  const parseResult = signInSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }

  const { email, password, language } = parseResult.data;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404, { code: "USER_NOT_FOUND" });
  }

  // Verify password
  const isMatch = bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, {
      code: "INVALID_CREDENTIALS",
    });
  }

  if (language && language !== user.language) {
    user.language = language;
    await user.save();
  }

  // Create token
  const key = getJWTSecret();
  const token = jwt.sign({ id: user._id }, key, {
    expiresIn: "1d",
  });

  // Cookie options
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });

  // Respond with safe user data
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      language: user.language,
      avatar: user.avatar ?? null,
    },
  });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body using Zod
    const parseResult = sendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, language } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404, { code: "USER_NOT_FOUND" });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    user.passwordResetOtp = otp;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Build and send email
    const subject = "Password Reset OTP - Saerv";
    const html = buildResetPasswordEmail(user.name, otp);
    await sendEmail({ email, subject, html });

    // Set temporary cookie with email (15 minutes)
    res.cookie("user_email", email, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "OTP sent to email" });
  }
);

export const resendPasswordResetOtp = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body using Zod
    const parseResult = sendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, language } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404, { code: "USER_NOT_FOUND" });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    user.passwordResetOtp = otp;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Build and send email
    const subject = "Password Reset OTP - Saerv";
    const html = buildResetPasswordEmail(user.name, otp);
    await sendEmail({ email, subject, html });

    res.status(200).json({ success: true, message: "New OTP sent to email" });
  }
);

export const verifyPasswordResetOtp = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body using Zod
    const parseResult = verifyEmailSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, otp } = parseResult.data;

    // Find pending user
    const user = await User.findOne({ email });
    if (!user)
      throw new AppError("User not found", 400, {
        code: "USER_NOT_FOUND",
      });

    // Check OTP match
    if (user.passwordResetOtp !== otp) {
      throw new AppError("Incorrect OTP", 400, { code: "INCORRECT_OTP" });
    }

    // Ensure expiry exists and hasn't passed
    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      // Clear OTP fields and persist
      user.passwordResetOtp = null;
      user.passwordResetExpires = null;
      await user.save();

      throw new AppError("OTP expired. Request a new one.", 400, {
        code: "OTP_EXPIRED",
      });
    }

    res.cookie("user_otp", otp, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified. Proceed to reset password.",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body using Zod
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, otp, password } = parseResult.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404, { code: "USER_NOT_FOUND" });
    }

    // Check OTP
    if (user.passwordResetOtp !== otp) {
      throw new AppError("Invalid OTP", 400, { code: "INVALID_OTP" });
    }

    // Ensure expiry exists and hasn't passed
    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      // Clear OTP fields and persist
      user.passwordResetOtp = null;
      user.passwordResetExpires = null;
      await user.save();

      throw new AppError("OTP expired. Request a new one.", 400, {
        code: "OTP_EXPIRED",
      });
    }

    // Set new password and clear OTP fields
    user.password = await hashPassword(password);
    user.passwordResetOtp = null;
    user.passwordResetExpires = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  }
);

export const signOut = (req: Request, res: Response): Response => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful." });
  } catch (err) {
    // Keep the response shape consistent — do not leak internals.
    // eslint-disable-next-line no-console
    console.error(
      "Error in logout:",
      err instanceof Error ? err.message : String(err)
    );
    return res
      .status(500)
      .json({ success: false, message: "Error logging out" });
  }
};
