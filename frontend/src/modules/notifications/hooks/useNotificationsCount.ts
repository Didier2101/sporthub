// src/hooks/useNotificationsCount.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchUnreadCount } from '@/src/services/notificationsService';

export const useNotificationsCount = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCount = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchUnreadCount();

            if (data.success) {
                setCount(data.data.total_pendientes || 0);
            } else {
                setError(data.message || 'Error al cargar contador');
                setCount(0);
            }
        } catch (err) {
            setError('Error de conexión');
            setCount(0);
            console.error('Error loading notification count:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCount = useCallback((newCount: number) => {
        setCount(newCount);
    }, []);

    const decrementCount = useCallback(() => {
        setCount(prev => Math.max(0, prev - 1));
    }, []);

    const incrementCount = useCallback(() => {
        setCount(prev => prev + 1);
    }, []);

    const resetCount = useCallback(() => {
        setCount(0);
    }, []);

    useEffect(() => {
        loadCount();
    }, [loadCount]);

    return {
        count,
        loading,
        error,
        loadCount,
        updateCount,
        decrementCount,
        incrementCount,
        resetCount,
    };
};