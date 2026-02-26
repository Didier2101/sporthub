import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor for professional error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Ocurrió un error inesperado';

        // Auto-toast errors for a professional feel, unless explicitly disabled
        if (error.config?.showToast !== false) {
            toast.error(message);
        }

        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
            // Redirect to login if necessary or clear state
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);
