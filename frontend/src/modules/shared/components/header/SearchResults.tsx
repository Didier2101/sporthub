'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Loader2, Search, X } from 'lucide-react';
import { SearchResult } from '@/src/hooks/useSearch';

interface SearchResultsProps {
    results: SearchResult[];
    isSearching: boolean;
    searchQuery: string;
    onResultClick?: () => void;
    onClose?: () => void; // Nueva prop para cerrar
}

const getIconByType = (type: SearchResult['type']) => {
    switch (type) {
        case 'user':
            return User;
        case 'cancha':
            return MapPin;
        default:
            return User;
    }
};

const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
        case 'user':
            return 'text-gray-600 bg-gray-100';
        case 'cancha':
            return 'text-gray-600 bg-gray-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
        case 'user':
            return 'Persona';
        case 'cancha':
            return 'Cancha';
        default:
            return 'Item';
    }
};

export default function SearchResults({
    results,
    isSearching,
    searchQuery,
    onResultClick,
    onClose
}: SearchResultsProps) {
    if (!searchQuery.trim()) return null;

    const handleResultClick = () => {
        if (onResultClick) {
            onResultClick();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header con botón de cerrar */}
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500">
                        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                    </p>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Cerrar resultados"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {isSearching ? (
                    <div className="flex items-center justify-center px-4 py-6 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        <span className="text-sm">Buscando &quot;{searchQuery}&quot;...</span>
                    </div>
                ) : results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {results.map((result) => {
                            const IconComponent = getIconByType(result.type);
                            return (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 group"
                                    onClick={() => {
                                        handleResultClick();
                                        handleClose(); // Cerrar al hacer clic en resultado
                                    }}
                                >
                                    {/* Avatar/Imagen */}
                                    {result.image ? (
                                        <div className="relative w-10 h-10 flex-shrink-0">
                                            <Image
                                                src={result.image}
                                                alt={result.name}
                                                fill
                                                className="rounded-full object-cover"
                                                unoptimized={true}
                                                sizes="40px"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(result.type)} flex-shrink-0`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                    )}

                                    {/* Información */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                                            {result.name}
                                        </div>
                                        {result.subtitle && (
                                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                                                {result.subtitle}
                                            </div>
                                        )}
                                    </div>

                                    {/* Badge de tipo */}
                                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)} flex-shrink-0`}>
                                        {getTypeLabel(result.type)}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-4 py-6 text-center">
                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">No se encontraron resultados</p>
                        <p className="text-xs text-gray-400">Intenta con otros términos de búsqueda</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}