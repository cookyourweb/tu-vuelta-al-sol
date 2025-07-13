// src/services/progressedChartService.ts - VERSIÓN COMPLETA CORREGIDA
// ✅ URL que funciona para progression charts:
// https://api.prokerala.com/v2/astrology/progression-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4164,-3.7025&profile[birth_time_unknown]=false&progression_year=2025&current_coordinates=40.4164,-3.7025&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=en

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
  console.log(`🌍 Calculando timezone para ${date} en ${timezone}`);
  
  try {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    
    const getLastSunday = (year: number, month: number): Date => {
      const lastDay = new Date(year, month + 1, 0);
      const dayOfWeek = lastDay.getDay();
      const lastSunday = new Date(lastDay);
      lastSunday.setDate(lastDay.getDate() - dayOfWeek);
      return lastSunday;
    };
    
    // Europa Central
    if (timezone === 'Europe/Madrid' || 
        timezone === 'Europe/Berlin' || 
        timezone === 'Europe/Paris' ||
        timezone === 'Europe/Rome') {
      
      const dstStart = getLastSunday(year, 2); // Marzo
      const dstEnd = getLastSunday(year, 9);   // Octubre
      
      dstStart.setUTCHours(2, 0, 0, 0);
      dstEnd.setUTCHours(2, 0, 0, 0);
      
      const offset = (targetDate >= dstStart && targetDate < dstEnd) ? '+02:00' : '+01:00';
      console.log(`✅ Timezone Europa: ${offset}`);
      return offset;
    }
    
    // Zonas fijas
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Mexico_City': '-06:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };
    
    if (staticTimezones[timezone]) {
      console.log(`✅ Timezone fijo: ${staticTimezones[timezone]}`);
      return staticTimezones[timezone];
    }
    
    console.warn(`⚠️ Timezone '${timezone}' no reconocida, usando UTC`);
    return '+00:00';
  } catch (error) {
    console.error('❌ Error calculando timezone:', error);
    return '+00:00';
  }
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
    useCurrentLocation?: boolean; // Nueva opción para ubicación actual vs natal
    currentLatitude?: number;
    currentLongitude?: number;
  } = {}
) {
  console.log('🔮 === GENERANDO CARTA PROGRESADA CON FORMATO CORREGIDO ===');
  console.log('📅 Parámetros:', { 
    birthDate, 
    birthTime, 
    latitude, 
    longitude, 
    timezone, 
    progressionYear,
    useCurrentLocation: options.useCurrentLocation 
  });

  try {
    const token = await getAccessToken();
    
    // Formatear datos EXACTAMENTE como en la URL que funciona
    const formattedBirthTime = birthTime || '12:00:00';
    const offset = calculateTimezoneOffset(birthDate, timezone);
    const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
    
    // Coordenadas natales (siempre para profile[coordinates])
    const natalCoordinates = formatCoordinates(latitude, longitude);
    
    // Coordenadas actuales para carta progresada
    let currentCoordinates = natalCoordinates; // Por defecto usar natal
    
    if (options.useCurrentLocation && options.currentLatitude && options.currentLongitude) {
      currentCoordinates = formatCoordinates(options.currentLatitude, options.currentLongitude);
      console.log('📍 Usando ubicación actual para carta progresada:', currentCoordinates);
    } else {
      console.log('📍 Usando ubicación natal para carta progresada:', currentCoordinates);
    }
    
    console.log('🔧 Datos procesados:', { 
      datetime, 
      natalCoordinates, 
      currentCoordinates, 
      progressionYear 
    });
    
    // ✅ ENDPOINT CORRECTO: progression-chart
    const url = new URL(`${PROKERALA_API_BASE_URL}/astrology/progression-chart`);
    
    // ✅ PARÁMETROS CON FORMATO CORRECTO (igual a tu estructura anterior)
    const params = {
      'profile[datetime]': datetime,
      'profile[coordinates]': natalCoordinates,
      'profile[birth_time_unknown]': 'false', // ← SIN profile[] (corrección crítica)
      'progression_year': progressionYear.toString(),
      'current_coordinates': currentCoordinates,
      'house_system': options.houseSystem || 'placidus',
      'orb': 'default',
      'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
      'aspect_filter': options.aspectFilter || 'all',
      'la': options.language || 'en', // ← Usar 'en' por defecto para progression charts
      // ✅ NO incluir ayanamsa para progression charts (no es requerido según la URL)
    };
    
    // Agregar parámetros a la URL (manteniendo tu estructura)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log('📡 Parámetros carta progresada CORREGIDOS:', params);
    console.log('🌐 URL completa carta progresada CORREGIDA:', url.toString());
    
    // 🚨 CORRECCIÓN CRÍTICA: Usar token en HEADER, no en URL
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,  // ✅ Token en header
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Carta progresada obtenida exitosamente');
    console.log('✅ Respuesta recibida:', {
      status: response.status,
      hasData: !!response.data,
      dataKeys: Object.keys(response.data || {})
    });
    
    if (!response.data) {
      throw new Error('Respuesta inválida de Prokerala - no hay datos');
    }
    
    // 5. Procesar y formatear la respuesta (manteniendo tu estructura)
    return processProgressedChartData(response.data, {
      progressionYear,
      natalLatitude: latitude,
      natalLongitude: longitude,
      currentLatitude: options.currentLatitude || latitude,
      currentLongitude: options.currentLongitude || longitude,
      timezone,
      birthDate,
      birthTime
    });
    
  } catch (error) {
    console.error('❌ Error en llamada a Prokerala para carta progresada:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.response?.status === 401) {
        accessToken = null;
        throw new Error('Error de autenticación con Prokerala');
      } else if (error.response?.status === 429) {
        throw new Error('Límite de solicitudes excedido');
      } else if (error.response && error.response.status !== undefined && error.response.status >= 500) {
        throw new Error('Error del servidor de Prokerala');
      }
    }
    
    throw error;
  }
}

