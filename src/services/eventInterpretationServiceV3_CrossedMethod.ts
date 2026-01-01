// =============================================================================
// 🌟 EVENT INTERPRETATION SERVICE V3 - CROSSED METHODOLOGY
// src/services/eventInterpretationServiceV3_CrossedMethod.ts
// =============================================================================
// Nueva metodología: INTERPRETACIÓN CRUZADA
// Cruza: Natal + Planetas Activos del Año + Momento del Evento
// =============================================================================

import OpenAI from 'openai';
import connectDB from '@/lib/db';
import EventInterpretation from '@/models/EventInterpretation';
import { PlanetaryActivationCard } from './planetaryActivationService';
import { AstrologicalEvent } from '@/types/astrology/events';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Nueva estructura de interpretación de eventos
 * Basada en la plantilla reutilizable de agenda profesional
 */
export interface CrossedEventInterpretation {
  eventId: string;
  title: string;
  date: string;

  // ESTRUCTURA DEFINITIVA DE LA AGENDA (FORMATO EXTENDIDO)
  clima_del_dia: string[];                     // Keywords del clima (ej: ["cierre", "madurez", "resultados visibles"])
  energias_activas: string[];                  // Planetas activos este año con símbolos (ej: ["♂ Marte", "♀ Venus", "♄ Saturno"])
  mensaje_sintesis: string;                    // 1-2 frases potentes de síntesis

  como_te_afecta: string;                      // Párrafo largo explicando cómo vive ESTA PERSONA el evento (200-300 palabras)
  interpretacion_practica: PlanetaryPracticalContext[];  // Por cada planeta activo, cómo se relaciona con el evento

  accion_concreta: ActionExercise;             // Ejercicio estructurado con pasos
  sombra_a_evitar: ShadowWarning[];            // Sombras con explicación
  frase_ancla: string;                         // Frase ancla del día

  apoyo_energetico?: EnergySuppport[];         // OPCIONAL: Velas, piedras, ejercicios
  cierre_del_dia: string;                      // Mensaje de cierre (2-3 líneas)

  // Deprecated (mantener para compatibilidad)
  energia_dominante?: string;
  interpretacion_cruzada?: PlanetQuestion[];
  como_vivir_siendo_tu?: string;
  accion_recomendada?: string[];

  // Metadata
  cached: boolean;
  generatedAt: Date;
}

export interface PlanetaryPracticalContext {
  planet: string;                // "Marte activo"
  interpretation: string;        // "tu cuerpo y tu energía ya saben qué no quieren empujar más"
}

export interface ActionExercise {
  title: string;                 // "Ejercicio de cierre consciente"
  steps: string[];               // Pasos detallados del ejercicio
}

export interface ShadowWarning {
  shadow: string;                // "Exigirte más de lo necesario"
  explanation?: string;          // Explicación adicional (opcional)
}

export interface EnergySuppport {
  type: 'vela' | 'piedra' | 'ejercicio';
  item: string;                  // "Vela marrón o negra"
  purpose: string;               // "estructura y cierre consciente"
}

/**
 * Pregunta específica basada en un planeta activo
 */
