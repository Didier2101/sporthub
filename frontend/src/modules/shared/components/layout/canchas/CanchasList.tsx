'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Search, MapPin, Plus, DollarSign, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetCanchas } from '@/src/hooks/canchas/useGetCanchas';
import CardCancha from './CardCancha';
import { Cancha } from '@/src/types/Cancha';

export default function CanchasList() {


    const router = useRouter();
    const { canchas, isLoading, error } = useGetCanchas();

    const [search, setSearch] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<'Todos' | string>('Todos');
    const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});

    // Estados para el modal
    const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
    const [isCardOpen, setIsCardOpen] = useState(false);

    // 🧠 Obtener tipos únicos de canchas para los filtros
    const tiposDisponibles = useMemo(() => {
        const tipos = new Set<string>();
        canchas.forEach(c => tipos.add(c.tipo));
        return ['Todos', ...Array.from(tipos)];
    }, [canchas]);

    // 🔍 Filtrar canchas según búsqueda y tipo
    const canchasFiltradas = useMemo(() => {
        return canchas.filter(c => {
            const coincideBusqueda =
                c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                c.direccion_completa.toLowerCase().includes(search.toLowerCase());

            const coincideTipo =
                filtroTipo === 'Todos' || c.tipo.toLowerCase() === filtroTipo.toLowerCase();

            return coincideBusqueda && coincideTipo;
        });
    }, [canchas, search, filtroTipo]);

    const nextImage = (canchaId: number, totalImages: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImageIndexes(prev => ({
            ...prev,
            [canchaId]: ((prev[canchaId] || 0) + 1) % totalImages
        }));
    };

    const prevImage = (canchaId: number, totalImages: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImageIndexes(prev => ({
            ...prev,
            [canchaId]: ((prev[canchaId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    // Handlers para el modal
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
        // Ya estamos en la vista de todas, solo cerrar el modal
        handleCloseCard();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loader2 className="animate-spin w-8 h-8 text-rose-500 mx-auto mb-4" />
                            <p className="text-gray-600">Cargando canchas...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">
                            Error al cargar las canchas
                        </h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay canchas en el sistema
    if (canchas.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center max-w-md">
                            <div className="mb-6">
                                <MapPin className="mx-auto h-24 w-24 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                No hay canchas disponibles
                            </h3>
                            <p className="text-gray-600 mb-6">
                                ¡Sé el primero en crear una cancha en la plataforma!
                            </p>
                            <Link
                                href="/canchas/nueva"
                                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Crear primera cancha
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div >
            <div className="">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div className="mb-4 lg:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900">Canchas Disponibles</h1>
                        <p className="text-gray-600 mt-2">
                            {canchasFiltradas.length} de {canchas.length} cancha{canchas.length !== 1 ? 's' : ''} encontrada{canchas.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <Link
                        href="/canchas/nueva"
                        className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 w-fit"
                    >
                        <Plus className="w-5 h-5" />
                        Crear Cancha
                    </Link>
                </div>

                {/* Barra de búsqueda y filtro */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filtroTipo}
                        onChange={e => setFiltroTipo(e.target.value)}
                        className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                        {tiposDisponibles.map(tipo => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Grid de canchas */}
                {canchasFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron canchas
                        </h3>
                        <p className="text-gray-600">
                            No hay canchas que coincidan con tu búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {canchasFiltradas.map(c => {
                            // 🖼️ Obtener todas las imágenes ordenadas
                            const imagenesOrdenadas = c.imagenes_accesibles?.sort((a, b) => a.orden - b.orden) || [];
                            const currentImageIndex = imageIndexes[c.id] || 0;
                            const imagenActual = imagenesOrdenadas[currentImageIndex];
                            const tieneMultiplesImagenes = imagenesOrdenadas.length > 1;

                            // Obtener horarios disponibles
                            const horariosDisponibles = c.horarios?.filter(h => h.disponible) || [];
                            const diasDisponibles = [...new Set(horariosDisponibles.map(h => h.dia_semana))];

                            return (
                                <div
                                    key={c.id}
                                    onClick={() => handleCardClick(c)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    {/* Imagen con Slider */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 group">
                                        {imagenActual ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={imagenActual.url}
                                                alt={`${c.nombre} - Imagen ${currentImageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <MapPin className="w-12 h-12 text-gray-400 mb-2" />
                                                <span className="text-gray-500 text-sm">Sin imagen</span>
                                            </div>
                                        )}

                                        {/* Botones de navegación del slider */}
                                        {tieneMultiplesImagenes && (
                                            <>
                                                <button
                                                    onClick={(e) => prevImage(c.id, imagenesOrdenadas.length, e)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Imagen anterior"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => nextImage(c.id, imagenesOrdenadas.length, e)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Imagen siguiente"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}

                                        {/* Estado */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.estado === 'activa'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {c.estado === 'activa' ? 'Disponible' : 'No disponible'}
                                            </span>
                                        </div>

                                        {/* Indicador de imágenes */}
                                        {tieneMultiplesImagenes && (
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                {imagenesOrdenadas.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setImageIndexes(prev => ({
                                                                ...prev,
                                                                [c.id]: index
                                                            }));
                                                        }}
                                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                            ? 'bg-white w-6'
                                                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                                            }`}
                                                        aria-label={`Ir a imagen ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Contador de imágenes */}
                                        {tieneMultiplesImagenes && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                                                    {currentImageIndex + 1}/{imagenesOrdenadas.length}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                                            {c.nombre}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-3 flex items-start gap-1">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">
                                                {c.direccion_completa || c.direccion}
                                            </span>
                                        </p>

                                        {/* Detalles rápidos */}
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-medium text-rose-600">
                                                        ${c.precio_hora.toLocaleString()}/hora
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{c.capacidad}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{c.tipo}</span>
                                                {diasDisponibles.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{diasDisponibles.length} días</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botón de acción */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(c);
                                            }}
                                            className="w-full bg-rose-500 hover:bg-rose-600 text-white text-center py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal CardCancha */}
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