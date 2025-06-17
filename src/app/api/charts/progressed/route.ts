// src/app/api/charts/progressed/route.ts - VERSIÓN CORREGIDA

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { formatProkeralaDateTime, ProkeralaUtils } from '@/utils/dateTimeUtils';

// Usar las mismas credenciales que en test/route.ts (que funciona)
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
const TOKEN_URL = 'https://api.prokerala.com/token';
const API_BASE_URL = 'https://api.prokerala.com/v2';

// Cache de token (igual que en test)
let tokenCache: { token: string; expires: number } | null = null;

// ⭐ FUNCIONES PARA CÁLCULO DE AÑO ASTROLÓGICO PERSONAL

function calculateProgressionYear(birthDate: Date): number {
  const today = new Date();
  const currentYear = today.getFullYear();

  const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

  if (today >= birthdayThisYear) {
    return currentYear;
  } else {
    return currentYear - 1;
  }
}

function calculateBirthdayInYear(birthDate: Date, year: number): Date {
  return new Date(year, birthDate.getMonth(), birthDate.getDate());
}

function isCurrentAstrologicalYear(birthDate: Date): boolean {
  const today = new Date();
  const currentYear = today.getFullYear();

  const birthdayThisYear = calculateBirthdayInYear(birthDate, currentYear);

  if (today >= birthdayThisYear) {
    const nextBirthday = calculateBirthdayInYear(birthDate, currentYear + 1);
    return today < nextBirthday;
  } else {
    const lastBirthday = calculateBirthdayInYear(birthDate, currentYear - 1);
    return today >= lastBirthday;
  }
}

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Faltan credenciales de Prokerala');
  }

  try {
    console.log('🔑 Obteniendo token para carta progresada...');

    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.data || !response.data.access_token) {
      throw new Error('Respuesta de token inválida');
    }

    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in,
    };

    console.log('✅ Token obtenido para carta progresada');
    return tokenCache.token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw new Error('Falló autenticación con Prokerala');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;

    if (!birthDate || !birthTime || latitude === undefined || longitude === undefined || !timezone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan datos de nacimiento necesarios para generar la carta progresada',
        },
        { status: 400 }
      );
    }

    console.log('🔮 === INICIANDO CARTA PROGRESADA ===');
    console.log('📅 Datos recibidos:', { birthDate, birthTime, latitude, longitude, timezone });

    const token = await getToken();

    const birthDateObj = new Date(birthDate);
    const today = new Date();
    const currentYear = calculateProgressionYear(birthDateObj);

    // Use utility to format datetime with correct timezone offset
    const datetime = formatProkeralaDateTime(birthDateObj.toISOString().split('T')[0], birthTime, timezone);

    // Use utility to create URLSearchParams with all required parameters
    const urlParams = ProkeralaUtils.progressedChart({
      birthDate: birthDateObj.toISOString().split('T')[0],
      birthTime,
      latitude,
      longitude,
      timezone,
      progressionYear: currentYear,
    });

    // Build full URL with params
    const url = `${API_BASE_URL}/astrology/progression-chart?${urlParams.toString()}`;

    console.log('🔧 Parámetros formateados:');
    console.log(`   DateTime: ${datetime}`);
    console.log(`   Progression Year (Astrológico): ${currentYear}`);
    console.log(`🌐 URL completa: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    console.log('✅ Respuesta de Prokerala recibida');
    console.log('📊 Status:', response.status);

    const processedData = {
      success: true,
      message: 'Carta progresada generada exitosamente',
      data: {
        birth_info: {
          birthDate,
          birthTime,
          latitude,
          longitude,
          timezone,
        },
        progression_year: currentYear,
        progression_period: {
          start: calculateBirthdayInYear(birthDateObj, currentYear),
          end: calculateBirthdayInYear(birthDateObj, currentYear + 1),
          description: `Año astrológico ${currentYear}-${currentYear + 1}`,
          is_current: isCurrentAstrologicalYear(birthDateObj),
          explanation:
            today >= calculateBirthdayInYear(birthDateObj, new Date().getFullYear())
              ? `Ya cumpliste años en ${new Date().getFullYear()}, estás en tu año astrológico ${currentYear}-${currentYear + 1}`
              : `Aún no cumples años en ${new Date().getFullYear()}, estás en tu año astrológico ${currentYear}-${currentYear + 1}`,
        },
        chart_data: response.data,
        planets: response.data.planets || [],
        houses: response.data.houses || [],
        aspects: response.data.aspects || [],
      },
      api_response: {
        status: response.status,
        credits_used: 1,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('🎯 Carta progresada procesada exitosamente');
    console.log('🔮 === FIN CARTA PROGRESADA ===');

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('❌ Error en carta progresada:', error);

    let errorDetails: any = {
      success: false,
      error: 'Error generando carta progresada',
      timestamp: new Date().toISOString(),
    };

    if (axios.isAxiosError(error)) {
      errorDetails.details = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      };

      console.error('💥 Error de Axios:', errorDetails.details);
    } else if (error instanceof Error) {
      errorDetails.message = error.message;
    }

    return NextResponse.json(errorDetails, {
      status: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
    });
  }
}
