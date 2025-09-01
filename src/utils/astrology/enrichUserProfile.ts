// src/utils/astrology/enrichUserProfile.ts
// Sistema que combina tu extractAstroProfile con datos detallados para IA

import extractAstroProfile from './extractAstroProfile';
import type { UserProfile, DetailedNatalChart, DetailedProgressedChart } from '@/types/astrology/unified-types';

// ==========================================
// INTERFAZ PRINCIPAL
// ==========================================

export interface EnrichProfileParams {
  userId: string;
  birthData: any;
  natalChart: any;
  progressedChart?: any;
}

// ==========================================
// FUNCIÓN PRINCIPAL INTEGRADA
// ==========================================

export async function enrichUserProfileWithChartData(params: EnrichProfileParams): Promise<UserProfile> {
  const { userId, birthData, natalChart, progressedChart } = params;
  
  try {
    console.log(`🎯 Enriqueciendo perfil para usuario: ${userId}`);
    
    // 1. USAR TU EXTRACTOR EXISTENTE
    const extractedProfile = extractAstroProfile({
      natal: natalChart,
      progressed: progressedChart,
      nombre: birthData.fullName || birthData.nombre || 'Usuario',
      birthDate: birthData.birthDate,
      place: birthData.birthPlace || birthData.place || 'Madrid, España'
    });
    
    // 2. CONVERTIR A DATOS DETALLADOS PARA IA
    const detailedNatalChart = convertToDetailedNatalChart(natalChart);
    const detailedProgressedChart = progressedChart ? convertToDetailedProgressedChart(progressedChart) : undefined;
    
    // 3. CREAR PERFIL ENRIQUECIDO COMPLETO
    const enrichedProfile: UserProfile = {
      // Datos básicos del extractor existente
      ...extractedProfile,
      userId,
      
      // Completar datos que el extractor puede no tener
      latitude: parseFloat(birthData.latitude) || 40.4164,
      longitude: parseFloat(birthData.longitude) || -3.7025,
      timezone: birthData.timezone || 'Europe/Madrid',
      
      // NUEVOS DATOS DETALLADOS PARA IA
      detailedNatalChart,
      detailedProgressedChart
    };
    
    console.log(`✅ Perfil enriquecido completado para ${enrichedProfile.name}`);
    
    return enrichedProfile;
    
  } catch (error) {
    console.error('❌ Error enriqueciendo perfil:', error);
    
    // FALLBACK: perfil básico funcional
    return createBasicProfile(params);
  }
}

// ==========================================
// CONVERSORES DE DATOS
// ==========================================

