// =============================================================================
// 🌟 MONTHLY EVENTS API ROUTE
// src/app/api/astrology/monthly-events/route.ts
// =============================================================================
// Calcula eventos astrológicos de un mes específico (carga lazy)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';
import { startOfMonth, endOfMonth } from 'date-fns';

// =============================================================================
// POST - Calculate Monthly Events for lazy loading
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, birthPlace, month, year } = body;

    if (!birthDate || !month || !year) {
      return NextResponse.json(
        { success: false, error: 'birthDate, month and year required' },
        { status: 400 }
      );
    }

    console.log(`🌟 [MONTHLY] Calculating events for ${month}/${year}`);

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

    // 🔧 CÁLCULO CORRECTO DEL AÑO SOLAR SEGÚN EL MES SOLICITADO
    const currentYear = parseInt(year, 10);
    const targetMonth = parseInt(month, 10);
    const birthMonth = dateObj.getMonth() + 1; // Mes de cumpleaños (1-12)
    const birthDay = dateObj.getDate();

    // Determinar qué año solar usar
    // Si el mes solicitado es ANTES del cumpleaños, usar año solar anterior
    let solarYearToUse = currentYear;
    const requestedMonthDate = new Date(currentYear, targetMonth - 1, 1);
    const birthdayThisYear = new Date(currentYear, birthMonth - 1, birthDay);

    if (requestedMonthDate < birthdayThisYear) {
      // El mes solicitado está ANTES del cumpleaños este año
      // Usar año solar anterior (que empezó en cumpleaños del año pasado)
      solarYearToUse = currentYear - 1;
      console.log(`📅 Mes ${targetMonth}/${currentYear} está ANTES del cumpleaños → usando año solar ${solarYearToUse}`);
    } else {
      console.log(`📅 Mes ${targetMonth}/${currentYear} está DESPUÉS del cumpleaños → usando año solar ${solarYearToUse}`);
    }

    // Setear fecha para calcular año solar correcto
    dateObj.setFullYear(solarYearToUse);

    console.log('🌟 Calculating Solar Year Events from:', dateObj.toISOString());

    // Calculate all events for the solar year
    const allEvents = await calculateSolarYearEvents(dateObj);

    // Filter events for the specific month
    const monthStart = startOfMonth(new Date(currentYear, targetMonth - 1, 1));
    const monthEnd = endOfMonth(monthStart);

    console.log('📆 Filtering events for month:', {
      month: targetMonth,
      start: monthStart.toISOString(),
      end: monthEnd.toISOString()
    });

    // Helper function to check if date is in month
    const isInMonth = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d >= monthStart && d <= monthEnd;
    };

    // Filter each event type
    const monthlyEvents = {
      lunarPhases: allEvents.lunarPhases.filter(p => isInMonth(p.date)),
      retrogrades: allEvents.retrogrades.filter(r =>
        isInMonth(r.startDate) || isInMonth(r.endDate)
      ),
      eclipses: allEvents.eclipses.filter(e => isInMonth(e.date)),
      planetaryIngresses: allEvents.planetaryIngresses.filter(i => isInMonth(i.date)),
      seasonalEvents: allEvents.seasonalEvents.filter(s => isInMonth(s.date))
    };

    console.log('✅ Monthly events filtered:', {
      lunarPhases: monthlyEvents.lunarPhases.length,
      retrogrades: monthlyEvents.retrogrades.length,
      eclipses: monthlyEvents.eclipses.length,
      planetaryIngresses: monthlyEvents.planetaryIngresses.length,
      seasonalEvents: monthlyEvents.seasonalEvents.length
    });

    // Serialize events (convert Date objects to ISO strings)
    const serializedEvents = {
      lunarPhases: monthlyEvents.lunarPhases.map(p => ({
        ...p,
        date: p.date instanceof Date ? p.date.toISOString() : p.date,
        phase: p.type === 'new_moon' ? 'Luna Nueva' : 'Luna Llena',
        zodiacSign: p.sign
      })),
      retrogrades: monthlyEvents.retrogrades.map(r => ({
        ...r,
        startDate: r.startDate instanceof Date ? r.startDate.toISOString() : r.startDate,
        endDate: r.endDate instanceof Date ? r.endDate.toISOString() : r.endDate,
        sign: r.startSign
      })),
      eclipses: monthlyEvents.eclipses.map(e => ({
        ...e,
        date: e.date instanceof Date ? e.date.toISOString() : e.date,
        zodiacSign: e.sign
      })),
      planetaryIngresses: monthlyEvents.planetaryIngresses.map(i => ({
        ...i,
        date: i.date instanceof Date ? i.date.toISOString() : i.date,
        newSign: i.toSign,
        previousSign: i.fromSign
      })),
      seasonalEvents: monthlyEvents.seasonalEvents.map(s => ({
        ...s,
        date: s.date instanceof Date ? s.date.toISOString() : s.date
      }))
    };

    const totalEvents =
      serializedEvents.lunarPhases.length +
      serializedEvents.retrogrades.length +
      serializedEvents.eclipses.length +
      serializedEvents.planetaryIngresses.length +
      serializedEvents.seasonalEvents.length;

    return NextResponse.json({
      success: true,
      data: {
        events: serializedEvents,
        month: targetMonth,
        year: currentYear
      },
      period: {
        start: monthStart.toISOString(),
        end: monthEnd.toISOString()
      },
      stats: {
        totalLunarPhases: serializedEvents.lunarPhases.length,
        totalRetrogrades: serializedEvents.retrogrades.length,
        totalEclipses: serializedEvents.eclipses.length,
        totalPlanetaryIngresses: serializedEvents.planetaryIngresses.length,
        totalSeasonalEvents: serializedEvents.seasonalEvents.length,
        totalEvents
      }
    });

  } catch (error) {
    console.error('❌ Error in POST monthly events:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}
