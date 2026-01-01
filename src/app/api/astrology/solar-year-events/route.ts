// =============================================================================
// 🌟 SOLAR YEAR EVENTS API ROUTE
// src/app/api/astrology/solar-year-events/route.ts
// =============================================================================
// Calcula todos los eventos astrológicos del año de Revolución Solar
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';
import { calculateHouseForEvent, signAndDegreeToLongitude } from '@/utils/eventMapping';
import connectDB from '@/lib/db';
import NatalChart from '@/models/NatalChart';

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
    const { birthDate, birthTime, birthPlace, currentYear, userId } = body;

    if (!birthDate) {
      return NextResponse.json(
        { success: false, error: 'birthDate required' },
        { status: 400 }
      );
    }

    console.log('🌟 [POST] Calculating solar year events for:', birthDate);
    console.log('👤 [POST] User ID:', userId || 'Not provided');

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
    console.log('📊 Event counts:', {
      lunarPhases: events.lunarPhases.length,
      retrogrades: events.retrogrades.length,
      eclipses: events.eclipses.length,
      planetaryIngresses: events.planetaryIngresses.length,
      seasonalEvents: events.seasonalEvents.length
    });

    // 🏠 CALCULATE HOUSES FOR EVENTS (if userId provided)
    let natalChart = null;
    if (userId) {
      try {
        await connectDB();
        const natalDoc = await NatalChart.findOne({ userId }).lean();
        if (natalDoc) {
          natalChart = natalDoc.natalChart || natalDoc;
          console.log('✅ Natal chart loaded for house calculations');
        } else {
          console.warn('⚠️ No natal chart found for user:', userId);
        }
      } catch (error) {
        console.error('❌ Error loading natal chart:', error);
      }
    }

    // Convert Date objects to ISO strings for JSON serialization
    const serializedEvents = {
      lunarPhases: events.lunarPhases.map(p => ({
        ...p,
        date: p.date instanceof Date ? p.date.toISOString() : p.date,
        phase: p.type === 'new_moon' ? 'Luna Nueva' : 'Luna Llena',
        zodiacSign: p.sign,
        house: natalChart ? calculateHouseForEvent(p.sign, p.degree || 0, natalChart) : undefined
      })),
      retrogrades: events.retrogrades.map(r => ({
        ...r,
        startDate: r.startDate instanceof Date ? r.startDate.toISOString() : r.startDate,
        endDate: r.endDate instanceof Date ? r.endDate.toISOString() : r.endDate,
        sign: r.startSign,
        house: natalChart ? calculateHouseForEvent(r.startSign, r.startDegree || 0, natalChart) : undefined
      })),
      eclipses: events.eclipses.map(e => ({
        ...e,
        date: e.date instanceof Date ? e.date.toISOString() : e.date,
        zodiacSign: e.sign,
        house: natalChart ? calculateHouseForEvent(e.sign, e.degree || 0, natalChart) : undefined
      })),
      planetaryIngresses: events.planetaryIngresses.map(i => ({
        ...i,
        date: i.date instanceof Date ? i.date.toISOString() : i.date,
        newSign: i.toSign,
        previousSign: i.fromSign,
        house: natalChart ? calculateHouseForEvent(i.toSign, i.toDegree || 0, natalChart) : undefined
      })),
      seasonalEvents: events.seasonalEvents.map(s => ({
        ...s,
        date: s.date instanceof Date ? s.date.toISOString() : s.date,
        house: natalChart && s.sign ? calculateHouseForEvent(s.sign, s.degree || 0, natalChart) : undefined
      }))
    };

    // Sort all events by date for timeline view
    const allEvents = [
      ...serializedEvents.lunarPhases.map(e => ({ ...e, category: 'lunar_phase' })),
      ...serializedEvents.retrogrades.map(e => ({ ...e, category: 'retrograde' })),
      ...serializedEvents.eclipses.map(e => ({ ...e, category: 'eclipse' })),
      ...serializedEvents.planetaryIngresses.map(e => ({ ...e, category: 'ingress' })),
      ...serializedEvents.seasonalEvents.map(e => ({ ...e, category: 'seasonal' }))
    ].sort((a, b) => {
      const dateA = 'date' in a ? a.date : 'startDate' in a ? a.startDate : '';
      const dateB = 'date' in b ? b.date : 'startDate' in b ? b.startDate : '';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    console.log('📋 Sample events:', {
      firstLunarPhase: serializedEvents.lunarPhases[0],
      firstRetrograde: serializedEvents.retrogrades[0],
      totalEvents: allEvents.length
    });

    return NextResponse.json({
      success: true,
      data: {
        events: serializedEvents,
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
        totalLunarPhases: serializedEvents.lunarPhases.length,
        totalRetrogrades: serializedEvents.retrogrades.length,
        totalEclipses: serializedEvents.eclipses.length,
        totalPlanetaryIngresses: serializedEvents.planetaryIngresses.length,
        totalSeasonalEvents: serializedEvents.seasonalEvents.length,
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
