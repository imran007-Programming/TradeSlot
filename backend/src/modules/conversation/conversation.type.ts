import { Channel, ConversationStatus } from "@prisma/client";

export interface ICreateConversation {
  customerId: string;
  traderId: string;
  channel: Channel;
}

export interface IUpdateConversationStatus {
  status: ConversationStatus;
}
