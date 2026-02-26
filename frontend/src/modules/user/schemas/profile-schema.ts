import { z } from 'zod';

export const profileSchema = z.object({
    deporte: z.enum(['football', 'tennis'], {
        message: "Selecciona un deporte."
    }),
    nombre_completo: z.string().min(2, { message: 'El nombre es obligatorio' }),
    fecha_nacimiento: z.string().min(1, { message: 'La fecha es obligatoria' }),
    posicion: z.string().optional(),
    genero: z.enum(['masculino', 'femenino', 'otro'], {
        message: "Selecciona un género válido."
    }),
    ciudad: z.string().min(2, { message: 'La ciudad es requerida' }),
    telefono: z.string().min(7, { message: 'El teléfono debe tener al menos 7 caracteres' }).optional().or(z.literal('')),
    altura: z.string()
        .min(1, { message: 'La altura es obligatoria' })
        .refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, { message: 'Ingresa una altura válida' })
        .refine((val) => {
            const num = Number(val);
            return num >= 0.5 && num <= 3.0;
        }, { message: 'La altura debe estar entre 0.5 y 3.0 metros' }),

    peso: z.string()
        .min(1, { message: 'El peso es obligatorio' })
        .refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, { message: 'Ingresa un peso válido' })
        .refine((val) => {
            const num = Number(val);
            return num >= 20 && num <= 300;
        }, { message: 'El peso debe estar entre 20 y 300 kg' }),
    mano_dominante: z.enum(['izquierda', 'derecha', 'ambas'], {
        message: 'Selecciona tu mano dominante'
    }),

    profilePicture: z.array(z.string())
        .min(1, 'Debes subir una foto de perfil')
        .max(1, 'Solo puedes subir una foto de perfil'),

    pierna_dominante: z.string().optional()
})
    .refine((data) => {
        // Validación condicional: si es fútbol, pierna_dominante es requerida
        if (data.deporte === 'football') {
            return data.pierna_dominante && data.pierna_dominante.trim() !== '';
        }
        return true;
    }, {
        message: 'La pierna hábil es requerida para fútbol',
        path: ['pierna_dominante']
    });

export type ProfileFormData = z.infer<typeof profileSchema>;