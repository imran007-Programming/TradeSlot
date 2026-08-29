import { getCookie, setCookie, deleteCookie } from './cookies';

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

// Refresh accessToken using refreshToken cookie
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return false;

    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    const data = await response.json();
    if (data.success && data.data?.accessToken) {
      setCookie('accessToken', data.data.accessToken, 1 / 96); // 15 minutes
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// Fetch with auto token refresh on 401
const fetchWithAuth = async (url: string, options: RequestInit): Promise<any> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry with new token
      const retryResponse = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
      return retryResponse.json();
    } else {
      // Refresh failed — logout user
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  return response.json();
};

export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    return fetchWithAuth(`${API_URL}${endpoint}`, {
      ...options,
      method: 'GET',
    });
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    return fetchWithAuth(`${API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async patch(endpoint: string, data?: any, options?: RequestInit) {
    return fetchWithAuth(`${API_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete(endpoint: string, options?: RequestInit) {
    return fetchWithAuth(`${API_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
    });
  },
};
