// src/components/header/Notifications.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Trash2, RefreshCw, Clock, User, Calendar, UserPlus, X as CloseIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useNotifications } from '@/src/hooks/notificaciones/useNotifications';

interface NotificationsProps {
    variant?: 'desktop' | 'mobile';
}

export default function Notifications({ variant = 'desktop' }: NotificationsProps) {
    const {
        notifications,
        unreadCount,
        loading,
        dropdownOpen,
        openDropdown,
        closeDropdown,
        dropdownRef,
        buttonRef,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        acceptFriendRequest,
        rejectFriendRequest,
        loadNotifications,
        isProcessing,
    } = useNotifications();

    const getNotificationIcon = (tipo: string) => {
        switch (tipo) {
            case 'solicitud_amistad':
                return UserPlus;
            case 'invitacion_partido':
                return Calendar;
            default:
                return Bell;
        }
    };

    const getNotificationColor = (tipo: string) => {
        switch (tipo) {
            case 'solicitud_amistad':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'invitacion_partido':
                return 'bg-green-50 text-green-600 border-green-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const formatTime = (fecha: string) => {
        const date = new Date(fecha);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        return date.toLocaleDateString('es-ES');
    };

    return (
        <div className="relative">
            {/* Botón de la campanita */}
            <button
                ref={buttonRef}
                onClick={openDropdown}
                className={`relative p-2 rounded-full transition-all duration-200 ${variant === 'desktop'
                    ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                    } ${dropdownOpen ? 'bg-gray-100 text-gray-900 ring-2 ring-gray-200' : ''}`}
                aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
                aria-expanded={dropdownOpen}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panel de notificaciones */}
            <AnimatePresence>
                {dropdownOpen && (
                    <>
                        {/* Overlay para móvil */}
                        {variant === 'mobile' && (
                            <motion.div
                                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeDropdown}
                            />
                        )}

                        {/* Dropdown de notificaciones */}
                        <motion.div
                            ref={dropdownRef}
                            className={`absolute z-50 ${variant === 'desktop'
                                ? 'right-0 top-full mt-2 w-80 sm:w-96'
                                : 'fixed left-1/2 top-16 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-md'
                                } bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden`}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                                            <p className="text-sm text-gray-500">
                                                {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={loadNotifications}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            disabled={loading}
                                            title="Actualizar"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                        </button>

                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                title="Marcar todas como leídas"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}

                                        {notifications.length > 0 && (
                                            <button
                                                onClick={clearAll}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                title="Eliminar todas"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                        <button
                                            onClick={closeDropdown}
                                            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors ml-1"
                                            title="Cerrar notificaciones"
                                        >
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de notificaciones */}
                            <div className="max-h-[70vh] overflow-y-auto">
                                {loading && notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-rose-600 rounded-full animate-spin" />
                                        <p className="mt-3 text-sm text-gray-500">Cargando notificaciones...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h4 className="font-medium text-gray-900 mb-1">Sin notificaciones</h4>
                                        <p className="text-sm text-gray-500">Te avisaremos cuando tengas novedades</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => {
                                            const Icon = getNotificationIcon(notification.tipo);
                                            const colorClass = getNotificationColor(notification.tipo);
                                            const isPending = notification.estado === 'pendiente';
                                            const isFriendRequest = notification.tipo === 'solicitud_amistad';

                                            return (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${isPending ? 'bg-blue-50/30 border-l-blue-500' : 'border-l-transparent'
                                                        }`}
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Icono */}
                                                        <div className={`p-2 rounded-lg ${colorClass} border flex-shrink-0`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>

                                                        {/* Contenido */}
                                                        <div className="flex-1 min-w-0">
                                                            {/* Encabezado */}
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                                                    {notification.titulo}
                                                                </h4>
                                                                <div className="flex gap-1">
                                                                    {isPending && (
                                                                        <button
                                                                            onClick={() => markAsRead(notification.id)}
                                                                            className="p-1 hover:text-green-600 transition-colors"
                                                                            title="Marcar como leída"
                                                                        >
                                                                            <Check className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => removeNotification(notification.id)}
                                                                        className="p-1 hover:text-red-600 transition-colors"
                                                                        title="Eliminar notificación"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Descripción */}
                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                {notification.descripcion}
                                                            </p>

                                                            {/* Remitente clickable */}
                                                            {notification.remitente && (
                                                                <div className="mt-2">
                                                                    <Link
                                                                        href={`/perfil/${notification.remitente.slug}`}
                                                                        onClick={closeDropdown}
                                                                        className="inline-flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors group"
                                                                    >
                                                                        {notification.remitente.imagenes_webp?.[0]?.url_webp ? (
                                                                            <div className="relative w-6 h-6">
                                                                                <Image
                                                                                    src={notification.remitente.imagenes_webp[0].url_webp}
                                                                                    alt={notification.remitente.nombre}
                                                                                    fill
                                                                                    className="rounded-full object-cover"
                                                                                    unoptimized
                                                                                    sizes="24px"
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                                                                <User className="w-3 h-3 text-white" />
                                                                            </div>
                                                                        )}
                                                                        <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">
                                                                            {notification.remitente.nombre}
                                                                        </span>
                                                                    </Link>
                                                                </div>
                                                            )}

                                                            {/* Tiempo */}
                                                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                                                <Clock className="w-3 h-3" />
                                                                {formatTime(notification.fecha_envio)}
                                                            </div>

                                                            {/* Acciones para solicitudes de amistad */}
                                                            {isFriendRequest && isPending && (
                                                                <div className="flex gap-2 mt-3">
                                                                    <button
                                                                        onClick={() => acceptFriendRequest(notification.id)}
                                                                        disabled={isProcessing(notification.id)}
                                                                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-h-[32px]"
                                                                    >
                                                                        {isProcessing(notification.id) ? (
                                                                            <>
                                                                                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                                <span>Aceptando...</span>
                                                                            </>
                                                                        ) : (
                                                                            'Aceptar'
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => rejectFriendRequest(notification.id)}
                                                                        disabled={isProcessing(notification.id)}
                                                                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-h-[32px]"
                                                                    >
                                                                        {isProcessing(notification.id) ? (
                                                                            <>
                                                                                <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                                                <span>Rechazando...</span>
                                                                            </>
                                                                        ) : (
                                                                            'Rechazar'
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-gray-200 bg-gray-50">
                                    <button
                                        onClick={closeDropdown}
                                        className="w-full py-2 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                        Cerrar notificaciones
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}