'use client';

import { useStyle } from '@/context/StyleContext';
import PageNumber from './PageNumber';

interface TuAnioTuViajeProps {
  userName: string;
  apertura?: {
    carta_de_bienvenida?: string;
    tema_central_del_año?: string;
    que_soltar?: string;
  };
  solarReturn?: {
    interpretation?: string;
    tema_anual?: string;
  };
  pageNumber?: number;
}

export default function TuAnioTuViaje({
  userName,
  apertura,
  solarReturn,
  pageNumber
}: TuAnioTuViajeProps) {
  const { config } = useStyle();
  const interpretacion = solarReturn?.interpretation;

  // Solo mostramos interpretación del retorno solar y reflexiones
  // (La carta de bienvenida y tema central ya están en componentes separados)

  return (
    <>
      {/* PREGUNTAS DE REFLEXIÓN PARA EL AÑO */}
      <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="text-cosmic-gold text-sm">✧</span>
              <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
                Reflexiones
              </span>
              <span className="text-cosmic-gold text-sm">✧</span>
            </div>
            <h2 className="font-display text-5xl text-cosmic-gold mb-4">
              Tu Año, Tu Viaje
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          </div>

          {/* Interpretación Retorno Solar si existe */}
          {interpretacion && (
            <div className="mb-12 bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/5 border-l-4 border-cosmic-gold rounded-r-lg p-8">
              <h3 className="font-display text-2xl text-cosmic-gold mb-4">
                Interpretación de Tu Retorno Solar
              </h3>
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {interpretacion}
              </p>
            </div>
          )}

          {/* Decoración */}
          <div className="flex items-center justify-center space-x-4 py-8">
            <span className="text-cosmic-gold text-2xl">✧</span>
            <span className="text-cosmic-gold text-2xl">☉</span>
            <span className="text-cosmic-gold text-2xl">✧</span>
          </div>

          {/* Reflexión guiada */}
          <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20">
            <h4 className="font-display text-xl text-cosmic-gold mb-4">
              Preguntas para Reflexionar
            </h4>
            <ul className="font-body text-base text-gray-700 leading-relaxed space-y-3">
              <li>¿Qué partes de mí están listas para florecer este año?</li>
              <li>¿Qué habilidades o talentos quiero desarrollar?</li>
              <li>¿Qué áreas de mi vida requieren más atención?</li>
              <li>¿Cómo puedo honrar los ciclos naturales en mi día a día?</li>
            </ul>
          </div>

          {/* Cita inspiradora */}
          <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-8">
            <p className="font-body text-lg text-gray-700 leading-relaxed italic text-center">
              "No estás aprendiendo astrología. Estás recordando el lenguaje
              que tu alma siempre ha hablado."
            </p>
          </div>
        </div>

        {/* Número de página */}
        {pageNumber && <PageNumber pageNumber={pageNumber} />}
      </div>
    </>
  );
}
