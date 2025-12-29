// =============================================================================
// 🌟 CLEAN NATAL INTERPRETATION SERVICE
// src/services/cleanNatalInterpretationService.ts
// Genera interpretación LIMPIA y PEDAGÓGICA sin rituales ni mantras
// =============================================================================

import OpenAI from 'openai';
import {
  generateCleanNatalChartPrompt,
  type ChartData,
  type UserProfile,
} from '@/utils/prompts/natalChartPrompt_clean';

// =============================================================================
// TYPES - Estructura limpia sin rituales
// =============================================================================

export interface CartaNatalLimpia {
  esencia_natal: {
    titulo: string;
    descripcion: string;
  };

  sol: InterpretacionPlanetaLimpia;
  luna: InterpretacionPlanetaLimpia;
  ascendente: {
    titulo: string;
    posicion: string;
    interpretacion: string;
    primera_impresion: string;
  };
  mercurio: InterpretacionPlanetaLimpia;
  venus: InterpretacionPlanetaLimpia;
  marte: InterpretacionPlanetaLimpia;
  jupiter: InterpretacionPlanetaLimpia;
  saturno: InterpretacionPlanetaLimpia;
  urano: InterpretacionPlanetaLimpia;
  neptuno: InterpretacionPlanetaLimpia;
  pluton: InterpretacionPlanetaLimpia;

  nodos_lunares: {
    titulo: string;
    nodo_norte: {
      posicion: string;
      interpretacion: string;
    };
    nodo_sur: {
      posicion: string;
      interpretacion: string;
    };
    sintesis: string;
  };

  quiron: {
    titulo: string;
    posicion: string;
    que_significa_casa: string;
    interpretacion: string;
  };

  formacion_temprana: {
    titulo: string;
    descripcion: string;
  };

  luz_y_sombra: {
    fortalezas: string[];
    sombras: string[];
  };

  sintesis_final: {
    titulo: string;
    descripcion: string;
  };
}

