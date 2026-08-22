import { Router, Request, Response } from "express";
import { stripe } from "../../lib/stripe";
import { PaymentService } from "./payment.service";

const router = Router();

router.post("/stripe", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set");
        return res.status(500).json({ error: "Webhook secret not configured" });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await PaymentService.handleCheckoutCompleted(event.data.object);
                break;
            case "payment_intent.succeeded":
                await PaymentService.handlePaymentSuccess(event.data.object);
                break;
            case "payment_intent.payment_failed":
                await PaymentService.handlePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event: ${event.type}`);
        }
    } catch (error) {
        console.error(`Error handling webhook ${event.type}:`, error);
    }

    res.status(200).json({ received: true });
});

export const webhookRoutes = router;
