import React from 'react';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Calendar, TrendingUp, Star } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ LÍNEA DE TIEMPO EMOCIONAL - CON ESTILOS ============
export const LineaTiempoEmocional: React.FC<{
  startDate: Date;
  endDate: Date;
}> = ({ startDate, endDate }) => {
  const { config } = useStyle();
  const months = [];
  let currentMonth = new Date(startDate);

  while (currentMonth <= endDate && months.length < 12) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className={`w-5 h-5 ${config.iconSecondary}`} />
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Calendario Astrológico</span>
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Línea del Tiempo Emocional</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
      </div>

      <p className={`text-center text-sm italic ${config.iconSecondary} mb-6`}>
        Vista general de tu año: los momentos clave y los ciclos emocionales.
      </p>

      {/* Grid de meses */}
      <div className="flex-1 grid grid-cols-4 gap-3 mb-6">
        {months.map((month, index) => (
          <div
            key={index}
            className={`${config.highlightSecondary} p-3 rounded-lg flex flex-col`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${config.iconPrimary} font-medium text-sm capitalize`}>
                {format(month, "MMMM", { locale: es })}
              </span>
              <span className="text-xs text-gray-400">{format(month, "yyyy")}</span>
            </div>
            {/* Espacio para marcar intensidad */}
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-4 border ${config.cardBorder} bg-white rounded-sm`} />
              ))}
            </div>
            {/* Espacio para notas */}
            <div className="flex-1 border-b border-dashed border-gray-300 min-h-[40px]" />
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className={`${config.highlightPrimary} rounded-lg p-4`}>
        <h4 className={`${config.iconPrimary} font-medium text-sm mb-3`}>Leyenda de intensidad:</h4>
        <div className="flex items-center justify-around text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 ${config.highlightSecondary} rounded-sm`} />
            <span className="text-gray-600">Calma</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 ${config.badgeSecondary} rounded-sm`} />
            <span className="text-gray-600">Movimiento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 ${config.badgePrimary} rounded-sm`} />
            <span className="text-gray-600">Intensidad</span>
          </div>
        </div>
      </div>

      <FooterLibro pagina={11} />
    </div>
  );
};

// ============ MESES CLAVE Y PUNTOS DE GIRO - CON ESTILOS ============
export const MesesClavePuntosGiro: React.FC = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className={`w-5 h-5 ${config.iconSecondary}`} />
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Meses Clave y Puntos de Giro</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
        <p className={`text-sm italic ${config.iconSecondary} mt-4`}>
          Los momentos del año donde algo importante se mueve, cambia o culmina.
        </p>
      </div>

      {/* Grid de puntos de giro */}
      <div className="flex-1 space-y-4">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className={`${config.highlightSecondary} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`${config.iconPrimary} text-xl font-bold`}>{num}.</span>
              <div className="flex-1 border-b-2 border-dashed border-gray-300 h-6" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className={`${config.iconSecondary} text-xs uppercase`}>Mes:</span>
                <div className="h-6 border-b border-dashed border-gray-300 mt-1" />
              </div>
              <div>
                <span className={`${config.iconSecondary} text-xs uppercase`}>Evento astrológico:</span>
                <div className="h-6 border-b border-dashed border-gray-300 mt-1" />
              </div>
            </div>
            <div>
              <span className={`${config.iconSecondary} text-xs uppercase`}>Qué significa para ti:</span>
              <div className="h-12 border-b border-dashed border-gray-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <FooterLibro pagina={12} />
    </div>
  );
};

// ============ GRANDES APRENDIZAJES - CON ESTILOS ============
export const GrandesAprendizajes: React.FC = () => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className={`w-5 h-5 ${config.iconSecondary}`} />
        </div>
        <h2 className={`text-2xl ${config.titleGradient}`}>Grandes Aprendizajes del Ciclo</h2>
        <div className={`${config.divider} w-24 mx-auto mt-4`} />
        <p className={`text-sm italic ${config.iconSecondary} mt-4`}>
          Los temas que este año viene a enseñarte, basados en los tránsitos mayores.
        </p>
      </div>

      {/* Aprendizajes */}
      <div className="flex-1 space-y-5">
        <div className={`${config.highlightSecondary} rounded-lg p-5`}>
          <h4 className={`${config.iconSecondary} font-medium mb-3 flex items-center gap-2`}>
            <span className="text-lg">♄</span> Saturno te enseña:
          </h4>
          <div className="h-20 border-b border-dashed border-gray-300" />
        </div>

        <div className={`${config.highlightPrimary} rounded-lg p-5`}>
          <h4 className={`${config.iconPrimary} font-medium mb-3 flex items-center gap-2`}>
            <span className="text-lg">♃</span> Júpiter te expande:
          </h4>
          <div className="h-20 border-b border-dashed border-gray-300" />
        </div>

        <div className={`${config.highlightAccent} rounded-lg p-5`}>
          <h4 className={`${config.iconAccent} font-medium mb-3 flex items-center gap-2`}>
            <span className="text-lg">♇</span> Plutón transforma:
          </h4>
          <div className="h-20 border-b border-dashed border-gray-300" />
        </div>
      </div>

      {/* Cita */}
      <div className={`${config.headerBg} rounded-lg p-4 text-center mt-4`}>
        <p className={`${config.headerText} text-sm italic`}>
          "No viniste a sobrevivir el año. Viniste a transformarte."
        </p>
      </div>

      <FooterLibro pagina={13} />
    </div>
  );
};

export default LineaTiempoEmocional;