export interface PlanetQuestion {
  planet: string;                    // "Marte", "Venus", etc.
  question: string;                  // "¿Dónde estás sosteniendo algo que ya no avanza?"
  context: string;                   // Por qué es relevante este planeta hoy
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

// =============================================================================
// CACHE SYSTEM
// =============================================================================

async function getCachedCrossedInterpretation(
  userId: string,
  eventId: string
): Promise<CrossedEventInterpretation | null> {
  try {
    await connectDB();

    const cached = await EventInterpretation.findOne({
      userId,
      eventId,
      expiresAt: { $gt: new Date() },
      version: 'v3_crossed' // Nueva versión
    }).sort({ createdAt: -1 });

    if (cached && cached.interpretation) {
      console.log(`✅ [CACHE HIT V3] Event ${eventId} for user ${userId}`);
      return {
        ...cached.interpretation,
        eventId,
        cached: true,
        generatedAt: cached.createdAt
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

async function saveCrossedInterpretation(
  userId: string,
  eventId: string,
  interpretation: CrossedEventInterpretation
): Promise<void> {
  try {
    await connectDB();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await EventInterpretation.create({
      userId,
      eventId,
      interpretation,
      expiresAt,
      method: 'openai',
      version: 'v3_crossed', // Nueva versión
      cached: false
    });

    console.log(`💾 [CACHE SAVED V3] Event ${eventId} for user ${userId}`);
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

// =============================================================================
// PROMPT DEFINITIVO - METODOLOGÍA CRUZADA
// =============================================================================

function buildCrossedMethodologyPrompt(
  event: AstrologicalEvent,
  userName: string,
  userAge: number,
  natalSummary: string,  // Resumen de quién es (natal)
  activePlanets: PlanetaryActivationCard[]  // Planetas activos del año
): string {

  // Construir lista de planetas activos
  const planetsContext = activePlanets.map(card => {
    return `
${card.planet} ACTIVO ESTE AÑO:
- Natal: ${card.natal.posicion} - ${card.natal.descripcion.substring(0, 150)}
- Activación: ${card.activacion_anual.razon_activacion}
- Traducción: ${card.traduccion_practica}
- Regla: ${card.regla_del_ano}`;
  }).join('\n');

  const prompt = `Genera una interpretación ULTRA DETALLADA de evento astrológico usando METODOLOGÍA CRUZADA PROFESIONAL.

Esta metodología cruza:
1. Quién es la persona (natal)
2. Qué planetas están activos este año
3. Qué pide el momento (evento)

USUARIO:
- Nombre: ${userName}
- Edad: ${userAge} años

QUIÉN ERES (RESUMEN NATAL):
${natalSummary}

PLANETAS ACTIVOS ESTE AÑO:
${planetsContext}

EVENTO DEL DÍA:
- Tipo: ${event.type}
- Título: ${event.title}
- Fecha: ${event.date}
- Signo: ${event.sign || 'N/A'}
${event.planet ? `- Planeta: ${event.planet}` : ''}
${event.description ? `- Descripción: ${event.description}` : ''}

ESTRUCTURA OBLIGATORIA (JSON EXTENDIDO):

{
  "clima_del_dia": ["[keyword 1]", "[keyword 2]", "[keyword 3]"],
  "energias_activas": ["♂ Marte", "♀ Venus", "♄ Saturno"],
  "mensaje_sintesis": "[1-2 frases MUY potentes que resumen lo esencial del día. NO genérico. Ej: 'Cerrar con responsabilidad lo que ya ha cumplido su función. Hoy no se trata de sentir más, sino de asumir una decisión clara.']",

  "como_te_afecta": "[200-300 palabras] PÁRRAFO LARGO Y ULTRA PERSONALIZADO. Explicar cómo ESTA PERSONA ESPECÍFICA vive este evento basado en su natal y sus planetas activos.

Estructura sugerida:
- Párrafo 1: Quién eres tú naturalmente (usar su Sol, Luna, Ascendente si están en el resumen natal)
- Párrafo 2: Qué te piden los planetas activos ESTE AÑO
- Párrafo 3: Qué punto clave activa este evento
- Bullets: 3-4 preguntas o puntos clave (usando ¿Dónde...? ¿Qué...?)

Ejemplo:
'Tú eres una persona constante, que avanza despacio pero con determinación.
Este año Marte te está pidiendo acción sostenida, Venus revisar qué valoras de verdad y Saturno poner límites firmes.

Esta Luna Llena activa un punto clave:
👉 ¿Dónde sigues sosteniendo algo solo por responsabilidad, no por convicción?

Hoy se ve con claridad:
• Qué esfuerzo sí merece la pena
• Qué compromiso se ha convertido en peso
• Qué estructura necesita un cierre definitivo'",

  "interpretacion_practica": [
    {
      "planet": "Marte activo",
      "interpretation": "tu cuerpo y tu energía ya saben qué no quieren empujar más"
    },
    {
      "planet": "Venus activo",
      "interpretation": "tu sistema interno pide coherencia entre lo que das y lo que recibes"
    },
    {
      "planet": "Saturno activo",
      "interpretation": "la vida te pide una decisión adulta, no una excusa"
    }
  ],

  "accion_concreta": {
    "title": "Ejercicio de cierre consciente",
    "steps": [
      "Completa por escrito: 'Hoy dejo de sostener ____________________ porque ya no me construye ni me representa.'",
      "Después, escribe: 'Elijo comprometerme con ____________________ desde la calma y no desde la obligación.'"
    ]
  },

  "sombra_a_evitar": [
    { "shadow": "Exigirte más de lo necesario", "explanation": "" },
    { "shadow": "Culpabilizarte por descansar", "explanation": "" },
    { "shadow": "Pensar que soltar es fracasar", "explanation": "Soltar hoy es ordenar tu energía, no rendirte." }
  ],

  "frase_ancla": "Puedo ser responsable sin cargar con todo.",

  "apoyo_energetico": [
    { "type": "vela", "item": "Vela marrón o negra", "purpose": "estructura y cierre consciente" },
    { "type": "piedra", "item": "Ónix u obsidiana", "purpose": "límites y protección energética" },
    { "type": "ejercicio", "item": "5 minutos de respiración lenta antes de dormir", "purpose": "calmar el sistema nervioso" }
  ],

  "cierre_del_dia": "Esta Luna Llena no viene a quitarte nada. Viene a devolverte espacio, foco y autoridad personal."
}

REGLAS CRÍTICAS:
- NO explicar astrología. Traducir a experiencia VIVIDA.
- NO lenguaje poético. Lenguaje DIRECTO y ESPECÍFICO.
- "como_te_afecta" debe ser LARGO (200-300 palabras) y ULTRA PERSONALIZADO
- "interpretacion_practica" debe tener una línea por cada planeta activo RELEVANTE a este evento
- "accion_concreta" debe ser un EJERCICIO ESTRUCTURADO con pasos claros (no genérico)
- "sombra_a_evitar" puede tener explicación en la última sombra si es necesario
- "apoyo_energetico" es OPCIONAL pero muy valorado (3 items: vela, piedra, ejercicio)
- "cierre_del_dia" debe ser 2-3 líneas de mensaje positivo y empoderante
- Tono: OBSERVADOR pero POTENTE. No imperativo, pero SÍ claro.

OBJETIVO: Que ${userName} sienta que esta interpretación es TAN ESPECÍFICA que solo puede ser para él/ella.`;

  return prompt;
}

// =============================================================================
// GENERAR INTERPRETACIÓN CRUZADA CON OPENAI
// =============================================================================

export async function generateCrossedInterpretation(
  event: AstrologicalEvent,
  userId: string,
  userName: string,
  userAge: number,
  natalSummary: string,
  activePlanets: PlanetaryActivationCard[],
  options?: {
    skipCache?: boolean;
  }
): Promise<CrossedEventInterpretation> {

  const eventId = `${event.id}_${event.date}`;

  // 1. Intentar caché primero
  if (!options?.skipCache) {
    const cached = await getCachedCrossedInterpretation(userId, eventId);
    if (cached) {
      return cached;
    }
  }

  // 2. Validar que tengamos planetas activos
  if (!activePlanets || activePlanets.length === 0) {
    console.warn('⚠️ No active planets provided, using fallback');
    return generateFallbackCrossedInterpretation(event, userName);
  }

  // 3. Generar con OpenAI
  const client = getOpenAIClient();
  const prompt = buildCrossedMethodologyPrompt(event, userName, userAge, natalSummary, activePlanets);

  console.log(`🤖 [AI V3] Generating crossed interpretation for ${userName} - ${event.title}`);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    const interpretation: CrossedEventInterpretation = {
      eventId,
      title: event.title,
      date: event.date,

      // Nuevo formato extendido
      clima_del_dia: parsed.clima_del_dia || [],
      energias_activas: parsed.energias_activas || [],
      mensaje_sintesis: parsed.mensaje_sintesis || '',
      como_te_afecta: parsed.como_te_afecta || '',
      interpretacion_practica: parsed.interpretacion_practica || [],
      accion_concreta: parsed.accion_concreta || { title: '', steps: [] },
      sombra_a_evitar: parsed.sombra_a_evitar || [],
      frase_ancla: parsed.frase_ancla || '',
      apoyo_energetico: parsed.apoyo_energetico || [],
      cierre_del_dia: parsed.cierre_del_dia || '',

      // Campos deprecated (mantener por compatibilidad)
      energia_dominante: parsed.energia_dominante,
      interpretacion_cruzada: parsed.interpretacion_cruzada,
      como_vivir_siendo_tu: parsed.como_vivir_siendo_tu,
      accion_recomendada: parsed.accion_recomendada,

      cached: false,
      generatedAt: new Date()
    };

    // 4. Guardar en caché
    await saveCrossedInterpretation(userId, eventId, interpretation);

    console.log(`✅ [AI V3] Generated with ${interpretation.interpretacion_cruzada.length} planet questions`);

    return interpretation;

  } catch (error) {
    console.error('❌ Error generating crossed interpretation:', error);
    return generateFallbackCrossedInterpretation(event, userName);
  }
}

// =============================================================================
// FALLBACK SI FALLA OPENAI
// =============================================================================

function generateFallbackCrossedInterpretation(
  event: AstrologicalEvent,
  userName: string
): CrossedEventInterpretation {
  return {
    eventId: `${event.id}_${event.date}`,
    title: event.title,
    date: event.date,

    // Nuevo formato extendido
    clima_del_dia: ['reflexión', 'pausa', 'ajuste'],
    energias_activas: [],
    mensaje_sintesis: 'Momento de reflexión y ajuste consciente. Confía en tu intuición sobre qué significa este evento para ti.',
    como_te_afecta: `Este evento ${event.title} te invita a pausar y observar. Cada persona lo vive según su carta natal, así que confía en tu intuición sobre qué significa para ti. Hoy es un día para escuchar tu voz interior y reconocer qué necesitas realmente.`,
    interpretacion_practica: [],
    accion_concreta: {
      title: 'Reflexión consciente',
      steps: [
        'Dedica 10 minutos a reflexionar sobre este evento',
        'Anota qué emociones surgen hoy',
        'Observa sin juzgar'
      ]
    },
    sombra_a_evitar: [
      { shadow: 'Prisa', explanation: '' },
      { shadow: 'Comparación con otros', explanation: '' },
      { shadow: 'Autoexigencia', explanation: 'Confía en tu ritmo.' }
    ],
    frase_ancla: 'Confía en tu ritmo.',
    apoyo_energetico: [],
    cierre_del_dia: 'Este día te invita a confiar en tu propio proceso.',

    // Deprecated fields
    energia_dominante: `${event.title} - Momento de reflexión y ajuste consciente.`,
    interpretacion_cruzada: [
      {
        planet: 'Sol',
        question: '¿Qué necesitas reconocer de ti mismo hoy?',
        context: 'El Sol siempre pide autenticidad.'
      }
    ],
    como_vivir_siendo_tu: `Este evento ${event.title} te invita a pausar y observar.`,
    accion_recomendada: ['Dedica 10 minutos a reflexionar', 'Anota qué emociones surgen', 'Observa sin juzgar'],

    cached: false,
    generatedAt: new Date()
  };
}

// =============================================================================
// HELPER: Generar resumen natal básico
// =============================================================================

export function generateNatalSummary(natalChart: any): string {
  const sun = natalChart.planets?.find((p: any) => p.name === 'Sol');
  const moon = natalChart.planets?.find((p: any) => p.name === 'Luna');
  const rising = natalChart.ascendant;

  let summary = '';

  if (sun) {
    summary += `Sol en ${sun.sign} Casa ${sun.house} → Tu identidad se expresa buscando ${getSignQuality(sun.sign)}. `;
  }

  if (moon) {
    summary += `Luna en ${moon.sign} Casa ${moon.house} → Emocionalmente necesitas ${getSignEmotionalNeed(moon.sign)}. `;
  }

  if (rising) {
    summary += `Ascendente en ${rising.sign} → Te presentas al mundo como ${getSignPresentation(rising.sign)}.`;
  }

  return summary || 'Persona con carta natal única.';
}

function getSignQuality(sign: string): string {
  const qualities: Record<string, string> = {
    'Aries': 'acción y liderazgo',
    'Tauro': 'estabilidad y placer',
    'Géminis': 'variedad y conocimiento',
    'Cáncer': 'seguridad emocional',
    'Leo': 'reconocimiento y creatividad',
    'Virgo': 'utilidad y perfección',
    'Libra': 'armonía y relación',
    'Escorpio': 'profundidad y transformación',
    'Sagitario': 'expansión y significado',
    'Capricornio': 'logro y estructura',
    'Acuario': 'innovación y libertad',
    'Piscis': 'trascendencia y unión'
  };
  return qualities[sign] || 'autenticidad';
}

function getSignEmotionalNeed(sign: string): string {
  const needs: Record<string, string> = {
    'Aries': 'movimiento y autonomía',
    'Tauro': 'paz y seguridad material',
    'Géminis': 'estimulación mental',
    'Cáncer': 'pertenencia y cuidado',
    'Leo': 'ser visto y apreciado',
    'Virgo': 'orden y servicio',
    'Libra': 'equilibrio y compañía',
    'Escorpio': 'intensidad y verdad',
    'Sagitario': 'libertad y aventura',
    'Capricornio': 'respeto y logro',
    'Acuario': 'libertad y comunidad',
    'Piscis': 'conexión espiritual'
  };
  return needs[sign] || 'equilibrio emocional';
}

function getSignPresentation(sign: string): string {
  const presentations: Record<string, string> = {
    'Aries': 'directo y valiente',
    'Tauro': 'confiable y sereno',
    'Géminis': 'curioso y comunicativo',
    'Cáncer': 'sensible y protector',
    'Leo': 'cálido y carismático',
    'Virgo': 'útil y analítico',
    'Libra': 'diplomático y encantador',
    'Escorpio': 'intenso y magnético',
    'Sagitario': 'optimista y aventurero',
    'Capricornio': 'serio y competente',
    'Acuario': 'único y visionario',
    'Piscis': 'empático y artístico'
  };
  return presentations[sign] || 'auténtico';
}
