import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/contexts/StyleContext';
import { 
  Sun, Moon, Star, Sparkles, Circle, PenLine, 
  Flame, Target, Heart, Compass, ArrowRight,
  Calendar, BookOpen
} from 'lucide-react';

// ============ TIPOS ============
interface EventoDia {
  titulo: string;
  tipo: 'lunaLlena' | 'lunaNueva' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  descripcion?: string;
}

interface SemanaDetalladaProps {
  semanaNum: number;
  fechaInicio: Date;
  mesNombre: string;
  proposito: string;
  eventos?: { dia: number; evento: EventoDia }[];
  reflexionSemana?: string;
  ejercicioSemana?: {
    titulo: string;
    descripcion: string;
  };
  birthday?: Date;
}

// ============ ICONOS ============
const IconoEvento = ({ tipo, className = "w-4 h-4" }: { tipo: EventoDia['tipo']; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena':
      return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva':
      return <Moon className={className} />;
    case 'eclipse':
      return <Sparkles className={className} />;
    case 'cumpleanos':
      return <Sun className={className} />;
    case 'retrogrado':
      return <span className={`${className} font-bold`}>℞</span>;
    case 'ingreso':
      return <ArrowRight className={className} />;
    case 'especial':
      return <Star className={className} fill="currentColor" />;
    default:
      return <Circle className={className} />;
  }
};

