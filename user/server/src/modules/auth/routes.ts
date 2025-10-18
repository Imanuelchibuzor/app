import { Router } from "express";
import {
  signUp,
  resendOtp,
  verifyEmail,
  signIn,
  forgotPassword,
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  signOut,
} from "./controllers";

const router = Router();

router.post("/sign-up", signUp);

router.post("/resend-otp", resendOtp);

router.post("/verify-email", verifyEmail);

router.post("/sign-in", signIn);

router.post("/forgot-password", forgotPassword);

router.post("/resend-password-reset-otp", resendPasswordResetOtp);

router.post("/verify-password-reset-otp", verifyPasswordResetOtp);

router.post("/reset-password", resetPassword);

router.post("/sign-out", signOut);

export default router;
