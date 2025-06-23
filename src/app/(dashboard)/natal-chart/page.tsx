// app/(dashboard)/natal-chart/page.tsx - FRONTEND COMPLETAMENTE CORREGIDO
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
  const [isVeronica, setIsVeronica] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // 🔥 USEEFFECT CORREGIDO - SIN ERRORES
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // ✅ VERIFICACIÓN SEGURA DE USUARIO
        if (!user?.uid) {
          setDebugInfo('❌ No hay usuario autenticado');
          setLoading(false);
          router.push('/auth/login');
          return;
        }
        
        setDebugInfo(`✅ Usuario encontrado: ${user.uid}`);
        setLoading(true);
        setError(null);
        
        // ✅ PASO 1: Obtener datos de nacimiento (CON MANEJO DE ERRORES)
        setDebugInfo('📡 Obteniendo datos de nacimiento...');
        
        let birthDataResponse;
        try {
          birthDataResponse = await fetch(`/api/birth-data?userId=${user.uid}`);
        } catch (fetchError) {
          console.error('Error en fetch birth-data:', fetchError);
          setDebugInfo('❌ Error de red obteniendo datos de nacimiento');
          setError('Error de conexión. Verifica tu conexión a internet.');
          return;
        }
        
        if (!birthDataResponse.ok) {
          setDebugInfo('❌ No se encontraron datos de nacimiento');
          if (birthDataResponse.status === 404) {
            router.push('/birth-data');
            return;
          } else {
            setError(`Error ${birthDataResponse.status}: No se pudieron obtener los datos de nacimiento`);
            return;
          }
        }
        
        let birthDataResult;
        try {
          birthDataResult = await birthDataResponse.json();
        } catch (parseError) {
          console.error('Error parseando birth-data:', parseError);
          setDebugInfo('❌ Error procesando respuesta de datos de nacimiento');
          setError('Error procesando los datos de nacimiento');
          return;
        }
        
        setDebugInfo('✅ Datos de nacimiento obtenidos');
        
        if (!birthDataResult?.data) {
          setDebugInfo('❌ Datos de nacimiento vacíos');
          router.push('/birth-data');
          return;
        }
        
        setBirthData(birthDataResult.data);
        
        // ✅ PASO 2: Procesar datos de nacimiento
        const { birthDate, birthTime, latitude, longitude, timezone, birthPlace } = birthDataResult.data;
        
        // Validar datos críticos
        if (!birthDate || !latitude || !longitude) {
          setDebugInfo('❌ Datos de nacimiento incompletos');
          setError('Los datos de nacimiento están incompletos. Por favor, verifica tu información.');
          return;
        }
        
        // Convertir y validar coordenadas
        let lat, lon;
        try {
          lat = parseFloat(latitude);
          lon = parseFloat(longitude);
          
          if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Coordenadas inválidas');
          }
        } catch (coordError) {
          setDebugInfo('❌ Error en coordenadas');
          setError('Las coordenadas de nacimiento son inválidas');
          return;
        }
        
        // Detectar si es Verónica para debug
        const isVeronicaData = birthDate === '1974-02-10' && 
                             Math.abs(lat - 40.4168) < 0.05 && 
                             Math.abs(lon - (-3.7038)) < 0.05;
        setIsVeronica(isVeronicaData);
        
        if (isVeronicaData) {
          setDebugInfo('🎯 ¡Datos de Verónica detectados! ASC debería ser Acuario...');
        } else {
          setDebugInfo('🔮 Generando carta natal...');
        }
        
        // ✅ PASO 3: Generar carta natal (CON MANEJO DE ERRORES COMPLETO)
        setDebugInfo('🔄 Llamando a API de carta natal...');
        
        let chartResponse;
        try {
          chartResponse = await fetch('/api/charts/natal', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.uid,
              regenerate: true // ✅ SIEMPRE REGENERAR PARA DATOS FRESCOS
            })
          });
        } catch (fetchError) {
          console.error('Error en fetch charts/natal:', fetchError);
          setDebugInfo('❌ Error de red en API de carta natal');
          setError('Error de conexión con el servicio de cartas natales');
          return;
        }
        
        setDebugInfo(`📊 Respuesta API Charts: ${chartResponse.status}`);
        
        if (!chartResponse.ok) {
          let errorMessage = `Error ${chartResponse.status}`;
          try {
            const errorData = await chartResponse.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (parseError) {
            // Si no se puede parsear el error, usar el status
            errorMessage = `Error ${chartResponse.status}: ${chartResponse.statusText}`;
          }
          
          setDebugInfo(`❌ Error API Charts: ${errorMessage}`);
          setError(errorMessage);
          return;
        }
        
        let chartResult;
        try {
          chartResult = await chartResponse.json();
        } catch (parseError) {
          console.error('Error parseando charts response:', parseError);
          setDebugInfo('❌ Error procesando respuesta de carta natal');
          setError('Error procesando la respuesta del servidor');
          return;
        }
        
        console.log('📊 Respuesta completa de API Charts:', chartResult);
        
        // ✅ PASO 4: Validar y procesar respuesta
        if (!chartResult.success) {
          const errorMsg = chartResult.error || chartResult.message || 'Error desconocido en la generación';
          setDebugInfo(`❌ API devolvió error: ${errorMsg}`);
          setError(errorMsg);
          return;
        }
        
        if (!chartResult.natalChart) {
          setDebugInfo('❌ API no devolvió datos de carta natal');
          setError('La API no devolvió datos de carta natal válidos');
          return;
        }
        
        // ✅ ÉXITO: Procesar carta natal
        setDebugInfo('✅ ¡Carta natal generada exitosamente!');
        
        // Debug específico para Verónica
        if (isVeronicaData) {
          console.log('🎯 === VERIFICACIÓN VERÓNICA ===');
          console.log('🔺 Ascendente:', chartResult.natalChart.ascendant);
          console.log('☉ Sol:', chartResult.natalChart.planets?.find((p: any) => p.name === 'Sol'));
          
          const ascSign = chartResult.natalChart.ascendant?.sign;
          if (ascSign === 'Acuario') {
            setDebugInfo('🎉 ¡ÉXITO! Verónica tiene ASC Acuario - Problema resuelto!');
          } else {
            setDebugInfo(`⚠️ Verónica ASC: ${ascSign} - Esperaba Acuario`);
          }
        }
        
        setChartData(chartResult.natalChart);
        setError(null); // Limpiar cualquier error previo
        
      } catch (globalError) {
        // ✅ CAPTURA GLOBAL DE ERRORES
        console.error('❌ Error global en fetchChartData:', globalError);
        const errorMessage = globalError instanceof Error ? globalError.message : 'Error inesperado';
        setDebugInfo(`❌ Error global: ${errorMessage}`);
        setError(`Error inesperado: ${errorMessage}`);
      } finally {
        // ✅ SIEMPRE PARAR EL LOADING
        setLoading(false);
      }
    };
    
    // Solo ejecutar si hay usuario
    if (user) {
      fetchChartData();
    } else {
      setLoading(false);
    }
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
              {isVeronica ? '🎯 Generando carta de Verónica...' : 'Generando tu carta natal...'}
            </h2>
            <p className="text-gray-300 text-lg">
              {isVeronica ? 'Verificando ASC Acuario...' : 'Conectando con la sabiduría de las estrellas'}
            </p>
          </div>
          
          {/* Debug info estilizado */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-400">Estado</span>
            </div>
            <p className="text-yellow-200 text-sm font-mono break-words">{debugInfo}</p>
            
            {/* Info adicional para Verónica */}
            {isVeronica && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-green-200 text-xs">
                  🎯 Datos Verónica detectados<br/>
                  📅 Esperado: ASC Acuario
                </p>
              </div>
            )}
          </div>
          
          {/* Barra de progreso animada */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Mensaje motivacional */}
          <p className="text-purple-200 text-sm italic">
            {isVeronica ? '"Corrigiendo el cosmos para Acuario..."' : '"Las estrellas nos susurran secretos del alma..."'}
          </p>
        </div>
      </div>
    );
  }

  // 🚨 PANTALLA DE ERROR MEJORADA
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
            
            {/* Debug adicional para desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-black/20 p-4 rounded-lg text-left">
                <p className="text-yellow-400 text-sm font-mono break-words">Debug: {debugInfo}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Verifica que las APIs estén funcionando correctamente
                </p>
              </div>
            )}
            
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

  // ✅ PANTALLA PRINCIPAL - CARTA NATAL GENERADA
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No hay datos de carta natal disponibles</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Recargar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      
      {/* Header mejorado con info de corrección */}
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-6 backdrop-blur-sm relative">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <Star className="w-12 h-12 text-yellow-400" />
            
            {/* Badge de corrección para Verónica */}
            {isVeronica && chartData?.ascendant?.sign === 'Acuario' && (
              <div className="absolute -bottom-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                ✅ Corregido
              </div>
            )}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Tu Carta Natal
          {isVeronica && <span className="text-lg text-green-400 block mt-2">🎯 Verónica - Datos Corregidos</span>}
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          El mapa cósmico del momento exacto de tu nacimiento, revelando tu personalidad, 
          talentos y el camino de tu alma.
        </p>
        
        {/* Info de corrección específica para Verónica */}
        {isVeronica && chartData && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Verificación Completa</span>
            </div>
            <p className="text-green-200 text-sm">
              Datos procesados correctamente. 
              ASC: <strong>{chartData.ascendant?.sign || 'Calculando...'}</strong>
              {chartData.ascendant?.sign === 'Acuario' ? ' ✅' : ' ⚠️'}
            </p>
          </div>
        )}
      </div>

      {/* Información de nacimiento */}
      {birthData && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Información de Nacimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">{birthData.birthDate} {birthData.birthTime}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{birthData.birthPlace}</span>
            </div>
          </div>
        </div>
      )}

      {/* Carta natal */}
      {chartData && (
        <div className="flex justify-center">
          <ChartDisplay
            houses={chartData.houses || []}
            planets={chartData.planets || []}
            elementDistribution={chartData.elementDistribution || {}}
            modalityDistribution={chartData.modalityDistribution || {}}
            keyAspects={chartData.aspects || chartData.keyAspects || []}
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
              <span className="text-gray-300">
                {birthData.timezone}
                {isVeronica && <span className="text-green-400 ml-1">✅</span>}
              </span>
            </div>
          </div>
          
          {/* Debug info adicional en desarrollo */}
          {process.env.NODE_ENV === 'development' && isVeronica && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-yellow-300 break-words">
                🔧 Debug: {debugInfo}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-center space-x-4 flex-wrap gap-2">
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
      
      {/* Debug final para desarrollo */}
      {process.env.NODE_ENV === 'development' && chartData && (
        <div className="bg-gray-900/50 rounded-xl p-4 text-xs">
          <details>
            <summary className="cursor-pointer text-gray-400 hover:text-white">
              🔍 Ver datos de carta completos
            </summary>
            <pre className="mt-2 text-gray-300 overflow-auto text-xs">
              {JSON.stringify(chartData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}