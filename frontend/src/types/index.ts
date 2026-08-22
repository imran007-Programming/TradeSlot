export interface Message {
  id: string;
  sender: 'customer' | 'trader' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  customerId: string;
  traderId: string;
  channel: 'WHATSAPP' | 'WEB_CHAT';
  status: 'OPEN' | 'BOOKED' | 'CLOSED';
  messages: Message[];
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  traderId: string;
  slotStart: Date;
  slotEnd: Date;
  bookingFee: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  conversationId?: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
}

export interface Trader {
  id: string;
  name: string;
  phone: string;
  businessId?: string;
  createdAt: Date;
}
