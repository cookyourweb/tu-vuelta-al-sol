// src/app/api/astrology/complete-events/route.ts - ACTUALIZADO PARA FUNCIONAR
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, months = 3, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🌟 Generando agenda astrológica completa para usuario: ${userId}`);

    // Obtener URL base para llamadas internas
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // PASO 1: Obtener eventos astrológicos reales con servicio corregido
    console.log('📡 Paso 1: Obteniendo eventos reales con estrategia híbrida...');
    
    const eventsResponse = await fetch(`${baseUrl}/api/astrology/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, months })
    });

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text();
      throw new Error(`Error obteniendo eventos: ${eventsResponse.status} - ${errorText}`);
    }

    const eventsData = await eventsResponse.json();
    
    if (!eventsData.success) {
      throw new Error(eventsData.error || 'Error en eventos astrológicos');
    }

    console.log(`✅ ${eventsData.data.events.length} eventos reales obtenidos con estrategia híbrida`);
    console.log('📊 Distribución:', eventsData.data.highlights);

    // PASO 2: Interpretar eventos con IA (solo los más importantes para eficiencia)
    console.log('🤖 Paso 2: Interpretando eventos importantes con IA...');
    
    // Filtrar solo eventos de alta prioridad para interpretación IA
    const highPriorityEvents = eventsData.data.events.filter((event: any) => 
      event.importance === 'high' || 
      event.type === 'lunar_phase' || 
      event.type === 'retrograde'
    );

    console.log(`🎯 Interpretando ${highPriorityEvents.length} eventos de alta prioridad de ${eventsData.data.events.length} totales`);

    let interpretedEvents = eventsData.data.events; // Por defecto, todos los eventos

    if (highPriorityEvents.length > 0) {
      try {
        const interpretationResponse = await fetch(`${baseUrl}/api/astrology/interpret-events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            events: highPriorityEvents.slice(0, 15) // Máximo 15 para evitar timeout
          })
        });

        if (interpretationResponse.ok) {
          const interpretationData = await interpretationResponse.json();
          
          if (interpretationData.success && interpretationData.data.interpretedEvents) {
            console.log(`✅ ${interpretationData.data.interpretedEvents.length} eventos interpretados con IA`);
            
            // Combinar eventos interpretados con los no interpretados
            const interpretedIds = new Set(interpretationData.data.interpretedEvents.map((e: any) => e.id));
            const nonInterpretedEvents = eventsData.data.events.filter((e: any) => !interpretedIds.has(e.id));
            
            // Agregar interpretaciones básicas a eventos no interpretados
            const basicInterpretedEvents = nonInterpretedEvents.map((event: any) => ({
              ...event,
              personalInterpretation: {
                impact: getBasicImpact(event),
                advice: getBasicAdvice(event),
                mantra: getBasicMantra(event)
              }
            }));

            interpretedEvents = [
              ...interpretationData.data.interpretedEvents,
              ...basicInterpretedEvents
            ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
          } else {
            console.warn('⚠️ Interpretación IA falló, usando interpretaciones básicas');
            interpretedEvents = addBasicInterpretations(eventsData.data.events);
          }
        } else {
          console.warn('⚠️ Error en interpretación IA, usando interpretaciones básicas');
          interpretedEvents = addBasicInterpretations(eventsData.data.events);
        }
      } catch (interpretationError) {
        console.warn('⚠️ Error en interpretación IA:', interpretationError);
        interpretedEvents = addBasicInterpretations(eventsData.data.events);
      }
    } else {
      console.log('ℹ️ No hay eventos de alta prioridad para interpretar');
      interpretedEvents = addBasicInterpretations(eventsData.data.events);
    }

    // PASO 3: Organizar y enriquecer datos finales
    const finalEvents = interpretedEvents;
    const eventsByMonth = groupEventsByMonth(finalEvents);
    const highPriorityCount = finalEvents.filter((e: any) => e.importance === 'high').length;

    // Calcular estadísticas enriquecidas
    const enrichedHighlights = {
      totalEvents: finalEvents.length,
      highPriorityEvents: highPriorityCount,
      lunarPhases: finalEvents.filter((e: any) => e.type === 'lunar_phase').length,
      planetaryTransits: finalEvents.filter((e: any) => e.type === 'planetary_transit').length,
      retrogrades: finalEvents.filter((e: any) => e.type === 'retrograde').length,
      eclipses: finalEvents.filter((e: any) => e.type === 'eclipse').length,
      aspects: finalEvents.filter((e: any) => e.type === 'planetary_aspect').length,
      directMotions: finalEvents.filter((e: any) => e.type === 'direct').length,
      seasonal: finalEvents.filter((e: any) => e.type === 'seasonal').length,
      withAiInterpretation: finalEvents.filter((e: any) => 
        e.personalInterpretation && 
        !e.personalInterpretation.impact?.includes('básica')
      ).length
    };

    console.log(`🌟 Agenda completa generada: ${finalEvents.length} eventos totales`);
    console.log('📊 Estadísticas finales:', enrichedHighlights);

    return NextResponse.json({
      success: true,
      data: {
        events: finalEvents,
        eventsByMonth: eventsByMonth,
        highlights: enrichedHighlights,
        period: eventsData.data.period,
        userLocation: eventsData.data.userLocation,
        metadata: {
          ...eventsData.data.metadata,
          interpretation_metadata: {
            total_events: finalEvents.length,
            ai_interpreted: enrichedHighlights.withAiInterpretation,
            basic_interpreted: finalEvents.length - enrichedHighlights.withAiInterpretation,
            strategy: 'hybrid_prokerala_synthetic_plus_ai',
            processed_at: new Date().toISOString()
          },
          generation_type: 'corrected_hybrid',
          completed_at: new Date().toISOString()
        }
      },
      message: `¡Agenda astrológica completa generada! ${finalEvents.length} eventos con interpretaciones (${enrichedHighlights.withAiInterpretation} IA + ${finalEvents.length - enrichedHighlights.withAiInterpretation} básicas).`
    });

  } catch (error) {
    console.error('❌ Error generando agenda completa:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error al generar la agenda astrológica completa',
      debug: process.env.NODE_ENV === 'development' ? {
        error_details: error instanceof Error ? error.stack : error,
        timestamp: new Date().toISOString()
      } : undefined
    }, { status: 500 });
  }
}

/**
 * Agregar interpretaciones básicas a eventos sin IA
 */
function addBasicInterpretations(events: any[]): any[] {
  return events.map(event => ({
    ...event,
    personalInterpretation: {
      impact: getBasicImpact(event),
      advice: getBasicAdvice(event),
      mantra: getBasicMantra(event)
    }
  }));
}

function getBasicImpact(event: any): string {
  const impacts: { [key: string]: string } = {
    'lunar_phase': 'Las fases lunares afectan tus emociones y intuición. Momento perfecto para conectar con tu mundo interior.',
    'planetary_transit': `El tránsito de ${event.planet || 'este planeta'} puede traer cambios en diferentes áreas de tu vida.`,
    'retrograde': `${event.planet || 'Este planeta'} retrógrado invita a la reflexión y revisión interna.`,
    'direct': `${event.planet || 'Este planeta'} directo trae energía renovada y claridad.`,
    'planetary_aspect': 'Este aspecto planetario puede generar oportunidades o desafíos para tu crecimiento.',
    'eclipse': 'Los eclipses son portales de transformación que pueden traer cambios significativos.',
    'seasonal': 'Los cambios estacionales marcan momentos importantes en el ciclo natural.'
  };
  
  return impacts[event.type] || 'Este evento astrológico puede influir en tu desarrollo personal y espiritual.';
}

function getBasicAdvice(event: any): string {
  const advice: { [key: string]: string } = {
    'lunar_phase': 'Dedica tiempo a la meditación y escucha tu intuición. Perfecto para establecer intenciones.',
    'planetary_transit': 'Mantente abierto a las nuevas energías y oportunidades que se presentan.',
    'retrograde': 'Usa este tiempo para reflexionar, revisar proyectos y completar asuntos pendientes.',
    'direct': 'Es momento perfecto para tomar acción en los planes que has estado desarrollando.',
    'planetary_aspect': 'Busca el equilibrio y aprovecha las energías complementarias.',
    'eclipse': 'Prepárate para transformaciones importantes y mantén una mente abierta al cambio.',
    'seasonal': 'Alinéate con los ritmos naturales y ajusta tus actividades según la estación.'
  };
  
  return advice[event.type] || 'Mantente consciente de las energías cósmicas y úsalas constructivamente.';
}

function getBasicMantra(event: any): string {
  const mantras: { [key: string]: string } = {
    'lunar_phase': 'Fluyo con los ciclos naturales de la Luna.',
    'planetary_transit': 'Me adapto con gracia a los cambios cósmicos.',
    'retrograde': 'Uso este tiempo para crecer y reflexionar internamente.',
    'direct': 'Avanzo con propósito y claridad hacia mis metas.',
    'planetary_aspect': 'Encuentro armonía en todas las energías que me rodean.',
    'eclipse': 'Abrazo la transformación con confianza y sabiduría.',
    'seasonal': 'Estoy en perfecta sintonía con los ritmos de la naturaleza.'
  };
  
  return mantras[event.type] || 'Estoy alineado con las energías del universo para mi mayor bien.';
}

/**
 * Agrupar eventos por mes para mejor organización
 */
function groupEventsByMonth(events: any[]): { [key: string]: any[] } {
  const grouped: { [key: string]: any[] } = {};
  
  events.forEach(event => {
    const date = new Date(event.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    
    grouped[monthKey].push(event);
  });
  
  // Ordenar eventos dentro de cada mes
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });
  
  return grouped;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const months = parseInt(searchParams.get('months') || '3');
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId es requerido' },
      { status: 400 }
    );
  }

  // Crear request simulado para POST
  const mockRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, months })
  });

  return POST(mockRequest as NextRequest);
}