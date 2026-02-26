// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { FaEdit, FaMapMarkerAlt, FaCalendarAlt, FaFutbol, FaTrophy, FaUsers, FaPlus, FaPhone, FaUser, FaRunning, FaList, FaUserFriends, FaGamepad, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useGetCurrentUser } from '@/src/hooks/perfil/useGetCurrentUser';
import ListaAmigos from './ListaAmigos';


// Definir los tabs disponibles
type TabType = 'general' | 'amigos' | 'actividad' | 'estadisticas';

export default function Perfil() {
    const { userData, isLoading, error, refetch } = useGetCurrentUser();
    const [tabActivo, setTabActivo] = useState<TabType>('general');

    // ✅ Función para formatear la fecha de creación
    const getMemberSince = () => {
        if (!userData?.created_at) return '2024';

        try {
            const date = new Date(userData.created_at);
            return date.getFullYear().toString();
        } catch {
            return '2024';
        }
    };

    // ✅ Obtener inicial para avatar
    const getInitial = () => {
        return userData?.name_user?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || 'U';
    };

    // ✅ Mostrar imagen de perfil o avatar por defecto
    const renderProfileImage = () => {
        const imageUrl = userData?.urlphotoperfil_completa;

        if (imageUrl && imageUrl.trim() !== '') {
            return (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                    <Image
                        src={imageUrl}
                        alt="Imagen de perfil"
                        fill
                        className="rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                            console.error('❌ Error al cargar imagen de perfil:', imageUrl);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl shadow-md">
                                        ${getInitial()}
                                    </div>
                                `;
                            }
                        }}
                    />
                </div>
            );
        }

        // Avatar por defecto con inicial
        return (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl shadow-md">
                {getInitial()}
            </div>
        );
    };

    // ✅ Estado de loading
    if (isLoading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando perfil...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Estado de error
    if (error && !userData) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center max-w-md w-full">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                            <p className="text-red-600 mb-4 text-sm sm:text-base">Error al cargar el perfil: {error}</p>
                            <button
                                onClick={() => refetch()}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Si no hay usuario
    if (!userData) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">No se pudo cargar la información del usuario</p>
                        <Link href="/login" className="text-green-600 hover:underline text-sm sm:text-base">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar contenido según el tab activo
    const renderContenidoTab = () => {
        switch (tabActivo) {
            case 'general':
                return (
                    <>
                        {/* Información básica */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                            {/* Información Personal */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                                    <FaUser className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                                    Información Personal
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 flex items-center text-sm sm:text-base">
                                            <FaRunning className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                                            Deporte favorito:
                                        </span>
                                        <span className={`font-medium text-sm sm:text-base capitalize ${userData.sport ? 'text-green-600' : 'text-gray-400'}`}>
                                            {userData.sport || 'No especificado'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 text-sm sm:text-base">Posición:</span>
                                        <span className={`font-medium text-sm sm:text-base capitalize ${userData.position ? 'text-green-600' : 'text-gray-400'}`}>
                                            {userData.position || 'No especificada'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 flex items-center text-sm sm:text-base">
                                            <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                                            Teléfono:
                                        </span>
                                        <span className={`font-medium text-sm sm:text-base ${userData.telephone ? 'text-green-600' : 'text-gray-400'}`}>
                                            {userData.telephone || 'No especificado'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 text-sm sm:text-base">Fecha de nacimiento:</span>
                                        <span className={`font-medium text-sm sm:text-base ${userData.fechanacimiento ? 'text-green-600' : 'text-gray-400'}`}>
                                            {userData.fechanacimiento ? new Date(userData.fechanacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1 sm:gap-0">
                                        <span className="text-gray-600 text-sm sm:text-base">Estado del perfil:</span>
                                        <span className={`font-medium text-sm sm:text-base ${userData.is_profile_completed ? 'text-green-600' : 'text-amber-600'}`}>
                                            {userData.is_profile_completed ? 'Completado' : 'Incompleto'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Biografía */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Biografía</h3>
                                {userData.biography && userData.biography !== "sin bio" ? (
                                    <div>
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{userData.biography}</p>
                                        <p className="text-xs text-gray-500 mt-2 text-right">
                                            {userData.biography.length}/500 caracteres
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-400 italic mb-3 text-sm sm:text-base">Aún no has añadido una biografía...</p>
                                        <Link
                                            href="/profile/edit"
                                            className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                                        >
                                            <FaPlus className="w-3 h-3" />
                                            <span>Añadir biografía</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Partidos Jugados</p>
                                        <p className="text-xl sm:text-2xl font-bold text-blue-900">0</p>
                                    </div>
                                    <FaFutbol className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                                </div>
                                <p className="text-blue-500 text-xs mt-2">Comienza a jugar para ver estadísticas</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg border border-green-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Victorias</p>
                                        <p className="text-xl sm:text-2xl font-bold text-green-900">0</p>
                                    </div>
                                    <FaTrophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-300" />
                                </div>
                                <p className="text-green-500 text-xs mt-2">Registra tus primeros partidos</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg border border-purple-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium">Amigos</p>
                                        <p className="text-xl sm:text-2xl font-bold text-purple-900">0</p>
                                    </div>
                                    <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />
                                </div>
                                <p className="text-purple-500 text-xs mt-2">Conecta con otros deportistas</p>
                            </div>
                        </div>

                        {/* Actividad reciente */}
                        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
                            <div className="text-center py-6 sm:py-8">
                                <FaFutbol className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm sm:text-base">Aún no tienes actividad registrada</p>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1">Únete a partidos y eventos para ver tu actividad aquí</p>
                            </div>
                        </div>
                    </>
                );

            case 'amigos':
                return (
                    <div className="space-y-6">
                        {/* Encabezado de amigos */}
                        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                                        <FaUserFriends className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
                                        Mis Amigos
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Gestiona tu lista de amigos deportistas
                                    </p>
                                </div>
                                <div className="bg-purple-100 text-purple-800 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                                    <FaUsers className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Componente Lista de Amigos */}
                        <ListaAmigos />

                        {/* Estadísticas de amigos */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <FaUserFriends className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Amigos Totales</p>
                                        <p className="text-2xl font-bold text-gray-900">0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                        <FaGamepad className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Amigos en juego</p>
                                        <p className="text-2xl font-bold text-gray-900">0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                        <FaHistory className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Actividad reciente</p>
                                        <p className="text-2xl font-bold text-gray-900">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recomendaciones */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Encuentra nuevos amigos</h3>
                            <div className="text-center py-6">
                                <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-4">Explora otros deportistas con tus mismos intereses</p>
                                <Link
                                    href="/explorar"
                                    className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <FaUserFriends className="w-4 h-4 mr-2" />
                                    Explorar deportistas
                                </Link>
                            </div>
                        </div>
                    </div>
                );

            case 'actividad':
                return (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Actividad</h3>
                        <div className="text-center py-12">
                            <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Aún no tienes actividad registrada</p>
                            <p className="text-gray-400 mb-6">
                                Tus partidos, eventos y logros aparecerán aquí
                            </p>
                            <Link
                                href="/canchas"
                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                <FaFutbol className="w-4 h-4 mr-2" />
                                Encontrar partidos
                            </Link>
                        </div>
                    </div>
                );

            case 'estadisticas':
                return (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Detalladas</h3>
                        <div className="text-center py-12">
                            <FaTrophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Estadísticas en desarrollo</p>
                            <p className="text-gray-400 mb-6">
                                Pronto podrás ver estadísticas detalladas de tus partidos y rendimiento
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header del perfil */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex flex-col xs:flex-row xs:items-center space-y-3 xs:space-y-0 xs:space-x-4">
                    <div className="flex justify-center xs:justify-start">
                        {renderProfileImage()}
                    </div>
                    <div className="text-center xs:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                            {userData.name_user || 'Usuario Sin Nombre'}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1 break-words">{userData.email}</p>
                        <div className="flex flex-wrap justify-center xs:justify-start gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                            {userData.city ? (
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    <span className="truncate max-w-[120px] sm:max-w-none capitalize">{userData.city}</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                                    <span className="text-gray-400">No especificado</span>
                                </div>
                            )}

                            <div className="flex items-center">
                                <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span>Miembro desde {getMemberSince()}</span>
                            </div>

                            {userData.edad && (
                                <div className="flex items-center">
                                    <FaUser className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    <span>{userData.edad} años</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center sm:justify-end space-x-2">
                    <Link
                        href="/profile/edit"
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Editar Perfil</span>
                    </Link>
                </div>
            </div>

            {/* Navegación por tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px">
                        <button
                            onClick={() => setTabActivo('general')}
                            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${tabActivo === 'general'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FaList className="w-4 h-4 mr-2" />
                            General
                        </button>

                        <button
                            onClick={() => setTabActivo('amigos')}
                            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${tabActivo === 'amigos'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FaUserFriends className="w-4 h-4 mr-2" />
                            Amigos
                        </button>

                        <button
                            onClick={() => setTabActivo('actividad')}
                            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${tabActivo === 'actividad'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FaHistory className="w-4 h-4 mr-2" />
                            Actividad
                        </button>

                        <button
                            onClick={() => setTabActivo('estadisticas')}
                            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${tabActivo === 'estadisticas'
                                ? 'border-orange-600 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FaTrophy className="w-4 h-4 mr-2" />
                            Estadísticas
                        </button>
                    </nav>
                </div>
            </div>

            {/* Contenido del tab activo */}
            {renderContenidoTab()}

            {/* Botón para refrescar datos */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => refetch()}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <span>Actualizar información</span>
                </button>
            </div>
        </div>
    );
}