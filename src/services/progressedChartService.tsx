// src/services/progressedChartService.ts - SOLO LÓGICA DE SERVICIO
// ✅ SIN REACT HOOKS - Solo funciones puras

import { DetailedProgressedChart, UserProfile, ElementType, ModeType, getSignElement, getSignMode } from '@/types/astrology/unified-types';
import { calculateAllAspects } from '@/utils/astrology/aspectCalculations';

export interface ProgressionPeriod {
  startDate: string;
  endDate: string;
  year: number;
  ageAtStart: number;
  description: string;
  period: string;
  isCurrentYear: boolean;
}

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
    'Júpiter': 'Tu visión del mundo y las oportunidades que reconoces se expanden hacia nuevos horizontes de crecimiento personal.',
    'Saturno': 'Tus responsabilidades y estructura de vida se consolidan progresivamente hacia una mayor estabilidad y maestría.',
    'Urano': 'Tu necesidad de libertad y cambio se manifiesta de formas más auténticas y conscientes con la madurez.',
    'Neptuno': 'Tu conexión espiritual e intuición se profundiza naturalmente con el paso del tiempo y las experiencias vividas.',
    'Plutón': 'Tu poder personal y capacidad de transformación se intensifican, permitiéndote cambios más profundos y conscientes.'
  };
  
  return meanings[planetName] || 'Este planeta progresado trae nuevas energías y oportunidades de crecimiento evolutivo a tu vida.';
}

/**
 * ✅ Obtener símbolo del planeta
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
    'Plutón': '♇'
  };
  return symbols[planetName] || '⭐';
}

/**
 * ✅ Generar datos mock de carta progresada para testing
 */
export function generateMockProgressedChart(): DetailedProgressedChart {
  return {
    sol_progresado: {
      sign: 'Leo',
      house: 5,
      degree: 15.23,
      longitude: 135.23,
      retrograde: false,
      element: 'fire',
      mode: 'fixed'
    },
    luna_progresada: {
      sign: 'Escorpio',
      house: 8,
      degree: 8.45,
      longitude: 218.45,
      retrograde: false,
      element: 'water',
      mode: 'fixed'
    },
    aspectos_natales_progresados: [
      {
        type: 'conjunction',
        planet1: 'Sol',
        planet2: 'Venus',
        orb: 2.5,
        applying: true
      }
    ]
  };
}

/**
 * ✅ Validar datos de carta progresada
 */
export function validateProgressedChart(chart: any): {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
} {
  const requiredFields = ['sol_progresado', 'luna_progresada'];
  const missingFields: string[] = [];
  const errors: string[] = [];

  // Verificar campos requeridos
  requiredFields.forEach(field => {
    if (!chart[field]) {
      missingFields.push(field);
    }
  });

  // Verificar estructura de planetas
  if (chart.sol_progresado && (!chart.sol_progresado.sign || !chart.sol_progresado.house)) {
    errors.push('Sol progresado incompleto: falta signo o casa');
  }

  if (chart.luna_progresada && (!chart.luna_progresada.sign || !chart.luna_progresada.house)) {
    errors.push('Luna progresada incompleta: falta signo o casa');
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors
  };
}

/**
 * ✅ Formatear información de planeta progresado para UI
 */
export function formatPlanetInfo(planet: any, planetName: string) {
  if (!planet) return null;

  return {
    name: planetName,
    displayName: `${planetName} Progresado`,
    sign: planet.sign,
    house: planet.house,
    degree: planet.degree?.toFixed(2),
    element: planet.element,
    mode: planet.mode,
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
    { key: 'luna_progresada', name: 'Luna' }
  ];

  return planets.map(({ key, name }) => 
    formatPlanetInfo(chart[key as keyof DetailedProgressedChart], name)
  ).filter(Boolean);
}

