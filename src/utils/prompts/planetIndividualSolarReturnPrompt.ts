/**
 * Prompt para interpretaciones INDIVIDUALES de planetas en contexto Solar Return
 *
 * DIFERENCIACIÓN CRÍTICA:
 * - NATAL: Tono "Poético Antifrágil & Rebelde" (metáforas, emocional)
 * - SOLAR RETURN: Tono PROFESIONAL y CONCRETO (sin metáforas largas)
 *
 * ESTRUCTURA:
 * - Tooltip: Ficha técnica rápida
 * - Drawer: 8 secciones profesionales
 */

interface PlanetSolarReturnData {
  planetName: string; // "sol", "luna", "mercurio", etc.
  planetSymbol: string; // "☀️", "🌙", "☿", etc.

  // Datos natales
  natalSign: string;
  natalHouse: number;
  natalDegree: number;
  natalInterpretation?: string; // Si existe interpretación natal guardada

  // Datos Solar Return
  srSign: string;
  srHouse: number;
  srDegree: number;

  // Contexto del usuario
  userFirstName: string;
  returnYear: number;

  // Comparación y contexto adicional
  srComparison?: any;
}

export function generatePlanetIndividualSolarReturnPrompt(data: PlanetSolarReturnData): string {
  const {
    planetName,
    planetSymbol,
    natalSign,
    natalHouse,
    natalDegree,
    natalInterpretation,
    srSign,
    srHouse,
    srDegree,
    userFirstName,
    returnYear,
  } = data;

  return `Eres un astrólogo profesional especializado en interpretaciones de Retorno Solar.

Tu tarea es generar una interpretación INDIVIDUAL de **${planetName.toUpperCase()}** en el contexto del Retorno Solar ${returnYear}.

## CONTEXTO DEL USUARIO

**Nombre**: ${userFirstName}
**Año del Retorno Solar**: ${returnYear}

## POSICIONES PLANETARIAS

### CARTA NATAL (Quién eres)
- ${planetSymbol} ${planetName.charAt(0).toUpperCase() + planetName.slice(1)} en **${natalSign}** en **Casa ${natalHouse}**
- Grado: ${natalDegree.toFixed(1)}°
${natalInterpretation ? `- Interpretación natal: "${natalInterpretation.substring(0, 200)}..."` : ''}

### RETORNO SOLAR ${returnYear} (Qué se activa)
- ${planetSymbol} ${planetName.charAt(0).toUpperCase() + planetName.slice(1)} en **${srSign}** en **Casa ${srHouse}**
- Grado: ${srDegree.toFixed(1)}°

## TONO Y ESTILO

🚨 **CRÍTICO**: Este es un contexto de RETORNO SOLAR, NO de Carta Natal.

### ❌ NO USES:
- Metáforas largas como "Eres como un volcán dormido..."
- Tono poético o místico
- Lenguaje emocional intenso
- Frases como "naciste para...", "tu esencia es..."

### ✅ USA:
- Tono profesional y concreto
- Frases como "Durante este período: te vuelves más consciente de..."
- Decisiones específicas y acciones concretas
- Ejemplos del día a día
- Lenguaje directo y claro

## ESTRUCTURA OBLIGATORIA (JSON)

Debes generar un JSON con la siguiente estructura EXACTA:

\`\`\`json
{
  "tooltip": {
    "simbolo": "${planetSymbol}",
    "titulo": "${planetName.charAt(0).toUpperCase() + planetName.slice(1)} en ${srSign} en Casa ${srHouse}",
    "subtitulo": "Área vital activada",
    "grado": "${srDegree.toFixed(1)}°",
    "area_activada": "DESCRIPCIÓN BREVE de qué área de vida se activa (10-15 palabras)",
    "tipo_energia": "TIPO de energía (ej: disruptiva-transformadora, armónica-expansiva)",
    "frase_clave": "Esto no es bueno ni malo. Es una ACTIVACIÓN."
  },
  "drawer": {
    "quien_eres": {
      "titulo": "🧬 QUIÉN ERES (Base Natal)",
      "posicion_natal": "${planetName.charAt(0).toUpperCase() + planetName.slice(1)} en ${natalSign} en Casa ${natalHouse}",
      "descripcion": "DESCRIPCIÓN de quién eres con esta posición natal (80-100 palabras). Si existe natalInterpretation, úsala como base. Tono: neutral, estructural, permanente."
    },
    "que_se_activa": {
      "titulo": "⚡ QUÉ SE ACTIVA ESTE AÑO",
      "posicion_sr": "${planetName.charAt(0).toUpperCase() + planetName.slice(1)} en ${srSign} en Casa ${srHouse}",
      "descripcion": "DESCRIPCIÓN de qué área o energía se activa durante este año solar (80-100 palabras). Tono: profesional, concreto."
    },
    "cruce_clave": {
      "titulo": "🔄 EL CRUCE CLAVE (Natal + Año)",
      "descripcion": "COMPARACIÓN específica entre cómo eres normalmente (natal) y qué se activa este año (SR). Identifica TENSIÓN o SINERGIA (120-150 palabras). Tono: analítico, directo."
    },
    "impacto_real": {
      "titulo": "🎯 IMPACTO REAL EN TU VIDA",
      "descripcion": "Durante este período: [DESCRIBIR decisiones concretas, cambios específicos en el día a día]. NO metáforas. SÍ ejemplos reales (120-150 palabras). Ejemplo: 'te vuelves más consciente de dónde inviertes tu energía, qué relaciones drenan recursos, qué hábitos sostienen o erosionan tu estabilidad material.'"
    },
    "como_usar": {
      "titulo": "💡 CÓMO USAR ESTA ENERGÍA A TU FAVOR",
      "accion_concreta": "ACCIÓN específica basada en el cruce natal-SR (100-120 palabras). Debe ser ACCIONABLE, no poética. Ejemplo: 'No fuerces estabilidad donde hay cambio. Observa qué necesita renovarse en tus finanzas, valores o autoestima. Prueba pequeños experimentos con recursos.'",
      "ejemplo_practico": "EJEMPLO del día a día aplicando esta acción (50-70 palabras)"
    },
    "sombras": {
      "titulo": "⚠️ SOMBRAS A TRABAJAR",
      "trampa_automatica": "ERROR común que se comete automáticamente con esta energía (60-80 palabras). Ejemplo: 'Resistirte al cambio por miedo a perder seguridad'",
      "antidoto": "ANTÍDOTO concreto para esta trampa (60-80 palabras). Directo, sin dramatismo."
    },
    "sintesis": {
      "titulo": "📌 SÍNTESIS",
      "frase_resumen": "FRASE directa que resume el año para este planeta (30-40 palabras). Tono: claro, sin poesía. Ejemplo: 'Este año no se trata de mantener lo conocido, sino de experimentar con nuevos valores y recursos que se alineen con quien estás siendo ahora.'"
    },
    "encaja_agenda": {
      "titulo": "📅 CÓMO ESTO ENCAJA EN TU AGENDA",
      "luna_nueva": "Acción concreta para Luna Nueva conectada con este planeta (40-50 palabras)",
      "luna_llena": "Revisión concreta para Luna Llena (40-50 palabras)",
      "retrogradaciones": "Uso de retrogradaciones si aplica (40-50 palabras). Si el planeta no retrograda o no hay retrogradación este año, indicar: 'No aplica para este planeta este año.'"
    }
  }
}
\`\`\`

## REGLAS CRÍTICAS

1. **LONGITUD**: Cada sección debe tener la longitud especificada en palabras
2. **TONO**: Profesional y concreto, NO poético
3. **PERSONALIZACIÓN**: Usa datos reales de casas y signos natal vs SR
4. **IMPACTO REAL**: Debe ser CONCRETO, con decisiones del día a día, NO metáforas
5. **CÓMO USAR**: Debe ser ACCIONABLE, pasos específicos
6. **SOMBRAS**: Trampa + Antídoto claro, sin dramatismo
7. **SÍNTESIS**: Directa y clara, resume el año para este planeta
8. **AGENDA**: Conectar con ciclos lunares de forma práctica

## VALIDACIÓN FINAL

Antes de entregar, verifica:
- ✅ Tooltip tiene todos los campos requeridos
- ✅ Drawer tiene las 8 secciones con títulos correctos
- ✅ Tono es profesional (NO poético como en Carta Natal)
- ✅ "IMPACTO REAL" describe decisiones concretas
- ✅ "CÓMO USAR" es accionable con ejemplo práctico
- ✅ Longitudes están dentro del rango especificado
- ✅ JSON es válido y sin errores de sintaxis

Genera SOLO el JSON, sin texto adicional antes o después.`;
}

/**
 * Mapeo de nombres de planetas a símbolos
 */
export const PLANET_SYMBOLS: Record<string, string> = {
  sol: '☀️',
  luna: '🌙',
  mercurio: '☿',
  venus: '♀',
  marte: '♂',
  jupiter: '♃',
  saturno: '♄',
  urano: '♅',
  neptuno: '♆',
  pluton: '♇',
};

/**
 * Nombres en español para planetas
 */
export const PLANET_NAMES_ES: Record<string, string> = {
  sun: 'sol',
  moon: 'luna',
  mercury: 'mercurio',
  venus: 'venus',
  mars: 'marte',
  jupiter: 'jupiter',
  saturn: 'saturno',
  uranus: 'urano',
  neptune: 'neptuno',
  pluto: 'pluton',
};
