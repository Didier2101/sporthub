// hooks/canchas/useGetCanchaById.ts
import { useState, useCallback } from 'react';

// 🔧 Definir interfaces localmente para coincidir con useGetCanchas
interface ImagenWebP {
    id: number;
    orden: number;
    url_webp: string;
    nombre: string;
    formato: string;
}

interface ImagenAccesible {
    id: number;
    orden: number;
    url: string;
}

interface Horario {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    intervalo_minutos: number;
    disponible: boolean;
}

interface Regla {
    regla: string;
}

interface Amenidad {
    amenidad: string;
}

interface Cancha {
    id: number;
    nombre: string;
    tipo: string;
    subtipo: string;
    direccion: string;
    latitud?: number;
    longitud?: number;
    direccion_completa: string;
    superficie?: string;
    capacidad: number;
    precio_hora: number;
    descripcion?: string;
    estado: string;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
    imagenes_webp?: ImagenWebP[];
    imagenes_accesibles?: ImagenAccesible[];
    horarios?: Horario[];
    reglas?: Regla[];
    amenidades?: Amenidad[];
}

interface ApiResponse {
    success: boolean;
    data: {
        id: number;
        nombre: string;
        tipo: string;
        subtipo: string;
        direccion: string;
        latitud?: number;
        longitud?: number;
        direccion_completa: string;
        superficie?: string;
        capacidad: number;
        precio_hora: number;
        descripcion?: string;
        estado: string;
        fecha_creacion?: string;
        fecha_actualizacion?: string;
        imagenes_webp?: ImagenWebP[];
        horarios?: Horario[];
        reglas?: Regla[];
        amenidades?: Amenidad[];
    };
}

interface UseGetCanchaByIdReturn {
    cancha: Cancha | null;
    isLoading: boolean;
    error: string | null;
    fetchCancha: (id: string | number) => Promise<void>;
    reset: () => void;
}

export function useGetCanchaById(): UseGetCanchaByIdReturn {
    const [cancha, setCancha] = useState<Cancha | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCancha = useCallback(async (id: string | number) => {
        try {
            setIsLoading(true);
            setError(null);


            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            const response = await fetch(`${API_BASE_URL}/cancha/${id}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                    `Error ${response.status}: No se pudo obtener la cancha`
                );
            }

            const result: ApiResponse = await response.json();

            // ✅ Acceder a result.data (el wrapper del backend)
            if (!result.success || !result.data) {
                throw new Error('Respuesta inválida del servidor');
            }

            const canchaData = result.data;
            console.log('Datos de la cancha recibidos: en el hook', canchaData);

            // 🔧 Procesar las imágenes WebP igual que en useGetCanchas
            const imagenes_accesibles: ImagenAccesible[] =
                canchaData.imagenes_webp?.map((img) => ({
                    id: img.id,
                    orden: img.orden,
                    url: `${API_BASE_URL}${img.url_webp}` // URL completa
                })) || [];



            // 🔧 Construir el objeto de la cancha con la misma estructura que useGetCanchas
            const canchaProcesada: Cancha = {
                id: canchaData.id,
                nombre: canchaData.nombre,
                tipo: canchaData.tipo,
                subtipo: canchaData.subtipo,
                direccion: canchaData.direccion,
                latitud: canchaData.latitud,
                longitud: canchaData.longitud,
                direccion_completa: canchaData.direccion_completa,
                superficie: canchaData.superficie,
                capacidad: canchaData.capacidad,
                precio_hora: canchaData.precio_hora,
                descripcion: canchaData.descripcion,
                estado: canchaData.estado,
                fecha_creacion: canchaData.fecha_creacion,
                fecha_actualizacion: canchaData.fecha_actualizacion,
                imagenes_webp: canchaData.imagenes_webp,
                imagenes_accesibles, // ✅ Agregar las imágenes accesibles procesadas
                horarios: Array.isArray(canchaData.horarios) ? canchaData.horarios : [],
                reglas: Array.isArray(canchaData.reglas) ? canchaData.reglas : [],
                amenidades: Array.isArray(canchaData.amenidades) ? canchaData.amenidades : [],
            };



            setCancha(canchaProcesada);

        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Error al obtener la cancha';
            setError(errorMessage);
            setCancha(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCancha(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        cancha,
        isLoading,
        error,
        fetchCancha,
        reset
    };
}