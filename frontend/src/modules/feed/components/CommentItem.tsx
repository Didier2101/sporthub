'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { Comment } from '@/src/modules/feed/hooks/useComments';

interface CommentItemProps {
    comment: Comment;
    onLike: (comentarioId: number) => Promise<void>;
}

export default function CommentItem({ comment, onLike }: CommentItemProps) {
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(comment.liked_by_user || false);
    const [localLikes, setLocalLikes] = useState(comment.total_likes || 0);

    console.log('💬 [CommentItem] Renderizando comentario:', comment);

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    const handleLike = async () => {
        if (isLiking) return;

        console.log('❤️ [CommentItem] Dando like al comentario:', comment.id);
        setIsLiking(true);

        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);
        setLocalLikes(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            await onLike(comment.id);
            console.log('✅ [CommentItem] Like procesado exitosamente');
        } catch (error) {
            console.error('❌ [CommentItem] Error al dar like:', error);
            setHasLiked(!newLikedState);
            setLocalLikes(prev => newLikedState ? prev - 1 : prev + 1);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <div className="flex space-x-3 py-3 border-b border-gray-200">
            {/* Avatar del usuario */}
            <div className="flex-shrink-0 ">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow">
                    {comment.usuario?.urlphotoperfil ? (
                        <Image
                            src={comment.usuario.urlphotoperfil}
                            width={40}
                            height={40}
                            alt={`Avatar de ${comment.usuario.name_user || 'Usuario'}`}
                            className="rounded-full object-cover w-full h-full"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                    const nombre = comment.usuario?.name_user || 'U';
                                    parent.innerHTML = `<span class="text-white font-bold text-sm">${nombre.charAt(0).toUpperCase()}</span>`;
                                }
                            }}
                        />
                    ) : (
                        <span className="text-white font-bold text-sm">
                            {(comment.usuario?.name_user || 'U').charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
            </div>

            {/* Contenido del comentario */}
            <div className="flex-1 min-w-0">
                <div className=" ">
                    <p className="font-semibold text-sm text-gray-900">
                        {comment.usuario?.name_user || 'Usuario'}
                    </p>
                    <p className="text-gray-800 text-sm mt-1 break-words">
                        {comment.contenido}
                    </p>
                </div>

                {/* Acciones del comentario */}
                <div className="flex items-center space-x-4 mt-1 px-2">
                    <span className="text-xs text-gray-500">
                        {formatFecha(comment.created_at)}
                    </span>

                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center space-x-1 text-xs font-medium transition-colors ${hasLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            } disabled:opacity-50`}
                    >
                        <Heart
                            className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-600' : ''}`}
                        />
                        <span>{localLikes > 0 ? localLikes : 'Me gusta'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}