// app/profile/achievements/page.tsx
'use client';

import { FaTrophy, FaMedal } from 'react-icons/fa';

export default function AchievementsPage() {
    return (
        <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
                <FaTrophy className="w-6 h-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Logros</h1>
            </div>

            {/* Mensaje de logros vacíos */}
            <div className="text-center py-12">
                <FaTrophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes logros</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Participa en partidos, completa desafíos y alcanza metas para desbloquear logros.
                </p>
            </div>

            {/* Placeholder de logros futuros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <FaMedal className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="w-24 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
                        <div className="w-32 h-3 bg-gray-300 rounded mx-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}