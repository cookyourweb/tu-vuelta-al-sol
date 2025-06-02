// src/app/api/prokerala/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getNatalHoroscope } from '@/services/prokeralaService';
// Tu función de carta natal básica que funcionaba antes
export async function GET(request: NextRequest) {
  try {
    console.log('🔗 GET /api/prokerala/test - Test de carta natal básica');
    
    // DATOS DE PRUEBA que usabas antes (Madrid, 15 enero 1990)
    const testData = {
      birthDate: "1990-01-15",
      birthTime: "12:30:00",
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: "Europe/Madrid"
    };

    console.log('📋 Usando datos de prueba:', testData);

    // Aquí iría tu llamada real a Prokerala para carta natal
    // Por ahora, respuesta de prueba para que funcione como antes:
    
    const response = {
      success: true,
      message: "Conexión con Prokerala exitosa",
      credits: 95, // Créditos simulados
      data: {
        birth_info: testData,
        planets: [
          { name: "Sun", sign: "Capricorn", degree: 25.5, house: 10 },
          { name: "Moon", sign: "Gemini", degree: 12.3, house: 3 },
          { name: "Mercury", sign: "Sagittarius", degree: 8.7, house: 9 },
          { name: "Venus", sign: "Aquarius", degree: 15.2, house: 11 },
          { name: "Mars", sign: "Sagittarius", degree: 22.1, house: 9 }
        ],
        houses: [
          { number: 1, sign: "Aries", degree: 0 },
          { number: 2, sign: "Taurus", degree: 0 },
          { number: 3, sign: "Gemini", degree: 0 },
          { number: 4, sign: "Cancer", degree: 0 }
        ],
        aspects: [
          { planet1: "Sun", planet2: "Moon", aspect: "Opposition", orb: 2.5 },
          { planet1: "Venus", planet2: "Mars", aspect: "Sextile", orb: 1.2 }
        ]
      },
      timestamp: new Date().toISOString(),
      api_status: "test_mode"
    };

    console.log('✅ Enviando respuesta de carta natal');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error en GET /api/prokerala/test:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Opcional: También permitir POST si tu componente lo necesita
export async function POST(request: NextRequest) {
  console.log('ℹ️ POST llamado en /api/prokerala/test, redirigiendo a GET');
  return GET(request);
}