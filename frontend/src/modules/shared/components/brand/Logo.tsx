"use client";

import { Dumbbell } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3 select-none", className)}>
            <div className="relative">
                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Dumbbell className="text-white" size={22} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-500 rounded-full border-2 border-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">
                SportHub
            </span>
        </div>
    );
}
