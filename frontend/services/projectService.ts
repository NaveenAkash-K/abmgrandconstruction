import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface Project {
    _id?: string;
    title: string;
    description: string;
    location: string;
    status: 'Completed' | 'In Progress' | 'Planning';
    image?: string;
    images?: string[];
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export const projectService = {
    getAll: async () => {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS}/${id}`);
        return response.data;
    },

    create: async (data: Project) => {
        const response = await apiClient.post(API_ENDPOINTS.PROJECTS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<Project>) => {
        const response = await apiClient.put(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
        return response.data;
    },
};
