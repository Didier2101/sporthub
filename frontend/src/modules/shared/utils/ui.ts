import Swal from 'sweetalert2';

export const ALERT_CONFIG = {
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    customClass: {
        popup: 'rounded-2xl border-none shadow-xl',
        confirmButton: 'px-6 py-2.5 rounded-xl font-medium focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all',
        cancelButton: 'px-6 py-2.5 rounded-xl font-medium focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all',
    }
};

export const ui = {
    confirm: async (title: string, text: string, icon: 'warning' | 'info' = 'warning') => {
        return Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            ...ALERT_CONFIG
        });
    },

    success: (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            ...ALERT_CONFIG
        });
    },

    error: (title: string, text: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            ...ALERT_CONFIG
        });
    },

    loading: (title: string) => {
        Swal.fire({
            title,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            ...ALERT_CONFIG
        });
    },

    close: () => Swal.close()
};
