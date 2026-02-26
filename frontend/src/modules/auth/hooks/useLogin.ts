// hooks/auth/useLogin.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@shared/store/useAuthStore';
import { useToast } from '@shared/hooks/useToast';
import { authService } from '@auth/services/auth-service';
import { APP_ROUTES } from '@shared/constants';

interface LoginCredentials {
    email: string;
    password: string;
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const toast = useToast();
    const setAuthData = useAuthStore((state) => state.setAuthData);

    const login = async (credentials: LoginCredentials) => {
        console.log('🚀 [useLogin] Iniciando proceso de login para:', credentials.email);
        setIsLoading(true);
        setError(null);

        try {
            console.log('📡 [useLogin] Llamando a authService.login...');
            const result = await authService.login(credentials);
            console.log('✅ [useLogin] Respuesta de authService:', result);

            if (!result.success) {
                console.warn('❌ [useLogin] Login fallido:', result.message);
                setError(result.message || 'Error en el inicio de sesión');

                // Toast de error
                toast.error({
                    title: 'Error de inicio de sesión',
                    text: result.message || 'Credenciales incorrectas',
                    position: 'top-end',
                });

                return {
                    success: false,
                    error: result.message,
                    message: result.message,
                };
            }

            console.log('✨ [useLogin] Login exitoso, procesando datos del usuario...');

            // Guardar datos en el store
            if (result.user) {
                console.log('💾 [useLogin] Guardando datos en AuthStore:', result.user);
                setAuthData({
                    name_user: result.user.name_user,
                    email: result.user.email,
                    fotoPerfil: result.user.fotoPerfil || null,
                });
            } else {
                console.warn('⚠️ [useLogin] Login exitoso pero no se recibió objeto de usuario');
            }

            // Redireccionar a HOME
            console.log('🔗 [useLogin] Redirigiendo a:', APP_ROUTES.PROTECTED.HOME);
            router.push(APP_ROUTES.PROTECTED.HOME);

            // Toast de éxito después de un breve delay
            setTimeout(() => {
                toast.success({
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    position: 'top-end',
                    timer: 3000,
                });
            }, 300);

            return {
                success: true,
                user: result.user,
                token: result.token,
                message: 'Inicio de sesión exitoso',
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error del servidor';
            console.error('🔥 [useLogin] Error catastrófico en login:', err);
            setError(errorMessage);

            toast.error({
                title: 'Error',
                text: errorMessage,
                position: 'top-end',
            });

            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        login,
    };
}