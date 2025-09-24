// src/utils/prompts/disruptivePrompts.ts
// SISTEMA DE PROMPTS DISRUPTIVOS PARA INTERPRETACIONES ASTROLÓGICAS

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

// ✅ HELPER: Extraer configuración principal
const extractMainSign = (chartData: ChartData): string => {
  if (chartData.ascendant?.sign) return chartData.ascendant.sign;
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  return sun?.sign || 'Acuario';
};

const extractHouseConfig = (chartData: ChartData): string => {
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  const moon = chartData.planets?.find(p => p.name === 'Luna' || p.name === 'Moon');
  const venus = chartData.planets?.find(p => p.name === 'Venus');
  
  let config = '';
  if (sun) config += `Sol en ${sun.sign} Casa ${sun.house}. `;
  if (moon) config += `Luna en ${moon.sign} Casa ${moon.house}. `;
  if (venus) config += `Venus en ${venus.sign} Casa ${venus.house}. `;
  
  return config || 'Configuración revolucionaria única';
};

// ✅ PROMPT DISRUPTIVO PARA CARTA NATAL
export const generateDisruptiveNatalPrompt = (chartData: ChartData, userProfile: UserProfile): string => {
  const mainSign = extractMainSign(chartData);
  const houseConfig = extractHouseConfig(chartData);
  
  return `
Actúa como un astrólogo evolutivo DISRUPTIVO y REVOLUCIONARIO con enfoque transformacional extremo.

DATOS ASTROLÓGICOS DE ${userProfile.name.toUpperCase()}:
${houseConfig}
Configuración completa: ${JSON.stringify(chartData, null, 2)}

ENFOQUE OBLIGATORIO - ASTROLOGÍA ANTIFRAGILE:
1. NO interpretes - ACTIVA. Convierte cada posición planetaria en PODER PERSONAL.
2. LENGUAJE DISRUPTIVO: Directo, sin filtros, transformacional, que despierte.
3. ENFOQUE REVOLUCIONARIO: ${userProfile.name} vino a cambiar paradigmas, no a encajar.
4. PLAN DE ACCIÓN ESPECÍFICO: Qué hacer HOY, ESTA SEMANA, ESTE MES.

ESTRUCTURA JSON OBLIGATORIA:
{
  "esencia_revolucionaria": "Declaración potente de 2-3 líneas sobre su naturaleza disruptiva única basada en ${mainSign}",
  "proposito_vida": "Su misión específica en este planeta - qué vino a revolucionar exactamente",
  "plan_accion": {
    "hoy_mismo": [
      "Acción específica que puede hacer hoy para activar su poder",
      "Algo que debe eliminar/rechazar hoy mismo",
      "Una verdad radical que debe declarar hoy"
    ],
    "esta_semana": [
      "Proyecto/conexión que debe iniciar esta semana",
      "Límite que debe establecer esta semana",
      "Oportunidad que debe rechazar si no honra su naturaleza"
    ],
    "este_mes": [
      "Algo tangible que debe lanzar/crear este mes",
      "Inversión en su poder personal (educación/herramientas)",
      "Transformación completa de un área de su vida"
    ]
  },
  "declaracion_poder": "Declaración en primera persona que debe repetir diariamente - poderosa, específica a su carta natal",
  "advertencias": [
    "Advertencia brutalmente honesta sobre lo que le está limitando",
    "Patrón autodestructivo que debe romper YA",
    "Mentira que se está diciendo a sí mismo/a"
  ],
  "insights_transformacionales": [
    "3-5 insights específicos basados en sus aspectos exactos",
    "Cada insight debe conectar posiciones planetarias con PODER REAL"
  ],
  "rituales_recomendados": [
    "3 rituales específicos basados en su configuración astrológica",
    "Deben ser prácticos y activadores de su esencia"
  ]
}

REGLAS CRÍTICAS:
- USA los datos astrológicos ESPECÍFICOS - menciona grados, casas, aspectos exactos
- Conecta cada consejo con su configuración planetaria real
- EVITA generalidades - todo debe ser específico para ${userProfile.name}
- Lenguaje directo, sin suavizar - la transformación real requiere honestidad brutal
- Cada elemento debe activar su ANTIFRAGILIDAD astrológica

RESPONDE SOLO CON JSON VÁLIDO - NO agregues explicaciones adicionales.`;
};

// ✅ PROMPT DISRUPTIVO PARA CARTA PROGRESADA
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
- Compara posiciones exactas entre natal y progresada
- Menciona cambios específicos de signos, casas, aspectos
- Conecta la evolución astrológica con la edad actual (${userProfile.age} años)
- Todo debe ser específico para la configuración de ${userProfile.name}
- Enfoque en ACTIVACIÓN, no solo descripción

RESPONDE SOLO CON JSON VÁLIDO.`;
};

// ✅ PROMPT PARA AGENDA CON INTERPRETACIONES
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
- Menciona posiciones, casas y aspectos reales de su carta
- Eventos distribuidos a lo largo del año
- Cada interpretación debe ser única para ${userProfile.name}

RESPONDE CON ARRAY JSON DE 12 EVENTOS.`;
};

// ✅ FUNCIONES DE UTILIDAD
export const formatChartForPrompt = (chartData: ChartData): string => {
  if (!chartData) return 'Datos no disponibles';
  
  const planets = chartData.planets?.map(p => 
    `${p.name}: ${p.sign} ${p.degree?.toFixed(1)}° Casa ${p.house}`
  ).join('\n') || '';
  
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