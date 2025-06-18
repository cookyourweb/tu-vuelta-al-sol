// services/agendaService.ts - Servicios para la agenda astrológica

import { PlanetName } from "@/lib/prokerala/types";
import { Aspect, House } from "./astrologyService";
import { AspectName, ZodiacSign } from "@/app/types/astrology";
import { Planet } from "@/app/types/astrology";
import { RitualsSection } from "@/app/types/agenda";

/**
 * Servicio para transformación de datos astrológicos
 */
export class DataTransformService {
  /**
   * Convierte datos de API a estructura Planet tipada
   */
  static transformPlanets(apiPlanets: any[]): Planet[] {
    if (!Array.isArray(apiPlanets)) return [];
    
    return apiPlanets.map((planet): Planet => {
      return {
        name: this.mapPlanetName(planet?.name || planet?.nombre || 'Sol'),
        sign: this.mapZodiacSign(planet?.sign || planet?.signo || 'Aries'),
        degree: this.formatDegree(planet?.degree || planet?.grado || 0),
        longitude: Number(planet?.longitude || planet?.longitud || 0),
        houseNumber: Number(planet?.house || planet?.casa || 1),
        isRetrograde: Boolean(planet?.retrograde ?? planet?.retrogrado ?? false)
      };
    });
  }

  /**
   * Convierte datos de API a estructura House tipada
   */
  static transformHouses(apiHouses: any[]): House[] {
    if (!Array.isArray(apiHouses)) return [];
    
    return apiHouses.map((house, index) => {
      const degreeValue = typeof house?.degree === "number"
        ? house.degree
        : (typeof house?.grado === "number" ? house.grado : 0);
      const minutesValue = Math.round(((degreeValue % 1) * 60));
      
      return {
        number: house?.number || house?.numero || (index + 1),
        sign: this.mapZodiacSign(house?.sign || house?.signo || 'Aries'),
        degree: this.formatDegree(degreeValue),
        longitude: house?.longitude || house?.longitud || 0
      };
    });
  }

  /**
   * Convierte datos de API a estructura Aspect tipada
   */
  static transformAspects(apiAspects: any[]): Aspect[] {
    if (!Array.isArray(apiAspects)) return [];
    
    return apiAspects.map(aspect => ({
      planet1: aspect?.planet1?.name || aspect?.planeta1 || 'Sol',
      planet2: aspect?.planet2?.name || aspect?.planeta2 || 'Luna',
      type: (aspect?.type || aspect?.tipo || aspect?.aspect?.name || 'Conjunción').toString(),
      orb: aspect?.orb || aspect?.orbe || 0,
      applying: aspect?.applying !== undefined ? aspect.applying : undefined
    }));
  }

  /**
   * Mapea nombres de planetas a tipos válidos
   */
  private static mapPlanetName(name: string): PlanetName {
    const planetMap: Record<string, PlanetName> = {
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
      'Lilith': 'Lilith',
      'North Node': 'Nodo Norte',
      'South Node': 'Nodo Sur',
      // Nombres en español
      'Sol': 'Sol',
      'Luna': 'Luna',
      'Mercurio': 'Mercurio',
      'Marte': 'Marte',
      'Júpiter': 'Júpiter',
      'Saturno': 'Saturno',
      'Urano': 'Urano',
      'Neptuno': 'Neptuno',
      'Plutón': 'Plutón',
      'Quirón': 'Quirón',
      'Lilith': 'Lilith'
    };
    
    return planetMap[name] || 'Sol';
  }

  /**
   * Mapea nombres de signos a tipos válidos
   */
  private static mapZodiacSign(sign: string): ZodiacSign {
    const signMap: Record<string, ZodiacSign> = {
      'Aries': 'Aries',
      'Taurus': 'Tauro',
      'Gemini': 'Géminis',
      'Cancer': 'Cáncer',
      'Leo': 'Leo',
      'Virgo': 'Virgo',
      'Libra': 'Libra',
      'Scorpio': 'Escorpio',
      'Sagittarius': 'Sagitario',
      'Capricorn': 'Capricornio',
      'Aquarius': 'Acuario',
      'Pisces': 'Piscis',
      // Nombres en español ya incluidos
      'Tauro': 'Tauro',
      'Géminis': 'Géminis',
      'Cáncer': 'Cáncer',
      'Escorpio': 'Escorpio',
      'Sagitario': 'Sagitario',
      'Capricornio': 'Capricornio',
      'Acuario': 'Acuario'
    };
    
    return signMap[sign] || 'Aries';
  }

