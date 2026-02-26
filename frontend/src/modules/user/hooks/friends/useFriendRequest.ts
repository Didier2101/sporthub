'use client';

import { useState, useCallback } from 'react';

export type EstadoSolicitudAmistad =
    | 'no_enviada'
    | 'enviando'
    | 'enviada'
    | 'pendiente'
    | 'aceptada'
    | 'rechazada'
    | 'amigos';

interface UseFriendRequestReturn {
    estado: EstadoSolicitudAmistad;
    isLoading: boolean;
    enviarSolicitudAmistad: (userId: number) => Promise<void>;
    verificarEstadoAmistad: (userId: number) => Promise<void>;
    cancelarSolicitud: (userId: number) => Promise<void>;
}

export function useFriendRequest(): UseFriendRequestReturn {
    const [estado, setEstado] = useState<EstadoSolicitudAmistad>('no_enviada');
    const [isLoading, setIsLoading] = useState(false);

    const verificarEstadoAmistad = useCallback(async (userId: number): Promise<void> => {
        try {
            setIsLoading(true);
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🔍 Verificando estado de amistad con userId:', userId);

            // Endpoint para verificar estado de amistad con un usuario específico
            const response = await fetch(`${API_BASE_URL}/friends/status/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log('📨 Respuesta de verificación:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Resultado verificación:', result);

                if (result.success) {
                    const estadoServidor = result.status || result.friendship_status || result.data?.status;

                    console.log('📊 Estado del servidor:', estadoServidor);

                    switch (estadoServidor) {
                        case 'pending':
                        case 'pendiente':
                            setEstado('pendiente');
                            break;
                        case 'accepted':
                        case 'aceptada':
                            setEstado('amigos');
                            break;
                        case 'rejected':
                        case 'rechazada':
                            setEstado('rechazada');
                            break;
                        case 'none':
                        case null:
                        case undefined:
                            setEstado('no_enviada');
                            break;
                        default:
                            console.warn('⚠️ Estado desconocido:', estadoServidor);
                            setEstado('no_enviada');
                    }
                } else {
                    // Si no hay relación de amistad
                    setEstado('no_enviada');
                }
            } else if (response.status === 404) {
                // Si no existe relación, es "no_enviada"
                setEstado('no_enviada');
            } else {
                console.error('❌ Error en verificación:', response.status);
                setEstado('no_enviada');
            }

        } catch (error) {
            console.error('💥 Error en verificación:', error);
            setEstado('no_enviada');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const enviarSolicitudAmistad = async (userId: number): Promise<void> => {
        try {
            setEstado('enviando');
            setIsLoading(true);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🚀 Enviando solicitud de amistad a userId:', userId);

            const payload = { friend_id: userId };

            const response = await fetch(`${API_BASE_URL}/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('📨 Respuesta de envío:', result);

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: No se pudo enviar la solicitud`);
            }

            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            // Solicitud enviada exitosamente
            setEstado('enviada');

            // Después de 1.5 segundos, cambia a estado pendiente
            setTimeout(() => {
                setEstado('pendiente');
            }, 1500);

        } catch (error) {
            console.error('💥 Error al enviar solicitud:', error);
            setEstado('no_enviada');

            // Re-lanzar el error para manejarlo en el componente
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const cancelarSolicitud = async (userId: number): Promise<void> => {
        try {
            setIsLoading(true);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🗑️ Cancelando solicitud a userId:', userId);

            const response = await fetch(`${API_BASE_URL}/friends/request/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const result = await response.json();
            console.log('📨 Respuesta de cancelación:', result);

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: No se pudo cancelar la solicitud`);
            }

            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            // Solicitud cancelada exitosamente
            setEstado('no_enviada');

        } catch (error) {
            console.error('💥 Error al cancelar solicitud:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        estado,
        isLoading,
        enviarSolicitudAmistad,
        verificarEstadoAmistad,
        cancelarSolicitud,
    };
}