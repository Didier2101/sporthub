// hooks/useComments.ts
import { useState, useCallback } from 'react';

export interface Comment {
    id: number;
    post_id: number;
    usuario_id: number;
    contenido: string;
    created_at: string;
    usuario: {
        id: number;
        name_user: string;
        urlphotoperfil: string | null;
    };
    total_likes: number;
    liked_by_user?: boolean;
}

interface UseCommentsResult {
    comments: Comment[];
    loading: boolean;
    error: string | null;
    fetchComments: (postId: number) => Promise<void>;
    addComment: (postId: number, contenido: string) => Promise<boolean>;
    likeComment: (comentarioId: number) => Promise<boolean>;
}

export function useComments(): UseCommentsResult {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async (postId: number) => {
        try {
            console.log('📋 [useComments] Obteniendo comentarios del post:', postId);
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/comentarios`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar los comentarios');
            }

            const data = await response.json();
            console.log('✅ [useComments] Comentarios recibidos:', data);

            setComments(data.comentarios || []);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [useComments] Error obteniendo comentarios:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addComment = async (postId: number, contenido: string): Promise<boolean> => {
        try {
            console.log('💬 [useComments] Agregando comentario al post:', postId);
            console.log('📝 [useComments] Contenido:', contenido);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/comentarios`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ contenido }),
                }
            );

            if (!response.ok) {
                throw new Error('Error al agregar el comentario');
            }

            const data = await response.json();
            console.log('✅ [useComments] Comentario agregado:', data);

            // Agregar el comentario a la lista
            setComments(prev => [...prev, data.comentario]);

            return true;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [useComments] Error agregando comentario:', err);
            return false;
        }
    };

    const likeComment = async (comentarioId: number): Promise<boolean> => {
        try {
            console.log('❤️ [useComments] Toggle like en comentario:', comentarioId);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/comentarios/${comentarioId}/like`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Error al dar like al comentario');
            }

            const data = await response.json();
            console.log('✅ [useComments] Like actualizado:', data);

            // Actualizar el estado del comentario
            setComments(prev =>
                prev.map(comment =>
                    comment.id === comentarioId
                        ? {
                            ...comment,
                            liked_by_user: data.liked,
                            total_likes: data.liked
                                ? (comment.total_likes || 0) + 1
                                : Math.max((comment.total_likes || 0) - 1, 0),
                        }
                        : comment
                )
            );

            return true;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [useComments] Error dando like:', err);
            return false;
        }
    };

    return {
        comments,
        loading,
        error,
        fetchComments,
        addComment,
        likeComment,
    };
}