  /**
   * Mapea nombres de aspectos a tipos válidos
   */
  private static mapAspectName(name: string): AspectName {
    const aspectMap: Record<string, AspectName> = {
      'conjunction': 'Conjunción',
      'opposition': 'Oposición',
      'square': 'Cuadratura',
      'trine': 'Trígono',
      'sextile': 'Sextil',
      'quincunx': 'Quincuncio',
      'semisextile': 'Semisextil',
      'sesquiquadrate': 'Sesquicuadratura',
      'semisquare': 'Semicuadratura',
      'quintile': 'Quintil',
      'biquintile': 'Biquintil'
    };
    
    return aspectMap[name.toLowerCase()] || 'Conjunción';
  }

  /**
   * Formatea grados con precisión
   */
  private static formatDegree(degree: number): string {
    const deg = Math.floor(degree % 30);
    const min = Math.floor((degree % 1) * 60);
    const sec = Math.floor(((degree % 1) * 60 % 1) * 60);
    return `${deg}°${min}'${sec}"`;
  }
}

/**
 * Servicio de utilidades generales para la agenda
 */
export class AgendaUtilsService {
  static formatSpanishDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  static determineLocation(lat: number, lon: number): string {
    const knownLocations = [
      { lat: 40.4164, lon: -3.7025, name: 'Madrid, España' },
      { lat: 41.3851, lon: 2.1734, name: 'Barcelona, España' },
      { lat: 40.7128, lon: -74.0060, name: 'Nueva York, Estados Unidos' },
      { lat: 51.5074, lon: -0.1278, name: 'Londres, Reino Unido' },
      { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' }
    ];

    let closestLocation = 'Ubicación personalizada';
    let minDistance = Infinity;

    knownLocations.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
      );

      if (distance < minDistance && distance < 0.1) {
        minDistance = distance;
        closestLocation = location.name;
      }
    });

    return closestLocation;
  }

  static validateBirthData(data: Partial<BirthDataRequest>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.birthDate) errors.push('Se requiere fecha de nacimiento');
    if (data.latitude === undefined) errors.push('Se requiere latitud');
    if (data.longitude === undefined) errors.push('Se requiere longitud');

    if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
      errors.push('Latitud debe estar entre -90 y 90');
    }

    if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
      errors.push('Longitud debe estar entre -180 y 180');
    }

    return { valid: errors.length === 0, errors };
  }
}

/**
 * Servicio para generación de contenido de la agenda
 */
export class ContentGeneratorService {
  static generateSampleLunarPhases(): LunarPhase[] {
    return [
      { fecha: '2025-01-13', tipo: 'Luna Llena', signo: 'Cáncer', grado: 23 },
      { fecha: '2025-01-29', tipo: 'Luna Nueva', signo: 'Acuario', grado: 9 },
      { fecha: '2025-02-12', tipo: 'Luna Llena', signo: 'Leo', grado: 24 },
      { fecha: '2025-02-27', tipo: 'Luna Nueva', signo: 'Piscis', grado: 9 },
      { fecha: '2025-03-14', tipo: 'Luna Llena', signo: 'Virgo', grado: 24 },
      { fecha: '2025-03-29', tipo: 'Luna Nueva', signo: 'Aries', grado: 9 }
    ];
  }

  static generatePersonalizedAnalysis(hasNatalData: boolean, hasProgressedData: boolean): AnalysisSection {
    return {
      enfoquesPrincipales: [
        'Propósito evolutivo y destino del alma',
        'Sanación emocional y liberación kármica',
        'Manifestación consciente y abundancia',
        'Relaciones y conexiones significativas'
      ],
      temasPredominantes: hasNatalData ? [
        'Análisis basado en carta natal disponible',
        hasProgressedData ? 'Evolución anual integrada' : 'Enfoque en patrones natales'
      ] : [
        'Análisis general personalizado',
        'Enfoque en crecimiento espiritual'
      ],
      recomendacionesClave: [
        'Conectar con los ciclos lunares para mayor armonía',
        'Utilizar los períodos retrógrados para reflexión profunda',
        'Honrar tu naturaleza astrológica única',
        'Integrar sabiduría cósmica en decisiones diarias'
      ]
    };
  }

  static generateRituals(year: number): RitualsSection {
    return {
      lunasNuevas: [
        'Ritual de intenciones en luna nueva: Escribir 3 deseos específicos',
        'Meditación de manifestación con velas blancas',
        'Diario de gratitud y visión del futuro'
      ],
      lunasLlenas: [
        'Ritual de liberación en luna llena: Quemar lo que ya no sirve',
        'Baño purificador con sal marina y aceites esenciales',
        'Celebración de logros y reconocimiento personal'
      ],
      estaciones: [
        `Ritual de año nuevo ${year}: Renovación de propósitos`,
        'Ritual de equinoccio: Equilibrio entre luz y sombra',
        'Ritual de solsticio: Honrar los ciclos naturales'
      ],
      afirmaciones: [
        'Confío en el timing perfecto del universo',
        'Estoy alineado/a con mi propósito más elevado',
        'Abrazo los cambios como oportunidades de crecimiento',
        'Soy un canal de amor, sabiduría y abundancia'
      ]
    };
  }
}