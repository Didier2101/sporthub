// hooks/auth/useCheckSession.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@auth/services/auth-service';
import { useAuthStore } from '@shared/store/useAuthStore';

interface User {
    id: number;
    email: string;
    name_user: string;
    username?: string;
    fotoPerfil?: string | null;
}

interface UseCheckSessionResult {
    loading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
    checkSession: () => Promise<void>;
}

export function useCheckSession(): UseCheckSessionResult {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const checkSession = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.checkSession();

            if (result.success && result.authenticated === true) {
                setIsAuthenticated(true);

                if (result.user) {
                    setUser(result.user);
                    setAuthData({
                        name_user: result.user.name_user,
                        email: result.user.email,
                        fotoPerfil: result.user.fotoPerfil || null,
                    });
                } else {
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                clearAuth();
            }
        } catch (err) {
            // Usamos 'err' en lugar de 'error' para evitar conflicto
            console.error('Error al verificar sesión:', err);
            setIsAuthenticated(false);
            setUser(null);
            setError('Error al verificar sesión');
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, [setAuthData, clearAuth]); // Agregamos las dependencias necesarias

    useEffect(() => {
        checkSession();
    }, [checkSession]); // Ahora incluimos checkSession en las dependencias

    return { loading, isAuthenticated, user, error, checkSession };
}