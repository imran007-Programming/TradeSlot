import { Channel } from "@prisma/client";

export interface WebChatMessage {
  phone: string;
  name?: string;
  text: string;
}

export interface NormalizedMessage {
  phone: string;
  name?: string;
  channel: Channel;
  content: string;
}

export const normalizeWebChatMessage = (
  webChatMsg: WebChatMessage
): NormalizedMessage => {
  return {
    phone: webChatMsg.phone.replace(/\D/g, ""),
    name: webChatMsg.name,
    channel: Channel.WEB_CHAT,
    content: webChatMsg.text,
  };
};

export const webchatAdapter = {
  normalizeWebChatMessage,
};
