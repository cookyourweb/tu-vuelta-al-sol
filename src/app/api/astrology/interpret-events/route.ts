// src/app/api/astrology/interpret-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';

// Corregir el import
import * as trainedAssistantService from '@/services/trainedAssistantService';
import type { UserProfile, AstrologicalEvent, PersonalizedInterpretation } from '@/types/astrology/unified-types';

export async function POST(request: NextRequest) {
  try {
    const { userId, events, includeExecutiveSummary = true } = await request.json();
    
    if (!userId || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, error: 'userId y events son requeridos' },
        { status: 400 }
      );
    }

    console.log(`🤖 Interpretando ${events.length} eventos para usuario: ${userId}`);

    await connectDB();
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { success: false, error: 'Datos de nacimiento no encontrados' },
        { status: 404 }
      );
    }

    // Crear perfil del usuario para la IA
    const currentDate = new Date();
    const birthDate = new Date(birthData.birthDate);
    const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
    
    const userProfile: UserProfile = {
      userId: userId,
      name: birthData.fullName || 'Usuario',
      birthDate: birthData.birthDate,
      currentAge: currentAge,
      nextAge: currentAge + 1,
      latitude: parseFloat(birthData.latitude),
      longitude: parseFloat(birthData.longitude),
      timezone: birthData.timezone || 'Europe/Madrid',
      place: birthData.birthPlace || 'Madrid, España',
      astrological: {
        signs: {
          sun: birthData.sunSign || 'Aries',
          moon: birthData.moonSign || 'Cancer',
          ascendant: birthData.ascendantSign || 'Leo',
          mercury: birthData.mercurySign || 'Geminis',
          venus: birthData.venusSign || 'Taurus',
          mars: birthData.marsSign || 'Aries'
        },
        houses: {
          sun: birthData.sunHouse || 1,
          moon: birthData.moonHouse || 4,
          mercury: birthData.mercuryHouse || 3,
          venus: birthData.venusHouse || 2,
          mars: birthData.marsHouse || 1
        },
        dominantElements: ['fire'],
        dominantMode: 'cardinal',
        lifeThemes: ['Autoconocimiento', 'Expresión creativa', 'Relaciones armoniosas'],
        strengths: ['Iniciativa natural', 'Intuición emocional', 'Capacidad de liderazgo'],
        challenges: ['Desarrollar paciencia', 'Equilibrar ego y humildad']
      }
    };

    console.log(`👤 Perfil del usuario: ${userProfile.nextAge} años, ${userProfile.place}`);

    // Filtrar eventos de alta prioridad
    const highPriorityEvents = events.filter((event: any) => 
      event.priority === 'high' || event.priority === 'medium'
    );
    
    const maxEventsToInterpret = Math.min(highPriorityEvents.length, 15);
    console.log(`🎯 Interpretando ${maxEventsToInterpret} eventos de alta prioridad de ${events.length} totales`);

    // Generar interpretaciones personalizadas con IA
    const aiInterpretations: PersonalizedInterpretation[] = await trainedAssistantService.generateMultipleInterpretations(
      highPriorityEvents,
      userProfile,
      maxEventsToInterpret
    );
    const interpretedEvents: AstrologicalEvent[] = highPriorityEvents.map((event: any, idx: number) => ({
      ...event,
      aiInterpretation: aiInterpretations[idx] || null
    }));

    // Combinar eventos interpretados con el resto
    const allEvents = [
      ...interpretedEvents,
      ...events.filter((event: any) => !highPriorityEvents.some(hp => hp.id === event.id))
    ];

    let executiveSummaryResult = null;
    if (includeExecutiveSummary) {
      console.log('📊 Generando resumen ejecutivo del año astrológico...');
      executiveSummaryResult = await trainedAssistantService.generateExecutiveSummary(interpretedEvents, userProfile);
    }

    // Calcular estadísticas de interpretación - CORRECCIÓN DE TIPOS
    const interpretationStats = {
      totalEvents: events.length,
      interpretedEvents: interpretedEvents.filter((e: AstrologicalEvent) => e.aiInterpretation).length,
      highPriorityInterpreted: interpretedEvents.filter((e: AstrologicalEvent) => 
        e.priority === 'high' && e.aiInterpretation).length,
      mediumPriorityInterpreted: interpretedEvents.filter((e: AstrologicalEvent) => 
        e.priority === 'medium' && e.aiInterpretation).length,
      
      // Estadísticas por tipo de evento
      eventTypes: {
        lunarPhases: interpretedEvents.filter((e: AstrologicalEvent) => 
          e.type === 'lunar_phase' && e.aiInterpretation).length,
      },
      
      // Estadísticas de planes de acción
      actionPlans: {
        total: interpretedEvents.reduce((total: number, event: AstrologicalEvent) => 
          total + (event.aiInterpretation?.actionPlan?.length || 0), 0),
        immediate: interpretedEvents.reduce((total: number, event: AstrologicalEvent) => 
          total + (event.aiInterpretation?.actionPlan?.filter(ap => ap.timing === 'inmediato').length || 0), 0),
        weekly: interpretedEvents.reduce((total: number, event: AstrologicalEvent) => 
          total + (event.aiInterpretation?.actionPlan?.filter(ap => ap.timing === 'esta_semana').length || 0), 0),
        monthly: interpretedEvents.reduce((total: number, event: AstrologicalEvent) => 
          total + (event.aiInterpretation?.actionPlan?.filter(ap => ap.timing === 'este_mes').length || 0), 0)
      }
    };

    console.log(`✅ ${interpretationStats.interpretedEvents} eventos interpretados con IA`);

    const response = {
      success: true,
      data: {
        events: allEvents,
        userProfile: {
          age: userProfile.nextAge,
          location: userProfile.place,
          timezone: userProfile.timezone
        },
        interpretationStats,
        ...(executiveSummaryResult && { executiveSummary: executiveSummaryResult }),
        aiMetadata: {
          generatedAt: new Date().toISOString(),
          model: 'claude-sonnet-4',
          version: '2.0',
          personalizationLevel: 'high',
          eventsProcessed: interpretationStats.interpretedEvents,
          actionPlansGenerated: interpretationStats.actionPlans.total
        }
      },
      message: `${interpretationStats.interpretedEvents} eventos interpretados con IA personalizada`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error en interpretación IA de eventos:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error instanceof Error ? error.stack : undefined,
      message: 'Error al interpretar eventos con IA'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId es requerido' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "✅ Endpoint de Interpretación IA Avanzada funcionando",
    description: "Genera interpretaciones personalizadas con planes de acción usando IA",
    capabilities: [
      "Análisis personalizado por edad y ubicación",
      "Planes de acción específicos por categoría",
      "Timing optimizado para cada acción", 
      "Advertencias y oportunidades personalizadas",
      "Mantras y rituales adaptados",
      "Resumen ejecutivo del año astrológico"
    ],
    usage: {
      method: "POST",
      required_params: ["userId", "events"],
      optional_params: ["includeExecutiveSummary"],
      response: "Eventos con interpretaciones IA personalizadas + resumen ejecutivo"
    },
    limits: {
      maxEventsPerRequest: 15,
      aiInterpretationLevel: "alta_personalización",
      actionPlansPerEvent: "3-5",
      processingTime: "30-60 segundos"
    }
  });
}