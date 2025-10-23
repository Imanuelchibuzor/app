// src/utils/requireCurrentUser.ts
import { Request } from "express";
import { Types } from "mongoose";

import { User, UserDocument } from "../models/user";
import AppError from "../configs/error";

export type CurrentUserResult = {
  userId: string;
  user: UserDocument;
};

export async function validateUser(req: Request): Promise<CurrentUserResult> {
  const maybeUser = (req as any).user;

  // Ensure user is present (auth middleware should set this)
  if (!maybeUser || !maybeUser.id) {
    throw new AppError("Unauthorized. Please log in.", 401, { code: "UNAUTHORIZED" });
  }

  const userId = String(maybeUser.id);

  // Validate ObjectId
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", 400, { code: "INVALID_USER_ID" });
  }

  // 3. Fetch user from DB
  const user = (await User.findById(userId).exec()) as UserDocument | null;
  if (!user) {
    throw new AppError("User not found.", 404, { code: "USER_NOT_FOUND" });
  }

  return { userId, user };
}
