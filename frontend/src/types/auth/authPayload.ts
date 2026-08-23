export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  businessName: string;
  phone: string;
  email?: string;
  password: string;
}
