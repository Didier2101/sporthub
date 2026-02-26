// components/noticias/Noticias.tsx
'use client';

import { useState } from 'react';
import {
    ChevronRight,
    TrendingUp,
    Flame,
    Award,
    Clock
} from 'lucide-react';

export default function Noticias() {
    const [activeTab, setActiveTab] = useState('destacadas');

    const tabs = [
        { id: 'destacadas', label: 'Destacadas', icon: Award },
        { id: 'tendencias', label: 'Tendencias', icon: TrendingUp },
        { id: 'recientes', label: 'Recientes', icon: Clock },
        { id: 'populares', label: 'Populares', icon: Flame },
    ];

    const noticias = [
        {
            id: 1,
            categoria: 'Fútbol',
            titulo: 'Nueva cancha sintética abre en el centro',
            descripcion: 'Cancha con iluminación LED y vestuarios modernos',
            tiempo: 'Hace 2 horas',
            reacciones: 245,
            destacada: true,
        },
        {
            id: 2,
            categoria: 'Torneo',
            titulo: 'Gran final del torneo de baloncesto',
            descripcion: 'Equipo Los Tigres vs Águilas Doradas',
            tiempo: 'Hace 5 horas',
            reacciones: 189,
            destacada: false,
        },
        {
            id: 3,
            categoria: 'Evento',
            titulo: 'Maratón benéfica este domingo',
            descripcion: '5K y 10K para recaudar fondos para deporte juvenil',
            tiempo: 'Hace 1 día',
            reacciones: 312,
            destacada: true,
        },
        {
            id: 4,
            categoria: 'Deporte',
            titulo: 'Clínica de tenis con profesional internacional',
            descripcion: 'Taller gratuito para jóvenes promesas',
            tiempo: 'Hace 2 días',
            reacciones: 156,
            destacada: false,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-green-500/5 border border-gray-200/50 overflow-hidden">
            {/* Header con pestañas */}
            <div className="border-b border-gray-100">
                <div className="flex items-center justify-between p-5">
                    <h2 className="font-bold text-gray-900 text-xl">📰 Noticias Deportivas</h2>
                    <button className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700">
                        Ver todas <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex overflow-x-auto px-5 pb-0 gap-1 no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all duration-200 whitespace-nowrap ${isActive
                                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-t border-x border-green-200 font-semibold'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Lista de noticias */}
            <div className="p-5">
                <div className="space-y-4">
                    {noticias.map((noticia) => (
                        <div
                            key={noticia.id}
                            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${noticia.destacada
                                    ? 'bg-gradient-to-r from-green-50/50 to-green-100/30 border-green-200'
                                    : 'bg-gray-50/50 border-gray-200'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Indicador de destacada */}
                                {noticia.destacada && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${noticia.destacada
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {noticia.categoria}
                                        </span>
                                        {noticia.destacada && (
                                            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                Destacada
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-1.5">
                                        {noticia.titulo}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-2">
                                        {noticia.descripcion}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {noticia.tiempo}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                ❤️ {noticia.reacciones} reacciones
                                            </span>
                                        </div>
                                        <button className="text-green-600 hover:text-green-700 text-sm font-semibold">
                                            Leer más →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center">
                        <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm">
                            <span>Cargar más noticias</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}