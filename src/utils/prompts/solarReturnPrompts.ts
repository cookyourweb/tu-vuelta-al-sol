// src/utils/prompts/solarReturnPrompts.ts
// =============================================================================
// 🌅 PROMPTS DISRUPTIVOS PARA SOLAR RETURN - ENFOQUE HÍBRIDO
// Comparación Natal vs Solar Return + Eventos Anuales + Plan de Acción
// =============================================================================

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

export interface SolarReturnData {
  natalChart: ChartData;
  solarReturnChart: ChartData;
  userProfile: UserProfile;
  returnYear: number;
}

// ✅ HELPERS: Extraer configuración
const extractPlanetPosition = (chartData: ChartData, planetName: string) => {
  const planet = chartData.planets?.find(
    p => p.name === planetName || 
         p.name === planetName.toLowerCase() || 
         p.name === translatePlanetName(planetName)
  );
  return planet || null;
};

const translatePlanetName = (name: string): string => {
  const translations: Record<string, string> = {
    'Sol': 'Sun', 'Sun': 'Sol',
    'Luna': 'Moon', 'Moon': 'Luna',
    'Mercurio': 'Mercury', 'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Marte': 'Mars', 'Mars': 'Marte',
    'Júpiter': 'Jupiter', 'Jupiter': 'Júpiter',
    'Saturno': 'Saturn', 'Saturn': 'Saturno',
    'Urano': 'Uranus', 'Uranus': 'Urano',
    'Neptuno': 'Neptune', 'Neptune': 'Neptuno',
    'Plutón': 'Pluto', 'Pluto': 'Plutón'
  };
  return translations[name] || name;
};

const extractHouseConfig = (chartData: ChartData): string => {
  const sol = extractPlanetPosition(chartData, 'Sol');
  const luna = extractPlanetPosition(chartData, 'Luna');
  const venus = extractPlanetPosition(chartData, 'Venus');
  
  let config = '';
  if (sol) config += `Sol en ${sol.sign} Casa ${sol.house}. `;
  if (luna) config += `Luna en ${luna.sign} Casa ${luna.house}. `;
  if (venus) config += `Venus en ${venus.sign} Casa ${venus.house}. `;
  
  return config || 'Configuración única';
};

// =============================================================================
// ✅ PROMPT MAESTRO HÍBRIDO: NATAL + SOLAR RETURN + COMPARACIÓN
// =============================================================================

