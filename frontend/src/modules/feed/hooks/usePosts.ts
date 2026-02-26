import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/axios';
import { Post } from '@/src/modules/feed/types';
export type { Post };
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for API response
interface ApiResponse {
    success: boolean;
    data: Post[];
    paginacion: {
        total_posts: number;
        total_paginas: number;
    };
}

// Fetch function
const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await api.get<ApiResponse>('/posts/obtener_post');

    if (!data.success) throw new Error('Error al cargar posts');

    // Process data (add base URL to images)
    return data.data.map(post => ({
        ...post,
        imagen_url: post.imagen_url_accesible ? `${API_BASE_URL}${post.imagen_url_accesible}` : null,
        usuario: {
            ...post.usuario,
            urlphotoperfil: post.usuario.urlphotoperfil?.startsWith('http')
                ? post.usuario.urlphotoperfil
                : post.usuario.urlphotoperfil ? `${API_BASE_URL}${post.usuario.urlphotoperfil}` : null
        }
    }));
};

// Professional Hook
export function usePosts() {
    const queryClient = useQueryClient();

    // Query: Fetching
    const query = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    // Mutation: Like
    const likeMutation = useMutation({
        mutationFn: (postId: number) => api.post(`/posts/${postId}/like`),
        onSuccess: (response, postId) => {
            // Optimistic update or refetch
            queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, total_likes: response.data.total_likes }
                        : post
                );
            });
            toast.success('¡Te gusta esto!');
        }
    });

    // Mutation: Delete
    const deleteMutation = useMutation({
        mutationFn: (postId: number) => api.delete(`/posts/${postId}`),
        onSuccess: (_, postId) => {
            queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
                return old?.filter(post => post.id !== postId);
            });
            toast.success('Publicación eliminada');
        }
    });

    return {
        posts: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        likePost: likeMutation.mutate,
        isLiking: likeMutation.isPending,
        deletePost: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending
    };
}