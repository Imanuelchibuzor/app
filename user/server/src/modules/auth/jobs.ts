import cron from "node-cron";
import { User, PendingUser } from "../../models/user";

const now = new Date();

const clearExpiredPasswordResetOtp = async () => {
  const expired = new Date(now.getTime() - 15 * 60 * 1000);

  try {
    // Update users whose passwordResetExpires is <= expired
    const result = await User.updateMany(
      { passwordResetExpires: { $lte: expired } },
      { $set: { passwordResetOtp: null, passwordResetExpires: null } }
    );

    const numCleared = result?.modifiedCount ?? 0;
    console.info(
      `[OTP Cleanup] Cleared ${numCleared} expired OTP(s) at ${now.toTimeString()}`
    );
  } catch (err) {
    console.error("[OTP Cleanup] Error clearing expired OTPs:", err);
  }
};

const clearExpiredPendingUsers = async () => {
  const cutOff = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 24hrs

  try {
    const result = await PendingUser.deleteMany({ createdAt: { $lt: cutOff } });
    const numDeleted = result.deletedCount ?? 0;
    console.info(
      `[OTP Cleanup] Deleted ${numDeleted} expired pending user(s) at ${now.toTimeString()}`
    );
  } catch (err) {
    console.error("[OTP Cleanup] Error deleting expired pending users:", err);
  }
};

export const startOtpCleanup = () => {
  // Cron expression to run at minute 0 of every hour.
  cron.schedule("0 * * * *", async () => {
    console.info("[OTP Cleanup] Running expired OTP cleanup job...");
    await clearExpiredPasswordResetOtp();
  });
};

export const startPendingUserCleanup = () => {
  // Cron expression to run at minute 0 of every hour.
  cron.schedule("0 * * * *", async () => {
    console.info("[OTP Cleanup] Running expired pending user cleanup job...");
    await clearExpiredPendingUsers();
  });
};
