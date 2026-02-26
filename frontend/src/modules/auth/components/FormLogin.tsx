'use client';

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    ArrowRight,
    Mail,
    Lock,
    Bolt,
    Users,
    Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { useLogin } from "@auth/hooks/useLogin";
import { useAuthStore } from "@shared/store/useAuthStore";
import { APP_ROUTES } from "@shared/constants";
import { LoginFormData, loginSchema } from "@auth/schemas/loginSchema";
import { cn } from "@shared/utils/cn";
import { ui } from "@shared/utils/ui";
import { Logo } from "@shared/components/brand/Logo";

function LoginFormContent() {
    const { isLoading, login } = useLogin();
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await login(data);
            if (result.success && result.user) {
                setAuthData({
                    name_user: result.user.name_user,
                    email: result.user.email,
                    fotoPerfil: result.user.fotoPerfil || null,
                });
                ui.success('¡Bienvenido!', 'Has iniciado sesión correctamente.');
            }
        } catch (error) {
            // Error handled by axial interceptor toast
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Background Background - Desktop Only */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <Logo className="text-white brightness-0 invert" />
                </motion.div>

                <div className="space-y-6 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-black leading-tight"
                    >
                        Donde el deporte <br />
                        <span className="text-primary-300 underline decoration-primary-400 underline-offset-8">conecta personas</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-primary-100 max-w-lg"
                    >
                        Únete a la comunidad más activa de deportistas. Encuentra equipos,
                        reserva canchas y mejora tu juego.
                    </motion.p>

                    <div className="flex gap-8 pt-6">
                        <div className="space-y-1">
                            <p className="text-3xl font-black">50K+</p>
                            <p className="text-sm text-primary-200">Deportistas</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black">2.5K</p>
                            <p className="text-sm text-primary-200">Torneos</p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-primary-200 flex justify-between relative z-10">
                    <span>© 2026 Sporthub</span>
                    <div className="flex gap-4">
                        <Link href="/help" className="hover:text-white transition-colors">Ayuda</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                    </div>
                </div>
            </div>

            {/* Login Section */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Logo />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Iniciar sesión</h2>
                        <p className="text-slate-500 font-medium tracking-tight">Accede a tu cuenta de Sporthub</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="card-label">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        className={cn("input-field pl-12", errors.email && "border-red-500 focus:ring-red-200")}
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="card-label">Contraseña</label>
                                    <Link href="/forgot" className="text-xs font-bold text-primary-600 hover:text-primary-700">¿La olvidaste?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={cn("input-field pl-12 pr-12", errors.password && "border-red-500 focus:ring-red-200")}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? "Entrando..." : "Continuar"}
                                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <div className="text-center space-y-4 pt-4">
                        <p className="text-sm font-medium text-slate-500">
                            ¿Eres nuevo aquí?{" "}
                            <Link href={APP_ROUTES.PUBLIC.REGISTER} className="text-primary-600 font-black hover:text-primary-700 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-400 transition-all">
                                Crea tu cuenta gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FormLogin() {
    return <LoginFormContent />;
}