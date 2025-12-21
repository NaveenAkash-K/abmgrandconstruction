import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface Service {
    _id?: string;
    title: string;
    description: string;
    icon: string;
    image?: string;
    images?: string[];
    imageUrl: string;
    order?: number;
    isActive?: boolean;
}

export const serviceService = {
    getAll: async () => {
        const response = await apiClient.get(API_ENDPOINTS.SERVICES);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/${id}`);
        return response.data;
    },

    create: async (data: Service) => {
        const response = await apiClient.post(API_ENDPOINTS.SERVICES, data);
        return response.data;
    },

    update: async (id: string, data: Partial<Service>) => {
        const response = await apiClient.put(`${API_ENDPOINTS.SERVICES}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.SERVICES}/${id}`);
        return response.data;
    },
};
