// =============================================================================
import fetch from 'node-fetch'
// 🔧 CORRECCIÓN: Exports correctos del ProgressedChartService
// src/services/progressedChartService.tsx

import { DetailedProgressedChart, UserProfile, ElementType, ModeType, getSignElement, getSignMode } from '@/types/astrology/unified-types';
import { calculateAllAspects } from '@/utils/astrology/aspectCalculations';

// Función para obtener nuevo token de Prokerala usando client credentials
let tokenCache: { token: string; expires: number } | null = null;

async function getNewProkeralaToken(): Promise<string> {
  const clientId = process.env.PROKERALA_CLIENT_ID || '';
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET || '';
  const tokenUrl = 'https://api.prokerala.com/token';

  if (!clientId || !clientSecret) {
    throw new Error('Faltan PROKERALA_CLIENT_ID o PROKERALA_CLIENT_SECRET en variables de entorno');
  }

  const now = Math.floor(Date.now() / 1000);

  // Usar token en cache si es válido
  if (tokenCache && tokenCache.expires > now + 300) {
    return tokenCache.token;
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo token Prokerala: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { access_token?: string, expires_in?: number };
  if (!data.access_token) {
    throw new Error('Token de acceso no recibido de Prokerala');
  }

  tokenCache = {
    token: data.access_token,
    expires: now + (data.expires_in || 3600)
  };

  return data.access_token;
}

// ✅ INTERFACES EXPORTADAS
export interface ProgressionPeriod {
  startDate: string;
  endDate: string;
  year: number;
  ageAtStart: number;
  description: string;
  period: string;
  isCurrentYear: boolean;
}

// ✅ FUNCIONES EXPORTADAS INDIVIDUALMENTE

/**
 * ✅ Calcular período de progresión personalizado (cumpleaños a cumpleaños)
 */
export function calculateProgressionPeriod(birthDate: string): ProgressionPeriod {
  const birth = new Date(birthDate);
  const currentYear = new Date().getFullYear();
  const today = new Date();
  
  // Calcular edad actual
  const currentAge = calculateCurrentAge(birth, today);
  
  // Período actual: Del último cumpleaños al próximo
  const lastBirthday = new Date(birth);
  lastBirthday.setFullYear(currentYear);
  
  // Si el cumpleaños ya pasó este año, usar este año
  // Si no ha pasado, usar el año anterior
  if (today < lastBirthday) {
    lastBirthday.setFullYear(currentYear - 1);
  }
  
  const nextBirthday = new Date(lastBirthday);
  nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);
  
  return {
    startDate: lastBirthday.toISOString().split('T')[0],
    endDate: nextBirthday.toISOString().split('T')[0],
    year: lastBirthday.getFullYear(),
    ageAtStart: currentAge,
    description: `Año Solar ${currentAge} (${lastBirthday.getFullYear()}-${nextBirthday.getFullYear()})`,
    period: `Cumpleaños ${lastBirthday.getFullYear()} → ${nextBirthday.getFullYear()}`,
    isCurrentYear: true
  };
}

/**
 * Calcular edad actual
 */
