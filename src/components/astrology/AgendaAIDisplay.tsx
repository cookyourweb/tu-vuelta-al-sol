// src/components/astrology/AgendaAIDisplay.tsx
// 🌟 COMPONENTE MEJORADO COMPATIBLE CON CACHE Y NUEVAS FEATURES

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Sparkles, Zap, Heart, Target, AlertTriangle, Gift, RefreshCw } from 'lucide-react';

// 🔄 INTERFACES PARA RETROCOMPATIBILIDAD
interface LegacyAgendaData {
  titulo: string;
  subtitulo: string;
  intro_disruptiva: string;
  año_actual: number;
  año_siguiente: number;
  meses: Array<{
    mes: string;
    tema_central: string;
    energia_dominante: string;
    mantra_mensual: string;
    eventos_clave: Array<{
      fecha: string;
      evento: string;
      impacto_personal: string;
      accion_recomendada: string;
      evitar: string;
    }>;
    ritual_power: string;
    afirmacion_diaria: string;
  }>;
  fechas_power: {
    cumpleanos_solar: string;
    eclipses_personales: string;
    retrogrados_clave: string;
  };
  llamada_accion_final: string;
}

// 🆕 INTERFACES PARA NUEVA ESTRUCTURA
interface NewAgendaData {
  userProfile: any;
  events: any[];
  executiveSummary: any;
  statistics: any;
  metadata: any;
}

interface AgendaAIDisplayProps {
  userId: string;
}

