// =============================================================================
// 🧹 ENDPOINT DE LIMPIEZA: Clear Cache
// src/app/api/admin/clear-cache/route.ts
// =============================================================================
// Limpia interpretaciones cacheadas y fuerza recalculo con parámetros tropicales
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import EventInterpretation from '@/models/EventInterpretation';
import Interpretation from '@/models/Interpretation';
import Chart from '@/models/Chart';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 === LIMPIEZA DE CACHÉ INICIADA ===\n');

    await connectDB();

    const { userId, clearAll, clearEvents, clearCharts, clearInterpretations } = await request.json();

    const results: any = {
      success: true,
      cleared: {},
      message: []
    };

    // 1. LIMPIAR INTERPRETACIONES DE EVENTOS (con parámetros védicos incorrectos)
    if (clearEvents || clearAll) {
      console.log('🗑️ Limpiando interpretaciones de eventos...');

      if (userId) {
        // Limpiar solo para un usuario
        const deleted = await EventInterpretation.deleteMany({ userId });
        results.cleared.eventInterpretations = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} interpretaciones de eventos eliminadas para userId: ${userId}`);
      } else {
        // Limpiar TODAS (solo admin)
        const deleted = await EventInterpretation.deleteMany({});
        results.cleared.eventInterpretations = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} interpretaciones de eventos eliminadas (TODAS)`);
      }
    }

    // 2. LIMPIAR CARTAS NATALES/PROGRESADAS (con parámetros védicos)
    if (clearCharts || clearAll) {
      console.log('🗑️ Limpiando cartas...');

      if (userId) {
        const deleted = await Chart.deleteMany({ userId });
        results.cleared.charts = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} cartas eliminadas para userId: ${userId}`);
      } else {
        const deleted = await Chart.deleteMany({});
        results.cleared.charts = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} cartas eliminadas (TODAS)`);
      }
    }

    // 3. LIMPIAR INTERPRETACIONES GENERALES
    if (clearInterpretations || clearAll) {
      console.log('🗑️ Limpiando interpretaciones generales...');

      if (userId) {
        const deleted = await Interpretation.deleteMany({ userId });
        results.cleared.interpretations = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} interpretaciones eliminadas para userId: ${userId}`);
      } else {
        const deleted = await Interpretation.deleteMany({});
        results.cleared.interpretations = deleted.deletedCount;
        results.message.push(`✅ ${deleted.deletedCount} interpretaciones eliminadas (TODAS)`);
      }
    }

    console.log('\n✅ === LIMPIEZA COMPLETADA ===');
    console.log('📊 Resultados:', results.cleared);

    return NextResponse.json({
      success: true,
      ...results,
      note: '🔄 Los datos se recalcularán automáticamente con parámetros TROPICALES (ayanamsa=0) en la próxima carga'
    });

  } catch (error) {
    console.error('❌ Error limpiando caché:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// GET para verificar estado del caché
export async function GET() {
  try {
    await connectDB();

    const stats = {
      eventInterpretations: await EventInterpretation.countDocuments(),
      charts: await Chart.countDocuments(),
      interpretations: await Interpretation.countDocuments()
    };

    return NextResponse.json({
      success: true,
      stats,
      message: 'Estadísticas de caché actual'
    });

  } catch (error) {
    console.error('❌ Error obteniendo stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
