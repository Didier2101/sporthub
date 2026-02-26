// components/VerificationCodeModal.tsx
'use client';

import Swal from 'sweetalert2';

interface VerificationCodeModalProps {
    email: string;
    onVerify: (code: string) => Promise<boolean>;
    onResend: (email: string) => Promise<boolean>;
}

export const showVerificationCodeModal = async ({
    email,
    onVerify,
    onResend
}: VerificationCodeModalProps): Promise<void> => {
    const { value: code } = await Swal.fire({
        title: '📧 Verifica tu correo',
        html: `
      <div class="text-left space-y-4">
        <p class="text-gray-700 text-sm">
          Hemos enviado un código de verificación de <strong>6 dígitos</strong> a:
        </p>
        <p class="font-semibold text-green-600 text-center py-2 bg-green-50 rounded-lg">
          ${email}
        </p>
        <p class="text-sm text-gray-600">
          Por favor, revisa tu bandeja de entrada e ingresa el código a continuación:
        </p>
        <p class="text-xs text-gray-500 mt-3">
          Si no recibes el correo en 2-3 minutos, revisa tu carpeta de spam.
        </p>
      </div>
    `,
        input: 'text',
        inputPlaceholder: 'Ingresa el código de 6 dígitos',
        inputAttributes: {
            maxlength: '6',
            autocomplete: 'off',
            inputmode: 'numeric',
            pattern: '[0-9]*'
        },
        showCancelButton: true,
        confirmButtonText: 'Verificar código',
        cancelButtonText: 'Reenviar código',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor ingresa el código';
            }
            if (!/^\d{6}$/.test(value)) {
                return 'El código debe tener 6 dígitos';
            }
            return null;
        },
        customClass: {
            input: 'text-center text-2xl tracking-widest font-mono'
        }
    });

    if (code) {
        await onVerify(code);
    } else {
        const result = await Swal.fire({
            title: '¿Reenviar código?',
            text: 'Te enviaremos un nuevo código de verificación',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, reenviar',
            cancelButtonText: 'No, volver',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            await onResend(email);
            showVerificationCodeModal({ email, onVerify, onResend });
        } else {
            showVerificationCodeModal({ email, onVerify, onResend });
        }
    }
};