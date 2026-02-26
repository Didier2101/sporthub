// src/types/Cancha.ts

export interface ImagenWebP {
    id: number;
    orden: number;
    url_webp: string;
    nombre: string;
    formato: string;
}

export interface ImagenAccesible {
    id: number;
    orden: number;
    url: string;
}

export interface HorarioCancha {
    id: number; // ✅ AGREGAR ESTA LÍNEA
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    intervalo_minutos: number;
    disponible: boolean;
}

export interface ReglaCancha {
    id: number; // ✅ AGREGAR ESTA LÍNEA
    regla: string;
}

export interface AmenidadCancha {
    id: number; // ✅ AGREGAR ESTA LÍNEA
    amenidad: string;
}

export interface Cancha {
    id: number;
    nombre: string;
    tipo: string;
    subtipo: string;
    direccion: string;
    direccion_completa: string;
    superficie?: string;
    capacidad: number;
    precio_hora: number;
    descripcion?: string;
    estado: string;
    fecha_creacion?: string;
    fecha_actualizacion?: string;

    // Imágenes WebP del backend
    imagenes_webp: ImagenWebP[];

    // Imágenes procesadas para usar en la app (con URLs completas)
    imagenes_accesibles?: ImagenAccesible[];

    // Datos relacionados
    horarios?: HorarioCancha[];
    reglas?: ReglaCancha[];
    amenidades?: AmenidadCancha[];
}

export interface CanchaFormData {
    nombre: string;
    tipo: string;
    subtipo: string;
    direccion: string;
    direccion_completa: string;
    superficie?: string;
    capacidad: number;
    precio_hora: number;
    descripcion?: string;
    estado: string;
}

export interface ApiCanchaResponse {
    success: boolean;
    data: Cancha[];
    count: number;
    formato_imagenes: string;
}