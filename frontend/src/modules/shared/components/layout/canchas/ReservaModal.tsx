// components/canchas/ReservaModal.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, Clock, Calendar, Ban, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

import { useReservasCancha } from '@/src/hooks/canchas/reservas/useReservasCancha';
import { HorarioDisponible } from '@/src/types/Reserva';
import { useReservarCancha } from '@/src/hooks/canchas/reservas/useReservarCancha';

interface ReservaModalProps {
    isOpen: boolean;
    onClose: () => void;
    canchaId: number;
    canchaNombre: string;
    horarios: HorarioDisponible[];
    precioHora: number;
}

// Función para generar slots de tiempo basados en intervalo
const generarSlotsHorarios = (horario: HorarioDisponible): string[] => {
    const slots: string[] = [];
    const [horaInicio, minutoInicio] = horario.hora_inicio.split(':').map(Number);
    const [horaFin, minutoFin] = horario.hora_fin.split(':').map(Number);

    let horaActual = horaInicio;
    let minutoActual = minutoInicio;

    while (horaActual < horaFin || (horaActual === horaFin && minutoActual < minutoFin)) {
        const horaStr = horaActual.toString().padStart(2, '0');
        const minutoStr = minutoActual.toString().padStart(2, '0');
        slots.push(`${horaStr}:${minutoStr}`);

        // Avanzar según el intervalo
        minutoActual += horario.intervalo_minutos;
        while (minutoActual >= 60) {
            minutoActual -= 60;
            horaActual += 1;
        }
    }

    return slots;
};

