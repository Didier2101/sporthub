// src/types/Reserva.ts
export interface ReservaData {
    cancha_id: number;
    fecha: string;
    hora: string;
}

export interface Reserva {
    id: number;
    cancha_id: number;
    fecha: string;
    hora: string;
    estado: string;
    precio_total: number;
    created_at: string;
}

export interface HorarioDisponible {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    intervalo_minutos: number;
    disponible: boolean;
}