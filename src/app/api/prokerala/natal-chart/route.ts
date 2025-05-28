// src/app/api/prokerala/natal-chart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { formatProkeralaDateTime } from '@/utils/dateTimeUtils';

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
  
  // Use cached token if still valid
  if (tokenCache && tokenCache.expires > now + 60) {
    return tokenCache.token;
  }
  
  // Verify credentials
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Prokerala API credentials missing. Check environment variables.');
  }
  
  try {
    // Request new token
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
    
    // Store token in cache
    tokenCache = {
      token: response.data.access_token,
      expires: now + response.data.expires_in
    };
    
    console.log('Successfully obtained new Prokerala token');
    return tokenCache.token;
  } catch (error) {
    console.error('Error getting Prokerala token:', error);
    throw new Error('Authentication failed with Prokerala API');
  }
}

/**
 * Format timezone offset for API requests
 */
function getTimezoneOffset(timezone: string): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const formatted = formatter.format(date);
    const matches = formatted.match(/GMT([+-]\d+)/);
    
    if (matches && matches[1]) {
      const offset = matches[1];
      // Format to ensure +/-HH:MM format
      if (offset.length === 3) {
        return `${offset}:00`;
      }
      return offset.replace(/(\d{2})(\d{2})/, '$1:$2');
    }
    
    // Default to UTC if we can't determine
    return '+00:00';
  } catch (error) {
    console.warn('Error calculating timezone offset, using UTC:', error);
    return '+00:00';
  }
}

/**
 * Get sign name from longitude
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
 * Convert planet name from English to Spanish
 */
function translatePlanetName(englishName: string): string {
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
 * POST: Generate a natal chart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone, birthPlace } = body;
    
    // Log received parameters
    console.log('Natal chart request:', { birthDate, birthTime, latitude, longitude, timezone, birthPlace });
    
    // Validate required parameters
    if (!birthDate || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (birthDate, latitude, longitude)' },
        { status: 400 }
      );
    }
    
    try {
      // Get token
      const token = await getToken();
      
      // Format datetime with timezone
const formattedBirthTime = birthTime || '00:00:00';
const datetime = formatProkeralaDateTime(birthDate, formattedBirthTime, timezone || 'UTC');

// Create URL with parameters in the exact format needed using URLSearchParams
const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
const params = new URLSearchParams({
  'profile[datetime]': datetime,
  'profile[coordinates]': `${latitude},${longitude}`,
  'birth_time_unknown': 'false',
  'house_system': 'placidus',
  'orb': 'default',
  'birth_time_rectification': 'flat-chart',
  'aspect_filter': 'all',
  'la': 'es',
  'ayanamsa': '0'
});
url.search = params.toString();
      
      console.log('Prokerala natal chart request URL:', url.toString());
      
      // Make the request
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      // Process the response
      const chartData = processChartData(response.data, latitude, longitude, timezone || 'UTC', birthPlace);
      
      return NextResponse.json({
        success: true,
        data: chartData
      });
    } catch (error: any) {
      console.error('Error requesting natal chart from Prokerala:', error.message, error.response?.data);
      
      // Generate fallback data
      const fallbackData = generateFallbackChart(birthDate, birthTime, latitude, longitude, timezone || 'UTC', birthPlace);
      
      return NextResponse.json({
        success: true,
        data: fallbackData,
        fallback: true,
        message: 'Using simulated data due to API error'
      });
    }
  } catch (error) {
    console.error('General error processing natal chart request:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request' },
      { status: 500 }
    );
  }
}

/**
 * Process chart data from API response
 */
