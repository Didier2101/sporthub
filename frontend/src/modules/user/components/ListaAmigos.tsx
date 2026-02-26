'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Users,
    UserX,
    ChevronDown,
    ChevronUp,
    Loader2,
    Calendar,
    AlertCircle,
    UserCheck,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import { useFriendsList } from '@/src/hooks/perfil/amigos/useFriendsList';
import { useEliminarAmigo } from '@/src/hooks/perfil/amigos/useEliminarAmigo';

export default function ListaAmigos() {
    const { amigos, isLoading, error, refetch } = useFriendsList();
    const { eliminarAmigo, isLoading: eliminando } = useEliminarAmigo();
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
    const [acordeonAbierto, setAcordeonAbierto] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const formatearFecha = (fecha: string) => {
        try {
            const date = new Date(fecha);
            const ahora = new Date();
            const diffDias = Math.floor((ahora.getTime() - date.getTime()) / (1000 * 3600 * 24));

            if (diffDias === 0) return 'Hoy';
            if (diffDias === 1) return 'Ayer';
            if (diffDias < 7) return `Hace ${diffDias} días`;
            if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;

            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return fecha;
        }
    };

    const handleEliminarAmigo = async (userId: number, nombreAmigo: string) => {
        try {
            const eliminado = await eliminarAmigo(userId, nombreAmigo);
            if (eliminado) {
                setMenuAbierto(null);
                // Refetch la lista para actualizar
                await refetch();
            }
        } catch (err) {
            console.error('Error al eliminar amigo:', err);
        }
    };

    const toggleMenu = (friendshipId: number) => {
        setMenuAbierto(menuAbierto === friendshipId ? null : friendshipId);
    };

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuAbierto(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Si está cargando
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Mis Amigos
                    </h3>
                    <div className="animate-pulse">
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <p className="text-gray-600">Cargando tu lista de amigos...</p>
                    <p className="text-gray-400 text-sm mt-1">Obteniendo información actualizada</p>
                </div>
            </div>
        );
    }

    // Si hay error
    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Mis Amigos
                    </h3>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <div>
                            <p className="text-red-700 font-medium">Error al cargar amigos</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                        <button
                            onClick={() => refetch()}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                        <Link
                            href="/explorar"
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Buscar amigos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay amigos
    if (amigos.length === 0) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Mis Amigos
                    </h3>
                    <span className="text-sm text-gray-500">0 amigos</span>
                </div>
                <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tu lista de amigos está vacía</h4>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Aún no tienes amigos agregados. Conecta con otros deportistas para comenzar a construir tu red.
                    </p>
                    <Link
                        href="/explorar"
                        className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Explorar deportistas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            {/* Encabezado con acordeón */}
            <button
                onClick={() => setAcordeonAbierto(!acordeonAbierto)}
                className="flex items-center justify-between w-full mb-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
                <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Mis Amigos</h3>
                    <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {amigos.length} {amigos.length === 1 ? 'amigo' : 'amigos'}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                        {acordeonAbierto ? 'Ocultar lista' : 'Mostrar lista'}
                    </span>
                    {acordeonAbierto ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>

            {/* Lista de amigos (acordeón) */}
            {acordeonAbierto && (
                <div className="space-y-3 mt-4">
                    {amigos.map((amigo) => (
                        <div
                            key={amigo.friendship_id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative group"
                        >
                            {/* Información del amigo */}
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                {/* Avatar */}
                                <Link
                                    href={`/perfil/${amigo.slug}`}
                                    className="flex-shrink-0 hover:opacity-90 transition-opacity"
                                >
                                    {amigo.urlphotoperfil_completa ? (
                                        <Image
                                            src={amigo.urlphotoperfil_completa}
                                            alt={`Foto de perfil de ${amigo.name_user}`}
                                            width={44}
                                            height={44}
                                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                                            unoptimized={true}
                                        />
                                    ) : (
                                        <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {amigo.name_user.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </Link>

                                {/* Nombre y detalles */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/perfil/${amigo.slug}`}
                                        className="block font-medium text-gray-900 hover:text-purple-600 truncate transition-colors"
                                    >
                                        {amigo.name_user}
                                    </Link>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Amigos desde {formatearFecha(amigo.friendship_since)}</span>
                                        </div>
                                        <div className="hidden sm:flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                            <UserCheck className="w-3 h-3" />
                                            <span className="text-xs">Amigo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de menú desplegable */}
                            <div className="flex-shrink-0 ml-4 relative" ref={menuRef}>
                                <button
                                    onClick={() => toggleMenu(amigo.friendship_id)}
                                    disabled={eliminando}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors group-hover:opacity-100 opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Opciones"
                                >
                                    {eliminando ? (
                                        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                                    ) : (
                                        <MoreVertical className="w-4 h-4 text-gray-600" />
                                    )}
                                </button>

                                {/* Menú desplegable */}
                                {menuAbierto === amigo.friendship_id && (
                                    <div
                                        className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] py-1 animate-in fade-in zoom-in-95"
                                    >
                                        <Link
                                            href={`/perfil/${amigo.slug}`}
                                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setMenuAbierto(null)}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Ver perfil completo</span>
                                        </Link>
                                        <button
                                            onClick={() => handleEliminarAmigo(amigo.id, amigo.name_user)}
                                            disabled={eliminando}
                                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <UserX className="w-4 h-4" />
                                            <span>{eliminando ? 'Eliminando...' : 'Eliminar de mis amigos'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Resumen cuando el acordeón está cerrado */}
            {!acordeonAbierto && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {amigos.slice(0, 4).map((amigo) => (
                            <Link
                                key={amigo.friendship_id}
                                href={`/perfil/${amigo.slug}`}
                                className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {amigo.urlphotoperfil_completa ? (
                                    <Image
                                        src={amigo.urlphotoperfil_completa}
                                        alt={amigo.name_user}
                                        width={44}
                                        height={44}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-purple-200 transition-colors"
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                                        {amigo.name_user.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-xs text-gray-700 mt-2 truncate max-w-full font-medium">
                                    {amigo.name_user.split(' ')[0]}
                                </span>
                            </Link>
                        ))}
                        {amigos.length > 4 && (
                            <button
                                onClick={() => setAcordeonAbierto(true)}
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-11 h-11 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-lg">+{amigos.length - 4}</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">Ver todos</span>
                            </button>
                        )}
                    </div>

                    {amigos.length > 4 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setAcordeonAbierto(true)}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline"
                            >
                                Ver todos los {amigos.length} amigos →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}