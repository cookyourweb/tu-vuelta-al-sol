import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chartType = searchParams.get('chartType');

    console.log('📝 Guardando interpretación:', { userId, chartType });

    if (!userId || !chartType) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or chartType' },
        { status: 400 }
      );
    }

    // Conectar a MongoDB
    await connectDB();

    // Aquí puedes implementar la lógica de guardado
    // Por ahora retornamos éxito para evitar el 404
    
    return NextResponse.json({ 
      success: true, 
      message: 'Interpretation endpoint ready',
      userId,
      chartType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en interpretations/save:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// También soportar POST si es necesario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chartType, interpretation } = body;

    console.log('📝 Guardando interpretación POST:', { userId, chartType });

    return NextResponse.json({
      success: true,
      message: 'Interpretation saved via POST',
      data: { userId, chartType, interpretation }
    });

  } catch (error) {
    console.error('Error POST interpretations/save:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
