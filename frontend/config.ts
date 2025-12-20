export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    PROJECTS: '/projects',
    CLIENTS: '/clients',
    SERVICES: '/services',
    WHY_CHOOSE_US: '/why-choose-us',
    CONTACT: '/contact',
    ABOUT: '/about',
    UPLOAD: '/upload',
};
