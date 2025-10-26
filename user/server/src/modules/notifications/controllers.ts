import { Request, Response } from "express";

import { Notification } from "../../models/notification";
import asyncHandler from "../../utils/asyncHandler";
import { validateUser } from "../../utils/validateUser";
import { fetchSchema, markAsReadSchema } from "./validation";

export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });
    return res.status(200).json({ success: true, count });
  }
);

export const fetch = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = await validateUser(req);
  const parseResult = fetchSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      errors: parseResult.error.issues.map((err) => err.message),
    });
  }
  const { page, limit } = parseResult.data;

  const currentPage = Math.max(parseInt(page), 1);
  const pageSize = Math.max(parseInt(limit), 12);

  // Fetch Notification entries for the user
  const items = await Notification.find({ user: userId })
    .lean()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  // Get total number of notification entries for the user
  const totalItems = await Notification.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalItems / pageSize);

  // Map  entries to a simplified notification object
  const notifications = items.map((n) => ({
    id: n._id,
    subject: n.subject,
    message: n.message,
    isRead: n.isRead,
    date: n.createdAt,
  }));

  return res.status(200).json({
    success: true,
    notifications,
    totalPages,
  });
});

export const markAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    const parseResult = markAsReadSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }
    const { id } = parseResult.data;

    await Notification.updateOne({ _id: id, user: userId }, { isRead: true });
    return res.status(200).json({ success: true });
  }
);

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    await Notification.updateMany({ user: userId }, { isRead: true });
    return res.status(200).json({ success: true });
  }
);
