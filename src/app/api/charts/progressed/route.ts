// src/app/api/charts/progressed/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Función de prueba para POST
export async function POST(request: NextRequest) {
  try {
    console.log('🔮 POST /api/charts/progressed - Recibiendo solicitud...');
    
    const body = await request.json();
    console.log('📋 Body recibido:', body);
    
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // Validación básica
    if (!birthDate || !latitude || !longitude) {
      console.log('❌ Faltan parámetros requeridos');
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos: birthDate, latitude, longitude'
      }, { status: 400 });
    }

    console.log('✅ Parámetros válidos, procesando...');
    
    // RESPUESTA DE PRUEBA (sin llamar a Prokerala aún)
    const testResponse = {
      success: true,
      message: 'Endpoint funcionando - datos recibidos correctamente',
      data: {
        received: {
          birthDate,
          birthTime: birthTime || '12:00:00',
          latitude,
          longitude,
          timezone: timezone || 'UTC'
        },
        progression: {
          current: {
            year: 2025,
            period: `${birthDate.slice(5)}-2025 a ${birthDate.slice(5)}-2026`,
            chart: { planets: [], houses: [], status: 'test_mode' }
          },
          next: {
            year: 2026,
            period: `${birthDate.slice(5)}-2026 a ${birthDate.slice(5)}-2027`,
            chart: { planets: [], houses: [], status: 'test_mode' }
          }
        },
        metadata: {
          calculatedAt: new Date().toISOString(),
          isAfterBirthday: true,
          mode: 'test_response'
        }
      }
    };

    console.log('✅ Enviando respuesta de prueba');
    return NextResponse.json(testResponse);

  } catch (error) {
    console.error('❌ Error en POST /api/charts/progressed:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Error desconocido',
        type: 'server_error'
      }
    }, { status: 500 });
  }
}

// Función GET para debug
export async function GET(request: NextRequest) {
  console.log('ℹ️ GET /api/charts/progressed - Información del endpoint');
  
  return NextResponse.json({
    endpoint: '/api/charts/progressed',
    method: 'POST',
    description: 'Endpoint para generar cartas progresadas',
    required_params: {
      birthDate: 'string (YYYY-MM-DD)',
      latitude: 'number',
      longitude: 'number'
    },
    optional_params: {
      birthTime: 'string (HH:mm:ss)',
      timezone: 'string'
    },
    example_request: {
      birthDate: "1990-01-15",
      birthTime: "12:30:00",
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: "Europe/Madrid"
    },
    status: 'ready_for_testing'
  });
}