import { Router } from "express";
import { receiveWhatsAppMessage } from "./whatsapp.controller";

const router = Router();

router.post("/webhook", receiveWhatsAppMessage);

export const whatsappRoutes = router;
