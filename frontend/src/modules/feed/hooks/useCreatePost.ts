// hooks/useCreatePost.ts
import { useState } from 'react';

interface UseCreatePostResult {
    // Estados
    newPostContent: string;
    setNewPostContent: (content: string) => void;
    selectedImage: File | null;
    previewUrl: string | null;
    isCreatingPost: boolean;

    // Estados de upload
    uploading: boolean;
    progress: number;
    uploadError: string | null;

    // Funciones
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: () => void;
    handlePostSubmit: () => Promise<void>; // ✅ Ya no recibe userId
}

export function useCreatePost(): UseCreatePostResult {
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Manejar selección de imagen
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Tipo de archivo no permitido. Use JPEG, PNG o WebP.');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setUploadError('La imagen debe ser menor a 5MB');
            return;
        }

        console.log(`📄 [useCreatePost] Imagen seleccionada: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

        setSelectedImage(file);
        setUploadError(null);

        // Crear preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Remover imagen
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setUploadError(null);
        setProgress(0);
    };

    // ✅ Crear publicación - SIN userId
    const handlePostSubmit = async () => {
        // Validación
        if (!newPostContent.trim() && !selectedImage) {
            setUploadError('Debe agregar texto o una imagen');
            return;
        }

        setIsCreatingPost(true);
        setUploading(true);
        setUploadError(null);

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!API_BASE_URL) {
                throw new Error('URL de la API no configurada');
            }

            console.log('🚀 [useCreatePost] Iniciando creación de post...');

            // ✅ Crear FormData para enviar archivo completo
            const formData = new FormData();

            // ✅ Agregar campos de texto al FormData
            formData.append('contenido', newPostContent.trim() || (selectedImage ? '📷' : ''));
            formData.append('tipo_post', selectedImage ? 'foto' : 'texto');
            // ✅ ELIMINADO: formData.append('user_id', userId.toString());

            // ✅ Agregar imagen como archivo binario completo (si existe)
            if (selectedImage) {
                console.log(`📸 [useCreatePost] Agregando imagen completa al FormData: ${selectedImage.name} (${(selectedImage.size / (1024 * 1024)).toFixed(2)} MB)`);
                formData.append('imagen', selectedImage);
                setProgress(40);
            }

            console.log('📤 [useCreatePost] Enviando FormData con:', {
                contenido: newPostContent.trim() || '📷',
                tipo_post: selectedImage ? 'foto' : 'texto',
                tiene_imagen: !!selectedImage,
                imagen_nombre: selectedImage?.name,
                imagen_size: selectedImage ? `${(selectedImage.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A',
                imagen_tipo: selectedImage?.type
            });

            // ✅ DEBUG: Mostrar todos los campos del FormData
            console.log('🔍 [useCreatePost] Campos en FormData:');
            for (const pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`  ${pair[0]}: [FILE] ${pair[1].name} (${(pair[1].size / (1024 * 1024)).toFixed(2)} MB)`);
                } else {
                    console.log(`  ${pair[0]}:`, pair[1]);
                }
            }

            // ✅ Simular progreso de subida
            const simulateProgress = () => {
                let currentProgress = selectedImage ? 40 : 0;
                const interval = setInterval(() => {
                    currentProgress += 10;
                    if (currentProgress <= 90) {
                        setProgress(currentProgress);
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
                return interval;
            };

            const progressInterval = simulateProgress();

            // ✅ Enviar datos al backend como multipart/form-data
            const response = await fetch(`${API_BASE_URL}/posts/create`, {
                method: 'POST',
                credentials: 'include', // ✅ Incluir cookies de sesión (el backend obtiene el userId de la sesión)
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la publicación`);
            }

            const result = await response.json();
            console.log('✅ [useCreatePost] Publicación creada exitosamente:', result);

            // ✅ Limpiar formulario
            setNewPostContent('');
            handleRemoveImage();

            // ✅ Recargar página para ver el nuevo post
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            console.error('💥 [useCreatePost] Error:', err);

            let errorMessage = 'Error al crear la publicación';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setUploadError(errorMessage);

        } finally {
            setIsCreatingPost(false);
            setUploading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return {
        newPostContent,
        setNewPostContent,
        selectedImage,
        previewUrl,
        isCreatingPost,
        uploading,
        progress,
        uploadError,
        handleImageSelect,
        handleRemoveImage,
        handlePostSubmit, // ✅ Ya no requiere parámetros
    };
}