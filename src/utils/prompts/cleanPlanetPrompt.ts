// =============================================================================
// 🎯 CLEAN PLANET INTERPRETATION PROMPT
// src/utils/prompts/cleanPlanetPrompt.ts
// Genera interpretaciones claras, funcionales y psicológicas
// SIN metáforas, misticismo ni tono épico
// =============================================================================

export interface CleanPlanetInterpretation {
  que_significa: string;
  como_se_vive_en_la_practica: string[];
  desafio_principal: string;
  si_se_integra: string;
  si_se_resiste: string;
  que_conviene_hacer: string[];
  sintesis: string;
}

export interface CleanComparativeInterpretation {
  patron_estable_natal: string;
  que_se_activa_este_ano: string;
  donde_hay_tension: string;
  cambio_de_enfoque_pedido: string;
  que_conviene_hacer: string[];
  sintesis: string;
}

// =============================================================================
// 🎯 PROMPT BASE PARA PLANETA INDIVIDUAL (NATAL)
// =============================================================================

export function generateCleanPlanetPrompt(
  planeta: string,
  signo: string,
  casa: number,
  userName: string
): string {
  return `Actúa como un astrólogo psicológico y analista de comportamiento.
Interpreta la posición de ${planeta} en ${signo} en Casa ${casa} en la Carta Natal de ${userName}.

Usa un lenguaje claro, directo y práctico.
Evita metáforas, tono poético, misticismo o arquetipos grandilocuentes.

La interpretación debe centrarse en:
- Cómo se manifiesta esta energía en la vida cotidiana
- Qué comportamientos, tensiones o aprendizajes activa
- Qué decisiones o actitudes conviene tomar

Estructura la respuesta EXACTAMENTE con estos bloques en JSON:

{
  "que_significa": "Explica el área de vida activada y el tipo de aprendizaje que se presenta, de forma concreta. 80-120 palabras.",

  "como_se_vive_en_la_practica": [
    "Comportamiento observable 1",
    "Comportamiento observable 2",
    "Comportamiento observable 3",
    "Comportamiento observable 4"
  ],

  "desafio_principal": "Explica el conflicto central o la resistencia más común. 60-80 palabras.",

  "si_se_integra": "Resultados positivos internos y externos cuando esta energía se trabaja. 60-80 palabras.",

  "si_se_resiste": "Consecuencias típicas de no trabajar esta energía. 60-80 palabras.",

  "que_conviene_hacer": [
    "Acción concreta y realista 1",
    "Acción concreta y realista 2",
    "Acción concreta y realista 3",
    "Acción concreta y realista 4"
  ],

  "sintesis": "Una frase clara que resuma el aprendizaje, SIN metáforas. 15-25 palabras."
}

REGLAS CRÍTICAS:
❌ NO utilices metáforas, símbolos ni lenguaje espiritual abstracto
❌ NO uses palabras como: "arquetipo", "energía cósmica", "portal", "misión del alma", "revolución interna", "superpoder"
❌ NO hables en tono motivacional ni inspiracional
❌ NO uses mayúsculas enfáticas ni emojis excesivos
✅ Mantén un registro adulto, analítico y psicológico
✅ Prioriza claridad sobre belleza del lenguaje
✅ Usa verbos de acción y descripciones conductuales

OUTPUT: Solo JSON válido, sin markdown ni texto adicional.`;
}

// =============================================================================
// 🎯 PROMPT COMPARATIVO NATAL vs SOLAR RETURN
// =============================================================================

export function generateCleanComparativePrompt(
  planeta: string,
  natalSigno: string,
  natalCasa: number,
  srSigno: string,
  srCasa: number,
  userName: string,
  returnYear: number
): string {
  return `Actúa como un astrólogo psicológico especializado en Solar Return.
Compara ${planeta} en la Carta Natal vs Retorno Solar ${returnYear} de ${userName}.

NATAL: ${planeta} en ${natalSigno} Casa ${natalCasa}
SOLAR RETURN: ${planeta} en ${srSigno} Casa ${srCasa}

Usa lenguaje claro, concreto y aplicado a decisiones reales.
Evita metáforas y tono espiritual.

Estructura la respuesta EXACTAMENTE en JSON:

{
  "patron_estable_natal": "Cómo funciona ${planeta} normalmente en la vida de ${userName}. Comportamientos habituales. 80-100 palabras.",

  "que_se_activa_este_ano": "Qué área de vida se activa temporalmente este año con ${planeta} en Casa ${srCasa}. Qué cambia. 80-100 palabras.",

  "donde_hay_tension": "Dónde se siente el ajuste o contraste entre patrón natal y activación SR. Qué incomoda o desafía. 80-100 palabras.",

  "cambio_de_enfoque_pedido": "Qué actitud o enfoque nuevo se pide este año. Qué soltar, qué integrar. 60-80 palabras.",

  "que_conviene_hacer": [
    "Acción práctica específica 1",
    "Acción práctica específica 2",
    "Acción práctica específica 3",
    "Acción práctica específica 4"
  ],

  "sintesis": "Frase clara de cierre sobre el aprendizaje del año. 20-30 palabras."
}

REGLAS CRÍTICAS:
❌ NO uses metáforas ni lenguaje místico
❌ NO hables de "energías", "portales", "misiones del alma"
❌ NO uses tono motivacional
✅ Sé específico con las casas y áreas de vida
✅ Usa ejemplos concretos de situaciones
✅ Enfócate en comportamientos observables

OUTPUT: Solo JSON válido.`;
}

// =============================================================================
// 🎯 HELPERS PARA FORMATEAR RESPUESTAS
// =============================================================================

export function formatCleanPlanetForDisplay(
  interpretation: CleanPlanetInterpretation,
  planetaNombre: string
): string {
  return `
**QUÉ SIGNIFICA**

${interpretation.que_significa}

**CÓMO SE VIVE EN LA PRÁCTICA**

${interpretation.como_se_vive_en_la_practica.map((item, i) => `${i + 1}. ${item}`).join('\n')}

**DESAFÍO PRINCIPAL**

${interpretation.desafio_principal}

**SI SE INTEGRA**

${interpretation.si_se_integra}

**SI SE RESISTE**

${interpretation.si_se_resiste}

**QUÉ CONVIENE HACER**

${interpretation.que_conviene_hacer.map((item, i) => `• ${item}`).join('\n')}

**SÍNTESIS**

${interpretation.sintesis}
`.trim();
}

export function formatCleanComparativeForDisplay(
  interpretation: CleanComparativeInterpretation,
  planetaNombre: string
): string {
  return `
**CÓMO FUNCIONA NORMALMENTE (Natal)**

${interpretation.patron_estable_natal}

**QUÉ SE ACTIVA ESTE AÑO (Solar Return)**

${interpretation.que_se_activa_este_ano}

**DÓNDE HAY TENSIÓN O AJUSTE**

${interpretation.donde_hay_tension}

**CAMBIO DE ENFOQUE PEDIDO**

${interpretation.cambio_de_enfoque_pedido}

**QUÉ CONVIENE HACER**

${interpretation.que_conviene_hacer.map((item, i) => `• ${item}`).join('\n')}

**SÍNTESIS**

${interpretation.sintesis}
`.trim();
}
