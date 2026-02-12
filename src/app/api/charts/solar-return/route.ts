// src/app/api/charts/solar-return/route.ts
// ============================================================================
// ENDPOINT ESPECÍFICO PARA SOLAR RETURN (REVOLUCIÓN SOLAR)
// El Sol permanece FIJO en posición natal, cambian otros planetas y casas
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart from '@/models/Chart';
import axios from 'axios';
import * as Astronomy from 'astronomy-engine';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

// Configuración ProKerala (mismo patrón que natal/route.ts)
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';

// Cache de token compartido
let tokenCache: { token: string; expires: number } | null = null;

async function getProkeralaToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expires > now + 300) {
    return tokenCache.token;
  }

  const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
  const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Credenciales Prokerala faltantes');
  }

  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
  );

  if (!response.data?.access_token) {
    throw new Error('Respuesta de token inválida');
  }

  tokenCache = {
    token: response.data.access_token,
    expires: now + (response.data.expires_in || 3600)
  };
  return tokenCache.token;
}

/**
 * Calcular timezone offset
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  try {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();

    const getLastSunday = (year: number, month: number): Date => {
      const lastDay = new Date(year, month + 1, 0);
      const dayOfWeek = lastDay.getDay();
      const lastSunday = new Date(lastDay);
      lastSunday.setDate(lastDay.getDate() - dayOfWeek);
      return lastSunday;
    };

    if (timezone === 'Europe/Madrid' || timezone === 'Europe/Berlin' ||
        timezone === 'Europe/Paris' || timezone === 'Europe/Rome') {
      const dstStart = getLastSunday(year, 2);
      const dstEnd = getLastSunday(year, 9);
      dstStart.setUTCHours(2, 0, 0, 0);
      dstEnd.setUTCHours(2, 0, 0, 0);
      return (targetDate >= dstStart && targetDate < dstEnd) ? '+02:00' : '+01:00';
    }

    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Mexico_City': '-06:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };

    return staticTimezones[timezone] || '+00:00';
  } catch (error) {
    return '+00:00';
  }
}

/**
 * Calcular año de Solar Return
 */
function calculateSolarReturnYear(birthDate: Date): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  
  const thisYearBirthday = new Date(currentYear, birthMonth, birthDay);
  
  return today >= thisYearBirthday ? currentYear : currentYear - 1;
}

/**
 * Calcular período de Solar Return
 */
function calculateSolarReturnPeriod(birthDate: Date) {
  const returnYear = calculateSolarReturnYear(birthDate);
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  
  const startDate = new Date(returnYear, birthMonth, birthDay);
  const endDate = new Date(returnYear + 1, birthMonth, birthDay);
  
  const age = returnYear - birthDate.getFullYear();
  
  return {
    year: returnYear,
    startDate,
    endDate,
    ageAtStart: age,
    isCurrentYear: returnYear === new Date().getFullYear(),
    description: `Solar Return ${returnYear}-${returnYear + 1}`,
    period: `${startDate.toLocaleDateString('es-ES')} → ${endDate.toLocaleDateString('es-ES')}`
  };
}

/**
 * Calcular el momento EXACTO del Solar Return usando astronomy-engine
 * = momento en que el Sol transita vuelve a la misma longitud eclíptica natal
 */
function calculateExactSolarReturnMoment(birthDate: Date, returnYear: number): Date {
  // 1. Obtener longitud eclíptica del Sol natal
  const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, birthDate, false);
  const sunEcliptic = Astronomy.Ecliptic(sunVec);
  const natalSunLon = sunEcliptic.elon; // 0-360

  console.log(`🌞 [SR_CALC] Sol natal: ${natalSunLon.toFixed(4)}° eclíptica`);

  // 2. Buscar cuándo el Sol alcanza esa longitud en el año target
  // Empezar a buscar desde 10 días antes del cumpleaños aprox
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const searchStart = new Date(returnYear, birthMonth, birthDay - 10);

  const result = Astronomy.SearchSunLongitude(natalSunLon, searchStart, 30);

  if (!result) {
    throw new Error(`No se pudo calcular el momento exacto del Solar Return para ${returnYear}`);
  }

  const srMoment = result.date;
  console.log(`✅ [SR_CALC] Solar Return exacto: ${srMoment.toISOString()} (Sol a ${natalSunLon.toFixed(4)}°)`);

  return srMoment;
}

/**
 * Llamar a ProKerala para Solar Return
 * Usa el endpoint natal-planet-position (que FUNCIONA) con la fecha exacta del SR
 */
