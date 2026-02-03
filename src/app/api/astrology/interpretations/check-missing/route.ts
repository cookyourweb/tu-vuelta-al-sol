// =============================================================================
// 🔍 API: Check Missing Interpretations - Verificar interpretaciones faltantes
// src/app/api/astrology/interpretations/check-missing/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle from '@/models/SolarCycle';
import {
  shouldGenerateInterpretation,
  estimateInterpretationCost
} from '@/utils/interpretations/eventInterpretationHelper';

/**
 * GET /api/astrology/interpretations/check-missing?userId=xxx&yearLabel=YYYY-YYYY
 *
 * Verifica qué interpretaciones faltan para un ciclo solar.
 * Útil para decidir si se debe llamar a generate-batch.
 *
 * Returns:
 * - totalEvents: total de eventos del ciclo
 * - importantEvents: eventos que deberían tener interpretación
 * - withInterpretation: eventos que ya tienen interpretación
 * - missing: eventos que faltan interpretar
 * - missingEventIds: IDs de eventos faltantes
 * - estimatedCost: costo estimado para generar faltantes
 * - completionPercentage: % de completitud
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const yearLabel = searchParams.get('yearLabel');

    if (!userId || !yearLabel) {
      return NextResponse.json({
        success: false,
        error: 'userId y yearLabel son requeridos'
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

    console.log(`🔍 [CHECK-MISSING] Verificando interpretaciones para ${yearLabel}`);

    // Filtrar eventos importantes
    const importantEvents = cycle.events.filter((event: any) =>
      shouldGenerateInterpretation(event)
    );

    // Eventos con interpretación
    const withInterpretation = importantEvents.filter((event: any) =>
      event.interpretation && Object.keys(event.interpretation).length > 0
    );

    // Eventos sin interpretación
    const missingInterpretation = importantEvents.filter((event: any) =>
      !event.interpretation || Object.keys(event.interpretation).length === 0
    );

    // Estimar costo de generar faltantes
    const { estimatedCost, estimatedTime } = estimateInterpretationCost(missingInterpretation.length);

    // Calcular porcentaje de completitud
    const completionPercentage = importantEvents.length > 0
      ? Math.round((withInterpretation.length / importantEvents.length) * 100)
      : 100;

    // Agrupar eventos faltantes por mes para mejor visualización
    const missingByMonth: Record<string, number> = {};
    missingInterpretation.forEach((event: any) => {
      const eventDate = new Date(event.date);
      const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
      missingByMonth[monthKey] = (missingByMonth[monthKey] || 0) + 1;
    });

    console.log(`📊 [CHECK-MISSING] ${withInterpretation.length}/${importantEvents.length} interpretaciones completadas (${completionPercentage}%)`);

    return NextResponse.json({
      success: true,
      data: {
        yearLabel,
        totalEvents: cycle.events.length,
        importantEvents: importantEvents.length,
        withInterpretation: withInterpretation.length,
        missing: missingInterpretation.length,
        missingEventIds: missingInterpretation.map((e: any) => e.id),
        missingByMonth,
        completionPercentage,
        estimatedCost: {
          amount: estimatedCost,
          formatted: `$${estimatedCost.toFixed(4)}`
        },
        estimatedTime: {
          seconds: estimatedTime,
          formatted: `~${Math.ceil(estimatedTime / 60)} min`
        },
        needsGeneration: missingInterpretation.length > 0
      }
    });

  } catch (error) {
    console.error('❌ [API] Error checking missing interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al verificar interpretaciones faltantes',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
