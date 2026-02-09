// =============================================================================
// 🌞 API: Solar Cycles - Listar ciclos solares del usuario
// src/app/api/astrology/solar-cycles/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle, { SolarCycleHelpers } from '@/models/SolarCycle';
import BirthData from '@/models/BirthData';

/**
 * GET /api/astrology/solar-cycles?userId=xxx&yearLabel=YYYY-YYYY
 *
 * Si se proporciona yearLabel, devuelve un ciclo específico con sus eventos
 * Si no, devuelve la lista de ciclos activos del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const yearLabel = searchParams.get('yearLabel');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    await connectDB();

    // 🆕 Si se pide un ciclo específico, devolverlo con sus eventos
    if (yearLabel) {
      const cycle = await SolarCycle.findByYear(userId, yearLabel);

      if (!cycle) {
        return NextResponse.json({
          success: false,
          error: `Ciclo ${yearLabel} no encontrado`
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          cycle: {
            ...SolarCycleHelpers.formatForDisplay(cycle),
            events: cycle.events // ✅ Incluir eventos completos
          }
        }
      });
    }

    // Resto del código original para listar ciclos...

    // 1. Obtener datos de nacimiento del usuario
    const birthData = await BirthData.findByUserId(userId);

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos de nacimiento'
      }, { status: 404 });
    }

    // 2. Obtener ciclos activos (ordenados por fecha de inicio descendente)
    const cycles = await SolarCycle.getActiveCycles(userId);

    // 3. Determinar estado actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthDate = new Date(birthData.birthDate);
    const currentYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    // Determinar el año del ciclo actual
    let currentCycleYear: number;
    if (now >= currentYearBirthday) {
      // Ya pasó el cumpleaños este año
      currentCycleYear = currentYear;
    } else {
      // Aún no ha pasado el cumpleaños este año
      currentCycleYear = currentYear - 1;
    }

    const currentCycleLabel = `${currentCycleYear}-${currentCycleYear + 1}`;
    const nextCycleLabel = `${currentCycleYear + 1}-${currentCycleYear + 2}`;

    // 4. Verificar qué ciclos existen
    const currentCycleExists = cycles.some(c => c.yearLabel === currentCycleLabel);
    const nextCycleExists = cycles.some(c => c.yearLabel === nextCycleLabel);

    // 5. Determinar si se puede generar el siguiente ciclo
    const canGenerateNext = !nextCycleExists && currentCycleYear <= currentYear;

    // 6. Determinar visibilidad de ciclos según reglas:
    //    - Si el nuevo ciclo existe Y el cumpleaños ya pasó → solo mostrar el nuevo
    //    - Desde 3 meses antes del próximo cumpleaños → permitir ver 2 ciclos consecutivos
    //    - El ciclo anterior desaparece una vez que existe el nuevo y pasó el cumpleaños
    const previousCycleLabel = `${currentCycleYear - 1}-${currentCycleYear}`;
    const previousCycleExists = cycles.some(c => c.yearLabel === previousCycleLabel);

    // Calcular si estamos dentro de los 3 meses antes del próximo cumpleaños
    const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday <= now) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const threeMonthsBefore = new Date(nextBirthday);
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);
    const isNearNextBirthday = now >= threeMonthsBefore;

    // Filtrar ciclos relevantes
    const relevantCycles = cycles
      .filter(c => {
        const year = parseInt(c.yearLabel.split('-')[0]);

        // Siempre mostrar el ciclo actual
        if (c.yearLabel === currentCycleLabel) return true;

        // Si estamos cerca del próximo cumpleaños (3 meses), mostrar el siguiente también
        if (isNearNextBirthday && c.yearLabel === nextCycleLabel) return true;

        // Solo mostrar el ciclo anterior si NO existe el ciclo actual
        // (usuario aún no ha generado el nuevo ciclo)
        if (c.yearLabel === previousCycleLabel) {
          if (!currentCycleExists) return true;
          // Si existe el actual pero estamos en el primer mes del ciclo, permitir ver el anterior temporalmente
          return false;
        }

        // No mostrar ciclos más antiguos que el anterior
        if (year < currentCycleYear - 1) return false;

        return false;
      })
      .slice(0, 2)
      .map(cycle => SolarCycleHelpers.formatForDisplay(cycle));

    // 7. Determinar el ciclo predeterminado a mostrar
    let defaultCycle = currentCycleLabel;
    if (relevantCycles.length > 0) {
      // Si el ciclo actual existe, mostrarlo; si no, mostrar el más reciente
      const currentExists = relevantCycles.find(c => c.yearLabel === currentCycleLabel);
      if (currentExists) {
        defaultCycle = currentCycleLabel;
      } else {
        defaultCycle = relevantCycles[0].yearLabel;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        cycles: relevantCycles,
        currentCycleLabel,
        nextCycleLabel,
        defaultCycle,
        canGenerateNext,
        hasCycles: relevantCycles.length > 0
      }
    });

  } catch (error) {
    console.error('❌ [API] Error fetching solar cycles:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener ciclos solares',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
