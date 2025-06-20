// src/app/api/astrology/natal-chart-accurate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import { getNatalHoroscope } from '@/services/prokeralaService';
import { validateBirthData, convertToUTC, formatCoordinates, formatProkeralaCoordinates, formatProkeralaDateTime } from '../../../../utils/timezoneUtils';

interface NatalChartRequest {
  // Datos básicos
  birthDate: string;
  birthTime: string;
  timeType?: 'HL' | 'UT' | 'LMT'; // Tipo de hora proporcionada
  latitude: number | string;
  longitude: number | string;
  timezone: string;
  
  // Datos opcionales
  fullName?: string;
  userId?: string;
  birthTimeUnknown?: boolean;
  regenerate?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body: NatalChartRequest = await request.json();
    const { 
      birthDate, 
      birthTime, 
      timeType = 'HL', // Por defecto asumimos Hora Local
      latitude, 
      longitude, 
      timezone,
      fullName,
      userId,
      birthTimeUnknown = false,
      regenerate = false
    } = body;

    console.log('🌟 Generando carta natal con parámetros:', {
      birthDate,
      birthTime,
      timeType,
      latitude,
      longitude,
      timezone
    });

    // 1. Preparar la hora según el tipo
    let processedBirthTime = birthTime;
    let processedTimezone = timezone;
    let utcTime = '';
    let timezoneOffset = '';

    if (timeType === 'UT') {
      // Si la hora ya está en UT, no necesita conversión
      utcTime = birthTime;
      processedTimezone = 'UTC';
      timezoneOffset = '+00:00';
      console.log('⏰ Hora ya proporcionada en UT:', utcTime);
    } else if (timeType === 'LMT') {
      // Local Mean Time - calcular basado en longitud
      const lon = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
      const lmtOffsetMinutes = (lon / 15) * 60;
      const offsetHours = Math.floor(Math.abs(lmtOffsetMinutes) / 60);
      const offsetMins = Math.round(Math.abs(lmtOffsetMinutes) % 60);
      
      // Convertir LMT a UT
      const [hours, minutes, seconds = '00'] = birthTime.split(':');
      let utHours = parseInt(hours) - (lon >= 0 ? offsetHours : -offsetHours);
      let utMinutes = parseInt(minutes) - (lon >= 0 ? offsetMins : -offsetMins);
      
      // Ajustar minutos
      if (utMinutes < 0) {
        utMinutes += 60;
        utHours -= 1;
      } else if (utMinutes >= 60) {
        utMinutes -= 60;
        utHours += 1;
      }
      
      // Ajustar horas
      if (utHours < 0) utHours += 24;
      if (utHours >= 24) utHours -= 24;
      
      utcTime = `${String(utHours).padStart(2, '0')}:${String(utMinutes).padStart(2, '0')}:${seconds}`;
      processedTimezone = 'UTC';
      timezoneOffset = '+00:00';
      
      console.log(`⏰ LMT convertido a UT: ${birthTime} LMT → ${utcTime} UT`);
    } else {
      // HL (Hora Local) - usar la función de conversión
      const conversion = convertToUTC(birthDate, birthTime, timezone);
      utcTime = conversion.utcTime;
      timezoneOffset = conversion.offset;
      
      console.log(`⏰ HL convertido a UT: ${birthTime} ${timezone} → ${utcTime} UT`);
    }

