export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  businessName?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string | {
      accessToken: string;
      refreshToken?: string;
    };
    user?: AuthUser;
  };
}
