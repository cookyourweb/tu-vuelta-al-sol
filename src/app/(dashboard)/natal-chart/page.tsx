// app/(dashboard)/natal-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChartDisplay from '@/components/astrology/ChartDisplay';
import Button from '@/components/ui/Button';
import { 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Moon, 
  Sun, 
  ArrowLeft, 
  Edit, 
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function NatalChartPage() {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthData, setBirthData] = useState<any | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Primero, obtener los datos de nacimiento
        const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (!birthDataResponse.ok) {
          router.push('/birth-data');
          return;
        }
        
        const birthDataResult = await birthDataResponse.json();
        
        if (!birthDataResult.data) {
          router.push('/birth-data');
          return;
        }
        
        setBirthData(birthDataResult.data);
        
        // Con los datos de nacimiento, generar la carta natal
        const { birthDate, birthTime, latitude, longitude, timezone, birthPlace } = birthDataResult.data;
        
        // Formatear la fecha para la API
        const formattedDate = new Date(birthDate).toISOString().split('T')[0];
        
        // Llamar a nuestro API para obtener la carta natal
        const chartResponse = await fetch('/api/prokerala/natal-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: formattedDate,
            birthTime,
            latitude,
            longitude,
            timezone,
            birthPlace
          }),
        });
        
        const chartResult = await chartResponse.json();
        
        if (chartResponse.ok && chartResult.success) {
          setChartData(chartResult.data);
        } else {
          throw new Error(chartResult.error || 'Error al obtener la carta natal');
        }
      } catch (err: unknown) {
        console.error('Error fetching chart data:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [user, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        {/* Estrellas decorativas */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 text-center">
          <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 border border-purple-400/30 rounded-full p-8 backdrop-blur-sm mb-6">
            <Moon className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">🔮 Generando tu Mapa Estelar</h3>
          <p className="text-lg text-gray-300 mb-4">Calculando las posiciones planetarias exactas...</p>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-r from-red-900/50 to-pink-800/50 border border-red-400/50 rounded-3xl p-8 backdrop-blur-sm text-center">
            <div className="bg-gradient-to-r from-red-400/20 to-pink-500/20 border border-red-400/30 rounded-full p-6 backdrop-blur-sm w-fit mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-red-300 mb-4">⚠️ Error Cósmico</h2>
            <p className="text-red-200 text-lg mb-6 leading-relaxed">{error}</p>
            
            <button 
              onClick={() => router.push('/birth-data')} 
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-red-300 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center mx-auto"
            >
              <Edit className="w-6 h-6 mr-3" />
              Configurar Datos de Nacimiento
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-800/50 border border-amber-400/50 rounded-3xl p-8 backdrop-blur-sm text-center">
            <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-full p-6 backdrop-blur-sm w-fit mx-auto mb-6">
              <Star className="w-12 h-12 text-amber-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-amber-300 mb-4">🌟 Datos no encontrados</h2>
            <p className="text-amber-200 text-lg mb-6 leading-relaxed">
              No se ha encontrado tu carta natal. Las estrellas están esperando tus datos de nacimiento para revelar tu mapa cósmico.
            </p>
            
            <button 
              onClick={() => router.push('/birth-data')} 
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-2xl text-lg font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center mx-auto"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Ingresar Datos de Nacimiento
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent"></div>
      
      {/* Estrellas decorativas */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-64 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header principal */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-full p-8 backdrop-blur-sm relative">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <Moon className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Tu 
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Carta Natal</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
            🌙 Descubre tu mapa astrológico personal con aspectos planetarios, 
            elementos y modalidades que revelan tu esencia cósmica.
          </p>
          
          {/* Navegación */}
          <div className="flex justify-center items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="flex items-center px-6 py-3 rounded-2xl text-sm font-semibold bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </button>
            
            <button 
              onClick={() => router.push('/birth-data')} 
              className="flex items-center px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-purple-400/20 to-blue-500/20 border border-purple-400/30 text-purple-300 hover:text-white hover:from-purple-400/30 hover:to-blue-500/30 transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Actualizar Datos
            </button>
          </div>
        </div>

        {/* Datos de Nacimiento Mejorados */}
        {birthData && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-5 h-5 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-4 backdrop-blur-sm mr-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  Información de tu Nacimiento 
                  <Sparkles className="w-6 h-6 ml-3 text-yellow-400 animate-pulse" />
                </h2>
                <p className="text-gray-300">Los datos cósmicos que definen tu esencia</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-purple-300 font-semibold">Fecha</span>
                </div>
                <p className="text-white text-lg">{new Date(birthData.birthDate).toLocaleDateString('es-ES')}</p>
                <p className="text-gray-400 text-sm mt-1">Tu llegada al mundo</p>
              </div>
              
              {birthData.birthTime && (
                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-blue-300 font-semibold">Hora</span>
                  </div>
                  <p className="text-white text-lg">{birthData.birthTime}</p>
                  <p className="text-gray-400 text-sm mt-1">Momento exacto</p>
                </div>
              )}
              
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-yellow-300 font-semibold">Lugar</span>
                </div>
                <p className="text-white text-lg">{birthData.birthPlace}</p>
                <p className="text-gray-400 text-sm mt-1">Tu punto de origen</p>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-green-400/30 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Zap className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-green-300 font-semibold">Coordenadas</span>
                </div>
                <p className="text-white text-lg">{birthData.latitude.toFixed(2)}, {birthData.longitude.toFixed(2)}</p>
                <p className="text-gray-400 text-sm mt-1">Posición exacta</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Carta Natal Display */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-6 right-6 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-4 backdrop-blur-sm mr-6">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Tu Mapa Estelar Completo</h2>
                <p className="text-gray-300">Planetas, casas, aspectos y energías cósmicas</p>
              </div>
            </div>
            
            <button className="flex items-center px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 text-blue-300 hover:text-white hover:from-blue-400/30 hover:to-purple-500/30 transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </button>
          </div>
          
          <ChartDisplay 
            houses={chartData.houses || []}
            planets={chartData.planets || []}
            elementDistribution={chartData.elementDistribution || { fire: 0, earth: 0, air: 0, water: 0 }}
            modalityDistribution={chartData.modalityDistribution || { cardinal: 0, fixed: 0, mutable: 0 }}
            keyAspects={chartData.keyAspects || []}
          />
        </div>
        
        {/* Mensaje inspiracional */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-400/30 rounded-3xl p-8 backdrop-blur-sm max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            
            <div className="flex items-center justify-center mb-6">
              <Sun className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
              <h3 className="text-2xl font-bold text-white">Tu Blueprint Cósmico Personal</h3>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Esta carta natal es tu mapa personal del cosmos en el momento exacto de tu nacimiento. 
              Cada planeta, aspecto y casa revela patrones únicos de tu alma y tu propósito en esta vida. 
              Úsala como guía para comprender tus fortalezas, desafíos y el camino hacia tu mayor potencial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}