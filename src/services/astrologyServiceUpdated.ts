import axios from 'axios';
import prokeralaService from './prokeralaService';

// Tipos para las posiciones planetarias
export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  minutes: number;
  retrograde: boolean;
  housePosition: number;
}

// Interfaces para eventos astrológicos
interface AstronomicalEvent {
  type: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  phase?: string;
  planet?: string;
  sign?: string;
  description?: string;
}

interface AstronomicalEvents {
  events: AstronomicalEvent[];
}

// Tipos para las casas astrológicas
export interface House {
  number: number;
  sign: string;
  degree: number;
  minutes: number;
}

// Tipos para los aspectos entre planetas
export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  applying: boolean;
}

// Tipo para la carta natal completa
export interface NatalChart {
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  ascendant?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
    minutes: number;
  };
  latitude: number;
  longitude: number;
  timezone: string;
}

// Tipo para la carta progresada
export interface ProgressedChart extends NatalChart {
  progressionDate: string; // Fecha para la que se calculó la progresión
}

// Listas de planetas y signos para mapeo y fallback
const PLANETS = [
  'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
  'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
];

const PLANETS_EN = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

const SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const SIGNS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ASPECT_TYPES = {
  'conjunction': 'Conjunción',
  'sextile': 'Sextil',
  'square': 'Cuadratura',
  'trine': 'Trígono',
  'opposition': 'Oposición',
  'quincunx': 'Quincuncio'
};

// Función para traducir nombres de planetas del inglés al español
const translatePlanetName = (englishName: string): string => {
  const index = PLANETS_EN.findIndex(p => p.toLowerCase() === englishName.toLowerCase());
  return index >= 0 ? PLANETS[index] : englishName;
};

// Función para traducir nombres de signos del inglés al español
const translateSignName = (englishName: string): string => {
  const index = SIGNS_EN.findIndex(s => s.toLowerCase() === englishName.toLowerCase());
  return index >= 0 ? SIGNS[index] : englishName;
};

