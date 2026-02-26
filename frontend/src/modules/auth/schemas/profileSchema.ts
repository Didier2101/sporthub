// En tu archivo profileSchema.ts
import { z } from 'zod';

export const editProfileSchema = z.object({
    name_user: z.string().min(1, 'El nombre es requerido'),
    age: z.number().min(13, 'Debes tener al menos 13 años').max(120),
    bio: z.string().max(500, 'La biografía no puede exceder 500 caracteres').default(''),
    favorite_sport: z.string().default(''),
    position: z.string().default(''),
    location: z.string().default(''),
    phone: z.string().default(''),
    profile_image: z.instanceof(FileList).optional(),
});

// NO exportes este tipo, déjalo que cada componente lo infiera