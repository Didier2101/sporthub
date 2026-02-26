import z from "zod";

// Esquema de validación con Zod
export const canchaSchema = z.object({
    nombre: z.string().min(3, "Mínimo 3 caracteres"),
    tipo: z.string().min(1, "Selecciona un tipo"),
    ubicacion: z.string().min(5, "Ubicación requerida"),
    direccion: z.string().min(10, "Dirección completa"),
    zona: z.string().min(1, "Selecciona una zona"),
    precio: z.number().min(10000, "Mínimo $10,000"),
    descripcion: z.string().min(20, "Descripción detallada"),
    superficie: z.string().min(1, "Selecciona superficie"),
    capacidad: z.number().min(2, "Mínimo 2 jugadores"),
    telefono: z.string().regex(/^\+?[0-9]{10,15}$/, "Teléfono inválido"),
    email: z.string().email("Email inválido"),
    activa: z.boolean(),
    destacada: z.boolean(),
    reglas: z.array(z.string()).min(1, "Agrega al menos 1 regla"),
    imagenes: z.array(z.string()).min(1, "Sube al menos 1 imagen"),
    horarios: z.record(z.string(), z.string())
});

export type canchaSchemaData = z.infer<typeof canchaSchema>;
