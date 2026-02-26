'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PerfilUsuario {
    id: number;
    name_user: string;
    slug: string;
    email: string;
    edad?: number;
    fechanacimiento?: string;
    telephone?: string;
    city?: string;
    sport?: string;
    position?: string;
    biography?: string;
    role: string;
    status: string;
    terms: boolean;
    is_profile_completed: boolean;
    created_at: string;
    updated_at: string;
    imagenes_webp: Array<{
        id: number;
        orden?: number;
        url_webp: string;
        nombre: string;
        formato: string;
    }>;
    urlphotoperfil?: string;
    urlphotoperfil_completa?: string;
    estadisticas?: {
        partidos_jugados: number;
        partidos_ganados: number;
        valoracion_promedio: number;
    };
    partidos_jugados?: number;
    partidos_ganados?: number;
    valoracion_promedio?: number;
}

interface UseGetPerfilUsuarioReturn {
    perfil: PerfilUsuario | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Type for the raw user data from API
interface RawUserData {
    id: number;
    name_user: string;
    slug: string;
    email: string;
    edad?: number;
    fechanacimiento?: string;
    telephone?: string;
    city?: string;
    sport?: string;
    position?: string;
    biography?: string;
    role: string;
    status: string;
    terms: boolean;
    is_profile_completed: boolean;
    created_at: string;
    updated_at: string;
    imagenes_webp?: Array<{
        id: number;
        orden?: number;
        url_webp: string;
        nombre: string;
        formato: string;
    }>;
    urlphotoperfil?: string;
    estadisticas?: {
        partidos_jugados: number;
        partidos_ganados: number;
        valoracion_promedio: number;
    };
    partidos_jugados?: number;
    partidos_ganados?: number;
    valoracion_promedio?: number;
}

export function useGetPerfilUsuario(slug: string): UseGetPerfilUsuarioReturn {
    const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPerfil = useCallback(async () => {
        // No hacer fetch si no hay slug
        if (!slug || slug.trim() === '') {
            setIsLoading(false);
            setError('Slug no proporcionado');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🔍 Buscando perfil con slug:', slug);
            console.log('📡 URL:', `${API_BASE_URL}/users/slug/${slug}`);

            const response = await fetch(`${API_BASE_URL}/users/slug/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            console.log('📨 Status de respuesta:', response.status);

            // Si no se encuentra por slug, intentar por ID (solo si el slug es numérico)
            if (response.status === 404) {
                const possibleId = parseInt(slug);
                if (!isNaN(possibleId)) {
                    console.log('🔄 Intento fallido por slug, intentando por ID:', possibleId);
                    const idResponse = await fetch(`${API_BASE_URL}/users/${possibleId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (idResponse.ok) {
                        const result = await idResponse.json();
                        console.log('✅ Respuesta por ID:', result);

                        if (result.success && result.data) {
                            const processedData = processUserData(result.data, API_BASE_URL);
                            setPerfil(processedData);
                            return;
                        }
                    }
                }
                throw new Error(`Usuario "${slug}" no encontrado`);
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error en respuesta:', errorText);
                throw new Error(`Error ${response.status}: No se pudo obtener el perfil`);
            }

            const result = await response.json();
            console.log('✅ Respuesta del servidor:', result);

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Respuesta inválida del servidor');
            }

            const processedData = processUserData(result.data, API_BASE_URL);
            setPerfil(processedData);

        } catch (err) {
            console.error('💥 Error completo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener el perfil del usuario';
            setError(errorMessage);
            setPerfil(null);
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    // Función auxiliar para procesar datos del usuario
    const processUserData = (userData: RawUserData, apiBaseUrl: string): PerfilUsuario => {
        console.log('🔄 Procesando datos del usuario:', userData);

        // Procesar la URL de la imagen de perfil
        let urlphotoperfil_completa = '';

        // Primero intentar con urlphotoperfil del backend
        if (userData.urlphotoperfil) {
            const url = userData.urlphotoperfil;
            if (!url.startsWith('http')) {
                const path = url.startsWith('/') ? url : `/${url}`;
                urlphotoperfil_completa = `${apiBaseUrl}${path}`;
            } else {
                urlphotoperfil_completa = url;
            }
            console.log('🖼️ URL de perfil desde urlphotoperfil:', urlphotoperfil_completa);
        }
        // Si no hay urlphotoperfil, intentar con imagenes_webp
        else if (userData.imagenes_webp && userData.imagenes_webp.length > 0) {
            // Ordenar por orden si está disponible
            const imagenesOrdenadas = [...userData.imagenes_webp].sort((a, b) => (a.orden || 0) - (b.orden || 0));
            const primeraImagen = imagenesOrdenadas[0];

            if (primeraImagen && primeraImagen.url_webp) {
                const url = primeraImagen.url_webp;
                if (!url.startsWith('http')) {
                    const path = url.startsWith('/') ? url : `/${url}`;
                    urlphotoperfil_completa = `${apiBaseUrl}${path}`;
                } else {
                    urlphotoperfil_completa = url;
                }
                console.log('🖼️ URL de perfil desde imagenes_webp:', urlphotoperfil_completa);
            }
        }

        // Si no se encontró ninguna imagen
        if (!urlphotoperfil_completa) {
            console.log('⚠️ No se encontró imagen de perfil');
        }

        // Crear estadísticas si no existen (puedes adaptar esto según tu backend)
        const estadisticas = userData.estadisticas || {
            partidos_jugados: userData.partidos_jugados || 0,
            partidos_ganados: userData.partidos_ganados || 0,
            valoracion_promedio: userData.valoracion_promedio || 0,
        };

        const perfilProcesado: PerfilUsuario = {
            ...userData,
            imagenes_webp: userData.imagenes_webp || [],
            // Asegurarnos de que urlphotoperfil_completa esté en el objeto
            urlphotoperfil_completa,
            estadisticas,
        };

        console.log('📋 Perfil procesado final:', perfilProcesado);
        return perfilProcesado;
    };

    useEffect(() => {
        fetchPerfil();
    }, [fetchPerfil]);

    return {
        perfil,
        isLoading,
        error,
        refetch: fetchPerfil,
    };
}