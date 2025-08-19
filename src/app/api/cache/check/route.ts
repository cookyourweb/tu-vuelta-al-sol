

// src/app/api/astrology/cache/invalidate/route.ts
// 🗑️ API ROUTE PARA INVALIDAR CACHÉ

import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const { userId, reason } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    // 🔗 CONECTAR A MONGODB
    const { db } = await connectToDatabase();
    
    // 🗑️ ELIMINAR CACHÉ DEL USUARIO
    const result = await db.collection('user_agenda_cache').deleteMany({
      userId
    });

    console.log(`🗑️ Caché invalidado para usuario ${userId}:`, {
      reason: reason || 'manual',
      deletedCount: result.deletedCount
    });

    return NextResponse.json({
      success: true,
      data: {
        invalidated: true,
        deletedCount: result.deletedCount,
        reason: reason || 'manual'
      }
    });

  } catch (error) {
    console.error('❌ Error invalidando caché:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

function connectToDatabase(): { db: any; } | PromiseLike<{ db: any; }> {
    throw new Error('Function not implemented.');
}

