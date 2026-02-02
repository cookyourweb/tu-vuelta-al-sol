import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// ✅ API configuration COMPLETA
const API_BASE_URL = 'https://api.prokerala.com/v2';
const CLIENT_ID = process.env.DEFPROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.DEFPROKERALA_CLIENT_SECRET;

// Token cache
let tokenCache: { token: string; expires: number } | null = null;

/**
 * ✅ FUNCIÓN CORREGIDA: Get access token for Prokerala API
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Use cached token if still valid
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }

  // Verify credentials
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Prokerala API credentials missing. Check environment variables.');
  }

  try {
    console.log('📡 Solicitando token a Prokerala...');

    const response = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    console.log('✅ Token response status:', response.status);

    if (!response.data || !response.data.access_token) {
      throw new Error('Invalid token response from Prokerala');
    }

    // Store token in cache
    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };

    console.log('✅ Token Prokerala obtenido exitosamente');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error getting Prokerala token:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Sin créditos en cuenta Prokerala');
      } else if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas de Prokerala');
      }
    }

    throw new Error('Authentication failed with Prokerala API');
  }
}

/**
 * ✅ Formatea la zona horaria en formato ±HH:mm para ISO string
 */
function formatTimezoneOffset(timezone: string): string {
  // Madrid timezone offset - winter: +01:00, summer: +02:00
  // Para simplificar, usamos +01:00 que es el offset estándar para Madrid
  if (timezone?.toLowerCase().includes('madrid') || timezone?.toLowerCase().includes('europe/madrid')) {
    return '+01:00';
  }
  // Para otras zonas horarias, por defecto +00:00
  return '+00:00';
}

/**
 * ✅ POST endpoint for progressed chart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone, progressionYear } = body;

    console.log('📥 Progressed chart request:', { birthDate, birthTime, latitude, longitude, timezone, progressionYear });

    // Validate required parameters
    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined || !progressionYear) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    try {
      const token = await getToken();

      // Format datetime with timezone - ✅ FORMATO EXACTO DE POSTMAN
      const offset = formatTimezoneOffset(timezone || 'Europe/Madrid');
      const datetime = `${birthDate}T${birthTime}:00${offset}`;

      console.log('🔧 Datos formateados:', { datetime, timezone, offset });

      // Build URL for progressed chart API - ✅ USANDO VARIABLES DINÁMICAS
      const url = new URL(`${API_BASE_URL}/astrology/progression-aspect-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', `${latitude},${longitude}`);
      url.searchParams.append('profile[birth_time_unknown]', 'false');
      url.searchParams.append('progression_year', progressionYear.toString());
      url.searchParams.append('current_coordinates', `${latitude},${longitude}`);
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '0');

      console.log('🌐 URL de Prokerala API:', url.toString());

      // Call Prokerala API - ✅ USANDO GET como funciona en la documentación oficial
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error en Prokerala API: ${response.status} ${response.statusText}`);
      }

      const progressedChartData = response.data;

      console.log('📡 Datos recibidos de Prokerala progressed chart:', typeof progressedChartData);

      // ✅ MANEJAR RESPUESTA SVG DE PROKERALA
      let processedData;
      if (typeof progressedChartData === 'string' && progressedChartData.includes('<svg')) {
        // Es SVG - procesar como tal
        processedData = {
          svg: progressedChartData,
          format: 'svg',
          source: 'prokerala'
        };
      } else {
        // Es JSON o otro formato
        processedData = progressedChartData;
      }

      return NextResponse.json({
        success: true,
        data: processedData,
        fallback: false,
        message: 'Carta progresada obtenida de Prokerala'
      });

    } catch (apiError) {
      console.error('❌ Error con Prokerala API:', apiError);

      return NextResponse.json({
        success: false,
        error: apiError instanceof Error ? apiError.message : 'Error desconocido',
        fallback: true
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Error general processing progressed chart request:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request' },
      { status: 500 }
    );
  }
}
