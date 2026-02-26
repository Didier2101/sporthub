'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Calendar, Plus, Eye, Clock, Camera, Users, DollarSign, Info, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Cancha } from '@/src/types/Cancha';

interface CardCanchaProps {
    cancha: Cancha;
    isOpen: boolean;
    onClose: () => void;
    onCrearCancha: () => void;
    onVerTodas: () => void;
}

interface Horario {
    dia_semana: string;
    hora_inicio?: string;
    hora_fin?: string;
    hora?: string;
}

export default function CardCancha({
    cancha,
    isOpen,
    onClose,
    onCrearCancha,
    onVerTodas
}: CardCanchaProps) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Lógica de apertura/cierre y scroll lock
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Resetear cuando cambie la cancha
    useEffect(() => {
        setImageError(false);
        setSelectedImageIndex(0);
    }, [cancha.id]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleReservar = () => {
        router.push(`/canchas/${cancha.id}`);
        handleClose();
    };

    const handleImageError = () => {
        console.error(`❌ [CardCancha] Error cargando imagen de cancha ${cancha.id}`);
        setImageError(true);
    };

    const nextImage = () => {
        if (!imagenesOrdenadas.length) return;
        setSelectedImageIndex((prev) => (prev + 1) % imagenesOrdenadas.length);
    };

    const prevImage = () => {
        if (!imagenesOrdenadas.length) return;
        setSelectedImageIndex((prev) => (prev - 1 + imagenesOrdenadas.length) % imagenesOrdenadas.length);
    };

    if (!isOpen && !isVisible) return null;

    // Obtener imágenes ordenadas
    const imagenesOrdenadas = cancha.imagenes_accesibles?.sort((a, b) => a.orden - b.orden) || [];
    const imagenActual = imagenesOrdenadas[selectedImageIndex];
    const showImage = imagenActual?.url && !imageError;
    const tieneMultiplesImagenes = imagenesOrdenadas.length > 1;

    // Formatear horarios y días
    const formatHorario = (horario: Horario) => {
        if (horario.hora_inicio && horario.hora_fin) {
            return `${horario.hora_inicio} - ${horario.hora_fin}`;
        }
        return horario.hora || 'Horario no disponible';
    };

    const getDiaSemana = (dia: string) => {
        const dias: { [key: string]: string } = {
            lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',
            viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
        };
        return dias[dia.toLowerCase()] || dia;
    };

    // Altura de la galería de imágenes (sin cambios)
    const GALLERY_HEIGHT_CLASS = "h-[300px] lg:h-[350px]";

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isVisible ? 'opacity-40' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* 🌟 PANEL DEL MODAL - MODIFICADO PARA RESPONSIVIDAD 🌟 */}
            <div
                className={`fixed inset-x-0 bottom-0 bg-white z-50 transition-transform duration-300 
                rounded-t-3xl overflow-hidden shadow-2xl h-full sm:h-[90vh]
                
                lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:max-w-xl lg:w-1/2 lg:rounded-l-2xl lg:rounded-t-none lg:shadow-xl
                
                ${isVisible ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}`}
            >

                <div className="flex flex-col h-full">

                    {/* Galería de imágenes - Fija en la parte superior */}
                    <div className={`relative ${GALLERY_HEIGHT_CLASS} bg-gray-100`}>
                        {showImage ? (
                            <>
                                <Image
                                    src={imagenActual.url}
                                    alt={`${cancha.nombre} - Imagen ${selectedImageIndex + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 448px"
                                    className="object-cover"
                                    onError={handleImageError}
                                    priority
                                    unoptimized
                                />
                                {tieneMultiplesImagenes && (
                                    <>
                                        {/* Botones de navegación */}
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-gray-900 p-2 rounded-full shadow-md transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-gray-900 p-2 rounded-full shadow-md transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        {/* Indicadores / Contador */}
                                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                                            {imagenesOrdenadas.map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${selectedImageIndex === index ? 'bg-white w-4' : 'bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <Camera className="w-16 h-16 text-gray-400 mb-2" />
                                <span className="text-gray-500 text-sm">Sin imagen disponible</span>
                            </div>
                        )}

                        {/* Botón de cerrar */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 w-9 h-9 bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Contenido scrollable (El cálculo de altura se ajusta automáticamente) */}
                    <div className="flex-1 overflow-y-auto p-6 pb-28">

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                                    {cancha.nombre}
                                </h1>
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{cancha.direccion_completa || cancha.direccion || 'Ubicación no disponible'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center font-bold text-xl text-gray-900">
                                <DollarSign className="w-5 h-5 mr-1 text-rose-500" />
                                ${cancha.precio_hora?.toLocaleString() || '0'}
                                <span className="text-base font-normal text-gray-600 ml-1">/ hora</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${cancha.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {cancha.estado === 'activa' ? '✅ Disponible' : '❌ No disponible'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 border-b border-gray-100 pb-6">
                            {[
                                { icon: Users, label: 'Capacidad', value: `${cancha.capacidad} jugadores`, color: 'text-rose-500' },
                                { icon: Info, label: 'Tipo', value: cancha.tipo, color: 'text-rose-500' },
                                { icon: ShieldCheck, label: 'Subtipo', value: cancha.subtipo, color: 'text-rose-500' },
                                { icon: DollarSign, label: 'Superficie', value: cancha.superficie, color: 'text-rose-500' },
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-7 -mt-1">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        {cancha.descripcion && cancha.descripcion !== "sin descripcion" && (
                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Acerca de la Cancha</h3>
                                <p className="text-gray-700 leading-relaxed text-base">{cancha.descripcion}</p>
                            </div>
                        )}
                        {cancha.horarios && cancha.horarios.length > 0 && (
                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-gray-700" />
                                    Horarios de Apertura
                                </h3>
                                <div className="space-y-3">
                                    {cancha.horarios.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between text-base">
                                            <span className="font-medium text-gray-800">
                                                {getDiaSemana(h.dia_semana)}
                                            </span>
                                            <span className="text-gray-600 font-medium">
                                                {formatHorario(h as Horario)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {cancha.amenidades && cancha.amenidades.length > 0 && (
                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Amenidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {cancha.amenidades.map((a, i) => (
                                        <span
                                            key={i}
                                            className="bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300"
                                        >
                                            {a.amenidad}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {cancha.reglas && cancha.reglas.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Reglas de la Cancha</h3>
                                <ul className="space-y-3">
                                    {cancha.reglas.map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 text-base">
                                            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-2.5 flex-shrink-0"></div>
                                            <span>{r.regla}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Botones Fijos (Footer del Modal) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl">
                        <div className="flex justify-between items-center w-full">

                            <div className="flex gap-2 text-sm">
                                <button
                                    onClick={onCrearCancha}
                                    className="text-gray-600 hover:text-rose-500 flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Crear
                                </button>
                                <button
                                    onClick={onVerTodas}
                                    className="text-gray-600 hover:text-rose-500 flex items-center gap-1 transition-colors ml-3"
                                >
                                    <Eye className="w-4 h-4" /> Ver Todas
                                </button>
                            </div>

                            <button
                                onClick={handleReservar}
                                disabled={cancha.estado !== 'activa'}
                                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-8 rounded-full font-bold flex items-center justify-center text-base transition-all shadow-lg hover:shadow-xl"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Reservar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}