// src/constants/api-routes.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// Validar configuración
if (!process.env.NEXT_PUBLIC_API_BASE_URL && typeof window !== 'undefined') {
    console.warn('⚠️ NEXT_PUBLIC_API_BASE_URL no configurado');
}

/**
 * Solo endpoints de autenticación por ahora
 */
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
    RECOVER_PASSWORD: `${API_BASE_URL}/auth/recover-password`,
    CHECK_SESSION: `${API_BASE_URL}/auth/check-session`,
} as const;

// Exportar URL base si se necesita
export { API_BASE_URL };