// =============================================================================
// 🌟 EVENT INTERPRETATION SERVICE
// src/services/eventInterpretationService.ts
// =============================================================================
// Genera interpretaciones personalizadas para eventos astrológicos
// considerando la carta natal y solar return del usuario
// OPTIMIZADO: Usa gpt-4o-mini para reducir costos 96%
// =============================================================================

import OpenAI from 'openai';
import { getModelParams, logModelUsage } from '@/config/aiModels';

// =============================================================================
// TYPES
// =============================================================================

export interface PersonalizedEventInterpretation {
  eventId: string;
  title: string;
  personalMeaning: string;
  affectedAreas: string[];
  actionSteps: string[];
  mantra: string;
  warnings?: string[];
  opportunities?: string[];
  ritual?: string;
}

interface EventContext {
  eventType: 'lunar_phase' | 'eclipse' | 'retrograde' | 'planetary_transit' | 'seasonal';
  eventDate: string;
  eventTitle: string;
  eventDescription: string;
  sign: string;
  planet?: string;
}

interface UserAstrologicalProfile {
  name: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  sunHouse: number;
  moonHouse: number;
  solarReturnTheme?: string;
  currentAge: number;
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
// INTERPRETATION LEVELS
// =============================================================================

export enum InterpretationLevel {
  FULL_AI = 'full_ai',        // Interpretación completa con OpenAI (~$0.10-0.15 por evento)
  TEMPLATE_AI = 'template_ai', // Template + contexto AI (~$0.03-0.05 por evento)
  ENHANCED_AUTO = 'enhanced_auto' // Descripción mejorada automática (~$0 gratis)
}

// Determinar nivel de interpretación según tipo de evento
export function getInterpretationLevel(eventType: string): InterpretationLevel {
  switch (eventType) {
    case 'lunar_phase':
    case 'eclipse':
      return InterpretationLevel.FULL_AI;

    case 'retrograde':
      return InterpretationLevel.TEMPLATE_AI;

    case 'planetary_transit':
    case 'seasonal':
      return InterpretationLevel.ENHANCED_AUTO;

    default:
      return InterpretationLevel.ENHANCED_AUTO;
  }
}

// =============================================================================
// FULL AI INTERPRETATION
// =============================================================================

async function generateFullAIInterpretation(
  event: EventContext,
  userProfile: UserAstrologicalProfile
): Promise<PersonalizedEventInterpretation> {
  const client = getOpenAIClient();

  const prompt = `Eres un astrólogo experto con estilo "Poético Antifrágil & Rebelde Constructivo".

USUARIO:
- Nombre: ${userProfile.name}
- Sol en ${userProfile.sunSign} Casa ${userProfile.sunHouse}
- Luna en ${userProfile.moonSign} Casa ${userProfile.moonHouse}
- Ascendente en ${userProfile.risingSign}
- Edad: ${userProfile.currentAge} años
${userProfile.solarReturnTheme ? `- Tema del año: ${userProfile.solarReturnTheme}` : ''}

EVENTO:
- Tipo: ${event.eventType}
- Fecha: ${event.eventDate}
- ${event.eventTitle}
- Signo: ${event.sign}
${event.planet ? `- Planeta: ${event.planet}` : ''}

Genera una interpretación PERSONALIZADA para ${userProfile.name} que incluya:

1. SIGNIFICADO PERSONAL (2-3 frases): Cómo este evento específico afecta a ESTA persona considerando su configuración natal
2. ÁREAS AFECTADAS (3-4 áreas): Qué aspectos de su vida se ven influenciados
3. ACCIONES CONCRETAS (3-4 pasos): Qué puede hacer ${userProfile.name} específicamente durante este evento
4. MANTRA PERSONALIZADO: Una frase poderosa adaptada a su energía
5. ADVERTENCIAS (2-3): Qué evitar o tener cuidado
6. OPORTUNIDADES (2-3): Qué aprovechar al máximo

Estilo: Directo, poético, empoderador, sin florituras innecesarias. Tutea al usuario.

Responde SOLO con JSON en este formato:
{
  "personalMeaning": "...",
  "affectedAreas": ["...", "...", "..."],
  "actionSteps": ["...", "...", "..."],
  "mantra": "...",
  "warnings": ["...", "..."],
  "opportunities": ["...", "..."]
}`;

  const modelParams = getModelParams('event_interpretation');

  try {
    const response = await client.chat.completions.create({
      model: modelParams.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      response_format: { type: 'json_object' }
    });

    // Log usage for cost tracking
    if (response.usage) {
      logModelUsage('event_interpretation', response.usage.prompt_tokens, response.usage.completion_tokens);
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    return {
      eventId: `${event.eventType}_${event.eventDate}`,
      title: event.eventTitle,
      personalMeaning: parsed.personalMeaning,
      affectedAreas: parsed.affectedAreas || [],
      actionSteps: parsed.actionSteps || [],
      mantra: parsed.mantra || '',
      warnings: parsed.warnings || [],
      opportunities: parsed.opportunities || []
    };

  } catch (error) {
    console.error('Error generating AI interpretation:', error);
    // Fallback to template if AI fails
    return generateTemplateInterpretation(event, userProfile);
  }
}

// =============================================================================
// TEMPLATE + AI INTERPRETATION
// =============================================================================

function generateTemplateInterpretation(
  event: EventContext,
  userProfile: UserAstrologicalProfile
): PersonalizedEventInterpretation {
  // Template base según tipo de evento
  let personalMeaning = '';
  let affectedAreas: string[] = [];
  let actionSteps: string[] = [];
  let mantra = '';
  let warnings: string[] = [];
  let opportunities: string[] = [];

  if (event.eventType === 'retrograde') {
    personalMeaning = `${userProfile.name}, ${event.planet} retrógrado en ${event.sign} te invita a revisar y reconsiderar aspectos relacionados con ${getPlanetTheme(event.planet || '')}. Con tu Sol en ${userProfile.sunSign}, este es un momento de reflexión profunda.`;

    affectedAreas = [
      getPlanetTheme(event.planet || ''),
      'Comunicación y claridad',
      'Revisión de decisiones pasadas',
      'Introspección personal'
    ];

    actionSteps = [
      `Revisa tus ${getPlanetAction(event.planet || '')} sin apresurarte`,
      'Haz copias de seguridad y verifica detalles importantes',
      'Aprovecha para reflexionar y aprender de experiencias pasadas',
      'Evita iniciar proyectos nuevos, mejor perfecciona los existentes'
    ];

    mantra = `CONFÍO EN EL PROCESO DE REVISIÓN Y AJUSTE`;

    warnings = [
      'No tomes decisiones importantes sin reflexionar al menos 48 horas',
      'Cuidado con malentendidos en comunicaciones',
      'Evita compras importantes o firmas de contratos si es posible'
    ];

    opportunities = [
      'Momento ideal para resolver asuntos pendientes',
      'Reconectar con personas o proyectos del pasado',
      'Profundizar en autoconocimiento'
    ];
  } else {
    // Template genérico mejorado
    personalMeaning = `Este ${event.eventTitle} marca un momento significativo en tu año solar. Con tu configuración única (Sol ${userProfile.sunSign}, Luna ${userProfile.moonSign}), tienes la oportunidad de aprovechar esta energía cósmica.`;

    affectedAreas = [
      getSignTheme(event.sign),
      'Crecimiento personal',
      'Relaciones',
      'Propósito de vida'
    ];

    actionSteps = [
      'Dedica tiempo a reflexionar sobre tus intenciones',
      'Escribe tus pensamientos y sentimientos del día',
      'Conecta con la naturaleza si es posible',
      'Practica mindfulness o meditación'
    ];

    mantra = `ESTOY ALINEADO CON LA ENERGÍA DEL UNIVERSO`;

    warnings = ['Ten paciencia con los procesos', 'Evita decisiones impulsivas'];
    opportunities = ['Momento de claridad y revelaciones', 'Conexión profunda contigo mismo'];
  }

  return {
    eventId: `${event.eventType}_${event.eventDate}`,
    title: event.eventTitle,
    personalMeaning,
    affectedAreas,
    actionSteps,
    mantra,
    warnings,
    opportunities
  };
}

// =============================================================================
// ENHANCED AUTOMATIC INTERPRETATION
// =============================================================================

function generateEnhancedAutoInterpretation(
  event: EventContext,
  userProfile: UserAstrologicalProfile
): PersonalizedEventInterpretation {
  const signTheme = getSignTheme(event.sign);

  return {
    eventId: `${event.eventType}_${event.eventDate}`,
    title: event.eventTitle,
    personalMeaning: `${event.eventTitle} en ${event.sign} trae energía de ${signTheme}. Para ti, ${userProfile.name}, con Sol en ${userProfile.sunSign}, este es un buen momento para sintonizar con estas vibraciones.`,
    affectedAreas: [signTheme, 'Energía personal', 'Ritmo cotidiano'],
    actionSteps: [
      'Observa cómo te sientes durante este tránsito',
      'Ajusta tus actividades según la energía del momento',
      'Mantén un diario de experiencias'
    ],
    mantra: 'FLUYO CON LOS CICLOS NATURALES',
    warnings: [],
    opportunities: []
  };
}

// =============================================================================
// MAIN FUNCTION - GENERATE PERSONALIZED INTERPRETATION
// =============================================================================

export async function generatePersonalizedEventInterpretation(
  event: EventContext,
  userProfile: UserAstrologicalProfile,
  forceLevel?: InterpretationLevel
): Promise<PersonalizedEventInterpretation> {

  const level = forceLevel || getInterpretationLevel(event.eventType);

  console.log(`🎯 Generating ${level} interpretation for ${event.eventType}: ${event.eventTitle}`);

  switch (level) {
    case InterpretationLevel.FULL_AI:
      return await generateFullAIInterpretation(event, userProfile);

    case InterpretationLevel.TEMPLATE_AI:
      return generateTemplateInterpretation(event, userProfile);

    case InterpretationLevel.ENHANCED_AUTO:
      return generateEnhancedAutoInterpretation(event, userProfile);

    default:
      return generateEnhancedAutoInterpretation(event, userProfile);
  }
}

// =============================================================================
// BATCH INTERPRETATION (Para generar múltiples eventos)
// =============================================================================

export async function generateBatchInterpretations(
  events: EventContext[],
  userProfile: UserAstrologicalProfile,
  options?: {
    maxAIInterpretations?: number; // Límite de interpretaciones AI (para preview gratuito)
    priorityTypes?: string[]; // Tipos de eventos a priorizar para AI
  }
): Promise<PersonalizedEventInterpretation[]> {

  const maxAI = options?.maxAIInterpretations || events.length;
  const priorityTypes = options?.priorityTypes || ['lunar_phase', 'eclipse'];

  // Separar eventos por prioridad
  const priorityEvents = events.filter(e => priorityTypes.includes(e.eventType));
  const otherEvents = events.filter(e => !priorityTypes.includes(e.eventType));

  // Tomar solo los N primeros eventos prioritarios para AI
  const aiEvents = priorityEvents.slice(0, maxAI);
  const autoEvents = [...priorityEvents.slice(maxAI), ...otherEvents];

  console.log(`📊 Batch interpretation: ${aiEvents.length} AI, ${autoEvents.length} auto`);

  // Generar interpretaciones en paralelo
  const aiPromises = aiEvents.map(event =>
    generatePersonalizedEventInterpretation(event, userProfile, InterpretationLevel.FULL_AI)
  );

  const autoPromises = autoEvents.map(event =>
    generatePersonalizedEventInterpretation(event, userProfile, InterpretationLevel.ENHANCED_AUTO)
  );

  const results = await Promise.all([...aiPromises, ...autoPromises]);

  return results;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getPlanetTheme(planet: string): string {
  const themes: Record<string, string> = {
    'Mercurio': 'comunicación, tecnología y aprendizaje',
    'Venus': 'amor, relaciones y valores',
    'Marte': 'acción, energía y deseos',
    'Júpiter': 'expansión, abundancia y sabiduría',
    'Saturno': 'responsabilidad, límites y estructuras',
    'Urano': 'innovación, libertad y cambios repentinos',
    'Neptuno': 'intuición, espiritualidad y sueños',
    'Plutón': 'transformación, poder y regeneración'
  };
  return themes[planet] || 'tu vida';
}

function getPlanetAction(planet: string): string {
  const actions: Record<string, string> = {
    'Mercurio': 'comunicaciones y contratos',
    'Venus': 'relaciones y finanzas',
    'Marte': 'proyectos activos',
    'Júpiter': 'planes de expansión',
    'Saturno': 'compromisos a largo plazo',
    'Urano': 'innovaciones',
    'Neptuno': 'prácticas espirituales',
    'Plutón': 'transformaciones profundas'
  };
  return actions[planet] || 'asuntos importantes';
}

function getSignTheme(sign: string): string {
  const themes: Record<string, string> = {
    'Aries': 'iniciativa y valentía',
    'Tauro': 'estabilidad y valores',
    'Géminis': 'comunicación y versatilidad',
    'Cáncer': 'emociones y hogar',
    'Leo': 'creatividad y expresión',
    'Virgo': 'organización y servicio',
    'Libra': 'equilibrio y relaciones',
    'Escorpio': 'transformación y profundidad',
    'Sagitario': 'expansión y sabiduría',
    'Capricornio': 'ambición y disciplina',
    'Acuario': 'innovación y comunidad',
    'Piscis': 'espiritualidad y compasión'
  };
  return themes[sign] || 'crecimiento personal';
}
