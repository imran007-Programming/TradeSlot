export interface Message {
  id: string;
  sender: 'CUSTOMER' | 'TRADER' | 'SYSTEM';
  content: string;
  sentAt?: string | Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  slotStart: string | Date;
  slotEnd: string | Date;
  bookingFee: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  customer?: Customer;
}

export interface Conversation {
  id: string;
  channel: 'WHATSAPP' | 'WEB_CHAT';
  status: 'OPEN' | 'BOOKED' | 'CLOSED';
  customer: Customer;
  messages: Message[];
  bookings?: Booking[];
}
