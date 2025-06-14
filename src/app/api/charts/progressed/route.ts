// src/app/api/charts/progressed/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Usar las mismas credenciales que en test/route.ts (que funciona)
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
const TOKEN_URL = 'https://api.prokerala.com/token';
const API_BASE_URL = 'https://api.prokerala.com/v2';

// Cache de token (igual que en test)
let tokenCache: { token: string; expires: number } | null = null;

// ⭐ FUNCIONES PARA CÁLCULO DE AÑO ASTROLÓGICO PERSONAL

/**
 * Calcula el año de progresión basado en el cumpleaños de la persona
 * El año astrológico va de cumpleaños a cumpleaños, no de enero a enero
 * 
 * LÓGICA: Si ya pasó el cumpleaños este año, usamos ESE año
 *         Si no ha llegado el cumpleaños, usamos el año anterior
 */
function calculateProgressionYear(birthDate: Date): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Crear fecha de cumpleaños de este año
  const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // Si ya pasó el cumpleaños este año, el año astrológico actual es este año
  // Si no ha llegado, el año astrológico actual es el año pasado
  if (today >= birthdayThisYear) {
    return currentYear; // Ya empezó el año astrológico 2025 (si cumplió en 2025)
  } else {
    return currentYear - 1; // Aún estamos en el año astrológico 2024 (si no ha cumplido en 2025)
  }
}

/**
 * Obtiene la fecha de cumpleaños en un año específico
 */
function calculateBirthdayInYear(birthDate: Date, year: number): Date {
  return new Date(year, birthDate.getMonth(), birthDate.getDate());
}

/**
 * Verifica si estamos en el año astrológico actual de la persona
 */
function isCurrentAstrologicalYear(birthDate: Date): boolean {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Calcular el período astrológico actual
  const birthdayThisYear = calculateBirthdayInYear(birthDate, currentYear);
  
  if (today >= birthdayThisYear) {
    // Ya pasó el cumpleaños este año
    const nextBirthday = calculateBirthdayInYear(birthDate, currentYear + 1);
    return today < nextBirthday; // Estamos entre cumpleaños actual y próximo
  } else {
    // No ha llegado el cumpleaños este año
    const lastBirthday = calculateBirthdayInYear(birthDate, currentYear - 1);
    return today >= lastBirthday; // Estamos entre cumpleaños pasado y actual
  }
}

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Usar token en cache si aún es válido
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
    
    if (!response.data || !response.data.access_token) {
      throw new Error('Respuesta de token inválida');
    }
    
    // Guardar token en cache
    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
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
    
    console.log('🔮 === INICIANDO CARTA PROGRESADA ===');
    console.log('📅 Datos recibidos:', { birthDate, birthTime, latitude, longitude, timezone });
    
    // Obtener token
    const token = await getToken();
    
    // ⭐ CALCULAR AÑO ASTROLÓGICO PERSONAL (cumpleaños a cumpleaños)
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    const currentYear = calculateProgressionYear(birthDateObj);
    
    // APLICAR MISMOS PARÁMETROS QUE EL TEST POSTMAN QUE FUNCIONA
    const datetime = `${birthDate}T${birthTime}+01:00`; // Formato ISO con timezone
    const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`; // 4 decimales
    
    console.log('🔧 Parámetros formateados:');
    console.log(`   DateTime: ${datetime}`);
    console.log(`   Coordinates: ${coordinates}`);
    console.log(`   Progression Year (Astrológico): ${currentYear}`);
    
    // Construir URL con parámetros EXACTOS como test-postman
    const url = new URL(`${API_BASE_URL}/astrology/progression-chart`);
    url.searchParams.append('profile[datetime]', datetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('progression_year', currentYear.toString());
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0'); // 🚨 CRÍTICO: Tropical como en test
    
    console.log('🌐 URL completa:', url.toString());
    
    // Hacer solicitud GET (como en test-postman que funciona)
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Respuesta de Prokerala recibida');
    console.log('📊 Status:', response.status);
    
    // Procesamiento básico de la respuesta
    const processedData = {
      success: true,
      message: 'Carta progresada generada exitosamente',
      data: {
        birth_info: {
          birthDate,
          birthTime,
          latitude,
          longitude,
          timezone
        },
        progression_year: currentYear,
        progression_period: {
          start: calculateBirthdayInYear(birthDateObj, currentYear),
          end: calculateBirthdayInYear(birthDateObj, currentYear + 1),
          description: `Año astrológico ${currentYear}-${currentYear + 1}`,
          is_current: isCurrentAstrologicalYear(birthDateObj),
          explanation: today >= calculateBirthdayInYear(birthDateObj, new Date().getFullYear()) 
            ? `Ya cumpliste años en ${new Date().getFullYear()}, estás en tu año astrológico ${currentYear}-${currentYear + 1}`
            : `Aún no cumples años en ${new Date().getFullYear()}, estás en tu año astrológico ${currentYear}-${currentYear + 1}`
        },
        chart_data: response.data,
        planets: response.data.planets || [],
        houses: response.data.houses || [],
        aspects: response.data.aspects || []
      },
      api_response: {
        status: response.status,
        credits_used: 1, // Estimado
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('🎯 Carta progresada procesada exitosamente');
    console.log('🔮 === FIN CARTA PROGRESADA ===');
    
    return NextResponse.json(processedData);
    
  } catch (error) {
    console.error('❌ Error en carta progresada:', error);
    
    let errorDetails: any = {
      success: false,
      error: 'Error generando carta progresada',
      timestamp: new Date().toISOString()
    };
    
    if (axios.isAxiosError(error)) {
      errorDetails.details = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      };
      
      console.error('💥 Error de Axios:', errorDetails.details);
    } else if (error instanceof Error) {
      errorDetails.message = error.message;
    }
    
    return NextResponse.json(errorDetails, { 
      status: axios.isAxiosError(error) ? error.response?.status || 500 : 500 
    });
  }
}