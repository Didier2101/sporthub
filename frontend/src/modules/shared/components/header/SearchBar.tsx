'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/src/hooks/useSearch';
import SearchResults from './SearchResults';

interface SearchBarProps {
    variant?: 'desktop' | 'mobile';
    onResultClick?: () => void;
}

export default function SearchBar({
    variant = 'desktop',
    onResultClick
}: SearchBarProps) {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        clearSearch
    } = useSearch();

    // Estado para controlar resultados
    const [showResults, setShowResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Mostrar resultados cuando hay búsqueda
    useEffect(() => {
        if (searchQuery.trim() && !isSearching) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchQuery, isSearching]);

    // Cerrar resultados al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleClearSearch = () => {
        clearSearch();
        setShowResults(false);
    };

    const handleResultClick = () => {
        if (onResultClick) {
            onResultClick();
        }
        handleClearSearch();
    };

    const handleCloseResults = () => {
        setShowResults(false);
    };

    // Versión Desktop - Input SIEMPRE visible
    if (variant === 'desktop') {
        return (
            <div className="relative" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar usuarios, canchas, eventos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                            if (searchQuery.trim()) {
                                setShowResults(true);
                            }
                        }}
                        className="w-44 pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>

                {/* Resultados de búsqueda */}
                {showResults && (
                    <SearchResults
                        results={searchResults}
                        isSearching={isSearching}
                        searchQuery={searchQuery}
                        onResultClick={handleResultClick}
                        onClose={handleCloseResults}
                    />
                )}
            </div>
        );
    }

    // Versión Mobile - Ícono que expande a input
    return (
        <div className="relative" ref={searchContainerRef}>
            <AnimatePresence>
                {searchQuery ? (
                    // Input cuando hay búsqueda
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="absolute right-0 top-0 z-50"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (searchQuery.trim()) {
                                        setShowResults(true);
                                    }
                                }}
                                placeholder="Buscar..."
                                className="w-48 sm:w-56 pl-4 pr-8 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Resultados de búsqueda para mobile */}
                        {showResults && (
                            <div className="absolute top-full mt-2 w-full">
                                <SearchResults
                                    results={searchResults}
                                    isSearching={isSearching}
                                    searchQuery={searchQuery}
                                    onResultClick={handleResultClick}
                                    onClose={handleCloseResults}
                                />
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // Botón de búsqueda (ícono)
                    <motion.button
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSearchQuery(' ')} // Espacio para activar
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <Search className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Overlay para móvil cuando hay búsqueda */}
            {searchQuery && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={handleClearSearch}
                />
            )}
        </div>
    );
}