export default function AgendaAIDisplay({ userId }: AgendaAIDisplayProps) {
  const { user } = useAuth();
  const [agendaData, setAgendaData] = useState<NewAgendaData | LegacyAgendaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);

  // 🔍 DETECTAR TIPO DE AGENDA
  const isNewFormat = (data: any): data is NewAgendaData => {
    return data && typeof data === 'object' && 'events' in data && 'userProfile' in data;
  };

  const isLegacyFormat = (data: any): data is LegacyAgendaData => {
    return data && typeof data === 'object' && 'meses' in data && 'titulo' in data;
  };

  // 🔄 FUNCIÓN MEJORADA PARA GENERAR AGENDA
  const generateAgenda = async (forceRegenerate = false) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔮 Generando agenda astrológica mejorada...');
      
      // 🆕 USAR NUEVO ENDPOINT SIMPLIFICADO
      const response = await fetch('/api/astrology/simple-agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          regenerate: forceRegenerate
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAgendaData(data.data.agenda);
        setFromCache(data.metadata?.fromCache || false);
        setGenerationTime(data.metadata?.generationTimeMs || 0);
        setHasGenerated(true);
        
        console.log(`✅ Agenda ${data.data.isNewFormat ? 'nueva' : 'legacy'} generada exitosamente`);
        
        // Si es formato nuevo, mostrar información adicional
        if (data.data.isNewFormat) {
          console.log('🌟 Usando estructura nueva con caché y IA mejorada');
        }
        
      } else {
        if (data.action === 'redirect_to_birth_data') {
          setError('Necesitas configurar tus datos de nacimiento primero. Ve a la sección de datos de nacimiento.');
        } else if (data.action === 'complete_user_data') {
          setError('Necesitas completar tus datos de usuario. Ve a configuración.');
        } else if (data.action === 'login_required') {
          setError('Necesitas iniciar sesión para generar tu agenda.');
        } else {
          setError(data.error || 'Error al generar la agenda');
        }
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error generando agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 AUTO-GENERAR AL CARGAR
  useEffect(() => {
    if (userId && !hasGenerated && !loading) {
      generateAgenda();
    }
  }, [userId]);

  // 🌀 LOADING STATE
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-white mb-2">✨ Generando tu Agenda Cósmica</h3>
          <p className="text-purple-200">Las estrellas están conspirando para tu éxito...</p>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-purple-300">🔍 Verificando caché...</div>
            <div className="text-sm text-purple-300">🌟 Calculando eventos astrológicos...</div>
            <div className="text-sm text-purple-300">🤖 Interpretando con IA...</div>
          </div>
        </div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-4">Error en tu Agenda Cósmica</h3>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => generateAgenda(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              🔮 Intentar Nuevamente
            </button>
            <button 
              onClick={() => generateAgenda(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔄 Forzar Regeneración
            </button>
            {error.includes('datos de nacimiento') && (
              <a 
                href="/birth-data"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📊 Configurar Datos
              </a>
            )}
            {error.includes('carta natal') && (
              <a 
                href="/natal-chart"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🌟 Generar Carta Natal
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 🌌 EMPTY STATE
  if (!agendaData) {
    return (
      <div className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-xl font-bold text-white mb-4">Tu Agenda Cósmica Está Lista</h3>
          <p className="text-gray-300 mb-6">Genera tu agenda astrológica personalizada con IA</p>
          <button 
            onClick={() => generateAgenda(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🔮 Generar Mi Agenda Épica
          </button>
        </div>
      </div>
    );
  }

  // 🆕 RENDERIZAR NUEVA ESTRUCTURA
  if (isNewFormat(agendaData)) {
    return <NewFormatDisplay agendaData={agendaData} fromCache={fromCache} generationTime={generationTime} onRegenerate={generateAgenda} />;
  }

  // 🔄 RENDERIZAR ESTRUCTURA LEGACY
  if (isLegacyFormat(agendaData)) {
    return <LegacyFormatDisplay agendaData={agendaData} onRegenerate={generateAgenda} />;
  }

  return null;
}

// 🆕 COMPONENTE PARA NUEVA ESTRUCTURA
function NewFormatDisplay({ 
  agendaData, 
  fromCache, 
  generationTime, 
  onRegenerate 
}: { 
  agendaData: NewAgendaData; 
  fromCache: boolean; 
  generationTime: number; 
  onRegenerate: (force?: boolean) => void;
}) {
  const { events = [], executiveSummary, statistics, userProfile } = agendaData;

  return (
    <div className="space-y-8">
      {/* 🎯 HEADER TRANSFORMADOR */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🌟 TU REVOLUCIÓN CÓSMICA {new Date().getFullYear()}-{new Date().getFullYear() + 1}
            </h1>
            <p className="text-purple-100 text-lg">
              ¡AGENDA TRANSFORMADORA PERSONALIZADA PARA {userProfile?.place?.toUpperCase()}!
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              {fromCache ? (
                <>
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">⚡ Desde caché en {generationTime}ms</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  <span className="text-sm">🌟 Generado en {generationTime}ms</span>
                </>
              )}
            </div>
            <button 
              onClick={() => onRegenerate(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerar
            </button>
          </div>
        </div>
        
        {/* 📊 ESTADÍSTICAS ÉPICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics?.totalEvents || 0}</div>
            <div className="text-sm text-purple-100">Eventos Totales</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics?.withAiInterpretation || 0}</div>
            <div className="text-sm text-purple-100">Interpretaciones IA</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics?.highPriorityEvents || 0}</div>
            <div className="text-sm text-purple-100">Alta Prioridad</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics?.lunarPhases || 0}</div>
            <div className="text-sm text-purple-100">Fases Lunares</div>
          </div>
        </div>
      </div>

      {/* 📋 RESUMEN EJECUTIVO */}
      {executiveSummary && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="w-6 h-6 text-purple-500 mr-2" />
            🎯 MAPA DE REVOLUCIÓN ANUAL
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* HIGHLIGHTS TRIMESTRALES */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">✨ ACTIVACIONES TRIMESTRALES</h3>
              <div className="space-y-3">
                {executiveSummary.monthlyHighlights?.map((highlight: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TEMAS ANUALES */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">🌟 TEMAS TRANSFORMADORES</h3>
              <div className="space-y-3">
                {executiveSummary.yearlyThemes?.map((theme: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium">{theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACCIONES PRIORITARIAS */}
          {executiveSummary.priorityActions && executiveSummary.priorityActions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">🚀 ACCIONES REVOLUCIONARIAS</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {executiveSummary.priorityActions.map((action: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-800 uppercase">
                        {action.category}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">{action.action}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>⏰ {action.timing}</span>
                      <span>💪 {action.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📅 EVENTOS RESUMIDOS */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 text-purple-500 mr-2" />
          📅 TUS EVENTOS TRANSFORMADORES
        </h2>
        
        <div className="grid gap-4">
          {events.slice(0, 10).map((event: any, index: number) => (
            <div key={event.id || index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <span className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{event.description}</p>
              {event.aiInterpretation && (
                <div className="mt-2 p-2 bg-white rounded border border-purple-100">
                  <p className="text-xs text-purple-700 font-medium">
                    🤖 {event.aiInterpretation.meaning?.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {events.length > 10 && (
          <div className="text-center mt-4">
            <span className="text-gray-600">Y {events.length - 10} eventos más...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔄 COMPONENTE PARA ESTRUCTURA LEGACY
function LegacyFormatDisplay({ 
  agendaData, 
  onRegenerate 
}: { 
  agendaData: LegacyAgendaData; 
  onRegenerate: (force?: boolean) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header Principal */}
      <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{agendaData.titulo}</h1>
        <p className="text-xl text-purple-200 mb-4 italic">{agendaData.subtitulo}</p>
        <p className="text-lg text-indigo-200 leading-relaxed">{agendaData.intro_disruptiva}</p>
        
        {/* Botón regenerar */}
        <div className="mt-6 space-x-4">
          <button 
            onClick={() => onRegenerate(false)}
            className="bg-purple-600/70 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            🔄 Regenerar Agenda
          </button>
          <button 
            onClick={() => onRegenerate(true)}
            className="bg-orange-600/70 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            ⚡ Versión Mejorada
          </button>
        </div>
      </div>

      {/* Fechas Power */}
      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-400/30 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-amber-300 mb-6 flex items-center">
          ⚡ Tus Fechas de Máximo Poder
        </h2>
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <h3 className="font-bold text-amber-200 mb-2">🎂 Cumpleaños Solar</h3>
            <p className="text-amber-100">{agendaData.fechas_power.cumpleanos_solar}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <h3 className="font-bold text-amber-200 mb-2">🌒 Eclipses Personales</h3>
            <p className="text-amber-100">{agendaData.fechas_power.eclipses_personales}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <h3 className="font-bold text-amber-200 mb-2">🔄 Retrógrados Clave</h3>
            <p className="text-amber-100">{agendaData.fechas_power.retrogrados_clave}</p>
          </div>
        </div>
      </div>

      {/* Meses */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          📅 Tu Viaje Mensual Cósmico
        </h2>
        
        {agendaData.meses.map((mes, index) => (
          <div key={index} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-400/30 rounded-3xl p-8">
            {/* Header del mes */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{mes.mes}</h3>
              <p className="text-xl text-indigo-200 font-semibold">{mes.tema_central}</p>
              <p className="text-indigo-300 mt-2">{mes.energia_dominante}</p>
            </div>

            {/* Mantra */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 mb-6 text-center">
              <h4 className="font-bold text-purple-200 mb-2">✨ Mantra del Mes</h4>
              <p className="text-lg text-white font-semibold">{mes.mantra_mensual}</p>
            </div>

            {/* Eventos Clave */}
            {mes.eventos_clave.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-blue-200 mb-4 text-lg">🌟 Eventos Clave</h4>
                <div className="space-y-4">
                  {mes.eventos_clave.map((evento, eventIndex) => (
                    <div key={eventIndex} className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h5 className="font-bold text-blue-200">{evento.evento}</h5>
                        <span className="text-blue-300 text-sm">{evento.fecha}</span>
                      </div>
                      <p className="text-blue-100 mb-2">{evento.impacto_personal}</p>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-green-300">✅ Acción:</span>
                          <p className="text-green-200">{evento.accion_recomendada}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-300">⚠️ Evitar:</span>
                          <p className="text-red-200">{evento.evitar}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ritual y Afirmación */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4">
                <h4 className="font-bold text-purple-200 mb-2">🔮 Ritual Power</h4>
                <p className="text-purple-100 text-sm">{mes.ritual_power}</p>
              </div>
              <div className="bg-pink-500/10 border border-pink-400/20 rounded-xl p-4">
                <h4 className="font-bold text-pink-200 mb-2">💫 Afirmación Diaria</h4>
                <p className="text-pink-100 text-sm italic">"{mes.afirmacion_diaria}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Llamada a la Acción Final */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">🚀 Tu Momento de Despertar</h2>
        <p className="text-xl text-white font-semibold">{agendaData.llamada_accion_final}</p>
      </div>
    </div>
  );
}