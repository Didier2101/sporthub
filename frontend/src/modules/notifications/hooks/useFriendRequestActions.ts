// src/hooks/useFriendRequestActions.ts
import { useState, useCallback } from 'react';
import { processFriendRequest } from '@/src/services/notificationsService';

export const useFriendRequestActions = () => {
    const [processing, setProcessing] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const acceptFriendRequest = useCallback(async (notificationId: string) => {
        try {
            setProcessing(prev => ({ ...prev, [notificationId]: true }));
            setError(null);

            const data = await processFriendRequest(notificationId, 'aceptar');

            if (!data.success) {
                throw new Error(data.message || 'Error al aceptar solicitud');
            }

            return { success: true, data };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al aceptar solicitud';
            setError(errorMessage);
            console.error('Error accepting friend request:', err);
            return { success: false, error: errorMessage };
        } finally {
            setProcessing(prev => ({ ...prev, [notificationId]: false }));
        }
    }, []);

    const rejectFriendRequest = useCallback(async (notificationId: string) => {
        try {
            setProcessing(prev => ({ ...prev, [notificationId]: true }));
            setError(null);

            const data = await processFriendRequest(notificationId, 'rechazar');

            if (!data.success) {
                throw new Error(data.message || 'Error al rechazar solicitud');
            }

            return { success: true, data };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al rechazar solicitud';
            setError(errorMessage);
            console.error('Error rejecting friend request:', err);
            return { success: false, error: errorMessage };
        } finally {
            setProcessing(prev => ({ ...prev, [notificationId]: false }));
        }
    }, []);

    const isProcessing = useCallback((notificationId: string) => {
        return processing[notificationId] || false;
    }, [processing]);

    return {
        acceptFriendRequest,
        rejectFriendRequest,
        isProcessing,
        error,
        processing,
    };
};