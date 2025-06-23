// src/app/api/clear-chart-cache/route.ts - LIMPIAR CACHE DE CARTAS
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chart from '@/models/Chart';

/**
 * 🗑️ DELETE: Eliminar cartas guardadas para forzar regeneración
 * Útil cuando se corrige un bug en la generación de cartas
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const clearAll = searchParams.get('clearAll') === 'true';
    
    await connectDB();
    
    if (clearAll) {
      // 🗑️ ELIMINAR TODAS LAS CARTAS (solo en desarrollo)
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
          { success: false, error: 'clearAll solo disponible en desarrollo' },
          { status: 403 }
        );
      }
      
      const result = await Chart.deleteMany({});
      console.log(`🗑️ Eliminadas ${result.deletedCount} cartas de la base de datos`);
      
      return NextResponse.json({
        success: true,
        message: `Eliminadas ${result.deletedCount} cartas. Se regenerarán automáticamente.`,
        deletedCount: result.deletedCount
      });
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere userId o clearAll=true' },
        { status: 400 }
      );
    }
    
    // 🗑️ ELIMINAR CARTA DE UN USUARIO ESPECÍFICO
    const result = await Chart.deleteOne({ userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No se encontró carta para eliminar' },
        { status: 404 }
      );
    }
    
    console.log(`🗑️ Eliminada carta del usuario: ${userId}`);
    
    return NextResponse.json({
      success: true,
      message: 'Carta eliminada. Se regenerará en la próxima consulta.',
      userId
    });
    
  } catch (error) {
    console.error('❌ Error limpiando cache de cartas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al limpiar cache' },
      { status: 500 }
    );
  }
}

/**
 * 🔄 POST: Regenerar carta específica inmediatamente
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere userId' },
        { status: 400 }
      );
    }
    
    console.log(`🔄 Regenerando carta para usuario: ${userId}`);
    
    // Eliminar carta existente
    await connectDB();
    await Chart.deleteOne({ userId });
    
    // Obtener URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // Generar nueva carta
    const response = await fetch(`${baseUrl}/api/charts/natal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, regenerate: true })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Carta regenerada exitosamente');
      console.log('🔺 Nuevo ascendente:', result.natalChart?.ascendant?.sign);
      
      return NextResponse.json({
        success: true,
        message: 'Carta regenerada con API corregida',
        natalChart: result.natalChart,
        ascendant: result.natalChart?.ascendant?.sign
      });
    } else {
      throw new Error(result.error || 'Error regenerando carta');
    }
    
  } catch (error) {
    console.error('❌ Error regenerando carta:', error);
    return NextResponse.json(
      { success: false, error: 'Error al regenerar carta' },
      { status: 500 }
    );
  }
}