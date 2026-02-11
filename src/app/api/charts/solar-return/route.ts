// src/app/api/charts/solar-return/route.ts
// ============================================================================
// ENDPOINT ESPECÍFICO PARA SOLAR RETURN (REVOLUCIÓN SOLAR)
// El Sol permanece FIJO en posición natal, cambian otros planetas y casas
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart from '@/models/Chart';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

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
 * Llamar a Prokerala para Solar Return
 */
async function callProkeralaSolarReturn(birthData: any, returnYear: number) {
  try {
    const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
    const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Credenciales Prokerala faltantes');
    }

    // 1. Obtener token
    const tokenResponse = await fetch('https://api.prokerala.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token error: ${tokenResponse.status}`);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Preparar fecha de Solar Return
    const birthDate = new Date(birthData.birthDate);
    const solarReturnDate = new Date(returnYear, birthDate.getMonth(), birthDate.getDate());
    const solarReturnDateStr = solarReturnDate.toISOString().split('T')[0];

    let formattedBirthTime = birthData.birthTime || '12:00:00';
    if (formattedBirthTime.length === 5) {
      formattedBirthTime += ':00';
    }

    const offset = calculateTimezoneOffset(solarReturnDateStr, birthData.timezone || 'Europe/Madrid');
    const solarReturnDatetime = `${solarReturnDateStr}T${formattedBirthTime}${offset}`;

    // ✅ FIX: Usar ubicación ACTUAL si vive en lugar DIFERENTE, sino usar natal
    // Si livesInSamePlace es false (vive en otro lugar) Y tiene coordenadas actuales → usar actuales
    // Si livesInSamePlace es true o undefined (vive en mismo lugar) → usar natales
    const coordinates = birthData.livesInSamePlace === false && birthData.currentLatitude && birthData.currentLongitude
      ? `${birthData.currentLatitude},${birthData.currentLongitude}`
      : `${birthData.latitude},${birthData.longitude}`;

    console.log('☀️ Solar Return params:', {
      datetime: solarReturnDatetime,
      coordinates,
      coordinatesType: birthData.livesInSamePlace === false ? 'CURRENT (different location)' : 'NATAL (same location)',
      livesInSamePlace: birthData.livesInSamePlace,
      hasCurrentCoords: !!(birthData.currentLatitude && birthData.currentLongitude),
      year: returnYear
    });

    // 3. Llamar API Solar Return correcta
    // ✅ CORRECCIÓN: Usar endpoint específico de Solar Return según documentación de Prokerala
    // Endpoint: GET /v2/astrology/solar-return
    // Requiere: profile (con datetime de nacimiento original), solar_return_year, current_coordinates

    // Preparar datos de perfil natal (fecha de nacimiento ORIGINAL)
    const birthDateStr = new Date(birthData.birthDate).toISOString().split('T')[0];
    const birthOffset = calculateTimezoneOffset(birthDateStr, birthData.timezone || 'Europe/Madrid');
    const birthDatetime = `${birthDateStr}T${formattedBirthTime}${birthOffset}`;

    const url = new URL('https://api.prokerala.com/v2/astrology/solar-return');
    url.searchParams.append('profile[datetime]', birthDatetime); // ✅ Fecha de nacimiento ORIGINAL
    url.searchParams.append('profile[coordinates]', `${birthData.latitude},${birthData.longitude}`); // ✅ Coordenadas natales
    url.searchParams.append('solar_return_year', returnYear.toString()); // ✅ Año del Solar Return
    url.searchParams.append('current_coordinates', coordinates); // ✅ Ubicación actual
    url.searchParams.append('house_system', 'placidus');
    url.searchParams.append('orb', 'default');
    url.searchParams.append('birth_time_rectification', 'flat-chart');
    url.searchParams.append('aspect_filter', 'major');
    url.searchParams.append('la', 'es');
    url.searchParams.append('ayanamsa', '0');

    console.log('🔗 URL completa:', url.toString());
    console.log('📋 Parámetros URL:', {
      profile_datetime: birthDatetime, // ✅ Fecha natal original
      profile_coordinates: `${birthData.latitude},${birthData.longitude}`, // ✅ Coordenadas natales
      solar_return_year: returnYear,
      current_coordinates: coordinates, // ✅ Ubicación actual
      house_system: 'placidus',
      orb: 'default',
      aspect_filter: 'major',
      la: 'es',
      ayanamsa: '0'
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Prokerala error:', response.status, errorText.substring(0, 200));
      throw new Error(`API error: ${response.status}`);
    }

    // ✅ VALIDAR QUE SEA JSON ANTES DE PARSEAR
    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    console.log('📦 Response Content-Type:', contentType);
    console.log('📝 Response preview:', responseText.substring(0, 100));

    if (responseText.trim().startsWith('<?xml') || responseText.trim().startsWith('<')) {
      console.error('❌ API devolvió XML/HTML, no JSON:', responseText.substring(0, 200));
      throw new Error('API devolvió formato incorrecto - usando fallback');
    }

    try {
      const data = JSON.parse(responseText);
      console.log('✅ Solar Return calculado correctamente por Prokerala');

      // Validar estructura mínima
      if (!data.data || !data.data.planets) {
        console.warn('⚠️ Respuesta válida pero estructura inesperada');
      }

      return { success: true, data };
    } catch (parseError) {
      console.error('❌ Error parseando respuesta:', parseError);
      console.error('Contenido recibido:', responseText.substring(0, 500));
      throw new Error('Respuesta inválida de API');
    }

  } catch (error) {
    console.error('Error Prokerala Solar Return:', error);
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
        // ✅ VERIFICAR que el SR cached sea del año correcto
        const cachedYear = existingChart.solarReturnChart?.solarReturnInfo?.year;
        if (cachedYear === solarReturnInfo.year) {
          console.log(`✅ SR cache válido: año ${cachedYear} coincide con ${solarReturnInfo.year}`);
          return NextResponse.json({
            success: true,
            data: {
              solarReturnChart: existingChart.solarReturnChart,
              solarReturnInfo,
              source: 'existing'
            }
          });
        } else {
          console.log(`🔄 SR cache obsoleto: cached=${cachedYear}, esperado=${solarReturnInfo.year}. Regenerando...`);
        }
      }
    }

    // Generar nuevo Solar Return
    const prokeralaResult = await callProkeralaSolarReturn(birthData, solarReturnInfo.year);

    let solarReturnData;
    if (prokeralaResult.success) {
      solarReturnData = processSolarReturnResponse(prokeralaResult.data, solarReturnInfo);
    } else {
      solarReturnData = generateSolarReturnFallback(solarReturnInfo);
    }

    // Guardar
    const existingChart = await Chart.findOne({
      $or: [{ userId: uid }, { uid }]
    });

    if (existingChart) {
      existingChart.solarReturnChart = solarReturnData;
      existingChart.lastUpdated = new Date();
      await existingChart.save();
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
    }

    return NextResponse.json({
      success: true,
      data: {
        solarReturnChart: solarReturnData,
        solarReturnInfo,
        source: 'generated'
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