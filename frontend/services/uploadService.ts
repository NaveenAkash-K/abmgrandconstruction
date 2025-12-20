import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post(API_ENDPOINTS.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    uploadMultiple: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await apiClient.post(`${API_ENDPOINTS.UPLOAD}/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteImage: async (imageUrl: string) => {
        const response = await apiClient.delete(API_ENDPOINTS.UPLOAD, {
            data: { imageUrl },
        });
        return response.data;
    },
};
