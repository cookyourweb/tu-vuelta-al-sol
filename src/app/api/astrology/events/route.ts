// src/app/api/astrology/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAstrologicalEvents } from '@/services/astrologicalEventsService';

import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import { calculateAgendaPeriod, generateAIPromptContext } from '@/utils/agendaCalculator';

export async function POST(request: NextRequest) {
  try {
    const { userId, startDate, endDate, useAutomaticDates = true } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Obteniendo eventos astrológicos para usuario: ${userId}`);

    // Conectar a base de datos y obtener datos de nacimiento
    await connectDB();
    const birthData = await BirthData.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { success: false, error: 'Datos de nacimiento no encontrados' },
        { status: 404 }
      );
    }

    let finalStartDate: string;
    let finalEndDate: string;
    let agendaPeriod: any = null;
    let aiContext: string = '';

    // 🎯 NUEVA LÓGICA: Usar cálculo automático de fechas
    if (useAutomaticDates) {
      console.log('📅 Usando cálculo automático basado en Vuelta al Sol...');
      
      // Calcular período automáticamente basado en fecha de nacimiento
      agendaPeriod = calculateAgendaPeriod(birthData.birthDate);
      finalStartDate = agendaPeriod.startDate;
      finalEndDate = agendaPeriod.endDate;
      
      // Generar contexto para IA
      aiContext = generateAIPromptContext(agendaPeriod, birthData.birthDate);
      
      console.log('🎯 Período calculado automáticamente:', {
        currentAge: agendaPeriod.currentAge,
        nextAge: agendaPeriod.nextAge,
        startDate: finalStartDate,
        endDate: finalEndDate,
        daysUntilBirthday: agendaPeriod.daysUntilBirthday
      });
      
    } else {
      // 📅 LÓGICA ANTERIOR: Usar fechas manuales si se especifican
      console.log('📅 Usando fechas manuales proporcionadas...');
      
      finalStartDate = startDate || new Date().toISOString().split('T')[0];
      finalEndDate = endDate || (() => {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6); // 6 meses por defecto
        return endDate.toISOString().split('T')[0];
      })();
    }

    // Preparar parámetros para el servicio de eventos
    const eventsParams = {
      startDate: finalStartDate,
      endDate: finalEndDate,
      latitude: parseFloat(birthData.latitude),
      longitude: parseFloat(birthData.longitude),
      timezone: birthData.timezone || 'Europe/Madrid'
    };

    console.log('📅 Parámetros finales para eventos:', eventsParams);

    // 🚀 Obtener eventos astrológicos (ahora sin errores HTTP)
    const events = await getAstrologicalEvents(
      eventsParams.startDate,
      eventsParams.endDate,
      eventsParams.latitude,
      eventsParams.longitude,
      eventsParams.timezone
    );

    console.log(`✅ ${events.length} eventos astrológicos obtenidos exitosamente`);

    // 📊 Calcular estadísticas de eventos
    const eventStats = events.reduce((stats: any, event) => {
      const type = event.type;
      stats[type] = (stats[type] || 0) + 1;
      stats.total = (stats.total || 0) + 1;
      return stats;
    }, {});

    // 🎯 Respuesta mejorada con información contextual
    const response = {
      success: true,
      data: {
        events,
        period: {
          startDate: finalStartDate,
          endDate: finalEndDate,
          totalEvents: events.length,
          calculationType: useAutomaticDates ? 'automatic_solar_return' : 'manual_dates',
          ...(agendaPeriod && {
            agendaInfo: {
              currentAge: agendaPeriod.currentAge,
              nextAge: agendaPeriod.nextAge,
              daysUntilBirthday: agendaPeriod.daysUntilBirthday,
              isCurrentYearComplete: agendaPeriod.isCurrentYearComplete,
              description: `Agenda astrológica para tu año ${agendaPeriod.nextAge}`
            }
          })
        },
        userProfile: {
          birthDate: birthData.birthDate,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
          place: birthData.birthPlace
        },
        statistics: {
          eventBreakdown: eventStats,
          highPriorityEvents: events.filter(e => e.priority === 'high').length,
          mediumPriorityEvents: events.filter(e => e.priority === 'medium').length,
          lowPriorityEvents: events.filter(e => e.priority === 'low').length
        },
        aiContext: aiContext,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'calculated_astronomical_data',
          version: '2.0',
          dataQuality: 'high_precision_calculated'
        }
      },
      message: useAutomaticDates 
        ? `Agenda de tu Vuelta al Sol: ${events.length} eventos para tu año ${agendaPeriod?.nextAge || 'próximo'}`
        : `${events.length} eventos astrológicos obtenidos para el período especificado`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error obteniendo eventos astrológicos:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error instanceof Error ? error.stack : undefined,
      message: 'Error al obtener eventos astrológicos'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const useAutomaticDates = searchParams.get('useAutomaticDates') !== 'false';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId es requerido' },
      { status: 400 }
    );
  }

  // Crear request simulado para reutilizar lógica POST
  const mockRequest = {
    json: async () => ({
      userId,
      useAutomaticDates,
      startDate,
      endDate
    })
  } as NextRequest;

  return POST(mockRequest);
}
