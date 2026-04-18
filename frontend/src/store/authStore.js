import { create } from 'zustand';
import api from '../services/api';

const safeSetItem = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error('LocalStorage error:', e);
    }
};

const useAuthStore = create((set) => ({
    user: (() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch (e) {
            return null;
        }
    })(),
    token: (() => {
        try {
            return localStorage.getItem('token') || null;
        } catch (e) {
            return null;
        }
    })(),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await api.post('/auth/login', { email, password });
            safeSetItem('user', JSON.stringify(data));
            safeSetItem('token', data.token);
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
            safeSetItem('user', JSON.stringify(data));
            safeSetItem('token', data.token);
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
