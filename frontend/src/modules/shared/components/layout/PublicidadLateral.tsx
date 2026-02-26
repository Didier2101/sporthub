'use client';

import Link from 'next/link';
import { X, Trophy, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface PublicidadLateralProps {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
}

export function PublicidadLateral({
    title = "⚽ Premia tu Talento",
    description = "Únete a la liga Élite este fin de semana y compite por premios de hasta $5,000 USD.",
    ctaText = "Ver Torneos",
    ctaLink = "/torneos"
}: PublicidadLateralProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-xl shadow-primary-500/20 p-6 text-white overflow-hidden group">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-20"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary-100" />
                </div>

                <div className="space-y-2">
                    <h3 className="font-black text-xl leading-tight">{title}</h3>
                    <p className="text-sm text-primary-100/90 font-medium">
                        {description}
                    </p>
                </div>

                <Link
                    href={ctaLink}
                    className="flex items-center justify-between bg-white text-primary-700 hover:bg-primary-50 font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 group/btn"
                >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Decorations */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-primary-400/20 rounded-full blur-xl" />
        </div>
    );
}