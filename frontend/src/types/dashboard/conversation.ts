import { Customer } from './customer';
import { Booking } from './booking';

export interface Message {
  id: string;
  sender: 'CUSTOMER' | 'TRADER' | 'SYSTEM' | string;
  content: string;
  sentAt?: string | Date;
}

export interface Conversation {
  id: string;
  channel: 'WHATSAPP' | 'WEB_CHAT' | string;
  status: 'OPEN' | 'BOOKED' | 'CLOSED' | string;
  customerId?: string;
  traderId?: string;
  customer: Customer;
  messages: Message[];
  bookings?: Booking[];
}
