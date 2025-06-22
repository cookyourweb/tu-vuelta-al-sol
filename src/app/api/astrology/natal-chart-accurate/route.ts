// src/app/api/astrology/natal-chart-accurate/route.ts - VERSIÓN CORREGIDA FINAL
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// API configuration
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Token cache
let tokenCache: { token: string; expires: number } | null = null;

/**
 * Get access token for Prokerala API
 */
async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Prokerala API credentials missing');
  }
  
  try {
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
      throw new Error('Invalid token response from Prokerala');
    }
    
    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };
    
    return tokenCache.token;
  } catch (error) {
    console.error('Error getting Prokerala token:', error);
    throw new Error('Authentication failed with Prokerala API');
  }
}

/**
 * 🔥 FUNCIÓN CRÍTICA - Limpiar y formatear datetime correctamente
 */
function cleanAndFormatDateTime(
  birthDate: string,
  birthTime?: string,
  timezone: string = 'Europe/Madrid'
): string {
  console.log('🔧 LIMPIANDO FECHA:', { birthDate, birthTime, timezone });
  
  // ✅ LIMPIAR FECHA MALFORMADA
  let cleanDate = birthDate;
  
  // Si viene como '1974-02-10T00:00:00.000ZT07:30Europe/Madrid'
  if (cleanDate.includes('T00:00:00.000Z')) {
    // Extraer solo la fecha: '1974-02-10'
    cleanDate = cleanDate.split('T')[0];
    console.log('🔧 Fecha limpiada:', cleanDate);
  }
  
  // ✅ FORMATEAR HORA
  let cleanTime = birthTime || '12:00:00';
  if (cleanTime.length === 5) {
    cleanTime = `${cleanTime}:00`;
  }
  
  // ✅ CONSTRUIR DATETIME ISO CON ZONA HORARIA
  const offset = '+01:00'; // Madrid estándar para fechas históricas
  const isoDateTime = `${cleanDate}T${cleanTime}${offset}`;
  
  console.log('🔧 DateTime final:', isoDateTime);
  
  return isoDateTime;
}

/**
 * Convert longitude to sign name
 */
function getSignNameFromLongitude(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

/**
 * Translate planet names to Spanish
 */
function translatePlanetNameToSpanish(englishName: string): string {
  const translations: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'Uranus': 'Urano',
    'Neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'Chiron': 'Quirón',
    'North Node': 'Nodo Norte',
    'South Node': 'Nodo Sur',
    'Lilith': 'Lilith'
  };
  
  return translations[englishName] || englishName;
}

/**
 * 🔥 POST PRINCIPAL - COMPLETAMENTE CORREGIDO
 */
