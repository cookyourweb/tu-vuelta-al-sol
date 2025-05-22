//src/components/layout/PrimaryHeader.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Datos de Nacimiento', href: '/birth-data' },
  { name: 'Carta Natal', href: '/natal-chart' },
  { name: 'Agenda Astrológica', href: '/agenda' },
];

const PrimaryHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl hover:text-purple-200">Tu Vuelta al Sol</span>
            </Link>
          </div>

          {/* Enlaces de navegación - Escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-purple-800 text-white'
                      : 'text-white hover:bg-purple-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Perfil y acciones - Escritorio */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium hover:text-purple-200"
                >
                  Mi Perfil
                </Link>
                <span className="text-sm font-medium">
                  Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-800 hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-800 hover:bg-purple-900"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón de menú - Móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-purple-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? 'bg-purple-800 text-white'
                  : 'text-white hover:bg-purple-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Perfil y acciones - Móvil */}
        <div className="pt-4 pb-3 border-t border-purple-800">
          {isAuthenticated ? (
            <div className="px-2 space-y-1">
              <div className="px-3 py-2 text-base font-medium text-white">
                {user?.displayName || 'Usuario'}
              </div>
              <div className="px-3 py-1 text-sm text-purple-300">
                {user?.email || ''}
              </div>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PrimaryHeader;