'use client';

import { usePosts } from '../hooks/usePosts';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { CardLoading } from '../../shared/components/ui/CardLoading';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
    const {
        posts,
        isLoading,
        isError,
        likePost,
        deletePost
    } = usePosts();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-40 glass-card animate-pulse rounded-3xl" />
                <CardLoading />
                <CardLoading />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-3xl">
                <p className="text-slate-500 font-bold">No se pudieron cargar las publicaciones</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-primary-600 font-black underline underline-offset-4"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-10">
            {/* Create Post Area */}
            <CreatePost />

            {/* Posts List */}
            <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <PostCard
                                    post={post}
                                    onLike={likePost}
                                    onDelete={deletePost}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-12 text-center glass-card rounded-3xl">
                            <p className="text-slate-400 font-medium italic">No hay publicaciones aún. ¡Sé el primero!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}