'use client';

import React, { useMemo } from 'react';
import { useStyle } from '@/context/StyleContext';
import { FooterLibro } from './MesCompleto';
import { Star, Sun, AlertTriangle } from 'lucide-react';
import ChartWheel from '@/components/astrology/ChartWheel';
import { Planet, House } from '@/types/astrology/chartDisplay';
import { calculateAspects, convertAstrologicalDegreeToPosition } from '@/services/chartCalculationsService';

interface ChartPageProps {
  chartType: 'natal' | 'solar-return';
  planets: Planet[];
  houses: House[];
  title?: string;
  subtitle?: string;
  pagina?: number;
  isFallback?: boolean;
}

/**
 * Página del libro que muestra una carta astral completa (natal o solar return)
 * con planetas, casas y aspectos calculados, optimizado para impresión.
 */
export const ChartPage: React.FC<ChartPageProps> = ({
  chartType,
  planets,
  houses,
  title,
  subtitle,
  pagina = 0,
  isFallback = false
}) => {
  const { config } = useStyle();

  const isNatal = chartType === 'natal';
  const defaultTitle = isNatal ? 'Tu Carta Natal' : 'Tu Carta de Retorno Solar';
  const defaultSubtitle = isNatal
    ? 'El mapa de tu cielo en el momento exacto de tu nacimiento'
    : 'La configuración celeste de tu nuevo año solar';

  // No-op handlers para el ChartWheel (modo estático para print)
  const noop = () => {};
  const noopStr = (_s: string | null) => {};
  const noopNum = (_n: number | null) => {};

  // Preparar planetas con position (grados absolutos 0-360) para ChartWheel
  const planetsWithPosition = useMemo(() => {
    return planets.map(p => ({
      ...p,
      position: p.position ?? (p.longitude != null ? p.longitude : convertAstrologicalDegreeToPosition(p.degree, p.sign))
    }));
  }, [planets]);

  // Calcular aspectos completos con config (color, difficulty) desde las posiciones
  const calculatedAspects = useMemo(() => {
    return calculateAspects(planetsWithPosition);
  }, [planetsWithPosition]);

  return (
    <div className={`print-page flex flex-col relative ${config.pattern}`} style={{ padding: '6mm 4mm' }}>
      {/* Header */}
      <div className="text-center mb-2 pb-1.5 border-b-2 border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-1">
          {isNatal ? (
            <Star className={`w-5 h-5 ${config.iconPrimary}`} />
          ) : (
            <Sun className={`w-5 h-5 ${config.iconAccent}`} />
          )}
          <h2 className={`text-xl font-display ${config.titleGradient}`}>
            {title || defaultTitle}
          </h2>
        </div>
        <p className={`text-[10px] italic ${config.iconSecondary}`}>
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {/* Aviso fallback */}
      {isFallback && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-1.5 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <p className="text-[8px] text-amber-700">
            Carta provisional — regenera tu Retorno Solar desde la web para obtener datos reales.
          </p>
        </div>
      )}

      {/* Chart - Más grande para mejor legibilidad */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-full mx-auto px-2">
          <ChartWheel
            planets={planetsWithPosition}
            houses={houses}
            calculatedAspects={calculatedAspects}
            showAspects={true}
            selectedAspectTypes={{ major: true, minor: false, hard: true, easy: true }}
            hoveredAspect={null}
            setHoveredAspect={noopStr}
            hoveredPlanet={null}
            setHoveredPlanet={noopStr}
            hoveredHouse={null}
            setHoveredHouse={noopNum}
            handleMouseMove={noop as any}
            isPrint={true}
          />
        </div>
      </div>

      {/* Leyenda compacta */}
      <div className="mt-2">
        <div className="grid grid-cols-3 gap-1 text-[8px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-6 h-px bg-red-400" /> Aspectos tensos
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-px bg-blue-400" /> Aspectos armónicos
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white border border-gray-300" /> Planetas
          </div>
        </div>
      </div>

      <FooterLibro pagina={pagina} />
    </div>
  );
};

/**
 * Página simplificada que muestra placeholder cuando no hay datos de chart disponibles.
 * Incluye instrucciones para consultar el chart online.
 */
export const ChartPlaceholderPage: React.FC<{
  chartType: 'natal' | 'solar-return';
  pagina?: number;
}> = ({ chartType, pagina = 0 }) => {
  const { config } = useStyle();
  const isNatal = chartType === 'natal';

  return (
    <div className={`print-page flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="text-center mb-8">
        {isNatal ? (
          <Star className={`w-10 h-10 mx-auto ${config.iconPrimary} mb-4`} />
        ) : (
          <Sun className={`w-10 h-10 mx-auto ${config.iconAccent} mb-4`} />
        )}
        <h2 className={`text-2xl font-display ${config.titleGradient}`}>
          {isNatal ? 'Tu Carta Natal' : 'Tu Carta de Retorno Solar'}
        </h2>
        <div className={`${config.divider} w-16 mx-auto mt-4`} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <div className={`${config.highlightSecondary} rounded-lg p-6 mb-6`}>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {isNatal
              ? 'Tu carta natal es el mapa de tu cielo interior. Puedes consultarla y descargarla en cualquier momento desde la aplicación web.'
              : 'Tu carta de Retorno Solar muestra la configuración del cielo en tu próximo cumpleaños. Consúltala online para ver todos los detalles interactivos.'}
          </p>
          <p className={`text-xs ${config.iconSecondary} italic`}>
            Visita <strong>tuvueltaalsol.es</strong> →{' '}
            {isNatal ? 'Carta Natal' : 'Retorno Solar'}
          </p>
        </div>

        {/* Espacio para pegar/dibujar la carta */}
        <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
          <p className="text-gray-400 text-xs text-center px-4">
            Espacio para pegar tu carta
          </p>
        </div>
      </div>

      <FooterLibro pagina={pagina} />
    </div>
  );
};

export default ChartPage;
