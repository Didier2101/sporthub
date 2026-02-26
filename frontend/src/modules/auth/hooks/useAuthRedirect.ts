// hooks/auth/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@shared/store/useAuthStore';
import { authService } from '@auth/services/auth-service';
import { APP_ROUTES } from '@shared/constants';


interface UseAuthRedirectOptions {
    requireAuth?: boolean; // true = requiere autenticación, false = solo para no autenticados
    redirectTo?: string; // Ruta a redirigir si no cumple
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
    const { requireAuth = true, redirectTo } = options;
    const router = useRouter();
    const { setAuthData, clearAuth } = useAuthStore();

    useEffect(() => {
        const checkAndRedirect = async () => {
            try {
                const result = await authService.checkSession();

                if (result.success && result.authenticated && result.user) {
                    // Usuario autenticado
                    setAuthData({
                        name_user: result.user.name_user,
                        email: result.user.email,
                        fotoPerfil: result.user.fotoPerfil || null,
                    });

                    // Si está en una página que NO requiere auth (login/register), redirigir a home
                    if (!requireAuth) {
                        router.push(redirectTo || APP_ROUTES.PROTECTED.HOME);
                    }
                } else {
                    // Usuario NO autenticado
                    clearAuth();

                    // Si está en una página que SÍ requiere auth, redirigir a login
                    if (requireAuth) {
                        router.push(redirectTo || APP_ROUTES.PUBLIC.LOGIN);
                    }
                }
            } catch (error) {
                console.error('Error verificando sesión:', error);
                clearAuth();

                // En caso de error, redirigir según sea necesario
                if (requireAuth) {
                    router.push(APP_ROUTES.PUBLIC.LOGIN);
                }
            }
        };

        checkAndRedirect();
    }, [router, requireAuth, redirectTo, setAuthData, clearAuth]);
}