import { Channel } from "@prisma/client";

export interface IReceiveMessage {
    phone: string;
    name?: string;
    traderId: string;
    channel: Channel;
    content: string;
}