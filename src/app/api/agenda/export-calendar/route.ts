// src/app/api/agenda/export-calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle from '@/models/SolarCycle';
import { generateICSContent, convertEventsForCalendar } from '@/utils/generateICS';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const yearLabel = searchParams.get('yearLabel');

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }

    await connectDB();

    // Buscar el ciclo solar del usuario
    const query: any = { userId };
    if (yearLabel) {
      query.yearLabel = yearLabel;
    }

    const cycle = await SolarCycle.findOne(query).sort({ createdAt: -1 });

    if (!cycle || !cycle.events || cycle.events.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron eventos para este usuario' },
        { status: 404 }
      );
    }

    // Convertir eventos al formato de calendario
    const calendarEvents = convertEventsForCalendar(cycle.events);

    if (calendarEvents.length === 0) {
      return NextResponse.json(
        { error: 'No hay eventos válidos para exportar' },
        { status: 404 }
      );
    }

    // Generar nombre del calendario personalizado
    const calName = yearLabel
      ? `Tu Vuelta al Sol ${yearLabel}`
      : 'Tu Vuelta al Sol - Agenda Astrológica';

    // Generar contenido ICS
    const icsContent = generateICSContent(calendarEvents, calName);

    // Devolver como archivo .ics descargable
    const fileName = `agenda-astrologica-${yearLabel || 'ciclo'}.ics`;

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error exportando calendario:', error);
    return NextResponse.json(
      { error: 'Error interno al generar el calendario' },
      { status: 500 }
    );
  }
}
