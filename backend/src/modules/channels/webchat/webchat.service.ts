import { normalizeWebChatMessage } from "./webchat.adapter";
import { processIncomingMessage } from "../../../services/booking-engine.service";
import { AppError } from "../../../utils/Apperror";
import { prisma } from "../../../lib/prisma";

export interface WebChatMessageInput {
  phone: string;
  text: string;
  name?: string;
  traderId?: string;
}

export const handleWebChatMessage = async (data: WebChatMessageInput) => {
  let { phone, text, name, traderId } = data;

  if (!phone || !text) {
    throw new AppError(400, "Missing required fields: phone, text");
  }

  if (!traderId) {
    const trader = await prisma.trader.findFirst();
    if (!trader) throw new AppError(404, "No trader found");
    traderId = trader.id;
  }

  const normalized = normalizeWebChatMessage({ phone, text, name });

  return processIncomingMessage({
    phone: normalized.phone,
    name: normalized.name,
    channel: normalized.channel,
    content: normalized.content,
    traderId,
  });
};

export const getWebChatMessages = async (phone: string, traderId?: string) => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!traderId) {
    const trader = await prisma.trader.findFirst();
    if (!trader) return [];
    traderId = trader.id;
  }
  
  // Find customer matching exact phone or ending digits (e.g. 01712345678 vs 8801712345678)
  const customer = await prisma.customer.findFirst({
    where: {
      OR: [
        { phone: cleanPhone },
        { phone: { endsWith: cleanPhone.slice(-10) } },
      ],
    },
  });

  if (!customer) return [];

  const conversation = await prisma.conversation.findFirst({
    where: {
      customerId: customer.id,
      traderId,
    },
    include: {
      messages: {
        orderBy: { sentAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return conversation?.messages || [];
};
