'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PlanetaryCard {
  planeta: string;
  simbolo: string;
  quien_eres_natal: {
    posicion_completa: string;
    caracteristicas: string[];
    superpoder_natal: string;
  };
  transito_activo_este_anio: {
    posicion_completa: string;
    duracion: string;
    que_pide: string[];
  };
  cruce_natal_mas_transito: {
    tu_natal: string;
    este_anio: string;
    el_conflicto: string;
    la_solucion: string;
  };
  reglas_del_anio: string[];
  como_afecta_a_eventos: {
    lunas_nuevas: string;
    lunas_llenas: string;
    retrogradaciones: string;
    eclipses: string;
  };
  sombra_a_evitar: string[];
  ejercicio_anual: {
    titulo: string;
    descripcion: string;
    preguntas: string[];
  };
  apoyo_fisico: Array<{
    tipo: string;
    elemento: string;
    proposito: string;
  }>;
  frase_ancla_del_anio: string;
  generatedAt?: Date;
  cached?: boolean;
}

export default function PlanetaryCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<PlanetaryCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showCards, setShowCards] = useState(false);

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
      console.error('Error:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (planeta: string) => {
    setExpandedCard(expandedCard === planeta ? null : planeta);
  };

  if (!showCards) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-400/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌟</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Planetas Activos del Año</h2>
            <p className="text-purple-200 text-sm">
              Manuales de uso para cada planeta clave de tu año solar
            </p>
          </div>
        </div>

        <p className="text-purple-100 mb-6 leading-relaxed">
          Estas fichas te explican cómo los planetas activos este año modulan <strong>TODOS</strong> los eventos
          de tu agenda (Lunas, retrogradaciones, eclipses). Son tu contexto anual.
        </p>

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
              Generando fichas planetarias...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generar Fichas Planetarias
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
            <h2 className="text-2xl font-bold text-white">Planetas Activos del Año</h2>
            <p className="text-purple-200 text-sm">
              {cards.length} {cards.length === 1 ? 'planeta' : 'planetas'} clave de tu año solar
            </p>
          </div>
        </div>
      </div>

      {/* FICHAS DE PLANETAS */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.planeta}
            className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-xl border border-purple-400/30 overflow-hidden"
          >
            {/* HEADER DE LA FICHA */}
            <button
              onClick={() => toggleCard(card.planeta)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{card.simbolo}</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">{card.planeta.toUpperCase()} DEL AÑO</h3>
                  <p className="text-purple-200 text-sm">
                    {card.quien_eres_natal.posicion_completa} → {card.transito_activo_este_anio.posicion_completa}
                  </p>
                </div>
              </div>
              {expandedCard === card.planeta ? (
                <ChevronUp className="w-6 h-6 text-purple-300" />
              ) : (
                <ChevronDown className="w-6 h-6 text-purple-300" />
              )}
            </button>

            {/* CONTENIDO EXPANDIDO */}
            {expandedCard === card.planeta && (
              <div className="p-6 pt-0 space-y-6 border-t border-purple-400/20">

                {/* 🧬 QUIÉN ERES (NATAL) */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-100 mb-3 flex items-center gap-2">
                    <span>🧬</span> QUIÉN ERES (NATAL)
                  </h4>
                  <p className="text-purple-300 font-semibold mb-2">{card.quien_eres_natal.posicion_completa}</p>
                  <ul className="space-y-1 text-gray-200 mb-3">
                    {card.quien_eres_natal.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">→</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-white italic bg-purple-900/30 rounded-lg p-3">
                    {card.quien_eres_natal.superpoder_natal}
                  </p>
                </div>

                {/* 🌍 TRÁNSITO ACTIVO ESTE AÑO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-blue-100 mb-3 flex items-center gap-2">
                    <span>🌍</span> TRÁNSITO ACTIVO ESTE AÑO
                  </h4>
                  <p className="text-blue-300 font-semibold mb-2">{card.transito_activo_este_anio.posicion_completa}</p>
                  <p className="text-blue-200 text-sm mb-3">Duración: {card.transito_activo_este_anio.duracion}</p>
                  <ul className="space-y-1 text-gray-200">
                    {card.transito_activo_este_anio.que_pide.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🔄 CRUCE: NATAL + TRÁNSITO */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
                    <span>🔄</span> CRUCE: TU NATAL + TRÁNSITO DEL AÑO
                  </h4>
                  <div className="space-y-3 text-gray-200">
                    <p><strong className="text-orange-200">Tu natal:</strong> {card.cruce_natal_mas_transito.tu_natal}</p>
                    <p><strong className="text-orange-200">Este año:</strong> {card.cruce_natal_mas_transito.este_anio}</p>
                    <p><strong className="text-red-200">El conflicto:</strong> {card.cruce_natal_mas_transito.el_conflicto}</p>
                    <p className="bg-emerald-900/30 rounded-lg p-3">
                      <strong className="text-emerald-200">La solución:</strong> {card.cruce_natal_mas_transito.la_solucion}
                    </p>
                  </div>
                </div>

                {/* 🎯 REGLAS DEL AÑO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-yellow-100 mb-3 flex items-center gap-2">
                    <span>🎯</span> REGLAS DEL AÑO CON {card.planeta.toUpperCase()}
                  </h4>
                  <ol className="space-y-2 text-gray-200 list-decimal list-inside">
                    {card.reglas_del_anio.map((regla, i) => (
                      <li key={i} className="leading-relaxed">{regla}</li>
                    ))}
                  </ol>
                </div>

                {/* 💡 CÓMO AFECTA A EVENTOS */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
                    <span>💡</span> CÓMO ESTE TRÁNSITO AFECTA A TODOS LOS EVENTOS DEL AÑO
                  </h4>
                  <div className="space-y-3 text-gray-200">
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌑 Cuando llegue una Luna Nueva:</p>
                      <p className="pl-4">{card.como_afecta_a_eventos.lunas_nuevas}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌕 Cuando llegue una Luna Llena:</p>
                      <p className="pl-4">{card.como_afecta_a_eventos.lunas_llenas}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">↩️ Cuando llegue una retrogradación:</p>
                      <p className="pl-4">{card.como_afecta_a_eventos.retrogradaciones}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-200 mb-1">🌘 Cuando llegue un eclipse:</p>
                      <p className="pl-4">{card.como_afecta_a_eventos.eclipses}</p>
                    </div>
                  </div>
                </div>

                {/* ⚠️ SOMBRA A EVITAR */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-red-100 mb-3 flex items-center gap-2">
                    <span>⚠️</span> SOMBRA A EVITAR CON {card.planeta.toUpperCase()} ESTE AÑO
                  </h4>
                  <ul className="space-y-2 text-gray-200">
                    {card.sombra_a_evitar.map((sombra, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">{i + 1}.</span>
                        <span>{sombra}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ✨ EJERCICIO ANUAL */}
                <div className="border-t border-purple-400/20 pt-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-100 mb-3 flex items-center gap-2">
                    <span>✨</span> {card.ejercicio_anual.titulo}
                  </h4>
                  <p className="text-gray-200 mb-4">{card.ejercicio_anual.descripcion}</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-green-200">Preguntas mensuales:</p>
                    <ol className="space-y-2 text-gray-200 list-decimal list-inside pl-2">
                      {card.ejercicio_anual.preguntas.map((pregunta, i) => (
                        <li key={i} className="leading-relaxed">{pregunta}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* 🔮 APOYO FÍSICO */}
                <div className="border-t border-purple-400/20 pt-6">
                  <h4 className="text-lg font-semibold text-violet-100 mb-3 flex items-center gap-2">
                    <span>🔮</span> APOYO FÍSICO PARA {card.planeta.toUpperCase()} ESTE AÑO
                  </h4>
                  <div className="space-y-3">
                    {card.apoyo_fisico.map((apoyo, i) => (
                      <div key={i} className="flex items-start gap-3 text-white">
                        <span className="text-xl">{apoyo.tipo}</span>
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
                    "{card.frase_ancla_del_anio}"
                  </p>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
