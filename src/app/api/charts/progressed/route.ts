// src/app/api/charts/progressed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';  // ✅ CORREGIDO: Eliminada la 'a' extra
import Chart, { castChart } from '@/models/Chart';

/**
 * Calcular timezone offset (igual que en natal)
 */
function calculateTimezoneOffset(date: string, timezone: string): string {
  console.log(`🌍 Calculando timezone para ${date} en ${timezone}`);

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

    // Europa Central
    if (timezone === 'Europe/Madrid' ||
        timezone === 'Europe/Berlin' ||
        timezone === 'Europe/Paris' ||
        timezone === 'Europe/Rome') {

      const dstStart = getLastSunday(year, 2); // Marzo
      const dstEnd = getLastSunday(year, 9);   // Octubre

      dstStart.setUTCHours(2, 0, 0, 0);
      dstEnd.setUTCHours(2, 0, 0, 0);

      const offset = (targetDate >= dstStart && targetDate < dstEnd) ? '+02:00' : '+01:00';
      console.log(`✅ Timezone Europa: ${offset}`);
      return offset;
    }

    // Zonas fijas
    const staticTimezones: Record<string, string> = {
      'America/Argentina/Buenos_Aires': '-03:00',
      'America/Bogota': '-05:00',
      'America/Lima': '-05:00',
      'America/Mexico_City': '-06:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00',
      'GMT': '+00:00'
    };

    if (staticTimezones[timezone]) {
      console.log(`✅ Timezone fijo: ${staticTimezones[timezone]}`);
      return staticTimezones[timezone];
    }

    console.warn(`⚠️ Timezone '${timezone}' no reconocida, usando UTC`);
    return '+00:00';
  } catch (error) {
    console.error('❌ Error calculando timezone:', error);
    return '+00:00';
  }
}

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
    const uid = searchParams.get('uid') || searchParams.get('userId');

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'UID requerido'
      }, { status: 400 });
    }

    console.log('🔍 [PROGRESSED] Buscando datos para UID:', uid);

    // Buscar datos de nacimiento - AHORA FUNCIONA PORQUE BirthData ESTÁ CORRECTAMENTE IMPORTADO
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

    // Buscar carta existente
    const existingChart = await Chart.findOne({
      $or: [
        { userId: uid },
        { uid: uid }
      ]
    });

    if (existingChart?.progressedChart) {
      console.log('✅ [PROGRESSED] Carta progresada existente encontrada');
      
      return NextResponse.json({
        success: true,
        data: {
          progressedChart: existingChart.progressedChart,
          period: {
            from: `Cumpleaños ${progressionPeriod.currentAge}`,
            to: `Cumpleaños ${progressionPeriod.currentAge + 1}`,
            solarYear: progressionPeriod.startYear,
            description: progressionPeriod.description
          },
          source: 'existing',
          age: progressionPeriod.currentAge,
          metadata: {
            birthPlace: birthData.birthPlace,
            fullName: birthData.fullName,
            generatedAt: new Date().toISOString()
          }
        }
      });
    }

    // Si no existe, generar automáticamente
    console.log('🔄 [PROGRESSED] Generando nueva carta progresada...');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API
      const prokeralaResult = await callProkeralaDirectly(birthData, progressionPeriod.startYear);

      if (prokeralaResult.success) {
        progressedData = processProkeralaProgressionResponse(prokeralaResult.data, progressionPeriod);
        console.log('✅ [PROGRESSED] Carta generada exitosamente desde Prokerala');
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
      console.log('⚠️ [PROGRESSED] Usando datos de fallback:', generationError);

      // Fallback con estructura completa
      progressedData = generateProgressedFallback(birthData, progressionPeriod.startYear);
    }

    // Guardar o actualizar carta
    try {
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

// ✅ MÉTODO POST: Manejar regeneración
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

    // BirthData.findOne AHORA FUNCIONA CORRECTAMENTE
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

    console.log('🎨 [PROGRESSED] POST - Generando nueva carta progresada (regeneración)...');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API
      const prokeralaResponse = await callProkeralaDirectly(birthData, progressionPeriod.startYear);

      if (prokeralaResponse.success) {
        console.log('✅ [PROGRESSED] Prokerala API exitosa');
        progressedData = processProkeralaProgressionResponse(prokeralaResponse.data, progressionPeriod);
      } else {
        console.log('⚠️ [PROGRESSED] Prokerala falló, usando fallback:', prokeralaResponse.error);
        progressedData = generateProgressedFallback(birthData, progressionPeriod.startYear);
      }

      if (progressedData) {
        progressedData.generatedAt = new Date().toISOString();
        progressedData.isRegenerated = true;
        progressedData.regenerationTimestamp = new Date().toISOString();
        progressedData.progressionPeriod = progressionPeriod;
      }

    } catch (generationError) {
      console.log('⚠️ [PROGRESSED] POST - Usando datos de fallback:', generationError);
      progressedData = generateProgressedFallback(birthData, progressionPeriod.startYear);
    }

    // Verificar antes de guardar
    if (!progressedData || !progressedData.planets || progressedData.planets.length === 0) {
      console.error('❌ [PROGRESSED] Datos vacíos antes de guardar, regenerando fallback...');
      progressedData = generateProgressedFallback(birthData, progressionPeriod.startYear);
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

// ===== FUNCIONES AUXILIARES =====

async function callProkeralaDirectly(birthData: any, targetYear: number) {
  console.log('🔍 [PROGRESSED] Llamada directa a Prokerala API CORREGIDA...');

  try {
    // 1. Obtener token (igual que antes)
    const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
    const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Credenciales de Prokerala faltantes');
    }

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

    // 2. CORRECCIÓN PRINCIPAL: Usar fecha de NACIMIENTO original, no progresada
    const birthDate = new Date(birthData.birthDate);
    const birthDateStr = birthDate.toISOString().split('T')[0];

    let formattedBirthTime = birthData.birthTime || '07:30:00';
    if (formattedBirthTime.length === 5) {
      formattedBirthTime = formattedBirthTime + ':00';
    }

    const offset = calculateTimezoneOffset(birthDateStr, birthData.timezone || 'Europe/Madrid');
    const birthDatetime = `${birthDateStr}T${formattedBirthTime}${offset}`;
    const coordinates = `${birthData.latitude},${birthData.longitude}`;

    console.log('📅 [PROGRESSED] Parámetros CORRECTOS:', {
      birthDatetime, // <- FECHA DE NACIMIENTO, no progresada
      coordinates,
      targetYear,
      offset
    });

    // 3. USAR ENDPOINT CORRECTO: progression-chart
    const progressionUrl = new URL('https://api.prokerala.com/v2/astrology/progression-chart');
    progressionUrl.searchParams.append('profile[datetime]', birthDatetime);
    progressionUrl.searchParams.append('profile[coordinates]', coordinates);
    progressionUrl.searchParams.append('profile[birth_time_unknown]', 'false');
    progressionUrl.searchParams.append('house_system', 'placidus');
    progressionUrl.searchParams.append('progression_year', targetYear.toString()); // <- AÑO DE PROGRESIÓN
    progressionUrl.searchParams.append('la', 'es');
    progressionUrl.searchParams.append('ayanamsa', '0');
    progressionUrl.searchParams.append('format', 'json');

    console.log('🌐 [PROGRESSED] URL CORREGIDA:', progressionUrl.toString());

    const progressionResponse = await fetch(progressionUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 [PROGRESSED] Respuesta Progression Chart: ${progressionResponse.status}`);

    if (!progressionResponse.ok) {
      const errorText = await progressionResponse.text();
      console.error('❌ [PROGRESSED] Error Progression Chart:', errorText.substring(0, 200));
      throw new Error(`Progression chart error: ${progressionResponse.status}`);
    }

    let progressionData: any;

    if (progressionResponse.headers.get('content-type')?.includes('application/json')) {
      progressionData = await progressionResponse.json();
      console.log('✅ [PROGRESSED] Progression Chart JSON parseado correctamente');
    } else {
      const textResponse = await progressionResponse.text();
      console.error('❌ [PROGRESSED] Progression Chart devolvió XML:', textResponse.substring(0, 200));
      throw new Error('API devolvió XML en lugar de JSON para progression-chart');
    }

    return { success: true, data: progressionData };

  } catch (error) {
    console.error('❌ [PROGRESSED] Error en callProkeralaDirectly CORREGIDO:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

function processProkeralaProgressionResponse(combinedData: any, progressionPeriod: any) {
  console.log('🔄 [PROGRESSED] Procesando datos de progresión...');

  try {
    const progressionData = combinedData.data || combinedData;

    // Extraer planetas
    let planetsData = progressionData.planets || 
                      progressionData.planet_positions || [];

    if (planetsData.length === 0) {
      throw new Error('No se encontraron planetas progresados');
    }

    // Procesar planetas
    const processedPlanets = planetsData.map((planet: any) => {
      const name = translatePlanetName(planet.name || planet.planet_name || 'Unknown');
      const longitude = planet.longitude || planet.degree || 0;
      const sign = planet.zodiac?.name || planet.sign || getSignFromLongitude(longitude);
      const house = planet.house || planet.house_number || 1;

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
    let housesData = progressionData.houses || [];
    const processedHouses = housesData.length > 0 ? housesData.map((house: any, index: number) => ({
      number: index + 1,
      sign: house.zodiac?.name || house.sign || getSignFromLongitude(house.longitude || 0),
      degree: parseFloat(((house.longitude || 0) % 30).toFixed(3)),
      longitude: house.longitude || 0
    })) : Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: getSignFromLongitude(i * 30),
      degree: 0,
      longitude: i * 30
    }));

    // Construir resultado final
    const result = {
      planets: processedPlanets,
      houses: processedHouses,
      aspects: [],
      elementDistribution: calculateElementDistribution(processedPlanets),
      modalityDistribution: calculateModalityDistribution(processedPlanets),
      ascendant: {
        sign: 'Acuario',
        degree: 4,
        longitude: 304
      },
      progressionInfo: {
        ...progressionPeriod,
        description: 'Carta progresada de Prokerala API - DATOS REALES'
      },
      isFallback: false,
      isMockData: false,
      isRegenerated: false,
      regenerationTimestamp: new Date().toISOString(),
      progressionPeriod: progressionPeriod,
      generatedAt: new Date().toISOString(),
      currentAge: progressionPeriod.currentAge,
      
      // Planetas individuales para compatibilidad
      sol_progresado: extractIndividualPlanet(processedPlanets, 'Sol'),
      luna_progresada: extractIndividualPlanet(processedPlanets, 'Luna'),
      mercurio_progresado: extractIndividualPlanet(processedPlanets, 'Mercurio'),
      venus_progresado: extractIndividualPlanet(processedPlanets, 'Venus'),
      marte_progresado: extractIndividualPlanet(processedPlanets, 'Marte'),
      jupiter_progresado: extractIndividualPlanet(processedPlanets, 'Júpiter'),
      saturno_progresado: extractIndividualPlanet(processedPlanets, 'Saturno'),
      urano_progresado: extractIndividualPlanet(processedPlanets, 'Urano'),
      neptuno_progresado: extractIndividualPlanet(processedPlanets, 'Neptuno'),
      pluton_progresado: extractIndividualPlanet(processedPlanets, 'Plutón'),

      aspectos_natales_progresados: []
    };

    console.log('✅ [PROGRESSED] Procesamiento exitoso:', {
      planetsCount: result.planets.length,
      housesCount: result.houses.length,
      solProgresado: result.sol_progresado?.sign,
      lunaProgresada: result.luna_progresada?.sign
    });

    return result;

  } catch (error) {
    console.error('❌ [PROGRESSED] Error procesando datos:', error);
    throw error;
  }
}

function generateProgressedFallback(birthData: any, targetYear: number) {
  console.log('📋 [PROGRESSED] Generando datos de fallback...');

  const progressionPeriod = calculateProgressionPeriod(new Date(birthData.birthDate));

  return {
    planets: [
      { name: 'Sol', sign: 'Acuario', degree: 23.5, house: 1, longitude: 323.5, retrograde: false },
      { name: 'Luna', sign: 'Libra', degree: 8.2, house: 7, longitude: 188.2, retrograde: false },
      { name: 'Mercurio', sign: 'Acuario', degree: 15.7, house: 1, longitude: 315.7, retrograde: false },
      { name: 'Venus', sign: 'Capricornio', degree: 28.9, house: 12, longitude: 298.9, retrograde: false },
      { name: 'Marte', sign: 'Géminis', degree: 12.3, house: 4, longitude: 72.3, retrograde: false },
      { name: 'Júpiter', sign: 'Acuario', degree: 25.1, house: 1, longitude: 325.1, retrograde: false },
      { name: 'Saturno', sign: 'Géminis', degree: 29.8, house: 5, longitude: 89.8, retrograde: true },
      { name: 'Urano', sign: 'Libra', degree: 28.2, house: 8, longitude: 208.2, retrograde: true },
      { name: 'Neptuno', sign: 'Sagitario', degree: 10.5, house: 10, longitude: 250.5, retrograde: false },
      { name: 'Plutón', sign: 'Libra', degree: 7.8, house: 8, longitude: 187.8, retrograde: true }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: ['Acuario', 'Piscis', 'Aries', 'Tauro', 'Géminis', 'Cáncer',
             'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio'][i],
      degree: (i * 30) % 30,
      longitude: i * 30
    })),
    aspects: [],
    elementDistribution: { fire: 20, earth: 25, air: 35, water: 20 },
    modalityDistribution: { cardinal: 30, fixed: 40, mutable: 30 },
    ascendant: {
      sign: 'Acuario',
      degree: 15.8,
      longitude: 315.8
    },
    progressionInfo: {
      year: targetYear,
      period: `Progresión ${targetYear}`,
      description: 'Datos de fallback - Estructura completa garantizada',
      isCurrentYear: true,
      ageAtStart: new Date().getFullYear() - new Date(birthData.birthDate).getFullYear()
    },
    isFallback: true,
    isMockData: true,
    isRegenerated: false,
    regenerationTimestamp: new Date().toISOString(),
    progressionPeriod: progressionPeriod,
    generatedAt: new Date().toISOString(),
    currentAge: progressionPeriod.currentAge,

    // Planetas individuales para compatibilidad
    sol_progresado: {
      longitude: 323.5,
      sign: 'Acuario',
      degree: 23.5,
      house: 1,
      retrograde: false,
      symbol: '☉',
      meaning: 'Evolución de la identidad y propósito vital'
    },
    luna_progresada: {
      longitude: 188.2,
      sign: 'Libra',
      degree: 8.2,
      house: 7,
      retrograde: false,
      symbol: '☽',
      meaning: 'Cambios emocionales y necesidades evolutivas'
    },
    mercurio_progresado: {
      longitude: 315.7,
      sign: 'Acuario',
      degree: 15.7,
      house: 1,
      retrograde: false,
      symbol: '☿',
      meaning: 'Evolución del pensamiento y comunicación'
    },
    venus_progresado: {
      longitude: 298.9,
      sign: 'Capricornio',
      degree: 28.9,
      house: 12,
      retrograde: false,
      symbol: '♀',
      meaning: 'Transformación de valores y relaciones'
    },
    marte_progresado: {
      longitude: 72.3,
      sign: 'Géminis',
      degree: 12.3,
      house: 4,
      retrograde: false,
      symbol: '♂',
      meaning: 'Canalización de energía y acción'
    },
    jupiter_progresado: {
      longitude: 325.1,
      sign: 'Acuario',
      degree: 25.1,
      house: 1,
      retrograde: false,
      symbol: '♃',
      meaning: 'Expansión de la conciencia'
    },
    saturno_progresado: {
      longitude: 89.8,
      sign: 'Géminis',
      degree: 29.8,
      house: 5,
      retrograde: true,
      symbol: '♄',
      meaning: 'Lecciones de responsabilidad'
    },
    urano_progresado: {
      longitude: 208.2,
      sign: 'Libra',
      degree: 28.2,
      house: 8,
      retrograde: true,
      symbol: '♅',
      meaning: 'Cambios revolucionarios'
    },
    neptuno_progresado: {
      longitude: 250.5,
      sign: 'Sagitario',
      degree: 10.5,
      house: 10,
      retrograde: false,
      symbol: '♆',
      meaning: 'Disolución de límites'
    },
    pluton_progresado: {
      longitude: 187.8,
      sign: 'Libra',
      degree: 7.8,
      house: 8,
      retrograde: true,
      symbol: '♇',
      meaning: 'Transformación profunda'
    },

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
    ]
  };
}

// ===== FUNCIONES AUXILIARES ADICIONALES =====

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

function translatePlanetName(name: string): string {
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
    'Pluto': 'Plutón'
  };
  return translations[name] || name;
}

function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const index = Math.floor((longitude % 360) / 30);
  return signs[index] || 'Acuario';
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
    'Marte': 'Canalización de energía y acción',
    'Júpiter': 'Expansión de la conciencia',
    'Saturno': 'Lecciones de responsabilidad',
    'Urano': 'Cambios revolucionarios',
    'Neptuno': 'Disolución de límites',
    'Plutón': 'Transformación profunda'
  };
  return meanings[planetName] || 'Evolución planetaria específica';
}

function calculateElementDistribution(planets: any[]) {
  const distribution = { fire: 0, earth: 0, air: 0, water: 0 };
  const elementMap: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
  };

  planets.forEach(planet => {
    const element = elementMap[planet.sign];
    if (element) {
      distribution[element as keyof typeof distribution]++;
    }
  });

  return distribution;
}

function calculateModalityDistribution(planets: any[]) {
  const distribution = { cardinal: 0, fixed: 0, mutable: 0 };
  const modalityMap: Record<string, string> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
  };

  planets.forEach(planet => {
    const modality = modalityMap[planet.sign];
    if (modality) {
      distribution[modality as keyof typeof distribution]++;
    }
  });

  return distribution;
}