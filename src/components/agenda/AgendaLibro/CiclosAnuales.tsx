import React from 'react';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Calendar, TrendingUp, Star, Sparkles, PenLine } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ LÍNEA DE TIEMPO EMOCIONAL - CON ESTILOS ============
interface LineaTiempoData {
  mes: string;
  intensidad: number; // 1-5 o 1-10
  palabra_clave: string;
  descripcion?: string;
  accion_clave?: string;
}

export const LineaTiempoEmocional: React.FC<{
  startDate: Date;
  endDate: Date;
  lineaTiempoData?: LineaTiempoData[];
  lineaTiempoAnual?: any[]; // Fallback: linea_tiempo_anual del SR
}> = ({ startDate, endDate, lineaTiempoData, lineaTiempoAnual }) => {
  const { config } = useStyle();

  const months: Date[] = [];
  let currentMonth = new Date(startDate);

  // Generar 13 meses (ciclo solar completo: del cumpleaños al siguiente cumpleaños)
  while (months.length < 13) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }

  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Buscar datos por mes (acepta lineaTiempoData directo o lineaTiempoAnual como fallback)
  const getMonthData = (monthIndex: number): LineaTiempoData | undefined => {
    // Primero intentar lineaTiempoData (formato {mes, intensidad, palabra_clave})
    if (lineaTiempoData && lineaTiempoData.length > 0) {
      // Buscar por nombre del mes
      const mesName = monthNames[months[monthIndex]?.getMonth() || 0];
      const found = lineaTiempoData.find((m: any) =>
        m.mes?.toLowerCase().includes(mesName)
      );
      if (found) return found;
      // Fallback por índice
      if (lineaTiempoData[monthIndex]) return lineaTiempoData[monthIndex];
    }

    // Fallback: lineaTiempoAnual (formato {periodo, descripcion, accion_clave})
    if (lineaTiempoAnual && lineaTiempoAnual.length > 0) {
      const mesName = monthNames[months[monthIndex]?.getMonth() || 0];
      const found = lineaTiempoAnual.find((m: any) =>
        m.periodo?.toLowerCase().includes(mesName) ||
        m.mes?.toLowerCase()?.includes(mesName)
      );
      if (found) {
        return {
          mes: found.periodo || found.mes || '',
          intensidad: found.intensidad || 5,
          palabra_clave: found.palabra_clave || found.accion_clave || found.descripcion?.substring(0, 30) || '',
          descripcion: found.descripcion,
          accion_clave: found.accion_clave
        };
      }
    }

    return undefined;
  };

  const tieneAlgunDato = (lineaTiempoData && lineaTiempoData.length > 0) || (lineaTiempoAnual && lineaTiempoAnual.length > 0);

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
          No todos los meses piden lo mismo: algunos son de <strong>ajuste</strong> (bajar el ritmo,
          reorganizarse), otros son de <strong>activación</strong> (movimiento, decisiones, expansión).
        </p>
        <p className="text-gray-700 leading-relaxed text-sm">
          {tieneAlgunDato
            ? <>A continuación, la línea emocional que tu Retorno Solar anticipa para cada mes.
               Cuando dice <em>"se activa la coherencia"</em> o <em>"movimiento"</em>, significa que ese mes
               la energía te empuja a actuar desde esa cualidad. <strong>Observa los patrones y toma nota.</strong></>
            : <><strong>Instrucciones:</strong> Marca en cada mes la intensidad emocional/energética que sientes (rellena las casillas) y escribe una palabra clave en el espacio de notas.</>
          }
        </p>
      </div>

      {/* Grid de meses - 13 meses del ciclo solar */}
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
              {/* Espacio para notas - Mostrar palabra clave y descripción si existen */}
              <div className="flex-1 min-h-[30px] flex flex-col items-center justify-center">
                {palabraClave ? (
                  <span className={`text-[10px] ${config.iconPrimary} font-medium italic text-center leading-tight`}>
                    {palabraClave.length > 40 ? palabraClave.substring(0, 40) + '...' : palabraClave}
                  </span>
                ) : (
                  <div className="w-full border-b border-dashed border-gray-300" />
                )}
                {monthData?.descripcion && (
                  <span className="text-[8px] text-gray-600 mt-0.5 text-center leading-tight">
                    {monthData.descripcion.length > 50 ? monthData.descripcion.substring(0, 50) + '...' : monthData.descripcion}
                  </span>
                )}
                {monthData?.accion_clave && (
                  <span className="text-[9px] text-gray-500 mt-0.5 text-center leading-tight font-medium">
                    {monthData.accion_clave.length > 30 ? monthData.accion_clave.substring(0, 30) + '...' : monthData.accion_clave}
                  </span>
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

      <FooterLibro pagina={22} />
    </div>
  );
};

