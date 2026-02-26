// hooks/auth/useRecoverPassword.ts
import { useState } from 'react';
import { useToast } from '@shared/hooks/useToast';
import { authService } from '@auth/services/auth-service';

interface RecoverPasswordPayload {
    email: string;
}

interface RecoverPasswordResult {
    success: boolean;
    error?: string;
}

export const useRecoverPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useToast();

    const recoverPassword = async (payload: RecoverPasswordPayload): Promise<RecoverPasswordResult> => {
        setIsLoading(true);

        try {
            const result = await authService.recoverPassword(payload);

            if (!result.success) {
                toast.error({
                    title: 'Error',
                    text: result.message || 'No se pudo enviar el correo',
                    position: 'top-end',
                });

                return {
                    success: false,
                    error: result.message || 'No se pudo enviar el correo',
                };
            }

            toast.success({
                title: 'Correo enviado',
                text: 'Revisa tu bandeja de entrada para continuar con la recuperación',
                position: 'top-end',
                timer: 3000,
            });

            setSuccess(true);

            return { success: true };

        } catch (err) {
            // Cambiado 'error' por 'err' y agregado log para usar la variable
            console.error('Error al recuperar contraseña:', err);

            toast.error({
                title: 'Error de conexión',
                text: 'Intenta nuevamente más tarde',
                position: 'top-end',
            });

            return {
                success: false,
                error: 'Error de conexión. Intenta nuevamente más tarde.',
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        success,
        recoverPassword,
        resetSuccess: () => setSuccess(false),
    };
};