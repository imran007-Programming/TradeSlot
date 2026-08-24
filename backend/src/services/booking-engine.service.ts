import { Channel, Sender } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { receiveMessage } from '../modules/message/message.service';
import { detectSlotRequest } from './slot-detector';
import { sendWhatsAppMessage } from './ultramsg.service';

export interface IncomingMessage {
  phone: string;
  name?: string;
  channel: Channel;
  content: string;
  traderId: string;
}

const BUFFER_MINUTES = 30;
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;

const saveReply = async (conversationId: string, content: string, channel: Channel) => {
  await prisma.message.create({
    data: { conversationId, sender: Sender.TRADER, channel, content },
  });
};

const getAlternativeSlots = async (traderId: string, date: Date): Promise<string[]> => {
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);

  const existingBookings = await prisma.booking.findMany({
    where: {
      traderId,
      status: 'CONFIRMED',
      slotStart: { gte: dayStart },
      slotEnd: { lte: dayEnd },
    },
    orderBy: { slotStart: 'asc' },
  });

  const alternatives: string[] = [];
  const current = new Date(date);

  for (let h = WORK_START_HOUR; h < WORK_END_HOUR && alternatives.length < 3; h++) {
    current.setHours(h, 0, 0, 0);
    const slotEnd = new Date(current.getTime() + 60 * 60000);

    const clash = existingBookings.some(b => {
      const bufferEnd = new Date(b.slotEnd.getTime() + BUFFER_MINUTES * 60000);
      const bufferStart = new Date(b.slotStart.getTime() - BUFFER_MINUTES * 60000);
      return !(slotEnd <= bufferStart || current >= bufferEnd);
    });

    if (!clash) {
      alternatives.push(
        current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    }
  }

  return alternatives;
};

const checkSlotAvailability = async (
  traderId: string,
  slotStart: Date,
  slotEnd: Date
): Promise<{ available: boolean; reason?: string }> => {
  // 1. Check work hours
  if (slotStart.getHours() < WORK_START_HOUR || slotEnd.getHours() > WORK_END_HOUR) {
    return { available: false, reason: 'outside_hours' };
  }

  // 2. Check work area set for that date
  const dayStart = new Date(slotStart); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(slotStart); dayEnd.setHours(23, 59, 59, 999);

  const workArea = await prisma.workArea.findFirst({
    where: {
      traderId,
      availableDate: { gte: dayStart, lte: dayEnd },
    },
  });

  if (!workArea) {
    return { available: false, reason: 'no_work_area' };
  }

  // 3. Check buffer clash with existing confirmed bookings
  const clash = await prisma.booking.findFirst({
    where: {
      traderId,
      status: 'CONFIRMED',
      slotStart: { lt: new Date(slotEnd.getTime() + BUFFER_MINUTES * 60000) },
      slotEnd: { gt: new Date(slotStart.getTime() - BUFFER_MINUTES * 60000) },
    },
  });

  if (clash) {
    return { available: false, reason: 'clash' };
  }

  return { available: true };
};

