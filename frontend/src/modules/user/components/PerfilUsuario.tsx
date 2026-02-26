'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Phone, Mail, Trophy, Users, Star, Award, Target, Activity, UserCheck, Loader2 } from 'lucide-react';
import type { PerfilUsuario as PerfilUsuarioType } from '@/src/hooks/users/useGetPerfilUsuario';
import BotonSolicitudAmistad from './BotonSolicitudAmistad';
import BotonEliminarAmigo from './BotonEliminarAmigo';
import { useFriendRequest } from '@/src/hooks/users/friends/useFriendRequest';

interface PerfilUsuarioProps {
    perfil: PerfilUsuarioType | null;
    isLoading?: boolean;
}

// Definir los tipos de estado para el botón (excluyendo 'aceptada' y 'amigos')
type EstadoBotonAmistad = 'no_enviada' | 'enviando' | 'enviada' | 'pendiente' | 'rechazada';

export default function PerfilUsuario({ perfil, isLoading = false }: PerfilUsuarioProps) {
    const { estado, isLoading: isLoadingEstado, enviarSolicitudAmistad, verificarEstadoAmistad, cancelarSolicitud } = useFriendRequest();
    const [verificandoAmistad, setVerificandoAmistad] = useState(true);
    const [estadoBoton, setEstadoBoton] = useState<EstadoBotonAmistad>('no_enviada');

    // Verificar estado de amistad al cargar el componente y actualizar estadoBoton
    useEffect(() => {
        const verificarEstado = async () => {
            if (perfil?.id) {
                setVerificandoAmistad(true);
                try {
                    await verificarEstadoAmistad(perfil.id);
                } catch (error) {
                    console.error('Error verificando amistad:', error);
                } finally {
                    setVerificandoAmistad(false);
                }
            }
        };

        verificarEstado();
    }, [perfil?.id, verificarEstadoAmistad]);

    // Mapear el estado del hook al estado del botón
    useEffect(() => {
        switch (estado) {
            case 'no_enviada':
            case 'enviando':
            case 'enviada':
            case 'pendiente':
            case 'rechazada':
                setEstadoBoton(estado);
                break;
            case 'aceptada':
            case 'amigos':
                // Para estos estados, el botón será de "Eliminar amigo"
                setEstadoBoton('no_enviada');
                break;
            default:
                setEstadoBoton('no_enviada');
        }
    }, [estado]);

    // Si no hay perfil, no renderizar nada
    if (!perfil) {
        return null;
    }

    // Si está cargando, mostrar skeleton loader
    if (isLoading) {
        return <PerfilUsuarioSkeleton />;
    }

    const calcularEdad = (fechanacimiento?: string) => {
        if (!fechanacimiento) return null;
        try {
            const nacimiento = new Date(fechanacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        } catch {
            return null;
        }
    };

    const edad = perfil.edad || calcularEdad(perfil.fechanacimiento);

    // Obtener URL de la imagen de perfil
    const getFotoPerfil = () => {
        if (perfil.urlphotoperfil) {
            return perfil.urlphotoperfil;
        }

        if (perfil.imagenes_webp && perfil.imagenes_webp.length > 0) {
            const imagenesOrdenadas = [...perfil.imagenes_webp].sort((a, b) => (a.orden || 0) - (b.orden || 0));
            return imagenesOrdenadas[0].url_webp;
        }

        return null;
    };

    const fotoPerfil = getFotoPerfil();

    // Formatear fecha de creación
    const formatearFecha = (fecha: string) => {
        try {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return fecha;
        }
    };

    // Manejador para enviar solicitud
    const handleEnviarSolicitud = async () => {
        if (!perfil?.id) return;

        try {
            await enviarSolicitudAmistad(perfil.id);
            // La actualización del estado se maneja en el hook
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    // Manejador para cancelar solicitud
    const handleCancelarSolicitud = async () => {
        if (!perfil?.id) return;

        try {
            await cancelarSolicitud(perfil.id);
            // La actualización del estado se maneja en el hook
        } catch (error) {
            console.error('Error al cancelar solicitud:', error);
        }
    };

    // Renderizar botón según el estado de amistad
    const renderBotonAmistad = () => {
        if (verificandoAmistad) {
            return (
                <div className="px-6 py-3 rounded-full bg-gray-400 text-white flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Verificando...</span>
                </div>
            );
        }

        // Si son amigos, mostrar botón de eliminar
        if (estado === 'amigos' || estado === 'aceptada') {
            return (
                <BotonEliminarAmigo
                    userId={perfil.id}
                    nombreAmigo={perfil.name_user}
                />
            );
        }

        // En otros estados, mostrar el botón de solicitud normal
        return (
            <BotonSolicitudAmistad
                userId={perfil.id}
                estado={estadoBoton}
                isLoading={isLoadingEstado}
                onClick={async () => {
                    if (estadoBoton === 'no_enviada' || estadoBoton === 'rechazada') {
                        await handleEnviarSolicitud();
                    } else if (estadoBoton === 'pendiente') {
                        await handleCancelarSolicitud();
                    }
                }}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header del perfil */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 md:p-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Avatar */}
                        <div className="relative">
                            {fotoPerfil ? (
                                <Image
                                    src={fotoPerfil}
                                    alt={`Foto de perfil de ${perfil.name_user}`}
                                    width={128}
                                    height={128}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
                                    unoptimized={true}
                                    priority
                                />
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center border-4 border-white/30 shadow-xl">
                                    <Users className="w-12 h-12 text-white" />
                                </div>
                            )}

                            {/* Badge de estado */}
                            {perfil.is_profile_completed && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                    Perfil Completo
                                </div>
                            )}

                            {/* Badge de amigo */}
                            {!verificandoAmistad && (estado === 'amigos' || estado === 'aceptada') && (
                                <div className="absolute -bottom-2 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                                    <UserCheck className="w-3 h-3" />
                                    <span>Amigo</span>
                                </div>
                            )}
                        </div>

                        {/* Información principal */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="mb-4">
                                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                                    {perfil.name_user}
                                </h1>
                                <div className="inline-flex items-center bg-white/20 px-4 py-1 rounded-full">
                                    <span className="text-sm md:text-base">
                                        {perfil.role || 'Usuario'} • Miembro desde {formatearFecha(perfil.created_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-rose-100 text-lg md:text-xl font-medium">
                                    {perfil.sport || 'Deportista'} {perfil.position && `• ${perfil.position}`}
                                </p>
                            </div>

                            {/* Información básica en badges */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {perfil.city && (
                                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{perfil.city}</span>
                                    </div>
                                )}

                                {perfil.status && perfil.status !== 'inactive' && (
                                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-sm capitalize">{perfil.status}</span>
                                    </div>
                                )}

                                {perfil.terms && (
                                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                                        <Award className="w-4 h-4" />
                                        <span className="text-sm">Términos Aceptados</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex-shrink-0 mt-4 md:mt-0">
                            {renderBotonAmistad()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información personal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Información de contacto */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                Información Personal
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-rose-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900 font-medium">{perfil.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Teléfono */}
                                {perfil.telephone && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-rose-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="text-gray-900 font-medium">{perfil.telephone}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Ciudad */}
                                {perfil.city && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-rose-50 rounded-lg">
                                                <MapPin className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ciudad</p>
                                                <p className="text-gray-900 font-medium">{perfil.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Edad */}
                                {edad && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-rose-50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Edad</p>
                                                <p className="text-gray-900 font-medium">{edad} años</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fecha de nacimiento */}
                                {perfil.fechanacimiento && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-rose-50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                                                <p className="text-gray-900 font-medium">
                                                    {new Date(perfil.fechanacimiento).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Biografía */}
                        {perfil.biography && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    Sobre Mí
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {perfil.biography}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha - Información deportiva y detalles */}
                    <div className="space-y-8">
                        {/* Deporte y posición */}
                        {(perfil.sport || perfil.position) && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    Deporte
                                </h2>

                                <div className="space-y-4">
                                    {perfil.sport && (
                                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Deporte Principal</span>
                                                <Target className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <p className="text-lg font-bold text-rose-700">{perfil.sport}</p>
                                        </div>
                                    )}

                                    {perfil.position && (
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">Posición</span>
                                                <Trophy className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <p className="text-lg font-bold text-blue-700">{perfil.position}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Detalles del perfil */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                Detalles del Perfil
                            </h2>

                            <div className="space-y-4">
                                {/* Slug */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">URL única</p>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <code className="text-gray-900 font-mono text-sm break-all">
                                            /perfil/{perfil.slug}
                                        </code>
                                    </div>
                                </div>

                                {/* Última actualización */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Última actualización</p>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 font-medium">
                                            {formatearFecha(perfil.updated_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Estado de la cuenta</p>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${perfil.status === 'active' ? 'bg-green-100 text-green-800' :
                                        perfil.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {perfil.status || 'No especificado'}
                                    </div>
                                </div>

                                {/* Imágenes */}
                                {perfil.imagenes_webp && perfil.imagenes_webp.length > 0 && (
                                    <div className="space-y-2 pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">Imágenes del perfil</p>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-gray-900 font-medium">
                                                {perfil.imagenes_webp.length} imagen(es)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Espacio para futuras features */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 text-center">
                        Más Información Próximamente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
                            <Trophy className="w-8 h-8 text-rose-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 mb-2">Estadísticas</h4>
                            <p className="text-gray-600 text-sm">
                                Próximamente podrás ver estadísticas detalladas de partidos
                            </p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                            <Star className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 mb-2">Valoraciones</h4>
                            <p className="text-gray-600 text-sm">
                                Ver valoraciones y comentarios de otros jugadores
                            </p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                            <Activity className="w-8 h-8 text-green-600 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 mb-2">Actividad</h4>
                            <p className="text-gray-600 text-sm">
                                Historial de partidos y eventos deportivos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente Skeleton para loading
function PerfilUsuarioSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
            {/* Header skeleton */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white/30"></div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-white/30 rounded w-3/4"></div>
                            <div className="h-4 bg-white/30 rounded w-1/2"></div>
                            <div className="flex space-x-2">
                                <div className="h-6 bg-white/30 rounded-full w-24"></div>
                                <div className="h-6 bg-white/30 rounded-full w-24"></div>
                            </div>
                        </div>
                        <div className="h-12 bg-white/30 rounded-full w-40"></div>
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}