import {
    Home,
    Calendar,
    Trophy,
    MapPin,
    User,
    Heart,
    Users,
    Bell,
    Settings,
    Shield,
    LogOut,
    List,
    Plus,
    Users as UsersIcon,
    Star,
    Award,
    Clock,
} from 'lucide-react';
import { NavItem, SubMenuItem, MenuItem } from '@/src/types/header/navigation';
// ✅ Submenú para Canchas
export const canchasSubmenu: SubMenuItem[] = [
    {
        icon: List,
        label: 'Todas las Canchas',
        href: '/canchas',
        description: 'Explora todas las canchas disponibles'
    },
    {
        icon: Plus,
        label: 'Crear Cancha',
        href: '/canchas/nueva',
        description: 'Registra tu cancha en la plataforma'
    },
    {
        icon: MapPin,
        label: 'Mis Canchas',
        href: '/canchas/mis-canchas',
        description: 'Gestiona tus canchas registradas'
    }
];





// ✅ NavItems principales
export const navItems: NavItem[] = [
    {
        label: 'Inicio',
        href: '/home',
        icon: Home
    },
    {
        label: 'Canchas',
        href: '/canchas',
        icon: MapPin,
        submenu: canchasSubmenu
    },


];

// ✅ Profile menu items
export const getProfileMenuItems = (
    handleOpenMisReservas: () => void,
    handleLogout: () => void,
    isLoggingOut: boolean
): MenuItem[] => [
        { icon: User, label: 'Mi Perfil', href: '/profile' },
        {
            icon: Calendar,
            label: 'Mis Reservas',
            href: '#',
            action: handleOpenMisReservas
        },
        { icon: Heart, label: 'Favoritos', href: '/favoritos' },
        { icon: Users, label: 'Amigos', href: '/profile/friends' },
        { icon: Trophy, label: 'Mis Torneos', href: '/mis-torneos' },
        { icon: Bell, label: 'Notificaciones', href: '/notificaciones' },
        { icon: Settings, label: 'Configuración', href: '/configuracion' },
        { icon: Shield, label: 'Privacidad', href: '/privacidad' },
        {
            icon: LogOut,
            label: isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión',
            href: '#',
            action: handleLogout
        },
    ];