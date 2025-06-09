
// app/(dashboard)/natal-chart/page.tsx - CARGA ARREGLADA
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
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function NatalChartPage() {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthData, setBirthData] = useState<any | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Iniciando...'); 
  const { user } = useAuth();
  const router = useRouter();

  // 🔥 USEEFFECT MEJORADO - SIN DELAYS
  useEffect(() => {
    const fetchChartData = async () => {
      // Verificar usuario inmediatamente
      if (!user) {
        setDebugInfo('❌ No hay usuario autenticado');
        setLoading(false);
        router.push('/auth/login');
        return;
      }
      
      setDebugInfo(`✅ Usuario encontrado: ${user.uid}`);
      
      try {
        setLoading(true);
        setError(null);
        setDebugInfo('📡 Obteniendo datos de nacimiento...');
        
        // Obtener datos de nacimiento
        const birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
        
        if (!birthDataResponse.ok) {
          setDebugInfo('❌ No se encontraron datos de nacimiento');
          router.push('/birth-data');
          return;
        }
        
        const birthDataResult = await birthDataResponse.json();
        setDebugInfo('✅ Datos de nacimiento obtenidos');
        
        if (!birthDataResult.data) {
          setDebugInfo('❌ Datos de nacimiento vacíos');
          router.push('/birth-data');
          return;
        }
        
        setBirthData(birthDataResult.data);
        
        // Generar carta natal
        const { birthDate, birthTime, latitude, longitude, timezone, birthPlace } = birthDataResult.data;
        const formattedDateTime = `${birthDate}T${birthTime || '12:00:00'}${timezone}`;
        
        setDebugInfo('🔮 Generando carta natal...');
        
        const response = await fetch('/api/charts/natal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            birthDate: formattedDateTime,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timezone,
            birthPlace
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          setDebugInfo(`❌ Error API: ${errorData.error}`);
          throw new Error(errorData.error || 'Error al generar la carta natal');
        }
        
        const data = await response.json();
        setDebugInfo('✅ ¡Carta natal generada exitosamente!');
        
        setChartData(data.natalChart);
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
        setDebugInfo(`❌ Error: ${errorMsg}`);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [user, router]);

  // 🎨 COMPONENTE DE CARGA MEJORADO
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden flex items-center justify-center">
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        
        {/* Estrellas animadas */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
        
        {/* Contenido central */}
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
          {/* Iconos animados */}
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 w-24 h-24 border-4 border-yellow-200/20 border-t-yellow-400 rounded-full animate-spin"></div>
            <Star className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          
          {/* Texto principal */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Generando tu carta natal...
            </h2>
            <p className="text-gray-300 text-lg">
              Conectando con la sabiduría de las estrellas
            </p>
          </div>
          
          {/* Debug info estilizado */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-400">Estado</span>
            </div>
            <p className="text-yellow-200 text-sm font-mono">{debugInfo}</p>
          </div>
          
          {/* Barra de progreso animada */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Mensaje motivacional */}
          <p className="text-purple-200 text-sm italic">
            "Las estrellas nos susurran secretos del alma..."
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error mejorada
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="bg-red-500/20 p-6 rounded-full w-fit mx-auto border border-red-500/30">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Error al generar carta natal
            </h2>
            <p className="text-gray-300 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Intentar de nuevo</span>
              </Button>
              <Button
                onClick={() => router.push('/birth-data')}
                variant="outline"
                className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar datos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      
      {/* Header mejorado */}
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <Star className="w-12 h-12 text-yellow-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Tu Carta Natal
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          El mapa cósmico del momento exacto de tu nacimiento, revelando tu personalidad, 
          talentos y el camino de tu alma.
        </p>
      </div>

      {/* Carta natal */}
      {chartData && (
        <div className="flex justify-center">
          <ChartDisplay
            houses={chartData.houses || []}
            planets={chartData.planets || []}
            elementDistribution={chartData.elementDistribution || {}}
            modalityDistribution={chartData.modalityDistribution || {}}
            keyAspects={chartData.keyAspects || []}
            ascendant={chartData.ascendant}
            midheaven={chartData.midheaven}
          />
        </div>
      )}

      {/* Información del nacimiento */}
      {birthData && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Información de Nacimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">{birthData.birthDate} {birthData.birthTime}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{birthData.birthPlace}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{birthData.timezone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Acciones adicionales */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => router.push('/birth-data')}
          variant="outline"
          className="flex items-center space-x-2 border-purple-400 text-purple-300 hover:bg-purple-400/10"
        >
          <Edit className="w-4 h-4" />
          <span>Editar datos de nacimiento</span>
        </Button>
        
        <Button
          onClick={() => window.print()}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
        >
          <Download className="w-4 h-4" />
          <span>Descargar carta</span>
        </Button>
      </div>
    </div>
  );
}