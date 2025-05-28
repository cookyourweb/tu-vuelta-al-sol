// src/app/api/charts/progressed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getNatalHoroscope } from '@/services/progressedChartService';

/**
 * GET endpoint para cartas progresadas
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extraer parámetros de la query string
    const birthDate = searchParams.get('birthDate');
    const birthTime = searchParams.get('birthTime') || '12:00:00';
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const timezone = searchParams.get('timezone') || 'UTC';
    
    // Validar parámetros requeridos
    if (!birthDate || !latitude || !longitude) {
      return NextResponse.json({
        error: 'Faltan parámetros requeridos: birthDate, latitude, longitude'
      }, { status: 400 });
    }

    // Obtener carta progresada
    const progressedChart = await getNatalHoroscope(
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone
    );

    return NextResponse.json({
      success: true,
      data: progressedChart,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en GET /api/charts/progressed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST endpoint para cartas progresadas con datos en el body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime = '12:00:00', latitude, longitude, timezone = 'UTC' } = body;
    
    // Validar datos requeridos
    if (!birthDate || !latitude || !longitude) {
      return NextResponse.json({
        error: 'Faltan datos requeridos: birthDate, latitude, longitude'
      }, { status: 400 });
    }

    // Obtener carta progresada
    const progressedChart = await getNatalHoroscope(
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone
    );

    return NextResponse.json({
      success: true,
      data: progressedChart,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en POST /api/charts/progressed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}