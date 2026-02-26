// hooks/perfil/useGetCurrentUser.ts
import { useState, useEffect } from 'react';

export interface BackendUserData {
    id: number;
    email: string;
    name_user: string;
    terms: boolean;
    is_profile_completed: boolean;
    status: boolean;
    created_at: string;
    updated_at: string;
    telephone: string;
    city: string;
    sport: string;
    edad: number;
    fechanacimiento: string;
    position: string;
    biography: string;
    urlphotoperfil: string;
    role: string;
    // ✅ Nueva estructura cuando el backend la envíe (como en canchas)
    imagen_perfil_webp?: {
        id: number;
        url_webp: string;
        nombre: string;
        formato: string;
    };
    // URL procesada para uso directo
    urlphotoperfil_completa?: string;
}

interface UseGetCurrentUserReturn {
    userData: BackendUserData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useGetCurrentUser(): UseGetCurrentUserReturn {
    const [userData, setUserData] = useState<BackendUserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/player/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener el usuario`);
            }

            const data = await response.json();

            let userData: BackendUserData;

            if (data && data.id) {
                userData = data;
            } else if (data.user) {
                userData = data.user;
            } else {
                throw new Error('Estructura de datos incorrecta del servidor');
            }

            // ✅ Procesar la URL de la imagen (soporta ambos formatos)
            let urlphotoperfil_completa = '';

            // Nuevo formato (igual que canchas)
            if (userData.imagen_perfil_webp && userData.imagen_perfil_webp.url_webp) {
                const url = userData.imagen_perfil_webp.url_webp;

                if (!url.startsWith('http')) {
                    const path = url.startsWith('/') ? url : `/${url}`;
                    urlphotoperfil_completa = `${API_BASE_URL}${path}`;
                } else {
                    urlphotoperfil_completa = url;
                }

            }
            // Formato anterior (fallback por compatibilidad)
            else if (userData.urlphotoperfil && userData.urlphotoperfil.trim() !== '') {
                if (userData.urlphotoperfil.startsWith('http')) {
                    urlphotoperfil_completa = userData.urlphotoperfil;
                } else {
                    const path = userData.urlphotoperfil.startsWith('/')
                        ? userData.urlphotoperfil
                        : `/${userData.urlphotoperfil}`;
                    urlphotoperfil_completa = `${API_BASE_URL}${path}`;
                }

            }

            // Agregar la URL completa al objeto
            const userDataProcesado: BackendUserData = {
                ...userData,
                urlphotoperfil_completa
            };


            setUserData(userDataProcesado);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener datos del usuario';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return {
        userData,
        isLoading,
        error,
        refetch: fetchUserData,
    };
}