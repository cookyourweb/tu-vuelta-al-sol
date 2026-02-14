// src/app/api/agenda/export-calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolarCycle from '@/models/SolarCycle';
import EventInterpretation from '@/models/EventInterpretation';
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

    // Cargar interpretaciones personalizadas de la colección EventInterpretation
    // (misma lógica que useInterpretaciones en el libro)
    const cycleStart = cycle.cycleStart || (cycle as any).start;
    const cycleEnd = cycle.cycleEnd || (cycle as any).end;

    let personalizedInterpretations: any[] = [];
    if (cycleStart && cycleEnd) {
      personalizedInterpretations = await EventInterpretation.find({
        userId,
        eventDate: { $gte: new Date(cycleStart), $lte: new Date(cycleEnd) },
      }).lean();
    }

    // Crear mapas para merge (igual que useInterpretaciones)
    const interpById = new Map<string, any>();
    const interpByDate = new Map<string, any>();

    personalizedInterpretations.forEach((interp: any) => {
      if (interp.eventId) {
        interpById.set(interp.eventId, interp);
      }
      if (interp.eventDate) {
        const dateKey = new Date(interp.eventDate).toISOString().split('T')[0];
        interpByDate.set(dateKey, interp);
      }
    });

    // Mergear: preferir EventInterpretation (personalizada) sobre inline (genérica)
    const mergedEvents = cycle.events.map((event: any) => {
      let stored = interpById.get(event.id);

      if (!stored && event.date) {
        const dateKey = new Date(event.date).toISOString().split('T')[0];
        stored = interpByDate.get(dateKey);
      }

      if (stored?.interpretation) {
        return {
          ...event,
          interpretation: stored.interpretation,
          house: stored.eventDetails?.house || event.house,
        };
      }

      return event;
    });

    // Convertir eventos al formato de calendario
    const calendarEvents = convertEventsForCalendar(mergedEvents);

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