    // 2. Validar todos los datos
    const validation = validateBirthData({
      birthDate,
      birthTime: processedBirthTime,
      latitude,
      longitude,
      timezone: processedTimezone
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Datos de nacimiento inválidos',
          details: validation.errors,
          warnings: validation.warnings
        },
        { status: 400 }
      );
    }

    // 3. Verificar si ya existe una carta natal (si se proporciona userId)
    if (userId && !regenerate) {
      const existingChart = await Chart.findOne({ 
        userId,
        chartType: 'natal'
      });
      
      if (existingChart && existingChart.natalChart) {
        console.log('✅ Carta natal existente encontrada');
        return NextResponse.json({
          success: true,
          data: existingChart.natalChart,
          cached: true,
          metadata: {
            timeType,
            utcTime,
            timezoneOffset,
            validation: validation.correctedData
          }
        });
      }
    }

    // 4. Generar nueva carta natal
    console.log('🔄 Generando nueva carta natal...');
    
    // Use UTC time with +00:00 offset to avoid duplicated offset in datetime string
    const formattedDateTime = `${validation.correctedData.birthDate}T${utcTime}+00:00`;

    const formattedCoordinates = formatProkeralaCoordinates(
      validation.correctedData.latitude,
      validation.correctedData.longitude
    );

    const natalChart = await getNatalHoroscope(
      formattedDateTime,
      formattedCoordinates,
      {
        houseSystem: 'placidus',
        aspectFilter: 'all',
        language: 'es',
        ayanamsa: '0', // Tropical
        birthTimeUnknown,
        birthTimeRectification: 'none' // Changed from 'flat-chart' to 'none'
      }
    );

    // 5. Procesar y formatear los datos
    const processedChart = processNatalChartData(natalChart, {
      birthDate: validation.correctedData.birthDate,
      birthTime: validation.correctedData.birthTime,
      birthTimeUTC: utcTime,
      latitude: validation.correctedData.latitude,
      longitude: validation.correctedData.longitude,
      timezone: validation.correctedData.timezone,
      timezoneOffset,
      timeType
    });

    // 6. Guardar en base de datos si se proporciona userId
    if (userId) {
      try {
        // Primero guardar/actualizar los datos de nacimiento
        await BirthData.findOneAndUpdate(
          { userId },
          {
            userId,
            fullName: fullName || 'Usuario',
            birthDate: new Date(birthDate),
            birthTime: birthTimeUnknown ? null : processedBirthTime,
            birthTimeUnknown,
            latitude: validation.correctedData.latitude,
            longitude: validation.correctedData.longitude,
            timezone: validation.correctedData.timezone,
            birthPlace: `${validation.correctedData.latitude}, ${validation.correctedData.longitude}`
          },
          { upsert: true, new: true }
        );

        // Luego guardar la carta natal
        await Chart.findOneAndUpdate(
          { userId },
          {
            userId,
            chartType: 'natal',
            natalChart: processedChart,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );

        console.log('💾 Carta natal guardada en base de datos');
      } catch (dbError) {
        console.error('Error guardando en DB:', dbError);
        // No fallar si hay error en DB, ya tenemos la carta
      }
    }

    // 7. Devolver resultado
    return NextResponse.json({
      success: true,
      data: processedChart,
      metadata: {
        timeType,
        utcTime,
        timezoneOffset,
        validation: validation.correctedData,
        calculatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error generando carta natal:', error);
    return NextResponse.json(
      { 
        error: 'Error al generar carta natal',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// GET endpoint para testing
export async function GET(request: NextRequest) {
  try {
    // Datos de ejemplo para Verónica
    const exampleData = {
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      timeType: 'HL',
      latitude: 40.4383,
      longitude: -3.7058,
      timezone: 'Europe/Madrid',
      fullName: 'Verónica (Ejemplo)'
    };

    // Calcular conversiones
    const hlConversion = convertToUTC(exampleData.birthDate, exampleData.birthTime, exampleData.timezone);
    const coords = formatCoordinates(exampleData.latitude, exampleData.longitude);

    return NextResponse.json({
      message: 'Endpoint de carta natal funcionando',
      example: {
        input: exampleData,
        conversions: {
          HL: {
            time: exampleData.birthTime,
            timezone: exampleData.timezone,
            offset: hlConversion.offset
          },
          UT: {
            time: hlConversion.utcTime,
            timezone: 'UTC',
            offset: '+00:00'
          }
        },
        prokeralaFormat: {
          datetime: `${exampleData.birthDate}T${exampleData.birthTime}${hlConversion.offset}`,
          coordinates: coords.formatted
        },
        expectedResults: {
          sun: '21°08\'22" Aquarius House 1',
          moon: '06°03\'31" Libra House 8',
          ascendant: '04°09\'26" Aquarius'
        }
      },
      instructions: {
        HL: 'Envía la hora local con la zona horaria correcta',
        UT: 'Envía la hora UTC con timeType: "UT"',
        LMT: 'Envía la hora solar media local con timeType: "LMT"'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en endpoint de prueba' },
      { status: 500 }
    );
  }
}

/**
 * Procesar datos de carta natal
 */
function processNatalChartData(apiData: any, metadata: any): any {
  const data = apiData.data || apiData;
  
  // Mapear planetas
  const planets = data.planet_positions?.map((planet: any) => ({
    name: planet.name || planet.planet_name,
    sign: planet.sign || planet.zodiac_sign,
    degree: planet.full_degree || planet.degree,
    position: `${Math.floor(planet.degree || 0)}°${Math.round((planet.degree % 1) * 60)}'`,
    house: planet.house || 1,
    retrograde: planet.is_retrograde || false
  })) || [];

  // Agregar puntos importantes
  if (data.ascendant) {
    planets.push({
      name: 'Ascendente',
      sign: data.ascendant.sign || 'Desconocido',
      degree: data.ascendant.degree || 0,
      position: data.ascendant.full_degree || '',
      house: 1,
      retrograde: false
    });
  }

  if (data.midheaven || data.mc) {
    planets.push({
      name: 'Medio Cielo',
      sign: (data.midheaven || data.mc).sign || 'Desconocido',
      degree: (data.midheaven || data.mc).degree || 0,
      position: (data.midheaven || data.mc).full_degree || '',
      house: 10,
      retrograde: false
    });
  }

  return {
    metadata: {
      ...metadata,
      generatedAt: new Date().toISOString(),
      system: 'Tropical',
      houseSystem: 'Placidus'
    },
    planets,
    houses: data.house_cusps || [],
    aspects: data.planet_aspects || [],
    raw: data // Datos originales para debugging
  };
}