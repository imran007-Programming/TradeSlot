import { Router } from "express";
import {
    stripeConnectController,
    stripeResetController,
    stripeStatusController,
} from "./trader.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

// Stripe Connect onboarding — creates account + returns onboarding URL
router.post("/stripe/connect", authGuard, stripeConnectController);

// Reset Stripe Connect account
router.post("/stripe/reset", authGuard, stripeResetController);

// Check Stripe Connect account status
router.get("/stripe/status", authGuard, stripeStatusController);

export const traderRoutes = router;
