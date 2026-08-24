import { normalizeWebChatMessage } from "./webchat.adapter";
import { processIncomingMessage } from "../../../services/booking-engine.service";
import { AppError } from "../../../utils/Apperror";
import { prisma } from "../../../lib/prisma";

export interface WebChatMessageInput {
  phone: string;
  text: string;
  name?: string;
  traderId?: string;
}

export const handleWebChatMessage = async (data: WebChatMessageInput) => {
  let { phone, text, name, traderId } = data;

  if (!phone || !text) {
    throw new AppError(400, "Missing required fields: phone, text");
  }

  if (!traderId) {
    const trader = await prisma.trader.findFirst();
    if (!trader) throw new AppError(404, "No trader found");
    traderId = trader.id;
  }

  const normalized = normalizeWebChatMessage({ phone, text, name });

  return processIncomingMessage({
    phone: normalized.phone,
    name: normalized.name,
    channel: normalized.channel,
    content: normalized.content,
    traderId,
  });
};

export const getWebChatMessages = async (phone: string, traderId?: string) => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!traderId) {
    const trader = await prisma.trader.findFirst();
    if (!trader) return [];
    traderId = trader.id;
  }
  
  // Find customer matching exact phone or ending digits
  const customer = await prisma.customer.findFirst({
    where: {
      OR: [
        { phone: cleanPhone },
        { phone: phone },
        ...(cleanPhone.length >= 7 ? [{ phone: { endsWith: cleanPhone.slice(-10) } }] : []),
      ],
    },
  });

  if (!customer) return [];

  const conversations = await prisma.conversation.findMany({
    where: {
      customerId: customer.id,
      traderId,
    },
    include: {
      messages: {
        orderBy: { sentAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return conversations.flatMap((c) => c.messages);
};

export const confirmWebChatBooking = async (bookingId: string, phone?: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, conversation: true },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.status === "CONFIRMED") {
    return booking; // Already confirmed
  }

  // Check if any other CONFIRMED booking clashes with this slot
  const clashingConfirmed = await prisma.booking.findFirst({
    where: {
      traderId: booking.traderId,
      id: { not: bookingId },
      status: "CONFIRMED",
      slotStart: {
        lt: new Date(booking.slotEnd.getTime() + booking.bufferMinutes * 60000),
      },
      slotEnd: {
        gt: new Date(booking.slotStart.getTime() - booking.bufferMinutes * 60000),
      },
    },
  });

  if (clashingConfirmed) {
    throw new AppError(409, "This slot was just booked by another customer. Please choose another time.");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  // Cancel any other lingering PENDING proposals for this customer
  await prisma.booking.updateMany({
    where: {
      customerId: booking.customerId,
      id: { not: bookingId },
      status: "PENDING",
    },
    data: {
      status: "CANCELLED",
    },
  });

  if (booking.conversationId) {
    await prisma.conversation.update({
      where: { id: booking.conversationId },
      data: { status: "BOOKED" },
    });

    const dateFormatted = new Date(booking.slotStart).toLocaleDateString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const startTimeStr = new Date(booking.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = new Date(booking.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await prisma.message.create({
      data: {
        conversationId: booking.conversationId,
        sender: "CUSTOMER",
        channel: "WEB_CHAT",
        content: `Booking Confirmed: ${dateFormatted} (${startTimeStr} - ${endTimeStr}) (Fee: $${booking.bookingFee}) [ID: ${booking.id}]`,
      },
    });
  }

  return updatedBooking;
};
