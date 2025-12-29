// =============================================================================
// 🗑️ ADMIN ENDPOINT - CLEAR ALL DATABASE
// IMPORTANTE: SOLO USAR EN DESARROLLO
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // ⚠️ SEGURIDAD: Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Este endpoint solo está disponible en desarrollo' },
        { status: 403 }
      );
    }

    console.log('🔌 Conectando a MongoDB...');
    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    if (!db) {
      throw new Error('No se pudo obtener la conexión a la base de datos');
    }

    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Colecciones encontradas:');

    const collectionStats: any[] = [];
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  - ${collection.name}: ${count} documentos`);
      collectionStats.push({ name: collection.name, count });
    }

    // Borrar todas las colecciones
    console.log('\n⚠️  BORRANDO TODAS LAS COLECCIONES...\n');
    const deleted: string[] = [];

    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`✅ Borrada: ${collection.name}`);
      deleted.push(collection.name);
    }

    console.log('\n🎉 ¡MongoDB limpia! Todas las colecciones eliminadas.');

    return NextResponse.json({
      success: true,
      message: 'Todas las colecciones han sido eliminadas',
      collectionsDeleted: deleted,
      stats: collectionStats
    });

  } catch (error) {
    console.error('❌ Error limpiando MongoDB:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