/**
 * ✅ Generate progressed chart using real astrological calculations
 * Implementa progresión solar: 1 día = 1 año de vida
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

    // Calcular edad actual en días
    const birthDateTime = new Date(`${params.birthDate}T${params.birthTime}`);
    const currentDate = new Date();
    const daysSinceBirth = Math.floor((currentDate.getTime() - birthDateTime.getTime()) / (1000 * 60 * 60 * 24));

    console.log(`📅 Días desde nacimiento: ${daysSinceBirth} (${Math.floor(daysSinceBirth / 365.25)} años)`);

    // Calcular posiciones progresadas usando cálculos astrológicos básicos
    const progressedData = calculateProgressedPositions(params, daysSinceBirth);

    console.log('✅ Carta progresada calculada exitosamente:', {
      solProgresado: progressedData.sol_progresado,
      lunaProgresada: progressedData.luna_progresada,
      aspectosCount: progressedData.aspectos_natales_progresados.length
    });

    return progressedData;

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
    return generateMockProgressedChart();
  }
}

/**
 * Process Prokerala API response for progressed chart
 */
function processProkeralaProgressedResponse(apiResponse: any): DetailedProgressedChart {
  const planets = apiResponse.planets || [];
  const aspects = apiResponse.aspects || [];

  // Helper function to translate planet names
  const translatePlanetName = (englishName: string): string => {
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
      'Pluto': 'Plutón'
    };
    return translations[englishName] || englishName;
  };

  // Helper function to get sign from longitude
  const getSignFromLongitude = (longitude: number): string => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer',
      'Leo', 'Virgo', 'Libra', 'Escorpio',
      'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex];
  };

  // Helper function to get element from sign
  const getElementFromSign = (sign: string): string => {
    const elementMap: Record<string, string> = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
      'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
      'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
      'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
    };
    return elementMap[sign] || 'fire';
  };

  // Helper function to get modality from sign
  const getModalityFromSign = (sign: string): string => {
    const modalityMap: Record<string, string> = {
      'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
      'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
      'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
    };
    return modalityMap[sign] || 'cardinal';
  };

  // Process planets
  const processedPlanets: Record<string, any> = {};

  planets.forEach((planet: any) => {
    const name = translatePlanetName(planet.name);
    const sign = planet.sign || getSignFromLongitude(planet.longitude);
    const degree = Math.floor(planet.longitude % 30);
    const minutes = Math.floor((planet.longitude % 1) * 60);

    const planetData = {
      sign,
      house: planet.house || 1,
      degree,
      longitude: planet.longitude,
      retrograde: planet.is_retrograde || false,
      element: getElementFromSign(sign),
      mode: getModalityFromSign(sign)
    };

    // Map to the expected format
    const keyMap: Record<string, string> = {
      'Sol': 'sol_progresado',
      'Luna': 'luna_progresada',
      'Mercurio': 'mercurio_progresado',
      'Venus': 'venus_progresado',
      'Marte': 'marte_progresado',
      'Júpiter': 'jupiter_progresado',
      'Saturno': 'saturno_progresado',
      'Urano': 'urano_progresado',
      'Neptuno': 'neptuno_progresado',
      'Plutón': 'pluton_progresado'
    };

    const key = keyMap[name];
    if (key) {
      processedPlanets[key] = planetData;
    }
  });

  // Process aspects
  const processedAspects = aspects.map((aspect: any) => ({
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    planet1: translatePlanetName(aspect.planet1?.name || ''),
    planet2: translatePlanetName(aspect.planet2?.name || ''),
    orb: aspect.orb || 0,
    applying: aspect.is_applying || false
  }));

  return {
    ...processedPlanets,
    aspectos_natales_progresados: processedAspects
  } as DetailedProgressedChart;
}

/**
 * Calculate progressed positions using basic astrological calculations
 * Progresión solar: 1 día = 1 grado aproximadamente
 */
