'use client';

import { useChangeEmail } from '@/src/hooks/perfil/settings/useChangeEmail';
import { useChangePassword } from '@/src/hooks/perfil/settings/useChangePassword';
import { useState } from 'react';
import { FaCog, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

export default function Settings() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const [formData, setFormData] = useState({
        // Para cambio de contraseña
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',

        // Para cambio de email (con los nombres exactos del backend)
        password: '',
        new_email: '',
        confirm_email: '',
    });

    const {
        changePassword,
        isLoading: isLoadingPassword,
        error: passwordError,
        success: passwordSuccess,
        resetState: resetPasswordState,
    } = useChangePassword();

    const {
        changeEmail,
        isLoading: isLoadingEmail,
        error: emailError,
        success: emailSuccess,
        resetState: resetEmailState,
    } = useChangeEmail();

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            setTimeout(() => {
                setShowPasswordModal(false);
                resetPasswordState();
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }, 1500);

        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changeEmail({
                password: formData.password,
                new_email: formData.new_email,
                confirm_email: formData.confirm_email,
            });

            setTimeout(() => {
                setShowEmailModal(false);
                resetEmailState();
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    new_email: '',
                    confirm_email: ''
                }));
            }, 1500);

        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        resetPasswordState();
        setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    const handleCloseEmailModal = () => {
        setShowEmailModal(false);
        resetEmailState();
        setFormData(prev => ({
            ...prev,
            password: '',
            new_email: '',
            confirm_email: ''
        }));
    };

    return (
        <div className="">
            <div className="flex items-center space-x-3 mb-6">
                <FaCog className="w-6 h-6 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            </div>

            <div className="space-y-6">
                {/* Seguridad */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaLock className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full text-left p-3 hover:bg-white rounded-lg border border-gray-300 transition-colors flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium text-gray-900">Cambiar contraseña</p>
                                <p className="text-sm text-gray-600">Actualiza tu contraseña regularmente</p>
                            </div>
                            <FaLock className="text-gray-400" />
                        </button>

                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="w-full text-left p-3 hover:bg-white rounded-lg border border-gray-300 transition-colors flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium text-gray-900">Cambiar correo electrónico</p>
                                <p className="text-sm text-gray-600">Modifica tu email de acceso</p>
                            </div>
                            <FaEnvelope className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Cuenta */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaUser className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Cuenta</h3>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                            Cerrar sesión en todos los dispositivos
                        </button>
                        <button className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                            Eliminar cuenta
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Cambiar Contraseña */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h2>
                            <button
                                onClick={handleClosePasswordModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                                ¡Contraseña cambiada exitosamente!
                            </div>
                        )}

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClosePasswordModal}
                                    disabled={isLoadingPassword}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoadingPassword}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoadingPassword ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cambiar Email */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Cambiar Correo Electrónico</h2>
                            <button
                                onClick={handleCloseEmailModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {emailSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                                ¡Email cambiado exitosamente!
                            </div>
                        )}

                        {emailError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {emailError}
                            </div>
                        )}

                        <form onSubmit={handleChangeEmail} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nuevo correo electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.new_email}
                                    onChange={(e) => handleInputChange('new_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="nuevo@ejemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar nuevo correo
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.confirm_email}
                                    onChange={(e) => handleInputChange('confirm_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="nuevo@ejemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="••••••••"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Confirma tu contraseña para realizar este cambio
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseEmailModal}
                                    disabled={isLoadingEmail}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoadingEmail}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoadingEmail ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}