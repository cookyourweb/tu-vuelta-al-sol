// =============================================================================
// 🎯 COMPLETE NATAL CHART PROMPT - FORMATO EDUCATIVO Y CLARO
// src/utils/prompts/completeNatalChartPrompt.ts
// Genera interpretación completa con lenguaje pedagógico y humano
// =============================================================================

export interface UserProfile {
  name: string;
  age: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface ChartData {
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    retrograde?: boolean;
  }>;
  houses: Array<{ number: number; sign: string; degree: number }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
}

// =============================================================================
// ELEMENT AND MODALITY CALCULATIONS
// =============================================================================

const FIRE_SIGNS = ['Aries', 'Leo', 'Sagittarius', 'Sagitario'];
const EARTH_SIGNS = ['Taurus', 'Tauro', 'Virgo', 'Capricorn', 'Capricornio'];
const AIR_SIGNS = ['Gemini', 'Géminis', 'Libra', 'Aquarius', 'Acuario'];
const WATER_SIGNS = ['Cancer', 'Cáncer', 'Scorpio', 'Escorpio', 'Pisces', 'Piscis'];

const CARDINAL_SIGNS = ['Aries', 'Cancer', 'Cáncer', 'Libra', 'Capricorn', 'Capricornio'];
const FIXED_SIGNS = ['Taurus', 'Tauro', 'Leo', 'Scorpio', 'Escorpio', 'Aquarius', 'Acuario'];
const MUTABLE_SIGNS = ['Gemini', 'Géminis', 'Virgo', 'Sagittarius', 'Sagitario', 'Pisces', 'Piscis'];

