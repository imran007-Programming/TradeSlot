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

  const existingBooking = await prisma.booking.findFirst({
    where: {
      traderId,
      status: {
        in: ["CONFIRMED", "PENDING"],
      },
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
      bookingFee: bookingFee.toString(),
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

  const bookings = await prisma.booking.findMany({
    where: {
      traderId: trader.id,
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
  date: Date,
  durationMinutes: number = 60
) => {
  const trader = await prisma.trader.findUnique({
    where: { id: traderId },
  });

  if (!trader) {
    throw new AppError(404, "Trader not found");
  }

  const workArea = await prisma.workArea.findFirst({
    where: {
      traderId,
      availableDate: date,
    },
  });

  if (!workArea) {
    throw new AppError(400, "No work area set for this date");
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      traderId,
      status: { in: ["CONFIRMED", "PENDING"] },
      slotStart: { gte: dayStart },
      slotEnd: { lte: dayEnd },
    },
    orderBy: { slotStart: "asc" },
  });

  const slots = [];
  const workStart = new Date(date);
  workStart.setHours(9, 0, 0, 0);
  const workEnd = new Date(date);
  workEnd.setHours(17, 0, 0, 0);

  let currentSlot = new Date(workStart);

  while (
    currentSlot.getTime() + durationMinutes * 60000 <=
    workEnd.getTime()
  ) {
    const slotEnd = new Date(
      currentSlot.getTime() + durationMinutes * 60000
    );
    const slotWithBuffer = new Date(
      slotEnd.getTime() + TRAVEL_BUFFER_MINUTES * 60000
    );

    const isAvailable = !bookings.some((booking) => {
      const bookingWithBuffer = new Date(
        booking.slotEnd.getTime() + TRAVEL_BUFFER_MINUTES * 60000
      );
      return !(slotEnd <= booking.slotStart || currentSlot >= bookingWithBuffer);
    });

    if (isAvailable) {
      slots.push({
        start: currentSlot.toISOString(),
        end: slotEnd.toISOString(),
      });
    }

    currentSlot = new Date(currentSlot.getTime() + 60 * 60000);
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
      status: "BOOKED",
      traderId: trader.id, // Update conversation traderId to logged-in trader
    },
  });

  return booking;
};

export const BookingService = {
  createBooking,
  createBookingFromConversation,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAvailableSlots,
};