async function callProkeralaSolarReturn(birthData: any, returnYear: number) {
  try {
    // 1. Obtener token (con cache)
    const token = await getProkeralaToken();

    // 2. Calcular momento exacto del SR con astronomy-engine
    const birthDate = new Date(birthData.birthDate);
    const srMoment = calculateExactSolarReturnMoment(birthDate, returnYear);

    // 3. Formatear datetime del SR para ProKerala
    const srDateStr = srMoment.toISOString().split('T')[0];
    const srTimeStr = srMoment.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS

    const timezone = birthData.timezone || 'Europe/Madrid';
    const offset = calculateTimezoneOffset(srDateStr, timezone);
    const srDatetime = `${srDateStr}T${srTimeStr}${offset}`;

    // 4. Ubicación: actual si vive en otro lugar, sino natal
    const lat = birthData.livesInSamePlace === false && birthData.currentLatitude
      ? birthData.currentLatitude : birthData.latitude;
    const lng = birthData.livesInSamePlace === false && birthData.currentLongitude
      ? birthData.currentLongitude : birthData.longitude;
    const latFixed = Math.round(lat * 10000) / 10000;
    const lngFixed = Math.round(lng * 10000) / 10000;
    const coordinates = `${latFixed},${lngFixed}`;

    console.log('☀️ [SR_API] Solar Return params:', {
      srDatetime,
      srMomentUTC: srMoment.toISOString(),
      coordinates,
      coordinatesType: birthData.livesInSamePlace === false ? 'CURRENT' : 'NATAL',
      year: returnYear
    });

    // 5. Llamar al MISMO endpoint que la carta natal (este SÍ funciona)
    const url = new URL(`${API_BASE_URL}/astrology/natal-planet-position`);
    url.searchParams.append('profile[datetime]', srDatetime);
    url.searchParams.append('profile[coordinates]', coordinates);
    url.searchParams.append('birth_time_unknown', 'false');
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'major');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');

    console.log('🔗 [SR_API] URL:', url.toString());

    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const actualData = response.data?.data || response.data;

    if (!actualData?.planet_positions && !actualData?.planets) {
      console.error('❌ [SR_API] No hay datos de planetas en la respuesta');
      throw new Error('Respuesta inválida de ProKerala - no hay datos de planetas');
    }

    console.log('✅ [SR_API] ProKerala OK: planetas recibidos:', (actualData.planet_positions || actualData.planets)?.length);

    return { success: true, data: { data: actualData } };
  } catch (error) {
    console.error('❌ [SR_API] Error ProKerala Solar Return:', error instanceof Error ? error.message : error);
    if (axios.isAxiosError(error)) {
      console.error('❌ [SR_API] Status:', error.response?.status, 'Data:', JSON.stringify(error.response?.data)?.substring(0, 200));
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Procesar respuesta Solar Return
 */
function processSolarReturnResponse(apiData: any, solarReturnInfo: any) {
  const data = apiData?.data || apiData;
  
  const planetsData = data?.planet_positions || data?.planets || [];
  
  const processedPlanets = planetsData.map((planet: any) => {
    const name = translatePlanetName(planet.name || 'Unknown');
    const longitude = planet.longitude || 0;
    const sign = getSignFromLongitude(longitude);
    
    return {
      name,
      sign,
      degree: parseFloat((longitude % 30).toFixed(3)),
      house: planet.house || 1,
      longitude,
      retrograde: planet.is_retrograde || false
    };
  });

  const housesData = data?.houses || [];
  const processedHouses = housesData.map((house: any, index: number) => ({
    number: index + 1,
    sign: getSignFromLongitude(house.longitude || 0),
    degree: parseFloat(((house.longitude || 0) % 30).toFixed(3)),
    longitude: house.longitude || 0
  }));

  return {
    planets: processedPlanets,
    houses: processedHouses.length === 12 ? processedHouses : generateDefaultHouses(),
    aspects: [],
    elementDistribution: calculateElementDistribution(processedPlanets),
    modalityDistribution: calculateModalityDistribution(processedPlanets),
    ascendant: extractAscendant(data),
    midheaven: extractMidheaven(data),
    solarReturnInfo: {
      ...solarReturnInfo,
      type: 'solar_return_real',
      location: data?.location || 'N/A'
    },
    isFallback: false,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generar fallback Solar Return
 */
function generateSolarReturnFallback(solarReturnInfo: any) {
  return {
    planets: [
      { name: 'Sol', sign: 'Acuario', degree: 21.139, house: 12, longitude: 321.139, retrograde: false },
      { name: 'Luna', sign: 'Leo', degree: 16.5, house: 5, longitude: 136.5, retrograde: false },
      { name: 'Mercurio', sign: 'Acuario', degree: 21.3, house: 12, longitude: 321.3, retrograde: false },
      { name: 'Venus', sign: 'Aries', degree: 3.7, house: 1, longitude: 3.7, retrograde: false },
      { name: 'Marte', sign: 'Leo', degree: 18.4, house: 5, longitude: 138.4, retrograde: false },
      { name: 'Júpiter', sign: 'Géminis', degree: 11.3, house: 3, longitude: 71.3, retrograde: false },
      { name: 'Saturno', sign: 'Piscis', degree: 18.4, house: 1, longitude: 348.4, retrograde: false },
      { name: 'Urano', sign: 'Tauro', degree: 23.3, house: 2, longitude: 53.3, retrograde: false },
      { name: 'Neptuno', sign: 'Piscis', degree: 28.2, house: 1, longitude: 358.2, retrograde: false },
      { name: 'Plutón', sign: 'Acuario', degree: 2.3, house: 11, longitude: 302.3, retrograde: false }
    ],
    houses: generateDefaultHouses(),
    aspects: [],
    elementDistribution: { fire: 25, earth: 20, air: 35, water: 20 },
    modalityDistribution: { cardinal: 25, fixed: 50, mutable: 25 },
    ascendant: { sign: 'Libra', degree: 27, longitude: 207 },
    midheaven: { sign: 'Cáncer', degree: 15, longitude: 105 },
    solarReturnInfo: {
      ...solarReturnInfo,
      type: 'solar_return_fallback'
    },
    isFallback: true,
    generatedAt: new Date().toISOString()
  };
}

/**
 * GET: Obtener Solar Return existente
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || searchParams.get('userId');
    const force = searchParams.get('force') === 'true';
    const requestedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;

    if (!uid) {
      return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
    }

    const birthDataRaw = await BirthData.findOne({
      $or: [{ uid }, { userId: uid }]
    }).lean();

    const birthData = castBirthData(birthDataRaw);

    if (!birthData) {
      return NextResponse.json({ error: 'Datos de nacimiento no encontrados' }, { status: 404 });
    }

    const birthDateObj = birthData.birthDate instanceof Date
      ? birthData.birthDate
      : new Date(birthData.birthDate);

    // Si se solicita un año específico, usarlo; sino calcular automáticamente
    let solarReturnInfo;
    if (requestedYear && !isNaN(requestedYear)) {
      const birthMonth = birthDateObj.getMonth();
      const birthDay = birthDateObj.getDate();
      const startDate = new Date(requestedYear, birthMonth, birthDay);
      const endDate = new Date(requestedYear + 1, birthMonth, birthDay);
      const age = requestedYear - birthDateObj.getFullYear();
      solarReturnInfo = {
        year: requestedYear,
        startDate,
        endDate,
        ageAtStart: age,
        isCurrentYear: requestedYear === new Date().getFullYear(),
        description: `Solar Return ${requestedYear}-${requestedYear + 1}`,
        period: `${startDate.toLocaleDateString('es-ES')} → ${endDate.toLocaleDateString('es-ES')}`
      };
    } else {
      solarReturnInfo = calculateSolarReturnPeriod(birthDateObj);
    }

    // Buscar Solar Return existente
    if (!force) {
      const existingChart = await Chart.findOne({
        $or: [{ userId: uid }, { uid }]
      });

      if (existingChart?.solarReturnChart) {
        const cachedYear = existingChart.solarReturnChart?.solarReturnInfo?.year;
        const cachedIsFallback = existingChart.solarReturnChart?.isFallback === true;
        const cachedType = existingChart.solarReturnChart?.solarReturnInfo?.type;

        // ✅ Solo usar cache si: año correcto Y NO es fallback
        if (cachedYear === solarReturnInfo.year && !cachedIsFallback) {
          console.log(`✅ SR cache válido: año=${cachedYear}, type=${cachedType}, asc=${existingChart.solarReturnChart?.ascendant?.sign} ${existingChart.solarReturnChart?.ascendant?.degree}°`);
          return NextResponse.json({
            success: true,
            data: {
              solarReturnChart: existingChart.solarReturnChart,
              solarReturnInfo,
              source: 'existing'
            }
          });
        } else {
          console.log(`🔄 SR cache inválido: cached_year=${cachedYear}, expected=${solarReturnInfo.year}, isFallback=${cachedIsFallback}, type=${cachedType}. Regenerando...`);
          // Limpiar fallback de DB para que no contamine futuras peticiones
          if (cachedIsFallback) {
            existingChart.solarReturnChart = null;
            await existingChart.save();
            console.log(`🧹 [SR_API] Fallback eliminado de DB`);
          }
        }
      }
    }

    // Generar nuevo Solar Return via ProKerala
    console.log(`🌐 [SR_API] Llamando ProKerala para SR año ${solarReturnInfo.year}...`);
    const prokeralaResult = await callProkeralaSolarReturn(birthData, solarReturnInfo.year);

    let solarReturnData;
    let source: string;
    if (prokeralaResult.success) {
      solarReturnData = processSolarReturnResponse(prokeralaResult.data, solarReturnInfo);
      source = 'prokerala';
      console.log(`✅ [SR_API] ProKerala OK: ASC=${solarReturnData.ascendant?.sign} ${solarReturnData.ascendant?.degree}°, MC=${solarReturnData.midheaven?.sign}, planets=${solarReturnData.planets?.length}`);
    } else {
      solarReturnData = generateSolarReturnFallback(solarReturnInfo);
      source = 'fallback';
      console.warn(`⚠️ [SR_API] ProKerala FALLÓ: ${prokeralaResult.error}. Usando fallback (NO se guardará en cache)`);
    }

    // ✅ Solo guardar en DB si es dato REAL (no fallback)
    // Los fallback NO se cachean para que se reintente ProKerala la próxima vez
    if (!solarReturnData.isFallback) {
      const existingChart = await Chart.findOne({
        $or: [{ userId: uid }, { uid }]
      });

      if (existingChart) {
        existingChart.solarReturnChart = solarReturnData;
        existingChart.lastUpdated = new Date();
        await existingChart.save();
        console.log(`💾 [SR_API] SR guardado en DB para año ${solarReturnInfo.year}`);
      } else {
        const newChart = new Chart({
          userId: uid,
          uid,
          birthDataId: birthData._id,
          chartType: 'solar-return',
          solarReturnChart: solarReturnData,
          lastUpdated: new Date()
        });
        await newChart.save();
        console.log(`💾 [SR_API] Nuevo Chart creado con SR para año ${solarReturnInfo.year}`);
      }
    } else {
      console.log(`⏭️ [SR_API] Fallback NO guardado en DB - se reintentará ProKerala la próxima vez`);
    }

    return NextResponse.json({
      success: true,
      data: {
        solarReturnChart: solarReturnData,
        solarReturnInfo,
        source
      }
    });

  } catch (error) {
    console.error('Error Solar Return:', error);
    return NextResponse.json({
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}

/**
 * POST: Regenerar Solar Return
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const uid = body.uid || body.userId;

    if (!uid) {
      return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
    }

    // Redirigir a GET con force=true
    const url = new URL(request.url);
    url.searchParams.set('userId', uid);
    url.searchParams.set('force', 'true');

    return GET(new NextRequest(url));

  } catch (error) {
    return NextResponse.json({
      error: 'Error regenerando',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}

// Funciones auxiliares
function translatePlanetName(name: string): string {
  const translations: Record<string, string> = {
    'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio',
    'Venus': 'Venus', 'Mars': 'Marte', 'Jupiter': 'Júpiter',
    'Saturn': 'Saturno', 'Uranus': 'Urano', 'Neptune': 'Neptuno', 'Pluto': 'Plutón'
  };
  return translations[name] || name;
}

function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  return signs[Math.floor((longitude % 360) / 30)] || 'Acuario';
}

function calculateElementDistribution(planets: any[]) {
  const distribution = { fire: 0, earth: 0, air: 0, water: 0 };
  const elementMap: Record<string, keyof typeof distribution> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };
  planets.forEach(p => {
    const element = elementMap[p.sign];
    if (element) distribution[element]++;
  });
  return distribution;
}

function calculateModalityDistribution(planets: any[]) {
  const distribution = { cardinal: 0, fixed: 0, mutable: 0 };
  const modalityMap: Record<string, keyof typeof distribution> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };
  planets.forEach(p => {
    const modality = modalityMap[p.sign];
    if (modality) distribution[modality]++;
  });
  return distribution;
}

function extractAscendant(data: any) {
  const asc = data?.ascendant || data?.houses?.[0];
  if (asc) {
    return {
      sign: getSignFromLongitude(asc.longitude || 0),
      degree: parseFloat(((asc.longitude || 0) % 30).toFixed(3)),
      longitude: asc.longitude || 0
    };
  }
  return { sign: 'Libra', degree: 27, longitude: 207 };
}

function extractMidheaven(data: any) {
  const mc = data?.midheaven || data?.houses?.[9];
  if (mc) {
    return {
      sign: getSignFromLongitude(mc.longitude || 0),
      degree: parseFloat(((mc.longitude || 0) % 30).toFixed(3)),
      longitude: mc.longitude || 0
    };
  }
  return { sign: 'Cáncer', degree: 15, longitude: 105 };
}

function generateDefaultHouses() {
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: ['Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
           'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo'][i],
    degree: (i * 30) % 30,
    longitude: i * 30 + 180
  }));
}