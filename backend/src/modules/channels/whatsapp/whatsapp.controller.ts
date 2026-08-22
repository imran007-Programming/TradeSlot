import { Request, Response, NextFunction } from "express";
import { handleWhatsAppMessage } from "./whatsapp.service";
import { sendResponse } from "../../../utils/response";
import { AppError } from "../../../utils/Apperror";
import { prisma } from "../../../lib/prisma";

export const receiveWhatsAppMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("📥 Incoming WhatsApp Webhook Payload:", req.body);

    // Only process incoming messages
    if (req.body?.event_type !== "message_received") {
      return res.status(200).json({ status: "ignored" });
    }

    const payload = req.body?.data;
    if (!payload || payload.fromMe) {
      return res.status(200).json({ status: "ignored" });
    }

    const From = payload.from;
    const Body = payload.body;
    const ProfileName = payload.pushname;

    if (!From || !Body?.trim()) {
      return res.status(200).json({ status: "ignored" });
    }

    // UltraMsg sends phone as 8801647153126@c.us or plain number
    const phoneNumber = From.replace(/@c\.us$/, "").replace(/\D/g, "");
    
    // Resolve trader ID dynamically
    let traderId = process.env.TRADER_ID;

    // Check if trader exists in DB
    const existingTrader = traderId
      ? await prisma.trader.findUnique({ where: { id: traderId } })
      : null;

    if (!existingTrader) {
      // Fallback to first registered trader in database so message connects to logged in trader!
      const firstTrader = await prisma.trader.findFirst();
      if (firstTrader) {
        traderId = firstTrader.id;
      } else {
        console.error("❌ No trader account exists in database");
        return res.status(200).send("<Response></Response>");
      }
    }

    const result = await handleWhatsAppMessage({
      from: phoneNumber,
      text: Body,
      name: ProfileName || "WhatsApp Customer",
      traderId: traderId!,
    });

    console.log(`✅ WhatsApp message processed for trader: ${traderId}`);

    // Twilio expects TwiML XML response or 200 OK
    res.type("text/xml");
    return res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("❌ WhatsApp webhook error:", error);
    res.type("text/xml");
    return res.status(200).send("<Response></Response>");
  }
};
