// hooks/settings/useChangePassword.ts
import { useState } from 'react';

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface UseChangePasswordReturn {
    changePassword: (data: ChangePasswordData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    resetState: () => void;
}

export function useChangePassword(): UseChangePasswordReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const changePassword = async (data: ChangePasswordData) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            // Validaciones básicas
            if (data.newPassword !== data.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            if (data.newPassword.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/account/cambiar-contrasena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    current_password: data.currentPassword,
                    new_password: data.newPassword,
                    confirm_password: data.confirmPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    `Error ${response.status}: No se pudo cambiar la contraseña`
                );
            }

            setSuccess(true);

        } catch (err) {
            console.error('💥 [useChangePassword] Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
            setError(errorMessage);
            throw err; // Re-lanzar el error para manejo en el componente
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
    };

    return {
        changePassword,
        isLoading,
        error,
        success,
        resetState,
    };
}