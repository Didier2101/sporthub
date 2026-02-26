// hooks/canchas/useGetCanchas.ts
import { useEffect, useState, useCallback } from 'react';
import {
    Cancha,
    HorarioCancha,
    ReglaCancha,
    AmenidadCancha,
    ImagenAccesible
} from '@canchas/types/Cancha';

interface ApiResponse {
    success: boolean;
    data: Cancha[];
    count: number;
    formato_imagenes: string;
}

interface UseGetCanchasReturn {
    isLoading: boolean;
    error: string | null;
    canchas: Cancha[];
    fetchCanchas: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useGetCanchas(): UseGetCanchasReturn {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCanchas = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/cancha/list`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener las canchas`);
            }

            const result: ApiResponse = await response.json();

            if (!result.success || !result.data) {
                throw new Error('Respuesta inválida del servidor');
            }

            // Procesar las canchas para convertir las URLs y mantener consistencia con los types
            const canchasProcesadas: Cancha[] = result.data.map(canchaData => {
                // Procesar imágenes
                const imagenes_accesibles: ImagenAccesible[] = canchaData.imagenes_webp?.map(img => ({
                    id: img.id,
                    orden: img.orden,
                    url: `${API_BASE_URL}${img.url_webp}` // URL completa
                })) || [];

                // Procesar horarios con id
                const horarios: HorarioCancha[] = canchaData.horarios?.map(h => ({
                    id: h.id,
                    dia_semana: h.dia_semana,
                    hora_inicio: h.hora_inicio,
                    hora_fin: h.hora_fin,
                    intervalo_minutos: h.intervalo_minutos,
                    disponible: h.disponible
                })) || [];

                // Procesar reglas con id
                const reglas: ReglaCancha[] = canchaData.reglas?.map(r => ({
                    id: r.id,
                    regla: r.regla
                })) || [];

                // Procesar amenidades con id
                const amenidades: AmenidadCancha[] = canchaData.amenidades?.map(a => ({
                    id: a.id,
                    amenidad: a.amenidad
                })) || [];

                return {
                    ...canchaData,
                    imagenes_accesibles,
                    horarios,
                    reglas,
                    amenidades
                };
            });

            setCanchas(canchasProcesadas);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener las canchas';
            setError(errorMessage);
            setCanchas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetch = useCallback(async () => {
        await fetchCanchas();
    }, [fetchCanchas]);

    useEffect(() => {
        fetchCanchas();
    }, [fetchCanchas]);

    return {
        isLoading,
        error,
        canchas,
        fetchCanchas: refetch,
        refetch
    };
}