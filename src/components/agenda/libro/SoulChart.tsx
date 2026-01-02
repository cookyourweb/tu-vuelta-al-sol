'use client';

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house?: number;
}

interface Node {
  name: string;
  sign: string;
  degree: number;
  house?: number;
}

interface SoulChartProps {
  natalChart?: {
    planets?: Planet[];
    nodes?: Node[];
    ascendant?: {
      sign: string;
      degree: number;
    };
  };
  tuMapaInterior?: {
    soul_chart?: {
      nodo_norte?: string;
      nodo_sur?: string;
      planeta_dominante?: string;
      patron_alma?: string;
    };
  };
}

const SIGN_SYMBOLS: { [key: string]: string } = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
};

export default function SoulChart({
  natalChart,
  tuMapaInterior
}: SoulChartProps) {
  // Extraer nodos lunares
  const northNode = natalChart?.nodes?.find(n => n.name === 'NorthNode' || n.name === 'North Node' || n.name === 'Nodo Norte');
  const southNode = natalChart?.nodes?.find(n => n.name === 'SouthNode' || n.name === 'South Node' || n.name === 'Nodo Sur');

  // Identificar planetas dominantes (primeros 3 por posición angular)
  const dominantPlanets = natalChart?.planets
    ?.filter(p => ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'].includes(p.name))
    ?.slice(0, 5) || [];

  return (
    <>
      {/* SOUL CHART - INTRODUCCIÓN */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-cosmic-gold mb-4">
              Soul Chart
            </h2>
            <p className="font-display text-xl text-gray-600">
              El Mapa de Tu Alma
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          {/* Introducción */}
          <div className="space-y-6">
            <p className="font-body text-lg text-gray-700 leading-relaxed">
              Tu carta natal es más que un mapa astronómico: es el blueprint de tu alma.
              Cada planeta, cada casa, cada aspecto cuenta una historia sobre quién eres
              en tu esencia más profunda.
            </p>

            <p className="font-body text-lg text-gray-700 leading-relaxed">
              En esta sección exploraremos los elementos más significativos de tu carta natal
              desde una perspectiva evolutiva: no como destino fijo, sino como potencial
              esperando ser activado conscientemente.
            </p>

            {/* Decoración */}
            <div className="flex items-center justify-center space-x-4 py-8">
              <span className="text-cosmic-gold text-2xl">✧</span>
              <span className="text-cosmic-gold text-3xl">⊹</span>
              <span className="text-cosmic-gold text-2xl">✧</span>
            </div>

            {/* Cita */}
            <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20">
              <p className="font-body text-lg text-gray-700 leading-relaxed italic text-center">
                "Las estrellas inclinan, pero no obligan. Tu carta natal es un mapa de posibilidades,
                no un libro de mandatos."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NODOS LUNARES - EJE DEL ALMA */}
      <div className="print-page bg-white p-12">
        <div className="max-w-3xl mx-auto">
          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-cosmic-gold mb-4">
              El Eje del Alma
            </h2>
            <p className="font-body text-lg text-gray-600">
              Nodos Lunares: De Dónde Vienes y Hacia Dónde Vas
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
          </div>

          <div className="space-y-8">
            {/* Nodo Sur - Zona de confort */}
            {southNode && (
              <div className="border-l-4 border-cosmic-amber pl-6">
                <h3 className="font-display text-2xl text-gray-800 mb-3 flex items-center">
                  <span className="text-cosmic-amber mr-3">☋</span>
                  Nodo Sur en {southNode.sign}
                </h3>
                <p className="font-body text-base text-gray-600 mb-3">
                  Casa {southNode.house || '?'} • {southNode.degree.toFixed(1)}°
                </p>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {tuMapaInterior?.soul_chart?.nodo_sur ||
                    `Tu Nodo Sur representa tus dones innatos, aquello que dominas sin esfuerzo.
                    En ${southNode.sign}, traes al mundo una maestría natural que ahora estás
                    invitada/o a expandir hacia nuevos territorios.`}
                </p>
              </div>
            )}

            {/* Nodo Norte - Camino evolutivo */}
            {northNode && (
              <div className="border-l-4 border-cosmic-gold pl-6">
                <h3 className="font-display text-2xl text-gray-800 mb-3 flex items-center">
                  <span className="text-cosmic-gold mr-3">☊</span>
                  Nodo Norte en {northNode.sign}
                </h3>
                <p className="font-body text-base text-gray-600 mb-3">
                  Casa {northNode.house || '?'} • {northNode.degree.toFixed(1)}°
                </p>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {tuMapaInterior?.soul_chart?.nodo_norte ||
                    `Tu Nodo Norte en ${northNode.sign} marca tu camino de crecimiento en esta vida.
                    Es el territorio que tu alma anhela explorar, aunque al principio pueda sentirse
                    incómodo o desafiante. Aquí es donde florece tu mayor potencial.`}
                </p>
              </div>
            )}

            {/* Reflexión guiada */}
            <div className="bg-cosmic-purple/5 p-8 rounded-lg border border-cosmic-gold/20 mt-8">
              <h4 className="font-display text-xl text-cosmic-gold mb-4">
                Reflexión: Integrando Tus Nodos
              </h4>
              <ul className="font-body text-base text-gray-700 leading-relaxed space-y-2">
                <li>• ¿Dónde siento que estoy operando desde mi zona de confort (Nodo Sur)?</li>
                <li>• ¿Qué áreas de mi vida requieren que me estire hacia lo nuevo (Nodo Norte)?</li>
                <li>• ¿Cómo puedo usar mis dones del Nodo Sur para servir mi evolución hacia el Norte?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PLANETAS DOMINANTES */}
      {dominantPlanets.length > 0 && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                Tus Planetas Clave
              </h2>
              <p className="font-body text-lg text-gray-600">
                Las Energías Dominantes en Tu Carta
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mt-4"></div>
            </div>

            <div className="space-y-6">
              {dominantPlanets.map((planet, idx) => (
                <div
                  key={idx}
                  className="border border-cosmic-gold/20 rounded-lg p-6 hover:bg-cosmic-purple/5 transition-colors"
                >
                  <h3 className="font-display text-xl text-gray-800 mb-2 flex items-center">
                    <span className="text-cosmic-gold mr-3 text-2xl">
                      {getPlanetSymbol(planet.name)}
                    </span>
                    {planet.name} en {planet.sign}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mb-3">
                    Casa {planet.house || '?'} • {planet.degree.toFixed(1)}° {SIGN_SYMBOLS[planet.sign] || ''}
                  </p>
                  <p className="font-body text-base text-gray-700 leading-relaxed">
                    {getPlanetDescription(planet.name, planet.sign)}
                  </p>
                </div>
              ))}

              {tuMapaInterior?.soul_chart?.planeta_dominante && (
                <div className="bg-cosmic-purple/5 p-6 rounded-lg border border-cosmic-gold/20 mt-8">
                  <h4 className="font-display text-lg text-cosmic-gold mb-3">
                    Tu Planeta Dominante
                  </h4>
                  <p className="font-body text-base text-gray-700 leading-relaxed">
                    {tuMapaInterior.soul_chart.planeta_dominante}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PATRÓN DEL ALMA */}
      {tuMapaInterior?.soul_chart?.patron_alma && (
        <div className="print-page bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-cosmic-gold mb-4">
                El Patrón de Tu Alma
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
            </div>

            <div className="space-y-8">
              <p className="font-body text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {tuMapaInterior.soul_chart.patron_alma}
              </p>

              {/* Espacio para notas personales */}
              <div className="border-2 border-dashed border-cosmic-gold/30 rounded-lg p-8 min-h-[200px] mt-8">
                <h4 className="font-display text-xl text-cosmic-gold mb-4">
                  Mis Descubrimientos
                </h4>
                <p className="font-body text-sm text-gray-500 italic mb-4">
                  ¿Qué resuena contigo de esta información? ¿Qué patrones reconoces en tu vida?
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
      )}
    </>
  );
}

// Helpers
function getPlanetSymbol(name: string): string {
  const symbols: { [key: string]: string } = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇'
  };
  return symbols[name] || '●';
}

function getPlanetDescription(name: string, sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Sol': `Tu Sol en ${sign} representa tu esencia vital, tu propósito de vida y cómo brillas en el mundo.`,
    'Luna': `Tu Luna en ${sign} revela tus necesidades emocionales, tu mundo interior y cómo te nutres.`,
    'Mercurio': `Mercurio en ${sign} describe tu forma de pensar, comunicarte y procesar información.`,
    'Venus': `Venus en ${sign} muestra tus valores, cómo amas y qué te trae belleza y placer.`,
    'Marte': `Marte en ${sign} indica cómo tomas acción, tu energía física y qué te motiva.`,
    'Júpiter': `Júpiter en ${sign} señala dónde expandes, tus creencias y cómo encuentras significado.`,
    'Saturno': `Saturno en ${sign} marca tus responsabilidades, estructuras y lecciones de madurez.`
  };
  return descriptions[name] || `${name} en ${sign} añade una cualidad única a tu carta natal.`;
}
