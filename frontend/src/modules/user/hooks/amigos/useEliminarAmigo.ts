'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

interface UseEliminarAmigoReturn {
    eliminarAmigo: (userId: number, nombreAmigo: string) => Promise<boolean>;
    isLoading: boolean;
}

export function useEliminarAmigo(): UseEliminarAmigoReturn {
    const [isLoading, setIsLoading] = useState(false);

    const eliminarAmigoBackend = async (userId: number): Promise<void> => {
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
    };

    const eliminarAmigo = async (userId: number, nombreAmigo: string): Promise<boolean> => {
        setIsLoading(true);

        try {
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
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    return await eliminarAmigoBackend(userId);
                },
                allowOutsideClick: () => !Swal.isLoading()
            });

            if (resultado.isConfirmed) {
                await Swal.fire({
                    title: '¡Eliminado!',
                    text: `${nombreAmigo} ha sido eliminado de tu lista de amigos`,
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                return true;
            }

            return false;

        } catch (err) {
            console.error('💥 Error al eliminar amigo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar amigo';

            await Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#dc2626',
            });

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        eliminarAmigo,
        isLoading,
    };
}