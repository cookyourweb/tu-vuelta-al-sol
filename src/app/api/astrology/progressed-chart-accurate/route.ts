// src/app/api/astrology/progressed-chart-accurate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// API configuration
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

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
 * POST: Generate a progressed chart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone, progressionYear } = body;

    // Log received parameters
    console.log('Progressed chart request:', { birthDate, birthTime, latitude, longitude, timezone, progressionYear });

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

      // Create URL with parameters in the exact format needed for progressed chart
      const url = new URL(`${API_BASE_URL}/astrology/progression-chart`);
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', `${latitude},${longitude}`);
      url.searchParams.append('progression_year', progressionYear?.toString() || new Date().getFullYear().toString());
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '0'); // ✅ CRÍTICO: Usar Tropical (0) no Sideral (1)

      console.log('Prokerala progressed chart request URL:', url.toString());

      // Make the request
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // Process the response
      const chartData = processProgressedChartData(response.data, latitude, longitude, timezone || 'UTC', progressionYear);

      return NextResponse.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error requesting progressed chart from Prokerala:', error);

      // Generate fallback data
      const fallbackData = generateFallbackProgressedChart(birthDate, birthTime, latitude, longitude, timezone || 'UTC', progressionYear);

      return NextResponse.json({
        success: true,
        data: fallbackData,
        fallback: true,
        message: 'Using simulated progressed data due to API error'
      });
    }
  } catch (error) {
    console.error('General error processing progressed chart request:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request' },
      { status: 500 }
    );
  }
}

/**
 * Process progressed chart data from API response
 */
function processProgressedChartData(apiResponse: unknown, latitude: number, longitude: number, timezone: string, progressionYear?: number) {
  const data = apiResponse as any;

  // Process progressed planets
  const progressedPlanets = (data.planets || []).map((planet: unknown) => {
    const p = planet as any;
    return {
      name: translatePlanetNameToSpanish(p.name),
      sign: p.sign || getSignNameFromLongitude(p.longitude),
      degree: Math.floor(p.longitude % 30),
      minutes: Math.floor((p.longitude % 1) * 60),
      retrograde: p.is_retrograde || false,
      housePosition: p.house || 1,
      longitude: p.longitude
    };
  });

  // Process progressed houses
  const progressedHouses = (data.houses || []).map((house: unknown) => {
    const h = house as any;
    return {
      number: h.number,
      sign: h.sign || getSignNameFromLongitude(h.longitude),
      degree: Math.floor(h.longitude % 30),
      minutes: Math.floor((h.longitude % 1) * 60),
      longitude: h.longitude
    };
  });

  // Process progressed aspects
  const progressedAspects = (data.aspects || []).map((aspect: unknown) => {
    const a = aspect as any;
    return {
      planet1: a.planet1?.name ? translatePlanetNameToSpanish(a.planet1.name) : '',
      planet2: a.planet2?.name ? translatePlanetNameToSpanish(a.planet2.name) : '',
      type: a.aspect?.name || a.type || 'conjunction',
      orb: a.orb || 0,
      applying: a.is_applying || false
    };
  });

  // Extract progressed ascendant and midheaven
  let progressedAscendant;
  if (data.ascendant) {
    progressedAscendant = {
      sign: data.ascendant.sign || getSignNameFromLongitude(data.ascendant.longitude),
      degree: Math.floor(data.ascendant.longitude % 30),
      minutes: Math.floor((data.ascendant.longitude % 1) * 60),
      longitude: data.ascendant.longitude
    };
  }

  let progressedMidheaven;
  if (data.mc) {
    progressedMidheaven = {
      sign: data.mc.sign || getSignNameFromLongitude(data.mc.longitude),
      degree: Math.floor(data.mc.longitude % 30),
      minutes: Math.floor((data.mc.longitude % 1) * 60),
      longitude: data.mc.longitude
    };
  }

  // Return formatted progressed chart data
  return {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: data.datetime || '',
      progressionYear: progressionYear || new Date().getFullYear()
    },
    sol_progresado: progressedPlanets.find((p: any) => p.name === 'Sol'),
    luna_progresada: progressedPlanets.find((p: any) => p.name === 'Luna'),
    mercurio_progresado: progressedPlanets.find((p: any) => p.name === 'Mercurio'),
    venus_progresado: progressedPlanets.find((p: any) => p.name === 'Venus'),
    marte_progresado: progressedPlanets.find((p: any) => p.name === 'Marte'),
    jupiter_progresado: progressedPlanets.find((p: any) => p.name === 'Júpiter'),
    saturno_progresado: progressedPlanets.find((p: any) => p.name === 'Saturno'),
    urano_progresado: progressedPlanets.find((p: any) => p.name === 'Urano'),
    neptuno_progresado: progressedPlanets.find((p: any) => p.name === 'Neptuno'),
    pluton_progresado: progressedPlanets.find((p: any) => p.name === 'Plutón'),
    progressedHouses: progressedHouses,
    aspectos_natales_progresados: progressedAspects,
    progressedAscendant: progressedAscendant,
    progressedMidheaven: progressedMidheaven,
    latitude,
    longitude,
    timezone,
    progressionYear: progressionYear || new Date().getFullYear()
  };
}

