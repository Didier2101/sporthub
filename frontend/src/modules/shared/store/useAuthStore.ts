// =============================================================================
// store/useAuthStore.ts
// =============================================================================

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ✅ Tipo de usuario (solo lo necesario)
export interface User {
    name_user: string;
    email: string;
    fotoPerfil?: string | null;
}

// ✅ Estado global de autenticación
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    // Acciones
    setAuthData: (user: User) => void;
    clearAuth: () => void;
    updateUser: (userData: Partial<User>) => void;
}

// ✅ Store con persistencia (solo guarda nombre y correo)
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,

                // Guardar usuario
                setAuthData: (user) => {
                    set({
                        user,
                        isAuthenticated: true,
                    });
                },

                // Cerrar sesión
                clearAuth: () => {
                    set({
                        user: null,
                        isAuthenticated: false,
                    });
                },

                // Actualizar parte del usuario (por ejemplo, cambiar nombre)
                updateUser: (userData) => {
                    set((state) => ({
                        user: state.user ? { ...state.user, ...userData } : null,
                    }));
                },
            }),
            {
                name: "auth-store",
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        )
    )
);
