'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComments } from '@/src/modules/feed/hooks/useComments';
import { useAuthStore } from '@shared/store/useAuthStore';
import Image from 'next/image';
import CommentItem from './CommentItem';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

interface CommentsSectionProps {
    postId: number;
    isOpen: boolean;
    onClose?: () => void;
    onCommentAdded?: () => void;
}

export default function CommentsSection({
    postId,
    isOpen,
    onClose,
    onCommentAdded,
}: CommentsSectionProps) {
    const { user } = useAuthStore();
    // Asumo que useComments tiene un hook para el total de comentarios para mostrarlo en el header
    const { comments, loading, fetchComments, addComment, likeComment } = useComments();
    const [comentario, setComentario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isOpen) fetchComments(postId);
    }, [isOpen, postId, fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comentario.trim()) return;

        setIsSubmitting(true);
        const success = await addComment(postId, comentario.trim());
        if (success) {
            setComentario('');
            onCommentAdded?.();
        }
        setIsSubmitting(false);
    };

    const handleLike = async (comentarioId: number) => {
        await likeComment(comentarioId);
    };

    // 💡 Función de utilidad para renderizar el avatar
    const renderUserAvatar = (url: string | undefined | null, name: string = 'U') => (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {url ? (
                <Image
                    src={url}
                    width={32}
                    height={32}
                    alt={`Avatar de ${name}`}
                    className="object-cover w-full h-full"
                />
            ) : (
                <span className="text-gray-500 font-medium text-sm">
                    {name.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 🌟 FONDO OSCURO (para móvil) - Más sutil (opacity 0.2) */}
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={onClose}
                        />
                    )}

                    <motion.div
                        key="comments-section"
                        initial={isMobile ? { y: '100%' } : { opacity: 0, height: 0 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, height: 'auto' }}
                        exit={isMobile ? { y: '100%' } : { opacity: 0, height: 0 }}
                        transition={{
                            type: isMobile ? 'spring' : 'tween',
                            stiffness: isMobile ? 200 : 0,
                            damping: isMobile ? 25 : 0,
                            duration: isMobile ? 0 : 0.2
                        }}
                        className={`${isMobile
                            ? 'fixed bottom-0 left-0 w-full max-h-[90vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col transition-shadow' // Mobile bottom sheet
                            : 'border-t border-gray-100 bg-white' // Desktop: se queda dentro de PostCard
                            } overflow-hidden`}
                    >

                        {/* 🌟 HEADER MÓVIL/DESKTOP - Estilo Modal/Drawer */}
                        {/* Se muestra en mobile y desktop para dar título y control de cierre */}
                        <div className={`flex justify-between items-center px-4 py-3 border-b ${isMobile ? 'border-gray-200' : 'border-gray-100'} sticky top-0 bg-white z-10`}>

                            {/* Línea de arrastre (Solo en móvil) */}
                            {isMobile && (
                                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full" />
                            )}

                            <div className='flex-1 text-center'>
                                <span className="font-semibold text-gray-800 text-base">
                                    {/* Muestra el total de comentarios si tienes el dato */}
                                    Comentarios ({comments.length})
                                </span>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
                                aria-label="Cerrar comentarios"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 🌟 LISTA DE COMENTARIOS */}
                        <div
                            className={`px-4 pt-3 pb-4 overflow-y-auto ${isMobile ? 'flex-1' : 'max-h-80' /* Altura más controlada en desktop */
                                } scroll-smooth`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-rose-500" /> {/* Color sutil de Airbnb */}
                                    <span className="ml-2 text-sm text-gray-500">Cargando comentarios...</span>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className='w-8 h-8 mx-auto mb-2 text-gray-300' />
                                    <p className="font-semibold text-gray-600 text-sm">Sé el primero en comentar</p>
                                    <p className="text-gray-400 text-xs mt-1">Comparte tus ideas sobre esta publicación.</p>
                                </div>
                            ) : (
                                <div className="space-y-5"> {/* Espaciado aumentado */}
                                    {comments.map((comment) => (
                                        // Asumo que CommentItem ha sido modificado con el mismo estilo
                                        <CommentItem key={comment.id} comment={comment} onLike={handleLike} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 🌟 FORMULARIO DE COMENTARIO */}
                        <div className="px-4 py-3 bg-white border-t border-gray-100 sticky bottom-0 z-10"> {/* Borde y fondo blanco */}
                            <form onSubmit={handleSubmit} className="flex items-end space-x-3"> {/* Alineación 'items-end' para el textarea */}

                                {/* Avatar */}
                                <div className="flex-shrink-0 pt-1">
                                    {renderUserAvatar(user?.fotoPerfil, user?.name_user)}
                                </div>

                                <div className="flex-1 flex items-end space-x-2">
                                    <textarea
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Escribe tu comentario..." // Texto ajustado
                                        className="flex-1 resize-none rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 min-h-[40px] max-h-28 transition-all" // Borde redondeado, padding ajustado, focus color Airbnb
                                        rows={1}
                                        disabled={isSubmitting}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
                                            }
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={!comentario.trim() || isSubmitting}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0" // Botón más pequeño y color rose
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}