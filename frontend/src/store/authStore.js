/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';


const API_URL = import.meta.env.MODE === 'development'?"http://localhost:3000/route":"/route"; 

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    newsinfo: [],
    newsPagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 9 },
    societiesinfo: [],
    eventsinfo: [],
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    error: null,
    message: null,

    fetchNews: async (page = 1, limit = 9) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/news`, { params: { page, limit } });
            // response.data = { data, currentPage, totalPages, totalCount, limit }
            set({
                newsinfo: response.data.data,
                newsPagination: {
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalCount: response.data.totalCount,
                    limit: response.data.limit,
                },
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    fetchSocieties: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/society`);
            set({ societiesinfo: response.data, isLoading: false });
            console.log(response);
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/events`);
            set({ eventsinfo: response.data, isLoading: false });
            console.log(response);
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    signup: async (userName, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { userName, password });
            set({ user: response.data.user, isAuthenticated: true, message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, message: "Logged out successfully", isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "error in logout", isLoading: false });
            throw error;
        }
    },

    login: async (userName, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { userName, password });
            set({ user: response.data.user, isAuthenticated: true, message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(`${API_URL}/check-auth`, { timeout: 5000 });
            set({ user: response.data.user, isAuthenticated: response.data.isAuthenticated, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isAuthenticated: false, isCheckingAuth: false });
        }
    },

    requestAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/admin-request`);
            set((state) => ({
                user: { ...state.user, adminRequestStatus: 'pending' },
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Error submitting request", isLoading: false });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    },

}));