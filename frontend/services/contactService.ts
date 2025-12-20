import apiClient from './client';
import { API_ENDPOINTS } from '@/config';

export interface ContactInfo {
    _id?: string;
    streetAddress: string;
    cityAndZip: string;
    country: string;
    primaryPhone: string;
    secondaryPhone?: string;
    primaryEmail: string;
    secondaryEmail?: string;
    businessHoursWeekdays: string;
    businessHoursSaturday: string;
    businessHoursSunday: string;
}

export interface ContactMessage {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export const contactService = {
    getInfo: async () => {
        const response = await apiClient.get(API_ENDPOINTS.CONTACT);
        return response.data;
    },

    updateInfo: async (data: Partial<ContactInfo>) => {
        const response = await apiClient.put(API_ENDPOINTS.CONTACT, data);
        return response.data;
    },

    sendMessage: async (data: ContactMessage) => {
        const response = await apiClient.post(`${API_ENDPOINTS.CONTACT}/message`, data);
        return response.data;
    },
};
