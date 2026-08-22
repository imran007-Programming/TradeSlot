import { Router, Request, Response, NextFunction } from "express";
import { receiveWhatsAppMessage } from "./whatsapp.controller";
import { verifyTwilioWebhook } from "../../../services/twilio.service";
import { AppError } from "../../../utils/Apperror";

const router = Router();

// Webhook verification (GET request from Twilio)
router.get("/webhook", (req: Request, res: Response) => {
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;
  const verifyToken = process.env.TWILIO_VERIFY_TOKEN;

  if (!verifyToken) {
    return res.status(400).send("Verify token not configured");
  }

  if (verifyTwilioWebhook(token, verifyToken)) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
});

// Incoming message handler (POST request from Twilio)
router.post("/webhook", receiveWhatsAppMessage);

export const whatsappRoutes = router;
