// src/hooks/useNotifications.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotificationsData } from './useNotificationsData';
import { useNotificationsCount } from './useNotificationsCount';
import { useFriendRequestActions } from './useFriendRequestActions';

export const useNotifications = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const notificationsData = useNotificationsData();
    const countData = useNotificationsCount();
    const friendRequestActions = useFriendRequestActions();

    // Definir closeDropdown antes del useEffect para poder incluirlo en las dependencias
    const closeDropdown = useCallback(() => {
        setDropdownOpen(false);
    }, []);

    // Cerrar dropdown al hacer click fuera o al presionar ESC
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeDropdown();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [dropdownOpen, closeDropdown]);

    const toggleDropdown = useCallback(() => {
        setDropdownOpen(prev => !prev);
        if (!dropdownOpen) {
            notificationsData.loadNotifications();
            countData.loadCount();
        }
    }, [dropdownOpen, notificationsData, countData]);

    const openDropdown = useCallback(() => {
        setDropdownOpen(true);
        notificationsData.loadNotifications();
        countData.loadCount();
    }, [notificationsData, countData]);

    const handleAcceptFriendRequest = useCallback(async (notificationId: string) => {
        const result = await friendRequestActions.acceptFriendRequest(notificationId);

        if (result.success) {
            notificationsData.markAsRead(notificationId);
            notificationsData.loadNotifications();
            countData.decrementCount();
            closeDropdown(); // Cerrar después de aceptar
        }

        return result;
    }, [friendRequestActions, notificationsData, countData, closeDropdown]);

    const handleRejectFriendRequest = useCallback(async (notificationId: string) => {
        const result = await friendRequestActions.rejectFriendRequest(notificationId);

        if (result.success) {
            notificationsData.removeNotification(notificationId);
            countData.decrementCount();
            closeDropdown(); // Cerrar después de rechazar
        }

        return result;
    }, [friendRequestActions, notificationsData, countData, closeDropdown]);

    const handleMarkAsRead = useCallback((notificationId: string) => {
        notificationsData.markAsRead(notificationId);
        countData.decrementCount();
    }, [notificationsData, countData]);

    const handleRemoveNotification = useCallback((notificationId: string) => {
        const notification = notificationsData.notifications.find(
            n => n.id.toString() === notificationId
        );

        notificationsData.removeNotification(notificationId);

        if (notification && notification.estado === 'pendiente') {
            countData.decrementCount();
        }
    }, [notificationsData, countData]);

    const handleMarkAllAsRead = useCallback(() => {
        notificationsData.notifications.forEach(notification => {
            if (notification.estado === 'pendiente') {
                notificationsData.markAsRead(notification.id.toString());
            }
        });
        countData.resetCount();
        closeDropdown(); // Cerrar después de marcar todas
    }, [notificationsData, countData, closeDropdown]);

    const handleClearAll = useCallback(() => {
        notificationsData.loadNotifications();
        countData.resetCount();
        closeDropdown(); // Cerrar después de limpiar
    }, [notificationsData, countData, closeDropdown]);

    return {
        // Estados y refs
        dropdownOpen,
        dropdownRef,
        buttonRef,

        // Datos
        notifications: notificationsData.notifications,
        unreadCount: countData.count,
        loading: notificationsData.loading || countData.loading,
        error: notificationsData.error || countData.error || friendRequestActions.error,

        // Métodos de UI
        toggleDropdown,
        openDropdown,
        closeDropdown,

        // Métodos de datos
        loadNotifications: notificationsData.loadNotifications,
        loadCount: countData.loadCount,

        // Acciones
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        removeNotification: handleRemoveNotification,
        clearAll: handleClearAll,
        acceptFriendRequest: handleAcceptFriendRequest,
        rejectFriendRequest: handleRejectFriendRequest,
        isProcessing: friendRequestActions.isProcessing,
    };
};