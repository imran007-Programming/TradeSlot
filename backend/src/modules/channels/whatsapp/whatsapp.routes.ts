import { Router } from "express";
import { receiveWhatsAppMessage } from "./whatsapp.controller";

const router = Router();

// Incoming message handler (POST from UltraMsg)
router.post("/webhook", receiveWhatsAppMessage);

export const whatsappRoutes = router;
