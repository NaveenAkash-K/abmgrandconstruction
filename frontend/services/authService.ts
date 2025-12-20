import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    user: User;
    success: boolean;
    token: string;
    data: User;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token);
        }
      }
      return response.data;
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },

    getMe: async () => {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },

    isAuthenticated: (): boolean => {
      if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token');
      }
      return false;
    },
};
