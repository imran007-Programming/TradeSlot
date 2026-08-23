import { Channel } from '@prisma/client';
import { receiveMessage } from '../modules/message/message.service';

export interface IncomingMessage {
  phone: string;
  name?: string;
  channel: Channel;
  content: string;
  traderId: string;
}

/**
 * Single unified booking pipeline.
 * All channels (WhatsApp, WebChat, future channels) funnel through here.
 * Channel-specific adapters normalize the payload before calling this.
 */
export const processIncomingMessage = async (data: IncomingMessage) => {
  const { phone, name, channel, content, traderId } = data;

  // Central entry point — find/create customer, conversation, and persist message
  const result = await receiveMessage({ phone, name, traderId, channel, content });

  return result;
};