/**
 * Generate fallback progressed chart when API fails
 */
function generateFallbackProgressedChart(
  birthDate: string,
  birthTime: string | undefined,
  latitude: number,
  longitude: number,
  timezone: string,
  progressionYear?: number
) {
  console.log('Generating fallback progressed chart for:', birthDate, birthTime, progressionYear);

  // Calculate age for progression
  const birth = new Date(birthDate);
  const currentYear = progressionYear || new Date().getFullYear();
  const age = currentYear - birth.getFullYear();

  // Use birth date and age as seed for consistent "random" values
  const seed = new Date(birthDate).getTime() + age;
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);

  // Zodiac signs
  const SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  // Elements and modalities for progressed planets
  const ELEMENTS = ['fire', 'earth', 'air', 'water'];
  const MODALITIES = ['cardinal', 'fixed', 'mutable'];

  // Generate progressed planets with age-based progression
  const generateProgressedPlanet = (planetName: string, baseSignIndex: number) => {
    // Progress planets approximately 1 degree per year
    const progressionDegrees = age;
    const progressedSignIndex = (baseSignIndex + Math.floor(progressionDegrees / 30)) % 12;
    const degree = Math.floor(progressionDegrees % 30);
    const minutes = Math.floor(seededRandom(60));

    return {
      name: planetName,
      sign: SIGNS[progressedSignIndex],
      house: Math.floor(seededRandom(12)) + 1,
      degree: degree,
      longitude: progressedSignIndex * 30 + degree + minutes / 60,
      retrograde: planetName !== 'Sol' && planetName !== 'Luna' && Math.random() < 0.3,
      element: ELEMENTS[progressedSignIndex % 4],
      mode: MODALITIES[progressedSignIndex % 3]
    };
  };

  // Generate progressed planets
  const progressedPlanets = [
    generateProgressedPlanet('Sol', seededRandom(12)),
    generateProgressedPlanet('Luna', (seededRandom(12) + 6) % 12), // Luna opuesta al Sol
    generateProgressedPlanet('Mercurio', seededRandom(12)),
    generateProgressedPlanet('Venus', seededRandom(12)),
    generateProgressedPlanet('Marte', seededRandom(12)),
    generateProgressedPlanet('Júpiter', seededRandom(12)),
    generateProgressedPlanet('Saturno', seededRandom(12)),
    generateProgressedPlanet('Urano', seededRandom(12)),
    generateProgressedPlanet('Neptuno', seededRandom(12)),
    generateProgressedPlanet('Plutón', seededRandom(12))
  ];

  // Generate aspects between natal and progressed planets
  const aspects = [];
  const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];

  for (let i = 0; i < progressedPlanets.length; i++) {
    for (let j = i + 1; j < progressedPlanets.length; j++) {
      if (Math.random() < 0.2) { // 20% chance of aspect
        const aspectType = aspectTypes[Math.floor(Math.random() * aspectTypes.length)];
        aspects.push({
          type: aspectType,
          planet1: progressedPlanets[i].name,
          planet2: progressedPlanets[j].name,
          orb: parseFloat((Math.random() * 5).toFixed(1)),
          applying: Math.random() < 0.5
        });
      }
    }
  }

  // Create the progressed chart object
  const progressedChart: any = {
    birthData: {
      latitude,
      longitude,
      timezone,
      datetime: `${birthDate}T${birthTime || '00:00:00'}`,
      progressionYear: currentYear
    },
    aspectos_natales_progresados: aspects,
    latitude,
    longitude,
    timezone,
    progressionYear: currentYear
  };

  // Add individual progressed planets
  progressedPlanets.forEach((planet: any) => {
    const key = `${planet.name.toLowerCase()}_progresado`;
    progressedChart[key] = planet;
  });

  return progressedChart;
}
