// =============================================================================
// PLANET NAME UTILITIES - SOLUCIÓN PARA NOMBRES DE PLANETAS
// src/utils/planetNameUtils.ts
// =============================================================================
// ✅ SOLUCIONA: Problemas de búsqueda de planetas con nombres diferentes
// ✅ NORMALIZA: Nombres con tildes, variaciones, mayúsculas/minúsculas
// =============================================================================

export interface PlanetData {
  name: string;
  sign: string;
  house: number;
  degree: number;
  [key: string]: any;
}

// =============================================================================
// MAPPING COMPLETO DE NOMBRES DE PLANETAS
// =============================================================================

const PLANET_NAME_MAPPINGS: Record<string, string[]> = {
  // Planetas principales
  'Sol': ['Sol', 'Sun', 'sol', 'sun'],
  'Luna': ['Luna', 'Moon', 'luna', 'moon'],
  'Mercurio': ['Mercurio', 'Mercury', 'mercurio', 'mercury'],
  'Venus': ['Venus', 'venus'],
  'Marte': ['Marte', 'Mars', 'marte', 'mars'],
  'Jupiter': ['Jupiter', 'Júpiter', 'jupiter', 'júpiter', 'jup', 'Jup'],
  'Saturno': ['Saturno', 'Saturn', 'saturno', 'saturn'],
  'Urano': ['Urano', 'Uranus', 'urano', 'uranus'],
  'Neptuno': ['Neptuno', 'Neptune', 'neptuno', 'neptune'],
  'Pluton': ['Plutón', 'Pluto', 'plutón', 'pluto', 'pluto', 'Plutón'],

  // Asteroides
  'Lilith': ['Lilith', 'lilith', 'Lilith Negra', 'lilith negra'],
  'Chiron': ['Chiron', 'Quirón', 'chiron', 'quirón', 'Chiron', 'Quirón'],

  // Nodos lunares - ✅ FIX: Agregar variaciones "Nodo N/S Verdadero"
  'Nodo Norte': ['Nodo Norte', 'North Node', 'nodo norte', 'north node', 'Rahu', 'rahu', 'Nodo N Verdadero', 'nodo n verdadero', 'True North Node'],
  'Nodo Sur': ['Nodo Sur', 'South Node', 'nodo sur', 'south node', 'Ketu', 'ketu', 'Nodo S Verdadero', 'nodo s verdadero', 'True South Node'],
};

// =============================================================================
// PLANETAS ESPERADOS EN UNA CARTA COMPLETA
// =============================================================================

export const EXPECTED_PLANETS = [
  'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Jupiter', 'Saturno', 'Urano', 'Neptuno', 'Pluton'
];

export const EXPECTED_ASTEROIDS = ['Lilith', 'Chiron'];

export const EXPECTED_NODES = ['Nodo Norte', 'Nodo Sur'];

// =============================================================================
// FUNCIÓN PRINCIPAL: BUSCAR PLANETA POR NOMBRE
// =============================================================================

export function findPlanetByName(planets: PlanetData[], targetName: string): PlanetData | undefined {
  if (!planets || !Array.isArray(planets)) {
    console.warn(`[findPlanetByName] Invalid planets array:`, planets);
    return undefined;
  }

  // Normalizar el nombre objetivo
  const normalizedTarget = normalizePlanetName(targetName);

  console.log(`🔍 [findPlanetByName] Buscando: "${targetName}" (normalizado: "${normalizedTarget}")`);

  // Buscar coincidencia exacta primero
  let planet = planets.find(p => normalizePlanetName(p.name) === normalizedTarget);
  if (planet) {
    console.log(`✅ [findPlanetByName] Encontrado por coincidencia exacta: ${planet.name}`);
    return planet;
  }

  // Buscar en mappings - ✅ FIX: Buscar case-insensitive
  let possibleNames: string[] = [normalizedTarget];

  // Buscar en todas las keys del mapping para encontrar coincidencia
  for (const [canonicalName, aliases] of Object.entries(PLANET_NAME_MAPPINGS)) {
    // Verificar si el target coincide con algún alias
    if (aliases.some(alias => normalizePlanetName(alias) === normalizedTarget)) {
      possibleNames = aliases;
      console.log(`🔍 [findPlanetByName] Encontrado en mapping "${canonicalName}":`, possibleNames);
      break;
    }
  }

  console.log(`🔍 [findPlanetByName] Posibles nombres alternativos:`, possibleNames);

  for (const altName of possibleNames) {
    planet = planets.find(p => normalizePlanetName(p.name) === normalizePlanetName(altName));
    if (planet) {
      console.log(`✅ [findPlanetByName] Encontrado por nombre alternativo "${altName}": ${planet.name}`);
      return planet;
    }
  }

  // Búsqueda fuzzy por similitud
  planet = findBySimilarity(planets, normalizedTarget);
  if (planet) {
    console.log(`✅ [findPlanetByName] Encontrado por similitud: ${planet.name}`);
    return planet;
  }

  console.log(`❌ [findPlanetByName] NO ENCONTRADO: ${targetName}`);
  return undefined;
}

