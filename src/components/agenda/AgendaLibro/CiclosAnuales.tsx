import React from 'react';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Calendar, TrendingUp, Star } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ LÍNEA DE TIEMPO EMOCIONAL - CON ESTILOS ============
interface LineaTiempoData {
  mes: string;
  intensidad: number; // 1-5
  palabra_clave: string;
}

export const LineaTiempoEmocional: React.FC<{
  startDate: Date;
  endDate: Date;
  lineaTiempoData?: LineaTiempoData[];
}> = ({ startDate, endDate, lineaTiempoData }) => {
  const { config } = useStyle();

  // 🔍 DEBUG: Verificar datos recibidos
  console.log('🔍 [LineaTiempoEmocional] Props recibidas:', {
    lineaTiempoData,
    length: lineaTiempoData?.length,
    sample: lineaTiempoData?.[0]
  });

  const months = [];
  let currentMonth = new Date(startDate);

  while (currentMonth <= endDate && months.length < 12) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }

  // Si hay datos personalizados, usarlos
  const getMonthData = (monthIndex: number): LineaTiempoData | undefined => {
    if (!lineaTiempoData || lineaTiempoData.length === 0) return undefined;
    return lineaTiempoData[monthIndex];
  };

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className={`w-5 h-5 ${config.iconSecondary}`} />
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Calendario Astrológico</span>
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Línea del Tiempo Emocional</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      {/* Introducción terapéutica */}
      <div className={`${config.highlightPrimary} rounded-lg p-4 mb-4`}>
        <p className="text-gray-700 leading-relaxed text-sm mb-2">
          Tu año tiene ritmo, altibajos, momentos de calma y momentos de intensidad.
        </p>
        <p className="text-gray-700 leading-relaxed text-sm">
          <strong>Instrucciones:</strong> Marca en cada mes la intensidad emocional/energética que sientes
          (rellena las casillas) y escribe una palabra clave en el espacio de notas.
        </p>
      </div>

      {/* Grid de meses */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {months.map((month, index) => {
          const monthData = getMonthData(index);
          const intensidad = monthData?.intensidad || 0;
          const palabraClave = monthData?.palabra_clave || '';

          return (
            <div
              key={index}
              className={`${config.highlightSecondary} p-2 rounded-lg flex flex-col`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`${config.iconPrimary} font-medium text-xs capitalize`}>
                  {format(month, "MMM", { locale: es })}
                </span>
                <span className="text-[10px] text-gray-400">{format(month, "yy")}</span>
              </div>
              {/* Espacio para marcar intensidad - PRE-RELLENADO si hay datos */}
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => {
                  const isFilled = i <= intensidad;
                  const fillClass = isFilled
                    ? i <= 2 ? config.highlightSecondary : i <= 3 ? config.badgeSecondary : config.badgePrimary
                    : '';
                  return (
                    <div
                      key={i}
                      className={`w-3 h-3 border ${config.cardBorder} ${isFilled ? fillClass : 'bg-white'} rounded-sm`}
                    />
                  );
                })}
              </div>
              {/* Espacio para notas - Mostrar palabra clave si existe */}
              <div className="flex-1 min-h-[30px] flex items-center justify-center">
                {palabraClave ? (
                  <span className={`text-[10px] ${config.iconPrimary} font-medium italic`}>
                    {palabraClave}
                  </span>
                ) : (
                  <div className="w-full border-b border-dashed border-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className={`${config.highlightSecondary} rounded-lg p-3 mb-3`}>
        <h4 className={`${config.iconSecondary} font-medium text-xs mb-2`}>Leyenda de intensidad:</h4>
        <div className="flex items-center justify-around text-[10px]">
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 ${config.highlightSecondary} border ${config.cardBorder} rounded-sm`} />
            <span className="text-gray-600">Calma</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 ${config.badgeSecondary} rounded-sm`} />
            <span className="text-gray-600">Movimiento</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 ${config.badgePrimary} rounded-sm`} />
            <span className="text-gray-600">Intensidad</span>
          </div>
        </div>
      </div>

      {/* Reflexión adicional */}
      <div className={`${config.highlightPrimary} rounded-lg p-3`}>
        <h4 className={`${config.iconPrimary} font-medium text-xs mb-2`}>
          ✍️ Después de completar la línea de tiempo, ¿qué patrón observas?
        </h4>
        <div className="space-y-2">
          <div className={`h-8 border-b border-dashed ${config.iconPrimary} opacity-30`} />
          <div className={`h-8 border-b border-dashed ${config.iconPrimary} opacity-30`} />
        </div>
      </div>

      <FooterLibro pagina={16} />
    </div>
  );
};

// ============ MESES CLAVE Y PUNTOS DE GIRO - CON ESTILOS ============
interface MesesClavePuntosGiroProps {
  lineaTiempo?: any[];
}

export const MesesClavePuntosGiro: React.FC<MesesClavePuntosGiroProps> = ({ lineaTiempo }) => {
  const { config } = useStyle();

  // 🔍 DEBUG: Verificar datos recibidos
  console.log('🔍 [MesesClavePuntosGiro] Props recibidas:', {
    lineaTiempo,
    length: lineaTiempo?.length,
    sample: lineaTiempo?.[0]
  });

  const tieneContenidoPersonalizado = !!(lineaTiempo && lineaTiempo.length > 0);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className={`w-5 h-5 ${config.iconSecondary}`} />
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Meses Clave y Puntos de Giro</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      {/* Introducción terapéutica */}
      {tieneContenidoPersonalizado && (
        <div className={`${config.highlightPrimary} rounded-lg p-4 mb-4`}>
          <p className="text-gray-700 leading-relaxed text-sm">
            Tu año no es lineal. Hay <strong>momentos clave</strong> donde la energía se concentra,
            donde las cosas se mueven o culminan. Estos son los puntos de giro que tu Solar Return anticipa.
          </p>
        </div>
      )}

      {!tieneContenidoPersonalizado && (
        <p className={`text-sm italic ${config.iconSecondary} text-center mb-5`}>
          Los momentos del año donde algo importante se mueve, cambia o culmina.
        </p>
      )}

      {/* Grid de puntos de giro */}
      <div className="space-y-3 mb-5">
        {tieneContenidoPersonalizado ? (
          lineaTiempo.slice(0, 4).map((evento, idx) => (
            <div key={idx} className={`${config.highlightSecondary} rounded-lg p-3`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`${config.iconPrimary} text-lg font-bold`}>{idx + 1}.</span>
                <h4 className={`${config.iconPrimary} font-medium flex-1 text-sm`}>
                  {evento.mes || evento.periodo || evento.titulo || `Evento ${idx + 1}`}
                </h4>
              </div>
              <div className="text-xs mb-2">
                {(evento.evento_astrologico || evento.evento) && (
                  <div className="mb-2">
                    <span className={`${config.iconSecondary} uppercase`}>Evento astrológico:</span>
                    <p className="text-gray-700 mt-1">{evento.evento_astrologico || evento.evento}</p>
                  </div>
                )}
                {(evento.significado_para_ti || evento.significado) && (
                  <div>
                    <span className={`${config.iconSecondary} uppercase`}>Qué significa para ti:</span>
                    <p className="text-gray-700 mt-1">{evento.significado_para_ti || evento.significado}</p>
                  </div>
                )}
                {evento.descripcion && !evento.significado && !evento.significado_para_ti && (
                  <p className="text-gray-700">{evento.descripcion}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          [1, 2, 3].map((num) => (
            <div key={num} className={`${config.highlightSecondary} rounded-lg p-3`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`${config.iconPrimary} text-lg font-bold`}>{num}.</span>
                <div className="flex-1 border-b-2 border-dashed border-gray-300 h-6" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                <div>
                  <span className={`${config.iconSecondary} uppercase`}>Mes:</span>
                  <div className="h-6 border-b border-dashed border-gray-300 mt-1" />
                </div>
                <div>
                  <span className={`${config.iconSecondary} uppercase`}>Evento astrológico:</span>
                  <div className="h-6 border-b border-dashed border-gray-300 mt-1" />
                </div>
              </div>
              <div>
                <span className={`${config.iconSecondary} uppercase`}>Qué significa para ti:</span>
                <div className="h-10 border-b border-dashed border-gray-300 mt-1" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Espacio para reflexión personal */}
      <div className={`${config.highlightSecondary} rounded-lg p-4 mb-3`}>
        <h4 className={`${config.iconSecondary} font-medium text-sm mb-3`}>
          ✍️ ¿Qué mes del año sientes que será especialmente importante para ti?
        </h4>
        <div className="space-y-2">
          <div className={`h-10 border-b border-dashed ${config.iconSecondary} opacity-30`} />
          <div className={`h-10 border-b border-dashed ${config.iconSecondary} opacity-30`} />
        </div>
      </div>

      <div className={`${config.highlightPrimary} rounded-lg p-4`}>
        <h4 className={`${config.iconPrimary} font-medium text-sm mb-3`}>
          📅 ¿Cómo quieres prepararte para estos puntos de giro?
        </h4>
        <div className="space-y-2">
          <div className={`h-10 border-b border-dashed ${config.iconPrimary} opacity-30`} />
          <div className={`h-10 border-b border-dashed ${config.iconPrimary} opacity-30`} />
        </div>
      </div>

      <FooterLibro pagina={17} />
    </div>
  );
};

// ============ GRANDES APRENDIZAJES - CON ESTILOS ============
interface GrandesAprendizajesProps {
  clavesIntegracion?: string[];
}

export const GrandesAprendizajes: React.FC<GrandesAprendizajesProps> = ({ clavesIntegracion }) => {
  const { config } = useStyle();
  const tieneContenidoPersonalizado = !!(clavesIntegracion && clavesIntegracion.length > 0);

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className={`w-5 h-5 ${config.iconSecondary}`} />
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Grandes Aprendizajes del Ciclo</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      {/* Introducción terapéutica */}
      {tieneContenidoPersonalizado && (
        <div className={`${config.highlightPrimary} rounded-lg p-4 mb-5`}>
          <p className="text-gray-700 leading-relaxed text-sm">
            Estas son las <strong>claves de integración</strong> que tu Solar Return revela para este año.
            No son solo ideas: son semillas que, si las riegas con atención, transforman tu experiencia.
          </p>
        </div>
      )}

      {!tieneContenidoPersonalizado && (
        <p className={`text-sm italic ${config.iconSecondary} text-center mb-6`}>
          Los temas que este año viene a enseñarte, basados en los tránsitos mayores.
        </p>
      )}

      {/* Aprendizajes del SR */}
      <div className="space-y-3 mb-6">
        {tieneContenidoPersonalizado ? (
          clavesIntegracion.slice(0, 4).map((clave, idx) => (
            <div key={idx} className={`${idx % 3 === 0 ? config.highlightPrimary : idx % 3 === 1 ? config.highlightSecondary : config.highlightAccent} rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <span className={`${config.iconPrimary} text-lg font-bold mt-1`}>✧</span>
                <p className="text-gray-700 leading-relaxed flex-1 text-sm">{clave}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className={`${config.highlightSecondary} rounded-lg p-4`}>
              <h4 className={`${config.iconSecondary} font-medium mb-3 flex items-center gap-2 text-sm`}>
                <span className="text-lg">♄</span> Saturno te enseña:
              </h4>
              <div className="h-16 border-b border-dashed border-gray-300" />
            </div>

            <div className={`${config.highlightPrimary} rounded-lg p-4`}>
              <h4 className={`${config.iconPrimary} font-medium mb-3 flex items-center gap-2 text-sm`}>
                <span className="text-lg">♃</span> Júpiter te expande:
              </h4>
              <div className="h-16 border-b border-dashed border-gray-300" />
            </div>
          </>
        )}
      </div>

      {/* Espacio para reflexión personal */}
      <div className={`${config.highlightSecondary} rounded-lg p-4 mb-4`}>
        <h4 className={`${config.iconSecondary} font-medium text-sm mb-3`}>
          ✍️ ¿Cuál de estos aprendizajes resuena más contigo ahora?
        </h4>
        <div className="space-y-2">
          <div className={`h-12 border-b border-dashed ${config.iconSecondary} opacity-30`} />
          <div className={`h-12 border-b border-dashed ${config.iconSecondary} opacity-30`} />
          <div className={`h-12 border-b border-dashed ${config.iconSecondary} opacity-30`} />
        </div>
      </div>

      <div className={`${config.highlightPrimary} rounded-lg p-4`}>
        <h4 className={`${config.iconPrimary} font-medium text-sm mb-3`}>
          ✨ ¿Qué acción concreta puedes hacer esta semana para integrar uno de estos aprendizajes?
        </h4>
        <div className="space-y-2">
          <div className={`h-12 border-b border-dashed ${config.iconPrimary} opacity-30`} />
          <div className={`h-12 border-b border-dashed ${config.iconPrimary} opacity-30`} />
        </div>
      </div>

      {/* Cita */}
      <div className={`${config.headerBg} rounded-lg p-3 text-center mt-4`}>
        <p className={`${config.headerText} text-xs italic`}>
          "No viniste a sobrevivir el año. Viniste a transformarte."
        </p>
      </div>

      <FooterLibro pagina={18} />
    </div>
  );
};

export default LineaTiempoEmocional;
