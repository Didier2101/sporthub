'use client';

import { useState } from 'react';
import { UserX, Loader2, Check } from 'lucide-react';
import Swal from 'sweetalert2';

interface BotonEliminarAmigoProps {
    userId: number;
    nombreAmigo: string;
}

export default function BotonEliminarAmigo({ userId, nombreAmigo }: BotonEliminarAmigoProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [eliminado, setEliminado] = useState(false);

    const eliminarAmigo = async () => {
        // Mostrar confirmación con SweetAlert2
        const resultado = await Swal.fire({
            title: '¿Eliminar amigo?',
            html: `<p>¿Estás seguro de que quieres eliminar a <strong>${nombreAmigo}</strong> de tu lista de amigos?</p>
                  <p class="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        });

        if (!resultado.isConfirmed) {
            return;
        }

        setIsLoading(true);

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🗑️ Eliminando amigo - userId:', userId);
            console.log('📤 Endpoint:', `${API_BASE_URL}/friends/delete/${userId}`);

            const response = await fetch(`${API_BASE_URL}/friends/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const result = await response.json();
            console.log('📨 Respuesta de eliminación:', result);

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: No se pudo eliminar el amigo`);
            }

            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            // Éxito
            setEliminado(true);

            // Mostrar mensaje de éxito
            await Swal.fire({
                title: '¡Eliminado!',
                text: `${nombreAmigo} ha sido eliminado de tu lista de amigos`,
                icon: 'success',
                confirmButtonColor: '#10b981',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });

            // Recargar la página después de un tiempo para actualizar el estado
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error('💥 Error al eliminar amigo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar amigo';

            await Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#dc2626',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (eliminado) {
        return (
            <div className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-green-500 text-white">
                <Check className="w-4 h-4" />
                <span className="text-sm font-semibold">¡Eliminado!</span>
            </div>
        );
    }

    return (
        <button
            onClick={eliminarAmigo}
            disabled={isLoading}
            className={`
                flex items-center justify-center space-x-2 
                px-6 py-3 rounded-full font-semibold text-sm
                transition-all duration-200 transform
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95
            `}
            title="Eliminar de mis amigos"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <UserX className="w-4 h-4" />
            )}
            <span className="whitespace-nowrap">
                {isLoading ? 'Eliminando...' : 'Eliminar amigo'}
            </span>
        </button>
    );
}