// src/app/(dashboard)/dashboard/page.tsx - PARTE 1/3
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
  X,
  CalendarDays
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  
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
  const [hasSolarReturn, setHasSolarReturn] = useState(false);

  useEffect(() => {
    const datosGuardados = searchParams.get('datos');
    const cartaGenerada = searchParams.get('carta');

    if (datosGuardados === 'guardados') {
      setSuccessMessage('✨ ¡Datos de nacimiento guardados exitosamente! Ya puedes generar tu carta natal.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 8000);
    }

    if (cartaGenerada === 'generada') {
      setSuccessMessage('🌟 ¡Carta natal generada exitosamente! Tu mapa cósmico está listo.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 8000);
    }

    if (datosGuardados || cartaGenerada) {
      const url = new URL(window.location.href);
      url.searchParams.delete('datos');
      url.searchParams.delete('carta');
      url.searchParams.delete('paso');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const checkNatalChart = async (userId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/charts/natal?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const hasNatal = !!data.natalChart;
        setHasNatalChart(hasNatal);
        
        if (hasNatal) {
          await checkSolarReturn(userId);
        }
      } else {
        setHasNatalChart(false);
      }
    } catch (error) {
      console.error('Error checking natal chart:', error);
      setHasNatalChart(false);
    }
  };

  const checkSolarReturn = async (userId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/charts/solar-return?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHasSolarReturn(!!data.data || !!data.progressedChart || !!data.solarReturnChart);
      } else {
        setHasSolarReturn(false);
      }
    } catch (error) {
      console.error('Error checking solar return:', error);
      setHasSolarReturn(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      const fetchBirthData = async () => {
        try {
          setLoadingBirthData(true);
          const res = await fetch(`/api/birth-data?userId=${user.uid}`);
          
          if (res.ok) {
            const data = await res.json();
            
            if (data && data.data) {
              const birthDate = new Date(data.data.birthDate || data.data.date);
              const formattedDate = birthDate.toLocaleDateString('es-ES');
              
              setBirthData({
                birthDate: formattedDate,
                birthTime: data.data.time || data.data.birthTime || '',
                birthPlace: data.data.location || data.data.birthPlace || '',
                latitude: data.data.latitude,
                longitude: data.data.longitude,
                timezone: data.data.timezone || ''
              });
              
              await checkNatalChart(user.uid);
            }
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
  }, [user]);if (isLoading || loadingBirthData) {
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
        
        {/* 🌟 NUEVA SECCIÓN DE BIENVENIDA */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Bienvenido/a a
          </h1>
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Tu Vuelta al Sol
          </h2>
          <p className="text-2xl md:text-3xl text-purple-300 font-semibold mb-12">
            Tu agenda astrológica personalizada
          </p>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Explicación principal */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-400/20 rounded-3xl p-8 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-6 font-medium">
                Este no es un horóscopo genérico.
              </p>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-4">
                Es una experiencia creada a partir de tu carta natal y tu retorno solar,
                diseñada para acompañarte durante todo el año.
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Aquí no vienes a predecir el futuro.<br/>
                <span className="text-purple-300 font-semibold">Vienes a entenderte mejor y tomar decisiones con más conciencia.</span>
              </p>
            </div>

            {/* ¿Qué vas a encontrar? */}
            <div className="text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ ¿Qué vas a encontrar aquí?
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Carta Natal */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-400/20 rounded-full p-4">
                      <Moon className="w-10 h-10 text-blue-400" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 text-center">🌌 Tu Carta Natal</h4>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Descubre tu mapa astrológico personal y comprende cómo funcionas, qué te mueve y cuáles son tus patrones esenciales.
                  </p>
                </div>

                {/* Retorno Solar */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="bg-yellow-400/20 rounded-full p-4">
                      <Sun className="w-10 h-10 text-yellow-400" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 text-center">🔄 Tu Retorno Solar Anual</h4>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Una lectura clara de las energías que se activan este año en tu vida:
                    retos, oportunidades, ritmos y momentos clave.
                  </p>
                </div>

                {/* Agenda */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-400/20 rounded-full p-4">
                      <CalendarDays className="w-10 h-10 text-purple-400" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 text-center">📔 Tu Agenda Personalizada</h4>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Una agenda creada solo para ti, donde el tiempo deja de ser una exigencia y se convierte en una herramienta de alineación personal.
                    Fechas clave, ciclos astrológicos y espacios de reflexión integrados en tu día a día.
                  </p>
                </div>
              </div>
            </div>

            {/* ¿Para quién es? */}
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-400/20 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-pink-300">
                🌱 ¿Para quién es?
              </h3>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-center font-medium">
                Para personas que sienten que este año no va de correr más,<br/>
                <span className="text-purple-300">sino de vivir con más sentido.</span>
              </p>
            </div>

            {/* CTA Principal */}
            {birthData.birthDate && hasNatalChart && hasSolarReturn && (
              <div className="pt-6">
                <Link href="/agenda">
                  <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 text-white px-10 py-5 rounded-full text-xl md:text-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center mx-auto group">
                    <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                    👉 Empieza tu Vuelta al Sol
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <p className="text-gray-400 text-center mt-4 text-sm">
                  y transforma este año en un proceso consciente, real y profundamente tuyo.
                </p>
              </div>
            )}
          </div>
        </div>

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
        )}<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
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
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500'
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
          
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 relative group hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400/10 rounded-full"></div>
            
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm mb-6 w-fit group-hover:scale-110 transition-transform">
              <Sun className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Retorno Solar</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {hasSolarReturn 
                ? '☀️ Explora tu carta de Retorno Solar y descubre las energías del año.'
                : hasNatalChart 
                  ? '🌟 Genera tu Retorno Solar para conocer las tendencias de tu año astrológico.'
                  : '🔮 Primero necesitas generar tu carta natal para acceder.'}
            </p>
            
            <div className="mb-6">
              {hasSolarReturn ? (
                <div className="flex items-center text-green-300 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Retorno Solar disponible
                </div>
              ) : hasNatalChart ? (
                <div className="flex items-center text-yellow-300 text-sm">
                  <Sun className="w-4 h-4 mr-2" />
                  Listo para generar
                </div>
              ) : (
                <div className="flex items-center text-gray-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Requiere carta natal
                </div>
              )}
            </div>
            
            {hasNatalChart ? (
              <Link href="/solar-return">
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-2xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-xl flex items-center justify-center group">
                  {hasSolarReturn ? (
                    <>
                      <Eye className="w-5 h-5 mr-2" />
                      Ver Retorno Solar
                    </>
                  ) : (
                    <>
                      <Sun className="w-5 h-5 mr-2" />
                      Generar Retorno Solar
                    </>
                  )}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-600 text-gray-400 py-4 rounded-2xl font-bold cursor-not-allowed opacity-50">
                Retorno Solar no disponible
              </button>
            )}
          </div>
        </div>
        

        
        {hasNatalChart && !hasSolarReturn && (
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
                Genera tu Retorno Solar para desbloquear tu agenda astrológica personalizada con eventos cósmicos, 
                fases lunares y los momentos más importantes para tu crecimiento personal.
              </p>
              
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

            {hasSolarReturn ? (
              <div className="mt-8 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-2 border-yellow-400/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <CalendarDays className="w-8 h-8 text-yellow-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">
                      🔥 Tu Agenda Astrológica Personalizada
                    </h4>
                  </div>

                  <p className="text-xl text-yellow-100 font-semibold leading-relaxed mb-4">
                    ¿Y si supieras EXACTAMENTE cuándo es el mejor momento para...
                  </p>

               <div className="grid md:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-6">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30">
                      <div className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-white text-sm font-medium">Iniciar ese proyecto que llevas meses postergando</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-pink-400/30">
                      <div className="flex items-start">
                        <Heart className="w-4 h-4 text-pink-400 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-white text-sm font-medium">Tener esa conversación difícil que cambiará tu relación</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
                      <div className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-white text-sm font-medium">Pedir ese aumento o hacer esa inversión importante</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
                      <div className="flex items-start">
                        <Star className="w-4 h-4 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-white text-sm font-medium">Soltar lo que ya no te sirve y abrirte a lo nuevo</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-pink-400/30 max-w-2xl mx-auto mb-6">
                    <p className="text-base text-pink-100 leading-relaxed">
                      <strong className="text-yellow-300">La diferencia entre las personas que logran sus sueños y las que se quedan estancadas</strong> no es el talento ni la suerte.
                    </p>
                    <p className="text-base text-pink-100 leading-relaxed mt-2">
                      Es <strong className="text-white">TIMING</strong>. Y el universo ya te dio el manual de instrucciones.
                    </p>
                  </div>

                  <p className="text-lg text-white font-bold mb-6">
                    Tu Agenda te dice CUÁNDO actuar para que el cosmos trabaje a tu favor.
                  </p>

                  <Link href="/agenda">
                    <button className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center mx-auto group">
                      <CalendarDays className="w-5 h-5 mr-2" />
                      🔥 ABRIR MI AGENDA AHORA
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  <p className="text-xs text-yellow-200 mt-4">
                    ✨ Ya tienes todo listo. Solo falta dar el paso.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed mt-6">
                Por eso hemos preparado tu Agenda Astrológica Personalizada, donde podrás descubrir los momentos más propicios para tomar decisiones importantes, iniciar proyectos y conectar con tu propósito de vida.
              </p>
            )}
            
            <div className="flex justify-center items-center space-x-4 text-sm mt-6">
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