interface InterpretacionPlanetaLimpia {
  titulo: string;
  posicion: string;
  que_significa_casa: string;
  interpretacion: string;
  [key: string]: string; // Permite campos adicionales específicos
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

export async function generateCleanNatalInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<CartaNatalLimpia> {
  console.log('🌟 [CLEAN NATAL] Starting generation for:', userProfile.name);

  const openai = getOpenAIClient();
  const prompt = generateCleanNatalChartPrompt(chartData, userProfile);

  console.log('🌟 [CLEAN NATAL] Prompt length:', prompt.length, 'characters');

  const startTime = Date.now();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Eres un astrólogo evolutivo profesional. Respondes ÚNICAMENTE con JSON válido, sin texto adicional. Tu tono es pedagógico, humano y profundo. NUNCA incluyes rituales, mantras, ni predicciones.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 12000,
    response_format: { type: 'json_object' }
  });

  const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('🌟 [CLEAN NATAL] Generation completed in', generationTime, 'seconds');

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error('❌ [CLEAN NATAL] No content in response');
    throw new Error('No content in OpenAI response');
  }

  console.log('🌟 [CLEAN NATAL] Response length:', content.length, 'characters');

  try {
    const interpretation = JSON.parse(content) as CartaNatalLimpia;
    console.log('🌟 [CLEAN NATAL] Parsed successfully. Sections:', Object.keys(interpretation).length);
    return interpretation;
  } catch (parseError) {
    console.error('🌟 [CLEAN NATAL] JSON parse error:', parseError);
    console.error('🌟 [CLEAN NATAL] Content preview:', content.substring(0, 500));
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

// =============================================================================
// CHUNKED GENERATION (para mayor confiabilidad)
// =============================================================================

export async function generateCleanNatalInterpretationChunked(
  chartData: ChartData,
  userProfile: UserProfile,
  onProgress?: (message: string, percentage: number) => void
): Promise<CartaNatalLimpia> {
  console.log('🌟 [CLEAN NATAL CHUNKED] Starting generation for:', userProfile.name);

  const openai = getOpenAIClient();

  // Helper para encontrar planetas
  const findPlanet = (names: string[]) =>
    chartData.planets.find(p => names.some(n => p.name.toLowerCase().includes(n.toLowerCase())));

  const sun = findPlanet(['sol', 'sun']);
  const moon = findPlanet(['luna', 'moon']);
  const mercury = findPlanet(['mercurio', 'mercury']);
  const venus = findPlanet(['venus']);
  const mars = findPlanet(['marte', 'mars']);
  const jupiter = findPlanet(['júpiter', 'jupiter']);
  const saturn = findPlanet(['saturno', 'saturn']);
  const uranus = findPlanet(['urano', 'uranus']);
  const neptune = findPlanet(['neptuno', 'neptune']);
  const pluto = findPlanet(['plutón', 'pluto', 'pluton']);
  const northNode = findPlanet(['nodo norte', 'north node']);
  const southNode = findPlanet(['nodo sur', 'south node']);
  const chiron = findPlanet(['quirón', 'chiron']);

  const result: Partial<CartaNatalLimpia> = {};

  // CHUNK 1: Esencia Natal
  onProgress?.('🌟 Generando tu esencia natal...', 10);
  const chunk1 = await generateCleanChunk(openai, `
Eres un astrólogo evolutivo profesional. Genera JSON válido para ${userProfile.name}:

DATOS:
- Sol: ${sun?.sign} Casa ${sun?.house}
- Luna: ${moon?.sign} Casa ${moon?.house}
- Ascendente: ${chartData.ascendant.sign}

IMPORTANTE: NO incluyas rituales, mantras, ni predicciones. Solo descripción identitaria.

{
  "esencia_natal": {
    "titulo": "Tu Esencia Natal",
    "descripcion": "200-250 palabras. Describe la identidad central combinando Sol, Luna y Ascendente. Explica cómo estas energías conviven, cooperan o entran en tensión. Debe sentirse reconocible para ${userProfile.name}. Lenguaje claro, humano y pedagógico."
  }
}
`);
  Object.assign(result, chunk1);

  // CHUNK 2: Sol, Luna, Ascendente
  onProgress?.('☀️ Interpretando Sol, Luna y Ascendente...', 25);
  const chunk2 = await generateCleanChunk(openai, `
Eres un astrólogo evolutivo profesional. Genera para ${userProfile.name}:

DATOS:
- Sol: ${sun?.sign} Casa ${sun?.house}
- Luna: ${moon?.sign} Casa ${moon?.house}
- Ascendente: ${chartData.ascendant.sign}

IMPORTANTE: NO des consejos. NO incluyas rituales ni mantras. Solo describe QUIÉN ES esta persona.

{
  "sol": {
    "titulo": "☀️ Tu Propósito de Vida",
    "posicion": "${sun?.sign} Casa ${sun?.house}",
    "que_significa_casa": "Una línea explicando qué representa Casa ${sun?.house}",
    "interpretacion": "150-180 palabras. Explica: 1) Qué viene a desarrollar, 2) Qué la hace única, 3) Qué la apaga cuando no vive alineada con su Sol. NO futuro. NO consejos. Solo naturaleza del propósito.",
    "palabra_clave": "Una palabra que resuma este Sol"
  },
  "luna": {
    "titulo": "🌙 Tu Mundo Emocional",
    "posicion": "${moon?.sign} Casa ${moon?.house}",
    "que_significa_casa": "Una línea sobre Casa ${moon?.house} para la Luna",
    "interpretacion": "150-180 palabras. Describe: 1) Cómo procesa emociones, 2) Qué necesita para sentirse segura emocionalmente, 3) Qué aprendió en la infancia. Conecta infancia → patrón adulto.",
    "necesidad_emocional": "50 palabras sobre qué necesita esta Luna para sentirse en paz"
  },
  "ascendente": {
    "titulo": "⬆️ Tu Personalidad Visible",
    "posicion": "${chartData.ascendant.sign}",
    "interpretacion": "120-150 palabras. Explica cómo se muestra al mundo, cómo la perciben, y su forma instintiva de abordar la vida. Sin metáforas exageradas.",
    "primera_impresion": "40 palabras sobre la primera impresión que da"
  }
}
`);
  Object.assign(result, chunk2);

  // CHUNK 3: Mercurio, Venus, Marte
  onProgress?.('🗣️ Interpretando Mercurio, Venus y Marte...', 40);
  const chunk3 = await generateCleanChunk(openai, `
Eres un astrólogo evolutivo profesional. Genera para ${userProfile.name}:

DATOS:
- Mercurio: ${mercury?.sign} Casa ${mercury?.house}
- Venus: ${venus?.sign} Casa ${venus?.house}
- Marte: ${mars?.sign} Casa ${mars?.house}

IMPORTANTE: Sin juicio. Sin consejos. Solo descripción.

{
  "mercurio": {
    "titulo": "🗣️ Tu Mente y Comunicación",
    "posicion": "${mercury?.sign} Casa ${mercury?.house}",
    "que_significa_casa": "Una línea sobre Casa ${mercury?.house}",
    "interpretacion": "120-150 palabras. Explica: 1) Cómo piensa, 2) Cómo se expresa, 3) Dónde puede bloquearse mentalmente, 4) Qué aprendizaje profundo existe aquí.",
    "estilo_mental": "Una frase sobre su estilo de pensamiento"
  },
  "venus": {
    "titulo": "💕 Cómo Amas y Qué Valoras",
    "posicion": "${venus?.sign} Casa ${venus?.house}",
    "que_significa_casa": "Una línea sobre Casa ${venus?.house}",
    "interpretacion": "120-150 palabras. Describe: 1) Qué busca en relaciones, 2) Qué necesita para amar con seguridad, 3) Qué valora profundamente.",
    "lenguaje_amor": "40 palabras sobre cómo expresa amor"
  },
  "marte": {
    "titulo": "🔥 Cómo Actúas y Enfrentas la Vida",
    "posicion": "${mars?.sign} Casa ${mars?.house}",
    "que_significa_casa": "Una línea sobre Casa ${mars?.house}",
    "interpretacion": "120-150 palabras. Explica: 1) Cómo toma decisiones, 2) Cómo maneja conflictos, 3) Cómo usa su energía vital.",
    "estilo_accion": "Una frase sobre su forma de actuar"
  }
}
`);
  Object.assign(result, chunk3);

  // CHUNK 4: Júpiter, Saturno
  onProgress?.('🌱 Interpretando Júpiter y Saturno...', 55);
  const chunk4 = await generateCleanChunk(openai, `
Para ${userProfile.name}:

- Júpiter: ${jupiter?.sign} Casa ${jupiter?.house}
- Saturno: ${saturn?.sign} Casa ${saturn?.house}

IMPORTANTE: Sin tono de castigo en Saturno.

{
  "jupiter": {
    "titulo": "🌱 Tu Expansión y Oportunidades",
    "posicion": "${jupiter?.sign} Casa ${jupiter?.house}",
    "que_significa_casa": "Una línea sobre Casa ${jupiter?.house}",
    "interpretacion": "100-120 palabras. Describe dónde fluye con facilidad, dónde tiene oportunidades naturales, cómo crece.",
    "zona_abundancia": "40 palabras sobre su zona de suerte natural"
  },
  "saturno": {
    "titulo": "🪐 Tus Lecciones y Responsabilidades",
    "posicion": "${saturn?.sign} Casa ${saturn?.house}",
    "que_significa_casa": "Una línea sobre Casa ${saturn?.house}",
    "interpretacion": "120-150 palabras. Explica áreas donde debe asumir responsabilidad, dónde enfrenta desafíos recurrentes, qué está aprendiendo. Sin tono de castigo.",
    "leccion_principal": "50 palabras sobre la lección saturnina"
  }
}
`);
  Object.assign(result, chunk4);

  // CHUNK 5: Transpersonales (Urano, Neptuno, Plutón)
  onProgress?.('⚡ Interpretando planetas transpersonales...', 70);
  const chunk5 = await generateCleanChunk(openai, `
Para ${userProfile.name}:

- Urano: ${uranus?.sign} Casa ${uranus?.house}
- Neptuno: ${neptune?.sign} Casa ${neptune?.house}
- Plutón: ${pluto?.sign} Casa ${pluto?.house}

{
  "urano": {
    "titulo": "⚡ Tu Innovación y Originalidad",
    "posicion": "${uranus?.sign} Casa ${uranus?.house}",
    "que_significa_casa": "Una línea sobre Casa ${uranus?.house}",
    "interpretacion": "80-100 palabras. Explica dónde es diferente, innovadora, o disruptiva.",
    "don_unico": "30 palabras sobre su originalidad"
  },
  "neptuno": {
    "titulo": "🌊 Tu Sensibilidad y Espiritualidad",
    "posicion": "${neptune?.sign} Casa ${neptune?.house}",
    "que_significa_casa": "Una línea sobre Casa ${neptune?.house}",
    "interpretacion": "80-100 palabras. Describe su conexión con lo sutil, sensibilidad, dónde puede perderse o trascender.",
    "don_neptuniano": "30 palabras sobre su capacidad intuitiva"
  },
  "pluton": {
    "titulo": "🔮 Tu Poder de Transformación",
    "posicion": "${pluto?.sign} Casa ${pluto?.house}",
    "que_significa_casa": "Una línea sobre Casa ${pluto?.house}",
    "interpretacion": "80-100 palabras. Explica dónde experimenta transformaciones profundas, qué área regenera, dónde está su poder oculto.",
    "poder_plutoniano": "30 palabras sobre su capacidad de regeneración"
  }
}
`);
  Object.assign(result, chunk5);

  // CHUNK 6: Nodos Lunares, Quirón, Formación Temprana
  onProgress?.('🧭 Interpretando Nodos Lunares y Quirón...', 85);
  const chunk6 = await generateCleanChunk(openai, `
Para ${userProfile.name}:

- Nodo Norte: ${northNode?.sign} Casa ${northNode?.house}
- Nodo Sur: ${southNode?.sign} Casa ${southNode?.house}
- Quirón: ${chiron?.sign} Casa ${chiron?.house}
- Luna: ${moon?.sign} Casa ${moon?.house}
- Saturno: ${saturn?.sign} Casa ${saturn?.house}
- Venus: ${venus?.sign} Casa ${venus?.house}

IMPORTANTE: Sin dramatismo en Quirón. Formación temprana conecta infancia con estructura adulta.

{
  "nodos_lunares": {
    "titulo": "🧭 Tu Camino Evolutivo",
    "nodo_norte": {
      "posicion": "${northNode?.sign} Casa ${northNode?.house}",
      "interpretacion": "100 palabras. Hacia dónde debe crecer, qué cualidades debe desarrollar."
    },
    "nodo_sur": {
      "posicion": "${southNode?.sign} Casa ${southNode?.house}",
      "interpretacion": "80 palabras. Patrones aprendidos, zona de confort que debe trascender."
    },
    "sintesis": "60 palabras integrando el eje nodal completo"
  },
  "quiron": {
    "titulo": "💊 Tu Herida Sanadora",
    "posicion": "${chiron?.sign} Casa ${chiron?.house}",
    "que_significa_casa": "Una línea sobre Casa ${chiron?.house}",
    "interpretacion": "100-120 palabras. Explica el área de herida profunda que se convierte en medicina para otros. Sin dramatismo."
  },
  "formacion_temprana": {
    "titulo": "🧬 Tu Formación Temprana",
    "descripcion": "150-180 palabras. Explica cómo la Luna, Saturno y Venus moldearon la personalidad en infancia y adolescencia. Conecta patrones tempranos con estructura adulta."
  }
}
`);
  Object.assign(result, chunk6);

  // CHUNK 7: Luz y Sombra, Síntesis Final
  onProgress?.('🌗 Generando luz y sombra de tu carta...', 95);
  const chunk7 = await generateCleanChunk(openai, `
Para ${userProfile.name}:

Sol: ${sun?.sign} Casa ${sun?.house}
Luna: ${moon?.sign} Casa ${moon?.house}
Ascendente: ${chartData.ascendant.sign}

IMPORTANTE: SIN advertencias. SIN "debe". Sombras como patrones a integrar, no defectos.

{
  "luz_y_sombra": {
    "fortalezas": [
      "Fortaleza 1 basada en posiciones reales",
      "Fortaleza 2 basada en aspectos",
      "Fortaleza 3 basada en configuración"
    ],
    "sombras": [
      "Sombra 1 (sin advertencias, solo descripción)",
      "Sombra 2 (sin juicio)",
      "Sombra 3 (como patrón a integrar)"
    ]
  },
  "sintesis_final": {
    "titulo": "🔑 Síntesis de Identidad",
    "descripcion": "180-220 palabras. Un párrafo final que responda: 1) Quién es esta persona, 2) Qué la define, 3) Qué coherencia interna necesita para sentirse en paz. SIN mantras, rituales, planes de acción, fechas, ni predicciones. Debe ser válida en 10 años."
  }
}
`);
  Object.assign(result, chunk7);

  onProgress?.('✨ Interpretación limpia completada', 100);
  console.log('🌟 [CLEAN NATAL CHUNKED] All chunks completed');

  return result as CartaNatalLimpia;
}

// Helper function for chunk generation
async function generateCleanChunk(openai: OpenAI, prompt: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Eres un astrólogo evolutivo profesional. Respondes ÚNICAMENTE con JSON válido, sin texto adicional. Tono pedagógico, humano y profundo. NUNCA incluyes rituales, mantras, ni predicciones.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content in chunk response');

  return JSON.parse(content);
}

export { type ChartData, type UserProfile };
