"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    MapPin,
    Trophy,
    User,
    PlusSquare,
    Settings,
    LogOut,
    Bell
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Logo } from "../../brand/Logo";

const NAV_ITEMS = [
    { icon: Home, label: "Inicio", href: "/home" },
    { icon: Search, label: "Explorar", href: "/explorar" },
    { icon: Bell, label: "Notificaciones", href: "/notificaciones" },
    { icon: MapPin, label: "Canchas", href: "/canchas" },
    { icon: Trophy, label: "Torneos", href: "/torneos" },
    { icon: User, label: "Perfil", href: "/perfil" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-slate-200 bg-white p-6 justify-between">
            <div className="space-y-8">
                <div className="px-2">
                    <Logo />
                </div>

                <nav className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary-50 text-primary-700 font-bold"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon
                                    size={24}
                                    className={cn(
                                        "transition-transform group-hover:scale-110",
                                        isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                                    )}
                                />
                                <span className="text-base">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button className="w-full flex items-center gap-4 px-4 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-600/40 transition-all active:scale-95">
                    <PlusSquare size={24} />
                    <span>Nueva Publicación</span>
                </button>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
                <Link
                    href="/configuracion"
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    <Settings size={20} />
                    <span className="text-sm font-medium">Configuración</span>
                </Link>
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
