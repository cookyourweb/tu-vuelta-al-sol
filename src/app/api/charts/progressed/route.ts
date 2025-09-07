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
      // Llamada directa a Prokerala API
      const prokeralaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/prokerala/progressed-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthDateObj.toISOString().split('T')[0],
          birthTime: birthData.birthTime || '12:00',
          latitude: Number(birthData.latitude),
          longitude: Number(birthData.longitude),
          timezone: birthData.timezone || 'Europe/Madrid',
          progressionYear: progressionPeriod.startYear
        })
      });

      if (prokeralaResponse.ok) {
        const prokeralaData = await prokeralaResponse.json();
        if (prokeralaData.success) {
          progressedData = prokeralaData.data;
          console.log('✅ [PROGRESSED] DATOS DE PROKERALA - Carta generada exitosamente');
        } else {
          throw new Error('Error en respuesta Prokerala');
        }
      } else {
        throw new Error('Error llamando API Prokerala');
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
      const prokeralaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/prokerala/progressed-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthDateObj.toISOString().split('T')[0],
          birthTime: birthData.birthTime || '12:00',
          latitude: Number(birthData.latitude),
          longitude: Number(birthData.longitude),
          timezone: birthData.timezone || 'Europe/Madrid',
          progressionYear: progressionPeriod.startYear
        })
      });

      if (prokeralaResponse.ok) {
        const prokeralaData = await prokeralaResponse.json();
        if (prokeralaData.success) {
          progressedData = prokeralaData.data;
          console.log('✅ [PROGRESSED] POST - DATOS DE PROKERALA - Carta generada exitosamente');
        } else {
          throw new Error('Error en respuesta Prokerala');
        }
      } else {
        throw new Error('Error llamando API Prokerala');
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
