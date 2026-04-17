import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, loading: false });
            return data;
        } catch (error) {
            set({ error, loading: false });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, loading: false });
            return data;
        } catch (error) {
            set({ error, loading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));

export default useAuthStore;
