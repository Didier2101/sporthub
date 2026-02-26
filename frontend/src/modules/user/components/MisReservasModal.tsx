'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Clock, Calendar, MapPin, DollarSign, Ban, CheckCircle, Clock4, AlertCircle, ExternalLink } from 'lucide-react';
import { useMisReservas } from '@/src/hooks/canchas/reservas/useMisReservas';
import { useRouter } from 'next/navigation';

interface MisReservasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MisReservasModal({
    isOpen,
    onClose
}: MisReservasModalProps) {
    const router = useRouter();
    const { reservas, isLoading, error, fetchReservas, cancelarReserva, isCanceling } = useMisReservas();
    const [reservaACancelar, setReservaACancelar] = useState<number | null>(null);

    // Cargar reservas cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            fetchReservas();
        }
    }, [isOpen, fetchReservas]);

    const handleCancelarReserva = async (reservaId: number) => {
        try {
            setReservaACancelar(reservaId);
            await cancelarReserva(reservaId);
        } catch (err) {
            // El error ya está manejado en el hook con SweetAlert2
            console.error('Error al cancelar reserva:', err);
        } finally {
            setReservaACancelar(null);
        }
    };

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleVerCancha = (canchaId: number) => {
        router.push(`/canchas/${canchaId}`);
        handleClose();
    };

    // Función para obtener el icono según el estado
    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'confirmada':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pendiente':
                return <Clock4 className="w-4 h-4 text-amber-500" />;
            case 'cancelada':
                return <Ban className="w-4 h-4 text-red-500" />;
            case 'completada':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    // Función para obtener el color según el estado
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'confirmada':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'pendiente':
                return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'cancelada':
                return 'text-red-700 bg-red-50 border-red-200';
            case 'completada':
                return 'text-blue-700 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    // Función para formatear fecha corta (solo día/mes)
    const formatearFechaCorta = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Calcular precio total
    const getPrecioTotal = (precioHora: number) => {
        return precioHora || 0;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>
                        <p className="text-gray-600 mt-1">Gestiona todas tus reservas de canchas</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando tus reservas...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-gray-900 font-medium mb-2">Error al cargar reservas</p>
                            <p className="text-gray-600 text-sm">{error}</p>
                            <button
                                onClick={fetchReservas}
                                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : reservas.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-900 font-medium mb-2">No tienes reservas</p>
                            <p className="text-gray-600 text-sm">
                                Cuando hagas una reserva, aparecerá aquí para que puedas gestionarla.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reservas.map((reserva) => {
                                const precioTotal = getPrecioTotal(reserva.cancha?.precio_hora);

                                return (
                                    <div
                                        key={reserva.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                    >
                                        {/* Header de la reserva */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex flex-col items-center bg-rose-50 rounded-lg p-2 min-w-12">
                                                    <span className="text-xs text-rose-600 font-medium uppercase">
                                                        {formatearFechaCorta(reserva.fecha).split(' ')[1]} {/* Mes */}
                                                    </span>
                                                    <span className="text-lg font-bold text-rose-700">
                                                        {formatearFechaCorta(reserva.fecha).split(' ')[0]} {/* Día */}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-base">
                                                        Cancha de {reserva.cancha?.tipo} • {reserva.cancha?.nombre || 'Cancha no disponible'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 capitalize">
                                                        {reserva.cancha?.tipo} • {reserva.cancha?.subtipo}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getEstadoIcon(reserva.estado)}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reserva.estado)}`}>
                                                    {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Información detallada */}
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{reserva.hora}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate">
                                                        {reserva.cancha?.direccion_completa || reserva.cancha?.direccion || 'Sin dirección'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-semibold">${precioTotal.toLocaleString()}</span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Capacidad: {reserva.cancha?.capacidad} jugadores
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => handleVerCancha(reserva.cancha.id)}
                                                className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                                            >
                                                <span>Ver cancha</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </button>

                                            {reserva.estado === 'confirmada' && (
                                                <button
                                                    onClick={() => handleCancelarReserva(reserva.id)}
                                                    disabled={isCanceling && reservaACancelar === reserva.id}
                                                    className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isCanceling && reservaACancelar === reserva.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        'Cancelar Reserva'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Información adicional */}
                    {reservas.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    Las reservas pueden cancelarse hasta 2 horas antes del horario reservado.
                                    Al cancelar una reserva confirmada, el monto será reembolsado según las políticas de la cancha.
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                    {reservas.length > 0 && (
                        <button
                            onClick={fetchReservas}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}