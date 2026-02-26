// hooks/useToast.ts
import Swal from 'sweetalert2';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    title?: string;
    text?: string;
    timer?: number;
    position?: 'top-end' | 'top' | 'top-start' | 'center' | 'bottom-end' | 'bottom' | 'bottom-start';
}

export function useToast() {
    const showToast = (type: ToastType, options: ToastOptions) => {
        const config = {
            toast: true,
            position: options.position || 'top-end',
            showConfirmButton: false,
            timer: options.timer || 3000,
            timerProgressBar: true,
            didOpen: (toast: HTMLElement) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        };

        // Configuración por tipo
        switch (type) {
            case 'success':
                Object.assign(config, {
                    background: '#10b981',
                    color: '#ffffff',
                    iconColor: '#ffffff',
                    customClass: {
                        popup: 'border-l-4 border-green-700'
                    }
                });
                break;
            case 'error':
                Object.assign(config, {
                    background: '#ef4444',
                    color: '#ffffff',
                    iconColor: '#ffffff',
                    customClass: {
                        popup: 'border-l-4 border-red-700'
                    }
                });
                break;
            case 'warning':
                Object.assign(config, {
                    background: '#f59e0b',
                    color: '#ffffff',
                    iconColor: '#ffffff',
                    customClass: {
                        popup: 'border-l-4 border-yellow-700'
                    }
                });
                break;
            case 'info':
                Object.assign(config, {
                    background: '#3b82f6',
                    color: '#ffffff',
                    iconColor: '#ffffff',
                    customClass: {
                        popup: 'border-l-4 border-blue-700'
                    }
                });
                break;
        }

        const Toast = Swal.mixin(config);

        Toast.fire({
            icon: type,
            title: options.title,
            text: options.text,
        });
    };

    return {
        success: (options: ToastOptions) => showToast('success', options),
        error: (options: ToastOptions) => showToast('error', options),
        warning: (options: ToastOptions) => showToast('warning', options),
        info: (options: ToastOptions) => showToast('info', options),
    };
}