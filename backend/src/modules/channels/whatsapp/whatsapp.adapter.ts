import { Channel } from "@prisma/client";

export interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp?: number;
  name?: string;
}

export interface NormalizedMessage {
  phone: string;
  name?: string;
  channel: Channel;
  content: string;
}

export const normalizeWhatsAppMessage = (
  whatsappMsg: WhatsAppMessage
): NormalizedMessage => {
  return {
    phone: whatsappMsg.from.replace(/\D/g, ""),
    name: whatsappMsg.name,
    channel: Channel.WHATSAPP,
    content: whatsappMsg.text,
  };
};

export const whatsappAdapter = {
  normalizeWhatsAppMessage,
};
