"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    Search,
    MapPin,
    Trophy,
    User,
    PlusSquare,
    Bell
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

const NAV_ITEMS = [
    { icon: Home, label: "Inicio", href: "/home" },
    { icon: Search, label: "Explorar", href: "/explorar" },
    { icon: PlusSquare, label: "Crear", href: "/crear" }, // Pulsing center button for mobile
    { icon: MapPin, label: "Canchas", href: "/canchas" },
    { icon: User, label: "Perfil", href: "/perfil" },
];

export function MobileTabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-card !rounded-b-none !border-t border-slate-200/50 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const isAction = item.label === "Crear";

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group",
                                isAction ? "-mt-8 h-14 w-14 shrink-0" : ""
                            )}
                        >
                            {isAction ? (
                                <div className="bg-primary-600 text-white p-3.5 rounded-2xl shadow-lg shadow-primary-500/40 transform group-active:scale-90 transition-transform">
                                    <item.icon size={24} strokeWidth={2.5} />
                                </div>
                            ) : (
                                <>
                                    <item.icon
                                        size={22}
                                        className={cn(
                                            "transition-all duration-300",
                                            isActive ? "text-primary-600 scale-110 mb-1" : "text-slate-400"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && (
                                        <span className="text-[10px] font-bold text-primary-600 animate-in fade-in slide-in-from-bottom-1 uppercase tracking-wider">
                                            {item.label}
                                        </span>
                                    )}
                                    {!isActive && (
                                        <div className="w-1 h-1 rounded-full bg-primary-500 scale-0 group-hover:scale-100 transition-transform mt-1" />
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
