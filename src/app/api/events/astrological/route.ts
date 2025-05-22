// src/app/api/events/astrological/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAstronomicalEvents } from '@/services/astrologyService';

/**
 * API para obtener eventos astrológicos para un rango de fechas
 * 
 * GET: Obtiene eventos astrológicos para un rango de fechas especificado
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Se requieren los parámetros startDate y endDate (formato YYYY-MM-DD)' }, 
        { status: 400 }
      );
    }
    
    // Validar formato de fechas
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json(
        { error: 'El formato de fecha debe ser YYYY-MM-DD' }, 
        { status: 400 }
      );
    }
    
    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'La fecha de inicio debe ser anterior a la fecha de fin' }, 
        { status: 400 }
      );
    }
    
    // Limitar el rango a 3 meses máximo para evitar sobrecarga
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 92) {
      return NextResponse.json(
        { error: 'El rango máximo permitido es de 3 meses (92 días)' }, 
        { status: 400 }
      );
    }
    
    console.log(`Obteniendo eventos astrológicos del ${startDate} al ${endDate}`);
    
    try {
      const eventsData = await getAstronomicalEvents(startDate, endDate);
      
      return NextResponse.json(
        { 
          message: 'Eventos astrológicos obtenidos correctamente',
          events: eventsData.events,
          count: eventsData.events.length,
          startDate,
          endDate
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error al obtener eventos astrológicos:', error);
      return NextResponse.json(
        { 
          error: 'Error al obtener eventos astrológicos',
          message: 'Hubo un problema al recuperar los eventos astrológicos. Por favor, inténtalo nuevamente.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error general en la API de eventos astrológicos:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.'
      },
      { status: 500 }
    );
  }
}