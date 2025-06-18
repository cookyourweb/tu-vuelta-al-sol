// src/utils/prokeralaUtils.ts - UTILIDADES CONSOLIDADAS PARA AGENDA
/**
 * ✅ Utilidades centralizadas para Prokerala API
 * Consolida todas las funciones de transformación necesarias para la agenda
 */

// =============================================================================
// CONFIGURACIÓN Y CONSTANTES
// =============================================================================

export const PROKERALA_CONFIG = {
  API_BASE_URL: 'https://api.prokerala.com/v2',
  TOKEN_ENDPOINT: 'https://api.prokerala.com/token',
  DEFAULT_AYANAMSA: '0',        // ✅ TROPICAL SIEMPRE
  DEFAULT_HOUSE_SYSTEM: 'placidus',
  DEFAULT_LANGUAGE: 'es',
  COORDINATE_PRECISION: 4,
  DEFAULT_TIMEZONE: 'Europe/Madrid'
} as const;

// Cache de token global
let tokenCache: {
  token: string;
  expires: number;
} | null = null;

// =============================================================================
// VALIDACIONES
// =============================================================================

/**
 * ✅ Validar coordenadas geográficas
 */
export function validateCoordinates(latitude: number, longitude: number): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    errors.push(`Latitud inválida: ${latitude}. Debe estar entre -90 y 90`);
  }
  
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.push(`Longitud inválida: ${longitude}. Debe estar entre -180 y 180`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * ✅ Validar datos de nacimiento completos
 */
export function validateBirthData(data: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}): {
  valid: boolean;
  errors: string[];
  corrected?: typeof data;
} {
  const errors: string[] = [];
  
  // Validar fecha
  if (!data.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
    errors.push('Fecha inválida. Formato requerido: YYYY-MM-DD');
  }
  
  // Validar hora
  if (!data.birthTime || !/^\d{2}:\d{2}(:\d{2})?$/.test(data.birthTime)) {
    errors.push('Hora inválida. Formato requerido: HH:MM o HH:MM:SS');
  }
  
  // Validar coordenadas
  const coordValidation = validateCoordinates(data.latitude, data.longitude);
  if (!coordValidation.valid) {
    errors.push(...coordValidation.errors);
  }
  
  // Datos corregidos
  const corrected = {
    ...data,
    birthTime: data.birthTime.length === 5 ? `${data.birthTime}:00` : data.birthTime,
    timezone: data.timezone || PROKERALA_CONFIG.DEFAULT_TIMEZONE
  };
  
  return {
    valid: errors.length === 0,
    errors,
    corrected: errors.length === 0 ? corrected : undefined
  };
}

// =============================================================================
// FORMATEO DE DATOS
// =============================================================================

/**
 * ✅ Formatear coordenadas para Prokerala API (máxima precisión)
 */
export function formatProkeralaCoordinates(
  latitude: number, 
  longitude: number, 
  precision: number = PROKERALA_CONFIG.COORDINATE_PRECISION
): string {
  const validation = validateCoordinates(latitude, longitude);
  if (!validation.valid) {
    throw new Error(`Coordenadas inválidas: ${validation.errors.join(', ')}`);
  }
  
  const lat = Number(latitude).toFixed(precision);
  const lon = Number(longitude).toFixed(precision);
  
  return `${lat},${lon}`;
}

/**
 * ✅ Formatear datetime para Prokerala API (compatible con HL/UT/LMT)
 */
export function formatProkeralaDateTime(
  birthDate: string,
  birthTime: string,
  timezone: string = PROKERALA_CONFIG.DEFAULT_TIMEZONE
): string {
  // Asegurar formato de hora correcto
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  
  // Determinar offset del timezone
  const timezoneOffsets: Record<string, string> = {
    'Europe/Madrid': '+01:00',      // Madrid invierno
    'Europe/London': '+00:00',      // Londres
    'America/New_York': '-05:00',   // Nueva York
    'America/Los_Angeles': '-08:00', // Los Ángeles
    'UTC': '+00:00'
  };
  
  // Detectar horario de verano para Madrid
  const date = new Date(`${birthDate}T${formattedTime}`);
  const month = date.getMonth() + 1; // 1-12
  
  let offset = timezoneOffsets[timezone] || '+01:00';
  
  // Ajustar para horario de verano en Madrid (marzo-octubre)
  if (timezone === 'Europe/Madrid' && month >= 3 && month <= 10) {
    offset = '+02:00';
  }
  
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  
  console.log(`📅 DateTime formateado: ${isoDateTime} (${timezone})`);
  return isoDateTime;
}

/**
 * ✅ Crear parámetros base para cualquier endpoint de Prokerala
 */
