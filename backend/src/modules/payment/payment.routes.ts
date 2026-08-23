import { Router } from "express";
import {
    createCheckoutSessionController,
    getPaymentStatusController,
    getPaymentSummaryController,
    verifySessionController,
} from "./payment.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

router.get("/summary", authGuard, getPaymentSummaryController);
router.get("/verify-session", verifySessionController);
router.post("/checkout/:bookingId", authGuard, createCheckoutSessionController);
router.get("/:bookingId", authGuard, getPaymentStatusController);

export const paymentRoutes = router;
