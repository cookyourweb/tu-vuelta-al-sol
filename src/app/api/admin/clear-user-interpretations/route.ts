// =============================================================================
// 🗑️ ADMIN ENDPOINT - CLEAR USER INTERPRETATIONS
// Borra solo las interpretaciones de un usuario específico
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🗑️  Borrando interpretaciones para userId: ${userId}`);

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    if (!db) {
      throw new Error('No se pudo obtener la conexión a la base de datos');
    }

    // Contar documentos antes de borrar
    const countBefore = await db.collection('interpretations').countDocuments({ userId });
    console.log(`📊 Interpretaciones encontradas: ${countBefore}`);

    // Borrar interpretaciones del usuario
    const result = await db.collection('interpretations').deleteMany({ userId });

    console.log(`✅ Interpretaciones borradas: ${result.deletedCount}`);

    return NextResponse.json({
      success: true,
      message: `Se borraron ${result.deletedCount} interpretaciones del usuario`,
      userId,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Error borrando interpretaciones:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Método GET para verificar interpretaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    if (!db) {
      throw new Error('No se pudo obtener la conexión a la base de datos');
    }

    // Obtener todas las interpretaciones del usuario
    const interpretations = await db.collection('interpretations')
      .find({ userId })
      .toArray();

    console.log(`📊 Interpretaciones del usuario ${userId}:`, interpretations.length);

    // Mostrar información resumida de cada interpretación
    const summary = interpretations.map((i: any) => ({
      _id: i._id,
      chartType: i.chartType,
      year: i.year,
      generatedAt: i.generatedAt,
      hasMassive: !!i.interpretation,
      hasIndividual: !!i.interpretations,
      individualKeys: i.interpretations ? {
        planets: Object.keys(i.interpretations.planets || {}).length,
        nodes: Object.keys(i.interpretations.nodes || {}).length,
        asteroids: Object.keys(i.interpretations.asteroids || {}).length
      } : null
    }));

    return NextResponse.json({
      success: true,
      userId,
      count: interpretations.length,
      interpretations: summary
    });

  } catch (error) {
    console.error('❌ Error consultando interpretaciones:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
