import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface About {
    yearsOfExperience: number;
    completedProjects: number;
    locationsServed: number;
    _id?: string;
    title: string;
    description: string;
    mission?: string;
    vision?: string;
    values?: string[];
    teamImage?: string;
    yearsFounded?: number;
}

export const aboutService = {
    get: async () => {
        const response = await apiClient.get(API_ENDPOINTS.ABOUT);
        return response.data;
    },

    update: async (data: Partial<About>) => {
        const response = await apiClient.put(API_ENDPOINTS.ABOUT, data);
        return response.data;
    },
};
