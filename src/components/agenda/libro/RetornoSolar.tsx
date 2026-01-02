'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SolarReturnPlanet {
  name: string;
  sign: string;
  house: number;
  degree: number;
}

interface RetornoSolarProps {
  solarReturn?: {
    ascendant?: {
      sign: string;
      degree: number;
    };
    planets?: SolarReturnPlanet[];
    interpretation?: string;
    chartDate?: string | Date;
    location?: string;
  };
  tuAñoAstrologico?: {
    retorno_solar?: {
      asc_significado?: string;
      sol_en_casa?: string;
      luna_en_casa?: string;
      planetas_angulares?: string;
      ritual_inicio?: string;
    };
  };
  startDate: Date;
}

const HOUSE_AREAS: { [key: number]: string } = {
  1: 'Identidad y apariencia personal',
  2: 'Recursos y valores',
  3: 'Comunicación y entorno cercano',
  4: 'Hogar y familia',
  5: 'Creatividad y romance',
  6: 'Trabajo y salud',
  7: 'Relaciones y asociaciones',
  8: 'Transformación y recursos compartidos',
  9: 'Filosofía y viajes',
  10: 'Carrera y vocación',
  11: 'Comunidad y aspiraciones',
  12: 'Espiritualidad y retiro'
};

export default function RetornoSolar({
  solarReturn,
  tuAñoAstrologico,
  startDate
}: RetornoSolarProps) {
  // Extraer planetas clave
  const sun = solarReturn?.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  const moon = solarReturn?.planets?.find(p => p.name === 'Luna' || p.name === 'Moon');

  // Planetas angulares (casas 1, 4, 7, 10)
  const angularPlanets = solarReturn?.planets?.filter(p =>
    [1, 4, 7, 10].includes(p.house)
  ) || [];

  const chartDate = solarReturn?.chartDate
    ? new Date(solarReturn.chartDate)
    : startDate;

  return (
    <>
      {/* RETORNO SOLAR - INTRODUCCIÓN */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-amber flex items-center justify-center">
              <span className="text-4xl text-white">☉</span>
            </div>
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Tu Retorno Solar
            </h2>
            <p className="font-body text-lg text-gray-600">
              {format(chartDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            {solarReturn?.location && (
              <p className="font-body text-base text-gray-500 mt-2">
                {solarReturn.location}
              </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          {/* Introducción al retorno solar */}
          <div className="space-y-6">
            <p className="font-body text-lg text-gray-700 leading-relaxed">
              Tu Retorno Solar marca el momento exacto en que el Sol vuelve a la posición
              que ocupaba en el instante de tu nacimiento. Este evento astronómico,
              que ocurre cada año cerca de tu cumpleaños, genera una nueva carta astral
              que describe las energías y temas que te acompañarán durante los próximos
              12 meses.
            </p>

            <p className="font-body text-lg text-gray-700 leading-relaxed">
              A diferencia de tu carta natal (que permanece constante toda la vida),
              tu carta de retorno solar cambia cada año, ofreciéndote un nuevo mapa
              de posibilidades, desafíos y oportunidades de crecimiento.
            </p>

            {/* Cita */}
            <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-8">
              <p className="font-body text-lg text-gray-700 leading-relaxed italic text-center">
                "Cada retorno solar es una invitación del universo a renovar tu pacto con la vida."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ASCENDENTE DEL RETORNO */}
      {solarReturn?.ascendant && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                Tu Ascendente de Retorno
              </h2>
              <p className="font-body text-lg text-gray-600">
                La Máscara de Este Año: {solarReturn.ascendant.sign}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
            </div>

            <div className="space-y-6">
              <div className="text-center py-6">
                <p className="font-display text-5xl text-cosmic-gold mb-2">
                  {getSignSymbol(solarReturn.ascendant.sign)}
                </p>
                <p className="font-body text-xl text-gray-600">
                  {solarReturn.ascendant.degree.toFixed(1)}° de {solarReturn.ascendant.sign}
                </p>
              </div>

              <p className="font-body text-lg text-gray-700 leading-relaxed">
                {tuAñoAstrologico?.retorno_solar?.asc_significado ||
                  `El Ascendente de tu Retorno Solar en ${solarReturn.ascendant.sign} describe
                  la energía con la que te presentarás al mundo este año. Es la máscara que
                  usarás naturalmente al iniciar nuevos proyectos y relacionarte con tu entorno.`}
              </p>

              {/* Área de reflexión */}
              <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-8">
                <h4 className="font-display text-lg text-cosmic-gold mb-3">
                  Pregunta para Reflexionar
                </h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  ¿Cómo puedo expresar más conscientemente las cualidades de {solarReturn.ascendant.sign}
                  en mi forma de presentarme al mundo este año?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOL Y LUNA EN CASAS */}
      {(sun || moon) && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                Luminarias del Año
              </h2>
              <p className="font-body text-lg text-gray-600">
                Sol y Luna: Propósito y Emociones
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
            </div>

            <div className="space-y-8">
              {/* Sol en casa */}
              {sun && (
                <div className="border-l-4 border-cosmic-gold pl-6">
                  <h3 className="font-display text-2xl text-gray-800 mb-3 flex items-center">
                    <span className="text-cosmic-gold mr-3 text-3xl">☉</span>
                    Sol en Casa {sun.house}
                  </h3>
                  <p className="font-body text-base text-gray-600 mb-3">
                    {HOUSE_AREAS[sun.house]} • {sun.degree.toFixed(1)}° de {sun.sign}
                  </p>
                  <p className="font-body text-lg text-gray-700 leading-relaxed">
                    {tuAñoAstrologico?.retorno_solar?.sol_en_casa ||
                      `Este año, tu energía vital y propósito se concentran en el área de
                      ${HOUSE_AREAS[sun.house]?.toLowerCase()}. Es aquí donde brillarás
                      con mayor intensidad y donde encontrarás tu mayor sentido de identidad.`}
                  </p>
                </div>
              )}

              {/* Luna en casa */}
              {moon && (
                <div className="border-l-4 border-cosmic-amber pl-6">
                  <h3 className="font-display text-2xl text-gray-800 mb-3 flex items-center">
                    <span className="text-cosmic-amber mr-3 text-3xl">☽</span>
                    Luna en Casa {moon.house}
                  </h3>
                  <p className="font-body text-base text-gray-600 mb-3">
                    {HOUSE_AREAS[moon.house]} • {moon.degree.toFixed(1)}° de {moon.sign}
                  </p>
                  <p className="font-body text-lg text-gray-700 leading-relaxed">
                    {tuAñoAstrologico?.retorno_solar?.luna_en_casa ||
                      `Tus necesidades emocionales y tu mundo interior estarán especialmente
                      vinculados al área de ${HOUSE_AREAS[moon.house]?.toLowerCase()}.
                      Aquí es donde buscarás seguridad y nutrición emocional este año.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLANETAS ANGULARES */}
      {angularPlanets.length > 0 && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                Planetas Angulares
              </h2>
              <p className="font-body text-lg text-gray-600">
                Las Energías Más Activas del Año
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
            </div>

            <div className="space-y-6">
              <p className="font-body text-lg text-gray-700 leading-relaxed">
                Los planetas en casas angulares (1, 4, 7, 10) tienen un impacto especialmente
                fuerte durante el año de retorno solar. Son las energías que experimentarás
                de forma más directa y consciente.
              </p>

              {angularPlanets.map((planet, idx) => (
                <div
                  key={idx}
                  className="border border-cosmic-gold/20 rounded-lg p-6 bg-cosmic-purple/5"
                >
                  <h3 className="font-display text-xl text-gray-800 mb-2 flex items-center">
                    <span className="text-cosmic-gold mr-3 text-2xl">
                      {getPlanetSymbol(planet.name)}
                    </span>
                    {planet.name} en Casa {planet.house}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mb-3">
                    {HOUSE_AREAS[planet.house]} • {planet.degree.toFixed(1)}° de {planet.sign}
                  </p>
                  <p className="font-body text-base text-gray-700 leading-relaxed">
                    {getAngularPlanetDescription(planet.name, planet.house)}
                  </p>
                </div>
              ))}

              {tuAñoAstrologico?.retorno_solar?.planetas_angulares && (
                <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-6">
                  <p className="font-body text-base text-gray-700 leading-relaxed">
                    {tuAñoAstrologico.retorno_solar.planetas_angulares}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INTERPRETACIÓN COMPLETA */}
      {solarReturn?.interpretation && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                El Mensaje de Tu Año
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            <div className="space-y-6">
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {solarReturn.interpretation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RITUAL DE INICIO */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-cosmic-gold mb-4">
              Ritual de Retorno Solar
            </h2>
            <p className="font-body text-lg text-gray-600">
              Ceremonia para Iniciar Tu Nuevo Año
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          <div className="space-y-8">
            {tuAñoAstrologico?.retorno_solar?.ritual_inicio ? (
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {tuAñoAstrologico.retorno_solar.ritual_inicio}
              </p>
            ) : (
              <div className="space-y-6">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  Te invito a realizar este ritual en el día de tu cumpleaños o en los días
                  cercanos a tu retorno solar exacto:
                </p>

                <ol className="space-y-4 font-body text-base text-gray-700 leading-relaxed">
                  <li className="flex items-start">
                    <span className="text-cosmic-gold font-display text-xl mr-3">1.</span>
                    <span>
                      <strong>Preparación del espacio:</strong> Encuentra un lugar tranquilo.
                      Enciende una vela dorada o amarilla (representando al Sol).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold font-display text-xl mr-3">2.</span>
                    <span>
                      <strong>Revisión del año:</strong> Lee tu carta de retorno solar del año
                      anterior. ¿Qué se cumplió? ¿Qué aprendiste?
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold font-display text-xl mr-3">3.</span>
                    <span>
                      <strong>Intención para el nuevo año:</strong> Lee tu nuevo retorno solar
                      (estas páginas). Escribe 3 intenciones alineadas con las energías del año.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold font-display text-xl mr-3">4.</span>
                    <span>
                      <strong>Compromiso:</strong> Haz una promesa contigo mismo/a sobre cómo
                      quieres trabajar conscientemente con las energías de este año.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold font-display text-xl mr-3">5.</span>
                    <span>
                      <strong>Cierre:</strong> Agradece al Sol por un nuevo ciclo de vida.
                      Deja que la vela se consuma completamente (con seguridad).
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Espacio para escribir intenciones */}
            <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[250px] mt-8">
              <h4 className="font-display text-xl text-cosmic-gold mb-4">
                Mis Tres Intenciones para Este Año Solar
              </h4>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <p className="font-body text-sm text-gray-500 mb-2">{i}.</p>
                    <div className="space-y-2">
                      <div className="border-b border-gray-300"></div>
                      <div className="border-b border-gray-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helpers
function getSignSymbol(sign: string): string {
  const symbols: { [key: string]: string } = {
    'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
    'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
  };
  return symbols[sign] || '✶';
}

function getPlanetSymbol(name: string): string {
  const symbols: { [key: string]: string } = {
    'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀',
    'Marte': '♂', 'Júpiter': '♃', 'Saturno': '♄',
    'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇'
  };
  return symbols[name] || '●';
}

function getAngularPlanetDescription(name: string, house: number): string {
  const descriptions: { [key: string]: { [key: number]: string } } = {
    'Mercurio': {
      1: 'Tu comunicación y pensamiento serán protagonistas este año.',
      4: 'Conversaciones importantes en el hogar y la familia.',
      7: 'El diálogo y los acuerdos en relaciones son clave.',
      10: 'Tu voz profesional necesita ser escuchada.'
    },
    'Venus': {
      1: 'Un año para cultivar el amor propio y la belleza personal.',
      4: 'Embellece tu hogar y nutre relaciones familiares.',
      7: 'Las asociaciones y el romance están en primer plano.',
      10: 'Tus valores se expresan en tu carrera y vocación.'
    },
    'Marte': {
      1: 'Acción directa y afirmación personal son tu fuerza.',
      4: 'Energía para proyectos en el hogar o asuntos familiares.',
      7: 'Necesitarás balance entre autonomía y cooperación.',
      10: 'Impulso profesional y ambición marcada.'
    },
    'Júpiter': {
      1: 'Expansión personal y nuevas oportunidades.',
      4: 'Crecimiento a través de raíces y hogar.',
      7: 'Relaciones que te expanden y enseñan.',
      10: 'Año de reconocimiento y avance profesional.'
    },
    'Saturno': {
      1: 'Madurez personal y responsabilidad contigo mismo/a.',
      4: 'Estructurar bases sólidas en hogar o familia.',
      7: 'Compromisos serios en relaciones.',
      10: 'Año de consolidación profesional y logros duraderos.'
    }
  };

  return descriptions[name]?.[house] ||
    `${name} en casa ${house} tendrá un papel importante en tu año.`;
}
