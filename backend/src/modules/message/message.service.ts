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

    // Clean phone number (digits only)
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneSuffix = cleanPhone.slice(-10); // Last 10 digits to match 017... and 88017...

    // 2. Check trader
    const trader = await prisma.trader.findUnique({
        where: {
            id: traderId,
        },
    });

    if (!trader) {
        throw new AppError(404, "Trader not found");
    }

    // 3. Find or create customer (matching exact phone or last 10 digits)
    let customer = await prisma.customer.findFirst({
        where: {
            OR: [
                { phone: cleanPhone },
                { phone: { endsWith: phoneSuffix } },
            ],
        },
    });

    if (customer) {
        if (name && customer.name !== name) {
            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: { name },
            });
        }
    } else {
        customer = await prisma.customer.create({
            data: {
                phone: cleanPhone,
                name: name ?? "Unknown Customer",
            },
        });
    }

    // 4. Find existing active conversation (OPEN or BOOKED) for this customer & trader
    let conversation = await prisma.conversation.findFirst({
        where: {
            customerId: customer.id,
            traderId: trader.id,
            status: {
                in: ["OPEN", "BOOKED"],
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // 5. Create conversation ONLY if no active conversation exists
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

    // 6. Create message under existing conversation
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
