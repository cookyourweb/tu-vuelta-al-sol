// src/utils/dateTimeUtils.ts - VERSIÓN SIMPLIFICADA QUE FUNCIONA

/**
 * 🚨 FUNCIÓN PRINCIPAL CORREGIDA: Formatear datetime para Prokerala
 * Esta función resuelve el problema del ascendente de Verónica
 */
export function formatProkeralaDateTime(
  birthDate: string, 
  birthTime: string, 
  timezone: string = 'Europe/Madrid'
): string {
  // Asegurar formato HH:MM:SS
  const formattedTime = birthTime.length === 5 ? `${birthTime}:00` : birthTime;
  
  // 🔥 CORRECCIÓN CRÍTICA: Obtener offset correcto para la fecha específica
  const offset = getCorrectTimezoneOffset(birthDate, timezone);
  
  // Formato ISO 8601 para Prokerala
  const isoDateTime = `${birthDate}T${formattedTime}${offset}`;
  
  console.log(`📅 DateTime para Prokerala:`, {
    input: { birthDate, birthTime, timezone },
    output: isoDateTime
  });
  
  return isoDateTime;
}

/**
 * 🕐 Obtener offset correcto basado en fecha y timezone
 * ✅ ESTA FUNCIÓN RESUELVE EL PROBLEMA DEL ASCENDENTE
 */
function getCorrectTimezoneOffset(birthDate: string, timezone: string): string {
  const year = parseInt(birthDate.split('-')[0]);
  const month = parseInt(birthDate.split('-')[1]);
  
  // Mapeo de offsets por timezone y época
  const timezoneOffsets: Record<string, { winter: string; summer: string }> = {
    'Europe/Madrid': { winter: '+01:00', summer: '+02:00' },
    'Europe/London': { winter: '+00:00', summer: '+01:00' },
    'Europe/Paris': { winter: '+01:00', summer: '+02:00' },
    'Europe/Berlin': { winter: '+01:00', summer: '+02:00' },
    'America/New_York': { winter: '-05:00', summer: '-04:00' },
    'America/Los_Angeles': { winter: '-08:00', summer: '-07:00' },
    'America/Mexico_City': { winter: '-06:00', summer: '-05:00' },
    'America/Argentina/Buenos_Aires': { winter: '-03:00', summer: '-03:00' },
    'America/Bogota': { winter: '-05:00', summer: '-05:00' },
    'America/Lima': { winter: '-05:00', summer: '-05:00' },
    'UTC': { winter: '+00:00', summer: '+00:00' }
  };
  
  const tzInfo = timezoneOffsets[timezone] || timezoneOffsets['UTC'];
  
  // Determinar si es verano (aproximación simple pero efectiva)
  let isSummer = false;
  
  if (timezone.startsWith('Europe/')) {
    // Europa: DST de abril a octubre (aproximación)
    isSummer = month >= 4 && month <= 10;
  } else if (timezone.startsWith('America/') && !timezone.includes('Argentina') && !timezone.includes('Bogota') && !timezone.includes('Lima')) {
    // América del Norte: DST de abril a octubre
    isSummer = month >= 4 && month <= 10;
  }
  
  const offset = isSummer ? tzInfo.summer : tzInfo.winter;
  
  console.log(`🕐 Timezone ${timezone} en ${birthDate}:`, {
    month,
    isSummer,
    offset,
    season: isSummer ? 'Verano/DST' : 'Invierno/Estándar'
  });
  
  return offset;
}

/**
 * 🧪 Función de prueba específica para Verónica
 */
export function testVeronicaDateTime(): string {
  const result = formatProkeralaDateTime('1974-02-10', '07:30:00', 'Europe/Madrid');
  
  console.log('🧪 PRUEBA VERÓNICA:');
  console.log(`Input: 10 febrero 1974, 07:30, Madrid`);
  console.log(`Output: ${result}`);
  console.log(`Esperado: 1974-02-10T07:30:00+01:00`);
  console.log(`✅ Correcto:`, result === '1974-02-10T07:30:00+01:00');
  
  return result;
}

/**
 * 🧪 Casos de prueba críticos
 */
export const CRITICAL_TEST_CASES = {
  veronica: {
    input: {
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      timezone: 'Europe/Madrid'
    },
    expected: '1974-02-10T07:30:00+01:00',
    notes: '10 febrero 1974 = invierno = CET = +01:00'
  },
  madridSummer: {
    input: {
      birthDate: '2023-07-15',
      birthTime: '14:30:00',
      timezone: 'Europe/Madrid'
    },
    expected: '2023-07-15T14:30:00+02:00',
    notes: '15 julio 2023 = verano = CEST = +02:00'
  },
  argentina: {
    input: {
      birthDate: '1990-12-25',
      birthTime: '10:00:00',
      timezone: 'America/Argentina/Buenos_Aires'
    },
    expected: '1990-12-25T10:00:00-03:00',
    notes: 'Argentina no cambia horario = -03:00 siempre'
  }
};

