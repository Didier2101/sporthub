// app/profile/statistics/page.tsx
'use client';

export default function StatisticsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Partidos Jugados */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Partidos Jugados</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚽</span>
                        </div>
                    </div>
                </div>

                {/* Goles */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Goles</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🥅</span>
                        </div>
                    </div>
                </div>

                {/* Asistencias */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Asistencias</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👟</span>
                        </div>
                    </div>
                </div>

                {/* Victorias */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Victorias</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🏆</span>
                        </div>
                    </div>
                </div>

                {/* Derrotas */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Derrotas</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                        </div>
                    </div>
                </div>

                {/* MVP */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">MVP del Partido</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⭐</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Próximamente */}
            <div className="mt-8 bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">Más estadísticas disponibles próximamente</p>
            </div>
        </div>
    );
}