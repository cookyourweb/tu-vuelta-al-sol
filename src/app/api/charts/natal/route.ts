// src/app/api/charts/natal/route.ts - VERSIÓN LIMPIA CON TOKEN BEARER
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import axios from 'axios';
// ✅ IMPORTAR FUNCIONES CORRECTAS
import { createProkeralaParams, type ProkeralaParams } from '@/utils/dateTimeUtils';

// ✅ Configuración de Prokerala usando variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_PROKERALA_API_BASE_URL;
const TOKEN_URL = process.env.NEXT_PUBLIC_PROKERALA_TOKEN_ENDPOINT;
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_PROKERALA_BEARER_TOKEN;

// Cache de token (para futuro uso con generación automática)
let tokenCache: { token: string; expires: number } | null = null;

async function getProkeralaToken(): Promise<string> {
  // Por ahora usar token estático, más tarde implementar generación automática
  if (BEARER_TOKEN) {
    return BEARER_TOKEN;
  }
  
  throw new Error('No se encontró token Bearer de Prokerala');
}

/**
 * ✅ LLAMAR A PROKERALA USANDO FUNCIONES CORREGIDAS
 */
async function callProkeralaAPI(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string
) {
  try {
    const token = await getProkeralaToken();
    
    // ✅ USAR FUNCIONES CORREGIDAS DE dateTimeUtils.ts
    const prokeralaParams: ProkeralaParams = {
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone,
      houseSystem: 'placidus',
      aspectFilter: 'all',
      language: 'es',
      ayanamsa: '0', // ✅ Tropical occidental
      birthTimeUnknown: false,
      birthTimeRectification: 'flat-chart',
      orb: 'default'
    };
    
    // ✅ CREAR PARÁMETROS CON LAS FUNCIONES CORRECTAS
    const urlParams = createProkeralaParams(prokeralaParams);
    
    // ✅ ENDPOINT CORRECTO: natal-aspect-chart
    const url = new URL(`${API_BASE_URL}/astrology/natal-aspect-chart`);
    url.search = urlParams.toString();
    
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    if (!response.data?.planets) {
      throw new Error('Respuesta inválida de Prokerala - no hay datos de planetas');
    }
    
    return processProkeralaData(response.data, latitude, longitude, timezone);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Error de autenticación con Prokerala');
      } else if (error.response?.status === 429) {
        throw new Error('Límite de solicitudes excedido');
      } else if (error.response && typeof error.response.status === 'number' && error.response.status >= 500) {
        throw new Error('Error del servidor de Prokerala');
      }
    }
    
    throw error;
  }
}

