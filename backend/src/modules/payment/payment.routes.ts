import { Router } from "express";
import {
    createCheckoutSessionController,
    getPaymentStatusController,
} from "./payment.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

// Create Stripe Checkout Session for a booking (trader must be authenticated)
router.post("/checkout/:bookingId", authGuard, createCheckoutSessionController);

// Get payment status for a booking (trader must be authenticated)
router.get("/:bookingId", authGuard, getPaymentStatusController);

export const paymentRoutes = router;
