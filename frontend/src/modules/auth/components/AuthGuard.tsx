// components/auth/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@shared/components/brand/Loading';
import { useCheckSession } from '@auth/hooks/useCheckSession';
import { APP_ROUTES } from '@shared/constants';

interface AuthGuardProps {
    children: React.ReactNode;
    type: 'protected' | 'public'; // 'protected' = solo autenticados, 'public' = solo no autenticados
}

export default function AuthGuard({ children, type }: AuthGuardProps) {
    const { loading, isAuthenticated } = useCheckSession();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (type === 'protected' && !isAuthenticated) {
                // Página protegida pero no autenticado → ir a login
                router.push(APP_ROUTES.PUBLIC.LOGIN);
            } else if (type === 'public' && isAuthenticated) {
                // Página pública pero autenticado → ir a home
                router.push(APP_ROUTES.PROTECTED.HOME);
            }
        }
    }, [loading, isAuthenticated, type, router]);

    if (loading) {
        return <Loading fullScreen text="Cargando sistema..." />;
    }

    // Verificar si puede ver el contenido
    const canView =
        (type === 'protected' && isAuthenticated) ||
        (type === 'public' && !isAuthenticated);

    if (!canView) {
        return <Loading fullScreen text="Redirigiendo..." />;
    }

    return <>{children}</>;
}