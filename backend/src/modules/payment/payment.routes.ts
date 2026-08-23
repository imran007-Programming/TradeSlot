import { Router } from "express";
import {
    createCheckoutSessionController,
    getPaymentStatusController,
    getPaymentSummaryController,
} from "./payment.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

router.get("/summary", authGuard, getPaymentSummaryController);
router.post("/checkout/:bookingId", authGuard, createCheckoutSessionController);
router.get("/:bookingId", authGuard, getPaymentStatusController);

export const paymentRoutes = router;
