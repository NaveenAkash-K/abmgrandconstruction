import apiClient from './client';

export interface UploadResponse {
    success: boolean;
    data: {
        url: string;
        filename: string;
        path: string;
    };
    message?: string;
}

export const uploadService = {
    uploadImage: async (file: File, folder: string = 'services'): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post(`/upload?folder=${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    uploadMultipleImages: async (files: File[], folder: string = 'services'): Promise<UploadResponse> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await apiClient.post(`/upload/multiple?folder=${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
