// src/app/api/prokerala/natal-chart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
function translatePlanetNameToSpanish(englishName: string): string {
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
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    // Log received parameters
    console.log('Natal chart request:', { birthDate, birthTime, latitude, longitude, timezone });
    
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
      const offset = getTimezoneOffset(timezone || 'UTC');
      const datetime = `${birthDate}T${formattedBirthTime}${offset}`;
      
      // Create URL with parameters in the exact format needed
      const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', `${latitude},${longitude}`);
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '0');
      
      console.log('Prokerala natal chart request URL:', url.toString());
      
      // Make the request
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      // Process the response
      const chartData = processChartData(response.data, latitude, longitude, timezone || 'UTC');
      
      return NextResponse.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error requesting natal chart from Prokerala:', error);
      
      // Generate fallback data
      const fallbackData = generateFallbackChart(birthDate, birthTime, latitude, longitude, timezone || 'UTC');
      
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
function processChartData(apiResponse: unknown, latitude: number, longitude: number, timezone: string) {
  const data = apiResponse as any;

  // Process planets
  const planets = (data.planets || []).map((planet: unknown) => {
    const p = planet as any;
    return {
      name: translatePlanetNameToSpanish(p.name),
      sign: p.sign || getSignNameFromLongitude(p.longitude),
      degree: Math.floor(p.longitude % 30),
      minutes: Math.floor((p.longitude % 1) * 60),
      retrograde: p.is_retrograde || false,
      housePosition: p.house || 1
    };
  });

  // Process houses
  const houses = (data.houses || []).map((house: unknown) => {
    const h = house as any;
    return {
      number: h.number,
      sign: h.sign || getSignNameFromLongitude(h.longitude),
      degree: Math.floor(h.longitude % 30),
      minutes: Math.floor((h.longitude % 1) * 60)
    };
  });

  // Process aspects
  const aspects = (data.aspects || []).map((aspect: unknown) => {
    const a = aspect as any;
    return {
      planet1: a.planet1?.name ? translatePlanetNameToSpanish(a.planet1.name) : '',
      planet2: a.planet2?.name ? translatePlanetNameToSpanish(a.planet2.name) : '',
      type: a.aspect?.name || a.type || 'conjunction',
      orb: a.orb || 0
    };
  });

  // Extract ascendant and midheaven
  let ascendant;
  if (data.ascendant) {
    ascendant = {
      sign: data.ascendant.sign || getSignNameFromLongitude(data.ascendant.longitude),
      degree: Math.floor(data.ascendant.longitude % 30),
      minutes: Math.floor((data.ascendant.longitude % 1) * 60)
    };
  }

  let midheaven;
  if (data.mc) {
    midheaven = {
      sign: data.mc.sign || getSignNameFromLongitude(data.mc.longitude),
      degree: Math.floor(data.mc.longitude % 30),
      minutes: Math.floor((data.mc.longitude % 1) * 60)
    };
  }

  // Calculate distributions
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);

  // Return formatted chart data
  return {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: data.datetime || ''
    },
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    elementDistribution,
    modalityDistribution,
    latitude,
    longitude,
    timezone
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
  timezone: string
) {
  console.log('Generating fallback natal chart for:', birthDate, birthTime);
  
  // Random generators
  const randomDegree = () => Math.floor(Math.random() * 30);
  const randomMinutes = () => Math.floor(Math.random() * 60);
  const randomHouse = () => Math.floor(Math.random() * 12) + 1;
  
  // Use birth date as seed for consistent "random" values
  const seed = new Date(birthDate).getTime();
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);
  
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
    const signOffset = (index * 83) % 12;
    const signIndex = (seededRandom(12) + signOffset) % 12;
    
    return {
      name,
      sign: SIGNS[signIndex],
      degree: randomDegree(),
      minutes: randomMinutes(),
      retrograde: name !== 'Sol' && name !== 'Luna' && Math.random() < 0.3,
      housePosition: randomHouse()
    };
  });
  
  // Generate houses
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (seededRandom(12) + i) % 12;
    
    return {
      number: i + 1,
      sign: SIGNS[signIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    };
  });
  
  // Generate aspects
  const aspects = [];
  const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      if (Math.random() < 0.3) {
        const aspectType = aspectTypes[Math.floor(Math.random() * aspectTypes.length)];
        aspects.push({
          planet1: planets[i].name,
          planet2: planets[j].name,
          type: aspectType,
          orb: parseFloat((Math.random() * 5).toFixed(1))
        });
      }
    }
  }
  
  // Generate angles
  const ascSignIndex = seededRandom(12);
  const mcSignIndex = (ascSignIndex + 3) % 12;
  
  return {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: `${birthDate}T${birthTime || '00:00:00'}`
    },
    planets,
    houses,
    aspects,
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    },
    midheaven: {
      sign: SIGNS[mcSignIndex],
      degree: randomDegree(),
      minutes: randomMinutes()
    },
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets),
    latitude,
    longitude,
    timezone
  };
}

/**
 * Calculate element distribution (fire, earth, air, water)
 */
function calculateElementDistribution(planets: unknown[]): { fire: number; earth: number; air: number; water: number } {
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
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
function calculateModalityDistribution(planets: unknown[]): { cardinal: number; fixed: number; mutable: number } {
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  
  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;
  
  planets.forEach((planet: any) => {
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