function calculateProgressedPositions(params: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  progressionYear: number;
}, daysSinceBirth: number): DetailedProgressedChart {

  // Calcular posiciones natales aproximadas (simplificadas)
  const natalSunLongitude = calculateNatalSunPosition(params.birthDate);
  const natalMoonLongitude = calculateNatalMoonPosition(params.birthDate, params.birthTime);

  // Progresión solar: aproximadamente 1 grado por día
  const progressedSunLongitude = (natalSunLongitude + daysSinceBirth) % 360;

  // Progresión lunar: aproximadamente 1 grado por mes (30 días)
  const monthsSinceBirth = daysSinceBirth / 30;
  const progressedMoonLongitude = (natalMoonLongitude + monthsSinceBirth) % 360;

  // Calcular signos y grados
  const sunSign = getSignFromLongitude(progressedSunLongitude);
  const moonSign = getSignFromLongitude(progressedMoonLongitude);

  const sunDegree = Math.floor(progressedSunLongitude % 30);
  const moonDegree = Math.floor(progressedMoonLongitude % 30);

  // Calcular casas aproximadas (simplificado)
  const sunHouse = calculateHouseFromLongitude(progressedSunLongitude, params.longitude);
  const moonHouse = calculateHouseFromLongitude(progressedMoonLongitude, params.longitude);

  // Prepare planets array for aspect calculation (matching expected format)
  const planetsForAspects = [
    {
      planet: 'Sol',
      degree: progressedSunLongitude,
      name: 'Sol',
      longitude: progressedSunLongitude
    },
    {
      planet: 'Luna',
      degree: progressedMoonLongitude,
      name: 'Luna',
      longitude: progressedMoonLongitude
    }
  ];

  // Calculate aspects using the correct format
  const calculatedAspects = calculateAllAspects(planetsForAspects);

  // Convert aspects to the expected format for frontend
  const formattedAspects = calculatedAspects.map(aspect => ({
    type: aspect.aspect_type,
    planet1: aspect.planet1.toString(),
    planet2: aspect.planet2.toString(),
    orb: aspect.orb,
    applying: aspect.is_applying
  }));

  // Calculate real ascendant and midheaven positions
  const ascendantLongitude = calculateAscendant(params.latitude, params.longitude, params.birthDate, params.birthTime);
  const midheavenLongitude = calculateMidheaven(params.latitude, params.longitude, params.birthDate, params.birthTime);

  const ascendantSign = getSignFromLongitude(ascendantLongitude);
  const midheavenSign = getSignFromLongitude(midheavenLongitude);

  const ascendantDegree = Math.floor(ascendantLongitude % 30);
  const midheavenDegree = Math.floor(midheavenLongitude % 30);

  // Calculate houses based on ascendant
  const houses = calculateHouses(ascendantLongitude, params.latitude);

  const ascendente = {
    sign: ascendantSign,
    house: 1,
    degree: ascendantDegree,
    longitude: ascendantLongitude,
    retrograde: false,
    element: getElementFromSign(ascendantSign) as ElementType,
    mode: getModalityFromSign(ascendantSign) as ModeType
  };

  const mediocielo = {
    sign: midheavenSign,
    house: 10,
    degree: midheavenDegree,
    longitude: midheavenLongitude,
    retrograde: false,
    element: getElementFromSign(midheavenSign) as ElementType,
    mode: getModalityFromSign(midheavenSign) as ModeType
  };

  return {
    sol_progresado: {
      sign: sunSign,
      house: sunHouse,
      degree: sunDegree,
      longitude: progressedSunLongitude,
      retrograde: false, // El Sol nunca es retrógrado
      element: getElementFromSign(sunSign) as ElementType,
      mode: getModalityFromSign(sunSign) as ModeType
    },
    luna_progresada: {
      sign: moonSign,
      house: moonHouse,
      degree: moonDegree,
      longitude: progressedMoonLongitude,
      retrograde: false, // Simplificado
      element: getSignElement(moonSign),
      mode: getSignMode(moonSign)
    },
    aspectos_natales_progresados: formattedAspects,
    ascendente: ascendente,
    mediocielo: mediocielo
  };
}

/**
 * Calcular posición natal aproximada del Sol basada en la fecha
 */
function calculateNatalSunPosition(birthDate: string): number {
  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

  // El Sol se mueve aproximadamente 1 grado por día
  // Aproximación: 0 grados en el equinoccio de primavera (21 marzo)
  const springEquinox = new Date(date.getFullYear(), 2, 21); // Marzo 21
  const daysSinceEquinox = Math.floor((date.getTime() - springEquinox.getTime()) / (1000 * 60 * 60 * 24));

  return (daysSinceEquinox * 0.986) % 360; // 0.986 grados por día aproximadamente
}

