import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { ICreateBooking } from "./booking.types";

const TRAVEL_BUFFER_MINUTES = 30;

export const createBooking = async (data: ICreateBooking) => {
  const {
    traderId,
    customerId,
    slotStart,
    slotEnd,
    bufferMinutes,
    bookingFee,
    conversationId,
  } = data;

  const trader = await prisma.trader.findUnique({
    where: { id: traderId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new AppError(404, "Customer not found");
  }

  const start = new Date(slotStart);
  const end = new Date(slotEnd);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError(400, "Invalid date format");
  }

  if (start >= end) {
    throw new AppError(400, "Slot start time must be before end time");
  }

  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const workArea = await prisma.workArea.findFirst({
    where: {
      traderId,
      availableDate: { gte: dayStart, lte: dayEnd },
    },
  });

  if (!workArea) {
    throw new AppError(400, "No work area zone is configured for this date. Please set a work area first.");
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      traderId,
      status: "CONFIRMED",
      slotStart: {
        lt: new Date(end.getTime() + bufferMinutes * 60000),
      },
      slotEnd: {
        gt: new Date(start.getTime() - bufferMinutes * 60000),
      },
    },
  });

  if (existingBooking) {
    throw new AppError(409, "Slot is already booked or conflicts with buffer");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      traderId,
      slotStart: start,
      slotEnd: end,
      bufferMinutes,
      bookingFee: bookingFee,
      conversationId,
      status: "PENDING",
    },
    include: {
      customer: true,
      trader: true,
      conversation: true,
    },
  });

  return booking;
};

export const getBookings = async (userId: string) => {
  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  // Auto-clean any lingering PENDING proposals if a customer already has a CONFIRMED booking
  const confirmedBookings = await prisma.booking.findMany({
    where: {
      traderId: trader.id,
      status: "CONFIRMED",
    },
    select: { customerId: true },
  });
  const confirmedCustomerIds = confirmedBookings.map((b) => b.customerId);

  if (confirmedCustomerIds.length > 0) {
    await prisma.booking.updateMany({
      where: {
        traderId: trader.id,
        customerId: { in: confirmedCustomerIds },
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
      },
    });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      traderId: trader.id,
      status: { not: "CANCELLED" },
    },
    include: {
      customer: true,
      trader: true,
      payment: true,
      conversation: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      trader: true,
      payment: true,
      conversation: true,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  if (booking.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to view this booking");
  }

  return booking;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  if (booking.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to update this booking");
  }

  if (!Object.values(BookingStatus).includes(status)) {
    throw new AppError(400, "Invalid booking status");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      customer: true,
      trader: true,
      payment: true,
      conversation: true,
    },
  });

  return updatedBooking;
};

export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError(400, "Booking is already cancelled");
  }

  const trader = await prisma.trader.findUnique({
    where: { userId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  if (booking.traderId !== trader.id) {
    throw new AppError(403, "You are not authorized to cancel this booking");
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
    include: {
      customer: true,
      trader: true,
      payment: true,
      conversation: true,
    },
  });

  return cancelledBooking;
};

export const getAvailableSlots = async (
  traderId: string,
  dateInput: Date | string,
  durationMinutes: number = 60
) => {
  const trader = await prisma.trader.findUnique({
    where: { id: traderId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  let year: number, month: number, day: number;

  if (typeof dateInput === "string") {
    const cleanDate = dateInput.split("T")[0];
    const parts = cleanDate.split("-").map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else if (dateInput instanceof Date) {
    year = dateInput.getUTCFullYear();
    month = dateInput.getUTCMonth() + 1;
    day = dateInput.getUTCDate();
  } else {
    const d = new Date(dateInput);
    year = d.getUTCFullYear();
    month = d.getUTCMonth() + 1;
    day = d.getUTCDate();
  }

  const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

  const workArea = await prisma.workArea.findFirst({
    where: {
      traderId,
      availableDate: { gte: dayStart, lte: dayEnd },
    },
  });

  if (!workArea) {
    throw new AppError(400, "No work area set for this date");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      traderId,
      status: "CONFIRMED",
      slotStart: { gte: dayStart },
      slotEnd: { lte: dayEnd },
    },
    orderBy: { slotStart: "asc" },
  });

  const slots = [];
  const workStart = new Date(year, month - 1, day, 9, 0, 0, 0);
  const workEnd = new Date(year, month - 1, day, 19, 0, 0, 0); // 7:00 PM

  let currentSlot = new Date(workStart);
  const now = new Date();

  while (
    currentSlot.getTime() + durationMinutes * 60000 <=
    workEnd.getTime()
  ) {
    const slotEnd = new Date(currentSlot.getTime() + durationMinutes * 60000);
    const isPast = currentSlot.getTime() <= now.getTime();

    // Check if clashing with any existing booking (including 30-minute travel buffer)
    const clashingBooking = bookings.find((booking) => {
      const bufferedStart = new Date(booking.slotStart.getTime() - TRAVEL_BUFFER_MINUTES * 60000);
      const bufferedEnd = new Date(booking.slotEnd.getTime() + TRAVEL_BUFFER_MINUTES * 60000);
      return !(slotEnd <= bufferedStart || currentSlot >= bufferedEnd);
    });

    const isBooked = !!clashingBooking;
    const isAvailable = !isPast && !isBooked;

    slots.push({
      start: currentSlot.toISOString(),
      end: slotEnd.toISOString(),
      available: isAvailable,
      status: isBooked ? "BOOKED" : isPast ? "PAST" : "AVAILABLE",
    });

    // Advance by slot duration (60 min) + travel buffer (30 min) = 90 min
    // 09:00-10:00 -> 10:30-11:30 -> 12:00-01:00 -> 01:30-02:30 -> 03:00-04:00 -> 04:30-05:30 -> 06:00-07:00
    currentSlot = new Date(currentSlot.getTime() + (durationMinutes + TRAVEL_BUFFER_MINUTES) * 60000);
  }

  return slots;
};

export const createBookingFromConversation = async (
  conversationId: string,
  slotStart: string | Date,
  slotEnd: string | Date,
  bookingFee: number,
  userId: string
) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
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

  // Cancel any prior PENDING proposals for this conversation
  await prisma.booking.updateMany({
    where: {
      conversationId,
      status: "PENDING",
    },
    data: {
      status: "CANCELLED",
    },
  });

  // Assign booking to the logged-in trader
  const booking = await createBooking({
    customerId: conversation.customerId,
    traderId: trader.id,
    slotStart,
    slotEnd,
    bufferMinutes: TRAVEL_BUFFER_MINUTES,
    bookingFee,
    conversationId,
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { 
      traderId: trader.id, // Update conversation traderId to logged-in trader
    },
  });

  return booking;
};

export const deleteBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new AppError(404, "Booking not found");

  const trader = await prisma.trader.findUnique({ where: { userId } });
  if (!trader) throw new AppError(404, "Trader not found");
  if (booking.traderId !== trader.id) throw new AppError(403, "Not authorized");

  // Delete related payment first (FK constraint)
  await prisma.payment.deleteMany({ where: { bookingId } });
  await prisma.booking.delete({ where: { id: bookingId } });

  return { deleted: true };
};

export const BookingService = {
  createBooking,
  createBookingFromConversation,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  getAvailableSlots,
};
