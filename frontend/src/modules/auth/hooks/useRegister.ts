// hooks/auth/useRegister.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showVerificationCodeModal } from '@auth/components/VerificationCodeModal';
import { useToast } from '@shared/hooks/useToast';
import { authService } from '@auth/services/auth-service';
import { APP_ROUTES } from '@shared/constants';


export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    const register = async (payload: {
        name_user: string;
        email: string;
        password: string;
        fechanacimiento: string
    }) => {
        setIsLoading(true);

        try {
            const result = await authService.register(payload);

            if (!result.success) {
                toast.error({
                    title: 'Error en el registro',
                    text: result.message || 'Error al registrar usuario',
                    position: 'top-end',
                });

                return {
                    success: false,
                    error: result.message || 'Error al registrar usuario',
                };
            }

            // Mostrar modal de verificación
            await showVerificationCodeModal({
                email: payload.email,
                onVerify: (code) => handleVerifyCode(payload.email, code),
                onResend: (email) => resendVerification(email)
            });

            return { success: true };

        } catch (err) {
            // Cambiado 'error' por 'err' y agregado log
            console.error('Error en el registro:', err);

            toast.error({
                title: 'Error de conexión',
                text: 'Error de conexión. Intenta nuevamente.',
                position: 'top-end',
            });

            return {
                success: false,
                error: 'Error de conexión. Intenta nuevamente.',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (email: string, code: string): Promise<boolean> => {
        // Mostrar loading
        toast.info({
            title: 'Verificando...',
            text: 'Validando código de verificación',
            position: 'top-end',
            timer: 5000,
        });

        const result = await authService.verifyEmail({ email, verification_code: code });

        if (result.success) {
            toast.success({
                title: '¡Cuenta verificada!',
                text: 'Tu cuenta ha sido creada exitosamente',
                position: 'top-end',
                timer: 3000,
            });

            // Redirigir al login después de un breve delay
            setTimeout(() => {
                router.push(APP_ROUTES.PUBLIC.LOGIN);
            }, 1000);

            return true;
        } else {
            toast.error({
                title: 'Código inválido',
                text: result.message || 'El código que ingresaste no es correcto',
                position: 'top-end',
            });

            // Opción para intentar de nuevo
            return false;
        }
    };

    const resendVerification = async (email: string): Promise<boolean> => {
        try {
            const result = await authService.resendVerification(email);

            if (!result.success) {
                toast.error({
                    title: 'Error',
                    text: result.message || 'No pudimos reenviar el código',
                    position: 'top-end',
                });
                return false;
            }

            toast.success({
                title: '¡Código enviado!',
                text: 'Revisa tu bandeja de entrada',
                position: 'top-end',
                timer: 2000,
            });

            return true;
        } catch (err) {
            // Agregado log para usar la variable
            console.error('Error al reenviar verificación:', err);

            toast.error({
                title: 'Error',
                text: 'No pudimos reenviar el código',
                position: 'top-end',
            });
            return false;
        }
    };

    return {
        isLoading,
        register,
        verifyEmail: authService.verifyEmail,
        resendVerification,
    };
};