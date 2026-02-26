// components/layout/MobileNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    Trophy,
    MapPin,
    Users,
    Calendar,
    MessageSquare,
    X
} from 'lucide-react';
import { APP_ROUTES } from '@shared/constants/app-routes';

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
    const pathname = usePathname();

    const navItems = [
        { href: APP_ROUTES.HOME, icon: Home, label: 'Inicio' },
        { href: '/explorar', icon: Search, label: 'Explorar' },
        { href: '/torneos', icon: Trophy, label: 'Torneos' },
        { href: '/canchas', icon: MapPin, label: 'Canchas' },
        { href: '/grupos', icon: Users, label: 'Grupos' },
        { href: '/eventos', icon: Calendar, label: 'Eventos' },
        { href: '/mensajes', icon: MessageSquare, label: 'Mensajes' },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <div className="bg-white rounded-t-2xl shadow-2xl shadow-green-500/10 border-t border-gray-200/50">
                    {/* Header del drawer */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900 text-lg">Navegación</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navegación */}
                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-3">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-green-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`w-6 h-6 ${isActive ? 'text-green-600' : ''}`} />
                                        <span className={`text-xs font-medium mt-1.5 ${isActive ? 'font-semibold' : ''}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Sección rápida */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <Link
                                    href="/crear-evento"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium text-sm">Crear Evento</span>
                                </Link>
                                <Link
                                    href="/buscar-cancha"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium text-sm">Buscar Cancha</span>
                                </Link>
                                <Link
                                    href="/unirse-torneo"
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                                >
                                    <Trophy className="w-5 h-5" />
                                    <span className="font-medium text-sm">Unirse a Torneo</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}