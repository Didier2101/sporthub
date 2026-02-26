import { z } from "zod";

// Calcular fecha máxima (hace 18 años)
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

// Calcular fecha mínima (hace 120 años)
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);

// Schema de validación con Zod
export const registerSchema = z.object({
    name_user: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, "El nombre solo puede contener letras"),

    email: z
        .string()
        .email("Por favor ingresa un email válido")
        .min(1, "El email es requerido"),

    fechanacimiento: z
        .date({ message: "La fecha de nacimiento es requerida" })
        .min(minDate, "Por favor ingresa una fecha de nacimiento válida")
        .max(maxDate, "Debes ser mayor de 18 años para registrarte"),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .min(1, "La contraseña es requerida"),

    confirmPassword: z
        .string()
        .min(1, "Debes confirmar la contraseña"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;