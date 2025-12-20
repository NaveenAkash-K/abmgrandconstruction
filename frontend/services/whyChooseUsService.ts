import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface WhyChooseUs {
    _id?: string;
    title: string;
    description: string;
    icon: string;
    order?: number;
    isActive?: boolean;
}

export const whyChooseUsService = {
    getAll: async () => {
        const response = await apiClient.get(API_ENDPOINTS.WHY_CHOOSE_US);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.WHY_CHOOSE_US}/${id}`);
        return response.data;
    },

    create: async (data: WhyChooseUs) => {
        const response = await apiClient.post(API_ENDPOINTS.WHY_CHOOSE_US, data);
        return response.data;
    },

    update: async (id: string, data: Partial<WhyChooseUs>) => {
        const response = await apiClient.put(`${API_ENDPOINTS.WHY_CHOOSE_US}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.WHY_CHOOSE_US}/${id}`);
        return response.data;
    },
};
