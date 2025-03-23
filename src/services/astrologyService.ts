// Servicio de astrología simulado sin dependencias externas

// Tipos para las posiciones planetarias
export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  minutes: number;
  retrograde: boolean;
  housePosition: number;
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
  latitude: number; // New property
  longitude: number; // New property
  timezone: string; // New property
}

// Tipo para la carta progresada
export interface ProgressedChart extends NatalChart {
  progressionDate: string; // Fecha para la que se calculó la progresión
}

// Listas de planetas y signos
const PLANETS = [
  'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
  'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
];

const SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

// Función simulada para generar una carta natal
export async function getNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<NatalChart> {
  // Usar la fecha de nacimiento como semilla para generar datos consistentes
  const dateObj = new Date(`${birthDate}T${birthTime}`);
  const seed = dateObj.getTime();
  
  // Generar posiciones planetarias
  const planets = generatePlanets(seed);
  
  // Generar casas astrológicas
  const houses = generateHouses(seed);
  
  // Asignar planetas a casas
  assignHousesToPlanets(planets, houses);
  
  // Generar aspectos entre planetas
  const aspects = generateAspects(planets);
  
  // Generar ascendente y medio cielo
  const ascendant = generateAscendant(seed);
  const midheaven = generateMidheaven(ascendant);
  
  return {
      planets,
      houses,
      aspects,
      ascendant,
      midheaven,
      latitude, // Include latitude
      longitude, // Include longitude
      timezone // Include timezone
  };
}

// Función simulada para generar una carta progresada
export async function getProgressedChart(
  birthDate: string,
  birthTime: string,
  progressedDate: string,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<ProgressedChart> {
  // Obtener la carta natal como base
  const natalChart = await getNatalChart(
    birthDate, 
    birthTime, 
    latitude, 
    longitude, 
    timezone
  );
  
  // Calcular años de diferencia para la progresión
  const birthDateObj = new Date(birthDate);
  const progressedDateObj = new Date(progressedDate);
  const yearsDiff = progressedDateObj.getFullYear() - birthDateObj.getFullYear();
  
  // Progresar los planetas
  const progressedPlanets = natalChart.planets.map(planet => {
    // Avanzar cada planeta aproximadamente 1 grado por año
    let newDegree = planet.degree + yearsDiff;
    let newSignIndex = SIGNS.indexOf(planet.sign);
    
    // Ajustar el signo si el planeta cambia de signo
    while (newDegree >= 30) {
      newDegree -= 30;
      newSignIndex = (newSignIndex + 1) % 12;
    }
    
    return {
      ...planet,
      sign: SIGNS[newSignIndex],
      degree: newDegree,
      // Posibilidad de cambio en el estado retrógrado
      retrograde: yearsDiff % 2 === 0 ? planet.retrograde : !planet.retrograde
    };
  });
  
  // Generar nuevos aspectos para la carta progresada
  const progressedAspects = generateAspects(progressedPlanets);
  
  return {
    ...natalChart,
    planets: progressedPlanets,
    aspects: progressedAspects,
    progressionDate: progressedDate
  };
}

// Función para generar posiciones planetarias
function generatePlanets(seed: number): PlanetPosition[] {
  return PLANETS.map((planet, index) => {
    // Usar el índice del planeta y la semilla para generar una posición consistente
    const randomValue = (seed + index * 1000) % 360;
    const signIndex = Math.floor(randomValue / 30);
    
    return {
      name: planet,
      sign: SIGNS[signIndex],
      degree: Math.floor(randomValue % 30),
      minutes: Math.floor((seed + index * 100) % 60),
      retrograde: ((seed + index) % 5 === 0), // ~20% de probabilidad
      housePosition: 0 // Se llenará después
    };
  });
}

// Función para generar casas astrológicas
function generateHouses(seed: number): House[] {
  // Generar un ascendente (primera casa) basado en la semilla
  const ascHour = new Date(seed).getHours() % 12;
  const baseSignIndex = Math.floor(ascHour * 12 / 24);
  
  return Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const signIndex = (baseSignIndex + i) % 12;
    
    return {
      number: houseNumber,
      sign: SIGNS[signIndex],
      degree: Math.floor((seed + houseNumber * 1000) % 30),
      minutes: Math.floor((seed + houseNumber * 100) % 60)
    };
  });
}

// Función para asignar casas a planetas
function assignHousesToPlanets(planets: PlanetPosition[], houses: House[]): void {
  planets.forEach(planet => {
    const planetSignIndex = SIGNS.indexOf(planet.sign);
    
    // Buscar la casa correspondiente
    for (const house of houses) {
      const houseSignIndex = SIGNS.indexOf(house.sign);
      
      // Asignar si coincide el signo
      if (planetSignIndex === houseSignIndex) {
        planet.housePosition = house.number;
        return;
      }
    }
    
    // Si no hay coincidencia exacta, asignar a una casa cercana
    planet.housePosition = (planetSignIndex % 12) + 1;
  });
}

// Función para generar aspectos entre planetas
function generateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectTypes = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
  
  // Generar aspectos entre cada par de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      // No todos los pares tienen aspectos - decidir aleatoriamente
      if (Math.random() > 0.4) { // 60% de probabilidad de formar un aspecto
        const aspectType = aspectTypes[Math.floor(Math.random() * aspectTypes.length)];
        
        aspects.push({
          planet1: planets[i].name,
          planet2: planets[j].name,
          type: aspectType,
          orb: Math.floor(Math.random() * 8 * 10) / 10, // 0-8 grados con un decimal
          applying: Math.random() > 0.5 // 50% de probabilidad
        });
      }
    }
  }
  
  return aspects;
}

// Función para generar ascendente
function generateAscendant(seed: number) {
  const hourOfBirth = new Date(seed).getHours();
  // Usar la hora de nacimiento para determinar el ascendente
  // Aproximadamente cada 2 horas cambia el signo ascendente
  const signIndex = Math.floor((hourOfBirth % 24) * 12 / 24);
  
  return {
    sign: SIGNS[signIndex],
    degree: Math.floor((seed * 3) % 30),
    minutes: Math.floor((seed * 7) % 60)
  };
}

// Función para generar medio cielo
function generateMidheaven(ascendant: { sign: string; degree: number; minutes: number }) {
  // El medio cielo suele estar aproximadamente a 90° del ascendente
  const ascSignIndex = SIGNS.indexOf(ascendant.sign);
  const mcSignIndex = (ascSignIndex + 3) % 12; // Aproximadamente 90° (3 signos)
  
  return {
    sign: SIGNS[mcSignIndex],
    degree: (ascendant.degree + 15) % 30, // Desplazar ligeramente
    minutes: (ascendant.minutes + 30) % 60
  };
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
    // Se pueden añadir más planetas
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
    // Se pueden añadir más planetas
  };
  
  // Obtener interpretaciones o usar valores por defecto
  const signInterpretation = signInterpretations[planet]?.[sign] || 
    `${planet} en ${sign} indica una expresión de energía que combina las cualidades del planeta con las características del signo.`;
  
  const houseInterpretation = houseInterpretations[planet]?.[house] ||
    `${planet} en la casa ${house} muestra un área de la vida donde la energía de este planeta se manifiesta con mayor fuerza.`;
  
  return `${signInterpretation}\n\n${houseInterpretation}`;
}
