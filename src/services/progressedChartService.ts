// src/services/progressedChartService.ts - VERSIÓN COMPLETA CORREGIDA
// ✅ URL de ejemplo que funciona correctamente:
// https://api.prokerala.com/v2/astrology/natal-planet-position?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&la=es&ayanamsa=0

import axios from 'axios';

// Constantes para la API de Prokerala
const PROKERALA_API_BASE_URL = process.env.NEXT_PUBLIC_PROKERALA_API_BASE_URL || 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = process.env.NEXT_PUBLIC_PROKERALA_TOKEN_ENDPOINT || 'https://api.prokerala.com/token';

// Obtener claves de las variables de entorno
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Almacén de token en memoria
interface AccessToken {
  token: string;
  expires: number; // timestamp
}

let accessToken: AccessToken | null = null;

/**
 * Obtiene un token de acceso válido para la API de Prokerala
 */
export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (accessToken && accessToken.expires > now + 60) {
    return accessToken.token;
  }

  try {
    console.log('🔑 Obteniendo nuevo token de Prokerala...');
    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID || '',
        'client_secret': CLIENT_SECRET || '',
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

    accessToken = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };

    console.log('✅ Token de Prokerala obtenido exitosamente');
    return accessToken.token;
  } catch (error) {
    console.error('❌ Error obteniendo token de acceso de Prokerala:', error);
    throw new Error('No se pudo autenticar con la API de Prokerala');
  }
}

/**
 * ✅ FUNCIÓN CORREGIDA: Calcular timezone offset correcto según fecha
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  // Función auxiliar para obtener el último domingo de un mes
  const getLastSunday = (year: number, month: number): number => {
    const lastDay = new Date(year, month, 0);
    const dayOfWeek = lastDay.getDay();
    return lastDay.getDate() - dayOfWeek;
  };
  
  if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin' || timezone === 'Europe/Paris') {
    // Europa Central: Horario de verano desde último domingo de marzo hasta último domingo de octubre
    const dstStart = new Date(year, 2, getLastSunday(year, 3)); // Marzo
    const dstEnd = new Date(year, 9, getLastSunday(year, 10)); // Octubre
    
    if (birthDate >= dstStart && birthDate < dstEnd) {
      return '+02:00'; // CEST (Verano)
    } else {
      return '+01:00'; // CET (Invierno)
    }
  }
  
  // Zonas sin cambio de horario
  const staticTimezones: Record<string, string> = {
    'America/Argentina/Buenos_Aires': '-03:00',
    'America/Bogota': '-05:00',
    'America/Lima': '-05:00',
    'Asia/Tokyo': '+09:00',
    'UTC': '+00:00'
  };
  
  return staticTimezones[timezone] || '+00:00';
}

/**
 * ✅ FUNCIÓN CORREGIDA: Formatear coordenadas con precisión correcta
 */
function formatCoordinates(lat: number, lng: number): string {
  // Redondear a 4 decimales para Prokerala
  const latFixed = Math.round(lat * 10000) / 10000;
  const lngFixed = Math.round(lng * 10000) / 10000;
  return `${latFixed},${lngFixed}`;
}

/**
 * 🌟 FUNCIÓN CORREGIDA: Obtiene la carta progresada con parámetros exactos
 */
