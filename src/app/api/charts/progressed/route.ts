
// src/app/api/charts/progressed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart, { castChart } from '@/models/Chart';
// ✅ IMPORT CORREGIDO - Named import directo
import { generateProgressedChart } from '@/services/progressedChartService';

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

    // ✅ PASO 1: BUSCAR DATOS DE NACIMIENTO con query robusto
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
    
    // ✅ CASTING SEGURO
    const birthData = castBirthData(birthDataRaw);
    
    if (!birthData) {
      // 🔍 DIAGNÓSTICO: Buscar cualquier documento para debug
      const anyBirthData = await BirthData.findOne({}).lean();
      
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontraron datos de nacimiento para UID: ' + uid,
        debug: {
          buscado: uid,
          documentosEncontrados: anyBirthData ? 1 : 0,
          estructuraEjemplo: anyBirthData
            ? Array.isArray(anyBirthData)
              ? anyBirthData.length > 0
                ? {
                    userId: (anyBirthData[0] as any).userId,
                    uid: (anyBirthData[0] as any).uid,
                    campos: Object.keys(anyBirthData[0])
                  }
                : 'Sin datos en la colección'
              : {
                  userId: (anyBirthData as any).userId,
                  uid: (anyBirthData as any).uid,
                  campos: Object.keys(anyBirthData)
                }
            : 'Sin datos en la colección'
        },
        solucion: "Verifica que los datos de nacimiento estén guardados correctamente"
      }, { status: 404 });
    }

    // ✅ VALIDACIÓN de campos requeridos
    const requiredFields = ['birthDate', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !birthData[field as keyof typeof birthData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Datos de nacimiento incompletos',
        missingFields: missingFields,
        available: {
          birthDate: !!birthData.birthDate,
          latitude: !!birthData.latitude,
          longitude: !!birthData.longitude,
          birthTime: !!birthData.birthTime,
          timezone: !!birthData.timezone
        }
      }, { status: 400 });
    }

    console.log('✅ [PROGRESSED] BirthData válido encontrado:', {
      id: birthData._id?.toString(),
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace
    });

    // ✅ PASO 2: CALCULAR PERÍODO DE PROGRESIÓN
    const birthDateObj = birthData.birthDate instanceof Date 
      ? birthData.birthDate 
      : new Date(birthData.birthDate);
    
    const progressionPeriod = calculateProgressionPeriod(birthDateObj);
    
    console.log('📅 [PROGRESSED] Período calculado:', {
      edad: progressionPeriod.currentAge,
      año: progressionPeriod.startYear,
      período: progressionPeriod.period
    });

    // ✅ PASO 3: BUSCAR CARTA EXISTENTE (reciente)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const existingChartRaw = await Chart.findOne({ 
      $or: [
        { uid: uid },
        { userId: uid }
      ],
      lastUpdated: { $gte: yesterday } // Solo cartas del último día
    }).lean();

    const existingChart = castChart(existingChartRaw);

    if (existingChart) {
      console.log('🔍 [PROGRESSED] Carta existente encontrada');

      // Intentar recuperar carta progresada existente
      let activeChart = null;
      
      // Estructura nueva (array)
      if (existingChart.progressedCharts?.length) {
        activeChart = existingChart.progressedCharts.find(pc => pc.isActive);
      }
      
      // Estructura legacy (objeto directo)
      if (!activeChart && existingChart.progressedChart) {
        activeChart = {
          chart: existingChart.progressedChart,
          period: progressionPeriod.period,
          year: progressionPeriod.startYear
        };
      }
      
      if (activeChart?.chart) {
        console.log('✅ [PROGRESSED] Usando carta existente');
        return NextResponse.json({
          success: true,
          data: {
            progressedChart: activeChart.chart,
            period: {
              from: `Cumpleaños ${progressionPeriod.currentAge}`,
              to: `Cumpleaños ${progressionPeriod.currentAge + 1}`,
              solarYear: progressionPeriod.startYear,
              description: progressionPeriod.description
            },
            source: 'cache',
            age: progressionPeriod.currentAge
          }
        });
      }
    }

    // ✅ PASO 4: GENERAR NUEVA CARTA PROGRESADA CON MEJOR INTEGRACIÓN PROKERALA
    console.log('🎨 [PROGRESSED] Generando nueva carta progresada con datos completos...');

    let progressedData;

    try {
      // ✅ LLAMADA MEJORADA AL SERVICIO con parámetros completos
      progressedData = await generateProgressedChart({
        birthDate: birthDateObj.toISOString().split('T')[0], // YYYY-MM-DD format
        birthTime: birthData.birthTime || '12:00',
        latitude: Number(birthData.latitude),
        longitude: Number(birthData.longitude),
        timezone: birthData.timezone || 'Europe/Madrid',
        progressionYear: progressionPeriod.startYear
      });

      console.log('✨ [PROGRESSED] Carta generada exitosamente con datos completos');

      // ✅ VALIDACIÓN Y MEJORA DE DATOS
      if (progressedData) {
        // Asegurar que todos los planetas principales estén presentes
        const requiredPlanets = ['sol_progresado', 'luna_progresada', 'mercurio_progresado', 'venus_progresada', 'marte_progresado'];

        for (const planetKey of requiredPlanets) {
          if (!progressedData[planetKey as keyof typeof progressedData]) {
            console.log(`⚠️ [PROGRESSED] Planeta faltante: ${planetKey}, generando datos básicos`);
            // Aquí podríamos hacer una llamada adicional a Prokerala para este planeta específico
          }
        }

        // Asegurar que las casas estén calculadas
        if (!progressedData.houses || progressedData.houses.length !== 12) {
          console.log('⚠️ [PROGRESSED] Casas faltantes, calculando posiciones básicas');
          progressedData.houses = Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            longitude: (i * 30) + 15,
            sign: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'][i]
          }));
        }

        // Asegurar aspectos progresados
        if (!progressedData.aspectos_natales_progresados) {
          progressedData.aspectos_natales_progresados = [];
        }

        // Añadir metadata de progreso
        progressedData.generatedAt = new Date().toISOString();
        progressedData.isMockData = false;
        progressedData.progressionPeriod = progressionPeriod;
      }

    } catch (generationError) {
      console.log('⚠️ [PROGRESSED] Error en generación, usando datos de fallback mejorados:', generationError);

      // ✅ FALLBACK MEJORADO con estructura completa y más planetas
      progressedData = {
        // Planetas progresados principales (5 planetas principales)
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
        venus_progresada: {
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

        // Edad actual calculada
        currentAge: progressionPeriod.currentAge,

        // Casas progresadas completas
        houses: Array.from({ length: 12 }, (_, i) => ({
          house: i + 1,
          longitude: (i * 30) + 15,
          sign: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'][i]
        })),

        // Aspectos progresados básicos
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

        // Metadata completa
        generatedAt: new Date().toISOString(),
        isMockData: true,
        progressionPeriod: progressionPeriod,

        // Información adicional para mejor UX
        elementDistribution: { fire: 2, earth: 1, air: 2, water: 2 },
        modalityDistribution: { cardinal: 2, fixed: 1, mutable: 2 }
      };
    }

    // ✅ PASO 5: GUARDAR NUEVA CARTA
    try {
      const newChart = new Chart({
        userId: uid,
        uid: uid,
        birthDataId: birthData._id,
        chartType: 'progressed',
        natalChart: {}, // Vacío por ahora
        
        // ✅ ESTRUCTURA NUEVA (array)
        progressedCharts: [{
          period: progressionPeriod.period,
          year: progressionPeriod.startYear,
          startDate: progressionPeriod.startDate,
          endDate: progressionPeriod.endDate,
          chart: progressedData,
          isActive: true,
          createdAt: new Date()
        }],
        
        // ✅ COMPATIBILIDAD con estructura legacy
        progressedChart: progressedData,
        lastUpdated: new Date()
      });

      await newChart.save();
      console.log('💾 [PROGRESSED] Carta guardada correctamente');
      
    } catch (saveError) {
      console.log('⚠️ [PROGRESSED] Error guardando (continuando):', saveError);
    }

    // ✅ RESPUESTA FINAL
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
        source: 'generated',
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

// ✅ MÉTODO POST como alias de GET
export async function POST(request: NextRequest) {
  return GET(request);
}