export default function ReservaModal({
    isOpen,
    onClose,
    canchaId,
    canchaNombre,
    horarios,
    precioHora
}: ReservaModalProps) {
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
    const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');

    // Usar ref para evitar loops infinitos
    const alertShownRef = useRef(false);

    const { reserva, isLoading, error, success, realizarReserva, resetState } = useReservarCancha();
    const { horasOcupadas, isLoading: isLoadingReservas, fetchReservas } = useReservasCancha();

    // Obtener día de la semana de una fecha
    const obtenerDiaSemana = useCallback((fecha: string): string => {
        const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const fechaObj = new Date(fecha + 'T00:00:00');
        return dias[fechaObj.getDay()];
    }, []);

    // Verificar si una hora está ocupada
    const estaHoraOcupada = useCallback((hora: string): boolean => {
        return horasOcupadas.includes(hora);
    }, [horasOcupadas]);

    // Horarios disponibles para el día seleccionado
    const horariosDelDia = useMemo(() => {
        if (!fechaSeleccionada) return [];

        const diaSeleccionado = obtenerDiaSemana(fechaSeleccionada);
        return horarios.filter(horario =>
            horario.dia_semana.toLowerCase() === diaSeleccionado && horario.disponible
        );
    }, [fechaSeleccionada, horarios, obtenerDiaSemana]);

    // Slots de tiempo disponibles
    const slotsDisponibles = useMemo(() => {
        const slots: string[] = [];
        horariosDelDia.forEach(horario => {
            slots.push(...generarSlotsHorarios(horario));
        });
        return [...new Set(slots)].sort();
    }, [horariosDelDia]);

    // Cargar horas ocupadas cuando se selecciona una fecha
    useEffect(() => {
        if (fechaSeleccionada && canchaId) {
            fetchReservas(canchaId, fechaSeleccionada);
        }
    }, [fechaSeleccionada, canchaId, fetchReservas]);

    // Resetear estado cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            resetState();
            setFechaSeleccionada('');
            setHoraSeleccionada('');
            alertShownRef.current = false;
        }
    }, [isOpen, resetState]);

    // ✅ Manejo de éxito con SweetAlert2 (arriba a la derecha)
    useEffect(() => {
        if (success && reserva && !alertShownRef.current) {
            alertShownRef.current = true;

            Swal.fire({
                icon: 'success',
                title: '¡Reserva Confirmada!',
                text: `Tu reserva para el ${new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES')} a las ${reserva.hora} ha sido confirmada`,
                position: 'top-end',
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                customClass: {
                    popup: 'colored-toast'
                }
            });

            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [success, reserva, onClose]);

    // ✅ Manejo de errores con SweetAlert2 (arriba a la derecha)
    useEffect(() => {
        if (error && !alertShownRef.current) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la reserva',
                text: error,
                position: 'top-end',
                timer: 5000,
                showConfirmButton: true,
                toast: true
            });
        }
    }, [error]);

    const handleReservar = async () => {
        if (!fechaSeleccionada || !horaSeleccionada) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos incompletos',
                text: 'Por favor selecciona una fecha y hora',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
                toast: true
            });
            return;
        }

        if (estaHoraOcupada(horaSeleccionada)) {
            Swal.fire({
                icon: 'error',
                title: 'Hora no disponible',
                text: 'Esta hora ya ha sido reservada. Por favor selecciona otra hora.',
                position: 'top-end',
                timer: 4000,
                showConfirmButton: true,
                toast: true
            });
            return;
        }

        await realizarReserva({
            cancha_id: canchaId,
            fecha: fechaSeleccionada,
            hora: horaSeleccionada
        });
    };

    const formatearDia = useCallback((dia: string) => {
        const dias: { [key: string]: string } = {
            'lunes': 'Lunes',
            'martes': 'Martes',
            'miercoles': 'Miércoles',
            'jueves': 'Jueves',
            'viernes': 'Viernes',
            'sabado': 'Sábado',
            'domingo': 'Domingo'
        };
        return dias[dia.toLowerCase()] || dia;
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Reservar Cancha</h2>
                        <p className="text-gray-600 mt-1">{canchaNombre}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Precio */}
                    <div className="bg-rose-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Precio por hora:</span>
                            <span className="text-2xl font-bold text-rose-600">${precioHora.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Selección de fecha */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                            <Calendar className="w-5 h-5 text-rose-500" />
                            Paso 1: Seleccionar fecha
                        </label>
                        <input
                            type="date"
                            value={fechaSeleccionada}
                            onChange={(e) => {
                                setFechaSeleccionada(e.target.value);
                                setHoraSeleccionada('');
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Selección de hora */}
                    {fechaSeleccionada && (
                        <div>
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                <Clock className="w-5 h-5 text-rose-500" />
                                Paso 2: Seleccionar hora
                                <span className="text-sm font-normal text-gray-500">
                                    ({formatearDia(obtenerDiaSemana(fechaSeleccionada))})
                                </span>
                                {isLoadingReservas && (
                                    <span className="text-sm text-amber-600 font-normal">
                                        (Verificando disponibilidad...)
                                    </span>
                                )}
                            </label>

                            <div className="space-y-4">
                                {slotsDisponibles.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {slotsDisponibles.map((hora, index) => {
                                            const ocupada = estaHoraOcupada(hora);
                                            const seleccionada = horaSeleccionada === hora;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => !ocupada && setHoraSeleccionada(hora)}
                                                    disabled={isLoading || ocupada}
                                                    className={`p-4 rounded-lg border-2 transition-all ${seleccionada && !ocupada
                                                        ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                                                        : ocupada
                                                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'border-gray-200 hover:border-rose-300 hover:bg-rose-25 text-gray-700'
                                                        } ${(isLoading || ocupada) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium text-lg">{hora}</span>
                                                        {ocupada && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Ban className="w-3 h-3" />
                                                                <span className="text-xs">Ocupada</span>
                                                            </div>
                                                        )}
                                                        {seleccionada && !ocupada && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span className="text-xs">Seleccionada</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                                        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="font-medium">No hay horarios disponibles</p>
                                        <p className="text-sm mt-1">
                                            No hay horarios configurados para los {formatearDia(obtenerDiaSemana(fechaSeleccionada))}s
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resumen de reserva */}
                    {fechaSeleccionada && horaSeleccionada && !estaHoraOcupada(horaSeleccionada) && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-gray-900">Resumen de reserva:</h4>
                            <div className="flex justify-between text-gray-700">
                                <span>Fecha:</span>
                                <span className="font-medium">
                                    {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Hora:</span>
                                <span className="font-medium">{horaSeleccionada}</span>
                            </div>
                            <div className="flex justify-between text-gray-700 border-t pt-2 mt-2">
                                <span>Total a pagar:</span>
                                <span className="font-bold text-rose-600">${precioHora.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer con botones */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleReservar}
                        disabled={!fechaSeleccionada || !horaSeleccionada || isLoading || estaHoraOcupada(horaSeleccionada)}
                        className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Procesando...
                            </>
                        ) : success ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                ¡Reservado!
                            </>
                        ) : (
                            'Confirmar Reserva'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}