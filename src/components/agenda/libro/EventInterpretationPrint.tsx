'use client';

interface EventInterpretationData {
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
  analisis_tecnico?: {
    casa_natal_activada: number;
    significado_casa: string;
    planetas_natales_implicados: Array<{
      planeta: string;
      posicion: string;
      tipo_activacion: string;
      justificacion: string;
    }>;
  };
}

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

export default function EventInterpretationPrint({
  event,
  interpretation,
  userName
}: EventInterpretationPrintProps) {
  if (!interpretation) return null;

  return (
    <div className="print-page bg-white p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* TÍTULO DEL EVENTO */}
        <div className="text-center mb-8">
          <h3 className="font-display text-3xl text-cosmic-gold mb-2">
            {interpretation.titulo_evento || getEventTitle(event)}
          </h3>
          <p className="font-body text-base text-gray-600">
            {event.date} {event.sign && `• ${event.sign}`} {event.house && `• Casa ${event.house}`}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
        </div>

        {/* NIVEL 1: ANÁLISIS OBJETIVO */}
        {interpretation.nivel_1_analisis_objetivo && (
          <div className="border-l-4 border-blue-400 pl-6 py-4 bg-blue-50/30">
            <h4 className="font-display text-xl text-gray-800 mb-4">
              📊 Análisis Objetivo
            </h4>

            {/* Datos Objetivos */}
            {interpretation.nivel_1_analisis_objetivo.datos_objetivos && (
              <div className="mb-4">
                <div className="font-body text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Evento:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.evento}</p>
                  <p><span className="font-semibold">Signo:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.signo_principal}</p>
                  <p><span className="font-semibold">Energía:</span> {interpretation.nivel_1_analisis_objetivo.datos_objetivos.tipo_energia}</p>
                </div>
              </div>
            )}

            {/* Qué se mueve */}
            {interpretation.nivel_1_analisis_objetivo.que_se_mueve && (
              <div className="mb-4">
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  {interpretation.nivel_1_analisis_objetivo.que_se_mueve}
                </p>
              </div>
            )}

            {/* Dónde cae */}
            {interpretation.nivel_1_analisis_objetivo.donde_cae && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-body text-sm text-gray-700">
                  <span className="font-semibold text-cosmic-gold">Ubicación:</span>{' '}
                  {interpretation.nivel_1_analisis_objetivo.donde_cae}
                </p>
              </div>
            )}

            {/* Cómo es la energía */}
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
              💫 Qué activa en tu carta{userName && `, ${userName}`}
            </h4>

            {/* Casa activada */}
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

            {/* Planetas natales implicados */}
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

            {/* Resonancia natal */}
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
            {/* Manifestaciones concretas */}
            {interpretation.nivel_3_como_se_vive_en_ti.manifestaciones_concretas && (
              <div className="p-5 bg-violet-50/50 rounded-lg border border-violet-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  ✨ Cómo lo sentirás
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.manifestaciones_concretas}
                </p>
              </div>
            )}

            {/* Riesgo inconsciente */}
            {interpretation.nivel_3_como_se_vive_en_ti.riesgo_si_vives_inconscientemente && (
              <div className="p-5 bg-rose-50/50 rounded-lg border border-rose-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  ⚠️ Riesgo si vives inconscientemente
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.riesgo_si_vives_inconscientemente}
                </p>
              </div>
            )}

            {/* Uso consciente */}
            {interpretation.nivel_3_como_se_vive_en_ti.uso_consciente && (
              <div className="p-5 bg-emerald-50/50 rounded-lg border border-emerald-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  ✅ Uso consciente
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.uso_consciente}
                </p>
              </div>
            )}

            {/* Acción práctica */}
            {interpretation.nivel_3_como_se_vive_en_ti.accion_practica && (
              <div className="p-5 bg-blue-50/50 rounded-lg border border-blue-200">
                <h4 className="font-display text-lg text-gray-800 mb-3">
                  🎯 Acción práctica
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {interpretation.nivel_3_como_se_vive_en_ti.accion_practica}
                </p>
              </div>
            )}

            {/* Mantra personal */}
            {interpretation.nivel_3_como_se_vive_en_ti.mantra_personal && (
              <div className="p-6 bg-gradient-to-br from-cosmic-gold/10 to-cosmic-amber/10 rounded-lg border-2 border-cosmic-gold/30">
                <h4 className="font-display text-lg text-cosmic-gold mb-3 text-center">
                  ✨ Tu Mantra Personal
                </h4>
                <p className="font-body text-xl text-gray-800 italic text-center leading-relaxed">
                  "{interpretation.nivel_3_como_se_vive_en_ti.mantra_personal}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Espacio para notas personales */}
        <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-6 min-h-[150px] mt-8">
          <h4 className="font-display text-base text-cosmic-gold mb-3">
            📝 Mis notas sobre este evento
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
function getEventTitle(event: any): string {
  const typeNames: { [key: string]: string } = {
    'luna-nueva': 'Luna Nueva',
    'luna-llena': 'Luna Llena',
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
