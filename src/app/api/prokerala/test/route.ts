// src/app/api/prokerala/test/route.ts
import { NextResponse } from 'next/server';
import { getNatalHoroscope } from '@/services/prokeralaService';

/**
 * Endpoint de prueba para verificar la carta natal con Prokerala
 */
export async function GET() {
  try {
    console.log('🧪 Iniciando prueba de carta natal...');
    
    // Datos de prueba similares a tu Postman
    const testData = {
      birthDate: '1990-01-15',     // Fecha de ejemplo
      birthTime: '12:30:00',       // Hora de ejemplo
      latitude: 40.4168,           // Madrid
      longitude: -3.7038,          // Madrid (negativo para Oeste)
      timezone: 'Europe/Madrid'
    };
    
    console.log('📋 Datos de prueba:', testData);
    
    // Llamar al servicio de carta natal
    const natalChart = await getNatalHoroscope(
      testData.birthDate,
      testData.birthTime,
      testData.latitude,
      testData.longitude,
      testData.timezone,
      {
        houseSystem: 'placidus',
        aspectFilter: 'all',
        language: 'es',
        ayanamsa: '1',
        birthTimeUnknown: false,
        birthTimeRectification: 'none',
        orb: 'default'
      }
    );
    
    console.log('✅ Carta natal obtenida exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Carta natal generada exitosamente',
      testData: testData,
      natalChart: natalChart,
      timestamp: new Date().toISOString(),
      credits: natalChart?.credits_remaining || 'Unknown'
    });
    
  } catch (error: unknown) {
    console.error('❌ Error en prueba de carta natal:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Endpoint POST para probar con datos personalizados
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // Validar datos requeridos
    if (!birthDate || !birthTime || !latitude || !longitude || !timezone) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos: birthDate, birthTime, latitude, longitude, timezone',
        example: {
          birthDate: '1990-01-15',
          birthTime: '12:30:00',
          latitude: 40.4168,
          longitude: -3.7038,
          timezone: 'Europe/Madrid'
        }
      }, { status: 400 });
    }

    console.log('🧪 Prueba POST con datos personalizados:', { birthDate, birthTime, latitude, longitude, timezone });

    // Llamar al servicio con datos del usuario
    const natalChart = await getNatalHoroscope(
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone,
      {
        houseSystem: 'placidus',
        aspectFilter: 'all',
        language: 'es',
        ayanamsa: '1',
        birthTimeUnknown: false,
        birthTimeRectification: 'none',
        orb: 'default'
      }
    );

    console.log('✅ Carta natal personalizada generada exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Carta natal personalizada generada exitosamente',
      birthData: { birthDate, birthTime, latitude, longitude, timezone },
      natalChart: natalChart,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Error generando carta natal personalizada:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error generando carta natal',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}