'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, XCircle } from 'lucide-react'; // Importar XCircle para el error
import CardCancha from './CardCancha';
import { useGetCanchas } from '@/src/hooks/canchas/useGetCanchas';
import { Cancha } from '@/src/types/Cancha';

export default function CanchasMobile() {
    // LÓGICA ORIGINAL (100% INTACTA)
    const router = useRouter();
    const { canchas, isLoading, error } = useGetCanchas();
    const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const handleCardClick = (cancha: Cancha) => {
        setSelectedCancha(cancha);
        setIsCardOpen(true);
    };

    const handleCloseCard = () => {
        setIsCardOpen(false);
        setTimeout(() => setSelectedCancha(null), 300);
    };

    const handleCrearCancha = () => {
        router.push('/canchas/nueva');
        handleCloseCard();
    };

    const handleVerTodas = () => {
        router.push('/canchas');
        handleCloseCard();
    };

    const handleImageError = (canchaId: number) => {
        console.error(`❌ [CanchasMobile] Error cargando imagen de cancha ${canchaId}`);
        setImageErrors(prev => new Set(prev).add(canchaId));
    };
    // FIN LÓGICA ORIGINAL

    // 1. Manejo de Carga (Diseño Airbnb)
    if (isLoading) {
        return (
            <div className="p-5 text-center bg-white rounded-xl shadow-md mb-4">
                <div className="flex items-center justify-center text-gray-500 font-medium text-sm">
                    <MapPin className="w-5 h-5 mr-2 animate-pulse text-rose-500" />
                    Buscando canchas cercanas...
                </div>
            </div>
        );
    }

    // 2. Manejo de Error (Diseño Airbnb)
    if (error) {
        return (
            <div className="p-5 text-center bg-white rounded-xl shadow-md mb-4 border border-red-100">
                <div className="flex items-center justify-center text-red-500 font-medium text-sm">
                    <XCircle className="w-5 h-5 mr-2" />
                    Error al cargar: {error}
                </div>
            </div>
        );
    }

    // 3. Manejo de No Hay Canchas (Diseño Airbnb)
    if (!canchas.length) {
        return (
            <div className="mb-4 bg-white rounded-xl p-5 shadow-md">
                <button
                    onClick={handleCrearCancha}
                    // 🌟 Botón principal de Airbnb: Centrado, con buen padding y color primario sutil
                    className="text-rose-600 px-4 py-2 font-semibold flex items-center justify-center gap-2 mx-auto text-sm hover:bg-rose-50 rounded-full transition-colors"
                >
                    ¡Reserva tu primera cancha ahora! <Plus className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // 4. Renderizado de Canchas (Diseño Airbnb)
    return (
        <div className='px-2'>
            <div
                // 🌟 Contenedor principal: Sombra suave y bordes redondeados
                className="mb-4 bg-white py-4 rounded-xl shadow-lg border border-gray-100"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3 px-3 flex items-center justify-between">
                    <span>⚽ Canchas Cercanas</span>
                    <button
                        onClick={handleVerTodas}
                        // 🌟 Botón de acción secundaria tipo enlace
                        className="text-sm text-gray-600 font-medium hover:text-rose-500 transition-colors"
                    >
                        Ver todas
                    </button>
                </h3>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                {/* Contenedor de scroll horizontal */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pl-4 pb-1"> {/* 🌟 Aumentar el gap */}
                    {canchas.map((c) => {
                        // Lógica de imágenes original
                        const imagenesOrdenadas = c.imagenes_accesibles?.sort((a, b) => a.orden - b.orden) || [];
                        const imagenPrincipal = imagenesOrdenadas[0]?.url;
                        const hasImageError = imageErrors.has(c.id);
                        const showImage = imagenPrincipal && !hasImageError;

                        return (
                            <div
                                key={c.id}
                                onClick={() => handleCardClick(c)}
                                // 🌟 Tarjeta más grande (w-40), shadow-md por defecto
                                className="flex-shrink-0 w-40 cursor-pointer  rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                            >
                                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-gray-100"> {/* 🌟 Altura de imagen aumentada */}
                                    {showImage ? (
                                        <Image
                                            src={imagenPrincipal}
                                            alt={c.nombre}
                                            fill
                                            // 🌟 Bordes de imagen redondeados (coincidiendo con la tarjeta)
                                            className="object-cover rounded-xl"
                                            sizes="160px"
                                            onError={() => handleImageError(c.id)}
                                            priority={false}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                            <MapPin className="w-8 h-8 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-400 text-center">
                                                Sin imagen
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Contenido de texto con buen espaciado */}
                                <div className="pt-2 px-1 pb-1">
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 leading-snug"> {/* 🌟 Texto un poco más grande */}
                                        {c.nombre}
                                    </h4>
                                    <p className="text-gray-500 text-xs line-clamp-1 leading-snug mt-0.5"> {/* 🌟 Texto más sutil (gray-500) */}
                                        {c.direccion_completa || c.direccion}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CardCancha con información completa (Lógica y componente externo se mantienen) */}
            {selectedCancha && (
                <CardCancha
                    cancha={selectedCancha}
                    isOpen={isCardOpen}
                    onClose={handleCloseCard}
                    onCrearCancha={handleCrearCancha}
                    onVerTodas={handleVerTodas}
                />
            )}
        </div>
    );
}