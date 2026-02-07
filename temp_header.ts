// =============================================================================
// 🌟 EVENT INTERPRETATION SERVICE V2 - ULTRA PERSONALIZADO
// src/services/eventInterpretationServiceV2.ts
// =============================================================================
// Sistema profesional de interpretación con:
// - Caché de interpretaciones (ahorro de API)
// - Contexto completo Natal + Solar Return
// - Plantilla definitiva reutilizable
// - Tono acompañante vs explicativo
// - OPTIMIZADO: Usa gpt-4o-mini para reducir costos 96%
// =============================================================================

import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
import EventInterpretation from '@/models/EventInterpretation';
import { getModelParams, logModelUsage } from '@/config/aiModels';

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
  eventId: string;   // ✅ NUEVO: ID único del evento desde AstrologicalEvent
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
