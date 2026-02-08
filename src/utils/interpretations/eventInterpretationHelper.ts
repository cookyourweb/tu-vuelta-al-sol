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
    // Tipos en español (generados por el sistema)
    'luna_nueva',
    'luna_llena',
    'eclipse_solar',
    'eclipse_lunar',
    'mercurio_retrogrado_inicio',
    'mercurio_retrogrado_directo',
    'venus_retrogrado_inicio',
    'marte_retrogrado_inicio',
    'saturno_retrogrado_inicio',
    'jupiter_retrogrado_inicio',
    'ingreso_sol',
    'ingreso_marte',
    'ingreso_venus',
    'ingreso_jupiter',
    'ingreso_saturno',
    'equinoccio',
    'solsticio',
    'cumpleanos',
    'ultimo_dia_ciclo',
    // Tipos en inglés (del API/SolarCycle)
    'new_moon',
    'full_moon',
    'eclipse',
    'retrograde',
    'planetary_transit',
    'ingress',
    'station',
    'lunar_phase'
  ];

  // Eventos importantes por tipo
  if (importantTypes.includes(event.type)) {
    return true;
  }

  // Eventos que contienen palabras clave de tránsitos
  const typeLower = event.type?.toLowerCase() || '';
  if (typeLower.includes('retrogrado') || typeLower.includes('retrograde') ||
      typeLower.includes('ingreso') || typeLower.includes('ingress') ||
      typeLower.includes('eclipse') || typeLower.includes('luna') ||
      typeLower.includes('moon') || typeLower.includes('station')) {
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
    eventId: event.id, // ✅ NUEVO: Usar el ID único del evento
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
 * ✅ FIX: Incluye Solar Return chart para contexto del año
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

  // El natalChart tiene un array de planetas, no un objeto indexado
  const planetsArray = natalData.planets || natalData.planetas || [];

  // Helper: Buscar planeta por nombre en el array
  const findPlanet = (names: string[]): any => {
    return planetsArray.find((p: any) => names.includes(p.name));
  };

  // Buscar cada planeta
  const sol = findPlanet(['Sol', 'Sun']);
  const luna = findPlanet(['Luna', 'Moon']);
  const mercurio = findPlanet(['Mercurio', 'Mercury']);
  const venus = findPlanet(['Venus']);
  const marte = findPlanet(['Marte', 'Mars']);
  const saturno = findPlanet(['Saturno', 'Saturn']);

  // Obtener ascendente
  const ascendente = natalData.ascendant || natalData.ascendente;

  const birthDate = new Date(birthData.birthDate);
  const currentAge = currentYear - birthDate.getFullYear();

  const profile: any = {
    userId,
    name: birthData.fullName || 'Usuario',
    currentAge,
    natal: {
      sun: {
        sign: sol?.sign || 'Desconocido',
        house: sol?.house || sol?.housePosition || sol?.houseNumber || 1
      },
      moon: {
        sign: luna?.sign || 'Desconocido',
        house: luna?.house || luna?.housePosition || luna?.houseNumber || 1
      },
      rising: {
        sign: ascendente?.sign || 'Desconocido'
      },
      mercury: mercurio ? {
        sign: mercurio.sign || 'Desconocido',
        house: mercurio.house || mercurio.housePosition || mercurio.houseNumber || 1
      } : undefined,
      venus: venus ? {
        sign: venus.sign || 'Desconocido',
        house: venus.house || venus.housePosition || venus.houseNumber || 1
      } : undefined,
      mars: marte ? {
        sign: marte.sign || 'Desconocido',
        house: marte.house || marte.housePosition || marte.houseNumber || 1
      } : undefined,
      saturn: saturno ? {
        sign: saturno.sign || 'Desconocido',
        house: saturno.house || saturno.housePosition || saturno.houseNumber || 1
      } : undefined
    }
  };

  // 4. ✅ NUEVO: Intentar obtener Solar Return chart
  try {
    const Chart = (await import('@/models/Chart')).default;
    const chartDoc = await Chart.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ]
    });

    if (chartDoc?.solarReturnChart) {
      const srData = chartDoc.solarReturnChart;
      const srPlanets = srData.planets || [];

      // Buscar planetas en SR
      const srSol = srPlanets.find((p: any) => ['Sol', 'Sun'].includes(p.name));
      const srLuna = srPlanets.find((p: any) => ['Luna', 'Moon'].includes(p.name));
      const srSaturno = srPlanets.find((p: any) => ['Saturno', 'Saturn'].includes(p.name));

      if (srSol) {
        profile.solarReturn = {
          year: currentYear,
          sun: {
            sign: srSol.sign || 'Desconocido',
            house: srSol.house || 1
          },
          moon: srLuna ? {
            sign: srLuna.sign || 'Desconocido',
            house: srLuna.house || 1
          } : undefined,
          saturn: srSaturno ? {
            sign: srSaturno.sign || 'Desconocido',
            house: srSaturno.house || 1
          } : undefined
        };

        console.log('✅ [BUILD_PROFILE] Solar Return cargado:', {
          sun: profile.solarReturn.sun,
          moon: profile.solarReturn.moon,
          saturn: profile.solarReturn.saturn
        });
      }
    } else {
      console.log('ℹ️ [BUILD_PROFILE] No se encontró Solar Return chart - se omitirá contexto SR');
    }
  } catch (srError) {
    console.warn('⚠️ [BUILD_PROFILE] Error cargando Solar Return (no crítico):', srError);
    // No crítico - el perfil funciona sin SR
  }

  console.log('✅ [BUILD_PROFILE] Perfil de usuario construido:', {
    userId,
    name: profile.name,
    age: profile.currentAge,
    sun: profile.natal.sun,
    moon: profile.natal.moon,
    rising: profile.natal.rising,
    planetsFound: planetsArray.length,
    hasSolarReturn: !!profile.solarReturn
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
