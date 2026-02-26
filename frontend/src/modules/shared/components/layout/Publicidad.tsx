// components/layout/Publicidad.tsx
'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PublicidadProps {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    onClose: () => void;
}

export default function Publicidad({
    title,
    description,
    ctaText,
    ctaLink,
    onClose
}: PublicidadProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20 overflow-hidden">
            {/* Botón de cerrar */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* Icono/Imagen */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                        <h3 className="font-bold text-white text-lg md:text-xl mb-2">
                            {title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base mb-4">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={ctaLink}
                                className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {ctaText}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            <button
                                onClick={handleClose}
                                className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                            >
                                Quizá después
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -left-5 top-1/2 w-24 h-24 bg-white/5 rounded-full" />
        </div>
    );
}