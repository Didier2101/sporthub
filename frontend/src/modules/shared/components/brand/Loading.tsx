// components/common/Loading.tsx
'use client';

import { ImSpinner8 } from "react-icons/im";
import { FaBolt } from "react-icons/fa";

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export default function Loading({ text = "Cargando SportHub...", fullScreen = false }: LoadingProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 z-50 flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    {/* Logo animado */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-green-500/30">
                            <FaBolt className="text-3xl text-white" />
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl blur-lg opacity-30 animate-ping"></div>
                    </div>

                    {/* Spinner y texto */}
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="relative">
                                <ImSpinner8 className="text-4xl text-green-600 animate-spin" />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 blur-lg opacity-20"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-lg font-semibold text-gray-800">{text}</p>
                            <div className="flex justify-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Versión inline (para usar dentro del formulario)
    return (
        <div className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
            <div className="relative">
                <ImSpinner8 className="text-lg text-green-600 animate-spin" />
                <div className="absolute inset-0 bg-green-500/20 blur-sm"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{text}</span>
        </div>
    );
}