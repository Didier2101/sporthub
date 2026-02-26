'use client';

import { UserPlus, Clock, Loader2, Check, UserX } from 'lucide-react';

interface BotonSolicitudAmistadProps {
    userId: number;
    estado: 'no_enviada' | 'enviando' | 'enviada' | 'pendiente' | 'rechazada';
    isLoading?: boolean;
    onClick: () => Promise<void>;
}

export default function BotonSolicitudAmistad({
    estado,
    isLoading = false,
    onClick
}: BotonSolicitudAmistadProps) {
    const obtenerConfiguracionBoton = () => {
        switch (estado) {
            case 'no_enviada':
                return {
                    texto: 'Agregar amigo',
                    icono: UserPlus,
                    clase: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg',
                    deshabilitado: false,
                    accion: 'enviar'
                };
            case 'enviando':
                return {
                    texto: 'Enviando...',
                    icono: Loader2,
                    clase: 'bg-rose-400 text-white cursor-not-allowed',
                    deshabilitado: true,
                    accion: 'ninguna'
                };
            case 'enviada':
                return {
                    texto: '¡Solicitud enviada!',
                    icono: Check,
                    clase: 'bg-green-500 text-white',
                    deshabilitado: true,
                    accion: 'ninguna'
                };
            case 'pendiente':
                return {
                    texto: 'Solicitud pendiente',
                    icono: Clock,
                    clase: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg',
                    deshabilitado: false,
                    accion: 'cancelar'
                };
            case 'rechazada':
                return {
                    texto: 'Solicitud rechazada',
                    icono: UserX,
                    clase: 'bg-red-400 hover:bg-red-500 text-white shadow-md hover:shadow-lg',
                    deshabilitado: false,
                    accion: 'reenviar'
                };
            default:
                return {
                    texto: 'Agregar amigo',
                    icono: UserPlus,
                    clase: 'bg-rose-500 hover:bg-rose-600 text-white',
                    deshabilitado: false,
                    accion: 'enviar'
                };
        }
    };

    const config = obtenerConfiguracionBoton();
    const IconoComponente = config.icono;

    // Determinar el texto del tooltip según la acción
    const getTooltip = () => {
        switch (config.accion) {
            case 'enviar': return 'Enviar solicitud de amistad';
            case 'cancelar': return 'Cancelar solicitud pendiente';
            case 'reenviar': return 'Volver a enviar solicitud';
            default: return '';
        }
    };

    const tooltip = getTooltip();

    return (
        <div className="relative group">
            <button
                onClick={onClick}
                disabled={config.deshabilitado || isLoading}
                title={tooltip}
                className={`
                    relative flex items-center justify-center space-x-2 
                    px-6 py-3 rounded-full font-semibold text-sm
                    transition-all duration-200 transform
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                    ${config.clase}
                    ${!config.deshabilitado ? 'hover:scale-105 active:scale-95' : ''}
                    ${config.accion === 'cancelar' ? 'hover:bg-yellow-600' : ''}
                    ${config.accion === 'reenviar' ? 'hover:bg-red-500' : ''}
                `}
            >
                {isLoading || estado === 'enviando' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <IconoComponente className={`w-4 h-4 ${estado === 'enviada' ? 'animate-pulse' : ''}`} />
                )}
                <span className="whitespace-nowrap">{config.texto}</span>
            </button>

            {/* Tooltip para acciones */}
            {tooltip && !config.deshabilitado && !isLoading && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
}