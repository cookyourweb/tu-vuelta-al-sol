// src/utils/astrology/generateCharts.ts
// Módulo para funciones relacionadas con generación y manipulación de cartas astrológicas

import { DetailedNatalChart, DetailedProgressedChart, PlanetPosition } from '@/types/astrology/unified-types';

/**
 * Convierte datos crudos de Prokerala a formato DetailedNatalChart
 * @param prokeralaData Datos crudos de Prokerala API
 * @returns DetailedNatalChart o null si falla
 */
export function convertProkeralaToDetailedChart(prokeralaData: any): DetailedNatalChart | null {
  try {
    const planets = prokeralaData?.planets;
    const houses = prokeralaData?.houses;
    
    if (!planets || !Array.isArray(planets)) {
      return null;
    }
    
    const detailedChart: Partial<DetailedNatalChart> = {
      aspectos: [] // Inicializar aspectos vacío
    };
    
    // Mapear planetas
    planets.forEach((planet: any) => {
      const planetName = planet.name?.toLowerCase();
      const sign = getSignNameFromId(planet.sign);
      
      if (sign) {
        const position: PlanetPosition = {
          sign,
          house: planet.house || 1,
          degree: planet.degree || 0,
          longitude: planet.full_degree || 0,
          retrograde: planet.retrograde || false,
          element: getSignElement(sign),
          mode: getSignMode(sign)
        };
        
        // Mapear a los nombres correctos
        switch (planetName) {
          case 'sun': case 'sol':
            detailedChart.sol = position;
            break;
          case 'moon': case 'luna':
            detailedChart.luna = position;
            break;
          case 'mercury': case 'mercurio':
            detailedChart.mercurio = position;
            break;
          case 'venus':
            detailedChart.venus = position;
            break;
          case 'mars': case 'marte':
            detailedChart.marte = position;
            break;
          case 'jupiter': case 'júpiter':
            detailedChart.jupiter = position;
            break;
          case 'saturn': case 'saturno':
            detailedChart.saturno = position;
            break;
          case 'uranus': case 'urano':
            detailedChart.urano = position;
            break;
          case 'neptune': case 'neptuno':
            detailedChart.neptuno = position;
            break;
          case 'pluto': case 'plutón':
            detailedChart.pluton = position;
            break;
        }
      }
    });
    
    // Calcular ascendente si hay datos de casas
    if (houses && Array.isArray(houses) && houses[0]) {
      const ascSign = getSignNameFromId(houses[0].sign);
      if (ascSign) {
        detailedChart.ascendente = {
          sign: ascSign,
          house: 1,
          degree: houses[0].degree || 0,
          longitude: houses[0].degree || 0,
          retrograde: false,
          element: getSignElement(ascSign),
          mode: getSignMode(ascSign)
        };
      }
    }
    
    return detailedChart as DetailedNatalChart;
  } catch (error) {
    console.error('Error convirtiendo datos Prokerala:', error);
    return null;
  }
}

/**
 * Funciones auxiliares para signos
 */
function getSignNameFromId(signId: number): string | null {
  const signs: Record<number, string> = {
    1: 'Aries', 2: 'Tauro', 3: 'Géminis', 4: 'Cáncer',
    5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Escorpio',
    9: 'Sagitario', 10: 'Capricornio', 11: 'Acuario', 12: 'Piscis'
  };
  return signs[signId] || null;
}

import type { ElementType, ModeType } from '@/types/astrology/unified-types';

function getSignElement(sign: string): ElementType {
  const elements: Record<string, ElementType> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  return elements[sign] || 'fire';
}

function getSignMode(sign: string): ModeType {
  const modes: Record<string, ModeType> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modes[sign] || 'cardinal';
}
