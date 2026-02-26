// hooks/canchas/reservas/useMisReservas.ts
import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useCancelarReserva } from './useCancelarReserva';

export interface ReservaUsuario {
    id: number;
    cancha_id: number;
    fecha: string;
    hora: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    created_at: string;
    cancha: {
        id: number;
        nombre: string;
        tipo: string;
        subtipo: string;
        direccion: string;
        direccion_completa: string;
        superficie: string;
        capacidad: number;
        precio_hora: number;
        descripcion: string;
        estado: string;
    };
}

interface UseMisReservasReturn {
    reservas: ReservaUsuario[];
    isLoading: boolean;
    error: string | null;
    fetchReservas: () => Promise<void>;
    cancelarReserva: (reservaId: number) => Promise<void>;
    isCanceling: boolean;
}

export function useMisReservas(): UseMisReservasReturn {
    const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Usamos el hook separado para cancelar reservas
    const { cancelarReserva: cancelarReservaHook, isCanceling, error: cancelError } = useCancelarReserva();

    const fetchReservas = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) throw new Error('URL de la API no configurada');

            console.log('🔍 [useMisReservas] Cargando reservas del usuario...');

            const response = await fetch(`${API_BASE_URL}/reserva/mis-reservas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            console.log('📥 [useMisReservas] Respuesta:', {
                status: response.status,
                ok: response.ok
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Error ${response.status}`;

                // Mostrar error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar reservas',
                    text: errorMessage,
                    position: 'top-end',
                    toast: true,
                    timer: 4000,
                    showConfirmButton: false
                });

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ [useMisReservas] Datos recibidos:', data);

            const reservasRecibidas = data.reservas || data || [];
            setReservas(reservasRecibidas);

        } catch (err) {
            console.log('🚨 [useMisReservas] Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar las reservas';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelarReserva = async (reservaId: number): Promise<void> => {
        // Confirmar antes de cancelar
        const result = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // Mostrar loading
            Swal.fire({
                title: 'Cancelando reserva...',
                text: 'Por favor espera',
                position: 'top-end',
                toast: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await cancelarReservaHook(reservaId);

            // Si la cancelación fue exitosa, actualizamos la lista local
            setReservas(prev => prev.filter(reserva => reserva.id !== reservaId));

            // Mostrar éxito
            Swal.fire({
                icon: 'success',
                title: 'Reserva Cancelada',
                text: 'Tu reserva ha sido cancelada exitosamente',
                position: 'top-end',
                toast: true,
                timer: 4000,
                showConfirmButton: false,
                timerProgressBar: true
            });

        } catch (err) {
            // Mostrar error
            const errorMessage = err instanceof Error ? err.message : 'No se pudo cancelar la reserva';

            Swal.fire({
                icon: 'error',
                title: 'Error al cancelar',
                text: errorMessage,
                position: 'top-end',
                toast: true,
                timer: 5000,
                showConfirmButton: true
            });

            throw err;
        }
    };

    return {
        reservas,
        isLoading,
        error: error || cancelError,
        fetchReservas,
        cancelarReserva,
        isCanceling
    };
}