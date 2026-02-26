'use client';

import { useState, useCallback } from 'react';

export interface UserSearchResult {
    id: number;
    name_user: string;
    slug: string;
    imagenes_webp: Array<{
        id: number;
        orden: number;
        url_webp: string;
        nombre: string;
        formato: string;
    }>;
    // URL procesada para uso directo
    urlphotoperfil_completa?: string;
}

interface ApiResponse {
    success: boolean;
    data: UserSearchResult[];
    count: number;
    busqueda: string | null;
}

interface UseSearchUsersReturn {
    isLoading: boolean;
    error: string | null;
    users: UserSearchResult[];
    searchUsers: (query: string) => Promise<UserSearchResult[]>;
}

export function useSearchUsers(): UseSearchUsersReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserSearchResult[]>([]);

    const searchUsers = useCallback(async (query: string): Promise<UserSearchResult[]> => {
        if (!query.trim()) {
            setUsers([]);
            return [];
        }

        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            // ✅ CORREGIDO: Usar /users/buscar en lugar de /users/search
            const response = await fetch(`${API_BASE_URL}/users/buscar?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudieron buscar usuarios`);
            }

            const result: ApiResponse = await response.json();

            if (!result.success || !result.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            console.log('Respuesta de búsqueda de usuarios:', result.data);

            // Procesar las URLs de las imágenes de cada usuario
            const usuariosProcesados: UserSearchResult[] = result.data.map(user => {
                let urlphotoperfil_completa = '';

                // Procesar la primera imagen webp disponible
                if (user.imagenes_webp && user.imagenes_webp.length > 0 && user.imagenes_webp[0].url_webp) {
                    const url = user.imagenes_webp[0].url_webp;

                    if (!url.startsWith('http')) {
                        const path = url.startsWith('/') ? url : `/${url}`;
                        urlphotoperfil_completa = `${API_BASE_URL}${path}`;
                    } else {
                        urlphotoperfil_completa = url;
                    }
                }

                return {
                    ...user,
                    urlphotoperfil_completa
                };
            });

            setUsers(usuariosProcesados);
            return usuariosProcesados;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al buscar usuarios';
            setError(errorMessage);
            setUsers([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        users,
        searchUsers,
    };
}