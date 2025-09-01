// src/services/progressedChartService.ts - SOLO LÓGICA DE SERVICIO
// ✅ SIN REACT HOOKS - Solo funciones puras

import { DetailedProgressedChart, UserProfile } from '@/types/astrology/unified-types';

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

export default {
  calculateProgressionPeriod,
  getProgressedPlanetMeaning,
  getPlanetSymbol,
  generateMockProgressedChart,
  validateProgressedChart,
  formatPlanetInfo,
  getFormattedPlanets
};