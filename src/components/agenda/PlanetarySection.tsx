'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PlanetaryCards, { PlanetaryCard } from './PlanetaryCards';
import { PlanetIndividualSRInterpretation } from '@/types/astrology/interpretation';

interface ActivePlanet {
  name: string;
  symbol: string;
  natalSign: string;
  natalHouse: number;
  srSign?: string;
  srHouse?: number;
  duration: string;
  isSlowPlanet: boolean;
}

interface PlanetarySectionProps {
  activePlanets: ActivePlanet[] | null;
}

export default function PlanetarySection({ activePlanets }: PlanetarySectionProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'activos' | 'dominantes'>('activos');
  const [selectedPlanet, setSelectedPlanet] = useState<ActivePlanet | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loadingInterpretation, setLoadingInterpretation] = useState(false);
  const [interpretation, setInterpretation] = useState<PlanetIndividualSRInterpretation | null>(null);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);
  // Estado para persistir planetas dominantes entre cambios de pestaña
  const [dominantCards, setDominantCards] = useState<PlanetaryCard[]>([]);
  const [showDominantCards, setShowDominantCards] = useState(false);

  const generatePlanetInterpretation = async (planet: ActivePlanet) => {
    if (!user) {
      setInterpretationError('Debes estar autenticado');
      return;
    }

    setLoadingInterpretation(true);
    setInterpretationError(null);
    setInterpretation(null);

    try {
      const token = await user.getIdToken();
      const currentYear = new Date().getFullYear();
      const planetNameLower = planet.name.toLowerCase();

      const response = await fetch('/api/astrology/interpret-planet-sr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          planetName: planetNameLower,
          returnYear: currentYear,
          natalSign: planet.natalSign,
          natalHouse: planet.natalHouse,
          srSign: planet.srSign || planet.natalSign,
          srHouse: planet.srHouse || planet.natalHouse,
        })
      });

      const data = await response.json();

      if (data.success) {
        setInterpretation(data.interpretation);
      } else {
        setInterpretationError(data.error || 'Error generando interpretación');
      }
    } catch (err) {
      setInterpretationError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoadingInterpretation(false);
    }
  };

  const handleClosePlanetModal = () => {
    setShowTooltip(false);
    setInterpretation(null);
    setInterpretationError(null);
    setLoadingInterpretation(false);
    setSelectedPlanet(null);
  };

  const getPlanetExplanation = (planetName: string): { description: string; keywords: string[] } => {
    const explanations: Record<string, { description: string; keywords: string[] }> = {
      'Sol': {
        description: 'Tu identidad, propósito vital y expresión del yo. Representa tu esencia y cómo brillas en el mundo.',
        keywords: ['Identidad', 'Propósito', 'Autoexpresión', 'Vitalidad']
      },
      'Luna': {
        description: 'Tus emociones, necesidades y mundo interior. Representa cómo te cuidas y te sientes seguro.',
        keywords: ['Emociones', 'Intuición', 'Hogar', 'Seguridad emocional']
      },
      'Mercurio': {
        description: 'Tu mente, comunicación y forma de procesar información. Representa cómo piensas y te expresas.',
        keywords: ['Comunicación', 'Aprendizaje', 'Lógica', 'Expresión verbal']
      },
      'Venus': {
        description: 'Tus valores, relaciones y forma de amar. Representa lo que aprecias y cómo te relacionas.',
        keywords: ['Amor', 'Valores', 'Belleza', 'Relaciones']
      },
      'Marte': {
        description: 'Tu energía, acción y forma de perseguir lo que deseas. Representa tu impulso y valentía.',
        keywords: ['Acción', 'Deseo', 'Energía', 'Coraje']
      },
      'Júpiter': {
        description: 'Tu expansión, optimismo y búsqueda de significado. Representa tus oportunidades de crecimiento.',
        keywords: ['Expansión', 'Sabiduría', 'Optimismo', 'Abundancia']
      },
      'Saturno': {
        description: 'Tu estructura, responsabilidad y maestría. Representa tus límites y lecciones de vida.',
        keywords: ['Disciplina', 'Responsabilidad', 'Límites', 'Maestría']
      }
    };

    return explanations[planetName] || {
      description: 'Planeta activo en tu año solar.',
      keywords: []
    };
  };

  return (
    <div className="mb-6">
      {/* TABS */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-t-2xl border-x border-t border-purple-400/30">
        <div className="flex">
          <button
            onClick={() => setActiveTab('activos')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'activos'
                ? 'bg-purple-600/40 text-white border-b-2 border-yellow-400'
                : 'text-purple-200 hover:bg-purple-800/20'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              🌟 Planetas Activos
            </span>
          </button>
          <button
            onClick={() => setActiveTab('dominantes')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'dominantes'
                ? 'bg-purple-600/40 text-white border-b-2 border-yellow-400'
                : 'text-purple-200 hover:bg-purple-800/20'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              ✨ Planetas Dominantes
            </span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-b-2xl border-x border-b border-purple-400/30 p-6">
        {activeTab === 'activos' && (
          <div>
            {activePlanets && activePlanets.length > 0 ? (
              <>
                <p className="text-purple-200 text-sm mb-4 text-center">
                  Click en cada planeta para ver su significado y generar interpretación personalizada
                </p>
                <div className="space-y-2">
                  {activePlanets.map((planet, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedPlanet(planet);
                        setShowTooltip(true);
                      }}
                      className="w-full bg-black/30 rounded-xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl filter brightness-150 saturate-150">{planet.symbol}</span>
                          <div className="text-left">
                            <span className="text-white font-semibold text-base block">{planet.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                              planet.isSlowPlanet
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-orange-500/20 text-orange-300'
                            }`}>
                              Todo el año
                            </span>
                          </div>
                        </div>
                        <span className="text-purple-300 text-sm">Click para interpretar →</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center">
                    Estos planetas de tu Retorno Solar modulan todos los eventos de tu agenda
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-200">Cargando planetas activos...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dominantes' && (
          <div>
            <PlanetaryCards
              cards={dominantCards}
              setCards={setDominantCards}
              showCards={showDominantCards}
              setShowCards={setShowDominantCards}
            />
          </div>
        )}
      </div>

      {/* MODAL FULLSCREEN PARA PLANETA SELECCIONADO */}
      {showTooltip && selectedPlanet && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20">

              {/* HEADER */}
              <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 px-6 py-6 rounded-t-2xl border-b border-purple-400/30 sticky top-0 z-10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedPlanet.symbol}</span>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{selectedPlanet.name}</h1>
                      <span className={`text-xs px-3 py-1 rounded-full inline-block ${
                        selectedPlanet.isSlowPlanet
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        Activo todo el año solar
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleClosePlanetModal}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-purple-200" />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Explicación del planeta */}
                <div className="bg-purple-900/30 rounded-xl p-5 border border-purple-400/20">
                  <h3 className="text-lg font-semibold text-purple-100 mb-3">
                    ¿Qué representa {selectedPlanet.name}?
                  </h3>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {getPlanetExplanation(selectedPlanet.name).description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getPlanetExplanation(selectedPlanet.name).keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-600/30 text-purple-100 text-xs px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info del planeta en el año */}
                <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-400/20">
                  <h3 className="text-lg font-semibold text-blue-100 mb-3">
                    {selectedPlanet.name} en tu año solar
                  </h3>
                  <div className="space-y-2 text-gray-200 text-sm">
                    <p>
                      <strong className="text-blue-200">Natal:</strong> {selectedPlanet.natalSign} Casa {selectedPlanet.natalHouse}
                    </p>
                    {selectedPlanet.srSign && selectedPlanet.srHouse && (
                      <p>
                        <strong className="text-blue-200">Retorno Solar:</strong> {selectedPlanet.srSign} Casa {selectedPlanet.srHouse}
                      </p>
                    )}
                    <p>
                      <strong className="text-blue-200">Duración:</strong> Todo el año (desde tu cumpleaños hasta el siguiente)
                    </p>
                  </div>
                </div>

                {/* Interpretación generada */}
                {interpretation && (
                  <div className="space-y-4">
                    {/* Sección: Quién eres */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl p-5 border border-indigo-400/20">
                      <h3 className="text-lg font-semibold text-indigo-100 mb-2">
                        {interpretation.drawer.quien_eres.titulo}
                      </h3>
                      <p className="text-sm text-indigo-200 mb-2">{interpretation.drawer.quien_eres.posicion_natal}</p>
                      <p className="text-gray-200 leading-relaxed">{interpretation.drawer.quien_eres.descripcion}</p>
                    </div>

                    {/* Sección: Qué se activa */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-5 border border-purple-400/20">
                      <h3 className="text-lg font-semibold text-purple-100 mb-2">
                        {interpretation.drawer.que_se_activa.titulo}
                      </h3>
                      <p className="text-sm text-purple-200 mb-2">{interpretation.drawer.que_se_activa.posicion_sr}</p>
                      <p className="text-gray-200 leading-relaxed">{interpretation.drawer.que_se_activa.descripcion}</p>
                    </div>

                    {/* Sección: Cruce clave */}
                    <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-5 border border-yellow-400/20">
                      <h3 className="text-lg font-semibold text-yellow-100 mb-2">
                        {interpretation.drawer.cruce_clave.titulo}
                      </h3>
                      <p className="text-gray-200 leading-relaxed">{interpretation.drawer.cruce_clave.descripcion}</p>
                    </div>

                    {/* Sección: Cómo usar */}
                    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-400/20">
                      <h3 className="text-lg font-semibold text-green-100 mb-3">
                        {interpretation.drawer.como_usar.titulo}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-green-200 font-semibold text-sm mb-1">Acción concreta:</p>
                          <p className="text-gray-200">{interpretation.drawer.como_usar.accion_concreta}</p>
                        </div>
                        <div>
                          <p className="text-green-200 font-semibold text-sm mb-1">Ejemplo práctico:</p>
                          <p className="text-gray-200">{interpretation.drawer.como_usar.ejemplo_practico}</p>
                        </div>
                      </div>
                    </div>

                    {/* Botón para regenerar */}
                    <button
                      onClick={() => generatePlanetInterpretation(selectedPlanet)}
                      disabled={loadingInterpretation}
                      className="w-full bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-700/50 hover:to-pink-700/50
                                 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                                 border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Regenerar Interpretación
                    </button>
                  </div>
                )}

                {/* Botón para generar por primera vez */}
                {!interpretation && !loadingInterpretation && (
                  <button
                    onClick={() => generatePlanetInterpretation(selectedPlanet)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                               text-white font-bold py-4 px-6 rounded-xl transition-all duration-200
                               shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generar Interpretación Personalizada</span>
                  </button>
                )}

                {/* Loading state */}
                {loadingInterpretation && (
                  <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-400/20 text-center">
                    <Loader2 className="w-8 h-8 text-purple-300 animate-spin mx-auto mb-3" />
                    <p className="text-purple-200">Generando interpretación personalizada con IA...</p>
                    <p className="text-purple-300 text-sm mt-2">Esto puede tardar 10-20 segundos</p>
                  </div>
                )}

                {/* Error state */}
                {interpretationError && (
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-400/20">
                    <p className="text-red-200 text-sm">{interpretationError}</p>
                    <button
                      onClick={() => generatePlanetInterpretation(selectedPlanet)}
                      className="mt-3 text-sm text-red-300 hover:text-red-100 underline"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* Nota educativa */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 rounded-xl p-4 border border-yellow-400/20">
                  <p className="text-yellow-100 text-sm leading-relaxed">
                    <strong>💡 Nota:</strong> Esta interpretación analizará cómo {selectedPlanet.name} en tu Retorno Solar
                    modula los eventos de tu agenda, considerando tu carta natal como base.
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t border-purple-400/30 bg-slate-900/50 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">
                    🌟 Planeta activo de tu año solar
                  </p>
                  <button
                    onClick={handleClosePlanetModal}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
