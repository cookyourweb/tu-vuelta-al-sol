// src/app/api/astrology/complete-events/route.ts
// 🌟 ENDPOINT PRINCIPAL ARREGLADO - SIN OPENAI HASTA RESOLVER CUOTA

import { NextRequest, NextResponse } from 'next/server';
import { checkUserDataCompleteness } from '@/services/userDataService';
import { getAstrologicalEvents } from '@/services/astrologicalEventsService';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { birthData: providedBirthData, userId, forceRegenerate = false } = await request.json();
    
    console.log('🚀 Iniciando generación de agenda completa SIN IA...');
    
    let birthData = providedBirthData;
    
    // 🔍 SI NO SE PROPORCIONAN DATOS DE NACIMIENTO, OBTENERLOS DEL USUARIO
    if (!birthData && userId) {
      console.log('🔍 Obteniendo datos de nacimiento del usuario...');
      
      const userDataCheck = await checkUserDataCompleteness(userId);
      
      if (!userDataCheck.hasRequiredData) {
        console.log('❌ Datos incompletos:', userDataCheck.missingData);
        return NextResponse.json({
          success: false,
          error: 'Datos de nacimiento incompletos',
          missingData: userDataCheck.missingData,
          action: 'redirect_to_birth_data',
          message: 'Necesitas configurar tus datos de nacimiento primero'
        }, { status: 400 });
      }
      
      birthData = userDataCheck.birthData;
      console.log('✅ Datos de nacimiento obtenidos del usuario');
    }
    
    // 🔍 VALIDAR QUE TENEMOS LOS DATOS MÍNIMOS
    if (!birthData || birthData === null || !birthData.date || !birthData.latitude || !birthData.longitude) {
      console.log('❌ Datos de nacimiento insuficientes:', birthData);
      return NextResponse.json({
        success: false,
        error: 'Datos de nacimiento requeridos',
        requiredFields: ['date', 'time', 'location', 'latitude', 'longitude'],
        action: 'provide_birth_data',
        receivedData: birthData
      }, { status: 400 });
    }

    console.log('✅ Datos validados, generando eventos...');

    // 📅 GENERAR EVENTOS ASTROLÓGICOS BÁSICOS
    console.log('📅 Generando eventos astrológicos...');
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    let events = [];
    try {
      events = await generateAstrologicalEvents(
        birthData.date,
        birthData.time,
        birthData.latitude,
        birthData.longitude,
        currentYear,
        nextYear
      );
      console.log(`✅ ${events.length} eventos astrológicos generados`);
    } catch (eventsError) {
      console.error('❌ Error generando eventos:', eventsError);
      return NextResponse.json({
        success: false,
        error: 'Error generando eventos astrológicos',
        details: eventsError instanceof Error ? eventsError.message : 'Error desconocido'
      }, { status: 500 });
    }
    
    // 🎯 PREPARAR PERFIL DE USUARIO
    const userProfile = {
      birthDate: birthData.date,
      birthTime: birthData.time,
      place: birthData.location,
      nextAge: calculateAge(birthData.date) + 1,
      currentAge: calculateAge(birthData.date),
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 'UTC',
      coordinates: {
        latitude: birthData.latitude,
        longitude: birthData.longitude
      }
    };
    
    console.log('✅ Perfil de usuario preparado:', {
      place: userProfile.place,
      currentAge: userProfile.currentAge,
      nextAge: userProfile.nextAge
    });
    
    // 🚨 SALTAMOS LA INTERPRETACIÓN IA POR AHORA - SOLO EVENTOS BÁSICOS
    console.log('⚠️ Saltando interpretación IA por límite de cuota...');
    const interpretedEvents = events.map((event: any) => ({
      ...event,
      aiInterpretation: {
        personalImpact: `Este evento ${event.title} influirá en tu desarrollo personal.`,
        practicalAdvice: `Aprovecha la energía de ${event.type} para tu crecimiento.`,
        spiritualGuidance: `Conecta con las energías cósmicas de este período.`,
        mantra: `Estoy en armonía con el cosmos.`,
        priority: event.priority || 'medium'
      }
    }));
    
    // 📊 GENERAR RESUMEN EJECUTIVO SIMPLE
    console.log('📊 Generando resumen ejecutivo simple...');
    const executiveSummary = generateSimpleExecutiveSummary(interpretedEvents, userProfile);
    
    // 📈 CALCULAR ESTADÍSTICAS
    const categories = [...new Set(interpretedEvents.map((e: any) => e.category || e.type))];
    const stats = {
      totalEvents: interpretedEvents.length,
      highPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'high').length,
      mediumPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'medium').length,
      lowPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'low').length,
      withAiInterpretation: interpretedEvents.length, // Todos tienen interpretación básica
      lunarPhases: interpretedEvents.filter((e: any) => e.type && e.type.includes('luna')).length,
      eclipses: interpretedEvents.filter((e: any) => e.type === 'eclipse').length,
      retrogrades: interpretedEvents.filter((e: any) => e.type === 'retrogrado').length,
      aspects: interpretedEvents.filter((e: any) => e.type === 'aspecto').length,
      planetaryTransits: interpretedEvents.filter((e: any) => e.type === 'transito').length,
      directMotions: interpretedEvents.filter((e: any) => e.type === 'directo').length,
      seasonal: interpretedEvents.filter((e: any) => e.type === 'seasonal').length
    };
    
    // 🎯 ESTRUCTURA FINAL DE LA AGENDA
    const completeAgenda = {
      userProfile,
      events: interpretedEvents,
      executiveSummary,
      statistics: stats,
      metadata: {
        generatedAt: new Date().toISOString(),
        generationTimeMs: Date.now() - startTime,
        version: '1.1-no-ai',
        aiInterpretationUsed: false, // Marcamos que no usamos IA por la cuota
        cacheEnabled: false,
        totalCategories: categories.length,
        openaiError: 'rate_limit_exceeded'
      }
    };
    
    const totalTime = Date.now() - startTime;
    console.log(`🌟 Agenda básica generada: ${stats.totalEvents} eventos totales en ${totalTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: completeAgenda,
      metadata: {
        fromCache: false,
        generationTimeMs: totalTime,
        processingStages: {
          eventsGenerated: events.length,
          aiInterpretations: 0, // Sin IA por ahora
          executiveSummaryGenerated: true,
          cacheAttempted: false,
          performanceOptimal: totalTime < 60000
        },
        warning: 'OpenAI cuota excedida - usando interpretaciones básicas',
        nextSteps: 'Resolver cuota de OpenAI para interpretaciones avanzadas'
      }
    });
    
  } catch (error) {
    console.error('❌ Error en complete-events:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error generando agenda',
      details: error instanceof Error ? error.stack : 'Error desconocido',
      metadata: {
        fromCache: false,
        generationTimeMs: Date.now() - startTime,
        stage: 'generation_failed'
      }
    }, { status: 500 });
  }
}

// ==========================================
// 🔧 FUNCIONES AUXILIARES
// ==========================================

function calculateAge(date: string): number {
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function generateSimpleExecutiveSummary(events: any[], userProfile: any) {
  return {
    monthlyHighlights: [
      'Ene-Mar: TEMPORADA DE DESPERTAR CÓSMICO - ¡Activa tu poder interior!',
      'Abr-Jun: PORTAL DE MANIFESTACIÓN RADICAL - ¡Momento de crear tu nueva realidad!',
      'Jul-Sep: REVOLUCIÓN INTERIOR TOTAL - ¡Rompe todos los patrones limitantes!',
      'Oct-Dic: INTEGRACIÓN Y PODER MÁXIMO - ¡Vive tu verdad más auténtica!'
    ],
    quarterlyFocus: [
      'Q1: DESPERTAR REVOLUCIONARIO - Conecta con tu esencia transformadora',
      'Q2: MANIFESTACIÓN CUÁNTICA - Materializa tus sueños más épicos',
      'Q3: LIBERACIÓN TOTAL - Suelta todo lo que ya no eres',
      'Q4: PODER MÁXIMO ACTIVADO - Vive tu misión cósmica completa'
    ],
    yearlyThemes: [
      'REVOLUCIÓN PERSONAL TOTAL - ¡No viniste a este planeta para quedarte pequeña!',
      'MANIFESTACIÓN DE TU VERDADERO PODER - ¡Es tu momento de brillar!',
      'LIBERACIÓN DE PATRONES LIMITANTES - ¡Rompe las cadenas del pasado!',
      'ACTIVACIÓN DE TU MISIÓN CÓSMICA - ¡El universo te necesita!'
    ],
    priorityActions: [
      {
        category: 'revolución_personal',
        action: 'ACTIVA una práctica diaria de conexión con tu poder interior',
        timing: 'inmediato',
        difficulty: 'REVOLUCIONARIO',
        impact: 'TRANSFORMACIÓN_TOTAL'
      },
      {
        category: 'manifestación',
        action: 'CREA un mapa visual de tu nueva realidad épica',
        timing: 'esta_semana',
        difficulty: 'LIBERADOR',
        impact: 'MANIFESTACIÓN_RADICAL'
      }
    ]
  };
}

async function generateAstrologicalEvents(date: any, time: any, latitude: any, longitude: any, currentYear: number, nextYear: number): Promise<any[]> {
  try {
    // Construir las fechas de inicio y fin basadas en los años proporcionados
    const startDate = `${currentYear}-${date.split('-')[1]}-${date.split('-')[2]}`;
    const endDate = `${nextYear}-${date.split('-')[1]}-${date.split('-')[2]}`;
    
    // Usar el servicio existente para generar eventos
    const events = await getAstrologicalEvents(
      startDate,
      endDate,
      latitude,
      longitude,
      'Europe/Madrid'
    );
    
    return events;
  } catch (error) {
    console.error('❌ Error en generateAstrologicalEvents:', error);
    // Retornar eventos mínimos en caso de error
    return generateMinimalEvents(date, currentYear, nextYear);
  }
}

function generateMinimalEvents(date: string, currentYear: number, nextYear: number): any[] {
  const events = [];
  const startDate = new Date(`${currentYear}-${date.split('-')[1]}-${date.split('-')[2]}`);
  const endDate = new Date(`${nextYear}-${date.split('-')[1]}-${date.split('-')[2]}`);
  
  // Generar eventos lunares básicos cada 2 semanas
  for (let i = 0; i < 26; i++) {
    const eventDate = new Date(startDate);
    eventDate.setDate(startDate.getDate() + (i * 14));
    
    if (eventDate <= endDate) {
      const phases = ['Luna Nueva', 'Cuarto Creciente', 'Luna Llena', 'Cuarto Menguante'];
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      const phase = phases[i % 4];
      const sign = signs[i % 12];
      
      events.push({
        id: `minimal_${eventDate.toISOString().split('T')[0]}_${i}`,
        type: 'lunar_phase',
        date: eventDate.toISOString().split('T')[0],
        title: `${phase} en ${sign}`,
        description: `Fase lunar ${phase.toLowerCase()} en el signo de ${sign}. Momento para conectar con las energías lunares.`,
        sign: sign,
        priority: phase.includes('Luna') ? 'high' : 'medium'
      });
    }
  }
  
  return events.slice(0, 20); // Limitar a 20 eventos
}