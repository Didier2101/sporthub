'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGetCanchas } from './canchas/useGetCanchas';
import { useSearchUsers, UserSearchResult } from './users/useSearchUsers';

// Tipos para los resultados de búsqueda
export interface SearchResult {
    id: string | number;
    type: 'user' | 'cancha';
    name: string;
    image?: string;
    subtitle?: string;
    href: string;
}

interface UseSearchProps {
    onSearch?: (query: string, results: SearchResult[]) => void;
    debounceDelay?: number;
}

export const useSearch = ({ onSearch, debounceDelay = 300 }: UseSearchProps = {}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Usar hooks existentes
    const { canchas, isLoading: canchasLoading } = useGetCanchas();
    const { searchUsers: searchUsersApi, isLoading: usersLoading } = useSearchUsers();

    // Función para buscar usuarios usando el hook real
    const searchUsers = useCallback(async (query: string): Promise<SearchResult[]> => {
        if (!query.trim()) return [];

        try {
            const users = await searchUsersApi(query);

            return users.map((user: UserSearchResult) => ({
                id: user.id,
                type: 'user' as const,
                name: user.name_user,
                image: user.urlphotoperfil_completa, // Usar la URL procesada
                href: `/perfil/${user.slug}`
            }));
        } catch (error) {
            console.error('Error en búsqueda de usuarios:', error);
            return [];
        }
    }, [searchUsersApi]);

    // Función para buscar canchas en tiempo real desde los datos ya cargados
    const searchCanchasRealTime = useCallback((query: string): SearchResult[] => {
        if (!query.trim() || !canchas || canchas.length === 0) return [];

        const queryLower = query.toLowerCase();

        const resultados = canchas
            .filter(cancha =>
                cancha.nombre.toLowerCase().includes(queryLower) ||
                cancha.direccion?.toLowerCase().includes(queryLower) ||
                cancha.descripcion?.toLowerCase().includes(queryLower)
            )
            .slice(0, 5) // Limitar a 5 resultados
            .map(cancha => ({
                id: cancha.id,
                type: 'cancha' as const,
                name: cancha.nombre,
                image: cancha.imagenes_accesibles?.[0]?.url,
                href: `/canchas/${cancha.id}`
            }));

        return resultados;
    }, [canchas]);

    // Búsqueda principal - busca solo usuarios y canchas
    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            // Ejecutar búsqueda de usuarios
            const usersResults = await searchUsers(query);

            // Búsqueda de canchas en tiempo real (no necesita await)
            const canchasResults = searchCanchasRealTime(query);

            // Combinar todos los resultados
            const allResults = [
                ...usersResults,
                ...canchasResults
            ];

            // Ordenar por relevancia
            const resultadosOrdenados = allResults.sort((a, b) => {
                // Priorizar coincidencias exactas en el nombre
                const aExactMatch = a.name.toLowerCase() === query.toLowerCase();
                const bExactMatch = b.name.toLowerCase() === query.toLowerCase();

                if (aExactMatch && !bExactMatch) return -1;
                if (!aExactMatch && bExactMatch) return 1;

                // Luego ordenar por tipo (usuarios primero)
                const typeOrder = { user: 0, cancha: 1 };
                return typeOrder[a.type] - typeOrder[b.type];
            });

            setSearchResults(resultadosOrdenados);

            // Callback opcional para notificar resultados
            if (onSearch) {
                onSearch(query, resultadosOrdenados);
            }
        } catch (error) {
            console.error('Error en búsqueda general:', error);
            setSearchError('Error al realizar la búsqueda');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchUsers, searchCanchasRealTime, onSearch]);

    // Debounce para la búsqueda
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            setSearchError(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch(searchQuery);
        }, debounceDelay);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, debounceDelay, performSearch]);

    // Estado combinado de loading
    const isLoading = isSearching || canchasLoading || usersLoading;

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching: isLoading,
        searchError,
        performSearch,
        clearSearch: () => {
            setSearchQuery('');
            setSearchResults([]);
            setSearchError(null);
        }
    };
};