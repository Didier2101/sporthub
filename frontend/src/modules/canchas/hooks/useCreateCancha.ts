// hooks/canchas/useCreateCancha.ts
import { useState } from 'react';
import { z } from 'zod';

// ✅ Esquema actualizado con rangos horarios
const rangoHorarioSchema = z.object({
    dia_semana: z.string().min(1, 'El día es requerido'),
    hora_inicio: z.string().min(1, 'La hora de inicio es requerida'),
    hora_fin: z.string().min(1, 'La hora de fin es requerida'),
    intervalo_minutos: z.number().min(30, 'El intervalo mínimo es 30 minutos').default(60),
});

const createCanchaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    tipo: z.string().min(1, 'El tipo de deporte es requerido'),
    subtipo: z.string().min(1, 'El subtipo es requerido'),
    direccion: z.string().min(1, 'La dirección es requerida'),
    direccion_completa: z.string().min(1, 'La dirección completa es requerida'),
    superficie: z.string().optional(),
    capacidad: z.number().min(1, 'La capacidad es requerida'),
    precio_hora: z.number().min(1, 'El precio por hora es requerido'),
    descripcion: z.string().optional(),
    estado: z.string().default('activa'),
    imagenes: z.array(z.instanceof(File)).optional(),
    horarios: z.array(rangoHorarioSchema).min(1, 'Debe agregar al menos un rango horario'),
    reglas: z.array(z.string()).optional(),
    amenidades: z.array(z.string()).optional(),
});

export type RangoHorario = z.infer<typeof rangoHorarioSchema>;
export type CreateCanchaData = z.infer<typeof createCanchaSchema>;

interface CanchaCreationResult {
    success: boolean;
    error?: string;
    data?: {
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
        imagenes: string[];
        horarios: Array<RangoHorario>;
        reglas: Array<{ regla: string }>;
        amenidades: Array<{ amenidad: string }>;
    };
}

interface UseCreateCanchaReturn {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    uploadProgress: number;
    createCancha: (data: CreateCanchaData) => Promise<CanchaCreationResult>;
    reset: () => void;
}

export function useCreateCancha(): UseCreateCanchaReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const createCancha = async (data: CreateCanchaData): Promise<CanchaCreationResult> => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            setUploadProgress(0);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🚀 [useCreateCancha] Iniciando creación de cancha...');

            // ✅ Validar datos con Zod
            const validatedData = createCanchaSchema.parse(data);

            // ✅ Crear FormData para enviar todo en una sola petición
            const formData = new FormData();

            // ✅ Agregar campos individuales al FormData
            formData.append('nombre', validatedData.nombre);
            formData.append('tipo', validatedData.tipo);
            formData.append('subtipo', validatedData.subtipo);
            formData.append('direccion', validatedData.direccion);
            formData.append('direccion_completa', validatedData.direccion_completa);
            formData.append('capacidad', validatedData.capacidad.toString());
            formData.append('precio_hora', validatedData.precio_hora.toString());
            formData.append('estado', validatedData.estado);

            // ✅ Agregar campos opcionales

            if (validatedData.superficie) {
                formData.append('superficie', validatedData.superficie);
            }
            if (validatedData.descripcion) {
                formData.append('descripcion', validatedData.descripcion);
            }

            // ✅ Agregar horarios como JSON string
            formData.append('horarios', JSON.stringify(validatedData.horarios));

            // ✅ Agregar reglas como JSON string
            if (validatedData.reglas && validatedData.reglas.length > 0) {
                formData.append('reglas', JSON.stringify(
                    validatedData.reglas.map(regla => ({ regla }))
                ));
            }

            // ✅ Agregar amenidades como JSON string
            if (validatedData.amenidades && validatedData.amenidades.length > 0) {
                formData.append('amenidades', JSON.stringify(
                    validatedData.amenidades.map(amenidad => ({ amenidad }))
                ));
            }

            // ✅ Agregar imágenes como archivos binarios - CORREGIDO
            if (validatedData.imagenes && validatedData.imagenes.length > 0) {
                console.log(`📸 [useCreateCancha] Agregando ${validatedData.imagenes.length} imágenes al FormData...`);

                // ✅ SOLUCIÓN: Agregar cada imagen con un nombre diferente o como array
                validatedData.imagenes.forEach((file, index) => {
                    // Opción 1: Usar nombres diferentes (imagenes[0], imagenes[1], etc.)
                    formData.append(`imagenes[${index}]`, file);

                    // Opción 2: O usar el mismo nombre pero el backend debe soportar arrays
                    // formData.append('imagenes', file);

                    console.log(`📁 [useCreateCancha] Imagen ${index + 1}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
                });

                // ✅ También agregar el count para que el backend sepa cuántas imágenes esperar
                formData.append('imagenes_count', validatedData.imagenes.length.toString());
            }

            console.log('📤 [useCreateCancha] Enviando FormData con:', {
                nombre: validatedData.nombre,
                tipo: validatedData.tipo,
                subtipo: validatedData.subtipo,
                horarios: `${validatedData.horarios.length} rangos`,
                imagenes: `${validatedData.imagenes?.length || 0} archivos binarios`,
                reglas: `${validatedData.reglas?.length || 0} reglas`,
                amenidades: `${validatedData.amenidades?.length || 0} amenidades`
            });

            // ✅ DEBUG: Mostrar todos los campos del FormData
            console.log('🔍 [useCreateCancha] Campos en FormData:');
            for (const pair of formData.entries()) {
                console.log(`  ${pair[0]}:`, pair[1]);
            }

            // ✅ Simular progreso de subida
            const simulateProgress = () => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    if (progress <= 90) {
                        setUploadProgress(progress);
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
                return interval;
            };

            const progressInterval = simulateProgress();

            // ✅ Enviar datos al backend en una sola petición multipart/form-data
            const response = await fetch(`${API_BASE_URL}/cancha/create`, {
                method: 'POST',
                credentials: 'include', // ✅ Incluir cookies de sesión
                body: formData, // ✅ No establecer Content-Type, el navegador lo hará automáticamente
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la cancha`);
            }

            const result = await response.json();
            console.log('✅ [useCreateCancha] Cancha creada exitosamente:', result);

            setSuccess(true);

            return { success: true, data: result };

        } catch (err) {
            console.error('💥 [useCreateCancha] Error:', err);

            let errorMessage = 'Error al crear la cancha';

            if (err instanceof z.ZodError) {
                errorMessage = err.issues[0].message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };

        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
        setUploadProgress(0);
    };

    return {
        isLoading,
        error,
        success,
        uploadProgress,
        createCancha,
        reset,
    };
}