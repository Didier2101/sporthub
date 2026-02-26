import { APP_ROUTES } from "./app-routes";

// src/constants/feed-routes.ts
export interface BaseRouteItem {
    label: string;
    icon: string;
    badge?: string;
    exact?: boolean;
}

export interface FeedNavItem extends BaseRouteItem {
    routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
    hrefParam?: string;
}

export interface FeedShortcut extends BaseRouteItem {
    routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
    hrefParam?: string;
}

export interface SportRoute {
    id: number;
    name: string;
    icon: string;
    color: string;
    count: number;
    routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
    hrefParam?: string;
}

export const FEED_NAV_ITEMS: FeedNavItem[] = [
    {
        label: 'Inicio',
        icon: 'Home',
        routeKey: 'HOME',
        exact: true
    },
    {
        label: 'Canchas',
        icon: 'MapPin',
        routeKey: 'CANCHAS'
    },
    {
        label: 'Torneos',
        icon: 'Trophy',
        routeKey: 'TORNEOS'
    },
    {
        label: 'Perfil',
        icon: 'User',
        routeKey: 'PROFILE'
    },
    {
        label: 'Amigos',
        icon: 'Users',
        routeKey: 'PROFILE_FRIENDS',
        badge: 'Nuevo'
    }
];

export const FEED_SHORTCUTS: FeedShortcut[] = [
    {
        label: 'Eventos',
        icon: 'Calendar',
        routeKey: 'EVENTOS'
    },
    {
        label: 'Logros',
        icon: 'Award',
        routeKey: 'PROFILE_ACHIEVEMENTS'
    },
    {
        label: 'Estadísticas',
        icon: 'BarChart',
        routeKey: 'PROFILE_STATISTICS'
    }
];

