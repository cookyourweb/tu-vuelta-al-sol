// =============================================================================
// 🔧 HELPER: Event Interpretation Generation
// src/utils/interpretations/eventInterpretationHelper.ts
// =============================================================================
// Funciones auxiliares para generar interpretaciones de eventos
// =============================================================================

import { generateUltraPersonalizedInterpretation } from '@/services/eventInterpretationServiceV2';
import type {
  UltraPersonalizedEventInterpretation,
} from '@/services/eventInterpretationServiceV2';
import type { AstrologicalEvent } from '@/models/SolarCycle';
import BirthData from '@/models/BirthData';
import NatalChart from '@/models/NatalChart';

/**
 * Determina si un evento es lo suficientemente importante para generar interpretación
 */
export function shouldGenerateInterpretation(event: AstrologicalEvent): boolean {
  const importantTypes = [
    'luna_nueva',
    'luna_llena',
    'eclipse_solar',
    'eclipse_lunar',
    'mercurio_retrogrado_inicio',
    'mercurio_retrogrado_directo',
    'venus_retrogrado_inicio',
    'marte_retrogrado_inicio',
    'saturno_retrogrado_inicio',
    'ingreso_sol',
    'ingreso_marte',
    'ingreso_venus',
    'equinoccio',
    'solsticio',
    'cumpleanos',
    'ultimo_dia_ciclo'
  ];

  // Eventos importantes por tipo
  if (importantTypes.includes(event.type)) {
    return true;
  }

  // Eventos marcados como importantes explícitamente
  if (event.importance === 'high' || event.importance === 'medium') {
    return true;
  }

  return false;
}

/**
 * Convierte AstrologicalEvent a EventContext para el servicio de interpretación
 */
export function eventToContext(event: AstrologicalEvent) {
  // Determinar el tipo de evento
  let eventType: 'lunar_phase' | 'eclipse' | 'retrograde' | 'planetary_transit' | 'seasonal' = 'planetary_transit';

  if (event.type.includes('luna')) {
    eventType = 'lunar_phase';
  } else if (event.type.includes('eclipse')) {
    eventType = 'eclipse';
  } else if (event.type.includes('retrogrado')) {
    eventType = 'retrograde';
  } else if (event.type.includes('equinoccio') || event.type.includes('solsticio')) {
    eventType = 'seasonal';
  }

  // Extraer signo del metadata si existe
  const sign = event.metadata?.sign || event.metadata?.signo || 'Desconocido';
  const planet = event.metadata?.planet || event.metadata?.planeta;
  const house = event.metadata?.house || event.metadata?.casa;

  return {
    eventType,
    eventDate: event.date.toISOString(),
    eventTitle: event.title,
    eventDescription: event.description || '',
    sign,
    planet,
    house
  };
}

/**
 * Construye el perfil de usuario necesario para generar interpretaciones
 * ✅ FIX: Ahora obtiene datos astrológicos del NatalChart model, no de BirthData
 */
export async function buildUserProfile(userId: string, currentYear: number) {
  // 1. Obtener datos básicos de nacimiento
  const birthData = await BirthData.findByUserId(userId);

  if (!birthData) {
    throw new Error('No se encontraron datos del usuario');
  }

  // 2. Obtener carta natal con cálculos astrológicos
  const natalChartDoc = await NatalChart.findOne({
    $or: [
      { userId: userId },
      { uid: userId }
    ],
    chartType: 'natal'
  });

  if (!natalChartDoc || !natalChartDoc.natalChart) {
    throw new Error('No se encontraron datos astrológicos del usuario. Por favor, genera tu carta natal primero.');
  }

  // 3. Extraer datos astrológicos del natalChart
  const natalData = natalChartDoc.natalChart;

  // El natalChart puede tener diferentes estructuras según cómo se generó
  // Intentamos acceder a las posiciones planetarias de forma flexible
  const planets = natalData.planets || natalData.planetas || natalData;

  const birthDate = new Date(birthData.birthDate);
  const currentAge = currentYear - birthDate.getFullYear();

  const profile = {
    userId,
    name: birthData.fullName || 'Usuario',
    currentAge,
    natal: {
      sun: {
        sign: planets.sun?.sign || planets.sol?.signo || 'Desconocido',
        house: planets.sun?.house || planets.sol?.casa || 1
      },
      moon: {
        sign: planets.moon?.sign || planets.luna?.signo || 'Desconocido',
        house: planets.moon?.house || planets.luna?.casa || 1
      },
      rising: {
        sign: planets.ascendant?.sign || planets.ascendente?.signo || natalData.ascendant?.sign || 'Desconocido'
      },
      mercury: planets.mercury || planets.mercurio ? {
        sign: planets.mercury?.sign || planets.mercurio?.signo || 'Desconocido',
        house: planets.mercury?.house || planets.mercurio?.casa || 1
      } : undefined,
      venus: planets.venus ? {
        sign: planets.venus?.sign || planets.venus?.signo || 'Desconocido',
        house: planets.venus?.house || planets.venus?.casa || 1
      } : undefined,
      mars: planets.mars || planets.marte ? {
        sign: planets.mars?.sign || planets.marte?.signo || 'Desconocido',
        house: planets.mars?.house || planets.marte?.casa || 1
      } : undefined,
      saturn: planets.saturn || planets.saturno ? {
        sign: planets.saturn?.sign || planets.saturno?.signo || 'Desconocido',
        house: planets.saturn?.house || planets.saturno?.casa || 1
      } : undefined
    }
  };

  console.log('✅ [BUILD_PROFILE] Perfil de usuario construido:', {
    userId,
    name: profile.name,
    age: profile.currentAge,
    sun: profile.natal.sun,
    moon: profile.natal.moon
  });

  return profile;
}

/**
 * Genera interpretación para un evento específico
 */
export async function generateEventInterpretation(
  event: AstrologicalEvent,
  userId: string,
  currentYear: number,
  options?: { skipCache?: boolean }
): Promise<UltraPersonalizedEventInterpretation | null> {
  try {
    // Verificar si el evento necesita interpretación
    if (!shouldGenerateInterpretation(event)) {
      console.log(`⏭️ [SKIP] Event ${event.id} no necesita interpretación`);
      return null;
    }

    // Construir contexto del evento
    const eventContext = eventToContext(event);

    // Construir perfil de usuario
    const userProfile = await buildUserProfile(userId, currentYear);

    // Generar interpretación usando el servicio V2
    const interpretation = await generateUltraPersonalizedInterpretation(
      eventContext,
      userProfile,
      options
    );

    console.log(`✅ [GENERATED] Interpretación creada para ${event.title}`);
    return interpretation;

  } catch (error) {
    console.error(`❌ [ERROR] Error generando interpretación para ${event.id}:`, error);
    return null;
  }
}

/**
 * Calcula el costo estimado de generar interpretaciones
 */
export function estimateInterpretationCost(eventCount: number): {
  estimatedCost: number;
  estimatedTime: number; // segundos
} {
  // Costo por interpretación: ~$0.008 - $0.012
  const avgCostPerInterpretation = 0.01;

  // Tiempo por interpretación: ~2-3 segundos
  const avgTimePerInterpretation = 2.5;

  return {
    estimatedCost: eventCount * avgCostPerInterpretation,
    estimatedTime: eventCount * avgTimePerInterpretation
  };
}