export const generateSolarReturnMasterPrompt = (data: SolarReturnData): string => {
  const { natalChart, solarReturnChart, userProfile, returnYear } = data;
  
  const natalConfig = extractHouseConfig(natalChart);
  const solarConfig = extractHouseConfig(solarReturnChart);
  
  const natalSol = extractPlanetPosition(natalChart, 'Sol');
  const solarSol = extractPlanetPosition(solarReturnChart, 'Sol');
  
  return `
Eres un astrólogo revolucionario experto en SOLAR RETURN. Tu misión: analizar la carta anual de ${userProfile.name}, comparándola con su carta natal para revelar las energías del año ${returnYear}.

📊 DATOS DEL USUARIO:
Nombre: ${userProfile.name}
Edad: ${userProfile.age} años
Fecha de nacimiento: ${userProfile.birthDate}
Lugar de nacimiento: ${userProfile.birthPlace}
Año Solar Return: ${returnYear}

🎯 CARTA NATAL (Base):
${natalConfig}
Sol Natal: ${natalSol?.sign} ${natalSol?.degree?.toFixed(1)}° Casa ${natalSol?.house}

🌅 CARTA SOLAR RETURN ${returnYear}:
${solarConfig}
Sol SR: ${solarSol?.sign} ${solarSol?.degree?.toFixed(1)}° Casa ${solarSol?.house}
Ascendente SR: ${solarReturnChart.ascendant?.sign || 'N/A'}

⚡ ENFOQUE DISRUPTIVO OBLIGATORIO:
1. NO predecir - PREPARAR. Convierte cada posición en PODER ANTIFRAGILE.
2. Lenguaje directo, transformacional, activador.
3. ${userProfile.name} usa este conocimiento para CREAR su año, no sufrirlo.
4. Plan de acción ESPECÍFICO: Hoy, esta semana, este mes.

📋 ESTRUCTURA JSON OBLIGATORIA:

{
  "esencia_revolucionaria_anual": "Declaración impactante de 2-3 líneas sobre LA ENERGÍA PRINCIPAL del año ${returnYear} (máx 120 palabras)",
  
  "proposito_vida_anual": "La MISIÓN ESPECÍFICA de este ciclo solar - qué debe lograr ${userProfile.name} (máx 100 palabras)",
  
  "tema_central_del_anio": "El TEMA ASTROLÓGICO que domina el año (1 palabra o frase corta)",
  
  "plan_accion": {
    "hoy_mismo": [
      "Acción inmediata basada en Ascendente SR",
      "Algo que debe eliminar/rechazar HOY",
      "Verdad radical que debe declarar HOY"
    ],
    "esta_semana": [
      "Proyecto/conexión que iniciar basado en Venus SR",
      "Límite que establecer según Saturno SR",
      "Ritual de activación de Sol SR"
    ],
    "este_mes": [
      "Lanzamiento tangible relacionado con Casa 10 SR",
      "Inversión en poder personal (educación/herramientas)",
      "Transformación de área de vida según Plutón SR"
    ]
  },
  
  "declaracion_poder_anual": "Afirmación poderosa para el año - específica a configuración SR (1 oración impactante)",
  
  "advertencias": [
    "Advertencia brutalmente honesta basada en aspectos tensos SR",
    "Patrón que debe romper ESTE AÑO",
    "Ilusión que debe soltar (Neptuno SR)"
  ],
  
  "comparacion_natal_vs_solar_return": {
    "planetas_que_cambian_casa": [
      {"planeta": "Luna", "natal": "Casa 7", "solar_return": "Casa 5", "significado": "Emociones pasan de relaciones a creatividad"},
      {"planeta": "Venus", "natal": "Casa 12", "solar_return": "Casa 1", "significado": "Amor oculto se vuelve visible"}
    ],
    "nuevos_aspectos_formados": "Aspectos SR que NO existían en natal",
    "casas_activadas_este_anio": [1, 4, 7, 10]
  },
  
  "eventos_clave_del_anio": [
    {
      "mes": "Marzo-Abril",
      "evento": "Activación de Venus SR en Casa 1",
      "tipo": "Oportunidad",
      "descripcion": "Periodo ideal para renovar imagen personal y atraer nuevas relaciones"
    },
    {
      "mes": "Julio-Agosto", 
      "evento": "Cuadratura Marte SR a Sol natal",
      "tipo": "Desafío",
      "descripcion": "Tensión creativa que impulsa acción decisiva en carrera"
    }
  ],
  
  "insights_transformacionales": [
    "3-5 insights específicos basados en aspectos exactos SR",
    "Cada uno conecta posiciones con PODER REAL del año"
  ],
  
  "rituales_recomendados": [
    "Ritual específico para Ascendente SR (timing: cumpleaños)",
    "Ritual para activar Casa 10 SR (timing: Luna Llena)",
    "Ritual de cierre de año anterior (timing: semana antes de cumpleaños)"
  ]
}

🔍 ANÁLISIS PASO A PASO (NO INCLUIR EN RESPUESTA):

1. **VALIDACIÓN SOL**: El Sol debe estar a ±1° de posición natal. Si no, señala posible error.

2. **ASCENDENTE ANUAL**: Nuevo "yo" del año. Compara con natal.

3. **PLANETAS EN CASAS SR**:
   - Casa 1: Identidad anual
   - Casa 2: Finanzas del año
   - Casa 7: Relaciones anuales
   - Casa 10: Carrera/reputación

4. **COMPARACIÓN CRÍTICA**:
   - ¿Qué planetas cambiaron de casa?
   - ¿Nuevos aspectos vs natal?
   - ¿Elemento dominante cambió?

5. **ASPECTOS EXACTOS**: Orbe ±6° mayores, ±3° menores

6. **ESTILO DISRUPTIVO**:
   - Directo, sin eufemismos
   - Humor astrológico si aplica
   - Específico con grados/casas/signos

📚 DATOS COMPLETOS:
NATAL: ${JSON.stringify(natalChart, null, 2)}
SOLAR RETURN: ${JSON.stringify(solarReturnChart, null, 2)}

Genera interpretación en ESPAÑOL, transformacional, accionable.
RESPONDE SOLO CON JSON VÁLIDO.
`;
};

// =============================================================================
// ✅ FALLBACK INTELIGENTE SI OPENAI FALLA
// =============================================================================