export function createProkeralaParams(data: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  options?: {
    ayanamsa?: string;
    houseSystem?: string;
    aspectFilter?: string;
    language?: string;
    birthTimeRectification?: string;
  };
}): Record<string, string> {
  const { birthDate, birthTime, latitude, longitude, timezone, options = {} } = data;
  
  // Validar datos de entrada
  const validation = validateBirthData({ birthDate, birthTime, latitude, longitude, timezone });
  if (!validation.valid) {
    throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
  }
  
  // Formatear componentes
  const datetime = formatProkeralaDateTime(birthDate, birthTime, timezone || PROKERALA_CONFIG.DEFAULT_TIMEZONE);
  const coordinates = formatProkeralaCoordinates(latitude, longitude);
  
  // Parámetros base
  const params = {
    'profile[datetime]': datetime,
    'profile[coordinates]': coordinates,
    'ayanamsa': options.ayanamsa || PROKERALA_CONFIG.DEFAULT_AYANAMSA,
    'house_system': options.houseSystem || PROKERALA_CONFIG.DEFAULT_HOUSE_SYSTEM,
    'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
    'aspect_filter': options.aspectFilter || 'all',
    'la': options.language || PROKERALA_CONFIG.DEFAULT_LANGUAGE
  };
  
  console.log('🔧 Parámetros Prokerala:', {
    datetime,
    coordinates,
    ayanamsa: params.ayanamsa,
    timezone: timezone || PROKERALA_CONFIG.DEFAULT_TIMEZONE
  });
  
  return params;
}

// =============================================================================
// AUTENTICACIÓN
// =============================================================================

/**
 * ✅ Obtener token de acceso (con cache inteligente)
 */
