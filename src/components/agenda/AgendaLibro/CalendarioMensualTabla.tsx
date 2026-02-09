import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, getWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { Moon, Sun, Circle, Sparkles, Star, Flame, Brain, Wrench, PenLine, Bookmark, AlertTriangle, Calendar } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ CALENDARIO TABLA LIMPIA ============
// - Formato de agenda profesional
// - Filas por semana
// - Máximo espacio horizontal por día
// - Estilo minimalista con bordes limpios
// ==================================================

interface InterpretacionRaw {
  // V2 fields
  que_se_activa?: string;
  como_se_siente?: string[];
  consejo?: string[];
  ritual_breve?: string;
  advertencias?: string[];
  mantra?: string;
  pregunta_clave?: string;
  // V1 fields
  mensaje_sintesis?: string;
  como_te_afecta?: string;
  sintesis_practica?: string;
  accion_concreta?: { titulo: string; pasos: string[] };
  frase_ancla?: string;
  cierre_dia?: string;
  // Simple fields
  personalMeaning?: string;
  actionSteps?: string[];
}

interface EventoMes {
  dia: number;
  tipo: 'lunaNueva' | 'lunaLlena' | 'eclipse' | 'retrogrado' | 'ingreso' | 'especial' | 'cumpleanos';
  titulo: string;
  signo?: string;
  interpretacion?: string;
  interpretacionRaw?: InterpretacionRaw;
}

interface LineaTiempoMes {
  palabra_clave?: string;
  intensidad?: number;
  descripcion?: string;
  accion_clave?: string;
}

interface MesClavePuntoGiro {
  mes?: string;
  periodo?: string;
  evento_astrologico?: string;
  significado_para_ti?: string;
  significado?: string;
  descripcion?: string;
}

interface CalendarioTablaProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  eventos: EventoMes[];
  birthday?: Date;
  lineaTiempoMes?: LineaTiempoMes;
  mesClave?: MesClavePuntoGiro;
  ejercicioTipo?: 'ajuste' | 'activacion';
}

const diasSemanaFull = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const generateCalendarWeeks = (monthDate: Date) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let currentDay = calendarStart;

  while (currentDay <= monthEnd || weeks.length < 5) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  return weeks;
};

const IconoEvento = ({ tipo, className = "w-3 h-3" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'lunaLlena': return <Circle className={className} fill="currentColor" />;
    case 'lunaNueva': return <Moon className={className} />;
    case 'eclipse': return <Sparkles className={className} />;
    case 'cumpleanos': return <Sun className={className} />;
    case 'retrogrado': return <span className="font-bold text-[10px]">℞</span>;
    case 'especial': return <Star className={className} fill="currentColor" />;
    default: return <Circle className={className} />;
  }
};