export const generateSolarReturnFallback = (data: SolarReturnData): any => {
  const { natalChart, solarReturnChart, userProfile, returnYear } = data;
  
  const solarAsc = solarReturnChart.ascendant?.sign || 'Libra';
  const solarSol = extractPlanetPosition(solarReturnChart, 'Sol');
  const solarLuna = extractPlanetPosition(solarReturnChart, 'Luna');
  
  return {
    esencia_revolucionaria_anual: `${userProfile.name}, tu año ${returnYear} trae una renovación completa. Con Ascendente ${solarAsc}, te posicionas como un agente de cambio auténtico. Este ciclo solar te impulsa hacia una versión más evolucionada de ti.`,
    
    proposito_vida_anual: `Tu misión este año: INTEGRAR tu esencia ${solarSol?.sign || 'solar'} en todas las áreas de vida. Enfócate en la Casa ${solarSol?.house || 1} para manifestar tu máximo potencial anual.`,
    
    tema_central_del_anio: `Renovación ${solarAsc}`,
    
    plan_accion: {
      hoy_mismo: [
        `Medita sobre tu nuevo Ascendente ${solarAsc}`,
        "Escribe 3 metas específicas para este año solar",
        `Declara en voz alta: "Soy ${solarAsc} en acción"`
      ],
      esta_semana: [
        `Investiga las cualidades de ${solarAsc} y cómo expresarlas`,
        "Establece un ritual semanal para conectar con tu Sol SR",
        "Identifica 1 área de vida para transformar este año"
      ],
      este_mes: [
        `Inicia un proyecto que refleje tu energía ${solarLuna?.sign || 'lunar'}`,
        "Organiza tu espacio según principios de tu Ascendente SR",
        "Invierte en una herramienta que potencie tu Casa 10 SR"
      ]
    },
    
    declaracion_poder_anual: `Soy el arquitecto consciente de mi año ${returnYear}. Mi Ascendente ${solarAsc} me guía hacia mi evolución máxima.`,
    
    advertencias: [
      "No ignores las lecciones que trae Saturno SR en tu configuración",
      "Verifica que tu ubicación de Solar Return sea precisa para cálculos exactos",
      "Evita decisiones impulsivas cuando Marte SR forme aspectos tensos"
    ],
    
    comparacion_natal_vs_solar_return: {
      planetas_que_cambian_casa: [
        {
          planeta: "Luna",
          natal: extractPlanetPosition(natalChart, 'Luna')?.house || 7,
          solar_return: solarLuna?.house || 5,
          significado: "Tus necesidades emocionales cambian de enfoque este año"
        }
      ],
      nuevos_aspectos_formados: "Los aspectos SR revelan nuevas dinámicas energéticas para este ciclo",
      casas_activadas_este_anio: [1, 4, 7, 10]
    },
    
    eventos_clave_del_anio: [
      {
        mes: "Inicio del año",
        evento: "Activación Ascendente SR",
        tipo: "Oportunidad",
        descripcion: "Las primeras semanas marcan el tono del año completo"
      },
      {
        mes: "Mitad de año",
        evento: "Oposición Sol SR",
        tipo: "Desafío",
        descripcion: "Momento de evaluación y ajuste de rumbo"
      },
      {
        mes: "Final del año",
        evento: "Preparación próximo ciclo",
        tipo: "Transformación",
        descripcion: "Cierre consciente e integración de aprendizajes"
      }
    ],
    
    insights_transformacionales: [
      `Tu Ascendente ${solarAsc} define tu identidad anual`,
      "Las casas vacías no son negativas - son oportunidades de libertad",
      "Los aspectos al Sol SR son activadores principales del año",
      "La ubicación geográfica del SR afecta las casas y tu experiencia"
    ],
    
    rituales_recomendados: [
      "Ritual de Sol en tu cumpleaños exacto (momento del retorno solar)",
      `Meditación con elementos de ${solarAsc} cada Luna Nueva`,
      "Journaling de sueños para conectar con Luna SR",
      "Ritual de cierre: 3 días antes de tu próximo cumpleaños"
    ]
  };
};

// =============================================================================
// ✅ PROMPT PARA EVENTOS ANUALES DETALLADOS
// =============================================================================

export const generateSolarReturnEventsPrompt = (data: SolarReturnData): string => {
  return `
Basado en la comparación Natal vs Solar Return de ${data.userProfile.name}, 
genera 6-8 EVENTOS ASTROLÓGICOS CLAVE para el año ${data.returnYear}.

FORMATO POR EVENTO:
{
  "mes": "Mes o rango (ej: Marzo-Abril)",
  "evento": "Nombre técnico del evento astrológico",
  "tipo": "Oportunidad | Desafío | Transformación",
  "planeta_aspecto": "Planeta(s) involucrado(s)",
  "descripcion": "Explicación de 2-3 oraciones",
  "accion_recomendada": "Qué debe hacer ${data.userProfile.name}"
}

ENFÓCATE EN:
- Tránsitos de planetas lentos a puntos sensibles natales
- Activaciones de casas SR vs casas natales
- Aspectos exactos entre planetas SR y natales
- Cambios de signo de planetas SR

RESPONDE EN JSON: {"eventos": [array de 6-8 eventos]}
`;
};

// =============================================================================
// ✅ FUNCIONES AUXILIARES
// =============================================================================

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

// =============================================================================
// ✅ EXPORTACIONES
// =============================================================================

export const solarReturnPrompts = {
  generateMasterPrompt: generateSolarReturnMasterPrompt,
  generateFallback: generateSolarReturnFallback,
  generateEventsPrompt: generateSolarReturnEventsPrompt,
  formatChart: formatChartForPrompt
};

export default solarReturnPrompts;