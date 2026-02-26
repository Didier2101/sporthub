'use client';

import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

export interface Amigo {
    id: number; // ID del usuario
    name_user: string;
    slug: string;
    imagenes_webp: Array<{
        id: number;
        orden: number;
        url_webp: string;
        nombre: string;
        formato: string;
    }>;
    friendship_id: number; // ID de la relación de amistad
    friendship_since: string;
    urlphotoperfil_completa?: string;
}

// Interfaz para los datos que vienen del servidor (antes de procesar)
interface AmigoRaw {
    id: number;
    name_user: string;
    slug: string;
    imagenes_webp?: Array<{
        id: number;
        orden?: number;
        url_webp: string;
        nombre: string;
        formato: string;
    }>;
    friendship_id: number;
    friendship_since: string;
}

interface UseFriendsListReturn {
    amigos: Amigo[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    eliminarAmigo: (userId: number, friendshipId: number, nombreAmigo: string) => Promise<boolean>;
}

export function useFriendsList(): UseFriendsListReturn {
    const [amigos, setAmigos] = useState<Amigo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAmigos = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/friends/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener la lista de amigos`);
            }

            const result = await response.json();

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error('Respuesta inválida del servidor');
            }

            // Procesar las URLs de las imágenes
            const amigosProcesados = result.data.map((amigo: AmigoRaw) => {
                let urlphotoperfil_completa = '';

                if (amigo.imagenes_webp && amigo.imagenes_webp.length > 0) {
                    const imagenOrdenada = [...amigo.imagenes_webp].sort((a, b) => (a.orden || 0) - (b.orden || 0))[0];

                    if (imagenOrdenada && imagenOrdenada.url_webp) {
                        const url = imagenOrdenada.url_webp;
                        if (!url.startsWith('http')) {
                            const path = url.startsWith('/') ? url : `/${url}`;
                            urlphotoperfil_completa = `${API_BASE_URL}${path}`;
                        } else {
                            urlphotoperfil_completa = url;
                        }
                    }
                }

                return {
                    ...amigo,
                    urlphotoperfil_completa
                };
            });

            setAmigos(amigosProcesados);

        } catch (err) {
            console.error('💥 Error al obtener amigos:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener la lista de amigos';
            setError(errorMessage);
            setAmigos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

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

        // Actualizar la lista eliminando el amigo
        setAmigos(prevAmigos => prevAmigos.filter(amigo => amigo.id !== userId));
    };

    const eliminarAmigo = async (userId: number, friendshipId: number, nombreAmigo: string): Promise<boolean> => {
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
    };

    useEffect(() => {
        fetchAmigos();
    }, [fetchAmigos]);

    return {
        amigos,
        isLoading,
        error,
        refetch: fetchAmigos,
        eliminarAmigo,
    };
}