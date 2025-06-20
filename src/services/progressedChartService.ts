   try {
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
  const PROKERALA_API_BASE_URL = 'https://api.prokerala.com'; // Reemplaza con la URL base real si es diferente
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
