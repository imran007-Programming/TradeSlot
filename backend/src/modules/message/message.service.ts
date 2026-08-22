import { Channel, Sender } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { IReceiveMessage } from "./message.type";

export const receiveMessage = async (data: IReceiveMessage) => {
    const { phone, name, traderId, channel, content } = data;

    // 1. Validate input
    if (!phone) {
        throw new AppError(400, "Phone is required");
    }

    if (!traderId) {
        throw new AppError(400, "Trader ID is required");
    }

    if (!content?.trim()) {
        throw new AppError(400, "Message content is required");
    }

    // 2. Check trader
    const trader = await prisma.trader.findUnique({
        where: {
            id: traderId,
        },
    });

    if (!trader) {
        throw new AppError(404, "Trader not found");
    }

    // 3. Find or create customer
    const customer = await prisma.customer.upsert({
        where: {
            phone,
        },
        update: {
            ...(name && { name }),
        },
        create: {
            phone,
            name: name ?? "Unknown Customer",
        },
    });

    // 4. Find existing OPEN conversation
    let conversation = await prisma.conversation.findFirst({
        where: {
            customerId: customer.id,
            traderId: trader.id,
            channel,
            status: "OPEN",
        },
    });

    // 5. Create conversation if doesn't exist
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                customerId: customer.id,
                traderId: trader.id,
                channel,
                status: "OPEN",
            },
        });
    }

    // 6. Create message
    const message = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            sender: Sender.CUSTOMER,
            channel,
            content: content.trim(),
        },
    });

    return {
        customer,
        conversation,
        message,
    };
};
