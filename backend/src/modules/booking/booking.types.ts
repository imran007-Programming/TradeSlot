import { BookingStatus } from "@prisma/client";

export interface ICreateBooking {
  customerId: string;
  traderId: string;
  slotStart: string | Date;
  slotEnd: string | Date;
  bufferMinutes: number;
  bookingFee: number;
  conversationId?: string;
}

export interface IGetAvailableSlots {
  traderId: string;
  date: string | Date;
  durationMinutes?: number;
}

export interface IConfirmBooking {
  bookingId: string;
  traderId: string;
}

export interface IUpdateBookingStatus {
  bookingId: string;
  status: BookingStatus;
  userId: string;
}