function convertToDetailedNatalChart(natalChart: any): DetailedNatalChart | undefined {
  try {
    if (!natalChart?.planets || !Array.isArray(natalChart.planets)) {
      return undefined;
    }
    
    const detailedChart: Partial<DetailedNatalChart> = {
      aspectos: []
    };
    
    // Mapear planetas con datos específicos
    natalChart.planets.forEach((planet: any) => {
      const planetName = planet.name?.toLowerCase();
      const sign = getSignNameFromId(planet.sign);
      
      if (sign) {
        const position = {
          sign,
          house: planet.house || 1,
          degree: planet.degree || 0,
          longitude: planet.full_degree || 0,
          retrograde: planet.retrograde || false,
          element: getSignElement(sign),
          mode: getSignMode(sign)
        };
        
        // Mapear a propiedades específicas
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
    if (natalChart.houses && Array.isArray(natalChart.houses) && natalChart.houses[0]) {
      const ascSign = getSignNameFromId(natalChart.houses[0].sign);
      if (ascSign) {
        detailedChart.ascendente = {
          sign: ascSign,
          house: 1,
          degree: natalChart.houses[0].degree || 0,
          longitude: natalChart.houses[0].degree || 0,
          retrograde: false,
          element: getSignElement(ascSign),
          mode: getSignMode(ascSign)
        };
      }
    }
    
    return detailedChart as DetailedNatalChart;
  } catch (error) {
    console.error('Error convirtiendo carta natal:', error);
    return undefined;
  }
}

function convertToDetailedProgressedChart(progressedChart: any): DetailedProgressedChart | undefined {
  try {
    if (!progressedChart?.planets) {
      return undefined;
    }
    
    const progressed: Partial<DetailedProgressedChart> = {
      aspectos_natales_progresados: []
    };
    
    // Mapear planetas progresados importantes
    if (progressedChart.planets) {
      const solProgresado = progressedChart.planets.find((p: any) => p.name?.toLowerCase() === 'sun');
      const lunaProgresada = progressedChart.planets.find((p: any) => p.name?.toLowerCase() === 'moon');
      
      if (solProgresado) {
        const sign = getSignNameFromId(solProgresado.sign) || 'Aries';
        progressed.sol_progresado = {
          sign,
          house: solProgresado.house || 1,
          degree: solProgresado.degree || 0,
          longitude: solProgresado.full_degree || 0,
          retrograde: false,
          element: getSignElement(sign),
          mode: getSignMode(sign)
        };
      }
      
      if (lunaProgresada) {
        const sign = getSignNameFromId(lunaProgresada.sign) || 'Cáncer';
        progressed.luna_progresada = {
          sign,
          house: lunaProgresada.house || 4,
          degree: lunaProgresada.degree || 0,
          longitude: lunaProgresada.full_degree || 0,
          retrograde: false,
          element: getSignElement(sign),
          mode: getSignMode(sign)
        };
      }
    }
    
    return progressed as DetailedProgressedChart;
  } catch (error) {
    console.error('Error convirtiendo carta progresada:', error);
    return undefined;
  }
}

// ==========================================
// FALLBACK BÁSICO
// ==========================================

function createBasicProfile(params: EnrichProfileParams): UserProfile {
  const { userId, birthData } = params;
  const currentDate = new Date();
  const birthDate = new Date(birthData.birthDate);
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
  
  return {
    userId,
    name: birthData.fullName || birthData.nombre || 'Usuario',
    birthDate: birthData.birthDate,
    currentAge,
    nextAge: currentAge + 1,
    latitude: parseFloat(birthData.latitude) || 40.4164,
    longitude: parseFloat(birthData.longitude) || -3.7025,
    timezone: birthData.timezone || 'Europe/Madrid',
    place: birthData.birthPlace || birthData.place || 'Madrid, España',
    
    // Datos astrológicos básicos de fallback
    astrological: {
      signs: {
        sun: birthData.sunSign || 'Acuario',
        moon: birthData.moonSign || 'Libra',
        ascendant: birthData.ascendantSign || 'Aries',
        mercury: birthData.mercurySign || 'Acuario',
        venus: birthData.venusSign || 'Piscis',
        mars: birthData.marsSign || 'Aries'
      },
      houses: {
        sun: birthData.sunHouse || 1,
        moon: birthData.moonHouse || 7,
        mercury: birthData.mercuryHouse || 1,
        venus: birthData.venusHouse || 2,
        mars: birthData.marsHouse || 1
      },
      dominantElements: ['air'],
      dominantMode: 'fixed',
      lifeThemes: ['Innovación', 'Relaciones armoniosas', 'Expresión única'],
      strengths: ['Visión futurista', 'Equilibrio emocional', 'Originalidad'],
      challenges: ['Integrar tradición con innovación', 'Decisiones emocionales vs racionales']
    }
  };
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getSignNameFromId(signId: number): string | null {
  const signs: Record<number, string> = {
    1: 'Aries', 2: 'Tauro', 3: 'Géminis', 4: 'Cáncer',
    5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Escorpio',
    9: 'Sagitario', 10: 'Capricornio', 11: 'Acuario', 12: 'Piscis'
  };
  return signs[signId] || null;
}

function getSignElement(sign: string): 'fire' | 'earth' | 'air' | 'water' {
  const elements: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  return elements[sign] || 'fire';
}

function getSignMode(sign: string): 'cardinal' | 'fixed' | 'mutable' {
  const modes: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  return modes[sign] || 'cardinal';
}

// ==========================================
// FUNCIONES DE VERIFICACIÓN Y UTILIDAD
// ==========================================

export function hasCompleteChartData(profile: UserProfile): boolean {
  return !!(
    profile.detailedNatalChart?.sol && 
    profile.detailedNatalChart?.luna &&
    profile.detailedNatalChart?.ascendente
  );
}

export function createEnrichedUserProfile(userId: string, birthData: any, chartData: any): Promise<UserProfile> {
  return enrichUserProfileWithChartData({
    userId,
    birthData,
    natalChart: chartData?.natalChart,
    progressedChart: chartData?.progressedChart
  });
}

console.log('🔥 enrichUserProfile.ts cargado correctamente');