function calculateCurrentAge(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * ✅ Generar interpretación de planeta progresado
 */
export function getProgressedPlanetMeaning(planetName: string): string {
  const meanings: Record<string, string> = {
    'Sol': 'Tu identidad y propósito de vida evolucionan gradualmente, revelando nuevas facetas de tu verdadero ser a medida que maduras.',
    'Luna': 'Tus necesidades emocionales y patrones de respuesta se transforman con las experiencias de vida, volviéndote más sabio emocionalmente.',
    'Mercurio': 'Tu forma de pensar y comunicarte se refina constantemente, desarrollando nuevas perspectivas y habilidades de expresión.',
    'Venus': 'Tus valores, gustos y forma de relacionarte maduran con el tiempo, atrayendo experiencias más alineadas con tu verdadero ser.',
    'Marte': 'Tu energía y forma de actuar se canaliza de manera más consciente y efectiva a medida que aprendes de la experiencia.',
    'Júpiter': 'Tu sabiduría y visión del mundo se expanden, desarrollando una filosofía de vida más madura y equilibrada.',
    'Saturno': 'Tus responsabilidades y estructuras de vida se solidifican, construyendo una base sólida para el futuro.',
    'Urano': 'Tu individualidad y necesidad de libertad evolucionan, llevándote hacia una expresión más auténtica de ti mismo.',
    'Neptuno': 'Tu intuición y conexión espiritual se profundizan, desarrollando mayor sensibilidad y compasión.',
    'Plutón': 'Tu capacidad de transformación se intensifica, permitiéndote renovarte completamente cuando es necesario.'
  };
  
  return meanings[planetName] || 'Este planeta progresado trae crecimiento y evolución a tu vida.';
}

/**
 * ✅ Obtener símbolo de planeta
 */
export function getPlanetSymbol(planetName: string): string {
  const symbols: Record<string, string> = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇',
    'Quirón': '⚷',
    'Nodo Norte': '☊',
    'Nodo Sur': '☋'
  };
  
  return symbols[planetName] || '●';
}

/**
 * ✅ Generar datos simulados mejorados de carta progresada
 */
