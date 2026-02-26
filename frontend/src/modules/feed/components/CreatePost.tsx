'use client';

import { Image as ImageIcon, X, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { useCreatePost } from '@/src/modules/feed/hooks/useCreatePost';
import { cn } from '@/shared/utils/cn';

export default function CreatePost() {
    const {
        newPostContent,
        setNewPostContent,
        selectedImage,
        previewUrl,
        isCreatingPost,
        uploading,
        progress,
        uploadError,
        handleImageSelect,
        handleRemoveImage,
        handlePostSubmit,
    } = useCreatePost();

    const canPublish = !!newPostContent.trim() || !!selectedImage;

    return (
        <div className="glass-card !border-slate-200/60 p-5 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-primary-100 items-center justify-center shrink-0">
                        <ImageIcon className="text-primary-600" size={24} />
                    </div>

                    <textarea
                        placeholder="¿Qué deporte practicamos hoy?"
                        className="flex-1 bg-transparent border-none p-0 text-lg focus:ring-0 resize-none placeholder-slate-400 text-slate-800 min-h-[60px]"
                        rows={3}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        disabled={uploading || isCreatingPost}
                    />
                </div>

                {/* Image Preview Area */}
                <AnimatePresence>
                    {previewUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative rounded-2xl overflow-hidden group border border-slate-100"
                        >
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                width={800}
                                height={500}
                                className="w-full object-cover max-h-80"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-slate-900 rounded-xl p-2 transition-all backdrop-blur-md shadow-lg"
                                disabled={uploading || isCreatingPost}
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error & Progress */}
                {uploading && (
                    <div className="space-y-2 py-2">
                        <div className="flex justify-between items-center text-xs font-bold text-primary-600">
                            <span>{selectedImage ? 'Subiendo contenido...' : 'Publicando...'}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-primary-50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {uploadError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                        {uploadError}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <label className={cn(
                            "p-2.5 rounded-2xl cursor-pointer transition-all",
                            selectedImage ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "text-primary-600 hover:bg-primary-50"
                        )}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={uploading || isCreatingPost || !!selectedImage}
                            />
                            <ImageIcon size={22} />
                        </label>
                        <span className="text-xs font-bold text-slate-400 hidden sm:block">Añadir foto</span>
                    </div>

                    <button
                        onClick={() => handlePostSubmit()}
                        disabled={!canPublish || uploading || isCreatingPost}
                        className="btn-primary !px-5 !py-2.5 text-sm flex items-center gap-2"
                    >
                        {isCreatingPost ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <span>Publicar</span>
                                <Send size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';