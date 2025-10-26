import { Router } from "express";

import getToken from "../../middlewares/auth";
import {
  getUnreadCount,
  fetch,
  markAsRead,
  markAllAsRead,
} from "./controllers";

const router = Router();

router.get("/unread", getToken, getUnreadCount);

router.get("/fetch", getToken, fetch);

router.post("/read", getToken, markAsRead);

router.post("/read-all", getToken, markAllAsRead);

export default router;
