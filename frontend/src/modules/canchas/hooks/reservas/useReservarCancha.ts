// hooks/canchas/reservas/useReservarCancha.ts
import { useState, useCallback } from 'react';

interface ReservaData {
    cancha_id: number;
    fecha: string;
    hora: string;
}

interface Reserva {
    id: number;
    cancha_id: number;
    fecha: string;
    hora: string;
    estado: string;
    precio_total: number;
    created_at: string;
}

interface UseReservarCanchaReturn {
    reserva: Reserva | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    realizarReserva: (data: ReservaData) => Promise<void>;
    resetState: () => void;
}

export function useReservarCancha(): UseReservarCanchaReturn {
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const realizarReserva = useCallback(async (data: ReservaData) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            setReserva(null);


            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/reserva/crear`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });


            // Obtener la respuesta del backend
            const responseData = await response.json();

            if (!response.ok) {
                // Usar SOLO el mensaje de error del backend
                const errorMessage = responseData.message || responseData.error || `Error ${response.status}`;
                throw new Error(errorMessage);
            }

            // Verificar que la respuesta tenga los datos esperados
            if (!responseData || typeof responseData !== 'object') {
                throw new Error('Respuesta del servidor inválida');
            }

            // Validar que la reserva tenga los campos necesarios
            const result = responseData as Reserva;

            setReserva(result);
            setSuccess(true);

        } catch (err) {

            // Usar SOLO el mensaje del error original
            const errorMessage = err instanceof Error ? err.message : 'Error al realizar la reserva';

            setError(errorMessage);
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setReserva(null);
        setError(null);
        setSuccess(false);
        setIsLoading(false);
        console.log('🔄 [useReservarCancha] Estado reseteado');
    }, []);

    return {
        reserva,
        isLoading,
        error,
        success,
        realizarReserva,
        resetState,
    };
}