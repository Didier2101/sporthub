'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, User as UserIcon } from 'lucide-react';
import { Post } from '@/src/modules/feed/types';
import CommentsSection from './CommentsSection';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { cn } from '@/shared/utils/cn';
import { ui } from '@/shared/utils/ui';
import Image from 'next/image';

interface PostCardProps {
    post: Post;
    onLike: (postId: number) => void;
    onDelete: (postId: number) => void;
}

export default function PostCard({
    post,
    onLike,
    onDelete,
}: PostCardProps) {
    const currentUserEmail = useAuthStore(state => state.user?.email);
    const [showComments, setShowComments] = useState(false);
    const [localLiked, setLocalLiked] = useState(false);

    const esDelUsuarioActual = currentUserEmail === post.usuario.email;
    const imagenPrincipal = post.imagen_url;

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMs / 3600000);
        if (diffHours < 24) return `${diffHours}h`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const handleLike = () => {
        setLocalLiked(!localLiked);
        onLike(post.id);
    };

    const handleDelete = async () => {
        const result = await ui.confirm('¿Eliminar publicación?', 'Esta acción no se puede deshacer.');
        if (result.isConfirmed) {
            onDelete(post.id);
        }
    };

    return (
        <div className="glass-card !border-slate-200/60 overflow-hidden mb-6 group animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-primary-50 border-2 border-primary-100 ring-2 ring-transparent group-hover:ring-primary-100 transition-all">
                        {post.usuario.urlphotoperfil ? (
                            <Image
                                src={post.usuario.urlphotoperfil}
                                alt={post.usuario.name_user}
                                width={44} height={44}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary-600">
                                <UserIcon size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-none flex items-center gap-1.5">
                            {post.usuario.name_user}
                            <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                            <span className="text-xs font-medium text-slate-400">{formatFecha(post.created_at)}</span>
                        </h4>
                        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mt-1">Atleta</p>
                    </div>
                </div>

                {esDelUsuarioActual && (
                    <button
                        onClick={handleDelete}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Content */}
            {post.contenido && (
                <div className="px-5 pb-4">
                    <p className="text-slate-700 leading-relaxed text-[15px]">
                        {post.contenido}
                    </p>
                </div>
            )}

            {/* Media */}
            {post.tipo_post === 'foto' && imagenPrincipal && (
                <div className="relative aspect-[4/5] sm:aspect-video w-full bg-slate-100 overflow-hidden">
                    <Image
                        src={imagenPrincipal}
                        alt="Post media"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
            )}

            {/* Actions Bar */}
            <div className="p-3 flex items-center justify-between border-t border-slate-100/60">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300",
                            localLiked ? "bg-rose-50 text-rose-600" : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <Heart size={22} className={cn(localLiked && "fill-rose-600 animate-bounce")} />
                        <span className="text-sm font-bold">{post.total_likes + (localLiked ? 1 : 0)}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold"
                    >
                        <MessageCircle size={22} />
                        <span className="text-sm">{post.total_comentarios}</span>
                    </button>
                </div>

                <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Comments Section */}
            <CommentsSection postId={post.id} isOpen={showComments} onClose={() => setShowComments(false)} />
        </div>
    );
}