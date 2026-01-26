// =============================================================================
// 🌞 API: Generate Solar Cycle - Generar nuevo ciclo solar
// src/app/api/astrology/solar-cycles/generate/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle, { SolarCycleHelpers } from '@/models/SolarCycle';
import BirthData from '@/models/BirthData';

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
    const { userId, forceYear } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    await connectDB();

    console.log('🌞 [GENERATE-CYCLE] Iniciando generación para usuario:', userId);

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

    // 4. Validar que el ciclo no existe ya
    const existingCycle = await SolarCycle.findByYear(userId, yearLabel);

    if (existingCycle) {
      return NextResponse.json({
        success: false,
        error: `El ciclo ${yearLabel} ya existe`,
        cycle: SolarCycleHelpers.formatForDisplay(existingCycle)
      }, { status: 409 });
    }

    // 5. Validar que no se salte más de 1 año
    if (latestCycle) {
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

    // 7. Llamar a la API de solar-year-events para calcular los eventos
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/astrology/solar-year-events`;

    const eventsResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        birthPlace: birthData.birthPlace,
        currentYear: targetStartYear,
        userId: userId
      })
    });

    if (!eventsResponse.ok) {
      throw new Error('Error al calcular eventos del año solar');
    }

    const eventsData = await eventsResponse.json();

    if (!eventsData.success) {
      throw new Error(eventsData.error || 'Error al calcular eventos');
    }

    // 8. Transformar eventos al formato de AstrologicalEvent
    const transformedEvents = [];

    // Lunar Phases
    eventsData.data.events.lunarPhases?.forEach((phase: any) => {
      const eventDate = new Date(phase.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `lunar-${phase.date}`,
          date: eventDate,
          title: phase.phase,
          type: phase.type,
          description: `${phase.phase} en ${phase.zodiacSign}`,
          importance: 'medium',
          metadata: {
            zodiacSign: phase.zodiacSign,
            house: phase.house,
            degree: phase.degree
          }
        });
      }
    });

    // Retrogrades
    eventsData.data.events.retrogrades?.forEach((retro: any) => {
      const startDate = new Date(retro.startDate);
      if (startDate >= cycleStart && startDate < cycleEnd) {
        transformedEvents.push({
          id: `retro-${retro.planet}-${retro.startDate}`,
          date: startDate,
          title: `${retro.planet} Retrógrado`,
          type: 'retrograde',
          description: `${retro.planet} inicia retrogradación en ${retro.sign}`,
          importance: 'high',
          metadata: {
            planet: retro.planet,
            sign: retro.sign,
            house: retro.house,
            endDate: retro.endDate
          }
        });
      }
    });

    // Eclipses
    eventsData.data.events.eclipses?.forEach((eclipse: any) => {
      const eventDate = new Date(eclipse.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `eclipse-${eclipse.date}`,
          date: eventDate,
          title: eclipse.type,
          type: 'eclipse',
          description: `${eclipse.type} en ${eclipse.zodiacSign}`,
          importance: 'high',
          metadata: {
            eclipseType: eclipse.type,
            zodiacSign: eclipse.zodiacSign,
            house: eclipse.house,
            degree: eclipse.degree
          }
        });
      }
    });

    // Planetary Ingresses
    eventsData.data.events.planetaryIngresses?.forEach((ingress: any) => {
      const eventDate = new Date(ingress.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `ingress-${ingress.planet}-${ingress.date}`,
          date: eventDate,
          title: `${ingress.planet} → ${ingress.newSign}`,
          type: 'planetary_transit',
          description: `${ingress.planet} entra en ${ingress.newSign}`,
          importance: 'medium',
          metadata: {
            planet: ingress.planet,
            fromSign: ingress.previousSign,
            toSign: ingress.newSign,
            house: ingress.house
          }
        });
      }
    });

    // Seasonal Events
    eventsData.data.events.seasonalEvents?.forEach((seasonal: any) => {
      const eventDate = new Date(seasonal.date);
      if (eventDate >= cycleStart && eventDate < cycleEnd) {
        transformedEvents.push({
          id: `seasonal-${seasonal.date}`,
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
      solarReturnData: eventsData.data,
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
