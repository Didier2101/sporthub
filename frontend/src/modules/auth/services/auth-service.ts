// src/services/auth-service.ts

import { AUTH_ENDPOINTS } from '@shared/constants/api-routes';

interface User {
    id: number;
    email: string;
    name_user: string;
    fotoPerfil?: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterPayload {
    name_user: string;
    email: string;
    password: string;
    fechanacimiento: string;
}

interface VerificationPayload {
    email: string;
    verification_code: string;
}

interface RecoverPasswordPayload {
    email: string;
}

interface CheckSessionResponse {
    authenticated: boolean;
    user?: {
        id: number;
        email: string;
        name_user: string;
        username?: string;
        fotoPerfil?: string | null;
    };
    message?: string;
}

// Servicio solo con login y register
export const authService = {
    /**
     * Login de usuario
     */
    async login(credentials: LoginCredentials): Promise<{
        success: boolean;
        user?: User;
        token?: string;
        message?: string;
    }> {
        console.log('🌐 [authService] POST a:', AUTH_ENDPOINTS.LOGIN);

        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include', // Para cookies/session
            });

            console.log('📡 [authService] Status HTTP:', response.status);
            const data = await response.json();
            console.log('📦 [authService] Datos recibidos del backend:', data);

            if (!response.ok) {
                console.warn('⚠️ [authService] Respuesta no exitosa (ok: false):', data);
                return {
                    success: false,
                    message: data.message || 'Error en el inicio de sesión',
                };
            }

            return {
                success: true,
                user: data.user,
                token: data.token,
                message: data.message,
            };
        } catch (error) {
            console.error('📛 [authService] Error de red en fetch:', error);
            return {
                success: false,
                message: 'Error de conexión con el servidor',
            };
        }
    },

    /**
     * Registro de usuario
     */
    async register(payload: RegisterPayload): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Error en el registro',
            };
        }

        return {
            success: true,
            message: data.message,
        };
    },

    /**
     * Verificar email con código
     */
    async verifyEmail(payload: VerificationPayload): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await fetch(AUTH_ENDPOINTS.VERIFY_EMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Error al verificar email',
            };
        }

        return {
            success: true,
            message: data.message,
        };
    },

    /**
     * Reenviar código de verificación
     */
    async resendVerification(email: string): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await fetch(AUTH_ENDPOINTS.RESEND_VERIFICATION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Error al reenviar verificación',
            };
        }

        return {
            success: true,
            message: data.message,
        };
    },

    /**
     * Recuperar contraseña
     */
    async recoverPassword(payload: RecoverPasswordPayload): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await fetch(AUTH_ENDPOINTS.RECOVER_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Error al solicitar recuperación',
            };
        }

        return {
            success: true,
            message: data.message,
        };
    },

    /**
     * Verificar sesión del usuario
     */
    async checkSession(): Promise<{
        success: boolean;
        authenticated?: boolean;
        user?: CheckSessionResponse['user']; // Cambiado de 'any' a tipo específico
        message?: string;
    }> {
        try {
            const response = await fetch(AUTH_ENDPOINTS.CHECK_SESSION, {
                method: 'GET',
                credentials: 'include',
            });

            const data: CheckSessionResponse = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Error al verificar sesión',
                };
            }

            return {
                success: true,
                authenticated: data.authenticated,
                user: data.user,
                message: data.message,
            };
        } catch (err) {
            // Cambiado 'error' por 'err' y agregado log
            console.error('Error al verificar sesión:', err);
            return {
                success: false,
                message: 'Error de conexión al verificar sesión',
            };
        }
    },
};