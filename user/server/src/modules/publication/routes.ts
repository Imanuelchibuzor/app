import { Router } from "express";

import getToken from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import {
  add,
  fetch,
  searchByTitle,
  filterByCategory,
  fetchById,
  promote
} from "./controllers";

const router = Router();

router.post(
  "/add",
  getToken,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  add
);

router.get("/fetch", fetch);

router.get("/search", searchByTitle);

router.get("/filter", filterByCategory);

router.get("/fetch-by-id", fetchById);

router.post("/promote", getToken, promote);

export default router;
