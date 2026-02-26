// components/header/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    X,
    ChevronRight,
    Home,
    Calendar,
    Trophy,
    MapPin,
    Settings,
    Award,
    Users,
    Edit,
    BarChart
} from 'lucide-react';

// Componentes
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import MisReservasModal from '@/user/components/MisReservasModal';

// Hooks
import { useGetCurrentUser } from '@/user/hooks/useGetCurrentUser';

// Constantes
import { APP_ROUTES } from '@shared/constants/app-routes';
import {
    MOBILE_MENU_ITEMS,
    PROFILE_MENU_ITEMS,
    hasHref,
    hasAction,
    type MobileMenuItem,
    type MenuItem
} from '@shared/constants/header-routes';
import LogoutButton from '@auth/components/LogoutButton';

// Mapeo de iconos
const iconComponents: Record<string, any> = {
    Home,
    Calendar,
    Trophy,
    User,
    MapPin,
    Settings,
    Award,
    Users,
    Edit,
    BarChart,
};

// Helper para obtener la ruta real
const getRoute = (routeKey: keyof typeof APP_ROUTES, hrefParam?: string): string => {
    const route = APP_ROUTES[routeKey];
    if (typeof route === 'function') {
        return route(hrefParam || '');
    }
    return typeof route === 'string' ? route : '';
};

export default function Header() {
    const { userData, isLoading: loadingUser } = useGetCurrentUser();

    // Estados
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMisReservasModalOpen, setIsMisReservasModalOpen] = useState(false);
    const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});

    // Controlar scroll del body
    useEffect(() => {
        if (isMobileMenuOpen || isMisReservasModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen, isMisReservasModalOpen]);

    // Toggle secciones móviles
    const toggleMobileSection = (label: string) => {
        setOpenMobileSections(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    // Manejar reservas
    const handleOpenMisReservas = () => {
        setIsMobileMenuOpen(false);
        setIsMisReservasModalOpen(true);
    };

    const handleCloseMisReservas = () => {
        setIsMisReservasModalOpen(false);
    };

    // Función para obtener icono
    const getIcon = (iconName: string) => {
        const IconComponent = iconComponents[iconName] || User;
        return <IconComponent className="w-5 h-5" />;
    };

    // Obtener avatar URL
    const getAvatarUrl = () => {
        if (!userData) return null;

        if (userData.urlphotoperfil_completa) {
            return userData.urlphotoperfil_completa;
        }
        if (userData.urlphotoperfil) {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (API_BASE_URL && !userData.urlphotoperfil.startsWith('http')) {
                return `${API_BASE_URL}${userData.urlphotoperfil}`;
            }
            return userData.urlphotoperfil;
        }
        return null;
    };

    const avatarUrl = getAvatarUrl();

    // Renderizar item móvil
    const renderMobileMenuItem = (item: MobileMenuItem) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const Icon = item.icon ? iconComponents[item.icon] : Home;
        const href = getRoute(item.routeKey, item.hrefParam);

        if (hasSubItems) {
            return (
                <div key={item.label} className="space-y-1">
                    <button
                        onClick={() => toggleMobileSection(item.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${openMobileSections[item.label] ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {openMobileSections[item.label] && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-8 space-y-1"
                            >
                                {item.subItems!.map((subItem) => {
                                    const subHref = getRoute(subItem.routeKey, subItem.hrefParam);

                                    return (
                                        <Link
                                            key={subItem.label}
                                            href={subHref}
                                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            • {subItem.label}
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <Link
                key={item.label}
                href={href}
                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
        );
    };

    // Renderizar item del menú de perfil
    const renderProfileMenuItem = (item: MenuItem) => {
        if (hasAction(item)) {
            if (item.action === 'reservas') {
                return (
                    <button
                        key={item.label}
                        onClick={handleOpenMisReservas}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        <div className="flex items-center space-x-3">
                            {getIcon(item.icon)}
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                );
            }
            return null;
        }

        if (hasHref(item)) {
            const href = getRoute(item.routeKey, item.hrefParam);

            return (
                <Link
                    key={item.routeKey}
                    href={href}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div className="flex items-center space-x-3">
                        {getIcon(item.icon)}
                        <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
            );
        }

        return null;
    };

    // Mostrar loading mientras se carga el usuario
    if (loadingUser) {
        return (
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href={APP_ROUTES.HOME} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SH</span>
                            </div>
                            <span className="font-bold text-gray-900 hidden sm:block text-lg">
                                SportHub
                            </span>
                        </Link>

                        {/* Placeholders mientras carga */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
                            <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse ml-1" />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <>
            {/* Header Principal */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href={APP_ROUTES.HOME} className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                                <span className="text-white font-bold text-sm">SH</span>
                            </div>
                            <span className="font-bold text-gray-900 hidden sm:block text-lg">
                                SportHub
                            </span>
                        </Link>

                        {/* Contenedor para iconos PEGADOS a la foto */}
                        <div className="flex items-center space-x-1">
                            {/* SearchBar y Notifications PEGADOS */}
                            <div className="flex items-center space-x-1">
                                <div className="relative">
                                    <SearchBar
                                        variant="desktop"
                                        onResultClick={() => setIsMobileMenuOpen(false)}
                                    />
                                </div>
                                <div className="relative">
                                    <Notifications variant="desktop" />
                                </div>
                            </div>

                            {/* Avatar */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-1"
                            >
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt="Perfil"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                        unoptimized={true}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center avatar-fallback border-2 border-gray-200 shadow-sm">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal de Menú Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed inset-0 bg-white z-50 md:hidden flex flex-col"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                            <div className="flex-1 overflow-y-auto">
                                {/* Header del modal */}
                                <div className="p-6 border-b border-gray-200 bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            {avatarUrl ? (
                                                <Image
                                                    src={avatarUrl}
                                                    alt="Perfil"
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
                                                    <User className="w-6 h-6 text-gray-600" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    {userData?.name_user || 'Usuario'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {userData?.email || 'usuario@email.com'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Navegación Mobile */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-4 px-2">Navegación</h3>
                                    <div className="space-y-1">
                                        {MOBILE_MENU_ITEMS.map(renderMobileMenuItem)}
                                    </div>
                                </div>

                                {/* Mi Cuenta */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-4 px-2">Mi Cuenta</h3>
                                    <div className="space-y-1">
                                        {PROFILE_MENU_ITEMS.map(renderProfileMenuItem)}
                                    </div>
                                </div>

                                {/* Botón de Logout */}
                                <div className="p-4 border-t border-gray-200">
                                    <LogoutButton variant="sidebar" />
                                </div>
                            </div>

                            {/* Footer del modal */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <p className="text-xs text-gray-500 text-center">
                                    SportHub © {new Date().getFullYear()}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal de Mis Reservas */}
            <MisReservasModal
                isOpen={isMisReservasModalOpen}
                onClose={handleCloseMisReservas}
            />
        </>
    );
}