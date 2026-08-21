import { normalizeWebChatMessage } from "./webchat.adapter";
import * as messageService from "../../message/message.service";
import { AppError } from "../../../utils/Apperror";

export interface WebChatMessageInput {
  phone: string;
  text: string;
  name?: string;
  traderId: string;
}

export const handleWebChatMessage = async (data: WebChatMessageInput) => {
  const { phone, text, name, traderId } = data;

  if (!phone || !text || !traderId) {
    throw new AppError(400, "Missing required fields: phone, text, traderId");
  }

  const normalized = normalizeWebChatMessage({
    phone,
    text,
    name,
  });

  const result = await messageService.receiveMessage({
    phone: normalized.phone,
    name: normalized.name,
    traderId,
    channel: normalized.channel,
    content: normalized.content,
  });

  return result;
};
