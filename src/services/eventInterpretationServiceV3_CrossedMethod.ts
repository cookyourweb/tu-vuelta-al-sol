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

  // ESTRUCTURA DEFINITIVA DE LA AGENDA
  energia_dominante: string;                   // Qué energía domina este día
  interpretacion_cruzada: PlanetQuestion[];    // Preguntas por planeta activo
  como_vivir_siendo_tu: string;                // Cómo vivir este día siendo tú
  accion_recomendada: string[];                // Acciones concretas (3-4 items)
  sombra_a_evitar: string[];                   // Sombras (3-4 items)
  frase_ancla: string;                         // Frase ancla del día

  // Metadata
  cached: boolean;
  generatedAt: Date;
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

  const prompt = `Genera una interpretación de evento astrológico usando METODOLOGÍA CRUZADA PROFESIONAL.

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

ESTRUCTURA OBLIGATORIA (JSON):

{
  "energia_dominante": "[40-60 palabras] Qué energía domina este día. NO explicar astrología, sino traducir a experiencia. Ejemplo: 'Hoy el cielo pide DECISIONES CONCRETAS, no planes abstractos. La energía empuja hacia lo tangible, lo que puedes tocar y verificar.'",

  "interpretacion_cruzada": [
    {
      "planet": "[Nombre del planeta activo 1]",
      "question": "[Pregunta específica basada en este planeta y el evento. Ej: ¿Dónde estás sosteniendo algo que ya no avanza?]",
      "context": "[20-30 palabras] Por qué este planeta es relevante hoy. Ej: Con Marte activo este año en tu casa 10, este evento toca directamente tu forma de actuar en lo público."
    },
    {
      "planet": "[Nombre del planeta activo 2]",
      "question": "[Pregunta específica]",
      "context": "[20-30 palabras] Relevancia"
    },
    {
      "planet": "[Nombre del planeta activo 3]",
      "question": "[Pregunta específica]",
      "context": "[20-30 palabras] Relevancia"
    }
  ],

  "como_vivir_siendo_tu": "[80-100 palabras] Cómo vivir este día siendo TÚ específicamente. Integrar tu natal con el evento. NO genérico. Ej: 'Con tu Sol en Tauro y Luna en Escorpio, este evento no te pide acelerar, te pide SOSTENER con intensidad. Tu naturaleza construye despacio pero profundo. Hoy usa eso: no agregues tareas, profundiza en las que ya tienes. No busques respuestas nuevas, confirma las que ya sabes.'",

  "accion_recomendada": [
    "[Acción concreta 1 - NO genérica. Ej: Revisa compromisos laborales y elimina uno que solo sostienes por obligación]",
    "[Acción concreta 2 - Ej: Escribe en 5 minutos qué responsabilidad estás evitando asumir]",
    "[Acción concreta 3 - Ej: Define UN límite claro con alguien que te pide más de lo que puedes dar]"
  ],

  "sombra_a_evitar": [
    "[Sombra 1 - Palabra o frase corta. Ej: Rigidez]",
    "[Sombra 2 - Ej: Autoexigencia excesiva]",
    "[Sombra 3 - Ej: Culpa por descansar]"
  ],

  "frase_ancla": "[8-12 palabras máximo] Frase potente e integradora que resume el día. Ej: 'Sostenerme también es avanzar.'"
}

REGLAS CRÍTICAS:
- NO explicar astrología. Traducir a experiencia.
- NO lenguaje poético. Lenguaje DIRECTO.
- Usar datos reales: planetas activos, natal, evento.
- Interpretación cruzada: mínimo 2 planetas, máximo 4 (solo los MÁS relevantes para este evento).
- Acciones CONCRETAS y ESPECÍFICAS (no "dedica tiempo a...", sino "escribe en 5 minutos...")
- Sombras en 1-3 palabras cada una.
- Frase ancla: corta, potente, memorable.
- Tono: OBSERVADOR, no imperativo. "Este día funciona mejor cuando..." en vez de "Debes hacer..."

OBJETIVO: Que ${userName} sienta que este evento cruza perfectamente quién es (natal) + qué activa el año + qué pide el momento.`;

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
      energia_dominante: parsed.energia_dominante || '',
      interpretacion_cruzada: parsed.interpretacion_cruzada || [],
      como_vivir_siendo_tu: parsed.como_vivir_siendo_tu || '',
      accion_recomendada: parsed.accion_recomendada || [],
      sombra_a_evitar: parsed.sombra_a_evitar || [],
      frase_ancla: parsed.frase_ancla || '',
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
    energia_dominante: `${event.title} - Momento de reflexión y ajuste consciente.`,
    interpretacion_cruzada: [
      {
        planet: 'Sol',
        question: '¿Qué necesitas reconocer de ti mismo hoy?',
        context: 'El Sol siempre pide autenticidad.'
      }
    ],
    como_vivir_siendo_tu: `Este evento ${event.title} te invita a pausar y observar. Cada persona lo vive según su carta natal, así que confía en tu intuición sobre qué significa para ti.`,
    accion_recomendada: [
      'Dedica 10 minutos a reflexionar sobre este evento',
      'Anota qué emociones surgen hoy',
      'Observa sin juzgar'
    ],
    sombra_a_evitar: [
      'Prisa',
      'Comparación con otros',
      'Autoexigencia'
    ],
    frase_ancla: 'Confía en tu ritmo.',
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
