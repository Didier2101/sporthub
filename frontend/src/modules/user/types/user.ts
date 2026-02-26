// src/types/user.ts
export interface User {
    id: number;
    id_user?: number;
    email: string;
    name_user: string;
    profile_image?: string;
    fotoPerfil?: string;
    bio?: string;
    favorite_sport?: string;
    position?: string;
    location?: string;
    phone?: string;
    is_profile_completed: boolean;
    role?: string;
    age?: Date;
}

export interface AuthData {
    user: User;
    token?: string;
}

// ✅ any eliminado - usando unknown en su lugar
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// ✅ any eliminado - definiendo interfaz para userData
interface RawUserData {
    id?: number;
    id_user?: number;
    email?: string;
    name_user?: string;
    profile_image?: string;
    fotoPerfil?: string;
    bio?: string;
    favorite_sport?: string;
    position?: string;
    location?: string;
    phone?: string;
    is_profile_completed?: boolean;
    role?: string;
    age?: Date;
    [key: string]: unknown;
}

export function normalizeUser(userData: RawUserData): User {
    return {
        id: userData.id || userData.id_user || 0,
        id_user: userData.id_user || userData.id,
        email: userData.email || '',
        name_user: userData.name_user || '',
        profile_image: userData.profile_image || userData.fotoPerfil,
        fotoPerfil: userData.fotoPerfil || userData.profile_image,
        bio: userData.bio,
        favorite_sport: userData.favorite_sport,
        position: userData.position,
        location: userData.location,
        phone: userData.phone,
        is_profile_completed: userData.is_profile_completed || false,
        role: userData.role,
    };
}