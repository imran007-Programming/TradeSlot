export interface Trader {
  id: string;
  name: string;
  businessName?: string;
  email?: string;
  phone: string;
  standardRate?: number;
  hourlyRate?: number;
}
