"use client";

import { Sidebar } from "./Sidebar";
import { MobileTabBar } from "./MobileTabBar";
import { TopNavbar } from "./TopNavbar";
import { PublicidadLateral } from "./PublicidadLateral";

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar for Desktop */}
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Top Header for Mobile */}
                <TopNavbar />

                <main className="flex-1 w-full max-w-7xl mx-auto flex gap-6 p-4 sm:p-6 lg:p-10 mb-20 lg:mb-0">
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>

                    {/* Right Sidebar for Desktop (Publicidad/Sugestiones) */}
                    <aside className="hidden xl:block w-80 space-y-6">
                        <PublicidadLateral />
                        <div className="glass-card p-6 rounded-3xl">
                            <h3 className="font-bold text-slate-800 mb-4">Sugerencias para ti</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">Usuario {i}</p>
                                            <p className="text-xs text-slate-500">Te sigue</p>
                                        </div>
                                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700">Seguir</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>

                {/* Bottom Tab Bar for Mobile */}
                <MobileTabBar />
            </div>
        </div>
    );
}
