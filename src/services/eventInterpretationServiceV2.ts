// =============================================================================
// 🌟 EVENT INTERPRETATION SERVICE V2 - ULTRA PERSONALIZADO
// src/services/eventInterpretationServiceV2.ts
// =============================================================================
// Sistema profesional de interpretación con:
// - Caché de interpretaciones (ahorro de API)
// - Contexto completo Natal + Solar Return
// - Plantilla definitiva reutilizable
// - Tono acompañante vs explicativo
// =============================================================================

import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
import EventInterpretation from '@/models/EventInterpretation';

// =============================================================================
// TYPES
// =============================================================================

export interface UltraPersonalizedEventInterpretation {
  eventId: string;
  title: string;
  date: string;

  // Estructura definitiva
  que_se_activa: string;          // Qué se activa para ti
  como_se_siente: string[];       // Cómo puede sentirse (lista de sensaciones)
  consejo: string[];              // Consejo personalizado (acciones concretas)
  ritual_breve: string;           // 5 minutos max
  advertencias: string[];         // Evita... (no NO)
  oportunidades: string[];        // Qué aprovechar
  mantra: string;                 // Frase corta integradora
  pregunta_clave?: string;        // Pregunta poderosa (opcional)

  // Metadata
  cached: boolean;
  generatedAt: Date;
}

interface EventContext {
  eventType: 'lunar_phase' | 'eclipse' | 'retrograde' | 'planetary_transit' | 'seasonal';
  eventDate: string;
  eventTitle: string;
  eventDescription: string;
  sign: string;
  planet?: string;
  house?: number;  // Casa donde cae el evento
}

interface EnhancedUserProfile {
  userId: string;
  name: string;
  currentAge: number;

  // CARTA NATAL
  natal: {
    sun: { sign: string; house: number };
    moon: { sign: string; house: number };
    rising: { sign: string };
    mercury?: { sign: string; house: number };
    venus?: { sign: string; house: number };
    mars?: { sign: string; house: number };
    saturn?: { sign: string; house: number };
  };

