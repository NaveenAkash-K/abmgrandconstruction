import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface Client {
    _id?: string;
    name: string;
    logo?: string;
    description?: string;
    isActive?: boolean;
    order?: number;
}

export const clientService = {
    getAll: async () => {
        const response = await apiClient.get(API_ENDPOINTS.CLIENTS);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.CLIENTS}/${id}`);
        return response.data;
    },

    create: async (data: Client) => {
        const response = await apiClient.post(API_ENDPOINTS.CLIENTS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<Client>) => {
        const response = await apiClient.put(`${API_ENDPOINTS.CLIENTS}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.CLIENTS}/${id}`);
        return response.data;
    },
};
