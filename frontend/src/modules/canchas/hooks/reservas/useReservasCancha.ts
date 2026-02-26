// hooks/canchas/reservas/useReservasCancha.ts
import { useState, useCallback } from 'react';

interface UseReservasCanchaReturn {
    horasOcupadas: string[];
    isLoading: boolean;
    error: string | null;
    fetchReservas: (canchaId: number, fecha: string) => Promise<void>;
}

export function useReservasCancha(): UseReservasCanchaReturn {
    const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservas = useCallback(async (canchaId: number, fecha: string) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('📅 [useReservasCancha] Obteniendo reservas para:', { canchaId, fecha });

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(
                `${API_BASE_URL}/reserva/ocupados/${canchaId}/${fecha}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Error ${response.status}: No se pudieron obtener las reservas`
                );
            }

            const result = await response.json();
            console.log('📦 [useReservasCancha] Respuesta completa del servidor:', result);

            // El servidor devuelve directamente un array de horas en formato: { horarios_ocupados: ['11:00', '12:00'] }
            const horasOcupadasArray: string[] = result.horarios_ocupados || [];

            console.log('✅ [useReservasCancha] Horas ocupadas recibidas:', horasOcupadasArray);
            setHorasOcupadas(horasOcupadasArray);

        } catch (err) {
            console.error('💥 [useReservasCancha] Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener las reservas';
            setError(errorMessage);
            setHorasOcupadas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        horasOcupadas,
        isLoading,
        error,
        fetchReservas,
    };
}