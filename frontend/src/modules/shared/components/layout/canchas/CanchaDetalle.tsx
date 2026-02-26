// components/canchas/CanchaDetalle.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Users, DollarSign, Info, Clock, ShieldCheck, Camera, Calendar, Star, ChevronLeft, ChevronRight, Wifi } from 'lucide-react';
import ReservaModal from './ReservaModal';
import { FaSmoking } from 'react-icons/fa';
import { useGetCanchaById } from '@/src/hooks/canchas/useGetCanchaById';

interface CanchaDetalleProps {
    canchaId: string;
}

interface Horario {
    id?: number;
    dia_semana: string;
    hora_inicio?: string;
    hora_fin?: string;
    intervalo_minutos?: number;
    disponible: boolean;
    hora?: string;
}

interface Amenidad {
    id?: number;
    amenidad: string;
}

interface Regla {
    id?: number;
    regla: string;
}

export default function CanchaDetalle({ canchaId }: CanchaDetalleProps) {
    const { cancha, isLoading, error, fetchCancha } = useGetCanchaById();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    console.log('Cancha data:', cancha);

    useEffect(() => {
        if (canchaId) {
            fetchCancha(canchaId);
        }
    }, [canchaId, fetchCancha]);

    // Resetear índice de imagen cuando cambie la cancha
    useEffect(() => {
        setSelectedImageIndex(0);
    }, [cancha?.id]);

    // Función para formatear horarios
    const formatHorario = (horario: Horario) => {
        if (horario.hora_inicio && horario.hora_fin) {
            return `${horario.hora_inicio} - ${horario.hora_fin} (${horario.intervalo_minutos} min)`;
        }
        return horario.hora || 'Horario no disponible';
    };

    // Función para obtener días de la semana en español
    const getDiaSemana = (dia: string) => {
        const dias: { [key: string]: string } = {
            lunes: 'Lunes',
            martes: 'Martes',
            miercoles: 'Miércoles',
            jueves: 'Jueves',
            viernes: 'Viernes',
            sabado: 'Sábado',
            domingo: 'Domingo'
        };
        return dias[dia.toLowerCase()] || dia;
    };

    const nextImage = () => {
        if (!imagenesOrdenadas.length) return;
        setSelectedImageIndex((prev) => (prev + 1) % imagenesOrdenadas.length);
    };

    const prevImage = () => {
        if (!imagenesOrdenadas.length) return;
        setSelectedImageIndex((prev) => (prev - 1 + imagenesOrdenadas.length) % imagenesOrdenadas.length);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-80 bg-gray-200 rounded-xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => fetchCancha(canchaId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!cancha) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center py-12">
                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cancha no encontrada</h2>
                        <p className="text-gray-600">La cancha que buscas no existe o no está disponible.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Obtener imágenes ordenadas
    const imagenesOrdenadas = cancha.imagenes_accesibles?.sort((a, b) => a.orden - b.orden) || [];
    const imagenActual = imagenesOrdenadas[selectedImageIndex];
    const tieneMultiplesImagenes = imagenesOrdenadas.length > 1;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Galería de imágenes */}
                <div className="mb-6">
                    <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group">
                        {imagenActual ? (
                            <Image
                                src={imagenActual.url}
                                alt={`${cancha.nombre} - Imagen ${selectedImageIndex + 1}`}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <Camera className="w-20 h-20 text-gray-400 mb-3" />
                                <span className="text-gray-500 text-lg font-medium">Sin imagen disponible</span>
                            </div>
                        )}

                        {/* Botones de navegación */}
                        {tieneMultiplesImagenes && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Imagen siguiente"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Contador */}
                        {tieneMultiplesImagenes && (
                            <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-black bg-opacity-50 text-white">
                                    {selectedImageIndex + 1} / {imagenesOrdenadas.length}
                                </span>
                            </div>
                        )}

                        {/* Indicadores de puntos */}
                        {tieneMultiplesImagenes && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {imagenesOrdenadas.map(() => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`transition-all ${index === selectedImageIndex
                                            ? 'w-8 h-2 bg-white'
                                            : 'w-2 h-2 bg-white bg-opacity-50 hover:bg-opacity-75'
                                            } rounded-full`}
                                        aria-label={`Ir a imagen ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Miniaturas */}
                    {tieneMultiplesImagenes && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {imagenesOrdenadas.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-rose-500 ring-2 ring-rose-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`Miniatura ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Header con información principal */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{cancha.nombre}</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-500" />
                                {cancha.direccion_completa || cancha.direccion}
                            </p>

                            {/* Estado */}
                            <div className="flex items-center gap-3 mt-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cancha.estado === 'activa'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <Star className="w-3 h-3 mr-1" />
                                    {cancha.estado === 'activa' ? 'Disponible' : 'No disponible'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {cancha.capacidad} jugadores • ${cancha.precio_hora.toLocaleString()}/hora
                                </span>
                            </div>
                        </div>

                        {/* Botón de Reservar */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={cancha.estado !== 'activa'}
                            className="flex items-center gap-3 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors font-semibold shadow-lg disabled:cursor-not-allowed"
                        >
                            <Calendar className="w-5 h-5" />
                            Reservar Ahora
                        </button>
                    </div>

                    {/* Detalles rápidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-rose-500" />
                            <div>
                                <p className="text-sm text-gray-500">Capacidad</p>
                                <p className="font-semibold">{cancha.capacidad} jugadores</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-rose-500" />
                            <div>
                                <p className="text-sm text-gray-500">Precio por hora</p>
                                <p className="font-semibold">${cancha.precio_hora.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-rose-500" />
                            <div>
                                <p className="text-sm text-gray-500">Tipo</p>
                                <p className="font-semibold">{cancha.tipo}</p>
                            </div>
                        </div>
                        {cancha.superficie && (
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-rose-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Superficie</p>
                                    <p className="font-semibold">{cancha.superficie}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información detallada de la cancha */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Información de la Cancha</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="font-semibold">{cancha.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nombre</p>
                                <p className="font-semibold">{cancha.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tipo</p>
                                <p className="font-semibold">{cancha.tipo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Subtipo</p>
                                <p className="font-semibold">{cancha.subtipo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Superficie</p>
                                <p className="font-semibold">{cancha.superficie}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Capacidad</p>
                                <p className="font-semibold">{cancha.capacidad} jugadores</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Precio por hora</p>
                                <p className="font-semibold">${cancha.precio_hora.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estado</p>
                                <p className={`font-semibold ${cancha.estado === 'activa' ? 'text-green-600' : 'text-gray-600'}`}>
                                    {cancha.estado}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Dirección</p>
                                <p className="font-semibold">{cancha.direccion}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Dirección completa</p>
                                <p className="font-semibold">{cancha.direccion_completa}</p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción - Solo mostrar si no es "sin descripcion" */}
                    {cancha.descripcion && cancha.descripcion !== "sin descripcion" && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                            <p className="text-gray-600 leading-relaxed">{cancha.descripcion}</p>
                        </div>
                    )}

                    {/* Horarios */}
                    {cancha.horarios && cancha.horarios.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-rose-500" />
                                Horarios Disponibles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(cancha.horarios as Horario[]).map((horario, index) => (
                                    <div
                                        key={horario.id || index}
                                        className={`flex items-center justify-between p-3 rounded-lg ${horario.disponible ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-900">
                                                {getDiaSemana(horario.dia_semana)}
                                            </span>
                                            {!horario.disponible && (
                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">No disponible</span>
                                            )}
                                        </div>
                                        <span className="text-gray-600">
                                            {formatHorario(horario)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amenidades */}
                    {cancha.amenidades && cancha.amenidades.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Amenidades</h2>
                            <div className="flex flex-wrap gap-3">
                                {(cancha.amenidades as Amenidad[]).map((amenidad, index) => (
                                    <div
                                        key={amenidad.id || index}
                                        className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200"
                                    >
                                        {amenidad.amenidad.toLowerCase().includes('wifi') ? (
                                            <Wifi className="w-5 h-5 text-blue-500" />
                                        ) : (
                                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                                        )}
                                        <span className="font-medium text-gray-900">{amenidad.amenidad}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reglas */}
                    {cancha.reglas && cancha.reglas.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Reglas de la Cancha</h2>
                            <ul className="space-y-3">
                                {(cancha.reglas as Regla[]).map((regla, index) => (
                                    <li
                                        key={regla.id || index}
                                        className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                                    >
                                        {regla.regla.toLowerCase().includes('fumar') ? (
                                            <FaSmoking className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <ShieldCheck className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        <span className="text-gray-700">{regla.regla}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal de Reserva */}
            <ReservaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                canchaId={cancha.id}
                canchaNombre={cancha.nombre}
                horarios={cancha.horarios || []}
                precioHora={cancha.precio_hora}
            />
        </div>
    );
}