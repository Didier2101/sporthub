// hooks/perfil/useEditProfile.ts
import { useState } from 'react';
import { z } from 'zod';

// ✅ Esquema de validación con los nombres exactos del backend
const editProfileSchema = z.object({
    name_user: z.string().min(1, 'El nombre es requerido'),
    biography: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
    sport: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),
    telephone: z.string().optional(),
    profile_image: z.instanceof(File).optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ✅ Interface para la respuesta del backend
interface ProfileUpdateResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        name_user: string;
        biography?: string;
        sport?: string;
        position?: string;
        city?: string;
        telephone?: string;
        urlphotoperfil?: string;
    };
}

interface EditProfileResult {
    success: boolean;
    error?: string;
    data?: ProfileUpdateResponse;
}

interface UseEditProfileReturn {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    uploadProgress: number;
    editProfile: (data: EditProfileFormData) => Promise<EditProfileResult>;
    reset: () => void;
}

export function useEditProfile(): UseEditProfileReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const editProfile = async (data: EditProfileFormData): Promise<EditProfileResult> => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            setUploadProgress(0);

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🚀 [useEditProfile] Iniciando actualización de perfil...');

            // ✅ Validar datos con Zod
            const validatedData = editProfileSchema.parse(data);

            // ✅ Crear FormData con los nombres exactos que espera el backend
            const formData = new FormData();

            // ✅ Agregar campos individuales al FormData con los nombres correctos
            formData.append('name_user', validatedData.name_user);

            // ✅ Agregar campos opcionales solo si tienen valor (con nombres del backend)
            if (validatedData.biography) {
                formData.append('biography', validatedData.biography);
            }
            if (validatedData.sport) {
                formData.append('sport', validatedData.sport);
            }
            if (validatedData.position) {
                formData.append('position', validatedData.position);
            }
            if (validatedData.city) {
                formData.append('city', validatedData.city);
            }
            if (validatedData.telephone) {
                formData.append('telephone', validatedData.telephone);
            }

            // ✅ Agregar imagen de perfil - el backend espera 'profilePicture'
            if (validatedData.profile_image) {
                console.log('📸 [useEditProfile] Agregando imagen de perfil al FormData:', {
                    nombre: validatedData.profile_image.name,
                    tamaño: `${(validatedData.profile_image.size / (1024 * 1024)).toFixed(2)} MB`,
                    tipo: validatedData.profile_image.type
                });

                // ✅ Usar el nombre exacto que espera el backend: 'profilePicture'
                formData.append('profilePicture', validatedData.profile_image);
            }

            console.log('📤 [useEditProfile] Enviando FormData con campos del backend:', {
                name_user: validatedData.name_user,
                biography: validatedData.biography || 'No',
                sport: validatedData.sport || 'No',
                position: validatedData.position || 'No',
                city: validatedData.city || 'No',
                telephone: validatedData.telephone || 'No',
                tieneImagen: !!validatedData.profile_image
            });

            // ✅ DEBUG: Mostrar todos los campos del FormData
            console.log('🔍 [useEditProfile] Campos en FormData:');
            for (const pair of formData.entries()) {
                if (pair[0] === 'profilePicture') {
                    console.log(`  ${pair[0]}: [File] ${(pair[1] as File).name}`);
                } else {
                    console.log(`  ${pair[0]}:`, pair[1]);
                }
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

            // ✅ Enviar datos al backend con credentials: include
            const response = await fetch(`${API_BASE_URL}/player/profile_update`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudo actualizar el perfil`);
            }

            const result: ProfileUpdateResponse = await response.json();
            console.log('✅ [useEditProfile] Perfil actualizado exitosamente:', result);

            setSuccess(true);

            return { success: true, data: result };

        } catch (err) {
            console.error('💥 [useEditProfile] Error:', err);

            let errorMessage = 'Error al actualizar el perfil';

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
        editProfile,
        reset,
    };
}