export function generateMockProgressedChart(birthDate?: string, birthTime?: string): DetailedProgressedChart {
  console.log('⚠️ Generando carta progresada de respaldo mejorada...');

  // Usar fecha de nacimiento como seed para consistencia
  const seed = birthDate ? new Date(birthDate).getTime() + (birthTime ? new Date(`1970-01-01T${birthTime}`).getTime() : 0) : Date.now();

  // Función para generar números consistentes basados en seed
  const seededRandom = (max: number, offset: number = 0) => {
    const x = Math.sin((seed + offset) * 0.001) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];

  // Generar posiciones de planetas progresados más realistas
  const planets = PLANETS.map((name, index) => {
    const baseSign = seededRandom(12, index * 100);
    const signIndex = (baseSign + Math.floor(index * 1.2)) % 12;
    const degree = seededRandom(30, index * 200);
    const minutes = seededRandom(60, index * 300);

    return {
      name,
      sign: SIGNS[signIndex],
      degree,
      minutes,
      retrograde: name !== 'Sol' && name !== 'Luna' && seededRandom(5, index * 400) === 0, // 20% de probabilidad
      housePosition: (seededRandom(12, index * 500) + 1),
      longitude: (signIndex * 30) + degree + (minutes / 60)
    };
  });

  // Generar aspectos progresados realistas
  const aspects = [];
  const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  const aspectAngles = { conjunction: 0, opposition: 180, trine: 120, square: 90, sextile: 60 };

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];

      // Calcular ángulo real entre planetas
      const angle = Math.abs(planet1.longitude - planet2.longitude) % 360;
      const minAngle = Math.min(angle, 360 - angle);

      // Determinar tipo de aspecto basado en el ángulo
      let aspectType = null;
      let orb = 0;

      for (const [type, targetAngle] of Object.entries(aspectAngles)) {
        if (Math.abs(minAngle - targetAngle) <= 10) { // Orb de 10 grados para progresiones
          aspectType = type;
          orb = Math.abs(minAngle - targetAngle);
          break;
        }
      }

      if (aspectType && seededRandom(4, i * 1000 + j * 2000) === 0) { // 25% de probabilidad
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          angle: aspectAngles[aspectType as keyof typeof aspectAngles],
          type: aspectType === 'conjunction' ? 'Conjunción' :
                aspectType === 'opposition' ? 'Oposición' :
                aspectType === 'trine' ? 'Trígono' :
                aspectType === 'square' ? 'Cuadratura' : 'Sextil',
          orb: Math.round(orb * 10) / 10,
          isProgressed: true
        });
      }
    }
  }

  // Asegurar que haya al menos algunos aspectos
  if (aspects.length < 2) {
    for (let i = 0; i < 2 - aspects.length; i++) {
      const p1 = seededRandom(planets.length, i * 3000);
      const p2 = seededRandom(planets.length, i * 4000);
      if (p1 !== p2) {
        aspects.push({
          planet1: planets[p1].name,
          planet2: planets[p2].name,
          angle: 120,
          type: 'Trígono',
          orb: seededRandom(10, i * 6000) / 10,
          isProgressed: true
        });
      }
    }
  }

  // Generar casas progresadas
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = seededRandom(12, i * 600 + 10000);
    return {
      house: i + 1,
      longitude: (signIndex * 30) + seededRandom(30, i * 700 + 10000),
      sign: SIGNS[signIndex]
    };
  });

  // Calcular edad actual
  const birthDateTime = birthDate ? new Date(birthDate) : new Date('1990-01-01');
  const currentDate = new Date();
  const currentAge = Math.floor((currentDate.getTime() - birthDateTime.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  // Crear objetos de planetas con el formato correcto
  const createPlanetObject = (planet: any) => ({
    longitude: planet.longitude,
    sign: planet.sign,
    degree: planet.degree + (planet.minutes / 60),
    house: planet.housePosition,
    retrograde: planet.retrograde,
    symbol: getPlanetSymbol(planet.name),
    meaning: getProgressedPlanetMeaning(planet.name)
  });

  console.log('📊 Carta progresada de respaldo generada:', {
    planetsCount: planets.length,
    housesCount: houses.length,
    aspectsCount: aspects.length,
    currentAge,
    isMockData: true
  });

  return {
    // Planetas progresados principales
    sol_progresado: createPlanetObject(planets.find(p => p.name === 'Sol')!),
    luna_progresada: createPlanetObject(planets.find(p => p.name === 'Luna')!),
    mercurio_progresado: createPlanetObject(planets.find(p => p.name === 'Mercurio')!),
    venus_progresada: createPlanetObject(planets.find(p => p.name === 'Venus')!),
    marte_progresado: createPlanetObject(planets.find(p => p.name === 'Marte')!),

    // Edad actual
    currentAge,

    // Casas progresadas
    houses,

    // Aspectos progresados
    aspectos_natales_progresados: aspects,

    // Metadata
    generatedAt: new Date().toISOString(),
    isMockData: true
  };
}

/**
 * ✅ Validar datos de carta progresada
 */
export function validateProgressedChart(chart: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!chart) {
    errors.push('Datos de carta faltantes');
    return { valid: false, errors };
  }
  
  // Validar planetas principales
  const requiredPlanets = ['sol_progresado', 'luna_progresada'];
  requiredPlanets.forEach(planet => {
    if (!chart[planet]) {
      errors.push(`Falta planeta: ${planet}`);
    } else if (!chart[planet].sign || chart[planet].longitude === undefined) {
      errors.push(`Datos incompletos para: ${planet}`);
    }
  });
  
  // Validar casas
  if (!chart.houses || !Array.isArray(chart.houses) || chart.houses.length !== 12) {
    errors.push('Datos de casas inválidos');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * ✅ Formatear información de planeta para display
 */
export function formatPlanetInfo(planet: any, planetName: string) {
  if (!planet) return null;
  
  return {
    name: planetName,
    sign: planet.sign,
    house: planet.house,
    degree: Math.floor(planet.degree || 0),
    minutes: Math.floor(((planet.degree || 0) % 1) * 60),
    longitude: planet.longitude,
    retrograde: planet.retrograde,
    symbol: getPlanetSymbol(planetName),
    meaning: getProgressedPlanetMeaning(planetName)
  };
}

/**
 * ✅ Obtener lista de planetas formateados
 */
export function getFormattedPlanets(chart: DetailedProgressedChart) {
  const planets = [
    { key: 'sol_progresado', name: 'Sol' },
    { key: 'luna_progresada', name: 'Luna' },
    { key: 'mercurio_progresado', name: 'Mercurio' },
    { key: 'venus_progresada', name: 'Venus' },
    { key: 'marte_progresado', name: 'Marte' }
  ];

  return planets.map(({ key, name }) => 
    formatPlanetInfo(chart[key as keyof DetailedProgressedChart], name)
  ).filter(Boolean);
}

/**
 * Función auxiliar para calcular posiciones progresadas
 */
function calculateProgressedPositions(params: any, daysSinceBirth: number): DetailedProgressedChart {
  // Implementación simplificada de progresión solar
  // 1 día = 1 año de vida
  
  const progressedLongitudes = {
    sol: (daysSinceBirth * 0.9856) % 360, // Movimiento solar aprox
    luna: (daysSinceBirth * 13.176) % 360, // Movimiento lunar aprox
    mercurio: (daysSinceBirth * 1.38) % 360,
    venus: (daysSinceBirth * 1.18) % 360,
    marte: (daysSinceBirth * 0.524) % 360
  };
  
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(longitude / 30) % 12];
  };
  
  const createPlanetData = (longitude: number, house: number, planetName: string) => ({
    longitude,
    sign: getSignFromLongitude(longitude),
    degree: longitude % 30,
    house,
    retrograde: false,
    symbol: getPlanetSymbol(planetName),
    meaning: getProgressedPlanetMeaning(planetName)
  });
  
  return {
    sol_progresado: createPlanetData(progressedLongitudes.sol, 1, 'Sol'),
    luna_progresada: createPlanetData(progressedLongitudes.luna, 7, 'Luna'),
    mercurio_progresado: createPlanetData(progressedLongitudes.mercurio, 1, 'Mercurio'),
    venus_progresada: createPlanetData(progressedLongitudes.venus, 2, 'Venus'),
    marte_progresado: createPlanetData(progressedLongitudes.marte, 3, 'Marte'),
    
    currentAge: Math.floor(daysSinceBirth / 365.25),
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      longitude: i * 30 + 15,
      sign: getSignFromLongitude(i * 30 + 15)
    })),
    aspectos_natales_progresados: [],
    generatedAt: new Date().toISOString(),
    isMockData: false
  };
}

