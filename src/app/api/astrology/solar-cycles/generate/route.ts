// =============================================================================
// 🌞 API: Generate Solar Cycle - Generar nuevo ciclo solar
// src/app/api/astrology/solar-cycles/generate/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle, { SolarCycleHelpers } from '@/models/SolarCycle';
import BirthData from '@/models/BirthData';
import NatalChart from '@/models/NatalChart';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';
import { calculateHouseForEvent } from '@/utils/eventMapping';

/**
 * POST /api/astrology/solar-cycles/generate
 *
 * Body: { userId, forceYear?: number }
 *
 * Genera un nuevo ciclo solar con validaciones:
 * - Solo permite generar +1 año desde el último ciclo
 * - Verifica que el ciclo no existe ya
 * - Calcula eventos astrológicos
 * - Guarda en BD
 * - Marca ciclos antiguos como completados
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, forceYear, forceRegenerate } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    await connectDB();

    console.log('🌞 [GENERATE-CYCLE] Iniciando generación para usuario:', userId);
    if (forceRegenerate) console.log('🔄 [GENERATE-CYCLE] Modo FORCE REGENERATE activado');

    // 1. Obtener datos de nacimiento
    const birthData = await BirthData.findByUserId(userId);

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos de nacimiento'
      }, { status: 404 });
    }

    const birthDate = new Date(birthData.birthDate);
    const now = new Date();
    const currentYear = now.getFullYear();

    // 2. Obtener ciclo más reciente
    const latestCycle = await SolarCycle.getLatestCycle(userId);

    // 3. Determinar qué año generar
    let targetStartYear: number;

    if (forceYear) {
      targetStartYear = forceYear;
    } else {
      // Si no hay ciclos, generar el ciclo actual
      // Si hay ciclos, generar el siguiente
      if (!latestCycle) {
        // No hay ciclos, determinar el ciclo actual
        const currentYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        if (now >= currentYearBirthday) {
          targetStartYear = currentYear;
        } else {
          targetStartYear = currentYear - 1;
        }
      } else {
        // Hay ciclos, generar el siguiente
        const latestEndYear = latestCycle.cycleEnd.getFullYear();
        targetStartYear = latestEndYear;
      }
    }

    const targetEndYear = targetStartYear + 1;
    const yearLabel = `${targetStartYear}-${targetEndYear}`;

    console.log('📅 [GENERATE-CYCLE] Generando ciclo:', yearLabel);

    // 4. Validar que el ciclo no existe ya (a menos que sea forceRegenerate)
    const existingCycle = await SolarCycle.findByYear(userId, yearLabel);

    if (existingCycle) {
      if (forceRegenerate) {
        // 🔄 Eliminar ciclo existente para regenerarlo
        console.log(`🗑️ [GENERATE-CYCLE] Eliminando ciclo existente ${yearLabel} para regenerar...`);
        await SolarCycle.deleteOne({ _id: existingCycle._id });
        console.log(`✅ [GENERATE-CYCLE] Ciclo ${yearLabel} eliminado`);
      } else {
        return NextResponse.json({
          success: false,
          error: `El ciclo ${yearLabel} ya existe`,
          cycle: SolarCycleHelpers.formatForDisplay(existingCycle)
        }, { status: 409 });
      }
    }

    // 5. Validar que no se salte más de 1 año (skip si estamos regenerando)
    const isRegenerating = forceRegenerate && existingCycle;
    if (latestCycle && !isRegenerating) {
      const latestEndYear = latestCycle.cycleEnd.getFullYear();

      // Solo permitir generar el año inmediatamente siguiente
      if (targetStartYear !== latestEndYear) {
        return NextResponse.json({
          success: false,
          error: `No puedes saltar años. Debes generar ${latestEndYear}-${latestEndYear + 1} primero`
        }, { status: 400 });
      }

      // No permitir generar más de 1 año en el futuro
      if (targetStartYear > currentYear + 1) {
        return NextResponse.json({
          success: false,
          error: `No puedes generar ciclos más allá de ${currentYear + 1}`
        }, { status: 400 });
      }
    }

    // 6. Calcular fechas del ciclo
    const cycleStart = new Date(targetStartYear, birthDate.getMonth(), birthDate.getDate());
    const cycleEnd = new Date(targetEndYear, birthDate.getMonth(), birthDate.getDate());

    console.log('📅 [GENERATE-CYCLE] Rango:', {
      start: cycleStart.toISOString().split('T')[0],
      end: cycleEnd.toISOString().split('T')[0]
    });

    // 7. Calcular eventos directamente (sin HTTP fetch)
    console.log('🔄 [GENERATE-CYCLE] Calculando eventos astrológicos...');

    // Crear fecha con hora de nacimiento si está disponible
    const eventBirthDate = new Date(birthData.birthDate);
    if (birthData.birthTime) {
      const [hours, minutes] = birthData.birthTime.split(':').map(Number);
      eventBirthDate.setHours(hours, minutes, 0, 0);
    }
    eventBirthDate.setFullYear(targetStartYear);

    const events = await calculateSolarYearEvents(eventBirthDate);
    console.log('✅ [GENERATE-CYCLE] Eventos calculados:', {
      lunarPhases: events.lunarPhases.length,
      retrogrades: events.retrogrades.length,
      eclipses: events.eclipses.length,
      planetaryIngresses: events.planetaryIngresses.length,
      seasonalEvents: events.seasonalEvents.length
    });

    // Cargar carta natal para cálculo de casas
    let natalChart = null;
    try {
      const natalDoc = await NatalChart.findOne({ userId }).lean();
      if (natalDoc) {
        natalChart = (natalDoc as any).natalChart || natalDoc;
        console.log('✅ [GENERATE-CYCLE] Carta natal cargada para casas');
      }
    } catch (err) {
      console.warn('⚠️ [GENERATE-CYCLE] No se pudo cargar carta natal:', err);
    }

    // 8. Transformar eventos al formato de AstrologicalEvent
    const transformedEvents: any[] = [];

    // Lunar Phases
    events.lunarPhases?.forEach((phase: any) => {
      const eventDate = phase.date instanceof Date ? phase.date : new Date(phase.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        const phaseName = phase.type === 'new_moon' ? 'Luna Nueva' : 'Luna Llena';
        transformedEvents.push({
          id: `lunar-${eventDate.toISOString()}`,
          date: eventDate,
          title: `${phaseName} en ${phase.sign}`,
          type: phase.type,
          sign: phase.sign, // Añadir signo directamente para el calendario
          description: `${phaseName} en ${phase.sign}`,
          importance: 'medium',
          metadata: {
            zodiacSign: phase.sign,
            house: natalChart ? calculateHouseForEvent(phase.sign, phase.degree || 0, natalChart) : undefined,
            degree: phase.degree
          }
        });
      }
    });

    // Retrogrades
    events.retrogrades?.forEach((retro: any) => {
      const startDate = retro.startDate instanceof Date ? retro.startDate : new Date(retro.startDate);
      if (startDate >= cycleStart && startDate < cycleEnd) {
        transformedEvents.push({
          id: `retro-${retro.planet}-${startDate.toISOString()}`,
          date: startDate,
          title: `${retro.planet} Retrógrado`,
          type: 'retrograde',
          sign: retro.startSign, // Añadir signo directamente
          planet: retro.planet,
          description: `${retro.planet} inicia retrogradación en ${retro.startSign}`,
          importance: 'high',
          metadata: {
            planet: retro.planet,
            sign: retro.startSign,
            house: natalChart ? calculateHouseForEvent(retro.startSign, retro.startDegree || 0, natalChart) : undefined,
            endDate: retro.endDate instanceof Date ? retro.endDate.toISOString() : retro.endDate
          }
        });
      }
    });

    // Eclipses
    events.eclipses?.forEach((eclipse: any) => {
      const eventDate = eclipse.date instanceof Date ? eclipse.date : new Date(eclipse.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `eclipse-${eventDate.toISOString()}`,
          date: eventDate,
          title: `${eclipse.type} en ${eclipse.sign}`,
          type: 'eclipse',
          sign: eclipse.sign, // Añadir signo directamente
          description: `${eclipse.type} en ${eclipse.sign}`,
          importance: 'high',
          metadata: {
            eclipseType: eclipse.type,
            zodiacSign: eclipse.sign,
            house: natalChart ? calculateHouseForEvent(eclipse.sign, eclipse.degree || 0, natalChart) : undefined,
            degree: eclipse.degree
          }
        });
      }
    });

    // Planetary Ingresses
    events.planetaryIngresses?.forEach((ingress: any) => {
      const eventDate = ingress.date instanceof Date ? ingress.date : new Date(ingress.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `ingress-${ingress.planet}-${eventDate.toISOString()}`,
          date: eventDate,
          title: `${ingress.planet} → ${ingress.toSign}`,
          type: 'planetary_transit',
          sign: ingress.toSign, // Signo destino
          planet: ingress.planet,
          description: `${ingress.planet} entra en ${ingress.toSign}`,
          importance: 'medium',
          metadata: {
            planet: ingress.planet,
            fromSign: ingress.fromSign,
            toSign: ingress.toSign,
            house: natalChart ? calculateHouseForEvent(ingress.toSign, ingress.toDegree || 0, natalChart) : undefined
          }
        });
      }
    });

    // Seasonal Events
    events.seasonalEvents?.forEach((seasonal: any) => {
      const eventDate = seasonal.date instanceof Date ? seasonal.date : new Date(seasonal.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `seasonal-${eventDate.toISOString()}`,
          date: eventDate,
          title: seasonal.name,
          type: 'seasonal',
          description: seasonal.description,
          importance: 'low',
          metadata: {
            season: seasonal.name
          }
        });
      }
    });

    console.log(`✅ [GENERATE-CYCLE] ${transformedEvents.length} eventos transformados`);

    // 🔍 Filtrar eventos inválidos (sin título o fecha)
    const validEvents = transformedEvents.filter((event: any) => {
      const isValid = event.title && event.date && event.type;
      if (!isValid) {
        console.warn('⚠️ [GENERATE-CYCLE] Evento inválido filtrado:', event);
      }
      return isValid;
    });

    console.log(`✅ [GENERATE-CYCLE] ${validEvents.length} eventos válidos (${transformedEvents.length - validEvents.length} filtrados)`);

    // 9. Crear el nuevo ciclo en BD
    const newCycle = new SolarCycle({
      userId,
      cycleStart,
      cycleEnd,
      yearLabel,
      events: validEvents,
      solarReturnData: { events }, // Guardar los eventos calculados directamente
      generatedAt: new Date(),
      status: 'active'
    });

    await newCycle.save();

    console.log('✅ [GENERATE-CYCLE] Ciclo guardado en BD');

    // 10. Marcar ciclos antiguos como completados
    await SolarCycle.markOldCyclesAsCompleted(userId);

    // 11. Devolver el ciclo creado
    return NextResponse.json({
      success: true,
      message: `Ciclo ${yearLabel} generado exitosamente`,
      data: {
        cycle: SolarCycleHelpers.formatForDisplay(newCycle),
        eventCount: validEvents.length
      }
    });

  } catch (error) {
    console.error('❌ [GENERATE-CYCLE] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al generar ciclo solar',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
