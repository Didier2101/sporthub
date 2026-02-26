// hooks/settings/useChangeEmail.ts
import { useState } from 'react';

interface ChangeEmailData {
    password: string;
    new_email: string;
    confirm_email: string;
}

interface UseChangeEmailReturn {
    changeEmail: (data: ChangeEmailData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    resetState: () => void;
}

export function useChangeEmail(): UseChangeEmailReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const changeEmail = async (data: ChangeEmailData) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            // Validaciones
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.new_email)) {
                throw new Error('Por favor ingresa un email válido');
            }

            if (data.new_email !== data.confirm_email) {
                throw new Error('Los emails no coinciden');
            }

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/account/cambiar-correo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    `Error ${response.status}: No se pudo cambiar el email`
                );
            }

            setSuccess(true);

        } catch (err) {
            console.error('💥 [useChangeEmail] Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el email';
            setError(errorMessage);
            throw err;
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
        changeEmail,
        isLoading,
        error,
        success,
        resetState,
    };
}