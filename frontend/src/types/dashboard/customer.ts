export interface Customer {
  id: string;
  name: string;
  phone: string;
  channel?: 'WHATSAPP' | 'WEB_CHAT' | string;
  _count?: {
    messages?: number;
    bookings?: number;
  };
}
