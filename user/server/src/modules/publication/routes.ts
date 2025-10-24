import { Router } from "express";

import upload from "../../middlewares/upload";
import getToken from "../../middlewares/auth";
import { reviewContent } from "./services";
import {} from "./controllers";

const router = Router();

router.post(
  "/review",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  reviewContent
);

export default router;
