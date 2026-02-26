// src/services/notificationsService.ts

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// 1. Obtener todas las notificaciones
export const fetchNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/notificaciones/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener notificaciones');
    }

    return await response.json();
};

// 2. Obtener contador de notificaciones no leídas
export const fetchUnreadCount = async () => {
    const response = await fetch(`${API_BASE_URL}/notificaciones/contador`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener contador de notificaciones');
    }

    return await response.json();
};

// 3. Procesar solicitud de amistad (aceptar/rechazar)
export const processFriendRequest = async (notificationId: string, action: 'aceptar' | 'rechazar') => {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${notificationId}/procesar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            accion: action,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error al ${action} solicitud de amistad`);
    }

    return await response.json();
};