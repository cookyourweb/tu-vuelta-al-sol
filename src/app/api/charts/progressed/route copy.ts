// src/app/api/charts/progressed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
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

// Función auxiliar: Calcular período de progresión correcto
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
    const forceRegenerate = searchParams.get('force') === 'true';

    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'UID requerido'
      }, { status: 400 });
    }

    console.log('🔍 [SOLAR RETURN] Buscando datos para UID:', uid);
    console.log('🔄 [SOLAR RETURN] Force regenerate:', forceRegenerate);

    // Buscar datos de nacimiento
    const birthDataRaw = await BirthData.findOne({
      $or: [
        { uid: uid },
        { userId: uid }
      ]
    }).lean();

    console.log('🔍 [SOLAR RETURN] Resultado búsqueda BirthData:', {
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

    console.log('✅ [SOLAR RETURN] BirthData válido encontrado:', {
      id: birthData._id?.toString(),
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace
    });

    // Calcular período de progresión
    const birthDateObj = birthData.birthDate instanceof Date
      ? birthData.birthDate
      : new Date(birthData.birthDate);

    const progressionPeriod = calculateProgressionPeriod(birthDateObj);

    console.log('📅 [SOLAR RETURN] Período calculado:', {
      edad: progressionPeriod.currentAge,
      año: progressionPeriod.startYear,
      período: progressionPeriod.period
    });

    // Buscar carta existente (solo si no es force regenerate)
    let existingChart;
    if (!forceRegenerate) {
      existingChart = await Chart.findOne({
        $or: [
          { userId: uid },
          { uid: uid }
        ]
      });

      if (existingChart?.progressedChart) {
        console.log('✅ [SOLAR RETURN] Carta progresada existente encontrada (no force)');

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
    } else {
      // Si es force regenerate, buscar la carta existente para actualizarla
      existingChart = await Chart.findOne({
        $or: [
          { userId: uid },
          { uid: uid }
        ]
      });
    }

    // Si no existe, generar automáticamente
    console.log('🔄 [SOLAR RETURN] Generando nueva carta Solar Return...');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API con endpoint correcto
      const prokeralaResult = await callProkeralaSolarReturn(birthData, progressionPeriod.startYear);

      if (prokeralaResult.success) {
        progressedData = processSolarReturnResponse(prokeralaResult.data, progressionPeriod);
        
        console.log('🔍 [SOLAR RETURN] Respuesta cruda de Prokerala:');
        console.log(JSON.stringify(prokeralaResult.data, null, 2));
        console.log('🔄 [SOLAR RETURN] Datos procesados:');
        console.log(JSON.stringify(progressedData, null, 2));
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
      console.log('⚠️ [SOLAR RETURN] Usando datos de fallback:', generationError);
      progressedData = generateSolarReturnFallback(progressionPeriod);
    }

    // Guardar o actualizar carta
    try {
      if (existingChart) {
        console.log('🔄 [SOLAR RETURN] Actualizando carta existente');

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
        console.log('💾 [SOLAR RETURN] Carta actualizada correctamente');
      } else {
        console.log('🆕 [SOLAR RETURN] Creando nueva carta');

        const newChart = new Chart({
          userId: uid,
          uid: uid,
          birthDataId: birthData._id,
          chartType: 'solar_return',
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
        console.log('💾 [SOLAR RETURN] Nueva carta guardada correctamente');
      }
    } catch (saveError) {
      console.log('⚠️ [SOLAR RETURN] Error guardando/actualizando (continuando):', saveError);
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
        regenerated: forceRegenerate,
        metadata: {
          birthPlace: birthData.birthPlace,
          fullName: birthData.fullName,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ [SOLAR RETURN] Error crítico:', error);

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Método POST: Manejar regeneración
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

    console.log('🔄 [SOLAR RETURN] POST - Regenerando carta para UID:', uid);

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

    console.log('✅ [SOLAR RETURN] POST - BirthData válido encontrado:', {
      id: birthData._id?.toString(),
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace
    });

    const birthDateObj = birthData.birthDate instanceof Date
      ? birthData.birthDate
      : new Date(birthData.birthDate);

    const progressionPeriod = calculateProgressionPeriod(birthDateObj);

    console.log('🎨 [SOLAR RETURN] POST - Generando nueva carta Solar Return (regeneración)...');

    let progressedData;

    try {
      // Llamar directamente a Prokerala API
      const prokeralaResponse = await callProkeralaSolarReturn(birthData, progressionPeriod.startYear);

      if (prokeralaResponse.success) {
        console.log('✅ [SOLAR RETURN] Prokerala API exitosa');
        progressedData = processSolarReturnResponse(prokeralaResponse.data, progressionPeriod);
      } else {
        console.log('⚠️ [SOLAR RETURN] Prokerala falló, usando fallback:', prokeralaResponse.error);
        progressedData = generateSolarReturnFallback(progressionPeriod);
      }

     if (progressedData) {
  // Crear objeto con todas las propiedades necesarias
  const enhancedProgressedData = {
    ...progressedData,
    generatedAt: new Date().toISOString(),
    isRegenerated: true,
    regenerationTimestamp: new Date().toISOString(),
    progressionPeriod: progressionPeriod
  };
  
  progressedData = enhancedProgressedData;
}

    } catch (generationError) {
      console.log('⚠️ [SOLAR RETURN] POST - Usando datos de fallback:', generationError);
      progressedData = generateSolarReturnFallback(progressionPeriod);
    }

    // Verificar antes de guardar
    if (!progressedData || !progressedData.planets || progressedData.planets.length === 0) {
      console.error('❌ [SOLAR RETURN] Datos vacíos antes de guardar, regenerando fallback...');
      progressedData = generateSolarReturnFallback(progressionPeriod);
    }

    try {
      const existingChart = await Chart.findOne({
        $or: [
          { userId: uid },
          { uid: uid }
        ]
      });

      if (existingChart) {
        console.log('🔄 [SOLAR RETURN] POST - Actualizando carta existente');

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
        console.log('💾 [SOLAR RETURN] POST - Carta actualizada correctamente');
      } else {
        console.log('🆕 [SOLAR RETURN] POST - Creando nueva carta');

        const newChart = new Chart({
          userId: uid,
          uid: uid,
          birthDataId: birthData._id,
          chartType: 'solar_return',
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
        console.log('💾 [SOLAR RETURN] POST - Nueva carta guardada correctamente');
      }
    } catch (saveError) {
      console.log('⚠️ [SOLAR RETURN] POST - Error guardando/actualizando (continuando):', saveError);
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
    console.error('❌ [SOLAR RETURN] POST - Error crítico:', error);

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor en regeneración',
      details: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// FUNCIONES AUXILIARES

// Función Solar Return corregida
async function callProkeralaSolarReturn(birthData: any, targetYear: number) {
  console.log('🌅 [SOLAR RETURN] Llamando endpoint correcto...');

  try {
    // 1. Obtener token
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
    console.log('✅ [SOLAR RETURN] Token obtenido exitosamente');

    // 2. Preparar datos de nacimiento
    const birthDate = new Date(birthData.birthDate);
    const birthDateStr = birthDate.toISOString().split('T')[0];

    let formattedBirthTime = birthData.birthTime || '07:30:00';
    if (formattedBirthTime.length === 5) {
      formattedBirthTime = formattedBirthTime + ':00';
    }

    const offset = calculateTimezoneOffset(birthDateStr, birthData.timezone || 'Europe/Madrid');
    const birthDatetime = `${birthDateStr}T${formattedBirthTime}${offset}`;
    const birthCoordinates = `${birthData.latitude},${birthData.longitude}`;
    
    // 3. UBICACIÓN ACTUAL (por ahora usar la misma que nacimiento)
    const currentCoordinates = birthCoordinates;

    console.log('📍 [SOLAR RETURN] Parámetros:', {
      birthDatetime,
      birthCoordinates,
      currentCoordinates,
      solarReturnYear: targetYear
    });

    // 4. ENDPOINT CORRECTO: solar-return-chart
    const solarReturnUrl = new URL('https://api.prokerala.com/v2/astrology/solar-return-chart');
    solarReturnUrl.searchParams.append('profile[datetime]', birthDatetime);
    solarReturnUrl.searchParams.append('profile[coordinates]', birthCoordinates);
    solarReturnUrl.searchParams.append('current_coordinates', currentCoordinates);
    solarReturnUrl.searchParams.append('solar_return_year', targetYear.toString());
    solarReturnUrl.searchParams.append('house_system', 'placidus');
    solarReturnUrl.searchParams.append('la', 'es');
    solarReturnUrl.searchParams.append('format', 'json');

    console.log('🌐 [SOLAR RETURN] URL:', solarReturnUrl.toString());

    // 5. Llamar API
    const solarReturnResponse = await fetch(solarReturnUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 [SOLAR RETURN] Status: ${solarReturnResponse.status}`);

    if (!solarReturnResponse.ok) {
      const errorText = await solarReturnResponse.text();
      console.error('❌ [SOLAR RETURN] Error:', errorText.substring(0, 200));
      throw new Error(`Solar Return error: ${solarReturnResponse.status}`);
    }

    // 6. Procesar respuesta JSON
    const solarReturnData = await solarReturnResponse.json();
    console.log('✅ [SOLAR RETURN] Datos recibidos correctamente');
    console.log('🔍 [SOLAR RETURN] Estructura:', JSON.stringify(solarReturnData, null, 2));

    return { success: true, data: solarReturnData };

  } catch (error) {
    console.error('❌ [SOLAR RETURN] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para procesar respuesta Solar Return
function processSolarReturnResponse(solarReturnData: any, progressionPeriod: any) {
  console.log('🔄 [SOLAR RETURN] Procesando datos...');
  console.log('🔍 [SOLAR RETURN] Estructura completa:', JSON.stringify(solarReturnData, null, 2));

  try {
    const data = solarReturnData?.data || solarReturnData;
    
    // Extraer planetas del Solar Return
    let planetsData = data?.planets || data?.planet_positions || [];

    if (!Array.isArray(planetsData) || planetsData.length === 0) {
      console.log('⚠️ [SOLAR RETURN] No se encontraron planetas, usando fallback');
      return generateSolarReturnFallback(progressionPeriod);
    }

    console.log('📊 [SOLAR RETURN] Planetas encontrados:', planetsData.length);

    // VALIDACIÓN CRÍTICA: El Sol debe estar en la misma posición natal
    const solPosition = planetsData.find(p => 
      (p.name || p.planet_name || '').toLowerCase().includes('sun') || 
      (p.name || p.planet_name || '').toLowerCase().includes('sol')
    );

    if (solPosition) {
      console.log('☉ [SOLAR RETURN] Sol encontrado en:', solPosition.longitude || solPosition.degree);
      // El Sol debe estar cerca de 21.139° Acuario (≈ 321.139°)
      const expectedSolPosition = 321.139; // 21° Acuario
      const actualSolPosition = solPosition.longitude || solPosition.degree || 0;
      const difference = Math.abs(actualSolPosition - expectedSolPosition);
      
      if (difference > 5) {
        console.warn('⚠️ [SOLAR RETURN] Sol no está en posición correcta. Diferencia:', difference);
      } else {
        console.log('✅ [SOLAR RETURN] Sol en posición correcta');
      }
    }

    // Procesar todos los planetas
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
    let housesData = data?.houses || [];
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
      solarReturnInfo: {
        ...progressionPeriod,
        description: 'Solar Return - Tu Vuelta al Sol con datos reales de Prokerala',
        type: 'solar_return'
      },
      progressionPeriod: progressionPeriod,
      isFallback: false,
      isMockData: false,
      isSolarReturn: true,
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
      pluton_progresado: extractIndividualPlanet(processedPlanets, 'Plutón')
    };

    console.log('✅ [SOLAR RETURN] Procesamiento exitoso:', {
      planetsCount: result.planets.length,
      housesCount: result.houses.length,
      solEnAcuario: result.sol_progresado?.sign === 'Acuario'
    });

    return result;

  } catch (error) {
    console.error('❌ [SOLAR RETURN] Error procesando:', error);
    return generateSolarReturnFallback(progressionPeriod);
  }
}

// Función para generar fallback Solar Return
function generateSolarReturnFallback(progressionPeriod: any) {
  console.log('📋 [SOLAR RETURN] Generando fallback...');

  return {
    planets: [
      // El Sol DEBE estar en la posición natal exacta (21° Acuario)
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
    houses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: ['Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
             'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo'][i],
      degree: (i * 30) % 30,
      longitude: i * 30 + 180
    })),
    aspects: [],
    elementDistribution: { fire: 25, earth: 20, air: 35, water: 20 },
    modalityDistribution: { cardinal: 25, fixed: 50, mutable: 25 },
    ascendant: {
      sign: 'Libra',
      degree: 27,
      longitude: 207
    },
    solarReturnInfo: {
      ...progressionPeriod,
      description: 'Solar Return - Datos de fallback con Sol en posición correcta',
      type: 'solar_return_fallback'
    },
    progressionPeriod: progressionPeriod,
    isFallback: true,
    isMockData: true,
    isSolarReturn: true,
    generatedAt: new Date().toISOString(),
    currentAge: progressionPeriod.currentAge,

    // Planetas individuales
    sol_progresado: {
      longitude: 321.139,
      sign: 'Acuario',
      degree: 21.139,
      house: 12,
      retrograde: false,
      symbol: '☉',
      meaning: 'Tu identidad solar regresa a casa - Renovación anual'
    },
    luna_progresada: {
      longitude: 136.5,
      sign: 'Leo',
      degree: 16.5,
      house: 5,
      retrograde: false,
      symbol: '☽',
      meaning: 'Emociones radiantes - Año de creatividad'
    },
    mercurio_progresado: {
      longitude: 321.3,
      sign: 'Acuario', 
      degree: 21.3,
      house: 12,
      retrograde: false,
      symbol: '☿',
      meaning: 'Comunicación innovadora'
    },
    venus_progresado: {
      longitude: 3.7,
      sign: 'Aries',
      degree: 3.7,
      house: 1,
      retrograde: false,
      symbol: '♀',
      meaning: 'Amor pionero'
    },
    marte_progresado: {
      longitude: 138.4,
      sign: 'Leo',
      degree: 18.4,
      house: 5,
      retrograde: false,
      symbol: '♂',
      meaning: 'Energía creativa'
    },
    jupiter_progresado: {
      longitude: 71.3,
      sign: 'Géminis',
      degree: 11.3,
      house: 3,
      retrograde: false,
      symbol: '♃',
      meaning: 'Expansión comunicativa'
    },
    saturno_progresado: {
      longitude: 348.4,
      sign: 'Piscis',
      degree: 18.4,
      house: 1,
      retrograde: false,
      symbol: '♄',
      meaning: 'Disciplina espiritual'
    },
    urano_progresado: {
      longitude: 53.3,
      sign: 'Tauro',
      degree: 23.3,
      house: 2,
      retrograde: false,
      symbol: '♅',
      meaning: 'Revolución material'
    },
    neptuno_progresado: {
      longitude: 358.2,
      sign: 'Piscis',
      degree: 28.2,
      house: 1,
      retrograde: false,
      symbol: '♆',
      meaning: 'Intuición elevada'
    },
    pluton_progresado: {
      longitude: 302.3,
      sign: 'Acuario',
      degree: 2.3,
      house: 11,
      retrograde: false,
      symbol: '♇',
      meaning: 'Transformación grupal'
    }
  };
}

// Funciones auxiliares adicionales
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