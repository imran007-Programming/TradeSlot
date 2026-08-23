import { normalizeWhatsAppMessage } from "./whatsapp.adapter";
import { processIncomingMessage } from "../../../services/booking-engine.service";
import { AppError } from "../../../utils/Apperror";

export interface WhatsAppMessageInput {
  from: string;
  text: string;
  timestamp?: number;
  name?: string;
  traderId: string;
}

export const handleWhatsAppMessage = async (data: WhatsAppMessageInput) => {
  const { from, text, timestamp, name, traderId } = data;

  if (!from || !text || !traderId) {
    throw new AppError(400, "Missing required fields: from, text, traderId");
  }

  const normalized = normalizeWhatsAppMessage({ from, text, timestamp, name });

  return processIncomingMessage({
    phone: normalized.phone,
    name: normalized.name,
    channel: normalized.channel,
    content: normalized.content,
    traderId,
  });
};
