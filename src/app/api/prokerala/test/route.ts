//
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

    // Paso 1: Intentar obtener un token
    let tokenData;
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
      tokenData = {
        success: true,
        tokenType: tokenResponse.data.token_type,
        expiresIn: tokenResponse.data.expires_in,
        accessTokenAvailable: !!tokenResponse.data.access_token
      };
    } catch (tokenError: unknown) {
      console.error('Error obteniendo token:', tokenError);
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo token',
        details: tokenError instanceof Error ? tokenError.message : 'Error desconocido',
        response: tokenError instanceof axios.AxiosError ? tokenError.response?.data : 'No hay datos de respuesta'
      });
    }

    // Paso 2: Probar un endpoint simple como el de búsqueda de ubicaciones
    try {
      const locationResponse = await axios.get(`${BASE_URL}/location-search?q=Madrid`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessTokenAvailable ? 'TOKEN_RECEIVED' : 'NO_TOKEN'}`, // No mostramos el token real por seguridad
          'Accept': 'application/json'
        }
      });
      
      // Retornar un resultado simplificado
      return NextResponse.json({
        success: true,
        tokenTest: tokenData,
        apiTest: {
          success: true,
          status: locationResponse.status,
          hasData: !!locationResponse.data,
          dataType: typeof locationResponse.data
        }
      });
    } catch (apiError: unknown) {
      console.error('Error probando API:', apiError);
      return NextResponse.json({
        success: false,
        tokenTest: tokenData,
        apiTest: {
          success: false,
          error: apiError instanceof Error ? apiError.message : 'Error desconocido',
          status: apiError instanceof axios.AxiosError ? apiError.response?.status : undefined,
          data: apiError instanceof axios.AxiosError ? apiError.response?.data : undefined
        }
      });
    }
  } catch (error: unknown) {
    console.error('Error general:', error);
    return NextResponse.json({
      success: false,
      error: 'Error general en la prueba',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}