export async function getProgressedChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear: number,
  options: {
    houseSystem?: string;
    aspectFilter?: string;
    language?: string;
    ayanamsa?: string;
    birthTimeRectification?: string;
  } = {}
): Promise<any> {
  console.log(`🔮 Generando carta progresada para año: ${progressionYear}`);
  console.log(`📅 Datos: ${birthDate} ${birthTime} (${latitude}, ${longitude})`);
  
  const token = await getAccessToken();
  
  // ✅ CORREGIDO: Usar función mejorada de timezone
  const offset = calculateTimezoneOffset(birthDate, timezone);
  const datetime = `${birthDate}T${birthTime || '12:00:00'}${offset}`;
  
  // ✅ CORREGIDO: Formatear coordenadas con precisión correcta
  const coordinates = formatCoordinates(latitude, longitude);
  
  console.log(`🕒 DateTime formateado: ${datetime}`);
  console.log(`📍 Coordenadas formateadas: ${coordinates}`);
  
  // ✅ PARÁMETROS CORREGIDOS - Usar formato profile[] exactamente como natal chart exitosa
  const params = {
    'profile[datetime]': datetime,              // ✅ CORREGIDO: formato profile[]
    'profile[coordinates]': coordinates,        // ✅ CORREGIDO: formato profile[]
    'current_coordinates': coordinates,         // Parámetro obligatorio para progresiones
    'progression_year': progressionYear.toString(),
    'ayanamsa': options.ayanamsa || '0',       // 🚨 CRÍTICO: Tropical occidental
    'house_system': options.houseSystem || 'placidus',
    'birth_time_rectification': options.birthTimeRectification || 'flat-chart', // ✅ CORREGIDO
    'aspect_filter': options.aspectFilter || 'all',
    'la': options.language || 'es'
  };

  console.log('📡 Parámetros carta progresada CORREGIDOS:', params);

  try {
    // ✅ Construir URL
    const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('🌐 URL completa carta progresada CORREGIDA:', url.toString());

    // ✅ Hacer la petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log(`✅ Carta progresada obtenida exitosamente para año ${progressionYear}`);
    console.log(`📊 Respuesta status: ${response.status}`);
    console.log('📊 Datos de respuesta preview:', {
      planetsCount: response.data?.planets?.length || 0,
      housesCount: response.data?.houses?.length || 0,
      aspectsCount: response.data?.aspects?.length || 0,
      hasAscendant: !!response.data?.ascendant
    });
    
    return {
      ...response.data,
      metadata: {
        progressionYear,
        generatedAt: new Date().toISOString(),
        parameters: params,
        correctionApplied: 'profile[datetime] format + ayanamsa=0 + timezone corrected'
      }
    };

  } catch (error) {
    console.error('❌ Error obteniendo carta progresada:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error de Prokerala:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // ✅ CORRECCIÓN: Usar parámetros locales para debugging
      if (error.response?.status === 400) {
        console.error('❌ Error 400: Parámetros incorrectos');
        console.error('🔍 Verificar formato datetime:', params['profile[datetime]']);
        console.error('🔍 Verificar coordenadas:', params['profile[coordinates]']);
        console.error('🔍 Verificar año progresión:', params['progression_year']);
        
        // ✅ Información adicional de debugging
        if (error.response?.data?.errors) {
          console.error('📋 Errores detallados de Prokerala:', error.response.data.errors);
        }
      }
      
      if (error.response?.status === 401) {
        console.error('❌ Error 401: Token inválido, limpiando cache...');
        accessToken = null;
      }
    }
    
    throw new Error(`Error generando carta progresada para año ${progressionYear}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * 🗓️ FUNCIÓN: Calcular próximo cumpleaños de cualquier usuario
 */
export function calculateUserProgressionPeriod(birthDate: Date | string) {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  const birthMonth = birth.getMonth(); // 0-11
  const birthDay = birth.getDate(); // 1-31
  
  // Calcular próximo cumpleaños
  let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  
  // Si ya pasó este año, usar el próximo año
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
  }
  
  // Calcular cumpleaños siguiente (fin del período)
  const followingBirthday = new Date(nextBirthday.getFullYear() + 1, birthMonth, birthDay);
  
  // Formatear fechas para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };
  
  const daysUntilStart = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isActive = today >= nextBirthday && today <= followingBirthday;
  
  return {
    startDate: nextBirthday,
    endDate: followingBirthday,
    startYear: nextBirthday.getFullYear(),
    endYear: followingBirthday.getFullYear(),
    description: `${formatDate(nextBirthday)} - ${formatDate(followingBirthday)}`,
    shortDescription: `${nextBirthday.getFullYear()}-${followingBirthday.getFullYear()}`,
    daysUntilStart,
    isCurrentPeriod: isActive,
    status: isActive ? 'current' : (daysUntilStart > 0 ? 'future' : 'past') as 'current' | 'future' | 'past'
  };
}

/**
 * 🔄 FUNCIÓN PRINCIPAL: Generar carta progresada completa para un usuario
 */
export async function generateUserProgressedChart(
  userId: string,
  birthData: {
    birthDate: Date | string;
    birthTime?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  },
  forceRegenerate: boolean = false
) {
  try {
    console.log(`👤 Generando carta progresada para usuario: ${userId}`);
    
    // 1. Calcular período personalizado del usuario
    const progressionPeriod = calculateUserProgressionPeriod(birthData.birthDate);
    
    console.log(`📅 Período calculado: ${progressionPeriod.description}`);
    console.log(`🎯 Año objetivo: ${progressionPeriod.startYear}`);
    console.log(`📊 Estado: ${progressionPeriod.status}`);
    
    // 2. Preparar datos para la API
    const birthDateStr = typeof birthData.birthDate === 'string' 
      ? birthData.birthDate 
      : birthData.birthDate.toISOString().split('T')[0];
    
    const birthTimeStr = birthData.birthTime || '12:00:00';
    
    console.log(`🕒 Datos preparados: ${birthDateStr} ${birthTimeStr}`);
    
    // 3. Generar carta progresada con parámetros corregidos
    const progressedChart = await getProgressedChart(
      birthDateStr,
      birthTimeStr,
      birthData.latitude,
      birthData.longitude,
      birthData.timezone,
      progressionPeriod.startYear, // ⭐ AÑO DINÁMICO POR USUARIO
      {
        houseSystem: 'placidus',
        aspectFilter: 'all',
        language: 'es',
        ayanamsa: '0', // 🚨 CRÍTICO: Tropical occidental
        birthTimeRectification: 'flat-chart'
      }
    );
    
    console.log(`✅ Carta progresada generada exitosamente para ${userId}`);
    
    return {
      period: progressionPeriod,
      chart: progressedChart,
      success: true,
      message: `Carta progresada generada para período ${progressionPeriod.shortDescription}`
    };
    
  } catch (error) {
    console.error(`❌ Error generando carta progresada para usuario ${userId}:`, error);
    
    // ✅ Información específica del error para debugging
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`💥 Detalle del error: ${errorMessage}`);
    
    throw new Error(`Error al generar carta progresada: ${errorMessage}`);
  }
}

/**
 * 🧪 FUNCIÓN DE TESTING: Verificar configuración
 */
export async function testProgressedChartConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🧪 Testeando conexión carta progresada...');
    
    // 1. Verificar token
    const token = await getAccessToken();
    console.log('✅ Token obtenido correctamente');
    
    // 2. Datos de prueba (Verónica - datos verificados)
    const testData = {
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      latitude: 40.4164,
      longitude: -3.7025,
      timezone: 'Europe/Madrid',
      progressionYear: 2025
    };
    
    // 3. Testear parámetros corregidos
    const datetime = `${testData.birthDate}T${testData.birthTime}`;
    const offset = calculateTimezoneOffset(testData.birthDate, testData.timezone);
    const formattedDateTime = `${datetime}${offset}`;
    const coordinates = formatCoordinates(testData.latitude, testData.longitude);
    
    console.log('🔍 Parámetros de test CORREGIDOS:');
    console.log(`  DateTime: ${formattedDateTime}`);
    console.log(`  Coordinates: ${coordinates}`);
    console.log(`  Progression Year: ${testData.progressionYear}`);
    console.log(`  Ayanamsa: 0 (Tropical)`);
    
    return {
      success: true,
      message: 'Configuración CORREGIDA para carta progresada',
      details: {
        token: token.substring(0, 20) + '...',
        datetime: formattedDateTime,
        coordinates,
        progressionYear: testData.progressionYear,
        ayanamsa: '0',
        correctionApplied: 'profile[datetime] format + timezone calculation + ayanamsa=0'
      }
    };
    
  } catch (error) {
    console.error('❌ Error en test de carta progresada:', error);
    
    return {
      success: false,
      message: `Error en configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      details: error
    };
  }
}

