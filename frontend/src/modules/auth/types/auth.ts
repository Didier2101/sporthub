// types/auth.ts
// ✅ Importar User desde user.ts en lugar de redefinirlo
import { User } from './user';

export interface AuthResponse {
    message: string;
    user?: User;  // ✅ Usar el User completo de user.ts
    access_token?: string;
    token_type?: string;
}

export interface ErrorResponse {
    message?: string;
    error?: string;
    errors?: string[];
}

// ✅ Si necesitas un tipo específico para respuestas de login/registro
export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

// ✅ Tipos para credenciales
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name_user: string;
    email: string;
    password: string;
    password_confirmation: string;
}