//src/services/tripleFusedInterpretationService.ts

// =============================================================================
// 🤖 SERVICIO DE GENERACIÓN DE INTERPRETACIONES TRIPLE FUSIONADO
// tripleFusedInterpretationService.ts
// =============================================================================
// Genera interpretaciones personalizadas con IA usando lenguaje triple fusionado
// (educativo + poderoso + poético)
// =============================================================================

import { generateAscendantTripleFusedPrompt, generateAspectTripleFusedPrompt, generateMidheavenTripleFusedPrompt, generatePlanetTripleFusedPrompt, TripleFusedInterpretation } from '@/utils/prompts/tripleFusedPrompts';
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
  userProfile: UserProfile
): Promise<TripleFusedInterpretation> {
  try {
    console.log(`🎨 Generando interpretación para ${planetName} en ${sign} Casa ${house}...`);

    const openai = getOpenAIClient();
    const prompt = generatePlanetTripleFusedPrompt(planetName, sign, house, degree, userProfile);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto en crear interpretaciones transformacionales con lenguaje triple fusionado (educativo + poderoso + poético). Respondes SOLO con JSON válido.'
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
    
    console.log(`✅ Interpretación generada exitosamente para ${planetName}`);
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
      impacto_real: `Durante tu vida:\n- Tus decisiones en el área de la Casa ${house} reflejan las cualidades de ${sign}\n- Las personas notan en ti características asociadas con ${planetName} en ${sign}\n- Cuando esta energía está activa, experimentas mayor autenticidad y propósito\n- Tu forma de abordar los temas de la Casa ${house} está profundamente influenciada por ${sign}`,
      sombras: [
        {
          nombre: 'Desequilibrio',
          descripcion: 'Cuando esta energía no está integrada',
          trampa: '❌ Puede manifestarse de forma reactiva',
          regalo: '✅ Al integrarla conscientemente, se convierte en fortaleza'
        }
      ],
      sintesis: {
        frase: `Mi ${planetName} en ${sign} es poder esperando ser activado.`,
        declaracion: `Mi ${planetName} en ${sign} no es accidente - es herramienta cósmica. La activo conscientemente para crear mi realidad.`
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
      impacto_real: `Durante tu vida:\n- Las personas perciben inmediatamente tu esencia ${sign} cuando te conocen\n- Tiendes a tomar decisiones que reflejan las cualidades de ${sign}\n- Tu forma de presentarte al mundo está profundamente influenciada por esta configuración\n- Cuando actúas alineado con ${sign}, sientes mayor autenticidad y fluidez`,
      sombras: [
        {
          nombre: 'Máscara rígida',
          descripcion: 'Cuando te identificas demasiado con tu Ascendente',
          trampa: '❌ Puede ocultar tu verdadero ser (Sol)',
          regalo: '✅ Cuando se usa conscientemente, es tu superpoder social'
        }
      ],
      sintesis: {
        frase: `Mi Ascendente en ${sign} es mi poder de presencia.`,
        declaracion: `Mi Ascendente en ${sign} no es máscara - es herramienta consciente. La uso para manifestar mi propósito.`
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
      impacto_real: `Durante tu vida:\n- Tu carrera y vocación tienden a reflejar las cualidades de ${sign}\n- Las personas te reconocen profesionalmente por características asociadas con ${sign}\n- Cuando trabajas alineado con ${sign}, experimentas mayor propósito y satisfacción\n- Tu legado público está profundamente influenciado por esta configuración`,
      sombras: [
        {
          nombre: 'Éxito vacío',
          descripcion: 'Cuando buscas éxito externo sin alineación interna',
          trampa: '❌ Puede llevar a logros que no nutren tu alma',
          regalo: '✅ Cuando sigues tu vocación verdadera, el éxito tiene significado'
        }
      ],
      sintesis: {
        frase: `Mi Medio Cielo en ${sign} es mi llamado cósmico.`,
        declaracion: `Mi Medio Cielo en ${sign} no es trabajo - es misión. La cumplo conscientemente construyendo mi legado.`
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
      impacto_real: `Durante tu vida:\n- Cuando estas dos energías (${planet1} y ${planet2}) interactúan, manifiestas comportamientos característicos del aspecto ${aspectName}\n- Las personas notan cómo integras o tensionas estas dos partes de tu personalidad\n- En situaciones que activan ambas energías, tu respuesta refleja la naturaleza de esta conexión\n- Tu crecimiento personal depende de aprender a trabajar conscientemente con este diálogo interno`,
      sombras: [
        {
          nombre: 'Desintegración',
          descripcion: 'Cuando estas energías están en conflicto no resuelto',
          trampa: '❌ Puede crear fragmentación interna',
          regalo: '✅ Al integrarlas, emerges más completo y poderoso'
        }
      ],
      sintesis: {
        frase: `Mi ${aspectName} entre ${planet1} y ${planet2} es puente de poder.`,
        declaracion: `Integro conscientemente mi ${planet1} y ${planet2}. Esta conexión no me divide - me completa.`
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