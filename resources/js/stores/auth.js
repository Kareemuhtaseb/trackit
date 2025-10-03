import { defineStore } from 'pinia';
import api from '../utils/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token'),
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.user && state.token),
    },

    actions: {
        setToken(token) {
            this.token = token;
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        },

        setAuthHeader() {
            // This is now handled by the axios interceptor
        },

        async fetchUser() {
            if (!this.token) {
                this.user = null;
                return;
            }

            try {
                this.loading = true;
                const { data } = await api.get('/user');
                this.user = data.data ?? data;
                this.error = null;
            } catch (error) {
                this.user = null;
                this.token = null;
                this.setToken(null);
                if (error.response && error.response.status === 401) {
                    return;
                }
                this.error = this.normalizeError(error);
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const { data } = await api.post('/login', credentials);
                this.user = data.user?.data ?? data.user ?? null;
                this.setToken(data.token);
            } catch (error) {
                this.error = this.normalizeError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(payload) {
            this.loading = true;
            this.error = null;

            try {
                const { data } = await api.post('/register', payload);
                this.user = data.user?.data ?? data.user ?? null;
                this.setToken(data.token);
            } catch (error) {
                this.error = this.normalizeError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            this.error = null;

            try {
                if (this.token) {
                    await api.post('/logout');
                }
            } catch (error) {
                // Continue with logout even if API call fails
                console.error('Logout API call failed:', error);
            } finally {
                this.user = null;
                this.setToken(null);
                this.loading = false;
            }
        },

        normalizeError(error) {
            if (error?.response?.data?.message) {
                return error.response.data.message;
            }

            if (error?.response?.data?.errors) {
                const errors = error.response.data.errors;
                return Object.values(errors).flat().join(', ');
            }

            if (error?.message) {
                return error.message;
            }

            return 'Something went wrong. Please try again.';
        },
    },
});
