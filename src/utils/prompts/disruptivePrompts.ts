// src/utils/prompts/disruptivePrompts.ts
// SISTEMA DE PROMPTS DISRUPTIVOS PARA INTERPRETACIONES ASTROLÓGICAS

// ✅ INTERFACES
export interface ChartData {
  planets: any[];
  houses: any[];
  ascendant?: any;
  keyAspects?: any[];
}

export interface UserProfile {
  name: string;
  age: number;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
}

// ✅ HELPER: Extraer signo principal
const extractMainSign = (chartData: ChartData): string => {
  if (chartData.ascendant?.sign) return chartData.ascendant.sign;
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return sun?.sign || 'Acuario';
};

// ✅ HELPER: Extraer signo solar
const extractSolarSign = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return sun?.sign || 'Acuario';
};

// ✅ HELPER: Extraer grado solar
const extractSolarDegree = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return sun?.degree?.toFixed(0) || '0';
};

// ✅ HELPER: Extraer minutos solar
const extractSolarMinutes = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return sun?.minutes?.toString() || '0';
};

// ✅ HELPER: Extraer casa solar
const extractSolarHouse = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return (sun?.houseNumber || sun?.house || '?').toString();
};

// ✅ HELPER: Significado de casa
const getCasaMeaning = (house: string | number): string => {
  const meanings: { [key: string]: string } = {
    '1': 'identidad y presencia',
    '2': 'recursos y valores',
    '3': 'comunicación y aprendizaje',
    '4': 'hogar y raíces',
    '5': 'creatividad y romance',
    '6': 'trabajo y salud',
    '7': 'relaciones y asociaciones',
    '8': 'transformación profunda',
    '9': 'sabiduría y expansión',
    '10': 'carrera y legado',
    '11': 'comunidad e ideales',
    '12': 'espiritualidad y liberación',
    '?': 'tu zona de poder'
  };
  return meanings[house.toString()] || 'tu zona de poder';
};

// ✅ HELPER: Extraer configuración de casas
const extractHouseConfig = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  const moon = chartData.planets?.find(p => p.name === 'Luna' || p.name === 'Moon');
  const venus = chartData.planets?.find(p => p.name === 'Venus');
  
  let config = '';
  if (sun) config += `Sol en ${sun.sign} Casa ${sun.houseNumber || sun.house || 'desconocida'}. `;
  if (moon) config += `Luna en ${moon.sign} Casa ${moon.houseNumber || moon.house || 'desconocida'}. `;
  if (venus) config += `Venus en ${venus.sign} Casa ${venus.houseNumber || venus.house || 'desconocida'}. `;
  
  return config || 'Configuración revolucionaria única';
};

// ✅ HELPER: Formatear todos los planetas
const formatAllPlanets = (chartData: ChartData): string => {
  if (!chartData.planets) return 'Planetas no disponibles';
  
  return chartData.planets
    .map(p => {
      const house = p.houseNumber || p.house || '?';
      const retro = p.isRetrograde || p.retrograde ? ' (R)' : '';
      return `${p.name}: ${p.sign} ${p.degree?.toFixed(1) || ''}° - Casa ${house}${retro}`;
    })
    .join('\n');
};

