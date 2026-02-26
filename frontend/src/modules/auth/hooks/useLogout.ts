// hooks/useLogout.ts
import { useState } from 'react';
import { useAuthStore } from '@shared/store/useAuthStore';

interface UseLogoutReturn {
    isLoading: boolean;
    error: string | null;
    logout: () => Promise<{ success: boolean; error?: string }>;
}

export function useLogout(): UseLogoutReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { clearAuth } = useAuthStore();

    const logout = async (): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        setError(null);

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            // Hacer logout en el backend
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });


            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cerrar sesión');
            }

            // ✅ Limpiar datos en el store de Zustand
            clearAuth();


            return {
                success: true,
            };

        } catch (err) {

            // Si hay error en el backend, igual limpiamos el frontend
            clearAuth();

            const errorMessage = err instanceof Error ? err.message : 'Error del servidor';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        logout,
    };
}