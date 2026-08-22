import { ConversationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";

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
      bookings: true,
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
      bookings: true,
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

  if (conversation.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to view this conversation");
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

  if (conversation.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to update this conversation");
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


export const sendMessageToConversation = async (
  conversationId: string,
  content: string,
  userId: string
) => {
  // 1. Get conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
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

  if (conversation.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to send message in this conversation");
  }

  // 3. Create message
  const message = await prisma.message.create({
    data: {
      conversationId,
      sender: "TRADER",
      channel: conversation.channel,
      content,
    },
  });

  return message;
};
