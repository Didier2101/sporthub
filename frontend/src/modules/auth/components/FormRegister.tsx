'use client';

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import {
    User,
    Mail,
    Lock,
    Calendar,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useRegister } from "@/auth/hooks/useRegister";
import { RegisterFormData, registerSchema } from "@/auth/schemas/schema_register";
import { Logo } from "@shared/components/brand/Logo";
import { APP_ROUTES } from "@shared/constants/app-routes";
import { cn } from "@/shared/utils/cn";

export default function FormRegister() {
    const { isLoading, register: registerUser } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: RegisterFormData) => {
        const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const payload = {
            name_user: data.name_user,
            email: data.email,
            password: data.password,
            fechanacimiento: formatDate(data.fechanacimiento),
        };

        await registerUser(payload);
    };

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Right Panel - Register Form */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 bg-white order-2 lg:order-1">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Logo />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Únete a SportHub</h2>
                        <p className="text-slate-500 font-medium tracking-tight">Crea tu comunidad deportiva hoy</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="card-label">Nombre completo</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        className={cn("input-field pl-12", errors.name_user && "border-red-500")}
                                        {...register("name_user")}
                                    />
                                </div>
                                {errors.name_user && <p className="text-xs font-bold text-red-500 ml-1">{errors.name_user.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="card-label">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        className={cn("input-field pl-12", errors.email && "border-red-500")}
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="card-label">Fecha de nacimiento</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={20} />
                                    <Controller
                                        name="fechanacimiento"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="dd/MM/yyyy"
                                                maxDate={maxDate}
                                                minDate={minDate}
                                                locale={es}
                                                placeholderText="15/05/2000"
                                                className={cn("input-field pl-12 w-full", errors.fechanacimiento && "border-red-500")}
                                                wrapperClassName="w-full"
                                            />
                                        )}
                                    />
                                </div>
                                {errors.fechanacimiento && <p className="text-xs font-bold text-red-500 ml-1">{errors.fechanacimiento.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="card-label">Contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={cn("input-field pl-12 pr-12", errors.password && "border-red-500")}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-start gap-2 py-2">
                            <ShieldCheck className="text-primary-600 shrink-0 mt-0.5" size={16} />
                            <p className="text-[11px] text-slate-500 leading-tight">
                                Al registrarte, confirmas que eres mayor de 18 años y aceptas nuestras Políticas de Privacidad.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full group overflow-hidden"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? "Creando cuenta..." : "Comenzar gratis"}
                                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link href={APP_ROUTES.PUBLIC.LOGIN} className="text-primary-600 font-black hover:text-primary-700 underline underline-offset-4 decoration-primary-200">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>

            {/* Left Panel - Branding & Features - Desktop Only */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-900 text-white relative overflow-hidden order-1 lg:order-2">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />

                <div className="relative z-10 space-y-12 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-bold">
                            <CheckCircle2 size={14} />
                            Membresía Free
                        </div>
                        <h2 className="text-5xl font-black leading-tight">
                            Entrena <br />
                            Compite <br />
                            Conecta
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { t: "Canchas en tiempo real", d: "Encuentra y reserva en segundos" },
                            { t: "Torneos exclusivos", d: "Demuestra tu nivel y gana premios" },
                            { t: "Comunidad activa", d: "Encuentra equipo para cualquier deporte" }
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="flex items-start gap-4"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5" />
                                <div>
                                    <h4 className="font-bold text-lg">{item.t}</h4>
                                    <p className="text-slate-400 text-sm">{item.d}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}