export function calculateElementDistribution(planets: ChartData['planets']) {
  const elements = { fire: [] as string[], earth: [] as string[], air: [] as string[], water: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (FIRE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.fire.push(p.name);
    else if (EARTH_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.earth.push(p.name);
    else if (AIR_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.air.push(p.name);
    else if (WATER_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.water.push(p.name);
  });

  const total = planets.length || 1;
  return {
    fire: { count: elements.fire.length, percentage: Math.round((elements.fire.length / total) * 100), planets: elements.fire },
    earth: { count: elements.earth.length, percentage: Math.round((elements.earth.length / total) * 100), planets: elements.earth },
    air: { count: elements.air.length, percentage: Math.round((elements.air.length / total) * 100), planets: elements.air },
    water: { count: elements.water.length, percentage: Math.round((elements.water.length / total) * 100), planets: elements.water },
  };
}

export function calculateModalityDistribution(planets: ChartData['planets']) {
  const modalities = { cardinal: [] as string[], fixed: [] as string[], mutable: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (CARDINAL_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.cardinal.push(p.name);
    else if (FIXED_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.fixed.push(p.name);
    else if (MUTABLE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.mutable.push(p.name);
  });

  const total = planets.length || 1;
  return {
    cardinal: { count: modalities.cardinal.length, percentage: Math.round((modalities.cardinal.length / total) * 100), planets: modalities.cardinal },
    fixed: { count: modalities.fixed.length, percentage: Math.round((modalities.fixed.length / total) * 100), planets: modalities.fixed },
    mutable: { count: modalities.mutable.length, percentage: Math.round((modalities.mutable.length / total) * 100), planets: modalities.mutable },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function findPlanet(planets: ChartData['planets'], ...names: string[]) {
  return planets.find(p => names.some(n => p.name.toLowerCase().includes(n.toLowerCase())));
}

function formatPlanetsForPrompt(planets: ChartData['planets']): string {
  return planets.map(p =>
    `- ${p.name}: ${p.sign} ${p.degree}° Casa ${p.house}${p.retrograde ? ' (R)' : ''}`
  ).join('\n');
}

function formatAspectsForPrompt(aspects: ChartData['aspects']): string {
  if (!aspects || aspects.length === 0) return 'No hay aspectos calculados';
  return aspects.slice(0, 15).map(a => `- ${a.planet1} ${a.type} ${a.planet2} (orbe: ${a.orb}°)`).join('\n');
}

// =============================================================================
// MAIN PROMPT GENERATOR
// =============================================================================

export function generateCompleteNatalChartPrompt(chartData: ChartData, userProfile: UserProfile): string {
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  const sun = findPlanet(chartData.planets, 'sol', 'sun');
  const moon = findPlanet(chartData.planets, 'luna', 'moon');
  const mercury = findPlanet(chartData.planets, 'mercurio', 'mercury');
  const venus = findPlanet(chartData.planets, 'venus');
  const mars = findPlanet(chartData.planets, 'marte', 'mars');
  const jupiter = findPlanet(chartData.planets, 'júpiter', 'jupiter');
  const saturn = findPlanet(chartData.planets, 'saturno', 'saturn');
  const uranus = findPlanet(chartData.planets, 'urano', 'uranus');
  const neptune = findPlanet(chartData.planets, 'neptuno', 'neptune');
  const pluto = findPlanet(chartData.planets, 'plutón', 'pluto', 'pluton');
  const northNode = findPlanet(chartData.planets, 'nodo norte', 'north node', 'rahu');
  const southNode = findPlanet(chartData.planets, 'nodo sur', 'south node', 'ketu');
  const chiron = findPlanet(chartData.planets, 'quirón', 'chiron');

  return `Eres un astrólogo pedagógico que explica conceptos complejos de forma clara y humana.

Tu tarea: Generar un INFORME NATAL CLARO Y EDUCATIVO para ${userProfile.name}, como si fuera para alguien que NO sabe nada de astrología.

═══════════════════════════════════════════════
📊 DATOS DE LA CARTA NATAL
═══════════════════════════════════════════════

PERSONA:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Nacimiento: ${userProfile.birthDate} a las ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

POSICIONES PLANETARIAS:
${formatPlanetsForPrompt(chartData.planets)}

Ascendente: ${chartData.ascendant.sign} ${Math.floor(chartData.ascendant.degree)}°
Medio Cielo: ${chartData.midheaven.sign} ${Math.floor(chartData.midheaven.degree)}°

ASPECTOS PRINCIPALES:
${formatAspectsForPrompt(chartData.aspects)}

═══════════════════════════════════════════════
⚡ ESTILO Y TONO OBLIGATORIO
═══════════════════════════════════════════════

LENGUAJE:
✅ Claro, pedagógico, humano
✅ Como si le explicaras a alguien sin conocimientos de astrología
✅ Usa "Eres...", "Tu propósito es...", "Naciste para..."
✅ Explica conceptos sin tecnicismos
✅ Conecta infancia → patrón adulto → sombra → luz

PROHIBIDO:
❌ Lenguaje épico o místico ("Alma Radical", "Esencia Revolucionaria")
❌ Lenguaje temporal ("Este año...", "Durante 2025...")
❌ Declaraciones dramáticas ("YO, [NOMBRE], MANIFIESTO MI PODER...")
❌ Espiritualidad vacía o new age
❌ Tecnicismos sin explicar

RECUERDA: Este es un INFORME EDUCATIVO, no una declaración mística.

═══════════════════════════════════════════════
📋 ESTRUCTURA JSON REQUERIDA
═══════════════════════════════════════════════

Responde ÚNICAMENTE con JSON válido en este formato EXACTO:

{
  "sol": {
    "titulo": "☀️ SOL EN ${sun?.sign.toUpperCase()} EN CASA ${sun?.house}",
    "subtitulo": "→ TU PROPÓSITO DE VIDA",
    "explicacion_casa": "(Casa ${sun?.house}: ${getHouseExplanation(sun?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Explica qué significa tener el Sol en este signo y casa. Qué propósito trae.",
      "Párrafo 2: Cómo se formó desde pequeño. Qué experiencias moldearon esta energía.",
      "Párrafo 3: Cómo se manifiesta en la vida adulta. Ejemplos concretos.",
      "Párrafo 4 (opcional): Integración de luz y sombra."
    ],
    "cierre": {
      "energia_vital": "Una frase sobre cuándo se activa su energía vital",
      "don_mayor": "Una frase sobre su mayor don en esta área"
    }
  },

  "luna": {
    "titulo": "🌙 LUNA EN ${moon?.sign.toUpperCase()} EN CASA ${moon?.house}",
    "subtitulo": "→ TUS EMOCIONES",
    "explicacion_casa": "(Casa ${moon?.house}: ${getHouseExplanation(moon?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Qué necesita emocionalmente. Cómo funciona su mundo emocional.",
      "Párrafo 2: Qué aprendió de niño sobre las emociones. Cómo se formaron sus patrones.",
      "Párrafo 3: Cómo se manifiesta en la vida adulta. Qué pasa cuando no se escucha.",
      "Párrafo 4: Capacidad de transformación y sensibilidad como herramienta."
    ],
    "cierre": "Una frase de cierre sobre su sensibilidad."
  },

  "ascendente": {
    "titulo": "🎭 ASCENDENTE EN ${chartData.ascendant.sign.toUpperCase()}",
    "subtitulo": "→ TU PERSONALIDAD",
    "explicacion_casa": "(Cómo te perciben los demás, primera impresión, forma de iniciar la vida)",
    "parrafos": [
      "Párrafo 1: Cómo es su personalidad visible. Qué perciben los demás antes de conocerle.",
      "Párrafo 2: Desde cuándo se activó esta energía. Cómo la vivió de joven.",
      "Párrafo 3: Cómo integrarla conscientemente. Cuándo inspira sin esfuerzo."
    ],
    "cierre": "Una frase sobre el efecto de su presencia."
  },

  "mercurio": {
    "titulo": "🧠 MERCURIO EN ${mercury?.sign.toUpperCase()} EN CASA ${mercury?.house}",
    "subtitulo": "→ CÓMO PIENSAS Y CÓMO HABLAS",
    "explicacion_casa": "(Casa ${mercury?.house}: ${getHouseExplanation(mercury?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Cómo funciona su mente. Cómo procesa información.",
      "Párrafo 2: Qué pasó en su infancia con la comunicación/aprendizaje.",
      "Párrafo 3: Sombra: Cuándo se satura o dispersa. Por qué ocurre.",
      "Párrafo 4: Luz: Cuándo su comunicación inspira. Su superpoder mental."
    ],
    "cierre": "Una frase sobre el poder de su palabra."
  },

  "venus": {
    "titulo": "💎 VENUS EN ${venus?.sign.toUpperCase()} EN CASA ${venus?.house}",
    "subtitulo": "→ CÓMO AMAS",
    "explicacion_casa": "(Casa ${venus?.house}: ${getHouseExplanation(venus?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Cómo ama. Qué necesita en las relaciones.",
      "Párrafo 2: Qué aprendió sobre el amor de niño. Qué modelo vio.",
      "Párrafo 3: Sombra: Cuándo se cierra o busca seguridad por miedo.",
      "Párrafo 4: Luz: Cuándo su amor construye y transforma."
    ],
    "cierre": "Una frase sobre su capacidad de amar."
  },

  "marte": {
    "titulo": "⚔️ MARTE EN ${mars?.sign.toUpperCase()} EN CASA ${mars?.house}",
    "subtitulo": "→ CÓMO ENFRENTAS LA VIDA",
    "explicacion_casa": "(Casa ${mars?.house}: ${getHouseExplanation(mars?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Cómo actúa. Cómo enfrenta obstáculos.",
      "Párrafo 2: Qué aprendió sobre la acción/iniciativa de niño.",
      "Párrafo 3: Sombra o luz según la posición."
    ],
    "cierre": "Una frase sobre su fuerza."
  },

  "jupiter": {
    "titulo": "🍀 JÚPITER EN ${jupiter?.sign.toUpperCase()} EN CASA ${jupiter?.house}",
    "subtitulo": "→ TU SUERTE Y TUS GANANCIAS",
    "explicacion_casa": "(Casa ${jupiter?.house}: ${getHouseExplanation(jupiter?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Dónde tiene suerte natural. Cómo se expande.",
      "Párrafo 2: Qué vio de niño sobre abundancia/optimismo.",
      "Párrafo 3: Luz y sombra de esta expansión."
    ],
    "cierre": "Una frase sobre su abundancia."
  },

  "saturno": {
    "titulo": "⏳ SATURNO EN ${saturn?.sign.toUpperCase()} EN CASA ${saturn?.house}",
    "subtitulo": "→ TU KARMA Y RESPONSABILIDADES",
    "explicacion_casa": "(Casa ${saturn?.house}: ${getHouseExplanation(saturn?.house || 1)})",
    "parrafos": [
      "Párrafo 1: Qué aprende con esfuerzo. Dónde construye maestría.",
      "Párrafo 2: Qué sintió de niño sobre responsabilidad/límites.",
      "Párrafo 3: Cómo esto se convierte en fortaleza con el tiempo."
    ],
    "cierre": "Una frase sobre lo que construye."
  },

  "nodos_lunares": {
    "titulo": "🌟 DIRECCIÓN EVOLUTIVA DEL ALMA",
    "nodo_norte": {
      "titulo_seccion": "⬆️ Nodo Norte en ${northNode?.sign || 'Desconocido'} en Casa ${northNode?.house || '?'}",
      "explicacion_casa": "(${getHouseExplanation(northNode?.house || 1)})",
      "parrafos": [
        "Párrafo 1: Hacia dónde crece su alma. Qué necesita desarrollar.",
        "Párrafo 2: Por qué se siente incómodo. Por qué es ahí donde está la evolución."
      ]
    },
    "nodo_sur": {
      "titulo_seccion": "⬇️ Nodo Sur en ${southNode?.sign || getOppositeSign(northNode?.sign)} en Casa ${southNode?.house || getOppositeHouse(northNode?.house)}",
      "explicacion_casa": "(${getHouseExplanation(southNode?.house || getOppositeHouse(northNode?.house))})",
      "parrafos": [
        "Párrafo 1: Qué ya domina. Cuál es su zona de confort.",
        "Párrafo 2: El riesgo de quedarse ahí. Cómo usar este talento al servicio del Nodo Norte."
      ]
    }
  },

  "integracion_final": {
    "titulo": "🌈 INTEGRACIÓN FINAL",
    "parrafos": [
      "Párrafo 1: Tu carta natal no es un destino, es un mapa de conciencia.",
      "Párrafo 2: Cada planeta es una parte de ti, cada casa un escenario donde te expresas.",
      "Párrafo 3: Cuando integras [mencionar elementos clave de su carta], te conviertes en alguien que no solo vive su vida, sino que inspira a otros a vivir la suya."
    ]
  }
}

═══════════════════════════════════════════════
🏠 SIGNIFICADOS DE LAS CASAS (para tu referencia)
═══════════════════════════════════════════════

Casa 1: identidad, forma de ser, cómo te presentas al mundo
Casa 2: valores, dinero, recursos propios, autoestima
Casa 3: comunicación, aprendizaje, hermanos, entorno cercano
Casa 4: hogar, familia, raíces, mundo interior
Casa 5: creatividad, romance, autoexpresión, hijos, placer
Casa 6: trabajo diario, salud, rutinas, servicio
Casa 7: relaciones, pareja, asociaciones, el otro
Casa 8: transformación profunda, intimidad, recursos compartidos, muerte/renacimiento
Casa 9: filosofía, viajes largos, educación superior, búsqueda de sentido
Casa 10: carrera, reputación pública, autoridad, legado
Casa 11: amistades, comunidad, sueños, causas colectivas, la visión futura y la expansión colectiva
Casa 12: espiritualidad, subconsciente, karma, retiro, lo oculto, mundo interior

═══════════════════════════════════════════════
✅ CHECKLIST ANTES DE RESPONDER
═══════════════════════════════════════════════

□ ¿Usé lenguaje CLARO y PEDAGÓGICO sin épica?
□ ¿Expliqué cada concepto como si la persona no supiera astrología?
□ ¿Conecté infancia → patrón adulto en cada sección?
□ ¿Evité lenguaje temporal ("este año", "durante 2025")?
□ ¿Evité lenguaje épico ("Alma Radical", "Esencia Revolucionaria")?
□ ¿Usé "Eres...", "Tu propósito es...", "Naciste para..."?
□ ¿El JSON está completo y válido?

**AHORA GENERA EL INFORME NATAL COMPLETO EN JSON.**
`;
}

function getHouseExplanation(house: number): string {
  const explanations: Record<number, string> = {
    1: 'identidad, forma de ser, cómo te presentas al mundo',
    2: 'valores, dinero, recursos propios, autoestima',
    3: 'comunicación, aprendizaje, hermanos, entorno cercano',
    4: 'hogar, familia, raíces, mundo interior',
    5: 'creatividad, romance, autoexpresión, hijos, placer',
    6: 'trabajo diario, salud, rutinas, servicio',
    7: 'relaciones, pareja, asociaciones, el otro',
    8: 'transformación profunda, intimidad, recursos compartidos',
    9: 'filosofía, viajes largos, educación superior, búsqueda de sentido',
    10: 'carrera, reputación pública, autoridad, legado',
    11: 'amistades, comunidad, sueños, causas colectivas, la visión futura y la expansión colectiva',
    12: 'espiritualidad, subconsciente, karma, retiro, lo oculto'
  };
  return explanations[house] || 'área de vida';
}

function getOppositeSign(sign?: string): string {
  const opposites: Record<string, string> = {
    'Aries': 'Libra', 'Libra': 'Aries',
    'Tauro': 'Escorpio', 'Taurus': 'Scorpio', 'Escorpio': 'Tauro', 'Scorpio': 'Taurus',
    'Géminis': 'Sagitario', 'Gemini': 'Sagittarius', 'Sagitario': 'Géminis', 'Sagittarius': 'Gemini',
    'Cáncer': 'Capricornio', 'Cancer': 'Capricorn', 'Capricornio': 'Cáncer', 'Capricorn': 'Cancer',
    'Leo': 'Acuario', 'Acuario': 'Leo', 'Aquarius': 'Leo',
    'Virgo': 'Piscis', 'Piscis': 'Virgo', 'Pisces': 'Virgo'
  };
  return sign ? (opposites[sign] || sign) : 'Desconocido';
}

function getOppositeHouse(house?: number): number {
  if (!house) return 1;
  return house <= 6 ? house + 6 : house - 6;
}

export default generateCompleteNatalChartPrompt;
