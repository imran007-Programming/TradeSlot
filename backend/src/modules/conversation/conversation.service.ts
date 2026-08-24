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

const formatWhatsAppMessage = (rawText: string): string => {
  // 1. Format Booking Offer
  if (rawText.toLowerCase().startsWith('booking offer:') || rawText.toLowerCase().startsWith('booking proposed:')) {
    const feeMatch = rawText.match(/Fee:\s*\$([\d.]+)/i);
    const fee = feeMatch ? feeMatch[1] : '50';
    const timeMatch = rawText.match(/\(([\d:]+\s*(?:AM|PM|am|pm)?\s*-\s*[\d:]+\s*(?:AM|PM|am|pm)?)\)/i);
    const timeStr = timeMatch ? timeMatch[1] : '';
    
    const datePart = rawText
      .replace(/Booking (Offer|Proposed):\s*/i, '')
      .replace(/\([\d:]+\s*(?:AM|PM|am|pm)?\s*-\s*[\d:]+\s*(?:AM|PM|am|pm)?\)/i, '')
      .replace(/\(Fee:\s*\$[\d.]+\)/i, '')
      .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, '')
      .trim();

    return (
      `📅 *Booking Offer Available!*\n\n` +
      `🗓️ *Date:* ${datePart || 'Scheduled Date'}\n` +
      (timeStr ? `⏰ *Time:* ${timeStr}\n` : '') +
      `🚗 *Travel Buffer:* 30m Applied ✅\n` +
      `💳 *Booking Fee:* $${fee} (Stripe Protected 🛡️)\n\n` +
      `👉 *Reply "CONFIRM" to accept, or reply with another time (e.g. "Tomorrow at 2pm" or "Other slots") to see more options!*`
    );
  }

  // 2. Format Booking Confirmed
  if (rawText.toLowerCase().startsWith('booking confirmed:')) {
    const feeMatch = rawText.match(/Fee:\s*\$([\d.]+)/i);
    const fee = feeMatch ? feeMatch[1] : '50';
    const timeMatch = rawText.match(/\(([\d:]+\s*(?:AM|PM|am|pm)?\s*-\s*[\d:]+\s*(?:AM|PM|am|pm)?)\)/i);
    const timeStr = timeMatch ? timeMatch[1] : '';

    const datePart = rawText
      .replace(/Booking Confirmed:\s*/i, '')
      .replace(/\([\d:]+\s*(?:AM|PM|am|pm)?\s*-\s*[\d:]+\s*(?:AM|PM|am|pm)?\)/i, '')
      .replace(/\(Fee:\s*\$[\d.]+\)/i, '')
      .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, '')
      .trim();

    return (
      `🎉 *Booking Confirmed!*\n\n` +
      `🗓️ *Date:* ${datePart || 'Scheduled Date'}\n` +
      (timeStr ? `⏰ *Time:* ${timeStr}\n` : '') +
      `🚗 *Travel Buffer:* 30m Applied ✅\n` +
      `💳 *Booking Fee:* $${fee}\n\n` +
      `✅ *Your appointment has been confirmed! Our serviceman will call you soon.*`
    );
  }

  // 3. Format Payment Link
  if (rawText.toLowerCase().startsWith('payment link:') || rawText.includes('stripe.com')) {
    const urlMatch = rawText.match(/(https?:\/\/[^\s]+)/)?.[0];
    if (urlMatch) {
      return (
        `💳 *Secure Stripe Payment Link*\n\n` +
        `Please click the link below to complete your payment and confirm your booking:\n` +
        `🔗 ${urlMatch}\n\n` +
        `🛡️ *100% Encrypted & Protected by Stripe*`
      );
    }
  }

  return rawText;
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

  // 4. If WhatsApp conversation, format with emojis/markdown and send
  if (conversation.channel === "WHATSAPP") {
    const customerPhone = conversation.customer.phone;
    const toNumber = customerPhone.startsWith("+") ? customerPhone : `+${customerPhone}`;
    const formattedContent = formatWhatsAppMessage(content);
    const result = await sendWhatsAppMessage(toNumber, formattedContent);
    if (!result.success) {
      console.error(`⚠️ WhatsApp send failed for ${toNumber}:`, result.error);
    } else {
      console.log(`✅ WhatsApp reply sent to ${toNumber}, SID: ${result.messageSid}`);
    }
  }

  return message;
};
