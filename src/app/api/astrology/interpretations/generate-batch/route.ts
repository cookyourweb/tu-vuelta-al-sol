// =============================================================================
// 🚀 API: Generate Batch Interpretations - Capa 3 del sistema de 3 capas
// src/app/api/astrology/interpretations/generate-batch/route.ts
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
 * POST /api/astrology/interpretations/generate-batch
 *
 * Genera interpretaciones para TODOS los eventos faltantes de un ciclo.
 * Parte del sistema de 3 capas - CAPA 3: Completar al abrir libro
 *
 * Body:
 * - userId: string (requerido)
 * - yearLabel: string (ej: "2025-2026")
 * - maxConcurrent?: number (default: 3, máximo: 5) - límite de concurrencia
 * - onProgress?: boolean (si se debe retornar progreso en stream)
 *
 * Returns:
 * - generated: número de interpretaciones generadas
 * - skipped: número de eventos que ya tenían interpretación
 * - errors: número de errores
 * - cost: costo total
 * - duration: tiempo total
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, yearLabel, maxConcurrent = 3 } = body;

    // Validaciones
    if (!userId || !yearLabel) {
      return NextResponse.json({
        success: false,
        error: 'Faltan parámetros requeridos: userId, yearLabel'
      }, { status: 400 });
    }

    const concurrent = Math.min(Math.max(maxConcurrent, 1), 5);

    await connectDB();

    // Obtener el ciclo solar
    const cycle = await SolarCycle.findByYear(userId, yearLabel);

    if (!cycle) {
      return NextResponse.json({
        success: false,
        error: `Ciclo ${yearLabel} no encontrado`
      }, { status: 404 });
    }

    const startTime = Date.now();

    console.log(`🚀 [GENERATE-BATCH] Iniciando generación masiva para ${yearLabel}`);
    console.log(`⚙️ [CONFIG] Concurrencia: ${concurrent}`);

    // Filtrar eventos importantes que no tienen interpretación
    const eventsToGenerate = cycle.events.filter((event: any) =>
      shouldGenerateInterpretation(event) && (!event.interpretation || Object.keys(event.interpretation).length === 0)
    );

    const totalImportantEvents = cycle.events.filter((event: any) =>
      shouldGenerateInterpretation(event)
    ).length;

    const alreadyGenerated = totalImportantEvents - eventsToGenerate.length;

    console.log(`📊 [GENERATE-BATCH] Total: ${totalImportantEvents} eventos importantes`);
    console.log(`✅ [GENERATE-BATCH] Ya generados: ${alreadyGenerated}`);
    console.log(`🎯 [GENERATE-BATCH] Faltan: ${eventsToGenerate.length}`);

    if (eventsToGenerate.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'Todas las interpretaciones ya están generadas',
          generated: 0,
          skipped: alreadyGenerated,
          errors: 0,
          totalCost: 0,
          duration: 0
        }
      });
    }

    // Estimar costo
    const { estimatedCost, estimatedTime } = estimateInterpretationCost(eventsToGenerate.length);
    console.log(`💰 [COST] Costo estimado: $${estimatedCost.toFixed(4)}`);
    console.log(`⏱️ [TIME] Tiempo estimado: ~${Math.ceil(estimatedTime / 60)} min`);

    // Procesar en lotes con concurrencia controlada
    let generated = 0;
    let errors = 0;

    const processEvent = async (event: any): Promise<boolean> => {
      try {
        const eventDate = new Date(event.date);
        const interpretation = await generateEventInterpretation(
          event,
          userId,
          eventDate.getFullYear()
        );

        if (interpretation) {
          // Actualizar el evento con la interpretación
          const eventIndex = cycle.events.findIndex(e => e.id === event.id);
          if (eventIndex !== -1) {
            cycle.events[eventIndex].interpretation = interpretation;
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error(`❌ [ERROR] Error generando interpretación para ${event.id}:`, error);
        return false;
      }
    };

    // Procesar en chunks con concurrencia
    for (let i = 0; i < eventsToGenerate.length; i += concurrent) {
      const chunk = eventsToGenerate.slice(i, i + concurrent);

      console.log(`📦 [BATCH ${Math.floor(i / concurrent) + 1}] Procesando ${chunk.length} eventos (${i + 1}-${Math.min(i + concurrent, eventsToGenerate.length)} de ${eventsToGenerate.length})`);

      const results = await Promise.all(
        chunk.map(event => processEvent(event))
      );

      // Contar resultados
      results.forEach(success => {
        if (success) {
          generated++;
        } else {
          errors++;
        }
      });

      // Guardar progreso después de cada chunk
      await cycle.save();

      const progress = Math.round(((i + chunk.length) / eventsToGenerate.length) * 100);
      console.log(`📊 [PROGRESS] ${progress}% completado (${generated} generadas, ${errors} errores)`);
    }

    // Guardar versión final
    await cycle.save();

    const duration = Math.round((Date.now() - startTime) / 1000);
    const actualCost = generated * 0.01; // Costo real aproximado

    console.log(`✅ [GENERATE-BATCH] Completado en ${duration}s`);
    console.log(`📊 [STATS] Generadas: ${generated}, Errores: ${errors}, Costo: $${actualCost.toFixed(4)}`);

    return NextResponse.json({
      success: true,
      data: {
        yearLabel,
        totalEvents: cycle.events.length,
        importantEvents: totalImportantEvents,
        generated,
        skipped: alreadyGenerated,
        errors,
        estimatedCost,
        actualCost,
        duration: {
          seconds: duration,
          formatted: duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`
        },
        completionPercentage: Math.round(((generated + alreadyGenerated) / totalImportantEvents) * 100)
      }
    });

  } catch (error) {
    console.error('❌ [API] Error generating batch interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al generar interpretaciones en lote',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

/**
 * GET /api/astrology/interpretations/generate-batch?userId=xxx&yearLabel=YYYY-YYYY
 *
 * Obtiene el estado de progreso de generación batch (útil para polling)
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

    const cycle = await SolarCycle.findByYear(userId, yearLabel);

    if (!cycle) {
      return NextResponse.json({
        success: false,
        error: `Ciclo ${yearLabel} no encontrado`
      }, { status: 404 });
    }

    const importantEvents = cycle.events.filter((event: any) =>
      shouldGenerateInterpretation(event)
    );

    const withInterpretation = importantEvents.filter((event: any) =>
      event.interpretation && Object.keys(event.interpretation).length > 0
    );

    const completionPercentage = importantEvents.length > 0
      ? Math.round((withInterpretation.length / importantEvents.length) * 100)
      : 100;

    return NextResponse.json({
      success: true,
      data: {
        yearLabel,
        importantEvents: importantEvents.length,
        completed: withInterpretation.length,
        remaining: importantEvents.length - withInterpretation.length,
        completionPercentage,
        isComplete: completionPercentage === 100
      }
    });

  } catch (error) {
    console.error('❌ [API] Error checking batch progress:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al verificar progreso',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
