// src/components/astrology/AgendaAIDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AgendaData {
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

interface AgendaAIDisplayProps {
  userId: string;
}

export default function AgendaAIDisplay({ userId }: AgendaAIDisplayProps) {
  const { user } = useAuth();
  const [agenda, setAgenda] = useState<AgendaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateAgenda = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔮 Generando agenda astrológica...');
      
      const response = await fetch('/api/astrology/generate-agenda-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          regenerate: false // No regenerar si ya existe
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.data.agenda) {
          setAgenda(data.data.agenda);
          setHasGenerated(true);
          console.log('✅ Agenda generada exitosamente');
        } else {
          setError('La agenda se generó pero el formato no es válido');
        }
      } else {
        if (data.action === 'redirect_to_birth_data') {
          setError('Necesitas configurar tus datos de nacimiento primero. Ve a la sección de datos de nacimiento.');
        } else if (data.action === 'redirect_to_natal_chart') {
          setError('Necesitas generar tu carta natal primero. Ve a la sección de carta natal.');
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

  // Auto-generar agenda al cargar si no existe
  useEffect(() => {
    if (userId && !hasGenerated && !loading) {
      generateAgenda();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-white mb-2">✨ Generando tu Agenda Cósmica</h3>
          <p className="text-purple-200">Las estrellas están conspirando para tu éxito...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-4">Error en tu Agenda Cósmica</h3>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={generateAgenda}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔮 Intentar Nuevamente
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

  if (!agenda) {
    return (
      <div className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-xl font-bold text-white mb-4">Tu Agenda Cósmica Está Lista</h3>
          <p className="text-gray-300 mb-6">Genera tu agenda astrológica personalizada con IA</p>
          <button 
            onClick={generateAgenda}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🔮 Generar Mi Agenda Épica
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Principal */}
      <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{agenda.titulo}</h1>
        <p className="text-xl text-purple-200 mb-4 italic">{agenda.subtitulo}</p>
        <p className="text-lg text-indigo-200 leading-relaxed">{agenda.intro_disruptiva}</p>
        
        {/* Botón regenerar */}
        <div className="mt-6">
          <button 
            onClick={() => {
              setHasGenerated(false);
              generateAgenda();
            }}
            className="bg-purple-600/70 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            🔄 Regenerar Agenda
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
            <p className="text-amber-100">{agenda.fechas_power.cumpleanos_solar}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <h3 className="font-bold text-amber-200 mb-2">🌒 Eclipses Personales</h3>
            <p className="text-amber-100">{agenda.fechas_power.eclipses_personales}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <h3 className="font-bold text-amber-200 mb-2">🔄 Retrógrados Clave</h3>
            <p className="text-amber-100">{agenda.fechas_power.retrogrados_clave}</p>
          </div>
        </div>
      </div>

      {/* Meses */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          📅 Tu Viaje Mensual Cósmico
        </h2>
        
        {agenda.meses.map((mes, index) => (
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
        <p className="text-xl text-white font-semibold">{agenda.llamada_accion_final}</p>
      </div>
    </div>
  );
}