/**
 * 🔍 FUNCIÓN DE DEBUGGING: Comparar con carta natal exitosa
 */
export async function debugProgressedVsNatal(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  console.log('🔍 === DEBUGGING: PROGRESADA VS NATAL CORREGIDO ===');
  
  const offset = calculateTimezoneOffset(birthDate, timezone);
  const datetime = `${birthDate}T${birthTime}${offset}`;
  const coordinates = formatCoordinates(latitude, longitude);
  
  console.log('📅 Datos base:', {
    birthDate,
    birthTime,
    latitude,
    longitude,
    timezone
  });
  
  console.log('🔄 Formato CORREGIDO para progresada:', {
    'profile[datetime]': datetime,
    'profile[coordinates]': coordinates,
    'progression_year': '2025',
    'ayanamsa': '0',
    'birth_time_rectification': 'flat-chart'
  });
  
  console.log('🌐 URL CORREGIDA que se generaría:');
  const testUrl = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
  testUrl.searchParams.append('profile[datetime]', datetime);
  testUrl.searchParams.append('profile[coordinates]', coordinates);
  testUrl.searchParams.append('current_coordinates', coordinates);
  testUrl.searchParams.append('progression_year', '2025');
  testUrl.searchParams.append('ayanamsa', '0');
  testUrl.searchParams.append('house_system', 'placidus');
  testUrl.searchParams.append('birth_time_rectification', 'flat-chart');
  testUrl.searchParams.append('aspect_filter', 'all');
  testUrl.searchParams.append('la', 'es');
  
  console.log(testUrl.toString());
  console.log('✅ Esta URL debería funcionar igual que la natal chart');
  console.log('🔍 === FIN DEBUGGING ===');
}

// Exportar también las interfaces (mantener compatibilidad)
export interface ProkeralaNatalChartResponse {
  datetime: string;
  planets?: any[];
  houses?: any[];
  aspects?: any[];
  ascendant?: any;
  mc?: any;
}

export interface NatalChart {
  birthData: {
    latitude: number;
    longitude: number;
    timezone: string;
    datetime: string;
  };
  planets: any[];
  houses: any[];
  aspects: any[];
  ascendant?: any;
  midheaven?: any;
  latitude: number;
  longitude: number;
  timezone: string;
}