// src/app/api/prokerala/test/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// URLs de Prokerala para pruebas
const TOKEN_ENDPOINT = 'https://api.prokerala.com/token';
const BASE_URL = 'https://api.prokerala.com/v2';

// Credenciales
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

/**
 * Endpoint de prueba para verificar la conectividad con Prokerala
 */
export async function GET() {
  try {
    // Verificar que las credenciales estén disponibles
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales no configuradas',
        clientIdAvailable: !!CLIENT_ID,
        clientSecretAvailable: !!CLIENT_SECRET
      });
    }

    // Paso 1: Obtener token
    let accessToken;
    try {
      const tokenResponse = await axios.post(
        TOKEN_ENDPOINT,
        new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      accessToken = tokenResponse.data.access_token;
      console.log('✅ Token obtenido exitosamente');
      
    } catch (tokenError: unknown) {
      console.error('❌ Error obteniendo token:', tokenError);
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo token',
        details: tokenError instanceof Error ? tokenError.message : 'Error desconocido',
      });
    }

    // Paso 2: Probar un endpoint real de astrología - Panchang (calendario védico)
    try {
      // Datos de prueba para Madrid
      const testParams = {
        ayanamsa: '1',
        coordinates: '40.4168,3.7038', // Madrid (sin signo negativo para longitud)
        datetime: '2025-01-01T12:00:00+01:00' // Fecha actual con timezone
      };

      console.log('🔍 Probando endpoint de Panchang con:', testParams);

      const panchangResponse = await axios.get(`${BASE_URL}/astrology/panchang`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        params: testParams
      });
      
      console.log('✅ Respuesta de Panchang recibida:', panchangResponse.status);
      
      // Retornar resultado exitoso
      return NextResponse.json({
        success: true,
        message: 'Conexión con Prokerala API exitosa',
        tokenTest: {
          success: true,
          message: 'Token obtenido correctamente'
        },
        apiTest: {
          success: true,
          endpoint: 'v2/astrology/panchang',
          status: panchangResponse.status,
          hasData: !!panchangResponse.data,
          sampleData: {
            // Solo mostrar algunos campos para verificar
            panchang: panchangResponse.data?.data?.panchang ? 'Datos recibidos ✅' : 'Sin datos',
            timestamp: new Date().toISOString()
          }
        }
      });
      
    } catch (apiError: unknown) {
      console.error('❌ Error probando API:', apiError);
      
      // Información detallada del error para debugging
      const errorInfo = apiError instanceof axios.AxiosError ? {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        url: apiError.config?.url
      } : { message: apiError instanceof Error ? apiError.message : 'Error desconocido' };
      
      return NextResponse.json({
        success: false,
        tokenTest: {
          success: true,
          message: 'Token obtenido correctamente'
        },
        apiTest: {
          success: false,
          endpoint: 'v2/astrology/panchang',
          error: errorInfo,
          suggestion: 'Verifica que tu plan de Prokerala permita acceder a este endpoint'
        }
      });
    }
    
  } catch (error: unknown) {
    console.error('❌ Error general:', error);
    return NextResponse.json({
      success: false,
      error: 'Error general en la prueba',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}

/**
 * Endpoint POST para probar la generación de carta natal
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // Validar datos requeridos
    if (!birthDate || !birthTime || !latitude || !longitude || !timezone) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos: birthDate, birthTime, latitude, longitude, timezone'
      }, { status: 400 });
    }

    // Obtener token
    const tokenResponse = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID!,
        'client_secret': CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Formatear datetime para la API
    const datetime = `${birthDate}T${birthTime}+01:00`;
    
    // Parámetros para carta natal
    const natalParams = {
      ayanamsa: '1',
      coordinates: `${latitude},${longitude}`,
      datetime: datetime
    };

    console.log('🔍 Generando carta natal con:', natalParams);

    // Llamar al endpoint de carta natal
    const natalResponse = await axios.get(`${BASE_URL}/astrology/birth-details`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      params: natalParams
    });

    return NextResponse.json({
      success: true,
      message: 'Carta natal generada exitosamente',
      data: {
        birthData: { birthDate, birthTime, latitude, longitude, timezone },
        natalChart: natalResponse.data,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('❌ Error generando carta natal:', error);
    
    const errorInfo = error instanceof axios.AxiosError ? {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    } : { message: error instanceof Error ? error.message : 'Error desconocido' };
    
    return NextResponse.json({
      success: false,
      error: 'Error generando carta natal',
      details: errorInfo
    }, { status: 500 });
  }
}