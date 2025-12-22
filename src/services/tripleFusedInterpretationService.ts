//src/services/tripleFusedInterpretationService.ts

// =============================================================================
// 🤖 SERVICIO DE GENERACIÓN DE INTERPRETACIONES TRIPLE FUSIONADO
// tripleFusedInterpretationService.ts
// =============================================================================
// Genera interpretaciones personalizadas con IA usando lenguaje triple fusionado
// (educativo + poderoso + poético)
// =============================================================================

import { generateAscendantTripleFusedPrompt, generateAspectTripleFusedPrompt, generateMidheavenTripleFusedPrompt, generatePlanetTripleFusedPrompt, generateSolarReturnPlanetPrompt, TripleFusedInterpretation } from '@/utils/prompts/tripleFusedPrompts';
import OpenAI from 'openai';

// =============================================================================
// 🔧 CLIENTE OPENAI
// =============================================================================

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY no configurada en variables de entorno');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID || undefined,
    project: process.env.OPENAI_PROJECT_ID || undefined,
  });
}

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface UserProfile {
  name: string;
  age: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

// =============================================================================
// 🌟 GENERAR INTERPRETACIÓN DE PLANETA
// =============================================================================

export async function generatePlanetInterpretation(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  userProfile: UserProfile,
  chartType: string = 'natal',
  year?: number,
  natalPlanetPosition?: { sign: string; house: number }
): Promise<TripleFusedInterpretation> {
  try {
    const chartLabel = chartType === 'solar-return' ? `SR ${year}` : 'Natal';
    console.log(`🎨 Generando interpretación ${chartLabel} para ${planetName} en ${sign} Casa ${house}...`);

    if (natalPlanetPosition) {
      console.log(`📊 Con comparación natal: ${planetName} Natal en ${natalPlanetPosition.sign} Casa ${natalPlanetPosition.house}`);
    }

    const openai = getOpenAIClient();

    // Usar el prompt apropiado según el tipo de carta
    const prompt = chartType === 'solar-return'
      ? generateSolarReturnPlanetPrompt(planetName, sign, house, degree, year!, natalPlanetPosition, userProfile)
      : generatePlanetTripleFusedPrompt(planetName, sign, house, degree, userProfile);

    // Mensaje de sistema específico según el tipo de carta
    const systemMessage = chartType === 'solar-return'
      ? 'Eres un astrólogo evolutivo experto en Solar Return. Respondes ÚNICAMENTE con JSON válido, sin markdown, sin backticks, sin comentarios. Usas lenguaje TEMPORAL específico del año (este año, durante 2025, etc.).'
      : 'Eres un astrólogo evolutivo experto en crear interpretaciones transformacionales con lenguaje triple fusionado (educativo + poderoso + poético). Respondes SOLO con JSON válido.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const interpretation = JSON.parse(content) as TripleFusedInterpretation;

    console.log(`✅ Interpretación ${chartLabel} generada exitosamente para ${planetName}`);
    return interpretation;

  } catch (error) {
    console.error(`❌ Error generando interpretación para ${planetName}:`, error);

    // Fallback: interpretación genérica
    return generateFallbackPlanetInterpretation(planetName, sign, house);
  }
}

// =============================================================================
// 🎯 GENERAR INTERPRETACIÓN DE ASCENDENTE
// =============================================================================

export async function generateAscendantInterpretation(
  sign: string,
  degree: number,
  userProfile: UserProfile
): Promise<TripleFusedInterpretation> {
  try {
    console.log(`🎨 Generando interpretación para Ascendente en ${sign}...`);

    const openai = getOpenAIClient();
    const prompt = generateAscendantTripleFusedPrompt(sign, degree, userProfile);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto en crear interpretaciones transformacionales con lenguaje triple fusionado. Respondes SOLO con JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const interpretation = JSON.parse(content) as TripleFusedInterpretation;
    
    console.log(`✅ Interpretación de Ascendente generada exitosamente`);
    return interpretation;

  } catch (error) {
    console.error(`❌ Error generando interpretación de Ascendente:`, error);
    return generateFallbackAscendantInterpretation(sign);
  }
}

// =============================================================================
// 🎯 GENERAR INTERPRETACIÓN DE MEDIO CIELO
// =============================================================================

export async function generateMidheavenInterpretation(
  sign: string,
  degree: number,
  userProfile: UserProfile
): Promise<TripleFusedInterpretation> {
  try {
    console.log(`🎨 Generando interpretación para Medio Cielo en ${sign}...`);

    const openai = getOpenAIClient();
    const prompt = generateMidheavenTripleFusedPrompt(sign, degree, userProfile);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto en crear interpretaciones transformacionales con lenguaje triple fusionado. Respondes SOLO con JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const interpretation = JSON.parse(content) as TripleFusedInterpretation;
    
    console.log(`✅ Interpretación de Medio Cielo generada exitosamente`);
    return interpretation;

  } catch (error) {
    console.error(`❌ Error generando interpretación de Medio Cielo:`, error);
    return generateFallbackMidheavenInterpretation(sign);
  }
}

// =============================================================================
// ⚡ GENERAR INTERPRETACIÓN DE ASPECTO
// =============================================================================

export async function generateAspectInterpretation(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  userProfile: UserProfile
): Promise<TripleFusedInterpretation> {
  try {
    console.log(`🎨 Generando interpretación para ${planet1} ${aspectType} ${planet2}...`);

    const openai = getOpenAIClient();
    const prompt = generateAspectTripleFusedPrompt(planet1, planet2, aspectType, orb, userProfile);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto en crear interpretaciones transformacionales con lenguaje triple fusionado. Respondes SOLO con JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const interpretation = JSON.parse(content) as TripleFusedInterpretation;
    
    console.log(`✅ Interpretación de aspecto generada exitosamente`);
    return interpretation;

  } catch (error) {
    console.error(`❌ Error generando interpretación de aspecto:`, error);
    return generateFallbackAspectInterpretation(planet1, planet2, aspectType);
  }
}

// =============================================================================
// 🔄 FALLBACKS (Interpretaciones genéricas de respaldo)
// =============================================================================

function generateFallbackPlanetInterpretation(
  planetName: string,
  sign: string,
  house: number
): TripleFusedInterpretation {
  return {
    tooltip: {
      titulo: `${planetName} en ${sign}`,
      descripcionBreve: `${planetName} en ${sign} en Casa ${house}`,
      significado: `Esta posición planetaria tiene un significado único en tu carta natal. ${planetName} en ${sign} define aspectos importantes de tu personalidad y vida.`,
      efecto: 'Influencia significativa en esta área de vida',
      tipo: 'Posición importante'
    },
    drawer: {
      titulo: `${planetName} en ${sign} Casa ${house}`,
      educativo: `${planetName} representa una energía específica en tu carta natal. En el signo de ${sign}, esta energía se expresa de una manera particular. La Casa ${house} indica el área de vida donde esta energía se manifiesta más claramente.`,
      poderoso: `Esta posición te otorga capacidades únicas que puedes desarrollar conscientemente. Tu ${planetName} en ${sign} es parte de tu don personal que viniste a compartir con el mundo.`,
      poetico: `Imagina que tu ${planetName} es como una luz brillando a través del prisma de ${sign}, proyectando sus colores únicos en el área de vida representada por la Casa ${house}.`,
      sombras: [
        {
          nombre: 'Desequilibrio',
          descripcion: 'Cuando esta energía no está integrada',
          trampa: '❌ Puede manifestarse de forma reactiva',
          regalo: '✅ Al integrarla conscientemente, se convierte en fortaleza'
        }
      ],
      sintesis: {
        frase: `Tu ${planetName} en ${sign} es tu superpoder único.`,
        declaracion: `Yo honro mi ${planetName} en ${sign} y uso su energía conscientemente para crear la vida que deseo.`
      }
    }
  };
}

function generateFallbackAscendantInterpretation(sign: string): TripleFusedInterpretation {
  return {
    tooltip: {
      titulo: `Ascendente en ${sign}`,
      descripcionBreve: `Ascendente en ${sign} (Identidad Externa)`,
      significado: `Tu Ascendente en ${sign} define cómo te presentas al mundo y cómo los demás te perciben inicialmente.`,
      efecto: 'Primera impresión y máscara social',
      tipo: 'Identidad externa'
    },
    drawer: {
      titulo: `Tu Ascendente en ${sign}`,
      educativo: `El Ascendente es el signo que estaba ascendiendo en el horizonte oriental en el momento exacto de tu nacimiento. Representa tu máscara social, tu primera impresión, y cómo te presentas al mundo. En ${sign}, esta energía se expresa de forma única.`,
      poderoso: `Tu Ascendente en ${sign} es tu herramienta para navegar el mundo. No es una mentira, es tu interfaz con la realidad exterior.`,
      poetico: `Imagina que tu Ascendente es la puerta de entrada a tu ser. En ${sign}, esta puerta tiene características únicas que invitan al mundo a conocerte.`,
      sombras: [
        {
          nombre: 'Máscara rígida',
          descripcion: 'Cuando te identificas demasiado con tu Ascendente',
          trampa: '❌ Puede ocultar tu verdadero ser (Sol)',
          regalo: '✅ Cuando se usa conscientemente, es tu superpoder social'
        }
      ],
      sintesis: {
        frase: `Mi Ascendente en ${sign} es mi forma única de estar en el mundo.`,
        declaracion: `Yo uso mi Ascendente en ${sign} conscientemente como herramienta, no como prisión.`
      }
    }
  };
}

function generateFallbackMidheavenInterpretation(sign: string): TripleFusedInterpretation {
  return {
    tooltip: {
      titulo: `Medio Cielo en ${sign}`,
      descripcionBreve: `Medio Cielo en ${sign} (Vocación)`,
      significado: `Tu Medio Cielo en ${sign} indica tu vocación del alma y el legado que viniste a dejar en el mundo.`,
      efecto: 'Vocación y legado público',
      tipo: 'Propósito profesional'
    },
    drawer: {
      titulo: `Tu Medio Cielo en ${sign}`,
      educativo: `El Medio Cielo es el punto más alto del cielo en tu carta natal. Representa tu vocación, tu imagen pública, y el tipo de contribución que quieres hacer al mundo. En ${sign}, esta vocación toma una forma específica.`,
      poderoso: `Tu Medio Cielo en ${sign} no es solo sobre "trabajo" - es sobre tu contribución única al mundo. Es tu legado en construcción.`,
      poetico: `Imagina que tu Medio Cielo es la cumbre de una montaña. En ${sign}, esta cumbre tiene características únicas que definen lo que viniste a alcanzar y compartir.`,
      sombras: [
        {
          nombre: 'Éxito vacío',
          descripcion: 'Cuando buscas éxito externo sin alineación interna',
          trampa: '❌ Puede llevar a logros que no nutren tu alma',
          regalo: '✅ Cuando sigues tu vocación verdadera, el éxito tiene significado'
        }
      ],
      sintesis: {
        frase: `Mi Medio Cielo en ${sign} es mi llamado del alma.`,
        declaracion: `Yo sigo mi vocación en ${sign} y dejo un legado alineado con mi verdad.`
      }
    }
  };
}

function generateFallbackAspectInterpretation(
  planet1: string,
  planet2: string,
  aspectType: string
): TripleFusedInterpretation {
  // Traducir tipos de aspectos
  const aspectTypeSpanish: Record<string, string> = {
    'conjunction': 'Conjunción',
    'opposition': 'Oposición',
    'trine': 'Trígono',
    'square': 'Cuadratura',
    'sextile': 'Sextil'
  };
  
  const aspectName = aspectTypeSpanish[aspectType] || aspectType;
  
  return {
    tooltip: {
      titulo: `${aspectName}: ${planet1} y ${planet2}`,
      descripcionBreve: `${aspectName} entre ${planet1} y ${planet2}`,
      significado: `Este aspecto crea una conversación interna entre dos partes de tu personalidad, representadas por ${planet1} y ${planet2}.`,
      efecto: 'Diálogo interno significativo',
      tipo: aspectType === 'trine' || aspectType === 'sextile' ? 'Fluido' : 'Tenso'
    },
    drawer: {
      titulo: `${aspectName}: El Diálogo entre ${planet1} y ${planet2}`,
      educativo: `Los aspectos son ángulos entre planetas que crean "conversaciones" internas. Una ${aspectName} entre ${planet1} y ${planet2} indica una relación específica entre estas dos energías en tu psique.`,
      poderoso: `Este aspecto es parte de tu arquitectura interna única. La tensión o armonía entre ${planet1} y ${planet2} es donde se forja tu maestría.`,
      poetico: `Imagina que ${planet1} y ${planet2} son dos músicos tocando juntos. Su ${aspectName} determina si tocan en armonía o crean tensión creativa.`,
      sombras: [
        {
          nombre: 'Desintegración',
          descripcion: 'Cuando estas energías están en conflicto no resuelto',
          trampa: '❌ Puede crear fragmentación interna',
          regalo: '✅ Al integrarlas, emerges más completo y poderoso'
        }
      ],
      sintesis: {
        frase: `Mi ${aspectName} entre ${planet1} y ${planet2} es mi fortaleza interna.`,
        declaracion: `Yo integro conscientemente las energías de ${planet1} y ${planet2}, convirtiéndolas en mi superpoder.`
      }
    }
  };
}

// =============================================================================
// 💾 CACHÉ DE INTERPRETACIONES (opcional, para optimización)
// =============================================================================

const interpretationCache = new Map<string, TripleFusedInterpretation>();

export function getCachedInterpretation(key: string): TripleFusedInterpretation | null {
  return interpretationCache.get(key) || null;
}

export function setCachedInterpretation(key: string, interpretation: TripleFusedInterpretation): void {
  interpretationCache.set(key, interpretation);
}

export function clearInterpretationCache(): void {
  interpretationCache.clear();
}