const getEventoColor = (tipo: EventoDia['tipo']) => {
  switch (tipo) {
    case 'lunaLlena': return { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' };
    case 'lunaNueva': return { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-800' };
    case 'eclipse': return { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' };
    case 'cumpleanos': return { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800' };
    case 'retrogrado': return { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-800' };
    case 'ingreso': return { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-800' };
    case 'especial': return { bg: 'bg-fuchsia-100', border: 'border-fuchsia-400', text: 'text-fuchsia-800' };
    default: return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
  }
};

const diasSemanaCortos = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

// ============ COMPONENTE PRINCIPAL ============
export const SemanaDetallada: React.FC<SemanaDetalladaProps> = ({
  semanaNum,
  fechaInicio,
  mesNombre,
  proposito,
  eventos = [],
  reflexionSemana,
  ejercicioSemana,
  birthday,
}) => {
  const { config } = useStyle();
  const fechaFin = addDays(fechaInicio, 6);
  
  // Generar los 7 días
  const dias = Array.from({ length: 7 }, (_, i) => addDays(fechaInicio, i));
  
  // Buscar evento para un día específico
  const getEventoDelDia = (dayDate: Date) => {
    return eventos.find(e => e.dia === dayDate.getDate())?.evento;
  };
  
  // Verificar si es cumpleaños
  const esCumpleanos = (dayDate: Date) => {
    if (!birthday) return false;
    return dayDate.getDate() === birthday.getDate() && dayDate.getMonth() === birthday.getMonth();
  };

  // Formato de rango de fechas
  const rangoFechas = `${format(fechaInicio, 'd', { locale: es })}-${format(fechaFin, 'd MMMM', { locale: es })}`;

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 ${config.badgePrimary} px-3 py-1 rounded-full text-xs font-bold mb-2`}>
          <Calendar className="w-3 h-3" />
          {mesNombre.toUpperCase()}
        </div>
        <h1 className={`text-2xl font-display ${config.titleGradient}`}>
          Semana {semanaNum}: {rangoFechas}
        </h1>
        <p className={`text-sm ${config.iconSecondary} italic mt-1`}>{proposito}</p>
      </div>

      {/* Layout de 2 columnas */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Columna izquierda - Días */}
        <div className="space-y-1">
          {dias.map((dia, idx) => {
            const evento = getEventoDelDia(dia);
            const cumple = esCumpleanos(dia);
            const tipoEvento = cumple ? 'cumpleanos' : evento?.tipo;
            const colors = tipoEvento ? getEventoColor(tipoEvento) : null;
            
            return (
              <div
                key={idx}
                className={`
                  rounded-lg p-2 flex gap-2 items-start
                  ${colors ? `${colors.bg} ${colors.border} border-2` : config.highlightPrimary}
                `}
              >
                {/* Número del día */}
                <div className={`
                  w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0
                  ${colors ? colors.bg : 'bg-white/50'}
                `}>
                  <span className={`text-lg font-bold ${colors ? colors.text : 'text-gray-700'}`}>
                    {format(dia, 'd')}
                  </span>
                  <span className={`text-[9px] uppercase ${colors ? colors.text : 'text-gray-500'}`}>
                    {diasSemanaCortos[idx]}
                  </span>
                </div>
                
                {/* Contenido del día */}
                <div className="flex-1 min-w-0">
                  {cumple ? (
                    <div className="flex items-center gap-2">
                      <Sun className={`w-4 h-4 ${colors?.text}`} />
                      <span className={`text-sm font-bold ${colors?.text}`}>
                        🎂 TU RETORNO SOLAR
                      </span>
                    </div>
                  ) : evento ? (
                    <div className="flex items-center gap-2">
                      <IconoEvento tipo={evento.tipo} className={`w-4 h-4 ${colors?.text}`} />
                      <span className={`text-sm font-bold ${colors?.text}`}>
                        {evento.titulo}
                      </span>
                    </div>
                  ) : (
                    <div className="h-6 border-b border-dashed border-gray-200" />
                  )}
                  
                  {/* Línea para notas */}
                  <div className="h-5 border-b border-dashed border-gray-200 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna derecha - Eventos, reflexión, notas */}
        <div className="space-y-3 flex flex-col">
          {/* Eventos activos de la semana */}
          {eventos.length > 0 && (
            <div className={`${config.highlightSecondary} rounded-lg p-3`}>
              <h3 className={`text-xs font-bold uppercase tracking-wide ${config.iconSecondary} mb-2 flex items-center gap-1`}>
                <Sparkles className="w-3 h-3" />
                Eventos de la semana
              </h3>
              <div className="space-y-2">
                {eventos.map((e, idx) => {
                  const colors = getEventoColor(e.evento.tipo);
                  return (
                    <div key={idx} className={`p-2 rounded ${colors.bg} ${colors.border} border`}>
                      <div className="flex items-center gap-2">
                        <IconoEvento tipo={e.evento.tipo} className={`w-3 h-3 ${colors.text}`} />
                        <span className={`text-xs font-bold ${colors.text}`}>
                          {e.dia} - {e.evento.titulo}
                        </span>
                      </div>
                      {e.evento.descripcion && (
                        <p className={`text-[11px] ${colors.text} opacity-80 mt-1 pl-5 leading-tight`}>
                          {e.evento.descripcion}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reflexión de la semana */}
          {reflexionSemana && (
            <div className={`${config.highlightAccent} rounded-lg p-3`}>
              <h3 className={`text-xs font-bold uppercase tracking-wide ${config.iconAccent} mb-2 flex items-center gap-1`}>
                <Heart className="w-3 h-3" />
                Reflexión
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{reflexionSemana}"
              </p>
            </div>
          )}

          {/* Ejercicio de la semana */}
          {ejercicioSemana && (
            <div className={`${config.highlightPrimary} rounded-lg p-3`}>
              <h3 className={`text-xs font-bold uppercase tracking-wide ${config.iconPrimary} mb-2 flex items-center gap-1`}>
                <Target className="w-3 h-3" />
                {ejercicioSemana.titulo}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {ejercicioSemana.descripcion}
              </p>
            </div>
          )}

          {/* Espacio para notas - siempre visible */}
          <div className={`flex-1 ${config.cardBg} border border-dashed border-gray-200 rounded-lg p-3`}>
            <h3 className={`text-xs font-bold uppercase tracking-wide ${config.iconSecondary} mb-2 flex items-center gap-1`}>
              <PenLine className="w-3 h-3" />
              Notas y observaciones
            </h3>
            <div className="space-y-3">
              <div className="h-5 border-b border-dashed border-gray-200" />
              <div className="h-5 border-b border-dashed border-gray-200" />
              <div className="h-5 border-b border-dashed border-gray-200" />
              <div className="h-5 border-b border-dashed border-gray-200" />
              <div className="h-5 border-b border-dashed border-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ EJERCICIOS DE LA SEMANA (página separada) ============
interface EjerciciosSemanaProps {
  semanaNum: number;
  mesNombre: string;
  ejercicios: {
    titulo: string;
    instrucciones: string;
    espacio?: 'pequeño' | 'mediano' | 'grande';
  }[];
  mantraSemana?: string;
}

export const EjerciciosSemana: React.FC<EjerciciosSemanaProps> = ({
  semanaNum,
  mesNombre,
  ejercicios,
  mantraSemana,
}) => {
  const { config } = useStyle();

  return (
    <div className={`print-page bg-white p-6 flex flex-col ${config.pattern}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 ${config.badgeSecondary} px-3 py-1 rounded-full text-xs font-bold mb-2`}>
          <BookOpen className="w-3 h-3" />
          Ejercicios
        </div>
        <h1 className={`text-xl font-display ${config.titleGradient}`}>
          Semana {semanaNum} · {mesNombre}
        </h1>
        <p className={`text-sm ${config.iconSecondary} italic`}>Para ampliar tu consciencia</p>
      </div>

      {/* Ejercicios */}
      <div className="flex-1 space-y-4">
        {ejercicios.map((ejercicio, idx) => {
          const alturas = {
            'pequeño': 'h-16',
            'mediano': 'h-24',
            'grande': 'h-32'
          };
          const altura = alturas[ejercicio.espacio || 'mediano'];
          
          return (
            <div key={idx} className={`${config.cardBg} ${config.cardBorder} rounded-xl p-4`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full ${config.headerBg} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{idx + 1}</span>
                </div>
                <div>
                  <h3 className={`font-bold ${config.iconPrimary}`}>{ejercicio.titulo}</h3>
                  <p className="text-sm text-gray-600">{ejercicio.instrucciones}</p>
                </div>
              </div>
              {/* Espacio para escribir */}
              <div className={`${altura} border border-dashed border-gray-200 rounded-lg p-2 writing-area`}>
                <div className="writing-lines h-full" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mantra de la semana */}
      {mantraSemana && (
        <div className={`${config.highlightPrimary} ${config.cardBorder} rounded-xl p-4 mt-4 text-center`}>
          <Sparkles className={`w-5 h-5 ${config.iconSecondary} mx-auto mb-2`} />
          <p className={`font-display text-lg ${config.titleGradient} italic`}>
            "{mantraSemana}"
          </p>
        </div>
      )}
    </div>
  );
};

// ============ EJEMPLOS: SEMANAS DE ENERO 2026 ============

export const Semana1Enero2026 = () => (
  <SemanaDetallada
    semanaNum={1}
    fechaInicio={new Date(2026, 0, 1)}
    mesNombre="Enero"
    proposito="Preparación y cierre del año anterior"
    eventos={[
      { 
        dia: 2, 
        evento: { 
          titulo: 'Quirón Directo', 
          tipo: 'especial',
          descripcion: 'Verdades emocionales comienzan a emerger. Sanación en comunidad.'
        } 
      },
      { 
        dia: 3, 
        evento: { 
          titulo: 'Luna Llena en Cáncer', 
          tipo: 'lunaLlena',
          descripcion: 'Culminación emocional. Hogar, raíces, límites familiares iluminados.'
        } 
      },
    ]}
    reflexionSemana="El año no empieza el 1 de enero. Empieza cuando tú decides desde dónde lo comienzas."
  />
);

export const Ejercicios1Enero2026 = () => (
  <EjerciciosSemana
    semanaNum={1}
    mesNombre="Enero"
    ejercicios={[
      {
        titulo: '¿Qué NO quieres repetir este año?',
        instrucciones: 'Lista 3 patrones, situaciones o dinámicas que ya no te representan.',
        espacio: 'mediano'
      },
      {
        titulo: 'La Luna Llena en Cáncer pregunta:',
        instrucciones: '¿Qué necesita tu hogar interno para sentirse seguro?',
        espacio: 'grande'
      }
    ]}
    mantraSemana="No acelero. Observo. Ordeno."
  />
);

export const Semana2Enero2026 = () => (
  <SemanaDetallada
    semanaNum={2}
    fechaInicio={new Date(2026, 0, 5)}
    mesNombre="Enero"
    proposito="Intención consciente"
  />
);

export const Semana3Enero2026 = () => (
  <SemanaDetallada
    semanaNum={3}
    fechaInicio={new Date(2026, 0, 12)}
    mesNombre="Enero"
    proposito="Ajuste de ritmos"
    eventos={[
      { 
        dia: 18, 
        evento: { 
          titulo: 'Luna Nueva en Capricornio', 
          tipo: 'lunaNueva',
          descripcion: 'Nuevo inicio. Define intenciones prácticas, no obligaciones.'
        } 
      },
    ]}
    reflexionSemana="La Luna Nueva te pide redefinir qué es compromiso y qué es autoexigencia heredada."
    ejercicioSemana={{
      titulo: 'Micro-ejercicio',
      descripcion: 'Escribe tu intención para este ciclo lunar en UNA frase clara.'
    }}
  />
);

export const Semana4Enero2026 = () => (
  <SemanaDetallada
    semanaNum={4}
    fechaInicio={new Date(2026, 0, 19)}
    mesNombre="Enero"
    proposito="Transición y expansión"
    eventos={[
      { 
        dia: 20, 
        evento: { 
          titulo: 'Sol entra en Acuario', 
          tipo: 'ingreso',
          descripcion: 'Nuevas perspectivas sociales. Enfoque en comunidad y visión.'
        } 
      },
      { 
        dia: 26, 
        evento: { 
          titulo: 'Neptuno → Aries', 
          tipo: 'ingreso',
          descripcion: 'Inicio de ciclo de 12 años. Sueños renovados, ideales colectivos.'
        } 
      },
    ]}
    reflexionSemana="Neptuno en Aries te invita a soñar con valentía. ¿Qué versión de ti misma quieres idealizar?"
  />
);

// ============ SEMANA DEL CUMPLEAÑOS DE VERO ============
export const SemanaCumpleanosVero = () => (
  <SemanaDetallada
    semanaNum={2}
    fechaInicio={new Date(2026, 1, 9)}
    mesNombre="Febrero"
    proposito="Renacimiento Solar"
    birthday={new Date(1974, 1, 10)}
    eventos={[
      { 
        dia: 10, 
        evento: { 
          titulo: 'Tu Retorno Solar', 
          tipo: 'cumpleanos',
          descripcion: 'El Sol regresa al grado exacto de tu nacimiento. Tu nuevo ciclo personal comienza.'
        } 
      },
    ]}
    reflexionSemana="Este año no viene a exigirte más. Viene a reordenarte por dentro."
    ejercicioSemana={{
      titulo: 'Ritual de Retorno Solar',
      descripcion: 'Escribe lo que sueltas del ciclo anterior y lo que invitas al nuevo. Quema lo primero, guarda lo segundo.'
    }}
  />
);

export default SemanaDetallada;
