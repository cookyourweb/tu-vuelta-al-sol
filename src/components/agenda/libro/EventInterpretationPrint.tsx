'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Formato actual del prompt de OpenAI (eventInterpretationPrompt.ts)
interface AIGeneratedInterpretation {
  titulo_evento?: string;
  clima_del_dia?: string[];
  energias_activas?: string[];
  mensaje_sintesis?: string;
  como_te_afecta?: string;
  interpretacion_practica?: Array<{
    planeta: string;
    que_pide: string;
  }>;
  sintesis_practica?: string;
  accion_concreta?: {
    titulo: string;
    pasos: string[];
  };
  sombra_a_evitar?: string[];
  explicacion_sombra?: string;
  frase_ancla?: string;
  apoyo_energetico?: Array<{
    tipo: string;
    elemento: string;
    proposito: string;
  }>;
  nota_apoyo?: string;
  cierre_dia?: string;
  analisis_tecnico?: {
    evento_en_casa_natal: number;
    significado_casa: string;
    planetas_natales_activados: string[];
    aspectos_cruzados?: string[];
  };
}

// Formato legacy (nivel_1/2/3) para compatibilidad con interpretaciones cacheadas
interface LegacyInterpretation {
  titulo_evento?: string;
  nivel_1_analisis_objetivo?: {
    datos_objetivos?: {
      evento: string;
      fecha: string;
      signo_principal: string;
      tipo_energia: string;
    };
    que_se_mueve?: string;
    donde_cae?: string;
    como_es_la_energia?: string;
  };
  nivel_2_que_activa_en_tu_carta?: {
    casa_activada?: {
      numero: number;
      significado: string;
      descripcion: string;
    };
    planetas_natales_implicados?: Array<{
      planeta: string;
      signo: string;
      casa: number;
      grado: number;
      tipo_activacion: string;
      justificacion: string;
    }>;
    resonancia_natal?: string;
  };
  nivel_3_como_se_vive_en_ti?: {
    manifestaciones_concretas?: string;
    riesgo_si_vives_inconscientemente?: string;
    uso_consciente?: string;
    accion_practica?: string;
    mantra_personal?: string;
  };
}

type EventInterpretationData = AIGeneratedInterpretation & LegacyInterpretation;

interface EventInterpretationPrintProps {
  event: {
    type: string;
    date: string;
    sign?: string;
    house?: number;
    description?: string;
  };
  interpretation?: EventInterpretationData;
  userName?: string;
}

// Detecta si la interpretación usa el formato actual del prompt de OpenAI
function isCurrentFormat(interp: EventInterpretationData): boolean {
  return !!(interp.como_te_afecta || interp.mensaje_sintesis || interp.frase_ancla || interp.clima_del_dia);
}

export default function EventInterpretationPrint({
  event,
  interpretation,
  userName
}: EventInterpretationPrintProps) {
  if (!interpretation) return null;

  // Formatear fecha para display
  let formattedDate = event.date;
  try {
    const dateObj = new Date(event.date);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = format(dateObj, "d 'de' MMMM yyyy", { locale: es });
    }
  } catch { /* usar date string original */ }

  // Casa natal: usar la del evento o del análisis técnico
  const casaNatal = event.house || interpretation.analisis_tecnico?.evento_en_casa_natal;

  if (isCurrentFormat(interpretation)) {
    return renderCurrentFormat(interpretation, event, formattedDate, casaNatal, userName);
  }

  return renderLegacyFormat(interpretation, event, formattedDate, casaNatal, userName);
}

