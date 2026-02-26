// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Patrones maliciosos a bloquear
const BLOCKED_PATTERNS = [
    /\.php$/i,
    /\.asp$/i,
    /\.aspx$/i,
    /\.jsp$/i,
    /\/wp-admin/i,
    /\/administrator/i,
    /\.env/i,
    /\/\.git/i,
    /\/phpmyadmin/i,
    /\/config\./i,
]

// User agents sospechosos
const SUSPICIOUS_USER_AGENTS = [
    'nikto',
    'sqlmap',
    'wget',
    'curl',
    'acunetix',
    'nmap',
    'masscan',
]

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
    '/',
    '/register',
    '/forgot-password',
]

// Rutas protegidas (requieren autenticación)
const PROTECTED_ROUTES_PREFIX = [
    '/home',
    '/canchas',
    '/torneos',
    '/perfil',
    '/profile',
]

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown')
}

function isPublicRoute(pathname: string): boolean {
    // Verificar si es una ruta pública exacta
    if (PUBLIC_ROUTES.includes(pathname)) {
        return true
    }

    // Verificar si está en el grupo (auth)
    if (pathname.startsWith('/register') || pathname.startsWith('/forgot-password')) {
        return true
    }

    return false
}

function isProtectedRoute(pathname: string): boolean {
    // Verificar si la ruta comienza con algún prefijo protegido (grupo feed)
    return PROTECTED_ROUTES_PREFIX.some(prefix => pathname.startsWith(prefix))
}

function isAuthenticatedRequest(request: NextRequest): boolean {
    // Verificar la cookie JWT que tu backend establece
    const ligaToken = request.cookies.get('liga_token')

    // Validar que existe y no esté vacío
    return !!(ligaToken?.value && ligaToken.value.length > 0)
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const userAgent = request.headers.get('user-agent') || ''
    const ip = getClientIP(request)

    // 1. SEGURIDAD: Bloquear patrones maliciosos
    if (BLOCKED_PATTERNS.some(pattern => pattern.test(pathname))) {
        console.log(`🚨 BLOCKED PATTERN: ${pathname} from IP: ${ip}`)
        return new NextResponse('Not Found', { status: 404 })
    }

    // 2. SEGURIDAD: Bloquear user agents sospechosos
    if (SUSPICIOUS_USER_AGENTS.some(ua => userAgent.toLowerCase().includes(ua))) {
        console.log(`🚨 BLOCKED USER AGENT: ${userAgent} from IP: ${ip}`)
        return new NextResponse('Access Denied', { status: 403 })
    }

    // 3. AUTENTICACIÓN: Proteger rutas privadas
    const isAuthenticated = isAuthenticatedRequest(request)

    // Si es una ruta protegida y no está autenticado
    if (isProtectedRoute(pathname) && !isAuthenticated) {
        console.log(`🔒 UNAUTHORIZED ACCESS: ${pathname} from IP: ${ip}`)
        const loginUrl = new URL('/', request.url)
        loginUrl.searchParams.set('redirect', pathname) // Guardar URL destino
        return NextResponse.redirect(loginUrl)
    }

    // Si está autenticado e intenta acceder a rutas de auth (login/register)
    if (isAuthenticated && isPublicRoute(pathname) && pathname !== '/') {
        console.log(`↩️ REDIRECT TO HOME: User already authenticated from IP: ${ip}`)
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // 4. Continuar con la request y agregar headers de seguridad
    const response = NextResponse.next()

    // Headers de seguridad
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // CSP (Content Security Policy) básico
    // Permite conexiones al backend
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'
    let backendOrigin = 'http://localhost:4000'
    try {
        backendOrigin = new URL(apiBaseUrl).origin
    } catch (e) {
        // Fallback si la URL es inválida
    }

    response.headers.set(
        'Content-Security-Policy',
        `default-src 'self'; connect-src 'self' ${backendOrigin}; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' ${backendOrigin} data: https: blob:; font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com;`
    )

    return response
}

// Configuración del matcher
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas excepto:
         * - api (API routes)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (favicon)
         * - Archivos públicos (png, jpg, jpeg, gif, svg, webp)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
    ],
}