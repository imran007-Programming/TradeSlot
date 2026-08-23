import { Customer } from './customer';

export interface BookingPayment {
  id?: string;
  status?: string;
  amount?: number;
  stripePaymentId?: string;
}

export interface Booking {
  id: string;
  slotStart: string | Date;
  slotEnd: string | Date;
  bookingFee: number | string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string;
  bufferMinutes?: number;
  customerId?: string;
  traderId?: string;
  conversationId?: string;
  customer?: Customer;
  payment?: BookingPayment;
}

export interface Slot {
  start: string;
  end: string;
  available?: boolean;
  status?: 'AVAILABLE' | 'BOOKED' | 'PAST' | string;
}
