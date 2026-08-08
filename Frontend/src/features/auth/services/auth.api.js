import axios from 'axios';

// 1. Define dynamic base URL (uses Render URL in production, localhost in development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export const login = async (credentials) => {
    // DO NOT wrap in try/catch here — let Axios throw the error directly to Login.jsx
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/get-me');
    return response.data;
};