// app/not-found.tsx
import { APP_ROUTES } from '@shared/constants';
import Link from 'next/link';
import { FaHome, FaFutbol, FaSearch } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 relative overflow-hidden">
            {/* Elementos decorativos (igual que otras páginas) */}
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl" />

            <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-4xl mx-auto text-center">



                    {/* Card principal */}
                    <div className="bg-white rounded-2xl xl:rounded-3xl shadow-2xl shadow-green-500/10 border border-gray-200/50 p-6 sm:p-8 md:p-12 backdrop-blur-sm">

                        {/* Código de error grande */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center">
                                <span className="text-8xl sm:text-9xl font-bold text-green-600">4</span>
                                <div className="mx-2 sm:mx-4">
                                    <FaFutbol className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 animate-pulse" />
                                </div>
                                <span className="text-8xl sm:text-9xl font-bold text-green-600">4</span>
                            </div>
                        </div>

                        {/* Título y mensaje */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            ¡Oops! Página no encontrada
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Parece que el enlace que seguiste llegó a una zona de entrenamiento vacía.
                            No te preocupes, podemos volver al campo de juego.
                        </p>

                        {/* Sugerencias */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-12">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <FaHome className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold text-gray-800 mb-1">Volver al inicio</h3>
                                <p className="text-sm text-gray-600">Regresa a la página principal</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <FaSearch className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold text-gray-800 mb-1">Buscar contenido</h3>
                                <p className="text-sm text-gray-600">Encuentra lo que necesitas</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <FaFutbol className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold text-gray-800 mb-1">Explorar deportes</h3>
                                <p className="text-sm text-gray-600">Descubre nuevas actividades</p>
                            </div>
                        </div>

                        {/* Botón principal */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">

                            <Link
                                href={APP_ROUTES.LOGIN}
                                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-bold py-3 sm:py-4 px-6 rounded-lg xl:rounded-xl transition-all duration-200 border-2 border-green-200 hover:border-green-300"
                            >
                                Ir a SportHub
                            </Link>
                        </div>

                    </div>

                    {/* Texto pequeño al final */}
                    <p className="mt-6 sm:mt-8 text-sm text-gray-500">
                        Si crees que esto es un error, por favor contacta con soporte.
                    </p>

                </div>
            </div>
        </div>
    );
}