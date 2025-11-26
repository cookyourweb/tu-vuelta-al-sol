// =============================================================================
// 🌟 SOLAR YEAR EVENTS API ROUTE
// src/app/api/astrology/solar-year-events/route.ts
// =============================================================================
// Calcula todos los eventos astrológicos del año de Revolución Solar
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';

// =============================================================================
// GET - Calculate Solar Year Events
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const birthDateStr = searchParams.get('birthDate');
    const currentYearStr = searchParams.get('currentYear');

    if (!birthDateStr) {
      return NextResponse.json({
        success: false,
        error: 'birthDate parameter required (format: YYYY-MM-DD)'
      }, { status: 400 });
    }

    console.log('🌟 Calculating solar year events for:', birthDateStr);

    // Parse birth date
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid birthDate format. Use YYYY-MM-DD'
      }, { status: 400 });
    }

    // If currentYear is provided, adjust the birth date to that year
    if (currentYearStr) {
      const currentYear = parseInt(currentYearStr, 10);
      if (!isNaN(currentYear)) {
        birthDate.setFullYear(currentYear);
      }
    }

    console.log('📅 Calculating events from:', birthDate.toISOString());

    // Calculate all events
    const events = await calculateSolarYearEvents(birthDate);

    console.log('✅ Events calculated successfully');

    return NextResponse.json({
      success: true,
      data: events,
      period: {
        start: birthDate.toISOString(),
        end: new Date(birthDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      stats: {
        totalLunarPhases: events.lunarPhases.length,
        totalRetrogrades: events.retrogrades.length,
        totalEclipses: events.eclipses.length,
        totalPlanetaryIngresses: events.planetaryIngresses.length,
        totalSeasonalEvents: events.seasonalEvents.length,
        totalEvents:
          events.lunarPhases.length +
          events.retrogrades.length +
          events.eclipses.length +
          events.planetaryIngresses.length +
          events.seasonalEvents.length
      }
    });

  } catch (error) {
    console.error('❌ Error calculating solar year events:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Calculate Solar Year Events with detailed birth data
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, birthPlace, currentYear } = body;

    if (!birthDate) {
      return NextResponse.json(
        { success: false, error: 'birthDate required' },
        { status: 400 }
      );
    }

    console.log('🌟 [POST] Calculating solar year events for:', birthDate);

    // Parse birth date and time
    const dateObj = new Date(birthDate);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid birthDate format'
      }, { status: 400 });
    }

    // If birthTime is provided, set it
    if (birthTime) {
      const [hours, minutes] = birthTime.split(':').map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
    }

    // If currentYear is provided, adjust to that year's solar return
    if (currentYear) {
      const year = parseInt(currentYear, 10);
      if (!isNaN(year)) {
        dateObj.setFullYear(year);
      }
    }

    console.log('📅 Calculating events from:', dateObj.toISOString());
    console.log('📍 Birth place:', birthPlace);

    // Calculate all events
    const events = await calculateSolarYearEvents(dateObj);

    console.log('✅ Events calculated successfully');

    // Sort all events by date for timeline view
    const allEvents = [
      ...events.lunarPhases.map(e => ({ ...e, category: 'lunar_phase' })),
      ...events.retrogrades.map(e => ({ ...e, category: 'retrograde' })),
      ...events.eclipses.map(e => ({ ...e, category: 'eclipse' })),
      ...events.planetaryIngresses.map(e => ({ ...e, category: 'ingress' })),
      ...events.seasonalEvents.map(e => ({ ...e, category: 'seasonal' }))
    ].sort((a, b) => {
      const dateA = 'date' in a ? a.date : 'startDate' in a ? a.startDate : new Date(0);
      const dateB = 'date' in b ? b.date : 'startDate' in b ? b.startDate : new Date(0);
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return NextResponse.json({
      success: true,
      data: {
        events: events,
        timeline: allEvents
      },
      period: {
        start: dateObj.toISOString(),
        end: new Date(dateObj.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      birthInfo: {
        birthDate,
        birthTime,
        birthPlace
      },
      stats: {
        totalLunarPhases: events.lunarPhases.length,
        totalRetrogrades: events.retrogrades.length,
        totalEclipses: events.eclipses.length,
        totalPlanetaryIngresses: events.planetaryIngresses.length,
        totalSeasonalEvents: events.seasonalEvents.length,
        totalEvents: allEvents.length
      }
    });

  } catch (error) {
    console.error('❌ Error in POST solar year events:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}
