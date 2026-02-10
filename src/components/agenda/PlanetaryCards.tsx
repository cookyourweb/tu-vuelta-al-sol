'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, ArrowRight, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface PlanetaryCard {
  planeta: string;
  simbolo: string;
  quien_eres_natal: {
    titulo?: string;
    posicion_completa: string;
    caracteristicas: string[];
    superpoder_natal: string;
    diferenciador_clave?: string;
  };
  que_se_activa_este_anio: {
    titulo?: string;
    periodo: string; // "marzo 2025 – marzo 2026"
    posicion_completa: string;
    duracion_texto: string; // "Todo el año solar, no es puntual"
    introduccion: string;
    este_anio: string[];
    integracion_signo_casa?: string;
    contraste_con_natal?: string; // "Normalmente..., pero este ciclo..."
  };
  cruce_real: {
    titulo?: string;
    // Campos antiguos (compatibilidad hacia atrás)
    tu_naturaleza?: string;
    este_anio_pide?: string;
    el_conflicto?: string;
    la_clave?: string;
    // Campos nuevos (calidad mejorada)
    natal_especifico?: string;
    sr_especifico?: string;
    contraste_directo?: string;
    aprendizaje_del_anio?: string;
    frase_potente_cierre?: string;
  };
  reglas_del_anio: {
    titulo?: string;
    reglas: string[];
    entrenamiento_anual: string;
  };
  como_se_activa_segun_momento: {
    titulo?: string;
    introduccion?: string;
    en_lunas_nuevas: string;
    en_lunas_llenas: string;
    durante_retrogradaciones: string;
    durante_eclipses: string;
  };
  sombras_a_vigilar: {
    titulo?: string;
    sombras: string[];
    equilibrio: string;
  };
  ritmo_de_trabajo: {
    titulo?: string;
    frecuencia: string;
    ejercicio_mensual: string;
    preguntas_mensuales: string[];
    claves_practicas_diarias?: string[];
    ritmos_semanales?: string;
  };
  apoyo_fisico: {
    titulo?: string;
    nota?: string;
    items: Array<{
      tipo: string;
      elemento: string;
      proposito: string;
    }>;
  };
  frase_ancla_del_anio: string;
  generatedAt?: Date;
  cached?: boolean;
}

interface PlanetaryCardsProps {
  cards?: PlanetaryCard[];
  setCards?: (cards: PlanetaryCard[]) => void;
  showCards?: boolean;
  setShowCards?: (show: boolean) => void;
}