// ============================================================================
// RENDER: Formato actual (del prompt eventInterpretationPrompt.ts)
// ============================================================================
function renderCurrentFormat(
  interpretation: EventInterpretationData,
  event: EventInterpretationPrintProps['event'],
  formattedDate: string,
  casaNatal: number | undefined,
  userName?: string
) {
  return (
    <div className="print-page bg-white p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* TÍTULO DEL EVENTO */}
        <div className="text-center mb-8">
          <h3 className="font-display text-3xl text-cosmic-gold mb-2">
            {interpretation.titulo_evento || getEventTitle(event)}
          </h3>
          <p className="font-body text-base text-gray-600">
            {formattedDate} {event.sign && `· ${event.sign}`} {casaNatal && `· Casa ${casaNatal}`}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
        </div>

        {/* CLIMA DEL DÍA */}
        {interpretation.clima_del_dia && interpretation.clima_del_dia.length > 0 && (
          <div className="text-center">
            <p className="font-body text-sm text-gray-500 mb-1">Clima del día</p>
            <p className="font-display text-lg text-gray-700">
              {interpretation.clima_del_dia.join(' · ')}
            </p>
          </div>
        )}

        {/* ENERGÍAS ACTIVAS */}
        {interpretation.energias_activas && interpretation.energias_activas.length > 0 && (
          <div className="text-center mb-4">
            <p className="font-body text-sm text-gray-500 mb-1">Energías activas este año</p>
            <p className="font-body text-base text-gray-700">
              {interpretation.energias_activas.join(' · ')}
            </p>
          </div>
        )}

        {/* MENSAJE SÍNTESIS */}
        {interpretation.mensaje_sintesis && (
          <div className="p-6 bg-cosmic-gold/5 rounded-lg border border-cosmic-gold/20">
            <p className="font-body text-lg text-gray-800 leading-relaxed text-center italic">
              {interpretation.mensaje_sintesis}
            </p>
          </div>
        )}

        {/* CÓMO TE AFECTA */}
        {interpretation.como_te_afecta && (
          <div className="border-l-4 border-purple-400 pl-6 py-4">
            <h4 className="font-display text-xl text-gray-800 mb-4">
              Cómo te afecta{userName && `, ${userName}`}
            </h4>
            <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {interpretation.como_te_afecta}
            </p>
          </div>
        )}

        {/* INTERPRETACIÓN PRÁCTICA POR PLANETA */}
        {interpretation.interpretacion_practica && interpretation.interpretacion_practica.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-display text-xl text-gray-800 mb-2">
              Qué te piden los planetas
            </h4>
            {interpretation.interpretacion_practica.map((item, i) => (
              <div key={i} className="p-4 bg-purple-50/30 rounded-lg border border-purple-200">
                <p className="font-body text-sm font-semibold text-cosmic-gold mb-1">
                  {item.planeta}
                </p>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  {item.que_pide}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SÍNTESIS PRÁCTICA */}
        {interpretation.sintesis_practica && (
          <div className="p-4 bg-violet-50/50 rounded-lg border border-violet-200">
            <p className="font-body text-base text-gray-700 leading-relaxed italic">
              {interpretation.sintesis_practica}
            </p>
          </div>
        )}

        {/* ACCIÓN CONCRETA */}
        {interpretation.accion_concreta && (
          <div className="p-5 bg-blue-50/50 rounded-lg border border-blue-200">
            <h4 className="font-display text-lg text-gray-800 mb-3">
              {interpretation.accion_concreta.titulo}
            </h4>
            {interpretation.accion_concreta.pasos && (
              <ol className="font-body text-base text-gray-700 space-y-2 list-decimal list-inside">
                {interpretation.accion_concreta.pasos.map((paso, i) => (
                  <li key={i} className="leading-relaxed">{paso}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* SOMBRA A EVITAR */}
        {interpretation.sombra_a_evitar && interpretation.sombra_a_evitar.length > 0 && (
          <div className="p-5 bg-rose-50/50 rounded-lg border border-rose-200">
            <h4 className="font-display text-lg text-gray-800 mb-3">
              Sombras a observar
            </h4>
            <ul className="font-body text-base text-gray-700 space-y-1">
              {interpretation.sombra_a_evitar.map((sombra, i) => (
                <li key={i}>· {sombra}</li>
              ))}
            </ul>
            {interpretation.explicacion_sombra && (
              <p className="font-body text-sm text-gray-600 mt-3 italic">
                {interpretation.explicacion_sombra}
              </p>
            )}
          </div>
        )}

        {/* FRASE ANCLA */}
        {interpretation.frase_ancla && (
          <div className="p-6 bg-gradient-to-br from-cosmic-gold/10 to-cosmic-amber/10 rounded-lg border-2 border-cosmic-gold/30">
            <h4 className="font-display text-base text-cosmic-gold mb-2 text-center">
              Tu frase ancla
            </h4>
            <p className="font-body text-xl text-gray-800 italic text-center leading-relaxed">
              &ldquo;{interpretation.frase_ancla}&rdquo;
            </p>
          </div>
        )}

        {/* APOYO ENERGÉTICO */}
        {interpretation.apoyo_energetico && interpretation.apoyo_energetico.length > 0 && (
          <div className="p-5 bg-emerald-50/50 rounded-lg border border-emerald-200">
            <h4 className="font-display text-lg text-gray-800 mb-3">
              Apoyo energético
            </h4>
            <div className="space-y-2">
              {interpretation.apoyo_energetico.map((apoyo, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-body text-sm">{apoyo.tipo}</span>
                  <span className="font-body text-sm text-gray-700">
                    <span className="font-semibold">{apoyo.elemento}</span> — {apoyo.proposito}
                  </span>
                </div>
              ))}
            </div>
            {interpretation.nota_apoyo && (
              <p className="font-body text-xs text-gray-500 mt-2 italic">
                {interpretation.nota_apoyo}
              </p>
            )}
          </div>
        )}

        {/* CIERRE DEL DÍA */}
        {interpretation.cierre_dia && (
          <div className="text-center py-4">
            <p className="font-body text-base text-gray-700 leading-relaxed italic">
              {interpretation.cierre_dia}
            </p>
          </div>
        )}

        {/* ANÁLISIS TÉCNICO (plegable en impresión) */}
        {interpretation.analisis_tecnico && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="font-body text-xs text-gray-500 mb-2">Análisis Técnico</p>
            <div className="font-body text-xs text-gray-600 space-y-1">
              <p>Casa Natal: {interpretation.analisis_tecnico.evento_en_casa_natal} — {interpretation.analisis_tecnico.significado_casa}</p>
              {interpretation.analisis_tecnico.planetas_natales_activados?.length > 0 && (
                <p>Planetas activados: {interpretation.analisis_tecnico.planetas_natales_activados.join(', ')}</p>
              )}
            </div>
          </div>
        )}

        {/* Espacio para notas personales */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6 min-h-[150px] mt-8">
          <h4 className="font-display text-base text-cosmic-gold mb-3">
            Mis notas sobre este evento
          </h4>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RENDER: Formato legacy (nivel_1/2/3) para interpretaciones cacheadas
// ============================================================================
function renderLegacyFormat(
  interpretation: EventInterpretationData,
  event: EventInterpretationPrintProps['event'],
  formattedDate: string,
  casaNatal: number | undefined,
  userName?: string
) {
  return (
    <div className="print-page bg-white p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* TÍTULO DEL EVENTO */}
        <div className="text-center mb-8">
          <h3 className="font-display text-3xl text-cosmic-gold mb-2">
            {interpretation.titulo_evento || getEventTitle(event)}
          </h3>
          <p className="font-body text-base text-gray-600">
            {formattedDate} {event.sign && `· ${event.sign}`} {casaNatal && `· Casa ${casaNatal}`}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
        </div>

        {/* NIVEL 1: ANÁLISIS OBJETIVO */}
        {interpretation.nivel_1_analisis_objetivo && (
          <div className="border-l-4 border-blue-400 pl-6 py-4 bg-blue-50/30">
            <h4 className="font-display text-xl text-gray-800 mb-4">
              Análisis Objetivo
            </h4>

            {interpretation.nivel_1_analisis_objetivo.datos_objetivos && (
              <div className="mb-4">
                <div className="font-body text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Evento:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.evento}</p>
                  <p><span className="font-semibold">Signo:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.signo_principal}</p>
                  <p><span className="font-semibold">Energía:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.tipo_energia}</p>
                </div>
              </div>
            )}

            {interpretation.nivel_1_analisis_objetivo.que_se_mueve && (
              <div className="mb-4">
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  {interpretation.nivel_1_analisis_objetivo.que_se_mueve}
                </p>
              </div>
            )}

            {interpretation.nivel_1_analisis_objetivo.donde_cae && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-body text-sm text-gray-700">
                  <span className="font-semibold text-cosmic-gold">Ubicación:</span>{' '}
                  {interpretation.nivel_1_analisis_objetivo.donde_cae}
                </p>
              </div>
            )}

            {interpretation.nivel_1_analisis_objetivo.como_es_la_energia && (
              <p className="font-body text-base text-gray-700 leading-relaxed">
                {interpretation.nivel_1_analisis_objetivo.como_es_la_energia}
              </p>
            )}
          </div>
        )}

        {/* NIVEL 2: QUÉ ACTIVA EN TU CARTA */}
        {interpretation.nivel_2_que_activa_en_tu_carta && (
          <div className="border-l-4 border-purple-400 pl-6 py-4 bg-purple-50/30">
            <h4 className="font-display text-xl text-gray-800 mb-4">
              Qué activa en tu carta{userName && `, ${userName}`}
            </h4>

            {interpretation.nivel_2_que_activa_en_tu_carta.casa_activada && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-body text-sm text-gray-700">
                  <span className="font-semibold text-cosmic-gold">Casa {interpretation.nivel_2_que_activa_en_tu_carta.casa_activada.numero}:</span>{' '}
                  {interpretation.nivel_2_que_activa_en_tu_carta.casa_activada.significado}
                </p>
                <p className="font-body text-base text-gray-700 leading-relaxed mt-2">
                  {interpretation.nivel_2_que_activa_en_tu_carta.casa_activada.descripcion}
                </p>
              </div>
            )}

            {interpretation.nivel_2_que_activa_en_tu_carta.planetas_natales_implicados &&
             interpretation.nivel_2_que_activa_en_tu_carta.planetas_natales_implicados.length > 0 &&
             interpretation.nivel_2_que_activa_en_tu_carta.planetas_natales_implicados[0].planeta !== 'Ninguno' && (
              <div className="mb-4">
                <p className="font-body text-sm font-semibold text-gray-700 mb-2">
                  Planetas de tu carta activados:
                </p>
                <ul className="font-body text-sm text-gray-600 space-y-2">
                  {interpretation.nivel_2_que_activa_en_tu_carta.planetas_natales_implicados.map((planeta, i) => (
                    <li key={i} className="flex flex-col gap-1 p-2 bg-white rounded border border-gray-200">
                      <span className="font-semibold text-cosmic-gold">
                        {planeta.planeta} en {planeta.signo} (Casa {planeta.casa})
                      </span>
                      <span className="text-xs text-gray-600">{planeta.justificacion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {interpretation.nivel_2_que_activa_en_tu_carta.resonancia_natal && (
              <p className="font-body text-base text-gray-700 leading-relaxed">
                {interpretation.nivel_2_que_activa_en_tu_carta.resonancia_natal}
              </p>
            )}
          </div>
        )}

        {/* NIVEL 3: CÓMO SE VIVE EN TI */}
        {interpretation.nivel_3_como_se_vive_en_ti && (
          <div className="space-y-6 mt-8">
            {interpretation.nivel_3_como_se_vive_en_ti.manifestaciones_concretas && (
              <div className="p-5 bg-violet-50/50 rounded-lg border border-violet-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  Cómo lo sentirás
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.manifestaciones_concretas}
                </p>
              </div>
            )}

            {interpretation.nivel_3_como_se_vive_en_ti.riesgo_si_vives_inconscientemente && (
              <div className="p-5 bg-rose-50/50 rounded-lg border border-rose-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  Riesgo si vives inconscientemente
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.riesgo_si_vives_inconscientemente}
                </p>
              </div>
            )}

            {interpretation.nivel_3_como_se_vive_en_ti.uso_consciente && (
              <div className="p-5 bg-emerald-50/50 rounded-lg border border-emerald-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  Uso consciente
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.uso_consciente}
                </p>
              </div>
            )}

            {interpretation.nivel_3_como_se_vive_en_ti.accion_practica && (
              <div className="p-5 bg-blue-50/50 rounded-lg border border-blue-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  Acción práctica
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.accion_practica}
                </p>
              </div>
            )}

            {interpretation.nivel_3_como_se_vive_en_ti.mantra_personal && (
              <div className="p-6 bg-gradient-to-br from-cosmic-gold/10 to-cosmic-amber/10 rounded-lg border-2 border-cosmic-gold/30">
                <h4 className="font-display text-lg text-cosmic-gold mb-3 text-center">
                  Tu Mantra Personal
                </h4>
                <p className="font-body text-xl text-gray-800 italic text-center leading-relaxed">
                  &ldquo;{interpretation.nivel_3_como_se_vive_en_ti.mantra_personal}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Espacio para notas personales */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6 min-h-[150px] mt-8">
          <h4 className="font-display text-base text-cosmic-gold mb-3">
            Mis notas sobre este evento
          </h4>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: generar título por defecto si no hay interpretación
function getEventTitle(event: { type: string; sign?: string }): string {
  const typeNames: { [key: string]: string } = {
    'luna-nueva': 'Luna Nueva',
    'luna_nueva': 'Luna Nueva',
    'luna-llena': 'Luna Llena',
    'luna_llena': 'Luna Llena',
    'eclipse-solar': 'Eclipse Solar',
    'eclipse-lunar': 'Eclipse Lunar',
    'ingreso': 'Ingreso Planetario',
    'retrogrado-inicio': 'Inicio Retrógrado',
    'retrogrado-fin': 'Fin Retrógrado'
  };

  const typeName = typeNames[event.type] || 'Evento Astrológico';

  if (event.sign) {
    return `${typeName} en ${event.sign}`;
  }

  return typeName;
}
