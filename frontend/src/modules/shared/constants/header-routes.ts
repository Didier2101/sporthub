import { APP_ROUTES } from "./app-routes";

// src/constants/header-routes.ts
export interface BaseMenuItem {
    label: string;
    icon: string;
}

export interface MenuItemWithHref extends BaseMenuItem {
    routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
    hrefParam?: string;
}

export interface MenuItemWithAction extends BaseMenuItem {
    action: 'reservas' | 'logout' | 'notifications';
}

export type MenuItem = MenuItemWithHref | MenuItemWithAction;

export interface MobileMenuItem extends BaseMenuItem {
    routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
    hrefParam?: string;
    subItems?: Array<{
        label: string;
        routeKey: keyof typeof APP_ROUTES; // Solo la clave de la ruta
        hrefParam?: string;
    }>;
}

export const hasHref = (item: MenuItem): item is MenuItemWithHref => {
    return 'routeKey' in item;
};

export const hasAction = (item: MenuItem): item is MenuItemWithAction => {
    return 'action' in item;
};

export const MOBILE_MENU_ITEMS: MobileMenuItem[] = [
    {
        label: 'Inicio',
        icon: 'Home',
        routeKey: 'HOME'
    },
    {
        label: 'Canchas',
        icon: 'MapPin',
        routeKey: 'CANCHAS',
        subItems: [
            {
                label: 'Ver Canchas',
                routeKey: 'CANCHAS'
            },
            {
                label: 'Agregar Cancha',
                routeKey: 'CANCHAS_NUEVA'
            }
        ]
    },
    {
        label: 'Torneos',
        icon: 'Trophy',
        routeKey: 'TORNEOS'
    },
    {
        label: 'Eventos',
        icon: 'Calendar',
        routeKey: 'EVENTOS'
    }
];

export const PROFILE_MENU_ITEMS: MenuItem[] = [
    {
        label: 'Mi Perfil',
        icon: 'User',
        routeKey: 'PROFILE'
    },
    {
        label: 'Editar Perfil',
        icon: 'Edit',
        routeKey: 'PROFILE_EDIT'
    },
    {
        label: 'Mis Reservas',
        icon: 'Calendar',
        action: 'reservas'
    },
    {
        label: 'Estadísticas',
        icon: 'BarChart',
        routeKey: 'PROFILE_STATISTICS'
    },
    {
        label: 'Logros',
        icon: 'Award',
        routeKey: 'PROFILE_ACHIEVEMENTS'
    },
    {
        label: 'Amigos',
        icon: 'Users',
        routeKey: 'PROFILE_FRIENDS'
    },
    {
        label: 'Configuración',
        icon: 'Settings',
        routeKey: 'PROFILE_SETTINGS'
    }
];