export async function POST(request: NextRequest) {
  console.log('\n🚨 EJECUTANDO /api/astrology/natal-chart-accurate (CORREGIDO)');
  console.log('🕐 Timestamp:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos RAW:', body);
    
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // ✅ VALIDACIONES
    if (!birthDate || latitude === undefined || longitude === undefined) {
      console.error('❌ Faltan parámetros requeridos');
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    try {
      const token = await getToken();
      console.log('✅ Token obtenido');
      
      // ✅ LIMPIAR Y FORMATEAR FECHA
      const datetime = cleanAndFormatDateTime(birthDate, birthTime, timezone || 'Europe/Madrid');
      const coords = `${latitude},${longitude}`;
      
      console.log('🔥 PARÁMETROS FINALES PARA PROKERALA:');
      console.log('   DateTime:', datetime);
      console.log('   Coordinates:', coords);
      
      // ✅ CONSTRUIR URL CON PARÁMETROS CORRECTOS
      const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', coords);
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '1'); // ✅ SIDERAL (Lahiri)
      
      console.log('🔗 URL FINAL:', url.toString());
      
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ Respuesta Prokerala status:', response.status);
      console.log('📊 Datos recibidos:', Object.keys(response.data));
      
      // ✅ PROCESAR RESPUESTA COMPLETA
      const chartData = processCompleteChartData(response.data, latitude, longitude, timezone || 'Europe/Madrid');
      
      // ✅ VERIFICACIÓN ESPECÍFICA DE VERÓNICA
      if (birthDate.includes('1974-02-10') && Math.abs(latitude - 40.4168) < 0.01) {
        const sol = chartData.planets?.find(p => p.name === 'Sol');
        const luna = chartData.planets?.find(p => p.name === 'Luna');
        
        console.log('\n🎯 VERIFICACIÓN VERÓNICA:');
        console.log(`   Sol: ${sol?.sign} ${sol?.degree}° (esperado: Acuario 21°)`);
        console.log(`   Luna: ${luna?.sign} ${luna?.degree}° (esperado: Libra 6°)`);
        console.log(`   ASC: ${chartData.ascendant?.sign} ${chartData.ascendant?.degree}° (esperado: Acuario 4°)`);
        
        const isCorrect = sol?.sign === 'Acuario' && luna?.sign === 'Libra' && chartData.ascendant?.sign === 'Acuario';
        console.log(`🎯 VERIFICACIÓN: ${isCorrect ? '✅ CORRECTOS' : '❌ INCORRECTOS'}`);
      }
      
      return NextResponse.json({
        success: true,
        data: chartData,
        debug: {
          originalInput: body,
          cleanedDateTime: datetime,
          coordinates: coords,
          timezone: timezone || 'Europe/Madrid',
          version: 'accurate-corrected-sideral'
        }
      });
      
    } catch (apiError) {
      console.error('🔥 Error API Prokerala:', apiError);
      
      if (axios.isAxiosError(apiError) && apiError.response) {
        console.error('🔥 Detalles error:', {
          status: apiError.response.status,
          data: apiError.response.data
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error processing request', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * ✅ PROCESAR DATOS COMPLETOS DE LA API
 */
function processCompleteChartData(apiResponse: unknown, latitude: number, longitude: number, timezone: string) {
  const data = apiResponse as any;

  console.log('🔥 Procesando datos completos:', Object.keys(data));

  // Process planets with Spanish names
  const planets = (data.planets || []).map((planet: unknown) => {
    const p = planet as any;
    return {
      name: translatePlanetNameToSpanish(p.name),
      sign: p.sign || getSignNameFromLongitude(p.longitude),
      degree: Math.floor(p.longitude % 30),
      minutes: Math.floor((p.longitude % 1) * 60),
      retrograde: p.is_retrograde || false,
      housePosition: p.house || 1,
      longitude: p.longitude
    };
  });

  // Process houses
  const houses = (data.houses || []).map((house: unknown, index: number) => {
    const h = house as any;
    return {
      number: index + 1,
      sign: h.sign || getSignNameFromLongitude(h.longitude),
      degree: Math.floor(h.longitude % 30),
      minutes: Math.floor((h.longitude % 1) * 60),
      longitude: h.longitude
    };
  });

  // Process aspects (incluir todos los aspectos)
  const aspects = (data.aspects || []).map((aspect: unknown) => {
    const a = aspect as any;
    return {
      planet1: a.planet1?.name ? translatePlanetNameToSpanish(a.planet1.name) : '',
      planet2: a.planet2?.name ? translatePlanetNameToSpanish(a.planet2.name) : '',
      type: a.aspect?.name || a.type || 'conjunction',
      orb: a.orb || 0,
      applying: a.applying || false
    };
  });

  // Extract ascendant
  let ascendant;
  if (data.ascendant || data.asc || (data.houses && data.houses[0])) {
    const ascData = data.ascendant || data.asc || data.houses[0];
    ascendant = {
      sign: ascData.sign || getSignNameFromLongitude(ascData.longitude),
      degree: Math.floor(ascData.longitude % 30),
      minutes: Math.floor((ascData.longitude % 1) * 60),
      longitude: ascData.longitude
    };
    console.log('🔥 ASCENDENTE PROCESADO:', ascendant);
  }

  // Extract midheaven
  let midheaven;
  if (data.mc || data.midheaven || (data.houses && data.houses[9])) {
    const mcData = data.mc || data.midheaven || data.houses[9];
    midheaven = {
      sign: mcData.sign || getSignNameFromLongitude(mcData.longitude),
      degree: Math.floor(mcData.longitude % 30),
      minutes: Math.floor((mcData.longitude % 1) * 60),
      longitude: mcData.longitude
    };
  }

  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  const result = {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: data.datetime || ''
    },
    planets,
    houses,
    aspects, // ✅ INCLUIR ASPECTOS
    ascendant,
    midheaven,
    elementDistribution,
    modalityDistribution,
    latitude,
    longitude,
    timezone,
    // ✅ DATOS ADICIONALES COMPLETOS
    wheelChart: {
      planets,
      houses,
      aspects,
      ascendant,
      midheaven
    },
    interpretations: {
      personality: generatePersonalityInterpretation(planets, ascendant),
      relationships: generateRelationshipInterpretation(planets, aspects),
      career: generateCareerInterpretation(planets, houses, midheaven)
    }
  };

  console.log('🔥 RESULTADO COMPLETO CON WHEEL CHART:', Object.keys(result));

  return result;
}

/**
 * Calculate element distribution
 */
function calculateElementDistribution(planets: unknown[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
    const element = elementMap[planet.sign];
    if (element) {
      counts[element as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) {
    return { fire: 25, earth: 25, air: 25, water: 25 };
  }
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

/**
 * Calculate modality distribution
 */
function calculateModalityDistribution(planets: unknown[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
    const modality = modalityMap[planet.sign];
    if (modality) {
      counts[modality as keyof typeof counts]++;
      total++;
    }
  });
  
  if (total === 0) {
    return { cardinal: 33, fixed: 33, mutable: 34 };
  }
  
  return {
    cardinal: Math.round((counts.cardinal / total) * 100),
    fixed: Math.round((counts.fixed / total) * 100),
    mutable: Math.round((counts.mutable / total) * 100)
  };
}

/**
 * Generate basic personality interpretation
 */
function generatePersonalityInterpretation(planets: any[], ascendant: any): string {
  if (!planets || !ascendant) return 'Interpretación no disponible';
  
  const sol = planets.find(p => p.name === 'Sol');
  const luna = planets.find(p => p.name === 'Luna');
  
  return `Con ${ascendant.sign} ascendente, proyectas una personalidad ${getAscendantTraits(ascendant.sign)}. Tu Sol en ${sol?.sign} indica ${getSunTraits(sol?.sign)}, mientras que tu Luna en ${luna?.sign} revela ${getMoonTraits(luna?.sign)}.`;
}

/**
 * Generate relationship interpretation
 */
function generateRelationshipInterpretation(planets: any[], aspects: any[]): string {
  if (!planets) return 'Interpretación no disponible';
  
  const venus = planets.find(p => p.name === 'Venus');
  const marte = planets.find(p => p.name === 'Marte');
  
  return `En el amor, Venus en ${venus?.sign} indica ${getVenusTraits(venus?.sign)}. Marte en ${marte?.sign} muestra ${getMarsTraits(marte?.sign)}.`;
}

/**
 * Generate career interpretation
 */
function generateCareerInterpretation(planets: any[], houses: any[], midheaven: any): string {
  if (!midheaven) return 'Interpretación no disponible';
  
  return `Tu Medio Cielo en ${midheaven.sign} sugiere una vocación hacia ${getMidheavenTraits(midheaven.sign)}.`;
}

// Helper functions for traits
function getAscendantTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'enérgica y directa',
    'Tauro': 'estable y determinada',
    'Géminis': 'comunicativa y versátil',
    'Cáncer': 'empática y protectora',
    'Leo': 'carismática y creativa',
    'Virgo': 'práctica y detallista',
    'Libra': 'equilibrada y diplomática',
    'Escorpio': 'intensa y magnética',
    'Sagitario': 'aventurera y filosófica',
    'Capricornio': 'ambiciosa y responsable',
    'Acuario': 'original e independiente',
    'Piscis': 'intuitiva y compasiva'
  };
  return traits[sign] || 'única';
}

function getSunTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'liderazgo natural y espíritu pionero',
    'Tauro': 'perseverancia y amor por la belleza',
    'Géminis': 'curiosidad intelectual y adaptabilidad',
    'Cáncer': 'sensibilidad emocional y instinto protector',
    'Leo': 'creatividad y necesidad de reconocimiento',
    'Virgo': 'perfeccionismo y servicio a otros',
    'Libra': 'búsqueda de armonía y justicia',
    'Escorpio': 'intensidad emocional y transformación',
    'Sagitario': 'búsqueda de verdad y expansión',
    'Capricornio': 'ambición y estructura',
    'Acuario': 'originalidad y visión humanitaria',
    'Piscis': 'imaginación y compasión'
  };
  return traits[sign] || 'cualidades únicas';
}

function getMoonTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'reacciones rápidas y necesidad de acción',
    'Tauro': 'necesidad de seguridad y comodidad',
    'Géminis': 'mente inquieta y necesidad de comunicación',
    'Cáncer': 'profunda conexión emocional y nostalgia',
    'Leo': 'necesidad de aprecio y expresión dramática',
    'Virgo': 'necesidad de orden y análisis emocional',
    'Libra': 'búsqueda de equilibrio emocional y belleza',
    'Escorpio': 'emociones intensas y necesidad de transformación',
    'Sagitario': 'optimismo y necesidad de libertad emocional',
    'Capricornio': 'control emocional y necesidad de logro',
    'Acuario': 'necesidad de independencia emocional',
    'Piscis': 'sensibilidad psíquica y compasión'
  };
  return traits[sign] || 'patrones emocionales únicos';
}

function getVenusTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'atracción por la pasión y la conquista',
    'Tauro': 'amor por la estabilidad y el placer sensual',
    'Géminis': 'necesidad de conexión mental y variedad',
    'Cáncer': 'amor protector y emocional',
    'Leo': 'amor dramático y necesidad de admiración',
    'Virgo': 'amor expresado a través del servicio',
    'Libra': 'búsqueda de armonía y belleza en el amor',
    'Escorpio': 'amor intenso y transformador',
    'Sagitario': 'amor por la aventura y la filosofía',
    'Capricornio': 'amor serio y duradero',
    'Acuario': 'amor libre e inconvencional',
    'Piscis': 'amor idealista y compasivo'
  };
  return traits[sign] || 'un estilo único de amar';
}

function getMarsTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'acción directa y competitividad',
    'Tauro': 'determinación constante y sensualidad',
    'Géminis': 'acción mental y versatilidad',
    'Cáncer': 'protección emocional y tenacidad',
    'Leo': 'acción creativa y liderazgo',
    'Virgo': 'acción práctica y perfeccionismo',
    'Libra': 'acción diplomática y búsqueda de justicia',
    'Escorpio': 'intensidad y transformación',
    'Sagitario': 'acción aventurera y filosófica',
    'Capricornio': 'ambición estructurada y persistencia',
    'Acuario': 'acción innovadora y rebelde',
    'Piscis': 'acción intuitiva y compasiva'
  };
  return traits[sign] || 'un estilo único de acción';
}

function getMidheavenTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'liderazgo y pionerismo profesional',
    'Tauro': 'estabilidad financiera y belleza',
    'Géminis': 'comunicación y versatilidad profesional',
    'Cáncer': 'cuidado y protección de otros',
    'Leo': 'creatividad y reconocimiento público',
    'Virgo': 'servicio y perfección técnica',
    'Libra': 'diplomacia y artes',
    'Escorpio': 'investigación y transformación',
    'Sagitario': 'enseñanza y expansión de conocimiento',
    'Capricornio': 'autoridad y logro empresarial',
    'Acuario': 'innovación y reforma social',
    'Piscis': 'arte, espiritualidad y sanación'
  };
  return traits[sign] || 'un camino profesional único';
}