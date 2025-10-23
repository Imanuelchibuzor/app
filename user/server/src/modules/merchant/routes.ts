import { Router } from "express";

import getToken from "../../middlewares/auth";
import { createStarterMerchant, initializeProSubscription, verifyProSubscription, initializePremiumSubscription, verifyPremiumSubscription, fetchAccount, listBanks, verifyAccount, saveAccount } from "./controllers";

const router = Router();

router.post("/onboard-starter", getToken, createStarterMerchant);

router.post("/initialize-pro-subscription", getToken, initializeProSubscription);

router.post("/verify-pro-subscription", getToken, verifyProSubscription);

router.post("/initialize-premium-subscription", getToken, initializePremiumSubscription);

router.post("/verify-premium-subscription", getToken, verifyPremiumSubscription);

router.get("/fetch-account", getToken, fetchAccount);

router.get("/list-banks", getToken, listBanks);

router.post("/verify-account", getToken, verifyAccount);

router.post("/save-account", getToken, saveAccount);

export default router;
