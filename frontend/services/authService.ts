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
  success: boolean;
  token: string;
  user: User;
  data?: User;
  message?: string;
}

export interface UpdateDetailsPayload {
  name: string;
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// Helper to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
  }
};

// Helper to delete cookie
const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

// Helper to get cookie
const getCookie = (name: string): string | null => {
  if (typeof window !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
          return decodeURIComponent(parts.pop()?.split(';').shift() || '');
      }
  }
  return null;
};

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data.token) {
          if (typeof window !== 'undefined') {
              localStorage.setItem('token', response.data.token);
              setCookie('token', response.data.token);
          }
      }
      return response.data;
  },

  /**
   * Logout user - clear token from storage
   */
  logout: async (): Promise<void> => {
      try {
          await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
          console.error('Logout API error:', error);
      } finally {
          if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              deleteCookie('token');
          }
      }
  },

  /**
   * Get current logged in user
   */
  getMe: async (): Promise<{ success: boolean; data: User }> => {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
  },

  /**
   * Update user details (name and email)
   */
  updateDetails: async (payload: UpdateDetailsPayload): Promise<{ success: boolean; data: User }> => {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_DETAILS, payload);
      return response.data;
  },

  /**
   * Request password reset - sends OTP to email
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
      return response.data;
  },

  /**
   * Reset password with OTP verification
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<AuthResponse> => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
      if (response.data.token) {
          if (typeof window !== 'undefined') {
              localStorage.setItem('token', response.data.token);
              setCookie('token', response.data.token);
          }
      }
      return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
      if (typeof window !== 'undefined') {
          return !!localStorage.getItem('token') || !!getCookie('token');
      }
      return false;
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('token') || getCookie('token');
      }
      return null;
  },
};
