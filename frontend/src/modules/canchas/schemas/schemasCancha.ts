import { z } from "zod";

// ✅ Schema actualizado y corregido
export const canchaSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),

    tipo: z.string().min(1, 'Selecciona un tipo de cancha'),

    subtipo: z.string().min(1, 'Selecciona un subtipo de cancha'),

    direccion: z.string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(100, 'La dirección no puede exceder 100 caracteres'),

    ubicacion: z.object({
        lat: z.number()
            .min(-90, 'Latitud inválida (debe ser entre -90 y 90)')
            .max(90, 'Latitud inválida (debe ser entre -90 y 90)'),

        lng: z.number()
            .min(-180, 'Longitud inválida (debe ser entre -180 y 180)')
            .max(180, 'Longitud inválida (debe ser entre -180 y 180)'),

        address: z.string()
            .min(1, 'La dirección no puede estar vacía')
    }).refine(data => data.lat !== 0 || data.lng !== 0, {
        message: 'Debes seleccionar una ubicación válida en el mapa'
    }),

    superficie: z.string().min(1, 'Selecciona un tipo de superficie'),

    capacidad: z.number().min(1, "La capacidad debe ser al menos 1"),

    precio_hora: z.number().min(0, "El precio no puede ser negativo"),

    descripcion: z.string()
        .min(20, 'La descripción debe tener al menos 20 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres'),

    imagenes: z.array(z.string())
        .min(1, 'Debes subir al menos 1 imagen')
        .max(5, 'Máximo 5 imágenes permitidas'),

    // ✅ Horarios estructurados por día
    horarios: z.object({
        lunes: z.array(z.string()),
        martes: z.array(z.string()),
        miercoles: z.array(z.string()),
        jueves: z.array(z.string()),
        viernes: z.array(z.string()),
        sabado: z.array(z.string()),
        domingo: z.array(z.string())
    }).refine(data => {
        // Validar que al menos un día tenga horarios
        return Object.values(data).some(hours => hours.length > 0);
    }, {
        message: 'Debes seleccionar al menos un horario'
    }),

    reglas: z.array(
        z.string().min(10, 'Cada regla debe tener al menos 10 caracteres')
    ).min(1, 'Debes agregar al menos una regla'),

    // ✅ Amenities como array opcional
    amenities: z.array(z.string()).optional()
});

// ✅ Tipo inferido del schema
export type CanchaFormData = z.infer<typeof canchaSchema>;