export const processIncomingMessage = async (data: IncomingMessage) => {
  const { phone, name, channel, content, traderId } = data;

  // 1. Save customer message + get conversation
  const result = await receiveMessage({ phone, name, traderId, channel, content });
  const { conversation, customer } = result;

  const normalizedText = content.trim().toLowerCase();
  const isConfirmIntent =
    /^(confirm|yes|ok|okay|agree|book it|please book|confirmed|accepted)/i.test(normalizedText) ||
    normalizedText.includes('confirm booking');

  // Check if customer is confirming a pending booking offer
  if (isConfirmIntent) {
    const pendingBooking = await prisma.booking.findFirst({
      where: {
        customerId: customer.id,
        traderId,
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (pendingBooking) {
      await prisma.booking.update({
        where: { id: pendingBooking.id },
        data: { status: 'CONFIRMED' },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: 'BOOKED' },
      });

      const dateFormatted = new Date(pendingBooking.slotStart).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const startTimeStr = new Date(pendingBooking.slotStart).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endTimeStr = new Date(pendingBooking.slotEnd).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const confirmMsg =
        `🎉 Booking Confirmed: ${dateFormatted} (${startTimeStr} - ${endTimeStr}) (Fee: $${pendingBooking.bookingFee}) [ID: ${pendingBooking.id}]\n\n` +
        `Our team will reach out to you shortly!`;

      await saveReply(conversation.id, confirmMsg, channel);

      if (channel === Channel.WHATSAPP) {
        const toNumber = phone.startsWith('+') ? phone : `+${phone}`;
        await sendWhatsAppMessage(toNumber, confirmMsg);
      }

      return result;
    }
  }

  // Check if customer is asking for other available slots / different time
  const isAnotherSlotRequest =
    /another\s+slot|different\s+time|other\s+slots|change\s+time|not\s+available|reschedule|give\s+me\s+another|available\s+slots|other\s+options|different\s+slot/i.test(
      normalizedText
    );

  if (isAnotherSlotRequest) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const alternatives = await getAlternativeSlots(traderId, tomorrow);
    const dateFormatted = tomorrow.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    let altMsg: string;
    if (alternatives.length > 0) {
      altMsg =
        `📅 *Alternative Available Slots for ${dateFormatted}:*\n\n` +
        alternatives.map((t) => `• *${t}*`).join('\n') +
        `\n\n🚗 *All slots include 30m travel buffer.*\n` +
        `👉 *Reply with your preferred time (e.g. "${alternatives[0]}") or request a specific date/time!*`;
    } else {
      altMsg =
        `📅 No problem! Please reply with your preferred date and time (e.g. *"Tomorrow at 2:00 PM"* or *"Friday at 11:00 AM"*) and we'll check availability for you immediately!`;
    }

    await saveReply(conversation.id, altMsg, channel);
    if (channel === Channel.WHATSAPP) {
      const toNumber = phone.startsWith('+') ? phone : `+${phone}`;
      await sendWhatsAppMessage(toNumber, altMsg);
    }
    return result;
  }

  // 2. Try to detect a slot request
  const detected = detectSlotRequest(content);
  if (!detected) return result;

  const { slotStart, slotEnd } = detected;
  const dateStr = slotStart.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  // 3. Check availability
  const { available, reason } = await checkSlotAvailability(traderId, slotStart, slotEnd);

  let replyText: string;

  if (available) {
    replyText =
      `✅ Great news! ${dateStr} at ${timeStr} is available.\n\n` +
      `I'll confirm your booking shortly. Please wait for a confirmation message with your payment link.`;
  } else if (reason === 'no_work_area') {
    replyText =
      `Sorry, I'm not working in your area on ${dateStr}. ` +
      `Please try another date or contact me directly for availability.`;
  } else if (reason === 'outside_hours') {
    replyText =
      `Sorry, I only work between ${WORK_START_HOUR}:00 AM and ${WORK_END_HOUR}:00 PM. ` +
      `Please choose a time within working hours.`;
  } else {
    // clash — suggest alternatives
    const alternatives = await getAlternativeSlots(traderId, slotStart);
    if (alternatives.length > 0) {
      replyText =
        `Sorry, ${timeStr} on ${dateStr} is already taken (including travel buffer).\n\n` +
        `Here are available slots on the same day:\n` +
        alternatives.map(t => `• ${t}`).join('\n') +
        `\n\nJust reply with your preferred time!`;
    } else {
      replyText =
        `Sorry, ${dateStr} is fully booked. Please try a different date.`;
    }
  }

  // 4. Save reply to DB
  await saveReply(conversation.id, replyText, channel);

  // 5. Send via WhatsApp if applicable
  if (channel === Channel.WHATSAPP) {
    const toNumber = phone.startsWith('+') ? phone : `+${phone}`;
    await sendWhatsAppMessage(toNumber, replyText);
  }

  return result;
};
