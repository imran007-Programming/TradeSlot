import { ConversationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { sendWhatsAppMessage } from "../../services/ultramsg.service";

export const getConversations = async (userId: string) => {
  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      traderId: trader.id,
    },
    include: {
      customer: true,
      messages: {
        orderBy: {
          sentAt: "asc",
        },
      },
      bookings: {
        include: { payment: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations;
};

export const getConversationById = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      customer: true,
      messages: {
        orderBy: {
          sentAt: "asc",
        },
      },
      bookings: {
        include: { payment: true },
      },
    },
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  return conversation;
};

export const updateConversationStatus = async (
  conversationId: string,
  status: ConversationStatus,
  userId: string
) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  if (!Object.values(ConversationStatus).includes(status)) {
    throw new AppError(400, "Invalid conversation status");
  }

  const updated = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      status,
    },
    include: {
      customer: true,
      messages: true,
      bookings: true,
    },
  });

  return updated;
};

export const deleteConversation = async (
  conversationId: string,
  userId: string
) => {
  const trader = await prisma.trader.findUnique({ where: { userId } });
  if (!trader) throw new AppError(404, "Trader not found");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) throw new AppError(404, "Conversation not found");

  await prisma.message.deleteMany({ where: { conversationId } });
  await prisma.conversation.delete({ where: { id: conversationId } });

  return { deleted: true };
};

export const sendMessageToConversation = async (
  conversationId: string,
  content: string,
  userId: string
) => {
  // 1. Get conversation with customer
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { customer: true },
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  // 2. Verify trader ownership
  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  // 3. Create message in DB
  const message = await prisma.message.create({
    data: {
      conversationId,
      sender: "TRADER",
      channel: conversation.channel,
      content,
    },
  });

  // 4. If WhatsApp conversation, send via Twilio
  if (conversation.channel === "WHATSAPP") {
    const customerPhone = conversation.customer.phone;
    const toNumber = customerPhone.startsWith("+") ? customerPhone : `+${customerPhone}`;
    const result = await sendWhatsAppMessage(toNumber, content);
    if (!result.success) {
      console.error(`⚠️ Twilio send failed for ${toNumber}:`, result.error);
    } else {
      console.log(`✅ WhatsApp reply sent to ${toNumber}, SID: ${result.messageSid}`);
    }
  }

  return message;
};
