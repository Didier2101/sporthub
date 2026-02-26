'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, Camera, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { useGetCurrentUser } from '@/user/hooks/useGetCurrentUser';
import { useEditProfile } from '@/user/hooks/useEditProfile';

const editProfileSchema = z.object({
    name_user: z.string().min(1, 'El nombre es requerido'),
    biography: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
    sport: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),
    telephone: z.string().optional(),
    // profile_image: z.instanceof(File).optional(),
    profile_image: z.any().optional(),

});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function FormEditPerfil() {
    const router = useRouter();
    const { userData: backendUserData, isLoading: loadingUser, error: errorUser, refetch } = useGetCurrentUser();
    const { isLoading, error, success, editProfile, reset: resetEditProfile } = useEditProfile();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const hasInitialized = useRef(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        mode: 'onChange',
        defaultValues: {
            name_user: '',
            biography: '',
            sport: '',
            position: '',
            city: '',
            telephone: '',
        }
    });

    useEffect(() => {
        if (backendUserData && !hasInitialized.current) {
            resetForm({
                name_user: backendUserData.name_user || '',
                biography: backendUserData.biography || '',
                sport: backendUserData.sport || '',
                position: backendUserData.position || '',
                city: backendUserData.city || '',
                telephone: backendUserData.telephone || '',
            });

            if (backendUserData.urlphotoperfil) {
                setImagePreview(backendUserData.urlphotoperfil);
            }

            hasInitialized.current = true;
        }
    }, [backendUserData, resetForm]);

    useEffect(() => {
        if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Perfil actualizado correctamente',
                timer: 3000,
                showConfirmButton: false,
            });

            setTimeout(async () => {
                await refetch();
                resetEditProfile();
                router.push("/profile");
            }, 2000);
        }
    }, [success, refetch, resetEditProfile, router]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error || 'Ocurrió un error al actualizar el perfil',
                confirmButtonText: 'Aceptar',
            });
            resetEditProfile();
        }
    }, [error, resetEditProfile]);

    useEffect(() => {
        if (errorUser) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información del usuario',
                confirmButtonText: 'Aceptar',
            });
        }
    }, [errorUser]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La imagen no debe superar los 2MB',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Solo se permiten imágenes JPG, PNG o WebP',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(backendUserData?.urlphotoperfil || null);
        const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        Swal.fire({
            icon: 'info',
            title: 'Imagen removida',
            text: 'La imagen se ha removido correctamente',
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const onSubmit = async (data: EditProfileFormData) => {
        try {
            const dataToSend = {
                ...data,
                profile_image: selectedImage || undefined,
            };

            const result = await editProfile(dataToSend);

            if (!result.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el perfil',
                    text: result.error || 'Error al actualizar el perfil',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                text: 'Tu perfil se ha actualizado correctamente',
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente.',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (!backendUserData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario</p>
                    <Link
                        href="/auth/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto">
                {/* Header fijo estilo Airbnb */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={isLoading}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-semibold">Editar perfil</h1>
                            {/* Spacer para centrar el título */}
                            <div className="w-9"></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Foto de perfil */}
                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Foto de perfil</h2>
                            <p className="text-sm text-gray-500">Agrega una foto para personalizar tu cuenta</p>
                        </div>

                        {/* Preview de imagen */}
                        <div className="flex items-center gap-6 mb-6">
                            {imagePreview ? (
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <Image
                                            src={imagePreview}
                                            alt="Vista previa"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {selectedImage && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            )}

                            {/* Botón para cambiar foto */}
                            <div>
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profile-image-input"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm"
                                >
                                    <Camera className="w-4 h-4" />
                                    {imagePreview ? 'Cambiar foto' : 'Subir foto'}
                                </label>
                                <p className="text-xs text-gray-500 mt-2">JPG, PNG o WebP. Máx. 2MB</p>
                            </div>
                        </div>
                    </section>

                    {/* Información personal */}
                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Información personal</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name_user" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="name_user"
                                    {...register('name_user')}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Este campo no se puede modificar</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={backendUserData?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Este campo no se puede modificar</p>
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="telephone"
                                    {...register('telephone')}
                                    placeholder="+57 300 123 4567"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                />
                                {errors.telephone && (
                                    <p className="text-red-600 text-xs mt-1.5">{errors.telephone.message}</p>
                                )}
                            </div>

                            {/* Ciudad */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    {...register('city')}
                                    placeholder="Bogotá, Colombia"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                />
                                {errors.city && (
                                    <p className="text-red-600 text-xs mt-1.5">{errors.city.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Información deportiva */}
                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Información deportiva</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Deporte favorito */}
                            <div>
                                <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
                                    Deporte favorito
                                </label>
                                <select
                                    id="sport"
                                    {...register('sport')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                >
                                    <option value="">Selecciona un deporte</option>
                                    <option value="Fútbol">Fútbol</option>
                                    <option value="Baloncesto">Baloncesto</option>
                                    <option value="Tenis">Tenis</option>
                                    <option value="Voleibol">Voleibol</option>
                                    <option value="Natación">Natación</option>
                                    <option value="Ciclismo">Ciclismo</option>
                                    <option value="Atletismo">Atletismo</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>

                            {/* Posición */}
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                    Posición o rol
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    {...register('position')}
                                    placeholder="Ej: Delantero, Base, etc."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                />
                                {errors.position && (
                                    <p className="text-red-600 text-xs mt-1.5">{errors.position.message}</p>
                                )}
                            </div>

                            {/* Biografía */}
                            <div>
                                <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-2">
                                    Biografía
                                </label>
                                <textarea
                                    id="biography"
                                    {...register('biography')}
                                    rows={4}
                                    placeholder="Cuéntanos un poco sobre ti..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow resize-none"
                                />
                                {errors.biography && (
                                    <p className="text-red-600 text-xs mt-1.5">{errors.biography.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Botones de acción */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'Cambios descartados',
                                        text: 'Los cambios no guardados se han descartado',
                                        timer: 2000,
                                        showConfirmButton: false,
                                    });
                                    router.back();
                                }}
                                disabled={isLoading}
                                className="px-6 py-3 text-gray-900 font-medium text-sm hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}