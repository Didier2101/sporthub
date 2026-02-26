'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { useLogout } from '@/src/hooks/auth/useLogout';

interface LogoutButtonProps {
    className?: string;
    variant?: 'sidebar' | 'header';
}

export default function LogoutButton({
    className = '',
    variant = 'sidebar'
}: LogoutButtonProps) {
    const router = useRouter();
    const { logout, isLoading: isLoggingOut } = useLogout();
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que quieres salir de tu cuenta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a', // green-600
            cancelButtonColor: '#6b7280', // gray-500
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        const logoutResult = await logout();

        if (logoutResult.success) {
            await Swal.fire({
                icon: 'success',
                title: '¡Hasta pronto!',
                text: 'Sesión cerrada correctamente',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            // Redirigir a login
            router.push('/');
            router.refresh();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al cerrar sesión',
                text: logoutResult.error || 'Inténtalo de nuevo',
                confirmButtonColor: '#16a34a',
            });
        }
    };

    // Variante para sidebar
    if (variant === 'sidebar') {
        return (
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isLoggingOut
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    } ${className}`}
            >
                <div className="flex items-center gap-3">
                    {isLoggingOut ? (
                        <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                        <LogOut className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} />
                    )}
                    <span className="font-medium text-sm">
                        {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
                    </span>
                </div>
                <span className={`text-xs transition-all duration-200 ${isHovered ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                    →
                </span>
            </button>
        );
    }

    // Variante para header (más compacta)
    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isLoggingOut
                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500'
                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                } ${className}`}
        >
            {isLoggingOut ? (
                <>
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    <span>Saliendo...</span>
                </>
            ) : (
                <>
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                </>
            )}
        </button>
    );
}