// API gratuita para fases lunares
export async function getMoonPhases(startDate: string, endDate: string): Promise<any | null> {
  try {
    const response = await axios.get(`https://www.icalendar37.net/lunar/api/?start_date=${startDate}&end_date=${endDate}&format=json`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo fases lunares:', error);
    return null;
  }
}

// Función principal para obtener la carta natal usando Prokerala API
export async function getNatalChart(
  birthDate: string,
  birthTime: string | undefined,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<NatalChart> {
  // Usar la hora por defecto si no se proporciona
  const formattedBirthTime = birthTime || '00:00';
  
  try {
    // Formatear la fecha y hora para la API de Prokerala
    const datetime = `${birthDate}T${formattedBirthTime}`;
    
    // Intentar obtener datos de Prokerala
    const prokeralaData = await prokeralaService.getNatalHoroscope(
      datetime, 
      latitude, 
      longitude, 
      timezone
    );
    
    if (prokeralaData) {
      console.log('Usando datos de Prokerala API');
      return prokeralaService.convertProkeralaToNatalChart(prokeralaData, latitude, longitude, timezone);
    }
    
    // Si no funciona Prokerala, caer en los servicios de fallback
    console.log('Prokerala API no disponible, usando servicios de fallback');
    return generateEnhancedNatalChart(birthDate, formattedBirthTime, latitude, longitude, timezone);
  } catch (error) {
    console.error('Error obteniendo carta natal:', error);
    // Si hay un error, usar el generador simulado
    return generateEnhancedNatalChart(birthDate, formattedBirthTime, latitude, longitude, timezone);
  }
}

// Función para obtener eventos astrológicos usando Prokerala
export async function getAstronomicalEvents(startDate: string, endDate: string): Promise<AstronomicalEvents> {
  try {
    // Intentar obtener eventos de Prokerala API
    const prokeralaEvents = await prokeralaService.getAstronomicalEvents(startDate, endDate);
    
    if (prokeralaEvents && prokeralaEvents.events && prokeralaEvents.events.length > 0) {
      console.log('Usando eventos de Prokerala API');
      
      // Convertir el formato de Prokerala al formato de nuestra aplicación
      const events = prokeralaEvents.events.map((event: any) => {
        return {
          type: event.type,
          date: event.date,
          startDate: event.start_date,
          endDate: event.end_date,
          phase: event.phase,
          planet: event.planet ? translatePlanetName(event.planet) : undefined,
          sign: event.sign ? translateSignName(event.sign) : undefined,
          description: event.description
        };
      });
      
      return { events };
    }
    
    // Intentar obtener fases lunares (API gratuita que ya estaba en uso)
    const moonPhasesResponse = await getMoonPhases(startDate, endDate);
    
    if (moonPhasesResponse && moonPhasesResponse.phase) {
      console.log('Usando datos de fases lunares');
      const moonEvents: AstronomicalEvent[] = [];
      
      Object.entries(moonPhasesResponse.phase).forEach(([date, phaseData]: [string, any]) => {
        if (phaseData.phase_name) {
          moonEvents.push({
            type: 'LunarPhase',
            date,
            phase: phaseData.phase_name,
            sign: getSignForDate(date),
            description: `Luna ${phaseData.phase_name} en ${getSignForDate(date)}`
          });
        }
      });
      
      return { events: moonEvents };
    }
    
    // Si no hay datos de ninguna API, usar el generador simulado
    console.log('Usando generación simulada para eventos astrológicos');
    return generateSimulatedEvents(startDate, endDate);
  } catch (error) {
    console.error('Error al obtener eventos astrológicos:', error);
    // Usar simulación como respaldo
    return generateSimulatedEvents(startDate, endDate);
  }
}

// Función para obtener interpretaciones de posiciones planetarias
export function getPlanetaryInterpretation(
  planet: string,
  sign: string,
  house: number
): string {
  // Interpretaciones básicas de planetas en signos
  const signInterpretations: Record<string, Record<string, string>> = {
    'Sol': {
      'Aries': 'Tu esencia es valiente, pionera y directa. Te identificas con tomar la iniciativa y ser líder.',
      'Tauro': 'Tu esencia es práctica, sensual y determinada. Valoras la estabilidad y la seguridad.',
      'Géminis': 'Tu esencia es curiosa, versátil y comunicativa. Te expresas con ingenio y adaptabilidad.',
      'Cáncer': 'Tu esencia es sensible, protectora y emocional. Tu identidad está vinculada al hogar y la familia.',
      'Leo': 'Tu esencia es creativa, orgullosa y carismática. Te identificas con expresarte y brillar.',
      'Virgo': 'Tu esencia es analítica, servicial y perfeccionista. Valoras el orden y la eficiencia.',
      'Libra': 'Tu esencia es diplomática, equilibrada y relacional. Te identificas a través de tus conexiones.',
      'Escorpio': 'Tu esencia es intensa, profunda y transformadora. Buscas la verdad oculta.',
      'Sagitario': 'Tu esencia es aventurera, optimista y filosófica. Buscas expandir tus horizontes.',
      'Capricornio': 'Tu esencia es ambiciosa, disciplinada y responsable. Valoras el logro y la estructura.',
      'Acuario': 'Tu esencia es innovadora, independiente y humanitaria. Valoras la originalidad.',
      'Piscis': 'Tu esencia es compasiva, intuitiva y soñadora. Te identificas con lo emocional y espiritual.'
    },
    'Luna': {
      'Aries': 'Tus emociones son rápidas, impulsivas y entusiastas. Reaccionas con pasión y necesitas independencia emocional.',
      'Tauro': 'Tus emociones son estables, sensuales y resistentes al cambio. Buscas seguridad emocional y confort.',
      'Géminis': 'Tus emociones son curiosas, variables y mentales. Necesitas comunicación y variedad para sentirte nutrido.',
      'Cáncer': 'Tus emociones son profundas, protectoras y fluctuantes. Eres muy sensible a tu entorno y al pasado.',
      'Leo': 'Tus emociones son cálidas, expresivas y orgullosas. Necesitas reconocimiento y atención.',
      'Virgo': 'Tus emociones son cautelosas, analíticas y prácticas. Necesitas orden y utilidad para sentirte seguro.',
      'Libra': 'Tus emociones son equilibradas, diplomáticas y relacionales. Necesitas armonía para sentirte bien.',
      'Escorpio': 'Tus emociones son intensas, profundas y transformadoras. Necesitas conexión íntima y honestidad.',
      'Sagitario': 'Tus emociones son optimistas, aventureras y expansivas. Necesitas libertad y significado.',
      'Capricornio': 'Tus emociones son reservadas, responsables y ambiciosas. Necesitas estructura y logros.',
      'Acuario': 'Tus emociones son desapegadas, originales y humanitarias. Necesitas espacio y causas significativas.',
      'Piscis': 'Tus emociones son sensibles, compasivas y fluidas. Necesitas conexión espiritual y escape creativo.'
    },
    // Más planetas con sus interpretaciones...
  };
  
  // Interpretaciones básicas de planetas en casas
  const houseInterpretations: Record<string, Record<number, string>> = {
    'Sol': {
      1: 'Expresas tu identidad a través de tu apariencia y personalidad. Eres consciente de cómo te proyectas.',
      2: 'Tu identidad está conectada con tus valores, posesiones y autoestima. Buscas seguridad material.',
      3: 'Tu identidad se expresa a través de la comunicación, el aprendizaje y tu entorno cercano.',
      4: 'Tu identidad se centra en tu hogar, familia y raíces. Buscas una base segura.',
      5: 'Tu identidad se expresa a través de la creatividad, el romance y la auto-expresión.',
      6: 'Tu identidad se enfoca en el servicio, la salud y la rutina diaria. Buscas ser útil y eficiente.',
      7: 'Tu identidad se desarrolla a través de las relaciones y asociaciones. Te defines con los demás.',
      8: 'Tu identidad se profundiza mediante transformaciones, crisis y recursos compartidos.',
      9: 'Tu identidad se expande a través de la educación superior, viajes y filosofía. Buscas significado.',
      10: 'Tu identidad se realiza a través de tu carrera, reputación y logros públicos.',
      11: 'Tu identidad se conecta con grupos, amistades y metas colectivas. Valoras la originalidad.',
      12: 'Tu identidad se desarrolla a través de la espiritualidad, el sacrificio y la conexión con lo universal.'
    },
    'Luna': {
      1: 'Expresas tus emociones abiertamente. Tu humor y estado emocional son evidentes para todos.',
      2: 'Tus emociones están conectadas con la seguridad material y los recursos. Buscas estabilidad emocional a través de lo tangible.',
      3: 'Tus emociones se expresan a través de la comunicación. Necesitas hablar de lo que sientes.',
      4: 'Tus emociones están profundamente vinculadas al hogar y la familia. Eres muy sensible a tu espacio privado.',
      5: 'Tus emociones se expresan creativamente. Necesitas juego, romance y atención para sentirte nutrido.',
      6: 'Tus emociones se canalizan a través del servicio y la rutina. Te sientes mejor cuando eres útil.',
      7: 'Tus emociones dependen mucho de tus relaciones. Buscas equilibrio emocional a través de los demás.',
      8: 'Tus emociones son intensas y transformadoras. Necesitas profundidad y autenticidad.',
      9: 'Tus emociones buscan expansión y significado. Te nutres con nuevas experiencias y filosofías.',
      10: 'Tus emociones están vinculadas a tu imagen pública y logros. Eres sensible a cómo te perciben.',
      11: 'Tus emociones se conectan con grupos y amistades. Necesitas causas y metas compartidas.',
      12: 'Tus emociones son profundas, intuitivas y a veces confusas. Eres muy sensible a energías sutiles.'
    },
    // Más planetas con sus interpretaciones...
  };
  
  // Obtener interpretaciones o usar valores por defecto
  const signInterpretation = signInterpretations[planet]?.[sign] || 
    `${planet} en ${sign} indica una expresión de energía que combina las cualidades del planeta con las características del signo.`;
  
  const houseInterpretation = houseInterpretations[planet]?.[house] ||
    `${planet} en la casa ${house} muestra un área de la vida donde la energía de este planeta se manifiesta con mayor fuerza.`;
  
  return `${signInterpretation}\n\n${houseInterpretation}`;
}

// Función para generar una carta progresada usando Prokerala
export async function getProgressedChart(
  birthDate: string,
  birthTime: string | undefined,
  progressedDate: string,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<ProgressedChart | null> {
  try {
    // Formatear la fecha y hora para la API
    const formattedBirthTime = birthTime || '00:00';
    const datetime = `${progressedDate}T00:00:00`;
    
    // Intentar obtener posiciones planetarias para la fecha progresada
    const prokeralaData = await prokeralaService.getPlanetaryTransits(
      datetime,
      latitude,
      longitude,
      timezone
    );
    
    if (prokeralaData) {
      console.log('Usando datos de Prokerala para carta progresada');
      
      // Obtener la carta natal como base
      const natalChart = await getNatalChart(
        birthDate,
        formattedBirthTime,
        latitude,
        longitude,
        timezone
      );
      
      // Convertir datos de Prokerala al formato de nuestra aplicación
      const progressedData = prokeralaService.convertProkeralaToNatalChart(
        prokeralaData,
        latitude,
        longitude,
        timezone
      );
      
      // Combinar con la carta natal, priorizando los aspectos de la carta progresada
      return {
        ...natalChart,
        planets: progressedData.planets || natalChart.planets,
        aspects: progressedData.aspects || natalChart.aspects,
        progressionDate: progressedDate
      };
    }
    
    // Si no funciona Prokerala, usar métodos de fallback
    console.log('Usando métodos alternativos para carta progresada');
    
    // Obtener la carta natal como base
    const natalChart = await getNatalChart(
      birthDate, 
      formattedBirthTime, 
      latitude, 
      longitude, 
      timezone
    );
    
    // Calcular años de diferencia para la progresión
    const birthDateObj = new Date(birthDate);
    const progressedDateObj = new Date(progressedDate);
    const yearsDiff = progressedDateObj.getFullYear() - birthDateObj.getFullYear();
    
    // Progresar los planetas manualmente
    const progressedPlanets = natalChart.planets.map(planet => {
      // Diferentes planetas se mueven a diferentes velocidades
      let degreeProgression = 0;
      
      switch(planet.name) {
        case 'Sol':
        case 'Mercurio':
        case 'Venus':
          // Aproximadamente 1 grado por año
          degreeProgression = yearsDiff;
          break;
        case 'Luna':
          // La Luna se mueve más rápido, aproximadamente 12-13 grados por año
          degreeProgression = yearsDiff * 13;
          break;
        case 'Marte':
          // Marte se mueve un poco más lento
          degreeProgression = yearsDiff * 0.5;
          break;
        case 'Júpiter':
        case 'Saturno':
          // Planetas externos se mueven muy poco
          degreeProgression = yearsDiff * 0.1;
          break;
        default:
          // Planetas transpersonales casi no se mueven
          degreeProgression = yearsDiff * 0.05;
          break;
      }
      
      // Actualizar la posición del planeta
      return {
        ...planet,
        degree: (planet.degree + degreeProgression) % 30, // Asegurarse de que el grado esté en el rango de 0-30
      };
    });
    
    return {
      ...natalChart,
      planets: progressedPlanets,
      progressionDate: progressedDate
    };
  } catch (error) {
    console.error('Error obteniendo carta progresada:', error);
    return null; // Return null in case of error
  }
}
