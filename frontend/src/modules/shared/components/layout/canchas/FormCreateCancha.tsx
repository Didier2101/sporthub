// app/canchas/nueva/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, Upload, Plus, X, Trash2, Loader2, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateCanchaData, RangoHorario, useCreateCancha } from '@/src/hooks/canchas/useCreateCancha';
import Image from 'next/image';
import Swal from 'sweetalert2';



const DIAS_SEMANA = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
];

const INTERVALOS_DISPONIBLES = [
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' },
];

export default function FormCreateCancha() {
    const { createCancha, isLoading, uploadProgress } = useCreateCancha();
    const router = useRouter();

    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        direccion_completa: '',
        tipo: '',
        subtipo: '',
        precioHora: '',
        capacidad: '',
        descripcion: '',
        superficie: '',
    });

    // Estado para rangos horarios
    const [horarios, setHorarios] = useState<RangoHorario[]>([]);
    const [reglas, setReglas] = useState<string[]>([]);
    const [amenidades, setAmenidades] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Aplicación masiva de horarios
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [bulkHoraInicio, setBulkHoraInicio] = useState('');
    const [bulkHoraFin, setBulkHoraFin] = useState('');
    const [bulkIntervalo, setBulkIntervalo] = useState(60);



    const handleSubmit = async () => {

        // Validar campos requeridos
        if (
            !formData.nombre ||
            !formData.tipo ||
            !formData.subtipo ||
            !formData.direccion ||
            !formData.direccion_completa ||
            !formData.precioHora ||
            !formData.capacidad
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos requeridos',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        // Validar horarios (rangos)
        const horariosValidos = horarios.filter(h =>
            h.dia_semana && h.hora_inicio && h.hora_fin && h.intervalo_minutos > 0
        );

        if (horariosValidos.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin horarios válidos',
                text: 'Debe agregar al menos un rango horario válido',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        // Validar que hora_fin sea mayor que hora_inicio
        const horariosInvalidos = horariosValidos.filter(h => h.hora_inicio >= h.hora_fin);
        if (horariosInvalidos.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Horarios inválidos',
                text: 'La hora de fin debe ser posterior a la hora de inicio en todos los rangos',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        const reglasValidas = reglas.filter(r => r.trim() !== '');
        const amenidadesValidas = amenidades.filter(a => a.trim() !== '');

        const dataToSend: CreateCanchaData = {
            nombre: formData.nombre,
            tipo: formData.tipo,
            subtipo: formData.subtipo,
            direccion: formData.direccion,
            direccion_completa: formData.direccion_completa,
            superficie: formData.superficie,
            capacidad: parseInt(formData.capacidad),
            precio_hora: parseFloat(formData.precioHora),
            descripcion: formData.descripcion,
            estado: 'activa',
            imagenes: imageFiles,
            horarios: horariosValidos,
            reglas: reglasValidas,
            amenidades: amenidadesValidas,
        };

        const result = await createCancha(dataToSend);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Cancha creada',
                text: '¡Cancha creada exitosamente!',
                confirmButtonColor: '#f43f5e',
                timer: 3000,
                showConfirmButton: false
            });

            setTimeout(() => {
                router.push("/canchas");
            }, 2000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear la cancha',
                text: `Error: ${result.error}`,
                confirmButtonColor: '#f43f5e'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const newPreviews: string[] = [];

            newFiles.forEach(file => {
                console.log(`📄 [FormCreateCancha] Procesando: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);

                    if (newPreviews.length === newFiles.length) {
                        setImageFiles(prev => [...prev, ...newFiles]);
                        setImagePreviews(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));

        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleRemoveAllImages = () => {
        setImageFiles([]);
        setImagePreviews([]);

        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Funciones para manejar rangos horarios
    const addHorario = () => setHorarios([...horarios, {
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        intervalo_minutos: 60
    }]);

    const removeHorario = (index: number) => setHorarios(horarios.filter((_, i) => i !== index));

    const updateHorario = (index: number, field: keyof RangoHorario, value: string | number) => {
        const newHorarios = [...horarios];
        newHorarios[index] = { ...newHorarios[index], [field]: value };
        setHorarios(newHorarios);
    };

    // Aplicar horarios masivos a múltiples días
    const applyBulkHorarios = () => {
        if (selectedDays.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Día no seleccionado',
                text: 'Selecciona al menos un día',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        if (!bulkHoraInicio || !bulkHoraFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Horas incompletas',
                text: 'Completa las horas de inicio y fin',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        if (bulkHoraInicio >= bulkHoraFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Rango horario inválido',
                text: 'La hora de fin debe ser posterior a la hora de inicio',
                confirmButtonColor: '#f43f5e'
            });
            return;
        }

        // Eliminar horarios existentes de los días seleccionados
        const horariosActualizados = horarios.filter(
            (h) => !selectedDays.includes(h.dia_semana)
        );

        // Agregar nuevos horarios para los días seleccionados
        const nuevosHorarios = selectedDays.map((dia) => ({
            dia_semana: dia,
            hora_inicio: bulkHoraInicio,
            hora_fin: bulkHoraFin,
            intervalo_minutos: bulkIntervalo,
        }));

        setHorarios([...horariosActualizados, ...nuevosHorarios]);

        // Resetear selector masivo
        setSelectedDays([]);
        setBulkHoraInicio("");
        setBulkHoraFin("");

        Swal.fire({
            icon: 'success',
            title: 'Horarios aplicados',
            text: `Horarios aplicados a ${selectedDays.length} día(s)`,
            confirmButtonColor: '#f43f5e',
            timer: 3000,
            showConfirmButton: false
        });
    };

    const toggleDaySelection = (dia: string) => {
        setSelectedDays(prev =>
            prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
        );
    };

    const addRegla = () => setReglas([...reglas, '']);
    const removeRegla = (index: number) => setReglas(reglas.filter((_, i) => i !== index));
    const updateRegla = (index: number, value: string) => {
        const newReglas = [...reglas];
        newReglas[index] = value;
        setReglas(newReglas);
    };

    const addAmenidad = () => setAmenidades([...amenidades, '']);
    const removeAmenidad = (index: number) => setAmenidades(amenidades.filter((_, i) => i !== index));
    const updateAmenidad = (index: number, value: string) => {
        const newAmenidades = [...amenidades];
        newAmenidades[index] = value;
        setAmenidades(newAmenidades);
    };

    return (
        <div className="min-h-screen px-2 mt-2">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
                <ArrowLeft className="w-5 h-5" />
                Volver
            </button>

            <div className="mt-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

                    {/* Progreso de subida */}
                    {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-medium">Subiendo datos...</span>
                                </div>
                                <span className="font-semibold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                                Por favor espera mientras se suben los datos e imágenes...
                            </p>
                        </div>
                    )}

                    {/* Información básica */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la cancha *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="Ej: Cancha Central"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de deporte *
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Seleccionar deporte</option>
                                    <option value="Fútbol">Fútbol</option>
                                    <option value="Básquetbol">Básquetbol</option>
                                    <option value="Tenis">Tenis</option>
                                    <option value="Vóleibol">Vóleibol</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtipo *
                                </label>
                                <select
                                    name="subtipo"
                                    value={formData.subtipo}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Seleccionar subtipo</option>
                                    <option value="Fútbol 11">Fútbol 11</option>
                                    <option value="Fútbol 8">Fútbol 8</option>
                                    <option value="Fútbol 7">Fútbol 7</option>
                                    <option value="Fútbol 5">Fútbol 5</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de superficie
                                </label>
                                <select
                                    name="superficie"
                                    value={formData.superficie}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Seleccionar superficie</option>
                                    <option value="Natural">Césped natural</option>
                                    <option value="Sintética">Césped sintético</option>
                                    <option value="Híbrida">Césped híbrido</option>
                                    <option value="Caucho">Piso de caucho</option>
                                    <option value="Cemento">Cemento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio por hora *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="precioHora"
                                        value={formData.precioHora}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="50000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Capacidad *
                                </label>
                                <input
                                    type="number"
                                    name="capacidad"
                                    value={formData.capacidad}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="22"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Calle Principal 123"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección completa *
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion_completa"
                                        value={formData.direccion_completa}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Calle Principal 123, Colonia Centro, Ciudad"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            disabled={isLoading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Describe las características de tu cancha..."
                        />
                    </div>

                    {/* Imágenes */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Imágenes de la cancha
                            </label>
                            {imagePreviews.length > 0 && !isLoading && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAllImages}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar todas
                                </button>
                            )}
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Haz clic para subir imágenes</p>
                            <p className="text-gray-500 text-sm">PNG, JPG hasta 5MB por imagen (múltiples archivos)</p>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                id="image-upload"
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`inline-block mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Seleccionar archivos
                            </label>
                        </div>

                        {/* Grid de imágenes */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        {imagePreviews.length} imagen(es) seleccionada(s)
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        Haz clic en la X para eliminar
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative group bg-gray-50 rounded-lg p-2 border border-gray-200"
                                        >
                                            <div className="relative h-32">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />

                                                {!isLoading && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                        title="Eliminar esta imagen"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mt-2 text-xs text-gray-600">
                                                <p className="truncate font-medium" title={imageFiles[index]?.name}>
                                                    {imageFiles[index]?.name || `Imagen ${index + 1}`}
                                                </p>
                                                <p className="text-gray-500">
                                                    {(imageFiles[index]?.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN DE HORARIOS */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-rose-500" />
                                Horarios disponibles *
                            </h2>
                        </div>

                        {/* Aplicación masiva de horarios */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Aplicar horarios a múltiples días
                            </h3>

                            {/* Selector de días */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-blue-900 mb-2">
                                    Selecciona los días:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {DIAS_SEMANA.map(dia => (
                                        <button
                                            key={dia.value}
                                            type="button"
                                            onClick={() => toggleDaySelection(dia.value)}
                                            disabled={isLoading}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDays.includes(dia.value)
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {dia.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Horarios masivos */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-blue-900 mb-1">
                                        Hora de inicio
                                    </label>
                                    <input
                                        type="time"
                                        value={bulkHoraInicio}
                                        onChange={(e) => setBulkHoraInicio(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-blue-900 mb-1">
                                        Hora de fin
                                    </label>
                                    <input
                                        type="time"
                                        value={bulkHoraFin}
                                        onChange={(e) => setBulkHoraFin(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-blue-900 mb-1">
                                        Intervalo
                                    </label>
                                    <select
                                        value={bulkIntervalo}
                                        onChange={(e) => setBulkIntervalo(Number(e.target.value))}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                    >
                                        {INTERVALOS_DISPONIBLES.map(int => (
                                            <option key={int.value} value={int.value}>
                                                {int.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={applyBulkHorarios}
                                disabled={isLoading || selectedDays.length === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Aplicar a {selectedDays.length || 0} día(s)
                            </button>
                        </div>

                        {/* Horarios configurados */}
                        <div className="space-y-3">
                            {horarios.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm">
                                        No hay horarios configurados. Usa el selector de arriba para agregar horarios.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Horarios configurados ({horarios.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addHorario}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-sm font-medium disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar individual
                                        </button>
                                    </div>

                                    {horarios.map((horario, index) => (
                                        <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <select
                                                value={horario.dia_semana}
                                                onChange={(e) => updateHorario(index, 'dia_semana', e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                            >
                                                <option value="">Día *</option>
                                                {DIAS_SEMANA.map(dia => (
                                                    <option key={dia.value} value={dia.value}>
                                                        {dia.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="time"
                                                value={horario.hora_inicio}
                                                onChange={(e) => updateHorario(index, 'hora_inicio', e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                                placeholder="Inicio"
                                            />
                                            <input
                                                type="time"
                                                value={horario.hora_fin}
                                                onChange={(e) => updateHorario(index, 'hora_fin', e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                                placeholder="Fin"
                                            />
                                            <select
                                                value={horario.intervalo_minutos}
                                                onChange={(e) => updateHorario(index, 'intervalo_minutos', Number(e.target.value))}
                                                disabled={isLoading}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm disabled:bg-gray-100"
                                            >
                                                {INTERVALOS_DISPONIBLES.map(int => (
                                                    <option key={int.value} value={int.value}>
                                                        {int.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {horarios.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeHorario(index)}
                                                    disabled={isLoading}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Reglas */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Reglas</h2>
                            <button
                                type="button"
                                onClick={addRegla}
                                disabled={isLoading}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar regla
                            </button>
                        </div>
                        <div className="space-y-3">
                            {reglas.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">No hay reglas agregadas. Haz clic en &quot;Agregar regla&quot; para añadir.</p>
                                </div>
                            ) : (
                                reglas.map((regla, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={regla}
                                            onChange={(e) => updateRegla(index, e.target.value)}
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Ej: No se permite fumar"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRegla(index)}
                                            disabled={isLoading}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Amenidades */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Amenidades</h2>
                            <button
                                type="button"
                                onClick={addAmenidad}
                                disabled={isLoading}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar amenidad
                            </button>
                        </div>
                        <div className="space-y-3">
                            {amenidades.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">No hay amenidades agregadas. Haz clic en &quot;Agregar amenidad&quot; para añadir.</p>
                                </div>
                            ) : (
                                amenidades.map((amenidad, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={amenidad}
                                            onChange={(e) => updateAmenidad(index, e.target.value)}
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Ej: Vestidores"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAmenidad(index)}
                                            disabled={isLoading}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploadProgress > 0 && uploadProgress < 100 ? 'Subiendo...' : 'Creando cancha...'}
                                </>
                            ) : (
                                'Crear Cancha'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}