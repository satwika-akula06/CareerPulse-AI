import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

export const login = async (credentials) => {
    // DO NOT wrap in try/catch here — let Axios throw the error directly to Login.jsx
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/api/auth/get-me');
    return response.data;
};