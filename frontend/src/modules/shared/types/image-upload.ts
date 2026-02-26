// types/image-upload.ts

export type ImageStatus = 'uploading' | 'uploaded' | 'error' | 'queued';
export type ImageCategory = 'cancha' | 'perfil' | 'noticia' | 'jugador' | 'general';

// Imágenes almacenadas en el servidor (respuesta del API)
export interface StoredUserImage {
    fileName: string;
    url: string;
    category: ImageCategory;
    size: number;
    sizeFormatted: string;
    createdAt: string;
    modifiedAt: string;
}


export interface UploadedImage {
    id: string;
    file?: File;
    preview: string;
    url?: string;
    status: ImageStatus;
    error?: string;
    progress?: number;
    category: ImageCategory;
    fileName?: string;
    originalName?: string;
    size?: number;
    mimeType?: string;
    uploadedAt?: string;
}

export interface ImageUploadConfig {
    maxImages: number;
    maxSizeMB: number;
    allowedTypes: string[];
    category: ImageCategory;
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free';
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
}

export interface ImageUploaderProps {
    config: ImageUploadConfig;
    initialImages?: string[];
    onImagesChange: (images: UploadedImage[]) => void;
    onUrlsChange?: (urls: string[]) => void;
    className?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    showToast?: (message: string, type?: 'success' | 'error') => void;
}

// Respuestas de la API
export interface UploadApiResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        url: string;
        size: number;
        sizeFormatted: string;
        type: string;
        fileName: string;
        originalName: string;
        category: ImageCategory;
        uploadedAt: string;
    };
    error?: string;
    code?: string;
    details?: unknown;
}

export interface UploadErrorResponse {
    success: false;
    error: string;
    code: string;
    allowedTypes?: string[];
    receivedType?: string;
    maxSizeMB?: number;
    receivedSizeMB?: number;
    validCategories?: string[];
}

// Configuraciones predefinidas por categoría
export interface CategoryConfig {
    maxSizeMB: number;
    allowedTypes: string[];
    directory: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

export interface UploadConfigs {
    maxFileSizeMB: number;
    categories: Record<ImageCategory, CategoryConfig>;
}

// Hooks
export interface UseImageUploaderReturn {
    config: ImageUploadConfig;
}