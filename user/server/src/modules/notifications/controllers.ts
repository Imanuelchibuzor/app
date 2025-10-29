import { Request, Response } from "express";

import { Notification } from "../../models/notification";
import asyncHandler from "../../utils/asyncHandler";
import { validateUser } from "../../utils/validateUser";
import { fetchSchema, markAsReadSchema } from "./validation";
import validateData from "../../utils/validateData";
import getPagination from "../../utils/getPagination";

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
  const parsed = validateData(req, res, fetchSchema, "query");
  if (!parsed) return;

  const { page, limit } = parsed;
  const { pageSize, skip } = getPagination(page, limit);

  // Fetch Notification entries for the user
  const items = await Notification.find({ user: userId })
    .lean()
    .sort({ createdAt: -1 })
    .skip(skip)
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

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = await validateUser(req);
  const parsed = validateData(req, res, markAsReadSchema, "body");
  if (!parsed) return;

  const { id } = parsed;

  await Notification.updateOne({ _id: id, user: userId }, { isRead: true });
  return res.status(200).json({ success: true });
});

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = await validateUser(req);
    await Notification.updateMany({ user: userId }, { isRead: true });
    return res.status(200).json({ success: true });
  }
);
