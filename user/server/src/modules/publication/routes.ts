import { Router } from "express";

import getToken from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import { addProduct } from "./controllers";

const router = Router();

router.post(
  "/add-product",
  getToken,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  addProduct
);

export default router;
