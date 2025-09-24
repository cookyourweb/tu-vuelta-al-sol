// src/app/api/charts/progressed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart, { castChart } from '@/models/Chart';

// ✅ FUNCIÓN AUXILIAR: Calcular período de progresión correcto
function calculateProgressionPeriod(birthDate: Date) {
  const today = new Date();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentYear = today.getFullYear();

  // Calcular último cumpleaños
  let lastBirthday = new Date(currentYear, birthMonth, birthDay);
  if (lastBirthday > today) {
    lastBirthday = new Date(currentYear - 1, birthMonth, birthDay);
  }

  // Calcular próximo cumpleaños
  let nextBirthday = new Date(currentYear, birthMonth, birthDay);
  if (nextBirthday <= today) {
    nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
  }

  // Calcular edad actual
  let currentAge = currentYear - birthDate.getFullYear();
  if (today < new Date(currentYear, birthMonth, birthDay)) {
    currentAge--;
  }

  return {
    startDate: lastBirthday,
    endDate: nextBirthday,
    startYear: lastBirthday.getFullYear(),
    currentAge: currentAge,
    description: `Año Solar ${currentAge} (${lastBirthday.getFullYear()}-${nextBirthday.getFullYear()})`,
    period: `Cumpleaños ${lastBirthday.getFullYear()} → ${nextBirthday.getFullYear()}`
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'UID requerido'
      }, { status: 400 });
    }

    console.log('🔍 [PROGRESSED] Buscando datos para UID:', uid);

    // Buscar datos de nacimiento
    const birthDataRaw = await BirthData.findOne({
      $or: [
        { uid: uid },
        { userId: uid }
      ]
    }).lean();

    console.log('🔍 [PROGRESSED] Resultado búsqueda BirthData:', {
      encontrado: !!birthDataRaw,
      campos: birthDataRaw ? Object.keys(birthDataRaw) : [],
      userId: (birthDataRaw as any)?.userId,
      uid: (birthDataRaw as any)?.uid
    });

    const birthData = castBirthData(birthDataRaw);

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos de nacimiento para UID: ' + uid
      }, { status: 404 });
    }

    // Validar campos requeridos
    const requiredFields = ['birthDate', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !birthData[field as keyof typeof birthData]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Datos de nacimiento incompletos',
        missingFields: missingFields
      }, { status: 400 });
    }

    console.log('✅ [PROGRESSED] BirthData válido encontrado:', {
      id: birthData._id?.toString(),
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace
    });

    // Calcular período de progresión
    const birthDateObj = birthData.birthDate instanceof Date
      ? birthData.birthDate
      : new Date(birthData.birthDate);

    const progressionPeriod = calculateProgressionPeriod(birthDateObj);

    console.log('📅 [PROGRESSED] Período calculado:', {
      edad: progressionPeriod.currentAge,
      año: progressionPeriod.startYear,
      período: progressionPeriod.period
    });

    // Forzar generación nueva (ignorar cache)
    console.log('🔄 [PROGRESSED] Forzando generación nueva con Prokerala API (ignorando cache)');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API sin pasar por endpoint intermedio
      const prokeralaResult = await callProkeralaDirectly(birthData, progressionPeriod.startYear);

      if (prokeralaResult.success) {
        progressedData = processProkeralaProgressionResponse(prokeralaResult.data, progressionPeriod);
        console.log('✅ [PROGRESSED] DATOS DE PROKERALA - Carta generada exitosamente');
      } else {
        throw new Error(prokeralaResult.error || 'Error llamando API Prokerala');
      }

      // Validación y mejora de datos
      if (progressedData) {
        progressedData.generatedAt = new Date().toISOString();
        progressedData.isMockData = false;
        progressedData.progressionPeriod = progressionPeriod;
      }

    } catch (generationError) {
      console.log('⚠️ [PROGRESSED] DATOS MOCKEADOS - Usando datos de fallback:', generationError);

      // Fallback mejorado con estructura completa y más planetas
      progressedData = {
        sol_progresado: {
          longitude: 315.5,
          sign: 'Acuario',
          degree: 15.5,
          house: 1,
          retrograde: false,
          symbol: '☉',
          meaning: 'Evolución de la identidad y propósito vital'
        },
        luna_progresada: {
          longitude: 185.3,
          sign: 'Libra',
          degree: 25.3,
          house: 7,
          retrograde: false,
          symbol: '☽',
          meaning: 'Cambios emocionales y necesidades evolutivas'
        },
        mercurio_progresado: {
          longitude: 320.7,
          sign: 'Acuario',
          degree: 8.7,
          house: 1,
          retrograde: false,
          symbol: '☿',
          meaning: 'Evolución del pensamiento y comunicación'
        },
        venus_progresado: {
          longitude: 342.2,
          sign: 'Piscis',
          degree: 12.2,
          house: 2,
          retrograde: false,
          symbol: '♀',
          meaning: 'Transformación de valores y relaciones'
        },
        marte_progresado: {
          longitude: 20.8,
          sign: 'Aries',
          degree: 20.8,
          house: 3,
          retrograde: false,
          symbol: '♂',
          meaning: 'Canalización de energía y acción'
        },
        currentAge: progressionPeriod.currentAge,
        houses: Array.from({ length: 12 }, (_, i) => ({
          house: i + 1,
          longitude: (i * 30) + 15,
          sign: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'][i]
        })),
        aspectos_natales_progresados: [
          {
            planet1: 'Sol',
            planet2: 'Luna',
            angle: 120,
            type: 'Trígono',
            orb: 2.5,
            isProgressed: true
          },
          {
            planet1: 'Venus',
            planet2: 'Marte',
            angle: 60,
            type: 'Sextil',
            orb: 1.8,
            isProgressed: true
          }
        ],
        generatedAt: new Date().toISOString(),
        isMockData: true,
        progressionPeriod: progressionPeriod,
        elementDistribution: { fire: 2, earth: 1, air: 2, water: 2 },
        modalityDistribution: { cardinal: 2, fixed: 1, mutable: 2 }
      };
    }

    // Guardar o actualizar carta
    try {
      const existingChart = await Chart.findOne({
        $or: [
          { userId: uid },
          { uid: uid }
        ]
      });

      if (existingChart) {
        console.log('🔄 [PROGRESSED] Actualizando carta existente');

        await existingChart.addOrUpdateProgressedChart({
          period: progressionPeriod.period,
          year: progressionPeriod.startYear,
          startDate: progressionPeriod.startDate,
          endDate: progressionPeriod.endDate,
          chart: progressedData
        });

        existingChart.progressedChart = progressedData;
        existingChart.lastUpdated = new Date();

        await existingChart.save();
        console.log('💾 [PROGRESSED] Carta actualizada correctamente');
      } else {
        console.log('🆕 [PROGRESSED] Creando nueva carta');

        const newChart = new Chart({
          userId: uid,
          uid: uid,
          birthDataId: birthData._id,
          chartType: 'progressed',
          natalChart: {},
          progressedCharts: [{
            period: progressionPeriod.period,
            year: progressionPeriod.startYear,
            startDate: progressionPeriod.startDate,
            endDate: progressionPeriod.endDate,
            chart: progressedData,
            isActive: true,
            createdAt: new Date()
          }],
          progressedChart: progressedData,
          lastUpdated: new Date()
        });

        await newChart.save();
        console.log('💾 [PROGRESSED] Nueva carta guardada correctamente');
      }
    } catch (saveError) {
      console.log('⚠️ [PROGRESSED] Error guardando/actualizando (continuando):', saveError);
    }

    return NextResponse.json({
      success: true,
      data: {
        progressedChart: progressedData,
        period: {
          from: `Cumpleaños ${progressionPeriod.currentAge}`,
          to: `Cumpleaños ${progressionPeriod.currentAge + 1}`,
          solarYear: progressionPeriod.startYear,
          description: progressionPeriod.description
        },
        source: progressedData.isMockData ? 'mock' : 'prokerala',
        age: progressionPeriod.currentAge,
        metadata: {
          birthPlace: birthData.birthPlace,
          fullName: birthData.fullName,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ [PROGRESSED] Error crítico:', error);

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// ✅ FUNCIÓN callProkeralaDirectly MEJORADA
async function callProkeralaDirectly(birthData: any, targetYear: number) {
  console.log('🔍 [PROGRESSED] Intentando llamada directa a Prokerala API...');

  try {
    // 1. Obtener token (igual que natal)
    const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
    const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Credenciales de Prokerala faltantes para progresada');
    }

    console.log('🔑 [PROGRESSED] Solicitando token...');

    const tokenResponse = await fetch('https://api.prokerala.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token error: ${tokenResponse.status}`);
    }

    const { access_token } = await tokenResponse.json();
    console.log('✅ [PROGRESSED] Token obtenido exitosamente');

    // 2. Preparar datos (igual que natal pero con progressionYear)
    const birthDate = new Date(birthData.birthDate);
    const datetime = `${birthDate.toISOString().split('T')[0]}T${birthData.birthTime || '07:30:00'}+01:00`;
    const coordinates = `${birthData.latitude},${birthData.longitude}`;

    console.log('📅 [PROGRESSED] Parámetros:', {
      datetime,
      coordinates,
      targetYear
    });

    // 3. Llamar API de progresión (diferente endpoint que natal)
    const chartResponse = await fetch('https://api.prokerala.com/v2/astrology/progression-chart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        profile: {
          datetime: datetime,
          coordinates: coordinates,
          birth_time_unknown: false
        },
        progression_year: targetYear,
        current_coordinates: coordinates,
        house_system: 'placidus',
        orb: 'default',
        birth_time_rectification: 'flat-chart',
        aspect_filter: 'all',
        la: 'es',
        ayanamsa: 0
      })
    });

    console.log(`📊 [PROGRESSED] Respuesta API: ${chartResponse.status}`);

    if (!chartResponse.ok) {
      const errorText = await chartResponse.text();
      console.error('❌ [PROGRESSED] Error API:', errorText.substring(0, 200));
      throw new Error(`Progressed chart error: ${chartResponse.status}`);
    }

    const chartData = await chartResponse.json();

    console.log('✅ [PROGRESSED] Datos recibidos:', {
      dataType: typeof chartData,
      keys: Object.keys(chartData || {}),
      hasData: !!chartData.data
    });

    return { success: true, data: chartData };

  } catch (error) {
    console.error('❌ [PROGRESSED] Error en callProkeralaDirectly:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// ✅ FUNCIÓN processProkeralaProgressionResponse MEJORADA
function processProkeralaProgressionResponse(prokeralaData: any, progressionPeriod: any) {
  console.log('🔄 [PROGRESSED] Procesando datos de progresión...');

  try {
    if (!prokeralaData) {
      throw new Error('Datos de Prokerala vacíos');
    }

    // La respuesta de progresión puede venir en prokeralaData.data
    const actualData = prokeralaData.data || prokeralaData;

    console.log('🔍 [PROGRESSED] Estructura recibida:', {
      keys: Object.keys(actualData),
      hasData: !!actualData.data
    });

    // Intentar múltiples formatos para planetas progresados
    let planetData = actualData.progressed_planets ||
                     actualData.planets ||
                     actualData.planet_positions ||
                     [];

    console.log('🌟 [PROGRESSED] Planetas encontrados:', planetData.length);

    if (planetData.length === 0) {
      console.log('⚠️ [PROGRESSED] No se encontraron planetas, estructura completa:');
      console.log(JSON.stringify(actualData, null, 2));
      throw new Error('No se encontraron planetas progresados');
    }

    // Procesar planetas (similar a natal pero con datos progresados)
    const progressedPlanets = planetData.map((planet: any) => {
      const name = translatePlanetName(planet.name || planet.planet_name || 'Unknown');
      const longitude = planet.longitude || planet.degree || 0;
      const sign = planet.sign || planet.zodiac_sign || getSignFromLongitude(longitude);
      const house = planet.house || planet.house_number || 1;

      console.log(`🪐 [PROGRESSED] ${name}: ${sign} ${(longitude % 30).toFixed(3)}° (Casa ${house})`);

      return {
        name: name,
        sign: sign,
        degree: parseFloat((longitude % 30).toFixed(3)),
        house: house,
        longitude: longitude,
        retrograde: planet.is_retrograde || planet.retrograde || false
      };
    });

    // Procesar casas
    let houses = [];
    const houseData = actualData.houses || [];
    if (houseData.length > 0) {
      houses = houseData.map((house: any, index: number) => ({
        number: index + 1,
        sign: house.sign || getSignFromLongitude(house.longitude || 0),
        degree: parseFloat(((house.longitude || 0) % 30).toFixed(3)),
        longitude: house.longitude || 0
      }));
    }

    // Procesar aspectos
    const aspectData = actualData.aspects || [];
    const aspects = aspectData.map((aspect: any) => ({
      planet1: translatePlanetName(aspect.planet1?.name || ''),
      planet2: translatePlanetName(aspect.planet2?.name || ''),
      aspect: aspect.aspect_name || aspect.type || 'conjunction',
      orb: aspect.orb || 0,
      exact: aspect.exact || false
    }));

    const result = {
      planets: progressedPlanets,
      houses: houses,
      aspects: aspects,
      elementDistribution: calculateElementDistribution(progressedPlanets),
      modalityDistribution: calculateModalityDistribution(progressedPlanets),
      ascendant: {
        sign: actualData.ascendant?.sign || 'Acuario',
        degree: parseFloat(((actualData.ascendant?.longitude || 0) % 30).toFixed(3)),
        longitude: actualData.ascendant?.longitude || 0
      },
      progressionInfo: {
        ...progressionPeriod,
        description: 'Carta progresada de Prokerala API - DATOS REALES'
      },

      // Campos requeridos para TypeScript
      isFallback: false,
      isMockData: false,
      isRegenerated: false,
      regenerationTimestamp: new Date().toISOString(),
      progressionPeriod: progressionPeriod,
      generatedAt: new Date().toISOString(),

      // Planetas individuales para InterpretationButton
      sol_progresado: extractIndividualPlanet(progressedPlanets, 'Sol'),
      luna_progresada: extractIndividualPlanet(progressedPlanets, 'Luna'),
      mercurio_progresado: extractIndividualPlanet(progressedPlanets, 'Mercurio'),
      venus_progresado: extractIndividualPlanet(progressedPlanets, 'Venus'),
      marte_progresado: extractIndividualPlanet(progressedPlanets, 'Marte'),
      jupiter_progresado: extractIndividualPlanet(progressedPlanets, 'Júpiter'),
      saturno_progresado: extractIndividualPlanet(progressedPlanets, 'Saturno'),
      urano_progresado: extractIndividualPlanet(progressedPlanets, 'Urano'),
      neptuno_progresado: extractIndividualPlanet(progressedPlanets, 'Neptuno'),
      pluton_progresado: extractIndividualPlanet(progressedPlanets, 'Plutón'),

      aspectos_natales_progresados: aspects.map((a: any) => ({
        planet1: a.planet1,
        planet2: a.planet2,
        angle: getAspectAngle(a.aspect),
        type: a.aspect,
        orb: a.orb,
        isProgressed: true
      })),

      currentAge: progressionPeriod.currentAge
    };

    console.log('✅ [PROGRESSED] Procesamiento exitoso - DATOS REALES:', {
      planetsCount: result.planets.length,
      solProgresado: result.sol_progresado?.degree,
      lunaProgresada: result.luna_progresada?.degree
    });

    return result;

  } catch (error) {
    console.error('❌ [PROGRESSED] Error procesando:', error);
    throw error;
  }
}

// ✅ FUNCIONES AUXILIARES
function extractIndividualPlanet(planetsArray: any[], planetName: string) {
  const planet = planetsArray.find(p => p.name === planetName);
  if (!planet) return null;

  return {
    longitude: planet.longitude,
    sign: planet.sign,
    degree: planet.degree,
    house: planet.house,
    retrograde: planet.retrograde,
    symbol: getPlanetSymbol(planetName),
    meaning: getPlanetMeaning(planetName)
  };
}

function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  return signs[Math.floor(longitude / 30)] || 'Acuario';
}

function getAspectAngle(aspectType: string): number {
  const angles: { [key: string]: number } = {
    'conjunction': 0, 'sextile': 60, 'square': 90, 'trine': 120, 'opposition': 180
  };
  return angles[aspectType.toLowerCase()] || 0;
}

function getPlanetSymbol(planetName: string): string {
  const symbols: { [key: string]: string } = {
    'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
    'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇'
  };
  return symbols[planetName] || '●';
}

function getPlanetMeaning(planetName: string): string {
  const meanings: { [key: string]: string } = {
    'Sol': 'Evolución de la identidad y propósito vital',
    'Luna': 'Cambios emocionales y necesidades evolutivas',
    'Mercurio': 'Evolución del pensamiento y comunicación',
    'Venus': 'Transformación de valores y relaciones',
    'Marte': 'Canalización de energía y acción'
  };
  return meanings[planetName] || 'Evolución planetaria específica';
}

function translatePlanetName(planetName: string): string {
  const translations: { [key: string]: string } = {
    'Sun': 'Sol', 'Moon': 'Luna', 'Mercury': 'Mercurio', 'Venus': 'Venus',
    'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno', 'Uranus': 'Urano',
    'Neptune': 'Neptuno', 'Pluto': 'Plutón'
  };
  return translations[planetName] || planetName;
}

function calculateElementDistribution(planets: any[]): { fire: number, earth: number, air: number, water: number } {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const fireSigns = ['Aries', 'Leo', 'Sagitario'];
  const earthSigns = ['Tauro', 'Virgo', 'Capricornio'];
  const airSigns = ['Géminis', 'Libra', 'Acuario'];
  const waterSigns = ['Cáncer', 'Escorpio', 'Piscis'];

  planets.forEach(planet => {
    if (fireSigns.includes(planet.sign)) elements.fire++;
    else if (earthSigns.includes(planet.sign)) elements.earth++;
    else if (airSigns.includes(planet.sign)) elements.air++;
    else if (waterSigns.includes(planet.sign)) elements.water++;
  });

  return elements;
}

function calculateModalityDistribution(planets: any[]): { cardinal: number, fixed: number, mutable: number } {
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
  const cardinalSigns = ['Aries', 'Cáncer', 'Libra', 'Capricornio'];
  const fixedSigns = ['Tauro', 'Leo', 'Escorpio', 'Acuario'];
  const mutableSigns = ['Géminis', 'Virgo', 'Sagitario', 'Piscis'];

  planets.forEach(planet => {
    if (cardinalSigns.includes(planet.sign)) modalities.cardinal++;
    else if (fixedSigns.includes(planet.sign)) modalities.fixed++;
    else if (mutableSigns.includes(planet.sign)) modalities.mutable++;
  });

  return modalities;
}

// ✅ MÉTODO POST: Manejar regeneración con UID en el body
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const uid = body.uid || body.userId;

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'UID o userId requerido en el body'
      }, { status: 400 });
    }

    console.log('🔄 [PROGRESSED] POST - Regenerando carta para UID:', uid);

    const birthDataRaw = await BirthData.findOne({
      $or: [
        { uid: uid },
        { userId: uid }
      ]
    }).lean();

    const birthData = castBirthData(birthDataRaw);

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos de nacimiento para UID: ' + uid
      }, { status: 404 });
    }

    const requiredFields = ['birthDate', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !birthData[field as keyof typeof birthData]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Datos de nacimiento incompletos',
        missingFields: missingFields
      }, { status: 400 });
    }

    console.log('✅ [PROGRESSED] POST - BirthData válido encontrado:', {
      id: birthData._id?.toString(),
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace
    });

    const birthDateObj = birthData.birthDate instanceof Date
      ? birthData.birthDate
      : new Date(birthData.birthDate);

    const progressionPeriod = calculateProgressionPeriod(birthDateObj);

    console.log('📅 [PROGRESSED] POST - Período calculado:', {
      edad: progressionPeriod.currentAge,
      año: progressionPeriod.startYear,
      período: progressionPeriod.period
    });

    console.log('🎨 [PROGRESSED] POST - Generando nueva carta progresada (regeneración)...');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API sin pasar por endpoint intermedio
      const prokeralaResult = await callProkeralaDirectly(birthData, progressionPeriod.startYear);

      if (prokeralaResult.success) {
        progressedData = processProkeralaProgressionResponse(prokeralaResult.data, progressionPeriod);
        console.log('✅ [PROGRESSED] POST - DATOS DE PROKERALA - Carta generada exitosamente');
      } else {
        throw new Error(prokeralaResult.error || 'Error llamando API Prokerala');
      }

      if (progressedData) {
        progressedData.generatedAt = new Date().toISOString();
        progressedData.isRegenerated = true;
        progressedData.regenerationTimestamp = new Date().toISOString();
        progressedData.progressionPeriod = progressionPeriod;
      }

    } catch (generationError) {
      console.log('⚠️ [PROGRESSED] POST - DATOS MOCKEADOS - Usando datos de fallback:', generationError);

      progressedData = {
        sol_progresado: {
          longitude: 315.5,
          sign: 'Acuario',
          degree: 15.5,
          house: 1,
          retrograde: false,
          symbol: '☉',
          meaning: 'Evolución de la identidad y propósito vital'
        },
        luna_progresada: {
          longitude: 185.3,
          sign: 'Libra',
          degree: 25.3,
          house: 7,
          retrograde: false,
          symbol: '☽',
          meaning: 'Cambios emocionales y necesidades evolutivas'
        },
        mercurio_progresado: {
          longitude: 320.7,
          sign: 'Acuario',
          degree: 8.7,
          house: 1,
          retrograde: false,
          symbol: '☿',
          meaning: 'Evolución del pensamiento y comunicación'
        },
        venus_progresado: {
          longitude: 342.2,
          sign: 'Piscis',
          degree: 12.2,
          house: 2,
          retrograde: false,
          symbol: '♀',
          meaning: 'Transformación de valores y relaciones'
        },
        marte_progresado: {
          longitude: 20.8,
          sign: 'Aries',
          degree: 20.8,
          house: 3,
          retrograde: false,
          symbol: '♂',
          meaning: 'Canalización de energía y acción'
        },
        currentAge: progressionPeriod.currentAge,
        houses: Array.from({ length: 12 }, (_, i) => ({
          house: i + 1,
          longitude: (i * 30) + 15,
          sign: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'][i]
        })),
        aspectos_natales_progresados: [
          {
            planet1: 'Sol',
            planet2: 'Luna',
            angle: 120,
            type: 'Trígono',
            orb: 2.5,
            isProgressed: true
          },
          {
            planet1: 'Venus',
            planet2: 'Marte',
            angle: 60,
            type: 'Sextil',
            orb: 1.8,
            isProgressed: true
          }
        ],
        generatedAt: new Date().toISOString(),
        isMockData: true,
        progressionPeriod: progressionPeriod,
        elementDistribution: { fire: 2, earth: 1, air: 2, water: 2 },
        modalityDistribution: { cardinal: 2, fixed: 1, mutable: 2 }
      };
    }

    try {
      const existingChart = await Chart.findOne({
        $or: [
          { userId: uid },
          { uid: uid }
        ]
      });

      if (existingChart) {
        console.log('🔄 [PROGRESSED] POST - Actualizando carta existente');

        await existingChart.addOrUpdateProgressedChart({
          period: progressionPeriod.period,
          year: progressionPeriod.startYear,
          startDate: progressionPeriod.startDate,
          endDate: progressionPeriod.endDate,
          chart: progressedData
        });

        existingChart.progressedChart = progressedData;
        existingChart.lastUpdated = new Date();

        await existingChart.save();
        console.log('💾 [PROGRESSED] POST - Carta actualizada correctamente');
      } else {
        console.log('🆕 [PROGRESSED] POST - Creando nueva carta');

        const newChart = new Chart({
          userId: uid,
          uid: uid,
          birthDataId: birthData._id,
          chartType: 'progressed',
          natalChart: {},
          progressedCharts: [{
            period: progressionPeriod.period,
            year: progressionPeriod.startYear,
            startDate: progressionPeriod.startDate,
            endDate: progressionPeriod.endDate,
            chart: progressedData,
            isActive: true,
            createdAt: new Date()
          }],
          progressedChart: progressedData,
          lastUpdated: new Date()
        });

        await newChart.save();
        console.log('💾 [PROGRESSED] POST - Nueva carta guardada correctamente');
      }
    } catch (saveError) {
      console.log('⚠️ [PROGRESSED] POST - Error guardando/actualizando (continuando):', saveError);
    }

    return NextResponse.json({
      success: true,
      data: {
        progressedChart: progressedData,
        period: {
          from: `Cumpleaños ${progressionPeriod.currentAge}`,
          to: `Cumpleaños ${progressionPeriod.currentAge + 1}`,
          solarYear: progressionPeriod.startYear,
          description: progressionPeriod.description
        },
        source: progressedData.isMockData ? 'mock' : 'prokerala',
        age: progressionPeriod.currentAge,
        metadata: {
          birthPlace: birthData.birthPlace,
          fullName: birthData.fullName,
          generatedAt: new Date().toISOString(),
          isRegenerated: true
        }
      }
    });

  } catch (error) {
    console.error('❌ [PROGRESSED] POST - Error crítico:', error);

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor en regeneración',
      details: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
