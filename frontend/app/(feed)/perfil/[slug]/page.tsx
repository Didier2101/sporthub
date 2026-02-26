'use client';

import React from 'react';
import PerfilUsuario from '@/components/perfil/PerfilUsuario';
import { useGetPerfilUsuario } from '@/src/hooks/users/useGetPerfilUsuario';
import { Loader2, AlertCircle, User } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Componente de carga
function LoadingState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 animate-pulse"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white animate-spin" />
                </div>
                <p className="text-gray-700 font-medium">Cargando perfil...</p>
                <p className="text-gray-500 text-sm mt-2">Obteniendo información del usuario</p>
            </div>
        </div>
    );
}

// Componente de error
function ErrorState({ message, slug }: { message: string; slug: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white p-6">
            <div className="text-center max-w-md">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Perfil no disponible</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 mb-2">Intentaste acceder a:</p>
                    <p className="text-rose-600 font-mono bg-white p-2 rounded border">
                        {slug}
                    </p>
                </div>
                <p className="text-gray-600 mb-8">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                        Reintentar
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente para perfil no encontrado
function NotFoundState({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white p-6">
            <div className="text-center max-w-md">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
                    <User className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Usuario no encontrado</h2>
                <div className="mb-6">
                    <p className="text-gray-700">
                        No existe ningún perfil con el nombre:
                    </p>
                    <p className="text-2xl font-semibold text-rose-600 mt-2">
                        {slug.replace(/-/g, ' ')}
                    </p>
                </div>
                <p className="text-gray-600 mb-8">
                    Verifica que el nombre de usuario sea correcto o intenta buscar otro perfil.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Volver atrás
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PerfilUsuarioPage({ params }: PageProps) {
    // ✅ Usar React.use() para obtener los parámetros
    const { slug } = React.use(params);

    // Usar el hook para obtener el perfil
    const { perfil, isLoading, error } = useGetPerfilUsuario(slug);

    // Estado de carga
    if (isLoading) {
        return <LoadingState />;
    }

    // Estado de error
    if (error) {
        return <ErrorState message={error} slug={slug} />;
    }

    // Perfil no encontrado
    if (!perfil) {
        return <NotFoundState slug={slug} />;
    }

    // Renderizar el perfil
    return <PerfilUsuario perfil={perfil} isLoading={false} />;
}