export async function getProkeralaToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Usar token en cache si es válido
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
  // Verificar credenciales
  const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Faltan credenciales de Prokerala en variables de entorno');
  }
  
  try {
    console.log('🔑 Obteniendo token de Prokerala...');
    
    const response = await fetch(PROKERALA_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('Respuesta de token inválida');
    }
    
    // Guardar en cache
    tokenCache = {
      token: data.access_token,
      expires: now + data.expires_in
    };
    
    console.log('✅ Token obtenido exitosamente');
    return tokenCache.token;
    
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw new Error(`Error de autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// =============================================================================
// CONSTRUCCIÓN DE URLS
// =============================================================================

/**
 * ✅ Construir URL completa para endpoint específico
 */
export function buildProkeralaURL(
  endpoint: string,
  params: Record<string, string>
): string {
  const url = new URL(`${PROKERALA_CONFIG.API_BASE_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}

/**
 * ✅ URLs específicas para endpoints de agenda
 */
export const AgendaEndpoints = {
  // Carta natal
  natalChart: (data: Parameters<typeof createProkeralaParams>[0]) => {
    const params = createProkeralaParams(data);
    return buildProkeralaURL('/astrology/natal-aspect-chart', params);
  },
  
  // Carta progresada
  progressedChart: (
    data: Parameters<typeof createProkeralaParams>[0] & { progressionYear: number }
  ) => {
    const params = createProkeralaParams(data);
    params['progression_year'] = data.progressionYear.toString();
    params['current_coordinates'] = params['profile[coordinates]']; // ✅ OBLIGATORIO
    return buildProkeralaURL('/astrology/progression-chart', params);
  },
  
  // Tránsitos
  transitChart: (
    data: Parameters<typeof createProkeralaParams>[0] & { transitDate: string }
  ) => {
    const params = createProkeralaParams(data);
    const transitDatetime = formatProkeralaDateTime(
      data.transitDate, 
      '12:00:00', 
      data.timezone || PROKERALA_CONFIG.DEFAULT_TIMEZONE
    );
    params['transit_datetime'] = transitDatetime;
    params['current_coordinates'] = params['profile[coordinates]'];
    return buildProkeralaURL('/astrology/transit-aspect-chart', params);
  },
  
  // Fases lunares
  moonPhases: (coordinates: string, startDate: string, endDate: string) => {
    const params = {
      'start_date': startDate,
      'end_date': endDate,
      'coordinates': coordinates,
      'ayanamsa': PROKERALA_CONFIG.DEFAULT_AYANAMSA,
      'la': PROKERALA_CONFIG.DEFAULT_LANGUAGE
    };
    return buildProkeralaURL('/astrology/moon-phase', params);
  },
  
  // Retrogradaciones
  retrogradeEvents: (coordinates: string, startDate: string, endDate: string) => {
    const params = {
      'start_date': startDate,
      'end_date': endDate,
      'coordinates': coordinates,
      'ayanamsa': PROKERALA_CONFIG.DEFAULT_AYANAMSA,
      'la': PROKERALA_CONFIG.DEFAULT_LANGUAGE
    };
    return buildProkeralaURL('/astrology/planet-retrograde', params);
  }
};

// =============================================================================
// FUNCIONES DE PETICIÓN
// =============================================================================

/**
 * ✅ Hacer petición a Prokerala con manejo de errores
 */
export async function makeProkeralaRequest(url: string): Promise<any> {
  try {
    const token = await getProkeralaToken();
    
    console.log(`🌐 Petición a: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Petición exitosa');
    return {
      success: true,
      data,
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        status: response.status
      }
    };
    
  } catch (error) {
    console.error(`❌ Error en petición a ${url}:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      metadata: {
        url,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// =============================================================================
// FUNCIONES ESPECÍFICAS PARA AGENDA
// =============================================================================

/**
 * ✅ Obtener carta natal (optimizada para agenda)
 */
export async function getAgendaNatalChart(data: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}): Promise<any> {
  const url = AgendaEndpoints.natalChart(data);
  return makeProkeralaRequest(url);
}

/**
 * ✅ Obtener carta progresada (optimizada para agenda)
 */
export async function getAgendaProgressedChart(data: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  progressionYear: number;
}): Promise<any> {
  const url = AgendaEndpoints.progressedChart(data);
  return makeProkeralaRequest(url);
}

/**
 * ✅ Obtener eventos astrológicos para rango de fechas
 */
export async function getAgendaAstronomicalEvents(
  coordinates: { latitude: number; longitude: number },
  startDate: string,
  endDate: string
): Promise<{
  moonPhases?: any;
  retrogrades?: any;
  success: boolean;
  errors?: string[];
}> {
  const coordString = formatProkeralaCoordinates(coordinates.latitude, coordinates.longitude);
  
  try {
    const [moonPhasesResult, retrogradesResult] = await Promise.allSettled([
      makeProkeralaRequest(AgendaEndpoints.moonPhases(coordString, startDate, endDate)),
      makeProkeralaRequest(AgendaEndpoints.retrogradeEvents(coordString, startDate, endDate))
    ]);
    
    const result: any = { success: true };
    const errors: string[] = [];
    
    if (moonPhasesResult.status === 'fulfilled' && moonPhasesResult.value.success) {
      result.moonPhases = moonPhasesResult.value.data;
    } else {
      errors.push('Error obteniendo fases lunares');
    }
    
    if (retrogradesResult.status === 'fulfilled' && retrogradesResult.value.success) {
      result.retrogrades = retrogradesResult.value.data;
    } else {
      errors.push('Error obteniendo retrogradaciones');
    }
    
    if (errors.length > 0) {
      result.errors = errors;
    }
    
    return result;
    
  } catch (error) {
    return {
      success: false,
      errors: [`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`]
    };
  }
}

// =============================================================================
// UTILIDADES DE DEBUGGING
// =============================================================================

/**
 * ✅ Test de conectividad con datos de ejemplo
 */
export async function testProkeralaConnection(): Promise<{
  success: boolean;
  results: any[];
  errors: string[];
}> {
  const testData = {
    birthDate: '1974-02-10',
    birthTime: '07:30:00',
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: 'Europe/Madrid'
  };
  
  console.log('🧪 Iniciando test de conectividad Prokerala...');
  
  const tests = [
    { name: 'Carta Natal', fn: () => getAgendaNatalChart(testData) },
    { name: 'Carta Progresada', fn: () => getAgendaProgressedChart({ ...testData, progressionYear: 2025 }) },
    { name: 'Eventos Astronómicos', fn: () => getAgendaAstronomicalEvents(testData, '2025-01-01', '2025-12-31') }
  ];
  
  const results: any[] = [];
  const errors: string[] = [];
  
  for (const test of tests) {
    try {
      console.log(`🔄 Ejecutando test: ${test.name}...`);
      const result = await test.fn();
      results.push({ test: test.name, result });
      
      if (result.success) {
        console.log(`✅ ${test.name} exitoso`);
      } else {
        console.log(`❌ ${test.name} falló:`, result.error);
        errors.push(`${test.name}: ${result.error}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      console.log(`❌ ${test.name} excepción:`, errorMsg);
      errors.push(`${test.name}: ${errorMsg}`);
    }
  }
  
  return {
    success: errors.length === 0,
    results,
    errors
  };
}

// =============================================================================
// EXPORTACIONES
// =============================================================================

const prokeralaUtils = {
  // Configuración
  PROKERALA_CONFIG,
  
  // Validaciones
  validateCoordinates,
  validateBirthData,
  
  // Formateo
  formatProkeralaCoordinates,
  formatProkeralaDateTime,
  createProkeralaParams,
  
  // Autenticación
  getProkeralaToken,
  
  // URLs
  buildProkeralaURL,
  AgendaEndpoints,
  
  // Peticiones
  makeProkeralaRequest,
  
  // Funciones específicas para agenda
  getAgendaNatalChart,
  getAgendaProgressedChart,
  getAgendaAstronomicalEvents,
  
  // Testing
  testProkeralaConnection
};

export default prokeralaUtils;