'use client';

import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface MonthData {
  nombre: string;
  nombreCorto: string;
  lunas_nuevas: any[];
  lunas_llenas: any[];
  eclipses: any[];
  ingresos_destacados: any[];
  total_eventos: number;
}

interface CalendarioAnualProps {
  startDate: Date;
  endDate: Date;
  monthsData?: MonthData[];
  yearEvents?: any[];
  calendarioPersonalizado?: {
    descripcion?: string;
    meses_clave?: string;
    aprendizajes_del_año?: string;
  };
}

export default function CalendarioAnual({
  startDate,
  endDate,
  monthsData = [],
  yearEvents = [],
  calendarioPersonalizado
}: CalendarioAnualProps) {
  // Calcular intensidad de cada mes basado en eventos
  const monthsWithIntensity = monthsData.map(month => ({
    ...month,
    intensity: calculateIntensity(month)
  }));

  // Identificar meses clave (mayor actividad astrológica)
  const keyMonths = monthsWithIntensity
    .filter(m => m.intensity >= 8 || m.eclipses.length > 0)
    .map(m => m.nombreCorto);

  return (
    <>
      {/* CALENDARIO ANUAL - VISIÓN GENERAL */}
      <div className="print-page bg-white p-12">
        <div className="max-w-4xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Tu Año en un Vistazo
            </h2>
            <p className="font-body text-lg text-gray-600">
              Calendario Astrológico Personalizado
            </p>
            <p className="font-body text-base text-gray-500 mt-2">
              {format(startDate, "MMMM yyyy", { locale: es })} — {format(endDate, "MMMM yyyy", { locale: es })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          {/* Descripción */}
          {calendarioPersonalizado?.descripcion && (
            <div className="mb-12">
              <p className="font-body text-lg text-gray-700 leading-relaxed text-center whitespace-pre-line">
                {calendarioPersonalizado.descripcion}
              </p>
            </div>
          )}

          {/* Línea de tiempo mensual */}
          <div className="space-y-3">
            {monthsWithIntensity.map((month, idx) => {
              const isKeyMonth = keyMonths.includes(month.nombreCorto);
              const hasEclipses = month.eclipses.length > 0;

              return (
                <div
                  key={idx}
                  className={`
                    relative flex items-center p-4 rounded-lg border
                    ${isKeyMonth
                      ? 'border-cosmic-gold bg-cosmic-gold/5'
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                    transition-colors
                  `}
                >
                  {/* Mes */}
                  <div className="w-32 flex-shrink-0">
                    <p className={`
                      font-display text-lg
                      ${isKeyMonth ? 'text-cosmic-gold font-semibold' : 'text-gray-700'}
                    `}>
                      {month.nombreCorto}
                    </p>
                  </div>

                  {/* Barra de intensidad */}
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          month.intensity >= 10 ? 'bg-cosmic-gold' :
                          month.intensity >= 7 ? 'bg-cosmic-amber' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min(month.intensity * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Iconos de eventos */}
                  <div className="flex items-center space-x-3 text-sm">
                    {hasEclipses && (
                      <span className="text-cosmic-gold font-semibold" title="Eclipse">
                        ●
                      </span>
                    )}
                    {month.lunas_nuevas.length > 0 && (
                      <span className="text-gray-600" title="Luna Nueva">
                        ☽ {month.lunas_nuevas.length}
                      </span>
                    )}
                    {month.ingresos_destacados.length > 0 && (
                      <span className="text-gray-600" title="Ingresos planetarios">
                        ↗ {month.ingresos_destacados.length}
                      </span>
                    )}
                    <span className="text-gray-500 font-body text-xs">
                      {month.total_eventos} eventos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 justify-center text-sm font-body text-gray-600">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-cosmic-gold mr-2"></span>
                Alta intensidad
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-cosmic-amber mr-2"></span>
                Media intensidad
              </div>
              <div className="flex items-center">
                <span className="text-cosmic-gold mr-2">●</span>
                Eclipse
              </div>
              <div className="flex items-center">
                <span className="mr-2">☽</span>
                Lunas
              </div>
              <div className="flex items-center">
                <span className="mr-2">↗</span>
                Ingresos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESES CLAVE */}
      {keyMonths.length > 0 && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                Meses de Mayor Intensidad
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            <div className="space-y-6">
              {calendarioPersonalizado?.meses_clave ? (
                <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {calendarioPersonalizado.meses_clave}
                </p>
              ) : (
                <>
                  <p className="font-body text-lg text-gray-700 leading-relaxed">
                    Los siguientes meses presentan mayor actividad astrológica y pueden
                    traer eventos significativos, cambios importantes o momentos de
                    transformación profunda:
                  </p>

                  <div className="grid gap-4">
                    {keyMonths.map((monthName, idx) => {
                      const monthData = monthsWithIntensity.find(m => m.nombreCorto === monthName);
                      if (!monthData) return null;

                      return (
                        <div
                          key={idx}
                          className="border-l-4 border-cosmic-gold pl-6 py-3 bg-cosmic-purple/5 rounded-r-lg"
                        >
                          <h3 className="font-display text-xl text-gray-800 mb-2">
                            {monthData.nombre}
                          </h3>
                          <ul className="font-body text-base text-gray-700 space-y-1">
                            {monthData.eclipses.length > 0 && (
                              <li>• Eclipse: Cambios significativos en puerta</li>
                            )}
                            {monthData.lunas_nuevas.length > 0 && (
                              <li>• {monthData.lunas_nuevas.length} Luna(s) Nueva(s): Momentos de siembra</li>
                            )}
                            {monthData.lunas_llenas.length > 0 && (
                              <li>• {monthData.lunas_llenas.length} Luna(s) Llena(s): Culminaciones y revelaciones</li>
                            )}
                            {monthData.ingresos_destacados.length > 0 && (
                              <li>• {monthData.ingresos_destacados.length} ingreso(s) planetario(s) importante(s)</li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Consejo */}
              <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-8">
                <h4 className="font-display text-lg text-cosmic-gold mb-3">
                  Navegando los Meses Intensos
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  Los meses de alta actividad astrológica no son "buenos" ni "malos":
                  son oportunidades para crecer. Mantén tu agenda flexible en estos periodos,
                  practica extra autocuidado, y confía en que el universo te está guiando
                  hacia tu mayor evolución.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APRENDIZAJES DEL AÑO */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-cosmic-gold mb-4">
              Aprendizajes del Año
            </h2>
            <p className="font-body text-lg text-gray-600">
              Las Lecciones Que Este Ciclo Te Trae
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          <div className="space-y-8">
            {calendarioPersonalizado?.aprendizajes_del_año ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {calendarioPersonalizado.aprendizajes_del_año}
              </p>
            ) : (
              <div className="space-y-6">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Cada año solar trae consigo lecciones únicas. A través de los tránsitos
                  planetarios, las lunaciones y los eventos astrológicos, el universo te
                  invita a expandir tu consciencia en áreas específicas.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-cosmic-gold/20 rounded-lg p-6">
                    <h4 className="font-display text-lg text-cosmic-gold mb-3">
                      En lo Personal
                    </h4>
                    <p className="font-body text-base text-gray-700 leading-relaxed">
                      Observa qué áreas de tu identidad están siendo activadas.
                      ¿Qué partes de ti piden ser reconocidas o transformadas?
                    </p>
                  </div>

                  <div className="border border-cosmic-gold/20 rounded-lg p-6">
                    <h4 className="font-display text-lg text-cosmic-gold mb-3">
                      En lo Relacional
                    </h4>
                    <p className="font-body text-base text-gray-700 leading-relaxed">
                      ¿Qué están enseñándote tus relaciones este año?
                      ¿Dónde necesitas más autenticidad o vulnerabilidad?
                    </p>
                  </div>

                  <div className="border border-cosmic-gold/20 rounded-lg p-6">
                    <h4 className="font-display text-lg text-cosmic-gold mb-3">
                      En lo Vocacional
                    </h4>
                    <p className="font-body text-base text-gray-700 leading-relaxed">
                      ¿Cómo está evolucionando tu propósito? ¿Qué nuevas formas
                      de contribuir al mundo se están revelando?
                    </p>
                  </div>

                  <div className="border border-cosmic-gold/20 rounded-lg p-6">
                    <h4 className="font-display text-lg text-cosmic-gold mb-3">
                      En lo Espiritual
                    </h4>
                    <p className="font-body text-base text-gray-700 leading-relaxed">
                      ¿Qué prácticas o creencias están siendo cuestionadas?
                      ¿Cómo profundizas tu conexión con lo sagrado?
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Espacio para reflexión */}
            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px] mt-8">
              <h4 className="font-display text-xl text-cosmic-gold mb-4">
                Mis Aprendizajes Clave
              </h4>
              <p className="font-body text-sm text-gray-500 italic mb-4">
                Al final del año, vuelve a esta página. ¿Qué lecciones importantes aprendiste?
              </p>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border-b border-gray-300"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper: Calcular intensidad del mes basado en eventos
function calculateIntensity(month: MonthData): number {
  let intensity = 0;

  // Eclipses son muy significativos
  intensity += month.eclipses.length * 4;

  // Lunas nuevas y llenas
  intensity += month.lunas_nuevas.length * 1.5;
  intensity += month.lunas_llenas.length * 1.5;

  // Ingresos planetarios
  intensity += month.ingresos_destacados.length * 1;

  // Otros eventos
  const otherEvents = month.total_eventos -
    (month.eclipses.length + month.lunas_nuevas.length +
     month.lunas_llenas.length + month.ingresos_destacados.length);
  intensity += otherEvents * 0.5;

  return Math.round(intensity);
}