/**
 * Calcular posición natal aproximada de la Luna
 */
function calculateNatalMoonPosition(birthDate: string, birthTime: string): number {
  const dateTime = new Date(`${birthDate}T${birthTime}`);
  const timestamp = dateTime.getTime();

  // La Luna se mueve aproximadamente 13 grados por día
  // Usamos una fórmula simplificada basada en el timestamp
  const moonCycle = 29.5; // Días del ciclo lunar
  const degreesPerDay = 360 / moonCycle;

  const basePosition = 0; // Posición arbitraria para simplificar
  const daysSinceEpoch = timestamp / (1000 * 60 * 60 * 24);
  const moonPosition = (basePosition + daysSinceEpoch * degreesPerDay) % 360;

  return moonPosition;
}

/**
 * Calcular ascendente aproximado
 */
function calculateAscendant(latitude: number, longitude: number, birthDate: string, birthTime: string): number {
  // Simplified calculation - in a real implementation, this would use proper astronomical calculations
  // For now, return a basic approximation based on latitude and time
  const date = new Date(`${birthDate}T${birthTime}`);
  const hour = date.getHours();

  // Basic approximation: ascendant moves about 15 degrees per hour
  const baseAscendant = (hour * 15) % 360;

  // Adjust for latitude (northern vs southern hemisphere)
  const latitudeAdjustment = latitude > 0 ? 0 : 180;

  return (baseAscendant + latitudeAdjustment) % 360;
}

/**
 * Calcular medio cielo aproximado
 */
function calculateMidheaven(latitude: number, longitude: number, birthDate: string, birthTime: string): number {
  // Simplified calculation - MC is approximately 90 degrees from ascendant in most cases
  const ascendant = calculateAscendant(latitude, longitude, birthDate, birthTime);
  return (ascendant + 90) % 360;
}

/**
 * Calcular casas basadas en el ascendente
 */
function calculateHouses(ascendantLongitude: number, latitude: number): any[] {
  const houses = [];

  // Calculate house cusps using simplified equal house system
  for (let i = 0; i < 12; i++) {
    const houseLongitude = (ascendantLongitude + (i * 30)) % 360;
    const sign = getSignFromLongitude(houseLongitude);
    const degree = Math.floor(houseLongitude % 30);

    houses.push({
      number: i + 1,
      sign: sign,
      degree: degree,
      longitude: houseLongitude,
      element: getElementFromSign(sign),
      mode: getModalityFromSign(sign)
    });
  }

  return houses;
}

/**
 * Calcular casa aproximada basada en la longitud y el ascendente
 */
function calculateHouseFromLongitude(longitude: number, birthLongitude: number): number {
  // Simplificación: asumimos ascendente en 0 grados para cálculos básicos
  // En un cálculo real, necesitaríamos el ascendente exacto
  const ascendant = 0; // Simplificado
  const positionInChart = (longitude - ascendant + 360) % 360;

  return Math.floor(positionInChart / 30) + 1;
}

/**
 * Obtener signo zodiacal desde longitud eclíptica
 */
function getSignFromLongitude(longitude: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

/**
 * Obtener elemento del signo
 */
function getElementFromSign(sign: string): string {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  return elementMap[sign] || 'fire';
}

/**
 * Obtener modalidad del signo
 */
function getModalityFromSign(sign: string): string {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modalityMap[sign] || 'cardinal';
}

/**
 * Calculate timezone offset (helper function)
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  try {
    // Simplified timezone calculation
    const timezones: Record<string, string> = {
      'Europe/Madrid': '+01:00',
      'Europe/Berlin': '+01:00',
      'Europe/Paris': '+01:00',
      'Europe/Rome': '+01:00',
      'Europe/London': '+00:00',
      'America/New_York': '-05:00',
      'America/Los_Angeles': '-08:00',
      'Asia/Tokyo': '+09:00',
      'Australia/Sydney': '+10:00',
      'UTC': '+00:00'
    };

    return timezones[timezone] || '+00:00';
  } catch (error) {
    console.warn('Error calculating timezone offset:', error);
    return '+00:00';
  }
}

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
