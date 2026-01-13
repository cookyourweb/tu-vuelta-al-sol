// src/components/layout/PrimaryHeader.tsx
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
  Sun,
  Sparkles,
  Calendar,
  Settings,
  ShoppingCart
} from 'lucide-react';
import Logo from '@/components/icons/Logo';
import LogoSimple from '../icons/Logosimple';
import LogoSimpleGold from '../icons/LogoSimpleGold';


// Iconos zodiacales para avatares
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

// Enlaces de navegacion principales
const navItems = [
  { 
    href: '/birth-data', 
    label: 'Datos Nacimiento',
    icon: Sparkles,
    description: 'Configura tu informacion natal'
  },
  { 
    href: '/natal-chart', 
    label: 'Carta Natal',
    icon: Star,
    description: 'Tu mapa astrologico personal'
  },
  {
    href: '/solar-return',
    label: 'Retorno Solar',
    icon: Sun,
    description: 'Tu evolucion astrologica anual'
  },
  { 
    href: '/agenda',   
    label: 'Tu Agenda',   
    icon: Calendar,
    description: 'Tu guia astrologica completa'
  }
];

interface PrimaryHeaderProps {
  className?: string;
}

export default function PrimaryHeader({ className = '' }: PrimaryHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userZodiacSign, setUserZodiacSign] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserZodiacSign();
      fetchUserRole();
    }
  }, [user]);

  useEffect(() => {
    const handleBirthDataSaved = () => {
      fetchUserZodiacSign();
      fetchUserRole();
    };

    window.addEventListener('birthDataSaved', handleBirthDataSaved);

    return () => {
      window.removeEventListener('birthDataSaved', handleBirthDataSaved);
    };
  }, []);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      // Get Firebase ID token for authentication
      const token = await user.getIdToken();

      const res = await fetch(`/api/users?uid=${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUserRole(userData.role);
      }
    } catch (error) {
      console.log('Error obteniendo rol del usuario:', error);
    }
  };

  const fetchUserZodiacSign = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/birth-data?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data?.birthDate) {
          const birthDate = new Date(data.data.birthDate);
          const sign = getZodiacSign(birthDate);
          setUserZodiacSign(sign);
          return;
        }
      }
      
      const chartResponse = await fetch(`/api/charts/natal?userId=${user.uid}`);
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        if (chartData.chart?.planets?.Sol?.sign) {
          setUserZodiacSign(chartData.chart.planets.Sol.sign);
        }
      }
    } catch (error) {
      console.log('Error obteniendo signo zodiacal:', error);
    }
  };

  const getZodiacSign = (date: Date): string | null => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Tauro';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Géminis';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cáncer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitario';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricornio';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Acuario';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Piscis';
    
    return null;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesion:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  const zodiacIcon = userZodiacSign ? ZodiacIcons[userZodiacSign] : '❓';

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <header className={`no-print bg-gradient-to-r from-purple-900 to-indigo-900 backdrop-blur-sm border-b border-purple-700/50 sticky top-0 z-50 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Diseño mágico responsive */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="flex flex-col items-start space-y-0.5 hover:opacity-90 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Logo Desktop - Tamaño optimizado */}
              <div className="hidden md:block">
                <LogoSimpleGold size={48} className="group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              {/* Logo Mobile - Optimizado para mejor visibilidad */}
              <div className="md:hidden">
                <LogoSimple size={48} className="group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              {/* Texto del logo - SIEMPRE VISIBLE */}
              <div>
                <h1 className="text-base md:text-xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 whitespace-nowrap">
                  Tu Vuelta al Sol
                </h1>
                
                {/* Tagline Mobile - Visible solo en mobile */}
                <p className="text-[9px] md:hidden text-purple-200 group-hover:text-purple-100 transition-colors duration-300 whitespace-nowrap">
                  Tu Agenda Astrológica
                </p>
              </div>
            </div>
            
            {/* Badge flotante - Compacto y elegante con mejor espaciado */}
            <div className="hidden md:flex items-center ml-14 mt-1">
              <span className="text-[9px] px-2 py-0.5 bg-purple-700/50 border border-purple-500/30 rounded-full text-purple-200 backdrop-blur-sm">
                Agenda Astrológica
              </span>
            </div>
          </Link>

          {/* Navegación Principal Desktop (solo si está logado) */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {/* Enlace de Administración (solo para admins) */}
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  className={`relative flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActiveRoute('/admin')
                      ? 'bg-purple-700/70 text-white border border-purple-500/50 shadow-lg shadow-purple-500/25' 
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
                  }`}
                  title="Panel de Administración"
                >
                  <Settings className={`w-4 h-4 transition-all duration-300 ${
                    isActiveRoute('/admin')
                      ? 'text-yellow-400 scale-110' 
                      : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium">Admin</span>
                  
                  {isActiveRoute('/admin') && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                  
                  {!isActiveRoute('/admin') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  )}
                </Link>
              )}
              
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
                    
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Área de Usuario */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Botón Carrito - Visible en mobile y desktop */}
                <Link
                  href="/compra/agenda"
                  className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white p-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                  title="Comprar Agenda Astrológica"
                >
                  <ShoppingCart className="w-5 h-5 md:w-4 md:h-4" />
                  <span className="hidden lg:inline ml-2">Comprar</span>
                </Link>

                {/* Dropdown Usuario */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex items-center space-x-2 md:space-x-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg px-2 md:px-3 py-2 transition-all duration-300 group"
                  >
                    {/* Avatar Zodiacal */}
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:shadow-purple-400/50 transition-all duration-300">
                      {zodiacIcon}
                    </div>
                    
                    {/* Nombre usuario - Solo desktop */}
                    <div className="hidden md:block text-left">
                      <p className="text-white font-medium text-sm group-hover:text-purple-100 transition-colors duration-300">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-purple-300 text-xs group-hover:text-purple-200 transition-colors duration-300">
                        {userZodiacSign || 'Sin signo zodiacal'}
                      </p>
                    </div>
                    
                    <ChevronDown className={`hidden md:block w-4 h-4 text-purple-300 transition-all duration-300 group-hover:text-purple-100 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
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
                      {userRole === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Administración</span>
                        </Link>
                      )}
                      
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
                  href="/login"
                  className="text-purple-200 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-800/30"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}