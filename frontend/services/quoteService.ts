import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface QuoteRequest {
    name: string;
    email: string;
    phone: string;
    message: string;
    siteLocation: string;
    service: string;
}

export interface QuoteResponse {
    success: boolean;
    data: any;
    message?: string;
}

export const quoteService = {
    sendQuote: async (data: QuoteRequest): Promise<QuoteResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.QUOTES || '/quotes', data);
        return response.data;
    },

    getAllQuotes: async () => {
        const response = await apiClient.get(API_ENDPOINTS.QUOTES || '/quotes');
        return response.data;
    },

    getQuoteById: async (id: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.QUOTES || '/quotes'}/${id}`);
        return response.data;
    },

    deleteQuote: async (id: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.QUOTES || '/quotes'}/${id}`);
        return response.data;
    },
};
