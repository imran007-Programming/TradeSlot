import { getCookie } from './cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = getCookie('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });
    return response.json();
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  async patch(endpoint: string, data?: any, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  async delete(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });
    return response.json();
  },
};
