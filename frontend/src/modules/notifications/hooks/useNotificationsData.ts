// src/hooks/useNotificationsData.ts
import { useState, useCallback, useEffect } from 'react';
import { fetchNotifications } from '@/src/services/notificationsService';

export interface Notification {
    id: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    estado: string;
    fecha_envio: string;
    tiempo_transcurrido: {
        texto: string;
        minutos: number;
        horas: number;
        dias: number;
    };
    remitente?: {
        id: number;
        nombre: string;
        slug: string;
        imagenes_webp: Array<{
            id: number;
            orden: number;
            url_webp: string;
            nombre: string;
            formato: string;
        }>;
        email: string;
        rol: string;
    };
    acciones_disponibles: string[];
    prioridad: string;
}

export const useNotificationsData = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchNotifications();

            if (data.success) {
                setNotifications(data.data);
            } else {
                setError(data.message || 'Error al cargar notificaciones');
            }
        } catch (err) {
            setError('Error de conexión al cargar notificaciones');
            console.error('Error loading notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id.toString() !== id));
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id.toString() === id
                    ? { ...notification, estado: 'leida' }
                    : notification
            )
        );
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    return {
        notifications,
        loading,
        error,
        loadNotifications,
        removeNotification,
        markAsRead,
    };
};