// =============================================================================
// NORMALIZAR NOMBRES DE PLANETAS
// =============================================================================

function normalizePlanetName(name: string): string {
  if (!name || typeof name !== 'string') return '';

  return name
    .toLowerCase()
    .trim()
    // Normalizar caracteres especiales
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/ñ/g, 'n')
    // Remover acentos
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    // Remover espacios extra y caracteres especiales
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, '');
}

// =============================================================================
// BÚSQUEDA POR SIMILITUD (FUZZY MATCHING)
// =============================================================================

function findBySimilarity(planets: PlanetData[], targetName: string): PlanetData | undefined {
  const normalizedTarget = normalizePlanetName(targetName);

  for (const planet of planets) {
    const normalizedPlanet = normalizePlanetName(planet.name);

    // Similitud exacta después de normalización
    if (normalizedPlanet === normalizedTarget) {
      return planet;
    }

    // Contiene el nombre
    if (normalizedPlanet.includes(normalizedTarget) || normalizedTarget.includes(normalizedPlanet)) {
      return planet;
    }

    // Similitud de Levenshtein básica
    if (levenshteinDistance(normalizedPlanet, normalizedTarget) <= 2) {
      return planet;
    }
  }

  return undefined;
}

// =============================================================================
// DISTANCIA DE LEVENSHTEIN (SIMILITUD DE CADENAS)
// =============================================================================

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

// =============================================================================
// DEBUG: LISTAR TODOS LOS PLANETAS DISPONIBLES
// =============================================================================

export function debugListPlanets(chartData: any): void {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🪐 PLANETAS DISPONIBLES EN CHARTDATA');
  console.log('═══════════════════════════════════════════════════════');

  if (!chartData?.planets || !Array.isArray(chartData.planets)) {
    console.log('❌ No planets array found in chartData');
    return;
  }

  const total = chartData.planets.length;
  console.log(`Total: ${total} planetas\n`);

  chartData.planets.forEach((planet: PlanetData, index: number) => {
    const emoji = getPlanetEmoji(planet.name);
    const house = planet.house || '?';
    const degree = planet.degree ? planet.degree.toFixed(1) : '?';
    console.log(`${index + 1 < 10 ? ' ' : ''}${index + 1}. ${emoji} ${planet.name} (${planet.sign} Casa ${house} - ${degree}°)`);
  });

  console.log('═══════════════════════════════════════════════════════\n');
}

// =============================================================================
// VERIFICAR PLANETAS ESPERADOS VS DISPONIBLES
// =============================================================================

export function verifyExpectedPlanets(chartData: any): {
  available: string[];
  missing: string[];
  extra: string[];
} {
  if (!chartData?.planets || !Array.isArray(chartData.planets)) {
    return {
      available: [],
      missing: [...EXPECTED_PLANETS, ...EXPECTED_ASTEROIDS, ...EXPECTED_NODES],
      extra: []
    };
  }

  const availableNames: string[] = (chartData.planets as PlanetData[]).map((p: PlanetData) => p.name);
  const normalizedAvailable: string[] = availableNames.map(normalizePlanetName);

  const allExpected = [...EXPECTED_PLANETS, ...EXPECTED_ASTEROIDS, ...EXPECTED_NODES];

  const missing: string[] = [];
  const available: string[] = [];

  for (const expected of allExpected) {
    const found = findPlanetByName(chartData.planets, expected);
    if (found) {
      available.push(expected);
    } else {
      missing.push(expected);
    }
  }

  // Encontrar planetas extra (no esperados)
  const expectedNormalized = allExpected.map(normalizePlanetName);
  const extra = normalizedAvailable
    .filter(name => !expectedNormalized.includes(name))
    .map(normalized => {
      // Encontrar el nombre original
      const index = normalizedAvailable.indexOf(normalized);
      return availableNames[index];
    });

  return { available, missing, extra };
}

// =============================================================================
// UTILIDADES DE FORMATO
// =============================================================================

function getPlanetEmoji(name: string): string {
  const normalized = normalizePlanetName(name);

  const emojiMap: Record<string, string> = {
    'sol': '☀️',
    'luna': '🌙',
    'mercurio': '☿️',
    'venus': '♀️',
    'marte': '♂️',
    'jupiter': '♃',
    'saturno': '♄',
    'urano': '⛢',
    'neptuno': '♆',
    'pluton': '♇',
    'lilith': '☄️',
    'chiron': '⚷',
    'nodo norte': '🌙↗️',
    'nodo sur': '🌙↘️'
  };

  return emojiMap[normalized] || '🪐';
}

// =============================================================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// =============================================================================

export {
  normalizePlanetName,
  PLANET_NAME_MAPPINGS
};