// ✅ PROMPT PRINCIPAL NATAL
export const generateDisruptiveNatalPrompt = (chartData: ChartData, userProfile: UserProfile): string => {
  const mainSign = extractMainSign(chartData);
  const houseConfig = extractHouseConfig(chartData);
  const allPlanets = formatAllPlanets(chartData);
  
  // Extraer datos específicos para el template
  const solarSign = extractSolarSign(chartData);
  const solarDegree = extractSolarDegree(chartData);
  const solarMinutes = extractSolarMinutes(chartData);
  const solarHouse = extractSolarHouse(chartData);
  const casaMeaning = getCasaMeaning(solarHouse);

  return `
Actúa como un astrólogo evolutivo DISRUPTIVO y REVOLUCIONARIO con enfoque transformacional extremo.

DATOS ASTROLÓGICOS DE ${userProfile.name.toUpperCase()}:
${houseConfig}

POSICIONES PLANETARIAS COMPLETAS:
${allPlanets}

ENFOQUE OBLIGATORIO - ASTROLOGÍA ANTIFRAGILE:
1. NO interpretes - ACTIVA. Convierte cada posición planetaria en PODER PERSONAL.
2. LENGUAJE DISRUPTIVO: Directo, sin filtros, transformacional, que despierte.
3. ENFOQUE REVOLUCIONARIO: ${userProfile.name} vino a cambiar paradigmas, no a encajar.
4. PLAN DE ACCIÓN ESPECÍFICO: Qué hacer HOY, ESTA SEMANA, ESTE MES.
5. INTERPRETACIÓN PLANETA POR PLANETA: Cada planeta debe tener su sección única.

ESTRUCTURA JSON OBLIGATORIA (RESPONDE SOLO CON ESTE JSON, sin markdown ni texto extra):
{
  "esencia_revolucionaria": "Declaración potente de 2-3 líneas sobre ${userProfile.name}",
  "proposito_vida": "Misión específica en este planeta - qué vino a revolucionar",
  
  "planetas": {
    "sol": {
      "titulo": "☉ Sol en ${solarSign} ${solarDegree}° - Casa ${solarHouse} → A qué has venido a este mundo",
      "posicion_tecnica": "${solarDegree}°${solarMinutes}' ${solarSign} - Casa ${solarHouse} (${casaMeaning})",
      "descripcion": "Interpretación en 2-3 párrafos NATURALES. Párrafo 1: Explica qué significa el Sol en este signo y casa de forma educativa. Párrafo 2: Cómo se manifiesta específicamente en la vida de ${userProfile.name}. Párrafo 3 (opcional): Retos y oportunidades. Mantén tono disruptivo pero claro.",
      "poder_especifico": "Poder único que le da esta posición del Sol",
      "accion_inmediata": "Acción concreta que ${userProfile.name} puede hacer HOY",
      "ritual": "Ritual específico relacionado con el Sol"
    },
    "luna": {
      "titulo": "☽ Luna en [Signo Real] [Grado]° - Casa [X] → Tus emociones",
      "posicion_tecnica": "[Grado]°[Minutos]' [Signo] - Casa [X] ([significado casa])",
      "descripcion": "2-3 párrafos naturales y educativos sobre emociones",
      "poder_especifico": "Inteligencia emocional única",
      "accion_inmediata": "Cómo honrar emociones HOY",
      "ritual": "Ritual lunar específico"
    },
    "mercurio": {
      "titulo": "☿ Mercurio en [Signo] [Grado]° - Casa [X] → Cómo piensas y hablas",
      "posicion_tecnica": "[Grado]°[Minutos]' [Signo] - Casa [X] ([significado])",
      "descripcion": "2 párrafos sobre mente y comunicación",
      "poder_especifico": "Genialidad mental única",
      "accion_inmediata": "Cómo usar Mercurio HOY"
    },
    "venus": {
      "titulo": "♀ Venus en [Signo] [Grado]° - Casa [X] → Cómo amas",
      "posicion_tecnica": "[Grado]°[Minutos]' [Signo] - Casa [X] ([significado])",
      "descripcion": "2 párrafos sobre amor y valores",
      "poder_especifico": "Magnetismo único",
      "accion_inmediata": "Cómo activar Venus HOY"
    },
    "marte": {
      "titulo": "♂ Marte en [Signo] [Grado]° - Casa [X] → Cómo enfrentas la vida",
      "posicion_tecnica": "[Grado]°[Minutos]' [Signo] - Casa [X] ([significado])",
      "descripcion": "2 párrafos sobre acción y deseo",
      "poder_especifico": "Poder de acción único",
      "accion_inmediata": "Cómo canalizar Marte HOY"
    },
    "jupiter": {
      "titulo": "♃ Júpiter en [Signo] - Casa [X] → Tu suerte, tus ganancias",
      "posicion_tecnica": "[Grado]° [Signo] - Casa [X] ([significado])",
      "descripcion": "2 párrafos sobre expansión y suerte",
      "poder_especifico": "Dónde tiene suerte natural",
      "accion_inmediata": "Cómo expandir HOY"
    },
    "saturno": {
      "titulo": "♄ Saturno en [Signo] - Casa [X] → Tu karma, tus responsabilidades",
      "posicion_tecnica": "[Grado]° [Signo] - Casa [X] ([significado])",
      "descripcion": "2 párrafos sobre maestría y lecciones",
      "poder_especifico": "Lección maestra de vida",
      "accion_inmediata": "Cómo trabajar con Saturno HOY"
    },
    "urano": {
      "titulo": "♅ Urano en [Signo] - Casa [X] → Tu revolución personal",
      "posicion_tecnica": "[Grado]° [Signo] - Casa [X] ([significado])",
      "descripcion": "1-2 párrafos sobre innovación",
      "poder_especifico": "Dónde es revolucionario"
    },
    "neptuno": {
      "titulo": "♆ Neptuno en [Signo] - Casa [X] → Tu espiritualidad",
      "posicion_tecnica": "[Grado]° [Signo] - Casa [X] ([significado])",
      "descripcion": "1-2 párrafos sobre conexión espiritual",
      "poder_especifico": "Conexión espiritual única"
    },
    "pluton": {
      "titulo": "♇ Plutón en [Signo] - Casa [X] → Tu poder de transformación",
      "posicion_tecnica": "[Grado]° [Signo] - Casa [X] ([significado])",
      "descripcion": "1-2 párrafos sobre regeneración",
      "poder_especifico": "Poder regenerativo"
    }
  },
  
  "integracion_carta": {
    "titulo": "Integración de tu Carta Natal",
    "sintesis": "Párrafo integrando los elementos principales de la carta de ${userProfile.name}. Conecta Sol, Luna, Ascendente y configuraciones destacadas en una visión coherente del camino evolutivo.",
    "elementos_destacados": [
      "Configuración o patrón destacado 1 (ej: stellium, gran trígono, etc.)",
      "Configuración o patrón destacado 2"
    ],
    "camino_evolutivo": "Qué viene a aprender y manifestar ${userProfile.name} en esta encarnación. Visión del propósito global de la carta."
  },
  
  "plan_accion": {
    "hoy_mismo": ["acción específica 1", "acción 2", "acción 3"],
    "esta_semana": ["acción 1", "acción 2", "acción 3"],
    "este_mes": ["acción 1", "acción 2", "acción 3"]
  },
  
  "declaracion_poder": "YO, ${userProfile.name.toUpperCase()}, [declaración poderosa en primera persona]",
  
  "advertencias": [
    "Advertencia honesta 1 sobre lo que limita a ${userProfile.name}",
    "Patrón autodestructivo 2",
    "Mentira que se está diciendo 3"
  ],
  
  "insights_transformacionales": [
    "Insight 1 basado en aspectos reales",
    "Insight 2",
    "Insight 3",
    "Insight 4",
    "Insight 5"
  ],
  
  "rituales_recomendados": [
    "Ritual 1 específico basado en la configuración",
    "Ritual 2",
    "Ritual 3"
  ]
}

RECUERDA: 
- Usa signos, casas y grados REALES de los datos proporcionados
- Mantén tono disruptivo pero natural y educativo
- No exageres - sé poderoso pero claro
- Cada descripción debe tener 2-3 párrafos bien estructurados
- NO uses markdown, NO agregues texto fuera del JSON
`;
};