function processChartData(
  apiResponse: any,
  latitude: number,
  longitude: number,
  timezone: string,
  birthPlace?: string
) {
  // Process planets
  const planets = (apiResponse.planets || []).map((planet: any) => {
    const planetName = translatePlanetName(planet.name);
    const sign = planet.sign || getSignNameFromLongitude(planet.longitude);
    const degree = Math.floor(planet.longitude % 30);
    const minutes = Math.floor((planet.longitude % 1) * 60);
    
    return {
      name: planetName,
      sign,
      degree: `${degree}°${minutes}'`,
      longitude: planet.longitude,
      houseNumber: planet.house || 1,
      isRetrograde: planet.is_retrograde || false
    };
  });

  // Process houses
  const houses = (apiResponse.houses || []).map((house: any) => {
    const sign = house.sign || getSignNameFromLongitude(house.longitude);
    const degree = Math.floor(house.longitude % 30);
    const minutes = Math.floor((house.longitude % 1) * 60);
    
    return {
      number: house.number,
      sign,
      degree: `${degree}°${minutes}'`,
      longitude: house.longitude
    };
  });

  // Process aspects
  const aspects = (apiResponse.aspects || []).map((aspect: any) => {
    const planet1Name = aspect.planet1?.name ? translatePlanetName(aspect.planet1.name) : '';
    const planet2Name = aspect.planet2?.name ? translatePlanetName(aspect.planet2.name) : '';
    const aspectType = aspect.aspect?.name || aspect.type || 'conjunction';
    
    return {
      planet_one: {
        id: aspect.planet1?.id || 0,
        name: planet1Name
      },
      planet_two: {
        id: aspect.planet2?.id || 0,
        name: planet2Name
      },
      aspect: {
        id: aspect.aspect?.id || 0,
        name: aspectType
      },
      orb: aspect.orb || 0
    };
  });

  // Extract key aspects (most important ones)
  const keyAspects = aspects.filter((aspect: any) => {
    const majorAspects = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
    return majorAspects.includes(aspect.aspect.name);
  }).slice(0, 10);

  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  // Return formatted data
  return {
    planets,
    houses,
    aspects,
    elementDistribution,
    modalityDistribution,
    keyAspects,
    birthData: {
      latitude,
      longitude,
      timezone,
      birthPlace
    }
  };
}

/**
 * Generate fallback chart when API fails
 */
function generateFallbackChart(
  birthDate: string,
  birthTime: string | undefined,
  latitude: number,
  longitude: number,
  timezone: string,
  birthPlace?: string
) {
  console.log('Generating fallback natal chart for:', birthDate, birthTime);
  
  // Use birth date as seed for consistency
  const seed = new Date(birthDate).getTime();
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 10000 * max);
  
  // Zodiac signs
  const SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  // Planet names
  const PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón',
    'Quirón', 'Nodo Norte', 'Nodo Sur'
  ];
  
  // Generate planets
  const planets = PLANETS.map((name, index) => {
    const signIndex = (seededRandom(12) + index) % 12;
    const degree = seededRandom(30);
    const minutes = seededRandom(60);
    
    return {
      name,
      sign: SIGNS[signIndex],
      degree: `${degree}°${minutes}'`,
      longitude: signIndex * 30 + degree + minutes / 60,
      houseNumber: (index % 12) + 1,
      isRetrograde: name !== 'Sol' && name !== 'Luna' && (seededRandom(10) > 7)
    };
  });
  
  // Generate houses
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (seededRandom(12) + i) % 12;
    const degree = seededRandom(30);
    const minutes = seededRandom(60);
    
    return {
      number: i + 1,
      sign: SIGNS[signIndex],
      degree: `${degree}°${minutes}'`,
      longitude: signIndex * 30 + degree + minutes / 60
    };
  });
  
  // Generate aspects
  const aspects = [];
  const aspectTypes = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
  
  for (let i = 0; i < PLANETS.length; i++) {
    for (let j = i + 1; j < PLANETS.length; j++) {
      if (seededRandom(10) < 3) {
        const aspectType = aspectTypes[seededRandom(aspectTypes.length)];
        aspects.push({
          planet_one: {
            id: i + 1,
            name: PLANETS[i]
          },
          planet_two: {
            id: j + 1,
            name: PLANETS[j]
          },
          aspect: {
            id: aspectTypes.indexOf(aspectType) + 1,
            name: aspectType
          },
          orb: (seededRandom(50) / 10).toFixed(1)
        });
      }
    }
  }
  
  // Select key aspects (first 10)
  const keyAspects = aspects.slice(0, 10);
  
  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  return {
    planets,
    houses,
    aspects,
    elementDistribution,
    modalityDistribution,
    keyAspects,
    birthData: {
      latitude,
      longitude,
      timezone,
      birthPlace
    }
  };
}

/**
 * Calculate element distribution (fire, earth, air, water)
 */
function calculateElementDistribution(planets: any[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach(planet => {
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
 * Calculate modality distribution (cardinal, fixed, mutable)
 */
function calculateModalityDistribution(planets: any[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach(planet => {
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