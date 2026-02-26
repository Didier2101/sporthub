// src/constants/app-routes.ts

export const APP_ROUTES = {
    // Auth Routes
    LOGIN: '/',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',

    // Main App Routes
    HOME: '/home',
    FEED: '/feed',
    RESERVAS: '/reservas',
    NOTIFICATIONS: '/notifications',
    TORNEOS: '/torneos',
    EVENTOS: '/eventos',

    // Canchas
    CANCHAS: '/canchas',
    CANCHAS_NUEVA: '/canchas/nueva',
    CANCHAS_DETALLE: (id: string) => `/canchas/${id}` as const,

    // Profile
    PROFILE: '/profile',
    PROFILE_EDIT: '/profile/edit',
    PROFILE_SETTINGS: '/profile/settings',
    PROFILE_FRIENDS: '/profile/friends',
    PROFILE_STATISTICS: '/profile/statistics',
    PROFILE_ACHIEVEMENTS: '/profile/achievements',
    USER_PROFILE: (slug: string) => `/perfil/${slug}` as const,

    // Legacy/Grouped access
    PUBLIC: {
        LOGIN: '/',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
    },
    PROTECTED: {
        HOME: '/home',
        FEED: '/feed',
        RESERVAS: '/reservas',
        NOTIFICATIONS: '/notifications',
    },
} as const;

// Helper para extraer tipos de rutas si fuera necesario
export type AppRoutes = typeof APP_ROUTES;