// hooks/canchas/reservas/useCancelarReserva.ts
import { useState, useCallback } from 'react';

interface UseCancelarReservaReturn {
    cancelarReserva: (reservaId: number) => Promise<void>;
    isCanceling: boolean;
    error: string | null;
    success: boolean;
    resetState: () => void;
}

export function useCancelarReserva(): UseCancelarReservaReturn {
    const [isCanceling, setIsCanceling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const cancelarReserva = useCallback(async (reservaId: number): Promise<void> => {
        try {
            setIsCanceling(true);
            setError(null);
            setSuccess(false);

            console.log('🗑️ [useCancelarReserva] Cancelando reserva:', reservaId);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/reserva/cancelar/${reservaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            console.log('📡 [useCancelarReserva] Response status:', response.status);

            // Obtener la respuesta del backend
            const responseData = await response.json();
            console.log('📦 [useCancelarReserva] Response data:', responseData);

            if (!response.ok) {
                // Usar SOLO el mensaje de error del backend
                const errorMessage = responseData.message || responseData.error || `Error ${response.status}`;
                throw new Error(errorMessage);
            }

            // Verificar que la cancelación fue exitosa
            if (!responseData || typeof responseData !== 'object') {
                throw new Error('Respuesta del servidor inválida');
            }

            console.log('✅ [useCancelarReserva] Reserva cancelada exitosamente');
            setSuccess(true);

        } catch (err) {
            console.log('💥 [useCancelarReserva] Error capturado:', err);

            // Usar SOLO el mensaje del error original
            const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la reserva';

            setError(errorMessage);
            setSuccess(false);
            throw err; // Relanzar el error para que el componente lo maneje
        } finally {
            setIsCanceling(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
        setIsCanceling(false);
        console.log('🔄 [useCancelarReserva] Estado reseteado');
    }, []);

    return {
        cancelarReserva,
        isCanceling,
        error,
        success,
        resetState,
    };
}