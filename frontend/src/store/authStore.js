/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';


const API_URL = "http://localhost:3000";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    newsinfo: [],
    societiesinfo: [],
    eventsinfo: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    message: null,

    fetchNews: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/news`);
            set({ newsinfo: response.data, isLoading: false });
            console.log(response);
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

    signup: async (name, rollNo) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { name, rollNo });
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

    login: async (rollNo) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { rollNo });
            set({ user: response.data.user, isAuthenticated: true, message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: response.data.isAuthenticated, isLoading: false });
        } catch (error) {
            set({error: null, isLoading: false,isAuthenticated: false });
        }
    },

    clearError: () => {
        set({ error: null });
    },

}));