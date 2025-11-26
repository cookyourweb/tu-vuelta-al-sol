import React from 'react';
import SectionNavigation from './SectionNavigation';
import { getMonthWithYear, formatDate } from './helpers';

interface SolarReturnTimelineSectionProps {
  birthData: any;
}

export default function SolarReturnTimelineSection({
  birthData
}: SolarReturnTimelineSectionProps) {
  return (
    <div id="linea-tiempo" className="max-w-7xl mx-auto mb-12 scroll-mt-24">
      <SectionNavigation currentSection="linea-tiempo" />
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-purple-400/40 shadow-2xl">

        {/* Header mejorado */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4 border border-purple-400/30">
            <span className="text-4xl">📅</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
            Línea de Tiempo Solar Return
          </h3>
          <p className="text-purple-200 text-lg">
            {new Date().getFullYear()} - {new Date().getFullYear() + 1}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Línea vertical más gruesa y visible */}
          <div className="absolute left-14 md:left-16 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-500 via-purple-500 to-pink-500 opacity-60"></div>

          <div className="space-y-8 md:space-y-10">
            {/* Mes 1 - REDISEÑADO */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-rose-600 to-rose-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-rose-500/50">
                <span className="text-white font-black text-base md:text-lg">MES 1</span>
                <span className="text-rose-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 0, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-rose-900/60 to-rose-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-rose-400/30 shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:scale-105">
                <h4 className="text-rose-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Activación del Ciclo Anual
                </h4>
                <p className="text-rose-200 text-sm md:text-base mb-3 font-medium">
                  📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear()}
                </p>
                <p className="text-rose-50 text-sm md:text-base leading-relaxed">
                  Las primeras 4 semanas marcan el <strong>TONO</strong> del año. Cada acción cuenta <strong>DOBLE</strong>.
                </p>
              </div>
            </div>

            {/* Mes 3 - REDISEÑADO */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-orange-500/50">
                <span className="text-white font-black text-base md:text-lg">MES 3</span>
                <span className="text-orange-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 2, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-orange-900/60 to-orange-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-orange-400/30 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
                <h4 className="text-orange-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Primera Cuadratura Solar
                </h4>
                <p className="text-orange-200 text-sm md:text-base mb-3 font-medium">
                  Tipo: Desafío Necesario
                </p>
                <p className="text-orange-50 text-sm md:text-base leading-relaxed">
                  <strong>MOMENTO DE VERDAD:</strong> ¿Estás alineado con tus intenciones o solo hablando?
                </p>
              </div>
            </div>

            {/* Mes 6 - REDISEÑADO */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-green-500/50">
                <span className="text-white font-black text-base md:text-lg">MES 6</span>
                <span className="text-green-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 5, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-green-900/60 to-green-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-green-400/30 shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
                <h4 className="text-green-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  Trígono Solar - Flujo Cósmico
                </h4>
                <p className="text-green-200 text-sm md:text-base mb-3 font-medium">
                  Tipo: Ventana de Oportunidad
                </p>
                <p className="text-green-50 text-sm md:text-base leading-relaxed">
                  TODO fluye SI hiciste el trabajo previo. Momento de <strong>CAPITALIZAR</strong> esfuerzos.
                </p>
              </div>
            </div>

            {/* Mes 7 - REDISEÑADO (CRÍTICO) */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-red-500/60 animate-pulse">
                <span className="text-white font-black text-base md:text-lg">MES 7</span>
                <span className="text-red-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 6, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-red-900/70 to-red-800/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 border-2 border-red-400/50 shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
                <h4 className="text-red-100 font-black text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  OPOSICIÓN SOLAR - Momento de Verdad Definitivo
                </h4>
                <div className="inline-block bg-red-600/30 border border-red-400/40 rounded-full px-3 py-1 mb-3">
                  <p className="text-red-200 text-xs md:text-sm font-bold">
                    ⚠️ CRÍTICO - Revelación Total
                  </p>
                </div>
                <p className="text-red-50 text-sm md:text-base leading-relaxed">
                  VES con <strong>claridad TOTAL:</strong> ¿funcionó tu estrategia o no? Sin filtros, sin excusas.
                </p>
              </div>
            </div>

            {/* Mes 9 - REDISEÑADO */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-yellow-500/50">
                <span className="text-white font-black text-base md:text-lg">MES 9</span>
                <span className="text-yellow-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 8, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-yellow-900/60 to-yellow-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-yellow-400/30 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105">
                <h4 className="text-yellow-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  Cosecha Visible
                </h4>
                <p className="text-yellow-200 text-sm md:text-base mb-3 font-medium">
                  Tipo: Manifestación de Resultados
                </p>
                <p className="text-yellow-50 text-sm md:text-base leading-relaxed">
                  Frutos de tu trabajo se vuelven <strong>VISIBLES</strong>. Si trabajaste, cosecharás.
                </p>
              </div>
            </div>

            {/* Mes 12 - REDISEÑADO */}
            <div className="flex items-start gap-6 md:gap-8 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex flex-col items-center justify-center flex-shrink-0 z-10 border-4 border-slate-900 shadow-2xl shadow-purple-500/50">
                <span className="text-white font-black text-base md:text-lg">MES 12</span>
                <span className="text-purple-100 text-xs md:text-sm font-semibold mt-1 px-2 text-center leading-tight">
                  {birthData && getMonthWithYear(birthData.birthDate || birthData.date, 11, new Date().getFullYear())}
                </span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-purple-900/60 to-purple-800/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-purple-400/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
                <h4 className="text-purple-100 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌙</span>
                  Cierre e Integración
                </h4>
                <p className="text-purple-200 text-sm md:text-base mb-3 font-medium">
                  📅 {formatDate(birthData?.date || birthData?.birthDate)} {new Date().getFullYear() + 1}
                </p>
                <p className="text-purple-50 text-sm md:text-base leading-relaxed">
                  Último mes para <strong>cerrar ciclos</strong> conscientes y preparar siguiente revolución.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota final mejorada */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-400/30">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600/30 rounded-full p-3 flex-shrink-0">
              <span className="text-3xl">💡</span>
            </div>
            <div>
              <h4 className="text-purple-100 font-bold text-lg mb-2">
                Nota Importante
              </h4>
              <p className="text-purple-200 text-sm md:text-base leading-relaxed">
                Estos <strong>momentos clave</strong> se activan automáticamente cuando el Sol transita
                las posiciones críticas respecto a tu Solar Return. Úsalos para <strong>evaluar tu progreso anual</strong> y
                ajustar tu rumbo con consciencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
