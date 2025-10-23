import { Router } from "express";

import getToken from "../../middlewares/auth";
import { createStarterMerchant } from "./controllers";

const router = Router();

router.post("/onboard-starter", getToken, createStarterMerchant);

export default router;