const getEventoColor = (tipo: string) => {
  switch (tipo) {
    case 'lunaLlena': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' };
    case 'lunaNueva': return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-500' };
    case 'eclipse': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' };
    case 'cumpleanos': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' };
    case 'retrogrado': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-500' };
    case 'ingreso': return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-500' };
    case 'especial': return { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700', icon: 'text-fuchsia-500' };
    default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' };
  }
};

// ============ INTERPRETACIÓN ESTRUCTURADA CON ICONOS ============
const InterpretacionEstructurada: React.FC<{ raw: InterpretacionRaw; colors: ReturnType<typeof getEventoColor> }> = ({ raw, colors }) => {
  // Detectar formato y renderizar con iconos
  const isV2 = !!(raw.que_se_activa || raw.como_se_siente || raw.consejo);
  const isV1 = !!(raw.mensaje_sintesis || raw.como_te_afecta || raw.frase_ancla);

  if (isV2) {
    return (
      <div className="space-y-2">
        {raw.que_se_activa && (
          <div className="flex items-start gap-2">
            <Flame className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} leading-relaxed`}>{raw.que_se_activa}</p>
          </div>
        )}
        {raw.como_se_siente && raw.como_se_siente.length > 0 && (
          <div className="flex items-start gap-2">
            <Brain className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <div>
              {raw.como_se_siente.map((s, i) => (
                <p key={i} className={`text-xs ${colors.text} opacity-85 leading-relaxed`}>- {s}</p>
              ))}
            </div>
          </div>
        )}
        {raw.consejo && raw.consejo.length > 0 && (
          <div className="flex items-start gap-2">
            <Wrench className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <div>
              {raw.consejo.slice(0, 3).map((c, i) => (
                <p key={i} className={`text-xs ${colors.text} opacity-85 leading-relaxed`}>- {c}</p>
              ))}
            </div>
          </div>
        )}
        {raw.advertencias && raw.advertencias.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500`} />
            <div>
              {raw.advertencias.map((a, i) => (
                <p key={i} className="text-xs text-amber-700 leading-relaxed">- {a}</p>
              ))}
            </div>
          </div>
        )}
        {raw.mantra && (
          <div className="flex items-start gap-2">
            <Sparkles className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} italic`}>&ldquo;{raw.mantra}&rdquo;</p>
          </div>
        )}
        {raw.pregunta_clave && (
          <div className="flex items-start gap-2">
            <Bookmark className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} italic`}>{raw.pregunta_clave}</p>
          </div>
        )}
      </div>
    );
  }

  if (isV1) {
    return (
      <div className="space-y-2">
        {raw.mensaje_sintesis && (
          <div className="flex items-start gap-2">
            <Flame className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} leading-relaxed`}>{raw.mensaje_sintesis}</p>
          </div>
        )}
        {raw.como_te_afecta && (
          <div className="flex items-start gap-2">
            <Brain className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} opacity-85 leading-relaxed`}>{raw.como_te_afecta}</p>
          </div>
        )}
        {raw.sintesis_practica && (
          <div className="flex items-start gap-2">
            <Wrench className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} opacity-85 leading-relaxed`}>{raw.sintesis_practica}</p>
          </div>
        )}
        {raw.accion_concreta && (
          <div className="flex items-start gap-2">
            <PenLine className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <div>
              {raw.accion_concreta.titulo && (
                <p className={`text-xs font-medium ${colors.text}`}>{raw.accion_concreta.titulo}</p>
              )}
              {raw.accion_concreta.pasos?.map((p, i) => (
                <p key={i} className={`text-xs ${colors.text} opacity-85`}>{i + 1}. {p}</p>
              ))}
            </div>
          </div>
        )}
        {raw.frase_ancla && (
          <div className="flex items-start gap-2">
            <Sparkles className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} italic`}>&ldquo;{raw.frase_ancla}&rdquo;</p>
          </div>
        )}
        {raw.cierre_dia && (
          <div className="flex items-start gap-2">
            <Bookmark className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <p className={`text-xs ${colors.text} italic`}>{raw.cierre_dia}</p>
          </div>
        )}
      </div>
    );
  }

  // Simple format fallback
  return (
    <div className="space-y-2">
      {raw.personalMeaning && (
        <div className="flex items-start gap-2">
          <Flame className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
          <p className={`text-xs ${colors.text} leading-relaxed`}>{raw.personalMeaning}</p>
        </div>
      )}
      {raw.actionSteps && raw.actionSteps.length > 0 && (
        <div className="flex items-start gap-2">
          <PenLine className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
          <div>
            {raw.actionSteps.map((s, i) => (
              <p key={i} className={`text-xs ${colors.text} opacity-85`}>{i + 1}. {s}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CalendarioMensualTabla: React.FC<CalendarioTablaProps> = ({
  monthDate,
  mesNumero,
  nombreZodiaco,
  simboloZodiaco,
  temaDelMes,
  eventos,
  birthday,
  lineaTiempoMes,
  mesClave,
  ejercicioTipo
}) => {
  const { config } = useStyle();
  const weeks = generateCalendarWeeks(monthDate);

  // Filtrar eventos que tienen interpretación (raw o texto)
  const eventosConInterpretacion = eventos.filter(e => e.interpretacion || e.interpretacionRaw);

  return (
    <>
      {/* PÁGINA 1: Calendario Tabla */}
      <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-2 pb-2 border-b-2 border-gray-300">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={`text-2xl ${config.iconPrimary}`}>{simboloZodiaco}</span>
          <h1 className={`text-2xl font-display capitalize ${config.titleGradient}`}>
            {format(monthDate, 'MMMM yyyy', { locale: es })}
          </h1>
        </div>
        <p className={`text-[10px] uppercase tracking-wider ${config.iconSecondary}`}>
          {nombreZodiaco}
        </p>
        <p className={`text-xs italic ${config.iconPrimary} mt-1`}>
          "{temaDelMes}"
        </p>
      </div>

      {/* Contexto del mes: línea del tiempo + mes clave + tipo de ejercicio */}
      {(lineaTiempoMes?.palabra_clave || mesClave || ejercicioTipo) && (
        <div className="flex flex-wrap gap-2 mb-2 justify-center">
          {lineaTiempoMes?.palabra_clave && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${config.badgeSecondary} flex items-center gap-1`}>
              <Calendar className="w-2.5 h-2.5" />
              {lineaTiempoMes.palabra_clave}
              {lineaTiempoMes.intensidad && ` · ${lineaTiempoMes.intensidad}/10`}
            </span>
          )}
          {mesClave && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1`}>
              <Star className="w-2.5 h-2.5" />
              Punto de giro
            </span>
          )}
          {ejercicioTipo && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${ejercicioTipo === 'activacion' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              {ejercicioTipo === 'activacion' ? 'Mes de activación' : 'Mes de ajuste'}
            </span>
          )}
        </div>
      )}
      {lineaTiempoMes?.descripcion && (
        <p className={`text-[9px] text-gray-500 text-center italic mb-2`}>
          {lineaTiempoMes.descripcion.length > 120 ? lineaTiempoMes.descripcion.substring(0, 120) + '...' : lineaTiempoMes.descripcion}
        </p>
      )}

      {/* Tabla de semanas */}
      <div className="flex-1 flex flex-col">
        {weeks.map((week, wi) => {
          const weekStart = week[0];
          const weekEnd = week[6];
          const isCurrentMonthWeek = isSameMonth(weekStart, monthDate) || isSameMonth(weekEnd, monthDate);

          if (!isCurrentMonthWeek) return null;

          return (
            <div key={wi} className="flex border-b border-gray-300 last:border-b-0" style={{ minHeight: '45mm' }}>
              {/* Columna izquierda: Info de semana */}
              <div className="w-16 flex-shrink-0 border-r border-gray-300 p-2 bg-gray-50/50">
                <div className="text-center">
                  <div className={`text-[9px] uppercase tracking-wider ${config.iconSecondary} mb-1`}>
                    Semana
                  </div>
                  <div className={`text-lg font-bold ${config.iconPrimary}`}>
                    {getWeek(weekStart, { weekStartsOn: 1 })}
                  </div>
                  <div className={`text-[8px] ${config.iconSecondary} mt-1`}>
                    {format(weekStart, 'd', { locale: es })}-{format(weekEnd, 'd MMM', { locale: es })}
                  </div>
                </div>
              </div>

              {/* Columna derecha: Días de la semana */}
              <div className="flex-1 grid grid-cols-7">
                {week.map((day, di) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const dayNum = day.getDate();
                  const evento = eventos.find(e => e.dia === dayNum);
                  const isBirthday = birthday && isSameDay(day, new Date(monthDate.getFullYear(), birthday.getMonth(), birthday.getDate()));

                  return (
                    <div
                      key={di}
                      className={`
                        border-r border-gray-200 last:border-r-0 p-1.5 flex flex-col
                        ${!isCurrentMonth ? 'bg-gray-50/30' : ''}
                        ${isBirthday ? config.highlightAccent : ''}
                      `}
                    >
                      {/* Header del día */}
                      <div className="text-center mb-1">
                        <div className={`text-[8px] uppercase ${config.iconSecondary}`}>
                          {diasSemanaFull[di].slice(0, 3)}
                        </div>
                        <div className={`
                          text-base font-bold
                          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                          ${isBirthday ? config.iconAccent : ''}
                        `}>
                          {dayNum}
                        </div>
                      </div>

                      {/* Evento si existe - Con nombre */}
                      {(evento || isBirthday) && (
                        <div className="mb-1">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <IconoEvento
                              tipo={isBirthday ? 'cumpleanos' : evento!.tipo}
                              className={`${isBirthday ? config.iconAccent : config.iconSecondary} w-3 h-3`}
                            />
                          </div>
                          {evento && (
                            <div className="text-center px-0.5">
                              <p className={`text-[7px] leading-tight font-medium ${config.iconPrimary}`}>
                                {evento.titulo}
                              </p>
                              {evento.signo && (
                                <p className={`text-[6px] ${config.iconSecondary} italic`}>
                                  {evento.signo}
                                </p>
                              )}
                            </div>
                          )}
                          {isBirthday && !evento && (
                            <div className="text-center px-0.5">
                              <p className={`text-[7px] leading-tight font-medium ${config.iconAccent}`}>
                                ¡Tu día!
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Espacio para escribir */}
                      <div className="flex-1 flex flex-col justify-start">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-100"
                            style={{ height: '12px' }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

        <FooterLibro pagina={mesNumero * 10} />
      </div>

      {/* PÁGINA 2: Eventos del Mes (si hay eventos con interpretación) */}
      {eventosConInterpretacion.length > 0 && (
        <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
          {/* Header de eventos */}
          <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className={`w-6 h-6 ${config.iconPrimary}`} />
              <h2 className={`text-xl font-display ${config.titleGradient}`}>
                Eventos de {format(monthDate, 'MMMM', { locale: es })}
              </h2>
            </div>
            <p className={`text-xs italic ${config.iconSecondary}`}>
              {nombreZodiaco}
            </p>
          </div>

          {/* Lista de eventos con interpretaciones */}
          <div className="flex-1 space-y-4">
            {eventosConInterpretacion.map((evento, idx) => {
              const colors = getEventoColor(evento.tipo);
              return (
                <div
                  key={idx}
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4`}
                >
                  {/* Título del evento */}
                  <div className="flex items-center gap-2 mb-2">
                    <IconoEvento tipo={evento.tipo} className={`w-4 h-4 ${colors.icon}`} />
                    <span className={`text-sm font-bold ${colors.text}`}>
                      Día {evento.dia}: {evento.titulo}
                    </span>
                    {evento.signo && (
                      <span className={`text-xs ${colors.text} opacity-70`}>
                        en {evento.signo}
                      </span>
                    )}
                  </div>

                  {/* Interpretación con iconos o texto plano */}
                  {(evento.interpretacionRaw || evento.interpretacion) && (
                    <div>
                      {evento.interpretacionRaw ? (
                        <InterpretacionEstructurada raw={evento.interpretacionRaw} colors={colors} />
                      ) : (
                        <p className={`text-xs ${colors.text} leading-relaxed mb-3 whitespace-pre-line`}>
                          {evento.interpretacion}
                        </p>
                      )}

                      {/* Espacio para notas personales */}
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-[10px] text-gray-500 mb-2">Mis notas:</p>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-300"
                            style={{ height: '16px', marginBottom: '6px' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <FooterLibro pagina={mesNumero * 10 + 1} />
        </div>
      )}

      {/* PÁGINA EXTRA: Mes clave / punto de giro (si aplica) */}
      {mesClave && (mesClave.significado_para_ti || mesClave.significado || mesClave.descripcion) && (
        <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
          <div className="text-center mb-6 pb-4 border-b-2 border-amber-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-amber-500" fill="currentColor" />
              <h2 className={`text-xl font-display ${config.titleGradient}`}>
                Punto de Giro: {format(monthDate, 'MMMM', { locale: es })}
              </h2>
            </div>
            {mesClave.evento_astrologico && (
              <p className="text-xs text-amber-700 italic">{mesClave.evento_astrologico}</p>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-2">Por qué este mes es importante:</h3>
              <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">
                {mesClave.significado_para_ti || mesClave.significado || mesClave.descripcion}
              </p>
            </div>

            {lineaTiempoMes?.accion_clave && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Acción clave:
                </h3>
                <p className="text-sm text-orange-800">{lineaTiempoMes.accion_clave}</p>
              </div>
            )}

            {/* Espacio para reflexionar */}
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-wider">Mis reflexiones sobre este punto de giro:</p>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-b border-gray-200" style={{ height: '24px' }} />
              ))}
            </div>
          </div>

          <FooterLibro pagina={mesNumero * 10 + 2} />
        </div>
      )}
    </>
  );
};

export default CalendarioMensualTabla;