/**
 * 🧪 Ejecutar todas las pruebas
 */
export function runAllTimezoneTests(): boolean {
  console.log('🧪 === EJECUTANDO PRUEBAS DE TIMEZONE ===');
  
  let allPassed = true;
  
  for (const [testName, testCase] of Object.entries(CRITICAL_TEST_CASES)) {
    const result = formatProkeralaDateTime(
      testCase.input.birthDate,
      testCase.input.birthTime,
      testCase.input.timezone
    );
    
    const passed = result === testCase.expected;
    allPassed = allPassed && passed;
    
    console.log(`\n📋 Test: ${testName}`);
    console.log(`📅 Input: ${testCase.input.birthDate} ${testCase.input.birthTime} ${testCase.input.timezone}`);
    console.log(`📤 Result: ${result}`);
    console.log(`📋 Expected: ${testCase.expected}`);
    console.log(`${passed ? '✅' : '❌'} Status: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`📝 Notes: ${testCase.notes}`);
  }
  
  console.log(`\n🏆 === RESULTADO FINAL ===`);
  console.log(`${allPassed ? '✅' : '❌'} Todas las pruebas: ${allPassed ? 'PASARON' : 'FALLARON'}`);
  
  return allPassed;
}

/**
 * Validar coordenadas
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

/**
 * Formatear coordenadas para Prokerala
 */
export function formatProkeralaCoordinates(
  latitude: number, 
  longitude: number, 
  precision: number = 4
): string {
  if (!validateCoordinates(latitude, longitude)) {
    throw new Error(`Coordenadas inválidas: ${latitude}, ${longitude}`);
  }
  
  const lat = latitude.toFixed(precision);
  const lon = longitude.toFixed(precision);
  
  return `${lat},${lon}`;
}

/**
 * Interfaz para parámetros de Prokerala
 */
export interface ProkeralaParams {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  houseSystem?: string;
  aspectFilter?: string;
  language?: string;
  ayanamsa?: string;
  birthTimeUnknown?: boolean;
  birthTimeRectification?: string;
  orb?: string;
}

/**
 * ✅ Crear parámetros para Prokerala API
 */
export function createProkeralaParams(params: ProkeralaParams): URLSearchParams {
  const {
    birthDate,
    birthTime,
    latitude,
    longitude,
    timezone = 'Europe/Madrid',
    houseSystem = 'placidus',
    aspectFilter = 'all',
    language = 'es',
    ayanamsa = '0', // 🚨 CRÍTICO: Siempre tropical
    birthTimeUnknown = false,
    birthTimeRectification = 'flat-chart',
    orb = 'default'
  } = params;

  // ✅ USAR FUNCIONES CORREGIDAS
  const formattedDateTime = formatProkeralaDateTime(birthDate, birthTime, timezone);
  const formattedCoordinates = formatProkeralaCoordinates(latitude, longitude);

  // Crear parámetros exactos como en Postman
  const urlParams = new URLSearchParams({
    'profile[datetime]': formattedDateTime,
    'profile[coordinates]': formattedCoordinates,
    'birth_time_unknown': birthTimeUnknown.toString(),
    'house_system': houseSystem,
    'orb': orb,
    'birth_time_rectification': birthTimeRectification,
    'aspect_filter': aspectFilter,
    'la': language,
    'ayanamsa': ayanamsa
  });

  console.log('🔧 Parámetros Prokerala:', {
    datetime: formattedDateTime,
    coordinates: formattedCoordinates,
    timezone,
    ayanamsa
  });

  return urlParams;
}

/**
 * Utilidades de Prokerala
 */
export const ProkeralaUtils = {
  // Para carta natal
  natalChart: (params: ProkeralaParams) => {
    return createProkeralaParams({
      ...params,
      aspectFilter: 'all',
      ayanamsa: '0'
    });
  },

  // Test directo de Verónica
  testVeronica: () => {
    const params = createProkeralaParams({
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      latitude: 40.4164,
      longitude: -3.7025,
      timezone: 'Europe/Madrid'
    });
    
    const datetime = params.get('profile[datetime]');
    console.log('🧪 Verónica params test:', { datetime });
    
    return datetime === '1974-02-10T07:30:00+01:00';
  }
};