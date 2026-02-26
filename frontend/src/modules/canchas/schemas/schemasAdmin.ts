import { z } from 'zod';

// schemasAdmin.ts
export const adminProfileSchema = z.object({
    nombre_administrador: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder los 50 caracteres'),
    telefono: z.string()
        .regex(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
});

export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;