/**
 * Procesar datos de carta progresada de Prokerala
 */
function processProgressedChartData(apiResponse: any, metadata: {
  progressionYear: number;
  natalLatitude: number;
  natalLongitude: number;
  currentLatitude: number;
  currentLongitude: number;
  timezone: string;
  birthDate: string;
  birthTime: string;
}) {
  console.log('🔄 Procesando datos de carta progresada...');
  
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(longitude / 30) % 12];
  };
  
  const translatePlanet = (englishName: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Venus': 'Venus',
      'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno',
      'Uranus': 'Urano', 'Neptune': 'Neptuno', 'Pluto': 'Plutón',
      'Chiron': 'Quirón', 'North Node': 'Nodo Norte', 'South Node': 'Nodo Sur'
    };
    return translations[englishName] || englishName;
  };
  
  // Procesar planetas progresados
  const progressedPlanets = (apiResponse.progressed_planets || []).map((planet: any) => ({
    name: translatePlanet(planet.name || 'Unknown'),
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));
  
  // Procesar casas progresadas
  const progressedHouses = (apiResponse.progressed_houses || []).map((house: any) => ({
    number: house.number || 1,
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: Math.floor((house.longitude || 0) % 30),
    minutes: Math.floor(((house.longitude || 0) % 1) * 60),
    longitude: house.longitude || 0
  }));
  
  // Ascendente progresado
  let progressedAscendant;
  if (apiResponse.progressed_ascendant) {
    progressedAscendant = {
      sign: apiResponse.progressed_ascendant.sign || getSignFromLongitude(apiResponse.progressed_ascendant.longitude || 0),
      degree: Math.floor((apiResponse.progressed_ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.progressed_ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.progressed_ascendant.longitude || 0
    };
  }
  
  // Medio Cielo progresado
  let progressedMidheaven;
  if (apiResponse.progressed_mc) {
    progressedMidheaven = {
      sign: apiResponse.progressed_mc.sign || getSignFromLongitude(apiResponse.progressed_mc.longitude || 0),
      degree: Math.floor((apiResponse.progressed_mc.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.progressed_mc.longitude || 0) % 1) * 60),
      longitude: apiResponse.progressed_mc.longitude || 0
    };
  }
  
  console.log('✅ Datos de carta progresada procesados:', {
    progressedPlanetsCount: progressedPlanets.length,
    progressedAscendantSign: progressedAscendant?.sign,
    progressionYear: metadata.progressionYear
  });
  
  return {
    progressionYear: metadata.progressionYear,
    progressedPlanets,
    progressedHouses,
    progressedAscendant,
    progressedMidheaven,
    natalLocation: {
      latitude: metadata.natalLatitude,
      longitude: metadata.natalLongitude
    },
    currentLocation: {
      latitude: metadata.currentLatitude,
      longitude: metadata.currentLongitude
    },
    timezone: metadata.timezone,
    birthDate: metadata.birthDate,
    birthTime: metadata.birthTime,
    calculatedAt: new Date().toISOString(),
    apiResponse: apiResponse // Guardar respuesta completa para debugging
  };
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
  options: {
    forceRegenerate?: boolean;
    useCurrentLocation?: boolean;
    currentLatitude?: number;
    currentLongitude?: number;
  } = {}
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
        language: 'en', // ✅ Inglés para progression charts
        birthTimeRectification: 'flat-chart',
        useCurrentLocation: options.useCurrentLocation,
        currentLatitude: options.currentLatitude,
        currentLongitude: options.currentLongitude
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
    
    // 3. Probar generación de carta progresada
    const result = await getProgressedChart(
      testData.birthDate,
      testData.birthTime,
      testData.latitude,
      testData.longitude,
      testData.timezone,
      testData.progressionYear
    );
    
    console.log('✅ Test exitoso:', result);
    
    return {
      success: true,
      message: 'Conexión de carta progresada funcionando correctamente',
      details: {
        progressionYear: result.progressionYear,
        planetsCount: result.progressedPlanets?.length || 0,
        ascendantSign: result.progressedAscendant?.sign
      }
    };
    
  } catch (error) {
    console.error('❌ Error en test de carta progresada:', error);
    
    return {
      success: false,
      message: 'Error en test de carta progresada',
      details: {
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    };
  }
}