function processProkeralaData(apiResponse: any, latitude: number, longitude: number, timezone: string) {
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(longitude / 30) % 12];
  };
  
  const translatePlanet = (englishName: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Venus': 'Venus',
      'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno',
      'Uranus': 'Urano', 'Neptune': 'Neptuno', 'Pluto': 'Plutón',
      'Chiron': 'Quirón', 'North Node': 'Nodo Norte', 'South Node': 'Nodo Sur'
    };
    return translations[englishName] || englishName;
  };
  
  // Procesar planetas
  const planets = (apiResponse.planets || []).map((planet: any) => ({
    name: translatePlanet(planet.name || 'Unknown'),
    sign: planet.sign || getSignFromLongitude(planet.longitude || 0),
    degree: Math.floor((planet.longitude || 0) % 30),
    minutes: Math.floor(((planet.longitude || 0) % 1) * 60),
    retrograde: planet.is_retrograde || false,
    housePosition: planet.house || 1,
    longitude: planet.longitude || 0
  }));
  
  // Procesar casas
  const houses = (apiResponse.houses || []).map((house: any) => ({
    number: house.number || 1,
    sign: house.sign || getSignFromLongitude(house.longitude || 0),
    degree: Math.floor((house.longitude || 0) % 30),
    minutes: Math.floor(((house.longitude || 0) % 1) * 60),
    longitude: house.longitude || 0
  }));
  
  // Procesar aspectos
  const aspects = (apiResponse.aspects || []).map((aspect: any) => ({
    planet1: aspect.planet1?.name ? translatePlanet(aspect.planet1.name) : 'Unknown',
    planet2: aspect.planet2?.name ? translatePlanet(aspect.planet2.name) : 'Unknown',
    type: aspect.aspect?.name || aspect.type || 'conjunction',
    orb: aspect.orb || 0
  }));
  
  // Ascendente
  let ascendant;
  if (apiResponse.ascendant) {
    ascendant = {
      sign: apiResponse.ascendant.sign || getSignFromLongitude(apiResponse.ascendant.longitude || 0),
      degree: Math.floor((apiResponse.ascendant.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.ascendant.longitude || 0) % 1) * 60),
      longitude: apiResponse.ascendant.longitude || 0
    };
  }
  
  // Medio Cielo
  let midheaven;
  if (apiResponse.mc) {
    midheaven = {
      sign: apiResponse.mc.sign || getSignFromLongitude(apiResponse.mc.longitude || 0),
      degree: Math.floor((apiResponse.mc.longitude || 0) % 30),
      minutes: Math.floor(((apiResponse.mc.longitude || 0) % 1) * 60),
      longitude: apiResponse.mc.longitude || 0
    };
  }
  
  // Distribuciones
  const elementDistribution = calculateElementDistribution(planets);
  const modalityDistribution = calculateModalityDistribution(planets);
  
  return {
    birthData: { latitude, longitude, timezone, datetime: apiResponse.datetime || '' },
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

function calculateElementDistribution(planets: any[]) {
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
  
  if (total === 0) return { fire: 25, earth: 25, air: 25, water: 25 };
  
  return {
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    air: Math.round((counts.air / total) * 100),
    water: Math.round((counts.water / total) * 100)
  };
}

function calculateModalityDistribution(planets: any[]) {
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
  
  if (total === 0) return { cardinal: 33, fixed: 33, mutable: 34 };
  
  return {
    cardinal: Math.round((counts.cardinal / total) * 100),
    fixed: Math.round((counts.fixed / total) * 100),
    mutable: Math.round((counts.mutable / total) * 100)
  };
}

function generateFallbackChart(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string) {
  const seed = new Date(birthDate).getTime();
  const seededRandom = (max: number) => Math.floor((seed % 100000) / 100000 * max);
  
  const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
  
  const planets = PLANETS.map((name, index) => {
    const signIndex = (seededRandom(12) + index) % 12;
    return {
      name,
      sign: SIGNS[signIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60),
      retrograde: name !== 'Sol' && name !== 'Luna' && Math.random() < 0.3,
      housePosition: (index % 12) + 1
    };
  });
  
  const houses = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: SIGNS[(seededRandom(12) + i) % 12],
    degree: Math.floor(Math.random() * 30),
    minutes: Math.floor(Math.random() * 60)
  }));
  
  const ascSignIndex = seededRandom(12);
  
  return {
    birthData: { latitude, longitude, timezone, datetime: `${birthDate}T${birthTime}` },
    planets,
    houses,
    aspects: [],
    ascendant: {
      sign: SIGNS[ascSignIndex],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60)
    },
    midheaven: {
      sign: SIGNS[(ascSignIndex + 3) % 12],
      degree: Math.floor(Math.random() * 30),
      minutes: Math.floor(Math.random() * 60)
    },
    elementDistribution: calculateElementDistribution(planets),
    modalityDistribution: calculateModalityDistribution(planets),
    latitude,
    longitude,
    timezone
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el parámetro userId' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    const chart = await Chart.findOne({ userId });
    
    if (!chart || !chart.natalChart) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontró una carta natal para este usuario',
          message: 'Necesitas generar tu carta natal primero'
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Carta natal recuperada con éxito',
        natalChart: chart.natalChart 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al recuperar la carta natal'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    const result = await Chart.deleteOne({ userId });
    
    return NextResponse.json(
      { 
        success: true,
        message: result.deletedCount > 0 ? 'Carta natal eliminada' : 'No había carta para eliminar',
        deletedCount: result.deletedCount
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar la carta natal'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, regenerate = false } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de usuario' }, 
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se encontraron datos de nacimiento',
          message: 'Primero debes ingresar tus datos de nacimiento para generar la carta natal.'
        }, 
        { status: 404 }
      );
    }
    
    if (regenerate) {
      await Chart.deleteOne({ userId });
    } else {
      const existingChart = await Chart.findOne({ userId });
      
      if (existingChart && existingChart.natalChart) {
        return NextResponse.json(
          { 
            success: true,
            message: 'Ya existe una carta natal para este usuario',
            natalChart: existingChart.natalChart 
          },
          { status: 200 }
        );
      }
    }
    
    const birthDate = birthData.birthDate.toISOString().split('T')[0];
    const birthTime = birthData.birthTime || '12:00:00';
    const latitude = parseFloat(birthData.latitude);
    const longitude = parseFloat(birthData.longitude);
    const timezone = birthData.timezone || 'Europe/Madrid';
    
    try {
      const natalChart = await callProkeralaAPI(
        birthDate,
        birthTime,
        latitude,
        longitude,
        timezone
      );
      
      const chartData = {
        userId,
        birthDataId: birthData._id,
        natalChart,
        progressedCharts: [],
        lastUpdated: new Date()
      };
      
      await Chart.findOneAndUpdate(
        { userId },
        chartData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      return NextResponse.json(
        { 
          success: true,
          message: `Carta natal ${regenerate ? 'regenerada' : 'generada'} correctamente`,
          natalChart
        },
        { status: 200 }
      );
      
    } catch (apiError) {
      const fallbackChart = generateFallbackChart(birthDate, birthTime, latitude, longitude, timezone);
      
      const chartData = {
        userId,
        birthDataId: birthData._id,
        natalChart: fallbackChart,
        progressedCharts: [],
        lastUpdated: new Date()
      };
      
      await Chart.findOneAndUpdate(
        { userId },
        chartData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Carta natal generada con datos simulados debido a error de API',
          natalChart: fallbackChart,
          fallback: true
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}