// ✅ PROMPT PROGRESADA
export const generateDisruptiveProgressedPrompt = (
  progressedChart: ChartData, 
  natalChart: ChartData, 
  userProfile: UserProfile,
  natalInterpretation?: any
): string => {
  const progressedConfig = extractHouseConfig(progressedChart);
  const natalConfig = extractHouseConfig(natalChart);
  
  return `
Actúa como un astrólogo evolutivo que analiza PROGRESIONES SECUNDARIAS con enfoque ANTIFRAGILE y transformacional.

ANÁLISIS DE EVOLUCIÓN PARA ${userProfile.name.toUpperCase()}:

CARTA NATAL (Base):
${natalConfig}

CARTA PROGRESADA ACTUAL (Evolución):
${progressedConfig}

CONTEXTO DE EVOLUCIÓN:
- Edad actual: ${userProfile.age} años
- Progresión: ${progressedChart ? 'Datos reales' : 'Simulación evolutiva'}
${natalInterpretation ? `- Esencia natal conocida: ${natalInterpretation.esencia_revolucionaria || 'Revolucionario/a auténtico/a'}` : ''}

ENFOQUE OBLIGATORIO:
1. ANALIZA la evolución entre natal y progresada - qué energías se activaron
2. IDENTIFICA nuevos poderes disponibles ahora que no tenía antes
3. CONECTA la evolución con el momento de vida actual
4. PLAN DE ACTIVACIÓN específico para integrar las nuevas energías

ESTRUCTURA JSON OBLIGATORIA:
{
  "tema_anual": "Tema evolutivo central de este período - específico y transformacional",
  "evolucion_personalidad": "Cómo ha evolucionado desde el nacimiento - específico basado en progresiones",
  "nuevas_fortalezas": [
    "3-4 nuevos poderes/capacidades disponibles ahora",
    "Basados en cambios específicos entre natal y progresada"
  ],
  "plan_accion_evolutivo": {
    "activar_ahora": [
      "Qué debe activar inmediatamente basado en progresiones",
      "Cómo integrar las nuevas energías en la vida diaria"
    ],
    "soltar_obsoleto": [
      "Qué patrones/creencias del pasado debe soltar",
      "Comportamientos que ya no sirven a su evolución"
    ],
    "expandir_territorio": [
      "Nuevas áreas de vida que debe explorar",
      "Oportunidades específicas que ahora puede abordar"
    ]
  },
  "comparacion_evolutiva": {
    "natal_vs_progresada": "Análisis directo de los cambios planetarios más significativos",
    "activaciones_casas": "Qué casas se activaron y qué significa para su vida práctica",
    "aspectos_evolutivos": "Nuevos aspectos formados y su impacto transformacional"
  },
  "mensaje_activacion": "Mensaje directo y poderoso sobre quién es ahora vs quién era al nacer",
  "rituales_integracion": [
    "Rituales específicos para integrar las progresiones",
    "Prácticas que honren su evolución actual"
  ]
}

REGLAS ESPECÍFICAS:
- Compara posiciones exactas entre natal y progresada (usa houseNumber)
- Menciona cambios específicos de signos, casas, aspectos
- Conecta la evolución astrológica con la edad actual (${userProfile.age} años)
- Todo debe ser específico para la configuración de ${userProfile.name}
- Enfoque en ACTIVACIÓN, no solo descripción

RESPONDE SOLO CON JSON VÁLIDO.`;
};

