'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaChartBar, FaTrophy, FaCog, FaUsers } from 'react-icons/fa';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: FaUser,
      current: pathname === '/profile'
    },
    {
      name: 'Estadísticas',
      href: '/profile/statistics',
      icon: FaChartBar,
      current: pathname === '/profile/statistics'
    },
    {
      name: 'Logros',
      href: '/profile/achievements',
      icon: FaTrophy,
      current: pathname === '/profile/achievements'
    },
    {
      name: 'Amigos',
      href: '/profile/friends',
      icon: FaUsers,
      current: pathname === '/profile/friends' || pathname?.startsWith('/profile/friends')
    },
    {
      name: 'Configuración',
      href: '/profile/settings',
      icon: FaCog,
      current: pathname === '/profile/settings'
    },
  ];

  return (
    <div >
      <div className="">
        {/* Navegación del perfil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <nav className="flex justify-around md:justify-start md:space-x-8 px-2 md:px-6" aria-label="Tabs">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`whitespace-nowrap flex items-center justify-center md:justify-start px-3 py-4 text-sm font-medium border-b-2 transition-colors ${item.current
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <IconComponent className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Contenido principal */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}