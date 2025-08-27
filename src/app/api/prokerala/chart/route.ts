// src/app/api/prokerala/chart/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// URL correcta según la documentación actual
const TOKEN_ENDPOINT = 'https://api.prokerala.com/token';
const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';

// Usar variables de entorno exactamente como están definidas
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getAccessToken(): Promise<string> {
  try {
    console.log('Solicitando token de Prokerala...');
    console.log(`URL del token: ${TOKEN_ENDPOINT}`);
    console.log(`Client ID disponible: ${!!CLIENT_ID}`);
    console.log(`Client Secret disponible: ${!!CLIENT_SECRET}`);
    
    const response = await axios.post<TokenResponse>(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID || '',
        'client_secret': CLIENT_SECRET || '',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Respuesta del token:', response.status, response.statusText);
    
    if (!response.data || !response.data.access_token) {
      throw new Error('Respuesta de token inválida');
    }

    console.log('Token obtenido correctamente');
    return response.data.access_token;
  } catch (error) {
    console.error('Error obteniendo token de acceso de Prokerala:');
    
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Mensaje:', error.message);
      if (error.response?.data) {
        console.error('Datos de respuesta:', error.response.data);
      }
    } else if (error instanceof Error) {
      console.error('Error no Axios:', error.message);
    }
    
    throw new Error('No se pudo autenticar con la API de Prokerala');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude, timezone } = body;
    
    console.log('Datos recibidos:', { birthDate, birthTime, latitude, longitude, timezone });
    
    // Verificar si faltan credenciales
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Credenciales de Prokerala no encontradas en variables de entorno');
      return NextResponse.json(
        { error: 'Faltan credenciales de Prokerala. Verifica tus variables de entorno.' },
        { status: 500 }
      );
    }
    
    // Obtener token
    const token = await getAccessToken();
    
    // ---- PRIMERA PRUEBA: BUSCAR PLANETAS (ENDPOINT MÁS SIMPLE) ----
    try {
      console.log("Probando endpoint de posición planetaria...");
      const planetUrl = new URL(`${PROKERALA_API_BASE_URL}/astrology/planet-position`);
      planetUrl.searchParams.append('datetime', `${birthDate}T${birthTime}Z`);
      planetUrl.searchParams.append('coordinates', `${latitude},${longitude}`);
      planetUrl.searchParams.append('ayanamsa', 'lahiri');
      
      console.log('URL de solicitud de planetas:', planetUrl.toString());
      
      const planetResponse = await axios.get(planetUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('Respuesta recibida para posición planetaria');
      return NextResponse.json({
        type: 'planet_position',
        data: planetResponse.data
      });
    } catch (planetError) {
      console.error('Error con endpoint de posición planetaria:');
      if (axios.isAxiosError(planetError)) {
        console.error('Status:', planetError.response?.status);
        console.error('Error de datos:', planetError.response?.data);
      }
      
      // Si falla, intentamos con la carta occidental
      console.log("Probando endpoint de astrología occidental...");
    }
    
    // ---- SEGUNDA PRUEBA: PROBAR CON ASTROLOGÍA OCCIDENTAL ----
    try {
      const westernUrl = new URL(`${PROKERALA_API_BASE_URL}/astrology/western-horoscope`);
      westernUrl.searchParams.append('datetime', `${birthDate}T${birthTime}Z`);
      westernUrl.searchParams.append('coordinates', `${latitude},${longitude}`);
      
      console.log('URL de solicitud de astrología occidental:', westernUrl.toString());
      
      const westernResponse = await axios.get(westernUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('Respuesta recibida para astrología occidental');
      return NextResponse.json({
        type: 'western_horoscope',
        data: westernResponse.data
      });
    } catch (westernError) {
      console.error('Error con endpoint de astrología occidental:');
      if (axios.isAxiosError(westernError)) {
        console.error('Status:', westernError.response?.status);
        console.error('Error de datos:', westernError.response?.data);
      }
      
      // Si todo falla, generamos datos simulados
      console.log("Todos los endpoints fallaron. Generando datos simulados...");
    }
    
    // ---- FALLBACK: GENERAR DATOS SIMULADOS ----
    console.log('Generando carta natal simulada como respaldo');
    const simulatedChart = generateSimulatedChart(birthDate, birthTime, latitude, longitude, timezone);
    
    return NextResponse.json({
      type: 'simulated',
      data: simulatedChart
    });
  } catch (error) {
    console.error('Error obteniendo carta natal:');
    
    // Proporcionar detalles más específicos sobre el error
    let errorMessage = 'Error al obtener carta natal';
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errors) {
        // Extraer mensajes de error específicos de la API de Prokerala
        const errors = error.response.data.errors;
        errorMessage = errors.map((err: { title: string; detail: string }) => `${err.title}: ${err.detail}`).join('; ');
      } else {
        errorMessage = error.response?.data?.error || error.message;
      }
      
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      if (error.response?.data) {
        console.error('Datos de respuesta:', error.response.data);
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error no Axios:', error.message);
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

/**
 * Genera una carta natal simulada como respaldo cuando la API no funciona
 */
function generateSimulatedChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  const SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const PLANETS = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón',
    'Quirón', 'Nodo Norte'
  ];
  
  // Usar la fecha para generar datos pseudoaleatorios pero consistentes
  const seed = new Date(birthDate + 'T' + birthTime).getTime();
  const seedRandom = (max: number) => Math.floor((seed % 10000) / 10000 * max);
  
  // Generar posiciones planetarias
  const planets = PLANETS.map((name, index) => {
    const signIndex = (seedRandom(12) + index) % 12;
    const degree = seedRandom(30);
    const retrograde = name !== 'Sol' && name !== 'Luna' && seedRandom(10) > 7;
    
    return {
      name,
      sign: SIGNS[signIndex],
      degree,
      minutes: seedRandom(60),
      retrograde,
      housePosition: (index % 12) + 1
    };
  });
  
  // Generar casas
  const houses = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (seedRandom(12) + i) % 12;
    return {
      number: i + 1,
      sign: SIGNS[signIndex],
      degree: seedRandom(30),
      minutes: seedRandom(60)
    };
  });
  
  // Generar algunos aspectos
  const aspects = [];
  for (let i = 0; i < 10; i++) {
    const planet1Index = i % PLANETS.length;
    const planet2Index = (i + 3) % PLANETS.length;
    if (planet1Index !== planet2Index) {
      aspects.push({
        planet1: PLANETS[planet1Index],
        planet2: PLANETS[planet2Index],
        type: ['conjunction', 'trine', 'square', 'opposition'][i % 4],
        orb: (seedRandom(100) / 10).toFixed(1),
        applying: seedRandom(10) > 5
      });
    }
  }
  
  // Generar ascendente y medio cielo
  const ascSignIndex = seedRandom(12);
  const mcSignIndex = (ascSignIndex + 3) % 12;
  
  return {
    birthData: {
      datetime: `${birthDate}T${birthTime}`,
      timezone,
      latitude,
      longitude
    },
    planets,
    houses,
    aspects,
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: seedRandom(30),
      minutes: seedRandom(60)
    },
    midheaven: {
      sign: SIGNS[mcSignIndex],
      degree: seedRandom(30),
      minutes: seedRandom(60)
    }
  };
}