export default function PlanetaryCards({
  cards: externalCards,
  setCards: externalSetCards,
  showCards: externalShowCards,
  setShowCards: externalSetShowCards
}: PlanetaryCardsProps) {
  const { user } = useAuth();
  // Use external state if provided, otherwise use internal state
  const [internalCards, setInternalCards] = useState<PlanetaryCard[]>([]);
  const [internalShowCards, setInternalShowCards] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<PlanetaryCard | null>(null);

  const cards = externalCards !== undefined ? externalCards : internalCards;
  const setCards = externalSetCards || setInternalCards;
  const showCards = externalShowCards !== undefined ? externalShowCards : internalShowCards;
  const setShowCards = externalSetShowCards || setInternalShowCards;

  // 🎯 Cargar fichas cacheadas al montar el componente
  useEffect(() => {
    const loadCachedCards = async () => {
      if (!user || cards.length > 0) return; // Ya tenemos cards o no hay usuario

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/astrology/planetary-cards', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();

        if (data.success && data.cards && data.cards.length > 0) {
          console.log('[PLANETARY-CARDS] Loaded cached cards:', data.cards.length);
          setCards(data.cards);
          setShowCards(true);
        }
      } catch (err) {
        console.log('[PLANETARY-CARDS] No cached cards available:', err);
        // No mostrar error, simplemente no hay fichas cacheadas
      }
    };

    loadCachedCards();
  }, [user]); // Solo ejecutar cuando cambie el usuario

  const handleGenerateCards = async () => {
    if (!user) {
      setError('Debes estar autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/astrology/planetary-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Generar automáticamente los planetas relevantes
        })
      });

      const data = await response.json();

      if (data.success) {
        setCards(data.cards);
        setShowCards(true);
      } else {
        setError(data.error || 'Error generando fichas planetarias');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!showCards) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-400/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌟</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Planetas Dominantes del Año Solar</h2>
            <p className="text-purple-200 text-sm">
              Los planetas de tu Solar Return que marcan el tono de todo el año
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-purple-100 leading-relaxed">
            Estas fichas te explican cómo los <strong>planetas dominantes de tu año solar</strong> modulan <strong>TODOS</strong> los eventos
            de tu agenda (Lunas, retrogradaciones, eclipses). Son tu contexto anual.
          </p>

          <div className="bg-purple-900/40 border border-purple-400/20 rounded-lg p-4">
            <p className="text-purple-100 text-sm leading-relaxed">
              <strong className="text-purple-200">💡 Diferencia clave:</strong> Los <em>tránsitos</em> son el movimiento diario de los planetas en el cielo.
              Los <em>Planetas Dominantes del Año Solar</em> son las posiciones de tu carta de Retorno Solar que se mantienen activas
              <strong> todo el año</strong> (desde tu cumpleaños hasta el siguiente).
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateCards}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                     bg-gradient-to-r from-purple-600 to-pink-600
                     hover:from-purple-700 hover:to-pink-700
                     text-white font-semibold
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando Planetas Dominantes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generar Planetas Dominantes del Año
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200 text-sm">{error}</p>
                <button
                  onClick={handleGenerateCards}
                  className="mt-2 text-red-100 text-sm underline hover:text-white"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌟</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Planetas Dominantes del Año Solar</h2>
            <p className="text-purple-200 text-sm">
              {cards.length} {cards.length === 1 ? 'planeta dominante' : 'planetas dominantes'} de tu Retorno Solar
            </p>
          </div>
        </div>
      </div>

      {/* FICHAS DE PLANETAS */}
      <div className="space-y-3">
        {cards.map((card) => (
          <button
            key={card.planeta}
            onClick={() => setSelectedCard(card)}
            className="w-full bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-xl border border-purple-400/30
                       p-5 flex items-center justify-between hover:bg-white/5 hover:border-purple-300/50
                       transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{card.simbolo}</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">{card.planeta.toUpperCase()} DEL AÑO</h3>
                <p className="text-purple-200 text-sm">
                  {card.quien_eres_natal.posicion_completa} → {card.que_se_activa_este_anio.posicion_completa}
                </p>
                <p className="text-yellow-300 text-xs mt-1">
                  ☉ {card.que_se_activa_este_anio.periodo}
                </p>
                <p className="text-blue-300 text-xs mt-1 italic">
                  {card.que_se_activa_este_anio.duracion_texto}
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      {/* MODAL FULLSCREEN */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 mb-8">

              {/* MODAL HEADER */}
              <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 px-6 py-6 rounded-t-2xl border-b border-purple-400/30 sticky top-0 z-10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 flex items-center gap-4">
                    <span className="text-5xl">{selectedCard.simbolo}</span>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {selectedCard.planeta.toUpperCase()} DEL AÑO
                      </h1>
                      <p className="text-purple-200 text-sm mb-1">
                        {selectedCard.quien_eres_natal.posicion_completa} → {selectedCard.que_se_activa_este_anio.posicion_completa}
                      </p>
                      <p className="text-yellow-300 text-sm">
                        ☉ {selectedCard.que_se_activa_este_anio.periodo}
                      </p>
                      <p className="text-blue-300 text-sm mt-1 italic">
                        {selectedCard.que_se_activa_este_anio.duracion_texto}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCard(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-purple-200" />
                  </button>
                </div>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-6 md:p-8 space-y-6">

                {/* 🧬 QUIÉN ERES (NATAL) */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-100 mb-3 flex items-center gap-2">
                    <span>🧬</span> QUIÉN ERES (NATAL)
                  </h4>
                  <p className="text-purple-300 font-semibold mb-2">{selectedCard.quien_eres_natal.posicion_completa}</p>
                  <ul className="space-y-1 text-gray-200 mb-3">
                    {selectedCard.quien_eres_natal.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">→</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-white italic bg-purple-900/30 rounded-lg p-3 mb-3">
                    {selectedCard.quien_eres_natal.superpoder_natal}
                  </p>
                  {selectedCard.quien_eres_natal.diferenciador_clave && (
                    <p className="text-purple-200 text-sm leading-relaxed bg-purple-800/20 rounded-lg p-3 border-l-4 border-purple-400">
                      💡 {selectedCard.quien_eres_natal.diferenciador_clave}
                    </p>
                  )}
                </div>

                {/* 🌍 QUÉ SE ACTIVA ESTE AÑO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-blue-100 mb-3 flex items-center gap-2">
                    <span>🌍</span> QUÉ SE ACTIVA ESTE AÑO
                  </h4>
                  <p className="text-yellow-300 font-semibold mb-2 text-sm">({selectedCard.que_se_activa_este_anio.periodo})</p>
                  <p className="text-blue-300 font-semibold mb-2">{selectedCard.que_se_activa_este_anio.posicion_completa}</p>
                  <p className="text-blue-200 text-sm mb-3 italic">{selectedCard.que_se_activa_este_anio.duracion_texto}</p>
                  <p className="text-white mb-3 leading-relaxed">{selectedCard.que_se_activa_este_anio.introduccion}</p>
                  <p className="text-gray-300 text-sm mb-2 font-semibold">Este año:</p>
                  <ul className="space-y-1 text-gray-200">
                    {selectedCard.que_se_activa_este_anio.este_anio.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedCard.que_se_activa_este_anio.integracion_signo_casa && (
                    <p className="text-blue-200 text-sm leading-relaxed bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-400 mt-3">
                      🔗 {selectedCard.que_se_activa_este_anio.integracion_signo_casa}
                    </p>
                  )}
                  {selectedCard.que_se_activa_este_anio.contraste_con_natal && (
                    <div className="mt-4 bg-gradient-to-r from-orange-900/30 to-amber-900/30 rounded-lg p-4 border-l-4 border-amber-500">
                      <p className="text-amber-200 font-semibold mb-2">⚡ El contraste clave del año:</p>
                      <p className="text-gray-200 text-sm leading-relaxed italic">
                        {selectedCard.que_se_activa_este_anio.contraste_con_natal}
                      </p>
                    </div>
                  )}
                </div>

                {/* 🔄 CRUCE REAL */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
                    <span>🔄</span> CRUCE REAL: TU BASE + EL AÑO
                  </h4>
                  <div className="space-y-3 text-gray-200">
                    {/* Formato nuevo (mejorado) */}
                    {selectedCard.cruce_real.natal_especifico && (
                      <p className="bg-purple-900/20 rounded-lg p-3">
                        <strong className="text-purple-200">Natal:</strong> {selectedCard.cruce_real.natal_especifico}
                      </p>
                    )}
                    {selectedCard.cruce_real.sr_especifico && (
                      <p className="bg-blue-900/20 rounded-lg p-3">
                        <strong className="text-blue-200">Solar Return:</strong> {selectedCard.cruce_real.sr_especifico}
                      </p>
                    )}
                    {selectedCard.cruce_real.contraste_directo && (
                      <p className="bg-orange-900/30 rounded-lg p-3 border-l-4 border-orange-400">
                        <strong className="text-orange-200">⚡ Contraste:</strong> {selectedCard.cruce_real.contraste_directo}
                      </p>
                    )}
                    {selectedCard.cruce_real.aprendizaje_del_anio && (
                      <p className="bg-yellow-900/20 rounded-lg p-3">
                        <strong className="text-yellow-200">🎯 Aprendizaje del año:</strong> {selectedCard.cruce_real.aprendizaje_del_anio}
                      </p>
                    )}
                    {selectedCard.cruce_real.frase_potente_cierre && (
                      <p className="bg-emerald-900/30 rounded-lg p-4 border-2 border-emerald-500/30 text-center">
                        <strong className="text-emerald-200 text-lg italic">"{selectedCard.cruce_real.frase_potente_cierre}"</strong>
                      </p>
                    )}

                    {/* Formato antiguo (compatibilidad hacia atrás) */}
                    {!selectedCard.cruce_real.natal_especifico && selectedCard.cruce_real.tu_naturaleza && (
                      <>
                        <p><strong className="text-orange-200">Tu naturaleza:</strong> {selectedCard.cruce_real.tu_naturaleza}</p>
                        <p><strong className="text-orange-200">Este año pide:</strong> {selectedCard.cruce_real.este_anio_pide}</p>
                        <p><strong className="text-red-200">El conflicto:</strong> {selectedCard.cruce_real.el_conflicto}</p>
                        <p className="bg-emerald-900/30 rounded-lg p-3">
                          <strong className="text-emerald-200">La clave:</strong> {selectedCard.cruce_real.la_clave}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* 🎯 REGLAS DEL AÑO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-yellow-100 mb-3 flex items-center gap-2">
                    <span>🎯</span> REGLAS DE {selectedCard.planeta.toUpperCase()} PARA TODO EL AÑO
                  </h4>
                  <ul className="space-y-2 text-gray-200 mb-4">
                    {selectedCard.reglas_del_anio.reglas.map((regla, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">→</span>
                        <span className="leading-relaxed">{regla}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-yellow-200 italic bg-yellow-900/20 rounded-lg p-3">
                    👉 {selectedCard.reglas_del_anio.entrenamiento_anual}
                  </p>
                </div>

                {/* ⏱️ CÓMO SE ACTIVA SEGÚN EL MOMENTO */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                    <span>⏱️</span> CÓMO SE ACTIVA {selectedCard.planeta.toUpperCase()} SEGÚN EL MOMENTO
                  </h4>
                  {selectedCard.como_se_activa_segun_momento.introduccion && (
                    <p className="text-cyan-200 text-sm mb-4 italic">{selectedCard.como_se_activa_segun_momento.introduccion}</p>
                  )}
                  <div className="space-y-3 text-gray-200">
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌑 En cada Luna Nueva</p>
                      <p className="pl-4">{selectedCard.como_se_activa_segun_momento.en_lunas_nuevas}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌕 En cada Luna Llena</p>
                      <p className="pl-4">{selectedCard.como_se_activa_segun_momento.en_lunas_llenas}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">↩️ Durante retrogradaciones</p>
                      <p className="pl-4">{selectedCard.como_se_activa_segun_momento.durante_retrogradaciones}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌘 Durante eclipses</p>
                      <p className="pl-4">{selectedCard.como_se_activa_segun_momento.durante_eclipses}</p>
                    </div>
                  </div>
                </div>

                {/* ⚠️ SOMBRAS A VIGILAR */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-red-100 mb-3 flex items-center gap-2">
                    <span>⚠️</span> SOMBRAS A VIGILAR ESTE AÑO
                  </h4>
                  <ul className="space-y-2 text-gray-200 mb-4">
                    {selectedCard.sombras_a_vigilar.sombras.map((sombra, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">{i + 1}.</span>
                        <span>{sombra}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-emerald-200 italic bg-emerald-900/20 rounded-lg p-3">
                    👉 {selectedCard.sombras_a_vigilar.equilibrio}
                  </p>
                </div>

                {/* ✨ RITMO DE TRABAJO */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-100 mb-2 flex items-center gap-2">
                    <span>✨</span> RITMO DE TRABAJO CON {selectedCard.planeta.toUpperCase()} (agenda)
                  </h4>
                  <p className="text-green-200 text-sm mb-3">Frecuencia: {selectedCard.ritmo_de_trabajo.frecuencia}</p>
                  <p className="text-gray-200 mb-4">{selectedCard.ritmo_de_trabajo.ejercicio_mensual}</p>

                  {/* Claves prácticas diarias */}
                  {selectedCard.ritmo_de_trabajo.claves_practicas_diarias && selectedCard.ritmo_de_trabajo.claves_practicas_diarias.length > 0 && (
                    <div className="mb-4 bg-green-800/20 rounded-lg p-3">
                      <p className="font-semibold text-green-200 mb-2">🔑 Claves prácticas diarias:</p>
                      <ul className="space-y-2 text-gray-200">
                        {selectedCard.ritmo_de_trabajo.claves_practicas_diarias.map((clave, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="leading-relaxed">{clave}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ritmos semanales */}
                  {selectedCard.ritmo_de_trabajo.ritmos_semanales && (
                    <div className="mb-4 bg-emerald-800/20 rounded-lg p-3 border-l-4 border-emerald-400">
                      <p className="font-semibold text-emerald-200 mb-2">☉ Ritmos semanales:</p>
                      <p className="text-gray-200 text-sm leading-relaxed">{selectedCard.ritmo_de_trabajo.ritmos_semanales}</p>
                    </div>
                  )}

                  {/* Preguntas mensuales */}
                  <div className="space-y-2">
                    <p className="font-semibold text-green-200">❓ Preguntas mensuales:</p>
                    <ol className="space-y-2 text-gray-200 list-decimal list-inside pl-2">
                      {selectedCard.ritmo_de_trabajo.preguntas_mensuales.map((pregunta, i) => (
                        <li key={i} className="leading-relaxed">{pregunta}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* 🔮 APOYO FÍSICO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-violet-100 mb-2 flex items-center gap-2">
                    <span>🔮</span> APOYO FÍSICO (conexión tienda futura)
                  </h4>
                  {selectedCard.apoyo_fisico.nota && (
                    <p className="text-violet-200 text-sm mb-3 italic">{selectedCard.apoyo_fisico.nota}</p>
                  )}
                  <div className="space-y-3">
                    {selectedCard.apoyo_fisico.items.map((apoyo, i) => (
                      <div key={i} className="flex items-start gap-3 text-white">
                        <span className="text-xl">{apoyo.tipo.split(' ')[0]}</span>
                        <div>
                          <span className="font-semibold text-violet-200">{apoyo.elemento}</span>
                          <span className="text-gray-300"> → {apoyo.proposito}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 FRASE ANCLA */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold text-yellow-100 mb-3 flex items-center justify-center gap-2">
                    <span>🌟</span> FRASE ANCLA DEL AÑO
                  </h4>
                  <p className="text-white text-xl font-bold italic">
                    "{selectedCard.frase_ancla_del_anio}"
                  </p>
                </div>

              </div>

              {/* MODAL FOOTER */}
              <div className="px-6 py-4 border-t border-purple-400/30 bg-slate-900/50 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">
                    🌟 Planeta Dominante de tu año solar
                  </p>
                  <button
                    onClick={() => setSelectedCard(null)}
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

      {/* MODAL DE LOADING */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-400/50 rounded-3xl p-10 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              {/* Spinner animado */}
              <div className="mb-6 flex justify-center">
                <Loader2 className="w-16 h-16 text-purple-300 animate-spin" />
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-white mb-4">
                Generando Planetas Dominantes
              </h3>

              {/* Descripción de lo que está pasando */}
              <div className="space-y-3 text-purple-200 text-sm leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Analizando tu carta de Retorno Solar...</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Identificando planetas dominantes del año...</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Cruzando con tu carta natal...</span>
                </p>
                <p className="flex items-start gap-2">
                  <Loader2 className="w-4 h-4 text-purple-300 animate-spin mt-1" />
                  <span className="text-white font-semibold">Generando interpretaciones personalizadas con IA...</span>
                </p>
              </div>

              {/* Mensaje de espera */}
              <div className="mt-6 bg-purple-800/30 border border-purple-400/30 rounded-lg p-4">
                <p className="text-purple-100 text-xs">
                  Este proceso puede tardar entre 30-60 segundos.
                  <br />
                  Estamos creando contenido único para ti.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
