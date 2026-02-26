// components/social/FeedSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    Trophy,
    MapPin,
    Calendar,
    Bell,
    TrendingUp,
    Star,
    Heart,
    User,
    Settings
} from 'lucide-react';

// Importar rutas y constantes
import { APP_ROUTES } from '@shared/constants';
import {
    FEED_NAV_ITEMS,
    FEED_SHORTCUTS,
} from '@shared/constants/feed-routes';
import LogoutButton from '@auth/components/LogoutButton';

// Mapeo de iconos
const iconComponents: Record<string, React.ComponentType<any>> = {
    Home: Home,
    Users: Users,
    Trophy: Trophy,
    MapPin: MapPin,
    Calendar: Calendar,
    Bell: Bell,
    TrendingUp: TrendingUp,
    Star: Star,
    Heart: Heart,
    User: User,
    Settings: Settings,
};

// Helper para obtener la ruta real
const getRoute = (routeKey: keyof typeof APP_ROUTES, hrefParam?: string): string => {
    const route = APP_ROUTES[routeKey];
    if (typeof route === 'function') {
        return route(hrefParam || '');
    }
    return typeof route === 'string' ? route : '';
};

export default function FeedSidebar() {
    const pathname = usePathname();

    // Función para verificar si una ruta está activa
    const isActiveRoute = (routeKey: keyof typeof APP_ROUTES, hrefParam?: string) => {
        const routePath = getRoute(routeKey, hrefParam);
        return pathname.startsWith(routePath);
    };

    // Obtener icono dinámico
    const getIcon = (iconName: string, isActive: boolean) => {
        const IconComponent = iconComponents[iconName] || Home;
        return <IconComponent className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />;
    };

    return (
        <div className="space-y-6">
            {/* Logo/Nombre App */}
            <Link
                href={APP_ROUTES.HOME}
                className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-500/20 block hover:opacity-95 transition-opacity"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <span className="text-green-600 font-bold text-lg">SH</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-lg">SportHub</h1>
                        <p className="text-green-100 text-xs">Tu red deportiva</p>
                    </div>
                </div>
            </Link>

            {/* Navegación Principal */}
            <div className="bg-white rounded-2xl shadow-lg shadow-green-500/5 border border-gray-200/50 p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 px-2">Navegación</h3>
                <div className="space-y-1">
                    {FEED_NAV_ITEMS.map((item) => {
                        const isActive = isActiveRoute(item.routeKey, item.hrefParam);
                        const href = getRoute(item.routeKey, item.hrefParam);

                        return (
                            <Link
                                key={item.routeKey}
                                href={href}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {getIcon(item.icon, isActive)}
                                    <span className={`font-medium text-sm ${isActive ? 'font-semibold text-green-800' : 'text-gray-700'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {item.badge && (
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badge === 'Nuevo'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Accesos Directos */}
            <div className="bg-white rounded-2xl shadow-lg shadow-green-500/5 border border-gray-200/50 p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 px-2">Accesos Directos</h3>
                <div className="space-y-2">
                    {FEED_SHORTCUTS.map((item) => {
                        const isActive = isActiveRoute(item.routeKey, item.hrefParam);
                        const href = getRoute(item.routeKey, item.hrefParam);

                        return (
                            <Link
                                key={item.routeKey}
                                href={href}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {getIcon(item.icon, isActive)}
                                    <span className={`font-medium text-sm ${isActive ? 'font-semibold text-green-800' : 'text-gray-700'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {item.badge && (
                                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Configuración y Logout */}
            <div className="bg-white rounded-2xl shadow-lg shadow-green-500/5 border border-gray-200/50 p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 px-2">Cuenta</h3>

                {/* Configuración */}
                <Link
                    href={APP_ROUTES.PROFILE_SETTINGS}
                    className="flex items-center justify-between p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-sm">Configuración</span>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                </Link>

                {/* Separador */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Botón de Logout */}
                <LogoutButton variant="sidebar" />
            </div>
        </div>
    );
}