  // RETORNO SOLAR (contexto del año)
  solarReturn?: {
    year: number;
    sun: { sign: string; house: number };
    saturn?: { sign: string; house: number };
    moon?: { sign: string; house: number };

    // Comparaciones clave (traídas de la interpretación guardada)
    comparaciones?: {
      sol?: { natal: string; sr: string; como_se_vive: string };
      saturno?: { natal: string; sr: string; como_se_vive: string };
      luna?: { natal: string; sr: string; como_se_vive: string };
    };

    tema_central_del_anio?: string;
  };
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
// CACHE SYSTEM - No volver a generar lo mismo
// =============================================================================

async function getCachedInterpretation(
  userId: string,
  eventId: string
): Promise<UltraPersonalizedEventInterpretation | null> {
  try {
    await connectDB();

    const cached = await EventInterpretation.findOne({
      userId,
      eventId,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (cached && cached.interpretation) {
      console.log(`✅ [CACHE HIT] Event ${eventId} for user ${userId}`);

      // Check if it's the new format (V2)
      const interp = cached.interpretation as any;
      if (interp.title && interp.que_se_activa) {
        // New format - return as is
        return {
          ...interp,
          eventId,
          cached: true,
          generatedAt: cached.createdAt || cached.generatedAt || new Date()
        } as UltraPersonalizedEventInterpretation;
      }

      // Old format - transform to new format
      return {
        eventId,
        title: interp.titulo_evento || 'Evento Astrológico',
        date: cached.eventDate?.toISOString() || new Date().toISOString(),
        que_se_activa: interp.para_ti_especificamente || '',
        como_se_siente: [interp.tu_fortaleza_a_usar?.como_usarla || 'Energía renovada'],
        consejo: [
          interp.consejo_especifico || '',
          interp.ejercicio_para_ti || ''
        ].filter(Boolean),
        ritual_breve: interp.timing_evolutivo?.cuando_actuar || 'Conecta con tu intuición',
        advertencias: interp.tu_bloqueo_a_trabajar?.bloqueo ? [interp.tu_bloqueo_a_trabajar.bloqueo] : [],
        oportunidades: interp.tu_fortaleza_a_usar?.fortaleza ? [interp.tu_fortaleza_a_usar.fortaleza] : [],
        mantra: interp.mantra_personalizado || 'Estoy en mi camino',
        pregunta_clave: interp.tu_bloqueo_a_trabajar?.reframe,
        cached: true,
        generatedAt: cached.createdAt || cached.generatedAt || new Date()
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

async function saveCachedInterpretation(
  userId: string,
  eventId: string,
  interpretation: UltraPersonalizedEventInterpretation
): Promise<void> {
  try {
    await connectDB();

    // Guardar por 90 días
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await EventInterpretation.create({
      userId,
      eventId,
      interpretation,
      expiresAt,
      method: 'openai',
      cached: false
    });

    console.log(`💾 [CACHE SAVED] Event ${eventId} for user ${userId}`);
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

// =============================================================================
// BUSCAR INTERPRETACIÓN DEL RETORNO SOLAR EN MONGODB
// =============================================================================

async function getSolarReturnInterpretation(userId: string): Promise<any | null> {
  try {
    await connectDB();

    const srInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    }).sort({ generatedAt: -1 });

    if (srInterpretation && srInterpretation.interpretation) {
      console.log(`✅ [SR FOUND] Solar Return interpretation found for user ${userId}`);
      return srInterpretation.interpretation;
    }

    console.log(`⚠️ [SR NOT FOUND] No Solar Return interpretation for user ${userId}`);
    return null;
  } catch (error) {
    console.error('Error fetching Solar Return interpretation:', error);
    return null;
  }
}

// =============================================================================
// PROMPT DEFINITIVO - PLANTILLA REUTILIZABLE
// =============================================================================

function buildUltraPersonalizedPrompt(
  event: EventContext,
  userProfile: EnhancedUserProfile
): string {
  const { natal, solarReturn } = userProfile;

  // Construir contexto natal
  const natalContext = `
CARTA NATAL:
- Sol en ${natal.sun.sign} Casa ${natal.sun.house} → ${getSunMeaning(natal.sun.sign, natal.sun.house)}
- Luna en ${natal.moon.sign} Casa ${natal.moon.house} → ${getMoonMeaning(natal.moon.sign, natal.moon.house)}
- Ascendente en ${natal.rising.sign} → ${getRisingMeaning(natal.rising.sign)}
${natal.saturn ? `- Saturno en ${natal.saturn.sign} Casa ${natal.saturn.house} → ${getSaturnMeaning(natal.saturn.sign, natal.saturn.house)}` : ''}
${natal.venus ? `- Venus en ${natal.venus.sign} Casa ${natal.venus.house}` : ''}`;

  // Construir contexto SR si existe
  let srContext = '';
  if (solarReturn && solarReturn.sun) {
    srContext = `
RETORNO SOLAR (año ${solarReturn.year}):
- Sol SR en Casa ${solarReturn.sun.house} → ${getSolarReturnSunMeaning(solarReturn.sun.house)}
${solarReturn.saturn ? `- Saturno SR en ${solarReturn.saturn.sign} Casa ${solarReturn.saturn.house}` : ''}
${solarReturn.tema_central_del_anio ? `- Tema del año: ${solarReturn.tema_central_del_anio}` : ''}

COMPARACIONES CLAVE (Natal vs SR):
${solarReturn.comparaciones?.sol ? `- Sol: Natal ${solarReturn.comparaciones.sol.natal} → SR ${solarReturn.comparaciones.sol.sr}
  ${solarReturn.comparaciones.sol.como_se_vive}` : ''}
${solarReturn.comparaciones?.saturno ? `- Saturno: Natal ${solarReturn.comparaciones.saturno.natal} → SR ${solarReturn.comparaciones.saturno.sr}
  ${solarReturn.comparaciones.saturno.como_se_vive}` : ''}

CONTEXTO EMOCIONAL ACTUAL:
- Con Sol natal en Casa ${natal.sun.house}: ${getNatalPattern(natal.sun.house)}
- Con Sol SR en Casa ${solarReturn.sun.house}: ${getSRPattern(solarReturn.sun.house)}
- Conflicto interno probable: ${getInternalConflict(natal.sun.house, solarReturn.sun.house)}`;
  }

  const prompt = `Genera una interpretación de evento astrológico para agenda personalizada.

USUARIO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.currentAge} años

${natalContext}
${srContext}

EVENTO:
- Tipo: ${event.eventType === 'lunar_phase' ? 'Luna Nueva / Luna Llena' : event.eventType}
- Título: ${event.eventTitle}
- Signo: ${event.sign}
- Fecha: ${event.eventDate}
${event.house ? `- Casa donde cae: ${event.house}` : ''}
${event.planet ? `- Planeta: ${event.planet}` : ''}

INSTRUCCIONES DE TONO:
- Lenguaje claro, humano y cercano
- Menos "explicación", más "acompañamiento"
- No usar tecnicismos sin explicar
- No lenguaje excesivamente poético
- Enfocar en cómo se siente y cómo usarlo
- Integrar tensión natal vs energía del año ${solarReturn ? '(CLAVE)' : ''}
- Hablar directamente a la persona (tutear)
- Suavizar advertencias: "Evita..." en vez de "NO..."

ESTRUCTURA OBLIGATORIA (JSON):

{
  "que_se_activa": "Este evento activa tu Casa X natal, relacionada con [tema]. Normalmente [signo/evento] aquí tiende a [respuesta habitual natal]. ${solarReturn ? 'Sin embargo, con tu [planeta SR] en Casa X, este año la energía se vive de otra manera: [cómo cambia]. Tu naturaleza natal suele llevarte a [patrón], pero este tránsito te pide [nueva actitud].' : 'Este es un momento para [acción principal].'}",

  "como_se_siente": [
    "[Sensación emocional concreta]",
    "[Conflicto interno natal vs SR si aplica]",
    "[Necesidad física o emocional]",
    "[Intuición o percepción nueva]",
    "Si intentas forzar [acción contraria], puedes sentir [consecuencia emocional]"
  ],

  "consejo": [
    "Usa este día para [acción interna concreta], no para [acción externa]",
    "Pregúntate: [pregunta personalizada profunda]",
    "Recuerda: con ${solarReturn ? `[planeta SR clave], este año se construye desde [valor emocional]` : `tu [planeta natal], necesitas [guía clara]`}"
  ],

  "ritual_breve": "[Acción sencilla, íntima, no pública. 5 minutos max. Algo que se pueda hacer en cualquier lugar.]",

  "advertencias": [
    "Evita [acción concreta]",
    "No te compares con [patrón externo]",
    "Escucha tu cuerpo si aparece [señal física/emocional]"
  ],

  "oportunidades": [
    "[Oportunidad evolutiva]",
    "[Cierre de ciclo]",
    "[Preparación para siguiente año/fase]"
  ],

  "mantra": "[Frase corta, integradora, no grandilocuente. Max 10 palabras.]",

  "pregunta_clave": "[Pregunta poderosa que haga reflexionar. Ej: Si nadie te viera, ¿qué futuro elegirías realmente?]"
}

OBJETIVO: Que ${userProfile.name} sienta que este evento fue escrito específicamente para ella/él y que le sirva como guía práctica, no solo informativa.`;

  return prompt;
}

// =============================================================================
// GENERAR INTERPRETACIÓN ULTRA PERSONALIZADA
// =============================================================================

export async function generateUltraPersonalizedInterpretation(
  event: EventContext,
  userProfile: EnhancedUserProfile,
  options?: {
    skipCache?: boolean;
  }
): Promise<UltraPersonalizedEventInterpretation> {

  const eventId = `${event.eventType}_${event.eventDate}_${event.sign}`;

  // 1. Intentar caché primero (ahorro de $$$)
  if (!options?.skipCache) {
    const cached = await getCachedInterpretation(userProfile.userId, eventId);
    if (cached) {
      return cached;
    }
  }

  // 2. Si no hay SR interpretation, buscarla en MongoDB
  if (!userProfile.solarReturn?.comparaciones) {
    const srData = await getSolarReturnInterpretation(userProfile.userId);
    if (srData && srData.comparaciones_planetarias) {
      userProfile.solarReturn = {
        ...userProfile.solarReturn,
        comparaciones: {
          sol: srData.comparaciones_planetarias?.sol,
          saturno: srData.comparaciones_planetarias?.saturno,
          luna: srData.comparaciones_planetarias?.luna
        },
        tema_central_del_anio: srData.tema_central_del_anio
      } as any;
    }
  }

  // 3. Generar con OpenAI
  const client = getOpenAIClient();
  const prompt = buildUltraPersonalizedPrompt(event, userProfile);

  console.log(`🤖 [AI] Generating ultra-personalized interpretation for ${userProfile.name}`);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,  // Menos creativo, más consistente
      max_tokens: 1200,   // Más espacio para contenido completo
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    const interpretation: UltraPersonalizedEventInterpretation = {
      eventId,
      title: event.eventTitle,
      date: event.eventDate,
      que_se_activa: parsed.que_se_activa || '',
      como_se_siente: parsed.como_se_siente || [],
      consejo: parsed.consejo || [],
      ritual_breve: parsed.ritual_breve || '',
      advertencias: parsed.advertencias || [],
      oportunidades: parsed.oportunidades || [],
      mantra: parsed.mantra || '',
      pregunta_clave: parsed.pregunta_clave,
      cached: false,
      generatedAt: new Date()
    };

    // 4. Guardar en caché para futuro
    await saveCachedInterpretation(userProfile.userId, eventId, interpretation);

    return interpretation;

  } catch (error) {
    console.error('❌ Error generating interpretation:', error);
    // Fallback básico
    return generateFallbackInterpretation(event, userProfile);
  }
}

// =============================================================================
// FALLBACK SI FALLA OPENAI
// =============================================================================

function generateFallbackInterpretation(
  event: EventContext,
  userProfile: EnhancedUserProfile
): UltraPersonalizedEventInterpretation {
  return {
    eventId: `${event.eventType}_${event.eventDate}`,
    title: event.eventTitle,
    date: event.eventDate,
    que_se_activa: `Este ${event.eventTitle} en ${event.sign} activa energías importantes en tu vida. Es un momento para prestar atención.`,
    como_se_siente: [
      'Posible aumento de sensibilidad emocional',
      'Ganas de reflexionar sobre tu camino',
      'Necesidad de ajustar tu ritmo'
    ],
    consejo: [
      'Dedica tiempo a escucharte',
      'Evita decisiones apresuradas',
      'Confía en tu intuición'
    ],
    ritual_breve: 'Dedica 5 minutos a escribir cómo te sientes hoy.',
    advertencias: ['Evita compararte con otros', 'No fuerces procesos'],
    oportunidades: ['Momento de autoconocimiento', 'Claridad emocional'],
    mantra: 'Confío en mi proceso',
    cached: false,
    generatedAt: new Date()
  };
}

// =============================================================================
// UTILITY FUNCTIONS - Significados contextuales
// =============================================================================

function getSunMeaning(sign: string, house: number): string {
  const meanings: Record<number, string> = {
    1: 'Identidad visible, liderazgo natural',
    2: 'Valores personales, autovaloración',
    3: 'Comunicación, aprendizaje constante',
    4: 'Hogar, raíces emocionales',
    5: 'Creatividad, expresión personal',
    6: 'Servicio, rutinas saludables',
    7: 'Relaciones, colaboraciones',
    8: 'Transformación, recursos compartidos',
    9: 'Filosofía, expansión mental',
    10: 'Carrera, reconocimiento público',
    11: 'Comunidad, visión futura',
    12: 'Introspección, espiritualidad'
  };
  return meanings[house] || 'Tu propósito de vida';
}

function getMoonMeaning(sign: string, house: number): string {
  const meanings: Record<number, string> = {
    1: 'Emociones visibles, sensibilidad reactiva',
    2: 'Seguridad emocional en lo material',
    3: 'Necesidad de comunicar sentimientos',
    4: 'Conexión profunda con hogar y familia',
    5: 'Nutrición a través de creatividad',
    6: 'Cuidado en el día a día, rutinas emocionales',
    7: 'Emociones en relaciones',
    8: 'Intensidad emocional, transformación',
    9: 'Búsqueda emocional de sentido',
    10: 'Sensibilidad en lo público',
    11: 'Nutrición en comunidad',
    12: 'Emociones privadas, mundo interno'
  };
  return meanings[house] || 'Tu mundo emocional';
}

function getRisingMeaning(sign: string): string {
  return 'Cómo te presentas al mundo';
}

function getSaturnMeaning(sign: string, house: number): string {
  return 'Donde construyes estructura y madurez';
}

function getSolarReturnSunMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'Año de redefinir identidad',
    2: 'Año de construir recursos propios',
    3: 'Año de comunicación y aprendizaje',
    4: 'Año de enfocarse en hogar y emociones',
    5: 'Año de expresión creativa',
    6: 'Año de servicio y salud',
    7: 'Año de relaciones importantes',
    8: 'Año de transformación profunda',
    9: 'Año de expansión y viajes',
    10: 'Año de logros profesionales',
    11: 'Año de comunidad y redes',
    12: 'Año de introspección y retiro'
  };
  return meanings[house] || 'Año de desarrollo personal';
}

function getNatalPattern(house: number): string {
  if (house === 1) return 'Acostumbrada a liderar y ser visible';
  if (house === 12) return 'Acostumbrada a trabajar desde lo interno';
  if (house === 10) return 'Acostumbrada a enfocarte en logros externos';
  return 'Tu patrón habitual de acción';
}

function getSRPattern(house: number): string {
  if (house === 1) return 'Este año pide acción directa y visibilidad';
  if (house === 12) return 'Este año pide pausa, introspección y retiro';
  if (house === 10) return 'Este año pide enfoque en carrera y reconocimiento';
  return 'Este año pide un enfoque diferente';
}

function getInternalConflict(natalHouse: number, srHouse: number): string {
  if (natalHouse === 1 && srHouse === 12) {
    return 'Quieres avanzar rápido pero la energía pide pausa';
  }
  if (natalHouse === 12 && srHouse === 1) {
    return 'Estás acostumbrada al retiro pero este año pide visibilidad';
  }
  return 'Tu forma habitual vs lo que pide este año';
}