// ✅ PROMPT AGENDA
export const generateAgendaInterpretationPrompt = (
  userProfile: UserProfile,
  natalChart: ChartData,
  progressedChart?: ChartData,
  natalInterpretation?: any
): string => {
  return `
Genera eventos astrológicos personalizados para ${userProfile.name} basados en su configuración única.

CONFIGURACIÓN ASTROLÓGICA:
${extractHouseConfig(natalChart)}
${natalInterpretation ? `Esencia revolucionaria: ${natalInterpretation.esencia_revolucionaria}` : ''}

GENERAR 12 EVENTOS ANUALES que conecten con su naturaleza específica:
- 4 Lunas Nuevas (manifestación)
- 4 Lunas Llenas (liberación)
- 2 Retrogradaciones importantes (revisión interna)
- 2 Tránsitos específicos a su carta natal

CADA EVENTO DEBE INCLUIR:
{
  "date": "2025-MM-DD",
  "title": "Título específico conectado con su configuración",
  "type": "luna_nueva|luna_llena|retrogrado|transito",
  "importance": "alta|media|baja",
  "description": "Descripción astrológica técnica",
  "personalizedInterpretation": {
    "meaning": "Significado específico para ${userProfile.name} basado en su carta",
    "advice": "Consejo práctico conectado con su esencia revolucionaria",
    "mantra": "Mantra personal basado en el evento y su configuración",
    "ritual": "Ritual específico que honre su naturaleza astrológica"
  }
}

REGLAS:
- Conecta cada evento con su configuración natal específica
- Menciona posiciones, casas y aspectos reales de su carta (usa houseNumber)
- Eventos distribuidos a lo largo del año
- Cada interpretación debe ser única para ${userProfile.name}

RESPONDE CON ARRAY JSON DE 12 EVENTOS.`;
};

// ✅ UTILIDADES
export const formatChartForPrompt = (chartData: ChartData): string => {
  if (!chartData) return 'Datos no disponibles';
  
  const planets = chartData.planets?.map(p => {
    const house = p.houseNumber || p.house || '?';
    return `${p.name}: ${p.sign} ${p.degree?.toFixed(1)}° Casa ${house}`;
  }).join('\n') || '';
  
  const aspects = chartData.keyAspects?.map(a => 
    `${a.planet1} ${a.aspect} ${a.planet2} (${a.orb?.toFixed(1)}°)`
  ).join('\n') || '';
  
  return `
PLANETAS:
${planets}

ASPECTOS PRINCIPALES:
${aspects}

ASCENDENTE: ${chartData.ascendant?.sign} ${chartData.ascendant?.degree?.toFixed(1)}°
`;
};