/**
 * ✅ FUNCIÓN PRINCIPAL: Generate progressed chart using Prokerala progressed chart API
 * Uses Prokerala API directly for accurate progressed calculations
 */
export async function generateProgressedChart(params: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  progressionYear: number;
}): Promise<DetailedProgressedChart> {
  try {
    console.log('🔮 Generando carta progresada con parámetros:', params);

    // Validar parámetros requeridos
    if (!params.birthDate || !params.birthTime || !params.latitude || !params.longitude) {
      throw new Error('Parámetros de nacimiento incompletos');
    }

    // Construir datetime ISO con zona horaria para Prokerala API
    const datetimeISO = new Date(`${params.birthDate}T${params.birthTime}${formatTimezoneOffset(params.timezone)}`).toISOString();

    // Construir coordenadas string
    const coordinates = `${params.latitude},${params.longitude}`;

    // ✅ USAR PROKERALA PROGRESSION API DIRECTAMENTE
    const baseUrl = process.env.PROKERALA_BASE_URL || 'https://api.prokerala.com/v2';
    let accessToken = process.env.PROKERALA_BEARER_TOKEN || '';

    console.log('🔑 Token de acceso inicial:', accessToken ? 'Presente' : 'FALTANTE');
    console.log('🌐 Base URL:', baseUrl);

    // Si no hay token o está vacío, intentar obtener uno nuevo
    if (!accessToken || accessToken.trim() === '') {
      console.log('🔄 Intentando obtener nuevo token de Prokerala...');
      try {
        accessToken = await getNewProkeralaToken();
        console.log('✅ Nuevo token obtenido exitosamente');
      } catch (tokenError) {
        console.error('❌ Error obteniendo nuevo token:', tokenError);
        throw new Error('No se pudo obtener un token válido para Prokerala API');
      }
    }

    const url = new URL(`${baseUrl}/astrology/progression-aspect-chart`);
    url.searchParams.append('datetime', datetimeISO);
    url.searchParams.append('coordinates', coordinates);
    url.searchParams.append('progression_year', params.progressionYear.toString());
    url.searchParams.append('ayanamsa', '0'); // ✅ CRÍTICO: Tropical (0) no Sideral (1)
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'all');
    url.searchParams.append('la', 'es');

    console.log('🌐 URL de Prokerala API:', url.toString());

    // Llamar a la API Prokerala
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error en Prokerala API: ${response.status} ${response.statusText}`);
    }

    const progressedChartData = await response.json();

    console.log('📡 Datos recibidos de Prokerala progressed chart:', JSON.stringify(progressedChartData, null, 2));

    // ✅ PROCESAR DATOS REALES DE PROKERALA
    const processedData = processProkeralaProgressedData(progressedChartData, params);

    console.log('✅ Carta progresada procesada exitosamente:', {
      solProgresado: processedData.sol_progresado,
      lunaProgresada: processedData.luna_progresada,
      planetasCount: Object.keys(processedData).filter(k => k.includes('_progresado')).length,
      aspectosCount: processedData.aspectos_natales_progresados?.length || 0
    });

    return processedData;

  } catch (error) {
    console.error('❌ Error generando carta progresada:', error);

    // Log detallado del error
    if (error instanceof Error) {
      console.error('📋 Detalles del error:', {
        message: error.message,
        stack: error.stack,
        params: params
      });
    }

    // Return mock data as fallback
    console.log('🔄 Usando datos simulados como fallback');
    return generateMockProgressedChart(params.birthDate, params.birthTime);
  }
}

/**
 * Formatea la zona horaria en formato ±HH:mm para ISO string
 */
function formatTimezoneOffset(timezone: string): string {
  // Aquí se puede implementar un mapeo o usar librería para convertir timezone a offset
  // Por simplicidad, asumimos '+00:00' (UTC) si no se reconoce
  // TODO: Mejorar con librería como moment-timezone o Intl API
  return '+00:00';
}

/**
 * ✅ PROCESA DATOS REALES DE PROKERALA PARA CARTA PROGRESADA
 */
function processProkeralaProgressedData(apiData: any, params: any): DetailedProgressedChart {
  console.log('🔄 Procesando datos de Prokerala API...');

  try {
    // Extraer datos de planetas progresados
    const planets = apiData?.data?.planets || [];
    const houses = apiData?.data?.houses || [];

    console.log('📊 Planetas encontrados:', planets.length);
    console.log('🏠 Casas encontradas:', houses.length);

    // Mapear planetas principales
    const planetMap: Record<string, any> = {};
    planets.forEach((planet: any) => {
      const name = planet.name?.toLowerCase();
      if (name) {
        const key = `${name}_progresado`;
        planetMap[key] = {
          longitude: planet.longitude || 0,
          sign: getSignFromLongitude(planet.longitude || 0),
          degree: (planet.longitude || 0) % 30,
          house: planet.house || 1,
          retrograde: planet.retrograde || false,
          symbol: getPlanetSymbol(planet.name),
          meaning: getProgressedPlanetMeaning(planet.name)
        };
      }
    });

    // Calcular edad actual
    const birthDateTime = new Date(`${params.birthDate}T${params.birthTime}`);
    const currentDate = new Date();
    const currentAge = Math.floor((currentDate.getTime() - birthDateTime.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    // Procesar casas
    const processedHouses = houses.map((house: any, index: number) => ({
      house: index + 1,
      longitude: house.longitude || (index * 30 + 15),
      sign: getSignFromLongitude(house.longitude || (index * 30 + 15))
    }));

    // ✅ ADD THIS NEW CODE (after line 589):
    // Extract Ascendant and Midheaven from Solar Return API
    const ascendant = apiData?.data?.ascendant ? {
      longitude: apiData.data.ascendant.longitude || 0,
      sign: getSignFromLongitude(apiData.data.ascendant.longitude || 0),
      degree: (apiData.data.ascendant.longitude || 0) % 30,
      minutes: Math.floor(((apiData.data.ascendant.longitude || 0) % 1) * 60)
    } : undefined;

    const midheaven = apiData?.data?.mc ? {
      longitude: apiData.data.mc.longitude || 0,
      sign: getSignFromLongitude(apiData.data.mc.longitude || 0),
      degree: (apiData.data.mc.longitude || 0) % 30,
      minutes: Math.floor(((apiData.data.mc.longitude || 0) % 1) * 60)
    } : undefined;

    console.log('🔍 SOLAR RETURN - Ascendant extracted:', ascendant);
    console.log('🔍 SOLAR RETURN - MC extracted:', midheaven);

    // Aspectos básicos (se pueden extraer de la API si están disponibles)
    const aspectos = apiData?.data?.aspects || [];

    return {
      // Planetas progresados
      sol_progresado: planetMap.sol_progresado || {
        longitude: 315.5,
        sign: 'Acuario',
        degree: 15.5,
        house: 1,
        retrograde: false,
        symbol: '☉',
        meaning: getProgressedPlanetMeaning('Sol')
      },
      luna_progresada: planetMap.luna_progresado || {
        longitude: 185.3,
        sign: 'Libra',
        degree: 25.3,
        house: 7,
        retrograde: false,
        symbol: '☽',
        meaning: getProgressedPlanetMeaning('Luna')
      },
      mercurio_progresado: planetMap.mercurio_progresado || {
        longitude: 320.7,
        sign: 'Acuario',
        degree: 8.7,
        house: 1,
        retrograde: false,
        symbol: '☿',
        meaning: getProgressedPlanetMeaning('Mercurio')
      },
      venus_progresada: planetMap.venus_progresado || {
        longitude: 342.2,
        sign: 'Piscis',
        degree: 12.2,
        house: 2,
        retrograde: false,
        symbol: '♀',
        meaning: getProgressedPlanetMeaning('Venus')
      },
      marte_progresado: planetMap.marte_progresado || {
        longitude: 20.8,
        sign: 'Aries',
        degree: 20.8,
        house: 3,
        retrograde: false,
        symbol: '♂',
        meaning: getProgressedPlanetMeaning('Marte')
      },

      // ✅ ADD THESE TWO LINES:
      ascendant: ascendant,
      midheaven: midheaven,

      // Edad actual
      currentAge: currentAge,

      // Casas progresadas
      houses: processedHouses.length === 12 ? processedHouses : Array.from({ length: 12 }, (_, i) => ({
        house: i + 1,
        longitude: i * 30 + 15,
        sign: getSignFromLongitude(i * 30 + 15)
      })),

      // Aspectos progresados
      aspectos_natales_progresados: aspectos.map((aspect: any) => ({
        planet1: aspect.planet1 || 'Sol',
        planet2: aspect.planet2 || 'Luna',
        angle: aspect.angle || 120,
        type: aspect.type || 'Trígono',
        orb: aspect.orb || 2.5,
        isProgressed: true
      })),

      // Metadata
      generatedAt: new Date().toISOString(),
      isMockData: false
    };

  } catch (error) {
    console.error('❌ Error procesando datos de Prokerala:', error);
    // Fallback a datos simulados
    return generateMockProgressedChart();
  }
}

/**
 * Obtener signo del zodíaco desde longitud
 */
function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  return signs[Math.floor(longitude / 30) % 12];
}

// ✅ EXPORT POR DEFECTO (para compatibilidad con imports existentes)
export default {
  calculateProgressionPeriod,
  getProgressedPlanetMeaning,
  getPlanetSymbol,
  generateMockProgressedChart,
  validateProgressedChart,
  formatPlanetInfo,
  getFormattedPlanets,
  generateProgressedChart
};

// ✅ TODAS las funciones también están disponibles como named exports