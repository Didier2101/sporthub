"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Logo } from "../../brand/Logo";
import { useAuthStore } from "@/shared/store/useAuthStore";
import Image from "next/image";

export function TopNavbar() {
    const user = useAuthStore((state) => ({
        name: state.name_user,
        foto: state.fotoPerfil
    }));

    return (
        <header className="sticky top-0 z-40 w-full glass-card !rounded-none !border-x-0 !border-t-0 border-b border-slate-200/50 lg:hidden">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <Logo className="h-8 w-auto text-primary-600" />

                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Search size={22} />
                    </button>
                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary-100">
                        {user.foto ? (
                            <Image src={user.foto} alt={user.name || "Perfil"} width={36} height={36} className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                {user.name?.[0].toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
