/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/cancha/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/user/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/posts/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/player/**', // ✅ Para imágenes de perfil
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: '/:path*.php',
                destination: '/404',
            },
        ];
    },

    poweredByHeader: false,
};

module.exports = nextConfig;