// ============ MESES CLAVE Y PUNTOS DE GIRO - CON ESTILOS ============
interface MesesClavePuntosGiroProps {
  lineaTiempo?: any[];
  sombrasDelAno?: string[];
}

export const MesesClavePuntosGiro: React.FC<MesesClavePuntosGiroProps> = ({ lineaTiempo, sombrasDelAno }) => {
  const { config } = useStyle();

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
          lineaTiempo.slice(0, 6).map((evento, idx) => (
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

      {/* Sombras y desafíos si existen */}
      {sombrasDelAno && sombrasDelAno.length > 0 && (
        <div className={`${config.highlightAccent} rounded-lg p-4 mb-3`}>
          <h4 className={`${config.iconAccent} font-medium text-sm mb-2`}>
            Sombras y desafíos del año
          </h4>
          <div className="space-y-1">
            {sombrasDelAno.slice(0, 4).map((sombra, idx) => (
              <p key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className={config.iconSecondary}>☽</span>
                <span>{sombra}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Espacio para reflexión personal */}
      <div className={`${config.highlightSecondary} rounded-lg p-4 mb-3`}>
        <h4 className={`${config.iconSecondary} font-medium text-sm mb-3`}>
          ¿Qué mes del año sientes que será especialmente importante para ti?
        </h4>
        <div className="space-y-2">
          <div className={`h-10 border-b border-dashed ${config.iconSecondary} opacity-30`} />
          <div className={`h-10 border-b border-dashed ${config.iconSecondary} opacity-30`} />
        </div>
      </div>

      <div className={`${config.highlightPrimary} rounded-lg p-4`}>
        <h4 className={`${config.iconPrimary} font-medium text-sm mb-3 flex items-center gap-2`}>
          <Calendar className="w-4 h-4" /> ¿Cómo quieres prepararte para estos puntos de giro?
        </h4>
        <div className="space-y-2">
          <div className={`h-10 border-b border-dashed ${config.iconPrimary} opacity-30`} />
          <div className={`h-10 border-b border-dashed ${config.iconPrimary} opacity-30`} />
        </div>
      </div>

      <FooterLibro pagina={23} />
    </div>
  );
};

// ============ GRANDES APRENDIZAJES - CON ESTILOS ============
interface GrandesAprendizajesProps {
  clavesIntegracion?: string[];
  sombrasDelAno?: string[];
  fraseGuia?: string;
}

export const GrandesAprendizajes: React.FC<GrandesAprendizajesProps> = ({ clavesIntegracion, sombrasDelAno, fraseGuia }) => {
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
      <div className="space-y-2 mb-4">
        {tieneContenidoPersonalizado ? (
          clavesIntegracion.slice(0, 6).map((clave, idx) => (
            <div key={idx} className={`${idx % 3 === 0 ? config.highlightPrimary : idx % 3 === 1 ? config.highlightSecondary : config.highlightAccent} rounded-lg p-3`}>
              <div className="flex items-start gap-3">
                <span className={`${config.iconPrimary} text-base font-bold`}>{idx + 1}.</span>
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

      {/* Sombras como aprendizajes si existen */}
      {sombrasDelAno && sombrasDelAno.length > 0 && (
        <div className={`${config.highlightAccent} rounded-lg p-3 mb-4`}>
          <h4 className={`${config.iconAccent} font-medium text-sm mb-2`}>Lo que este año viene a desafiar:</h4>
          <div className="space-y-1">
            {sombrasDelAno.slice(0, 3).map((sombra, idx) => (
              <p key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className={config.iconSecondary}>☽</span>
                <span>{sombra}</span>
              </p>
            ))}
          </div>
        </div>
      )}

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
        <h4 className={`${config.iconPrimary} font-medium text-sm mb-3 flex items-center gap-2`}>
          <Sparkles className="w-4 h-4" /> ¿Qué acción concreta puedes hacer esta semana para integrar uno de estos aprendizajes?
        </h4>
        <div className="space-y-2">
          <div className={`h-12 border-b border-dashed ${config.iconPrimary} opacity-30`} />
          <div className={`h-12 border-b border-dashed ${config.iconPrimary} opacity-30`} />
        </div>
      </div>

      {/* Cita o frase guía personalizada */}
      <div className={`${config.headerBg} rounded-lg p-3 text-center mt-4`}>
        <p className={`${config.headerText} text-xs italic`}>
          "{fraseGuia || 'No viniste a sobrevivir el año. Viniste a transformarte.'}"
        </p>
      </div>

      <FooterLibro pagina={24} />
    </div>
  );
};

// ============ EJERCICIO EMOCIONAL MENSUAL ============
// Basado en la energía del mes (ajuste o activación)

interface EjercicioMensual {
  tipo: 'ajuste' | 'activacion';
  ejercicio: string;
  instruccion: string;
}

const EJERCICIOS_AJUSTE: EjercicioMensual[] = [
  { tipo: 'ajuste', ejercicio: 'Escaneo corporal', instruccion: 'Cierra los ojos. Recorre tu cuerpo de pies a cabeza. ¿Dónde hay tensión? Respira hacia ese lugar.' },
  { tipo: 'ajuste', ejercicio: 'Escritura libre', instruccion: 'Escribe sin parar durante 5 minutos. No juzgues. Solo deja salir lo que necesita salir.' },
  { tipo: 'ajuste', ejercicio: 'Respiración 4-7-8', instruccion: 'Inhala 4 segundos, retén 7, exhala 8. Repite 4 veces. Siente cómo se calma tu sistema nervioso.' },
  { tipo: 'ajuste', ejercicio: 'Grounding', instruccion: 'Pon los pies descalzos en el suelo. Nombra 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.' },
  { tipo: 'ajuste', ejercicio: 'Diálogo interno', instruccion: '¿Qué me estoy diciendo que no es verdad? Escribe el pensamiento negativo y escribe una respuesta compasiva.' },
  { tipo: 'ajuste', ejercicio: 'Silencio activo', instruccion: '10 minutos sin estímulos. Sin móvil, sin música. Solo tú y tu respiración. Observa qué surge.' },
];

const EJERCICIOS_ACTIVACION: EjercicioMensual[] = [
  { tipo: 'activacion', ejercicio: 'Carta al futuro', instruccion: 'Escribe una carta a tu yo de dentro de 6 meses. ¿Qué quieres contarle? ¿Qué quieres que sepa?' },
  { tipo: 'activacion', ejercicio: 'Lista de poder', instruccion: 'Escribe 10 cosas que ya has logrado en tu vida. Grandes o pequeñas. Léelas en voz alta.' },
  { tipo: 'activacion', ejercicio: 'Visualización activa', instruccion: 'Cierra los ojos y visualiza tu mejor versión. ¿Cómo camina? ¿Cómo habla? ¿Qué decisiones toma?' },
  { tipo: 'activacion', ejercicio: 'Mapa de deseos', instruccion: 'Dibuja o escribe 5 cosas que deseas crear este mes. No te limites. Sueña en grande.' },
  { tipo: 'activacion', ejercicio: 'Acción valiente', instruccion: 'Escribe una cosa que llevas posponiendo. ¿Cuál es el primer paso más pequeño? Hazlo hoy.' },
  { tipo: 'activacion', ejercicio: 'Gratitud expansiva', instruccion: 'Escribe 3 cosas que agradeces HOY. Luego escribe 3 cosas que agradecerás el próximo mes.' },
];

const getEjercicioForMonth = (mesNumero: number, intensidad: number): EjercicioMensual => {
  const esActivacion = intensidad >= 6;
  const lista = esActivacion ? EJERCICIOS_ACTIVACION : EJERCICIOS_AJUSTE;
  return lista[(mesNumero - 1) % lista.length];
};

interface EjercicioEmocionalMensualProps {
  startDate: Date;
  endDate: Date;
  lineaTiempoData?: LineaTiempoData[];
  lineaTiempoAnual?: any[];
}

export const EjercicioEmocionalMensual: React.FC<EjercicioEmocionalMensualProps> = ({
  startDate,
  endDate,
  lineaTiempoData,
  lineaTiempoAnual
}) => {
  const { config } = useStyle();

  const months: Date[] = [];
  let currentMonth = new Date(startDate);
  while (currentMonth <= endDate && months.length < 12) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }

  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const getMonthIntensity = (monthIndex: number): number => {
    const mesName = monthNames[months[monthIndex]?.getMonth() || 0];

    if (lineaTiempoData && lineaTiempoData.length > 0) {
      const found = lineaTiempoData.find((m: any) => m.mes?.toLowerCase().includes(mesName));
      if (found) return found.intensidad || 5;
      if (lineaTiempoData[monthIndex]) return lineaTiempoData[monthIndex].intensidad || 5;
    }

    if (lineaTiempoAnual && lineaTiempoAnual.length > 0) {
      const found = lineaTiempoAnual.find((m: any) =>
        m.periodo?.toLowerCase().includes(mesName) || m.mes?.toLowerCase()?.includes(mesName)
      );
      if (found) return found.intensidad || 5;
    }

    return 5;
  };

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PenLine className={`w-5 h-5 ${config.iconSecondary}`} />
          <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>Trabajo Emocional</span>
        </div>
        <h2 className={`text-2xl font-display ${config.titleGradient}`}>
          Ejercicios para cada mes
        </h2>
        <div className={`${config.divider} w-16 mx-auto mt-3`} />
        <p className={`text-xs italic ${config.iconSecondary} mt-2`}>
          Según la energía de cada mes, un ejercicio de ajuste (calma) o activación (expansión)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {months.map((month, index) => {
          const intensidad = getMonthIntensity(index);
          const ejercicio = getEjercicioForMonth(index + 1, intensidad);
          const esActivacion = ejercicio.tipo === 'activacion';
          const mesNombre = format(month, 'MMM', { locale: es });

          return (
            <div
              key={index}
              className={`${esActivacion ? config.highlightPrimary : config.highlightSecondary} rounded-lg p-2`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className={`text-[10px] font-bold uppercase ${esActivacion ? config.iconPrimary : config.iconSecondary}`}>
                  {mesNombre}
                </span>
                <span className={`text-[9px] px-1 rounded ${esActivacion ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {esActivacion ? 'Activación' : 'Ajuste'}
                </span>
              </div>
              <p className={`text-[10px] font-medium ${esActivacion ? config.iconPrimary : config.iconSecondary} mb-1`}>
                {ejercicio.ejercicio}
              </p>
              <p className="text-[9px] text-gray-600 leading-tight">
                {ejercicio.instruccion.length > 80 ? ejercicio.instruccion.substring(0, 80) + '...' : ejercicio.instruccion}
              </p>
            </div>
          );
        })}
      </div>

      <div className={`${config.highlightAccent} rounded-lg p-3 mt-3`}>
        <div className="flex items-center gap-2 mb-1">
          <PenLine className={`w-3 h-3 ${config.iconAccent}`} />
          <span className={`text-xs font-bold ${config.iconAccent}`}>¿Cuál de estos ejercicios te llama más?</span>
        </div>
        <div className="space-y-3">
          <div className="h-8 border-b border-dashed border-gray-300" />
          <div className="h-8 border-b border-dashed border-gray-300" />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

// ============ EJERCICIO INLINE PARA CADA MES ============
// Se incluye en cada mes del libro con el ejercicio específico

interface EjercicioDelMesProps {
  mesNumero: number;
  monthDate: Date;
  intensidad?: number;
}

export const EjercicioDelMes: React.FC<EjercicioDelMesProps> = ({
  mesNumero,
  monthDate,
  intensidad = 5
}) => {
  const { config } = useStyle();
  const ejercicio = getEjercicioForMonth(mesNumero, intensidad);
  const esActivacion = ejercicio.tipo === 'activacion';

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '20mm' }}>
      <div className="text-center mb-6">
        <span className={`text-xs uppercase tracking-[0.3em] ${config.iconSecondary}`}>
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </span>
        <h2 className={`text-2xl font-display ${config.titleGradient} mt-2`}>
          Ejercicio del Mes
        </h2>
        <div className={`${config.divider} w-16 mx-auto mt-3`} />
        <span className={`inline-block mt-2 text-[10px] px-3 py-1 rounded-full ${esActivacion ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
          {esActivacion ? 'Mes de Activación' : 'Mes de Ajuste'}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`${esActivacion ? config.highlightPrimary : config.highlightSecondary} rounded-lg p-6 mb-6`}>
          <div className="flex items-center gap-3 mb-4">
            <PenLine className={`w-5 h-5 ${esActivacion ? config.iconPrimary : config.iconSecondary}`} />
            <h3 className={`text-lg font-display ${esActivacion ? config.iconPrimary : config.iconSecondary}`}>
              {ejercicio.ejercicio}
            </h3>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {ejercicio.instruccion}
          </p>
        </div>

        <div className={`${config.highlightAccent} rounded-lg p-5 mb-4`}>
          <h4 className={`text-sm font-bold uppercase ${config.iconAccent} mb-3 flex items-center gap-2`}>
            <PenLine className="w-4 h-4" />
            Mi experiencia con este ejercicio
          </h4>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 border-b border-dashed border-gray-300" />
            ))}
          </div>
        </div>

        <div className={`${esActivacion ? config.highlightPrimary : config.highlightSecondary} rounded-lg p-4`}>
          <h4 className={`text-sm font-medium ${esActivacion ? config.iconPrimary : config.iconSecondary} mb-2`}>
            {esActivacion
              ? '¿Qué se activó en mí? ¿Qué estoy lista para crear?'
              : '¿Qué necesito soltar? ¿Dónde puedo bajar el ritmo?'}
          </h4>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 border-b border-dashed border-gray-300" />
            ))}
          </div>
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

export default LineaTiempoEmocional;
