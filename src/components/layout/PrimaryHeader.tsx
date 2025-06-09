// src/components/layout/PrimaryHeader.tsx - VERSIÓN FINAL COMPLETA
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  LogOut, 
  ChevronDown,
  Star,
  Moon,
  Sparkles,
  Calendar,
  Menu,
  X
} from 'lucide-react';

// 🌟 Iconos zodiacales para avatares (mismos del dashboard)
const ZodiacIcons: { [key: string]: string } = {
  'Aries': '♈',
  'Tauro': '♉', 
  'Géminis': '♊',
  'Cáncer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Escorpio': '♏',
  'Sagitario': '♐',
  'Capricornio': '♑',
  'Acuario': '♒',
  'Piscis': '♓'
};

// 🧭 Enlaces de navegación principales - FLUJO COMPLETO
const navItems = [
  { 
    href: '/birth-data', 
    label: 'Datos Nacimiento',
    icon: Sparkles,  // ✨ MÁGICO - Primer paso
    description: 'Configura tu información natal'
  },
  { 
    href: '/natal-chart', 
    label: 'Carta Natal',
    icon: Star,      // ⭐ Estrella - Base astrológica
    description: 'Tu mapa astrológico personal'
  },
  { 
    href: '/progressed-chart',   
    label: 'Carta Progresada',   
    icon: Moon,      // 🌙 Luna - Evolución anual
    description: 'Tu evolución astrológica anual'
  },
  { 
    href: '/agenda',   
    label: 'Tu Agenda Personalizada',   
    icon: Calendar,  // 📅 Calendario - OBJETIVO FINAL
    description: 'Tu guía astrológica completa'
  }
];

interface PrimaryHeaderProps {
  className?: string;
}

export default function PrimaryHeader({ className = '' }: PrimaryHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 🎯 Para detectar página activa
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userZodiacSign, setUserZodiacSign] = useState<string>('Acuario');

  // 🔍 Obtener signo zodiacal del usuario (desde carta natal si existe)
  useEffect(() => {
    if (user) {
      fetchUserZodiacSign();
    }
  }, [user]);

  const fetchUserZodiacSign = async () => {
    try {
      // Intentar obtener desde carta natal existente
      const response = await fetch(`/api/charts/natal?userId=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.chart?.planets?.Sol?.sign) {
          setUserZodiacSign(data.chart.planets.Sol.sign);
        }
      }
    } catch (error) {
      console.log('Error obteniendo signo zodiacal:', error);
      // Mantener default Acuario
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  const zodiacIcon = ZodiacIcons[userZodiacSign] || '♒';

  // 🎯 Función para determinar si una ruta está activa
  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen, isMobileMenuOpen]);

  return (
    <header className={`bg-purple-900/95 backdrop-blur-sm border-b border-purple-700/50 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* 🌟 Logo - Diseño mágico mejorado */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/50 transition-all duration-300">
                <Star className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              {/* Resplandor mágico */}
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">
                Tu Vuelta al Sol
              </h1>
              <p className="text-xs text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                Agenda Astrológica Personalizada
              </p>
            </div>
          </Link>

          {/* 🧭 Navegación Principal Desktop (solo si está logado) */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 group ${
                      isActive 
                        ? 'bg-purple-700/70 text-white border border-purple-500/50 shadow-lg shadow-purple-500/25' 
                        : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
                    }`}
                    title={item.description}
                  >
                    <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                      isActive 
                        ? 'text-yellow-400 scale-110' 
                        : 'group-hover:scale-110'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Indicador de página activa */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Efecto hover mágico */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* 👤 Área de Usuario */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Menú hamburguesa móvil */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="md:hidden p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800/50 transition-colors duration-200"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Dropdown Usuario */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex items-center space-x-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg px-3 py-2 transition-all duration-300 group"
                  >
                    {/* 🌟 Avatar Zodiacal */}
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:shadow-purple-400/50 transition-all duration-300">
                      {zodiacIcon}
                    </div>
                    
                    {/* Nombre usuario */}
                    <div className="hidden sm:block text-left">
                      <p className="text-white font-medium text-sm group-hover:text-purple-100 transition-colors duration-300">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-purple-300 text-xs group-hover:text-purple-200 transition-colors duration-300">
                        {userZodiacSign}
                      </p>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-purple-300 transition-all duration-300 group-hover:text-purple-100 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 📋 Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* Header del usuario */}
                      <div className="px-4 py-3 border-b border-gray-200/50">
                        <p className="font-semibold text-gray-800">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="mr-2">{zodiacIcon}</span>
                          {userZodiacSign}
                        </p>
                      </div>
                      
                      {/* Enlaces del menú */}
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Usuario No Logado */
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-purple-200 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-800/30"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 📱 Navegación Móvil (solo si está logado) */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-purple-700/50 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-700/70 text-white border border-purple-500/50' 
                        : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className={`w-5 h-5 ${
                      isActive ? 'text-yellow-400' : ''
                    }`} />
                    <div>
                      <span className="font-medium block">{item.label}</span>
                      <span className={`text-xs ${
                        isActive ? 'text-purple-200' : 'text-purple-300'
                      }`}>{item.description}</span>
                    </div>
                    
                    {/* Indicador móvil */}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}