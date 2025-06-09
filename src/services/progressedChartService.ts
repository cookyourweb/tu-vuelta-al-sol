// src/services/progressedChartService.ts - VERSIÓN COMPLETA CORREGIDA
import axios from 'axios';
import { formatProkeralaDateTime } from '../utils/dateTimeUtils';

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
  
  // ✅ CORRECCIÓN: Usar formato datetime simple sin timezone complejo
  const datetime = `${birthDate}T${birthTime || '12:00:00'}`;
  
  // ✅ CORRECCIÓN: Coordenadas con 4 decimales y corregir separador decimal
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  // ✅ CORRECCIÓN: Formatear datetime con segundos y zona horaria Z
  const datetimeWithSeconds = datetime.length === 16 ? datetime + ':00Z' : datetime;
  
  console.log(`🕒 DateTime formateado: ${datetimeWithSeconds}`);
  console.log(`📍 Coordenadas formateadas: ${coordinates}`);
  
  // ✅ PARÁMETROS CORREGIDOS - Formato directo como natal chart exitosa
  const params = {
    'profile[datetime]': datetimeWithSeconds,
    'profile[coordinates]': coordinates,
    'current_coordinates': coordinates, // Añadido parámetro obligatorio según error API
    'progression_year': progressionYear.toString(),
    'ayanamsa': '0',                        // 🚨 CRÍTICO: Tropical occidental
    'house_system': 'placidus',
    'birth_time_rectification': 'flat-chart',
    'aspect_filter': 'all',
    'la': 'es'
  };

  console.log('📡 Parámetros carta progresada:', params);

  try {
    // ✅ Construir URL
    const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('🌐 URL completa carta progresada:', url.toString());

    // ✅ Hacer la petición
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log(`✅ Carta progresada obtenida exitosamente para año ${progressionYear}`);
    console.log(`📊 Respuesta status: ${response.status}`);
    
    return {
      ...response.data,
      metadata: {
        progressionYear,
        generatedAt: new Date().toISOString(),
        parameters: params,
        correctionApplied: 'simplified datetime format + ayanamsa=0'
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
    
    // 3. Testear parámetros sin hacer la llamada real
    const datetime = `${testData.birthDate}T${testData.birthTime}`;
    const coordinates = `${testData.latitude.toFixed(4)},${testData.longitude.toFixed(4)}`;
    
    console.log('🔍 Parámetros de test preparados:');
    console.log(`  DateTime: ${datetime}`);
    console.log(`  Coordinates: ${coordinates}`);
    console.log(`  Progression Year: ${testData.progressionYear}`);
    
    return {
      success: true,
      message: 'Configuración correcta para carta progresada',
      details: {
        token: token.substring(0, 20) + '...',
        datetime,
        coordinates,
        progressionYear: testData.progressionYear
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
  console.log('🔍 === DEBUGGING: PROGRESADA VS NATAL ===');
  
  const datetime = `${birthDate}T${birthTime}`;
  const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  console.log('📅 Datos base:', {
    birthDate,
    birthTime,
    latitude,
    longitude,
    timezone
  });
  
  console.log('🔄 Formato para progresada:', {
    datetime,
    coordinates,
    progression_year: '2025',
    ayanamsa: '0'
  });
  
  console.log('🌐 URL que se generaría:');
  const testUrl = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
  testUrl.searchParams.append('profile[datetime]', datetime);
  testUrl.searchParams.append('profile[coordinates]', coordinates);
  testUrl.searchParams.append('progression_year', '2025');
  testUrl.searchParams.append('ayanamsa', '0');
  testUrl.searchParams.append('house_system', 'placidus');
  testUrl.searchParams.append('birth_time_rectification', 'flat-chart');
  testUrl.searchParams.append('aspect_filter', 'all');
  testUrl.searchParams.append('la', 'es');
  
  console.log(testUrl.toString());
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