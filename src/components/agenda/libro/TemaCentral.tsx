'use client';

import { useStyle } from '@/context/StyleContext';
import PageNumber from './PageNumber';

interface TemaCentralProps {
  userName: string;
  temaCentral?: string;
  queSoltar?: string;
  ritualInicio?: string;
  pageNumber?: number;
}

export default function TemaCentral({
  userName,
  temaCentral,
  queSoltar,
  ritualInicio,
  pageNumber
}: TemaCentralProps) {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Título de sección */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-cosmic-gold text-sm">✧</span>
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
            Tu Año Astrológico
          </span>
          <span className="text-cosmic-gold text-sm">✧</span>
        </div>
        <h2 className="font-display text-5xl text-cosmic-gold mb-4">
          El Tema de Tu Año
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full space-y-8">
        {/* Tema Central */}
        {temaCentral && (
          <div className="bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cosmic-gold text-2xl">☉</span>
              <h3 className="font-display text-2xl text-cosmic-gold">
                Tu Enfoque Principal
              </h3>
            </div>
            <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {temaCentral}
            </p>
          </div>
        )}

        {/* Qué Soltar */}
        {queSoltar && (
          <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cosmic-gold text-2xl">☽</span>
              <h3 className="font-display text-2xl text-cosmic-gold">
                Qué Soltar Este Año
              </h3>
            </div>
            <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {queSoltar}
            </p>
          </div>
        )}

        {/* Ritual de Inicio */}
        {ritualInicio && (
          <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cosmic-gold text-2xl">✦</span>
              <h3 className="font-display text-2xl text-cosmic-gold">
                Ritual de Inicio del Ciclo
              </h3>
            </div>
            <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {ritualInicio}
            </p>
          </div>
        )}

        {/* Mensaje por defecto si no hay contenido */}
        {!temaCentral && !queSoltar && !ritualInicio && (
          <div className="bg-cosmic-purple/5 border border-cosmic-gold/20 rounded-lg p-8 text-center">
            <p className="font-body text-lg text-gray-700 leading-relaxed italic">
              "Cada año solar trae consigo un tema único, una lección central que el universo
              te invita a explorar. Este es tu año para descubrir qué semilla plantarás
              y qué versión tuya está lista para nacer."
            </p>
          </div>
        )}
      </div>

      {/* Número de página */}
      {pageNumber && <PageNumber pageNumber={pageNumber} />}
    </div>
  );
}
