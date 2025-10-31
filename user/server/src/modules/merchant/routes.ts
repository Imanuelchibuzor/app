import { Router } from "express";

import getToken from "../../middlewares/auth";
import {
  createStarterMerchant,
  initializeProSubscription,
  verifyProSubscription,
  initializePremiumSubscription,
  verifyPremiumSubscription,
  fetchAccount,
  listBanks,
  verifyAccount,
  saveAccount,
  fetchVendorDashboard,
  fetchAffiliateDashboard,
} from "./controllers";

const router = Router();

router.post("/onboard-starter", getToken, createStarterMerchant);

router.post(
  "/initialize-pro-subscription",
  getToken,
  initializeProSubscription
);

router.post("/verify-pro-subscription", getToken, verifyProSubscription);

router.post(
  "/initialize-premium-subscription",
  getToken,
  initializePremiumSubscription
);

router.post(
  "/verify-premium-subscription",
  getToken,
  verifyPremiumSubscription
);

router.get("/list-banks", getToken, listBanks);

router.get("/fetch-account", getToken, fetchAccount);

router.post("/verify-account", getToken, verifyAccount);

router.post("/save-account", getToken, saveAccount);

router.get("/vendor-dashboard", getToken, fetchVendorDashboard);

router.get("/affiliate-dashboard", getToken, fetchAffiliateDashboard);

export default router;
