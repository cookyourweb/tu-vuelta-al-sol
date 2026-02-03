// =============================================================================
// 🌙 API: Generate Month Interpretations - Capa 2 del sistema de 3 capas
// src/app/api/astrology/interpretations/generate-month/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle from '@/models/SolarCycle';
import {
  generateEventInterpretation,
  shouldGenerateInterpretation,
  estimateInterpretationCost
} from '@/utils/interpretations/eventInterpretationHelper';

/**
 * POST /api/astrology/interpretations/generate-month
 *
 * Genera interpretaciones para eventos importantes del mes especificado.
 * Parte del sistema de 3 capas - CAPA 2: Generación Incremental
 *
 * Body:
 * - userId: string (requerido)
 * - yearLabel: string (ej: "2025-2026")
 * - month: number (1-12)
 * - year: number
 *
 * Returns:
 * - generated: número de interpretaciones generadas
 * - skipped: número de eventos que ya tenían interpretación
 * - events: eventos actualizados
 * - cost: costo estimado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, yearLabel, month, year } = body;

    // Validaciones
    if (!userId || !yearLabel || !month || !year) {
      return NextResponse.json({
        success: false,
        error: 'Faltan parámetros requeridos: userId, yearLabel, month, year'
      }, { status: 400 });
    }

    if (month < 1 || month > 12) {
      return NextResponse.json({
        success: false,
        error: 'month debe estar entre 1 y 12'
      }, { status: 400 });
    }

    await connectDB();

    // Obtener el ciclo solar
    const cycle = await SolarCycle.findByYear(userId, yearLabel);

    if (!cycle) {
      return NextResponse.json({
        success: false,
        error: `Ciclo ${yearLabel} no encontrado`
      }, { status: 404 });
    }

    console.log(`📅 [GENERATE-MONTH] Generando interpretaciones para ${yearLabel} - ${month}/${year}`);

    // Filtrar eventos del mes especificado
    const monthEvents = cycle.events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() + 1 === month && eventDate.getFullYear() === year;
    });

    console.log(`📊 [GENERATE-MONTH] Encontrados ${monthEvents.length} eventos en ${month}/${year}`);

    // Filtrar solo eventos importantes que no tienen interpretación
    const eventsToGenerate = monthEvents.filter((event: any) =>
      shouldGenerateInterpretation(event) && !event.interpretation
    );

    console.log(`🎯 [GENERATE-MONTH] ${eventsToGenerate.length} eventos necesitan interpretación`);

    // Estimar costo
    const { estimatedCost, estimatedTime } = estimateInterpretationCost(eventsToGenerate.length);
    console.log(`💰 [COST] Costo estimado: $${estimatedCost.toFixed(4)} (~${estimatedTime.toFixed(1)}s)`);

    // Generar interpretaciones
    let generated = 0;
    let errors = 0;

    for (const event of eventsToGenerate) {
      try {
        const interpretation = await generateEventInterpretation(
          event,
          userId,
          year
        );

        if (interpretation) {
          // Actualizar el evento con la interpretación
          const eventIndex = cycle.events.findIndex(e => e.id === event.id);
          if (eventIndex !== -1) {
            cycle.events[eventIndex].interpretation = interpretation;
            generated++;
          }
        }
      } catch (error) {
        console.error(`❌ [ERROR] Error generando interpretación para ${event.id}:`, error);
        errors++;
      }
    }

    // Guardar el ciclo actualizado
    await cycle.save();

    const skipped = monthEvents.length - eventsToGenerate.length;

    console.log(`✅ [GENERATE-MONTH] Completado: ${generated} generadas, ${skipped} saltadas, ${errors} errores`);

    return NextResponse.json({
      success: true,
      data: {
        month,
        year,
        yearLabel,
        totalEvents: monthEvents.length,
        generated,
        skipped,
        errors,
        estimatedCost,
        estimatedTime,
        events: cycle.events.filter((e: any) => {
          const eventDate = new Date(e.date);
          return eventDate.getMonth() + 1 === month && eventDate.getFullYear() === year;
        })
      }
    });

  } catch (error) {
    console.error('❌ [API] Error generating month interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al generar interpretaciones del mes',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
