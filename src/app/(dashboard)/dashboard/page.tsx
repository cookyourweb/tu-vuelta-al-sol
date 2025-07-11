// src/app/(dashboard)/dashboard/page.tsx - CORREGIDO
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { 
  User, 
  Calendar, 
  Star, 
  MapPin, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  Moon,
  Sun,
  Zap,
  Heart,
  Gift,
  TrendingUp,
  CheckCircle,
  Eye,
  Download,
  X
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  
  // ✅ NUEVO: Estados para manejar mensajes de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [birthData, setBirthData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: null,
    longitude: null,
    timezone: ''
  });
  const [loadingBirthData, setLoadingBirthData] = useState(true);
  const [hasNatalChart, setHasNatalChart] = useState(false);

  // ✅ NUEVO: Detectar parámetros de URL para mostrar mensajes de éxito
  useEffect(() => {
    const datosGuardados = searchParams.get('datos');
    const cartaGenerada = searchParams.get('carta');
    const pasoCompletado = searchParams.get('paso');

    if (datosGuardados === 'guardados') {
      setSuccessMessage('✨ ¡Datos de nacimiento guardados exitosamente! Ya puedes generar tu carta natal.');
      setShowSuccessMessage(true);
      
      // Auto-ocultar después de 8 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);
    }

    if (cartaGenerada === 'generada') {
      setSuccessMessage('🌟 ¡Carta natal generada exitosamente! Tu mapa cósmico está listo.');
      setShowSuccessMessage(true);
      
      // Auto-ocultar después de 8 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);
    }

    // Limpiar parámetros de URL después de procesar
    if (datosGuardados || cartaGenerada) {
      const url = new URL(window.location.href);
      url.searchParams.delete('datos');
      url.searchParams.delete('carta');
      url.searchParams.delete('paso');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  
  // Cargar datos de nacimiento del usuario
  useEffect(() => {
    if (user) {
      const fetchBirthData = async () => {
        try {
          setLoadingBirthData(true);
          const res = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (res.ok) {
            const data = await res.json();
            
            if (data && data.data) {
              const birthDate = new Date(data.data.birthDate);
              const formattedDate = birthDate.toLocaleDateString('es-ES');
              
              setBirthData({
                birthDate: formattedDate,
                birthTime: data.data.birthTime || '',
                birthPlace: data.data.birthPlace || '',
                latitude: data.data.latitude,
                longitude: data.data.longitude,
                timezone: data.data.timezone || ''
              });
              
              checkNatalChart(user.uid);
            }
          } else {
            console.log('No se encontraron datos de nacimiento');
          }
        } catch (error) {
          console.error('Error fetching birth data:', error);
        } finally {
          setLoadingBirthData(false);
        }
      };
      
      fetchBirthData();
    } else {
      setLoadingBirthData(false);
    }
  }, [user]);
  
  // Verificar si el usuario tiene una carta natal
  const checkNatalChart = async (userId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/charts/natal?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHasNatalChart(!!data.natalChart);
      } else {
        setHasNatalChart(false);
      }
    } catch (error) {
      console.error('Error checking natal chart:', error);
      setHasNatalChart(false);
    }
  };

  if (isLoading || loadingBirthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Preparando tu universo personal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ✅ NUEVO: Mensaje de éxito flotante */}
        {showSuccessMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-lg border border-green-400/30 rounded-2xl px-8 py-4 shadow-2xl max-w-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-100 mr-3 animate-pulse" />
                  <p className="text-green-100 font-medium">{successMessage}</p>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-200 hover:text-white transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header principal con mensaje personalizado */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Bienvenido a tu 
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"> universo personal</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {user?.displayName ? `✨ Hola ${user.displayName}, ` : '✨ Hola, explorador cósmico, '}
              aquí encontrarás todo lo que necesitas para descubrir tu mapa astrológico y conectar con la energía transformadora del cosmos.
            </p>
            
            {/* Estadísticas de progreso */}
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-300">Conectado</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300">En crecimiento</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Heart className="w-4 h-4 text-pink-400 mr-2" />
                <span className="text-pink-300">Alineado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información personal - Tarjeta principal mejorada */}
        {birthData.birthDate ? (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-5 h-5 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-12 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
            
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-4 backdrop-blur-sm mr-6">
                <User className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  Tu Perfil Cósmico 
                  <Sparkles className="w-6 h-6 ml-3 text-yellow-400 animate-pulse" />
                </h2>
                <p className="text-gray-300">Información personal verificada y configurada</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-300 font-semibold">Nombre</span>
                </div>
                <p className="text-white text-lg">{user?.displayName || 'No configurado'}</p>
                <p className="text-gray-400 text-sm mt-1">Explorador del cosmos</p>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-purple-300 font-semibold">Nacimiento</span>
                </div>
                <p className="text-white text-lg">{birthData.birthDate}</p>
                {birthData.birthTime && (
                  <p className="text-gray-400 text-sm mt-1">⏰ {birthData.birthTime}</p>
                )}
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-yellow-300 font-semibold">Lugar</span>
                </div>
                <p className="text-white text-lg">{birthData.birthPlace}</p>
                <p className="text-gray-400 text-sm mt-1">🌍 Tu punto de origen</p>
              </div>
            </div>
            
            {/* Progreso completado */}
            <div className="mt-8 bg-green-500/10 border border-green-400/30 rounded-2xl p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-300 font-semibold">✨ Perfil cósmico completado</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-800/50 border border-amber-400/50 rounded-3xl p-8 md:p-12 mb-12 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-6 right-6 w-5 h-5 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-300"></div>
            
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-full p-4 backdrop-blur-sm mr-6 flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-amber-300 mb-4 flex items-center">
                  🚀 ¡Tu viaje cósmico está a punto de comenzar!
                </h3>
                <p className="text-amber-200 text-lg mb-6 leading-relaxed">
                  Para desbloquear todo el poder de tu carta natal y agenda astrológica personalizada, 
                  necesitamos conocer los detalles sagrados de tu llegada a este mundo.
                </p>
                <Link href="/birth-data">
                  <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-2xl text-lg font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center group">
                    <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                    Configurar mis datos de nacimiento
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Grid de funcionalidades principales mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Datos de Nacimiento */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/10 rounded-full"></div>
            
            <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Datos de Nacimiento</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {birthData.birthDate 
                ? '✨ Actualiza o revisa tus datos de nacimiento para obtener lecturas más precisas.'
                : '🌟 El primer paso para desbloquear tu mapa estelar personal.'}
            </p>
            
            <div className="mb-6">
              {birthData.birthDate ? (
                <div className="flex items-center text-green-300 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Configurado correctamente
                </div>
              ) : (
                <div className="flex items-center text-amber-300 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Pendiente de configurar
                </div>
              )}
            </div>
            
            <Link href="/birth-data">
              <button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-4 rounded-2xl font-bold hover:from-purple-300 hover:to-pink-400 transition-all duration-300 shadow-xl flex items-center justify-center group">
                {birthData.birthDate ? 'Actualizar datos' : 'Configurar datos'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          {/* Carta Natal */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-400/10 rounded-full"></div>
            
            <div className="bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
              <Moon className="w-8 h-8 text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Carta Natal</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {hasNatalChart 
                ? '🌙 Explora tu mapa astrológico completo con interpretaciones detalladas.'
                : birthData.birthDate 
                  ? '⭐ Genera tu carta natal personalizada basada en tu momento de nacimiento.'
                  : '🔮 Configura primero tus datos de nacimiento para acceder.'}
            </p>
            
            <div className="mb-6">
              {hasNatalChart ? (
                <div className="flex items-center text-green-300 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Carta natal disponible
                </div>
              ) : birthData.birthDate ? (
                <div className="flex items-center text-blue-300 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Listo para generar
                </div>
              ) : (
                <div className="flex items-center text-gray-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Requiere datos de nacimiento
                </div>
              )}
            </div>
            
            {birthData.birthDate ? (
              <Link href="/natal-chart">
                <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl flex items-center justify-center group ${
                  hasNatalChart 
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-300 hover:to-cyan-400' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 hover:from-gray-500 hover:to-gray-600'
                }`}>
                  {hasNatalChart ? (
                    <>
                      <Eye className="w-5 h-5 mr-2" />
                      Ver carta natal
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generar carta natal
                    </>
                  )}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-600 text-gray-400 py-4 rounded-2xl font-bold cursor-not-allowed opacity-50">
                Carta natal no disponible
              </button>
            )}
          </div>
          
          {/* Agenda Astrológica */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400/10 rounded-full"></div>
            
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
              <Sun className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Agenda Astrológica</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {hasNatalChart 
                ? '☀️ Descubre eventos cósmicos importantes y momentos de poder personal.'
                : '🌟 Primero necesitas generar tu carta natal para acceder al calendario.'}
            </p>
            
            <div className="mb-6">
              {hasNatalChart ? (
                <div className="flex items-center text-green-300 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Agenda personalizada lista
                </div>
              ) : (
                <div className="flex items-center text-gray-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Requiere carta natal
                </div>
              )}
            </div>
            
            {hasNatalChart ? (
              <Link href="/agenda">
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-2xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-xl flex items-center justify-center group">
                  <Calendar className="w-5 h-5 mr-2" />
                  Ver Agenda Astrológica
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-600 text-gray-400 py-4 rounded-2xl font-bold cursor-not-allowed opacity-50">
                Agenda no disponible
              </button>
            )}
          </div>
        </div>
        
        {/* Próximos eventos astrológicos mejorado */}
        {hasNatalChart && (
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
            
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-4 backdrop-blur-sm mr-6">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  Próximos Eventos Cósmicos 
                  <Gift className="w-6 h-6 ml-3 text-pink-400 animate-bounce" />
                </h2>
                <p className="text-gray-300">Momentos importantes según tu carta natal</p>
              </div>
            </div>
            
            <div className="text-center py-16">
              <div className="mb-6">
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">🔮 Preparando tu calendario mágico</h3>
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
                Estamos alineando las energías cósmicas para crear tu calendario personalizado de eventos astrológicos. 
                Muy pronto podrás ver las fechas más importantes para tu crecimiento personal y espiritual.
              </p>
              
              {/* Vista previa de lo que vendrá */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-6">
                  <Moon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-purple-300 mb-2">Fases Lunares</h4>
                  <p className="text-gray-400 text-sm">Momentos ideales para manifestar y liberar</p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6">
                  <Star className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-blue-300 mb-2">Retrogrados</h4>
                  <p className="text-gray-400 text-sm">Períodos de reflexión y revisión</p>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6">
                  <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-yellow-300 mb-2">Tránsitos</h4>
                  <p className="text-gray-400 text-sm">Oportunidades de crecimiento personal</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mensaje motivacional final */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-400/30 rounded-3xl p-8 backdrop-blur-sm max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-pink-400 mr-3 animate-pulse" />
              <h3 className="text-2xl font-bold text-white">Tu viaje de transformación continúa</h3>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Cada día es una nueva oportunidad para alinearte con las energías cósmicas y manifestar tu mejor versión. 
              Las estrellas te guían, pero tu voluntad determina el camino.
            </p>
            
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                Conectado con el cosmos
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                En constante evolución
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}