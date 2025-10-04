// src/utils/prompts/disruptivePrompts.ts

export interface ChartData {
  planets?: Array<{
    name: string;
    sign: string;
    degree: number;
    minutes?: number;
    house?: number;
    houseNumber?: number;
    isRetrograde?: boolean;
  }>;
  houses?: any[];
  aspects?: any[];
  ascendant?: any;
  midheaven?: any;
}

export interface UserProfile {
  name: string;
  age?: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

/**
 * Genera el prompt disruptivo para interpretación de carta natal
 * Incluye instrucciones específicas para evitar placeholders
 */
export function generateDisruptiveNatalPrompt(
  natalChart: ChartData,
  userProfile: UserProfile
): string {
  const planets = natalChart.planets || [];
  const userName = userProfile.name || 'Usuario';

  // Crear lista detallada de posiciones planetarias
  const planetPositions = planets
    .map((p) => {
      const house = p.houseNumber || p.house || 'sin casa específica';
      const degree = p.degree ? Math.floor(p.degree) : '?';
      const retrograde = p.isRetrograde ? ' (Retrógrado)' : '';
      return `${p.name} en ${p.sign} ${degree}° Casa ${house}${retrograde}`;
    })
    .join('. ');

  // Lista detallada de cada planeta para el prompt
  const planetDetails = planets
    .map((p) => {
      const house = p.houseNumber || p.house || 'indefinida';
      const degree = p.degree ? Math.floor(p.degree) : '?';
      return `   - ${p.name}: ${p.sign} ${degree}° Casa ${house}`;
    })
    .join('\n');

  const prompt = `
Actúa como un astrólogo evolutivo DISRUPTIVO y REVOLUCIONARIO con enfoque transformacional extremo.

USUARIO: ${userName.toUpperCase()}
EDAD: ${userProfile.age || '?'} años
NACIMIENTO: ${userProfile.birthDate} a las ${userProfile.birthTime} en ${userProfile.birthPlace}

POSICIONES PLANETARIAS REALES:
${planetPositions}

🚨 REGLAS ABSOLUTAS - INCUMPLIR CUALQUIERA INVALIDA LA RESPUESTA:

1. TODOS estos planetas DEBEN tener interpretación COMPLETA con sus datos REALES:
${planetDetails}

2. PROHIBIDO USAR PLACEHOLDERS:
   ❌ [Signo], [Grado], [Casa X] están ABSOLUTAMENTE PROHIBIDOS
   ✅ SOLO usar datos reales proporcionados arriba

3. CADA planeta (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón) DEBE tener:
   - titulo: Con SIGNO REAL, GRADO REAL y CASA REAL del planeta
   - descripcion: Mínimo 2-3 párrafos ESPECÍFICOS para ${userName}
   - poder_especifico: Qué don único tiene ${userName} con esta posición
   - accion_inmediata: Qué debe hacer ${userName} HOY para activar este poder
   - ritual: Ritual específico (solo para planetas personales: Sol, Luna, Mercurio, Venus, Marte)

4. Si un planeta no tiene houseNumber, usa "sin casa específica" pero SIEMPRE genera la interpretación completa

5. TONO: Disruptivo, directo, sin rodeos. Usa el nombre ${userName} frecuentemente.

FORMATO JSON EXACTO REQUERIDO:

{
  "esencia_revolucionaria": "Declaración PODEROSA de 2-3 líneas sobre la naturaleza disruptiva de ${userName}",
  "proposito_vida": "Misión ESPECÍFICA de ${userName} en este planeta",
  
  "planetas": {
    "sol": {
      "titulo": "☉ Sol en [SIGNO REAL DEL SOL] [GRADO REAL]° - Casa [CASA REAL] → A qué has venido",
      "posicion_tecnica": "[GRADO]°[MINUTOS]' [SIGNO] - Casa [X] (significado de la casa)",
      "descripcion": "Interpretación COMPLETA del Sol de ${userName} - mínimo 3 párrafos específicos conectando signo + casa + propósito de vida. Usar preguntas provocadoras. Educar sobre el concepto mientras interpretas.",
      "poder_especifico": "El SUPERPODER único que le da esta posición del Sol a ${userName}",
      "accion_inmediata": "Acción CONCRETA que ${userName} debe hacer HOY para activar su Sol",
      "ritual": "Ritual solar específico para ${userName}"
    },
    "luna": {
      "titulo": "☽ Luna en [SIGNO REAL] [GRADO]° - Casa [CASA REAL] → Tus emociones",
      "posicion_tecnica": "[GRADO]°[MINUTOS]' [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA de la Luna de ${userName} - mínimo 3 párrafos sobre emociones, necesidades, refugio emocional. Conectar signo + casa.",
      "poder_especifico": "El poder emocional único de ${userName}",
      "accion_inmediata": "Cómo ${userName} debe honrar su Luna HOY",
      "ritual": "Ritual lunar específico"
    },
    "mercurio": {
      "titulo": "☿ Mercurio en [SIGNO REAL] [GRADO]° - Casa [CASA REAL] → Cómo piensas",
      "posicion_tecnica": "[GRADO]°[MINUTOS]' [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA del Mercurio de ${userName} - mínimo 2 párrafos sobre pensamiento, comunicación, aprendizaje.",
      "poder_especifico": "La genialidad mental única de ${userName}",
      "accion_inmediata": "Cómo ${userName} usa su Mercurio HOY",
      "ritual": "Ritual de comunicación específico"
    },
    "venus": {
      "titulo": "♀ Venus en [SIGNO REAL] [GRADO]° - Casa [CASA REAL] → Cómo amas",
      "posicion_tecnica": "[GRADO]°[MINUTOS]' [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA del Venus de ${userName} - mínimo 2 párrafos sobre amor, valores, atracción, placer.",
      "poder_especifico": "El magnetismo único de ${userName}",
      "accion_inmediata": "Cómo ${userName} activa su Venus HOY",
      "ritual": "Ritual de amor y valores"
    },
    "marte": {
      "titulo": "♂ Marte en [SIGNO REAL] [GRADO]° - Casa [CASA REAL] → Tu fuerza",
      "posicion_tecnica": "[GRADO]°[MINUTOS]' [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA del Marte de ${userName} - mínimo 2 párrafos sobre acción, deseo, valentía.",
      "poder_especifico": "El poder de acción único de ${userName}",
      "accion_inmediata": "Cómo ${userName} canaliza su Marte HOY",
      "ritual": "Ritual de acción y fuerza"
    },
    "jupiter": {
      "titulo": "♃ Júpiter en [SIGNO REAL] - Casa [CASA REAL] → Tu suerte",
      "posicion_tecnica": "[GRADO]° [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA del Júpiter de ${userName} - mínimo 2 párrafos sobre expansión, suerte, abundancia.",
      "poder_especifico": "Dónde ${userName} tiene suerte natural"
    },
    "saturno": {
      "titulo": "♄ Saturno en [SIGNO REAL] - Casa [CASA REAL] → Tu maestría",
      "posicion_tecnica": "[GRADO]° [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación COMPLETA del Saturno de ${userName} - mínimo 2 párrafos sobre responsabilidad, karma, maestría.",
      "poder_especifico": "La lección maestra de ${userName}"
    },
    "urano": {
      "titulo": "♅ Urano en [SIGNO REAL] - Casa [CASA REAL] → Tu revolución",
      "posicion_tecnica": "[GRADO]° [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación del Urano de ${userName} - mínimo 1-2 párrafos sobre innovación, rebeldía, cambio.",
      "poder_especifico": "Dónde ${userName} es revolucionario"
    },
    "neptuno": {
      "titulo": "♆ Neptuno en [SIGNO REAL] - Casa [CASA REAL] → Tu espiritualidad",
      "posicion_tecnica": "[GRADO]° [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación del Neptuno de ${userName} - mínimo 1-2 párrafos sobre espiritualidad, intuición, trascendencia.",
      "poder_especifico": "La conexión espiritual única de ${userName}"
    },
    "pluton": {
      "titulo": "♇ Plutón en [SIGNO REAL] - Casa [CASA REAL] → Tu transformación",
      "posicion_tecnica": "[GRADO]° [SIGNO] - Casa [X] (significado)",
      "descripcion": "Interpretación del Plutón de ${userName} - mínimo 1-2 párrafos sobre poder, transformación profunda.",
      "poder_especifico": "El poder regenerativo de ${userName}"
    }
  },
  
  "integracion_carta": {
    "titulo": "Integración de tu Carta Natal",
    "sintesis": "Síntesis de cómo todos los planetas de ${userName} trabajan juntos",
    "elementos_destacados": [
      "Elemento destacado 1 con posición real",
      "Elemento destacado 2 con posición real"
    ],
    "camino_evolutivo": "El camino de evolución específico de ${userName}"
  },
  
  "plan_accion": {
    "hoy_mismo": [
      "Acción específica 1 que ${userName} puede hacer HOY",
      "Acción específica 2 para HOY",
      "Acción específica 3 para HOY"
    ],
    "esta_semana": [
      "Acción para esta semana 1",
      "Acción para esta semana 2",
      "Acción para esta semana 3"
    ],
    "este_mes": [
      "Acción transformadora para este mes 1",
      "Acción transformadora para este mes 2",
      "Acción transformadora para este mes 3"
    ]
  },
  
  "declaracion_poder": "YO, ${userName.toUpperCase()}, [declaración poderosa en primera persona basada en su carta específica]",
  
  "advertencias": [
    "Advertencia brutalmente honesta 1 sobre lo que limita a ${userName}",
    "Patrón autodestructivo que ${userName} debe romper",
    "Mentira que ${userName} se dice a sí mismo/a"
  ],
  
  "insights_transformacionales": [
    "Insight 1 conectando posiciones planetarias REALES con poder real",
    "Insight 2 específico para ${userName}",
    "Insight 3 transformacional",
    "Insight 4 activador",
    "Insight 5 revolucionario"
  ],
  
  "rituales_recomendados": [
    "Ritual 1 basado en la configuración de ${userName}",
    "Ritual 2 específico y práctico",
    "Ritual 3 transformador"
  ]
}

DATOS PLANETARIOS COMPLETOS DISPONIBLES:
${JSON.stringify(planets, null, 2)}

IMPORTANTE FINAL:
- Responde SOLO con JSON válido
- NO uses markdown (\`\`\`json)
- NO agregues texto antes o después del JSON
- CIERRA todas las comillas, arrays y objetos correctamente
- Si te quedas sin espacio, prioriza COMPLETAR el JSON correctamente

Genera AHORA el JSON completo con TODOS los planetas interpretados usando SOLO datos reales.
`;

  return prompt;
}

/**
 * Formatea datos de carta para el prompt (legacy - mantener por compatibilidad)
 */
export function formatChartForPrompt(chartData: ChartData): string {
  const planets = chartData.planets || [];
  return planets
    .map((p) => {
      const house = p.houseNumber || p.house || 'sin casa';
      return `${p.name} en ${p.sign} Casa ${house}`;
    })
    .join(', ');
}