//src/components/layout/PrimaryHeader.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Star, 
  Calendar, 
  User, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Star },
  { name: 'Datos de Nacimiento', href: '/birth-data', icon: MapPin },
  { name: 'Carta Natal', href: '/natal-chart', icon: Moon },
  { name: 'Agenda Astrológica', href: '/agenda', icon: Sun },
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
    <header className="text-white relative backdrop-blur-sm border-b border-white/10">
      {/* Estrellas decorativas locales */}
      <div className="absolute top-2 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-4 right-32 w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-2 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500"></div>
      
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo y nombre */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-3 backdrop-blur-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="font-black text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300">
                  Tu Vuelta al Sol
                </span>
              </Link>
            </div>

            {/* Enlaces de navegación - Escritorio */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-white shadow-xl'
                          : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 mr-2 ${
                        isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Perfil y acciones - Escritorio */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Saludo personalizado */}
                  <div className="bg-gradient-to-r from-purple-400/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl px-4 py-2">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-full p-2 mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {user?.displayName?.split(' ')[0] || 'Usuario'}
                        </p>
                        <p className="text-gray-400 text-xs">Explorador Cósmico</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón Mi Perfil */}
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 rounded-2xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                  
                  {/* Botón Cerrar sesión */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 hover:text-white hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-2xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Botón de menú - Móvil */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 inline-flex items-center justify-center p-3 rounded-2xl text-white hover:from-white/20 hover:to-white/30 transition-all duration-300"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden border-t border-white/20`}>
          <div className="bg-gradient-to-r from-black/50 to-purple-900/50 backdrop-blur-sm">
            <div className="px-4 pt-4 pb-3 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Perfil y acciones - Móvil */}
            <div className="pt-4 pb-3 border-t border-white/20">
              {isAuthenticated ? (
                <div className="px-4 space-y-3">
                  {/* Info del usuario */}
                  <div className="bg-gradient-to-r from-purple-400/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-full p-3 mr-4">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {user?.displayName || 'Usuario'}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                    Mi Perfil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 hover:text-white hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PrimaryHeader;