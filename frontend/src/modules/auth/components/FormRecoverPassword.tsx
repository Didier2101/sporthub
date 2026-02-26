'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FaArrowLeft,
    FaUsers,
    FaTrophy,
    FaChartLine,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaShieldAlt,
    FaBolt,
    FaEnvelope,
    FaCheckCircle
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

import { Logo } from "@shared/components/brand/Logo";
import { useRecoverPassword } from "@/auth/hooks/useRecoverPassword";
import { APP_ROUTES } from "@shared/constants";
import { FeatureCard } from "@shared/components/ui/FeatureCard";
import { StatBadge } from "@shared/components/ui/StatBadge";
import { features } from "@shared/data/features";

// Zod Schema
const recoverSchema = z.object({
    email: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("Ingresa un correo electrónico válido"),
});

type RecoverSchemaType = z.infer<typeof recoverSchema>;

// Feature Card Component
interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}



// Stat Badge Component
interface StatBadgeProps {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
}



export default function FormRecoverPassword() {
    const { isLoading, success, recoverPassword } = useRecoverPassword();

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        reset,
    } = useForm<RecoverSchemaType>({
        resolver: zodResolver(recoverSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: RecoverSchemaType) => {
        const result = await recoverPassword(data);

        if (result.success) {
            reset(); // Limpiar el formulario
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl"></div>

            <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left Panel - Branding & Features */}
                    <div className="hidden lg:block space-y-6 xl:space-y-8">
                        <div className="space-y-4 xl:space-y-6">
                            <Logo />

                            <div className="space-y-3 xl:space-y-4">
                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                    <FaBolt className="text-xs sm:text-sm" />
                                    La red social del deporte
                                </div>

                                <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 leading-tight">
                                    Recupera tu acceso
                                    <span className="block bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                        en minutos
                                    </span>
                                </h1>

                                <p className="text-base xl:text-lg 2xl:text-xl text-gray-600 leading-relaxed">
                                    No te preocupes, te enviaremos un enlace seguro a tu correo para que recuperes tu cuenta rápidamente.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 xl:gap-4 pt-2 xl:pt-4">
                                <StatBadge icon={FaUsers} value="50K+" label="Usuarios activos" />
                                <StatBadge icon={FaTrophy} value="2.5K+" label="Torneos mensuales" />
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            {features.map((feature, idx) => (
                                <FeatureCard key={idx} {...feature} />
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Recover Password Form */}
                    <div className="w-full max-w-md mx-auto">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-6 sm:mb-8 text-center">
                            <div className="flex justify-center mb-3 sm:mb-4">
                                <Logo />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recuperar Contraseña</h2>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Te ayudamos a recuperar tu cuenta</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block mb-6 xl:mb-8">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 xl:mb-4">
                                <FaShieldAlt className="text-xs sm:text-sm" />
                                Proceso seguro
                            </div>
                            <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
                            <p className="text-sm xl:text-base text-gray-600">Te enviaremos un enlace a tu correo</p>
                        </div>

                        {/* Back to Login Link */}
                        <Link
                            href={APP_ROUTES.PUBLIC.LOGIN}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors mb-4 sm:mb-6"
                        >
                            <FaArrowLeft className="text-xs" />
                            Volver al inicio de sesión
                        </Link>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl xl:rounded-3xl shadow-2xl shadow-green-500/10 border border-gray-200/50 p-6 sm:p-8 backdrop-blur-sm">
                            {!success ? (
                                <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                                    {/* Icon Header */}
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                            <FaEnvelope className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            ¿Olvidaste tu contraseña?
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            Ingresa tu correo y te enviaremos instrucciones para restablecerla
                                        </p>
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Correo electrónico
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="tu@email.com"
                                            className={`w-full px-4 py-3 sm:py-3.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.email
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-green-500 focus:bg-white"
                                                }`}
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs sm:text-sm text-red-600">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 px-4 rounded-lg xl:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <ImSpinner8 className="animate-spin text-base sm:text-lg" />
                                                <span className="text-sm sm:text-base">Enviando enlace...</span>
                                            </>
                                        ) : (
                                            <span className="text-sm sm:text-base">Enviar enlace de recuperación</span>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                // Success State
                                <div className="text-center space-y-5 sm:space-y-6 py-4">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center">
                                            <FaCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            ¡Correo enviado!
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                            Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            Revisa tu bandeja de entrada y la carpeta de spam
                                        </p>
                                    </div>

                                    <div className="pt-4">
                                        <Link
                                            href={APP_ROUTES.PUBLIC.LOGIN}
                                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors text-sm sm:text-base"
                                        >
                                            <FaArrowLeft className="text-xs" />
                                            Volver al inicio de sesión
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Help Text */}
                        {!success && (
                            <div className="mt-4 sm:mt-6 text-center">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ¿Necesitas ayuda?{" "}
                                    <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
                                        Contacta con soporte
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}