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

<<<<<<< HEAD
    // Calculate events for the full year
    const currentYear = parseInt(year, 10);
    dateObj.setFullYear(currentYear);

    console.log('📅 Calculating events for year:', currentYear);

    // Calculate all events for the year
    const allEvents = await calculateSolarYearEvents(dateObj);

    // Filter events for the specific month
    const targetMonth = parseInt(month, 10);
=======
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

    // ✅ DEBUG: Log all events before filtering
    console.log('📊 [DEBUG] Total events calculated:', {
      lunarPhases: allEvents.lunarPhases.length,
      retrogrades: allEvents.retrogrades.length,
      eclipses: allEvents.eclipses.length,
      planetaryIngresses: allEvents.planetaryIngresses.length,
      seasonalEvents: allEvents.seasonalEvents.length
    });

    // ✅ DEBUG: Show sample dates from each event type
    if (allEvents.lunarPhases.length > 0) {
      const first = allEvents.lunarPhases[0];
      const last = allEvents.lunarPhases[allEvents.lunarPhases.length - 1];
      console.log('📅 [DEBUG] Lunar phases date range:', {
        first: first.date,
        last: last.date
      });
    }

    if (allEvents.planetaryIngresses.length > 0) {
      const first = allEvents.planetaryIngresses[0];
      const last = allEvents.planetaryIngresses[allEvents.planetaryIngresses.length - 1];
      console.log('🪐 [DEBUG] Planetary ingresses date range:', {
        first: first.date,
        last: last.date
      });
    }

    // Filter events for the specific month
>>>>>>> claude/lazy-loading-agenda-clean-01D9YKGzw4x2TXkWyucstk5g
    const monthStart = startOfMonth(new Date(currentYear, targetMonth - 1, 1));
    const monthEnd = endOfMonth(monthStart);

    console.log('📆 Filtering events for month:', {
      month: targetMonth,
<<<<<<< HEAD
=======
      year: currentYear,
>>>>>>> claude/lazy-loading-agenda-clean-01D9YKGzw4x2TXkWyucstk5g
      start: monthStart.toISOString(),
      end: monthEnd.toISOString()
    });

    // Helper function to check if date is in month
    const isInMonth = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
<<<<<<< HEAD
      return d >= monthStart && d <= monthEnd;
    };

    // Filter each event type
    const monthlyEvents = {
      lunarPhases: allEvents.lunarPhases.filter(p => isInMonth(p.date)),
=======
      const result = d >= monthStart && d <= monthEnd;
      return result;
    };

    // ✅ DEBUG: Log filtering process
    console.log('🔍 [DEBUG] Filtering lunar phases...');
    const lunarPhasesFiltered = allEvents.lunarPhases.filter(p => {
      const inMonth = isInMonth(p.date);
      if (!inMonth && allEvents.lunarPhases.indexOf(p) < 3) {
        console.log(`  ❌ Lunar phase excluded: ${p.date} (${p.type}) - outside range`);
      } else if (inMonth) {
        console.log(`  ✅ Lunar phase included: ${p.date} (${p.type})`);
      }
      return inMonth;
    });

    console.log('🔍 [DEBUG] Filtering planetary ingresses...');
    const planetaryIngressesFiltered = allEvents.planetaryIngresses.filter(i => {
      const inMonth = isInMonth(i.date);
      if (!inMonth && allEvents.planetaryIngresses.indexOf(i) < 3) {
        console.log(`  ❌ Ingress excluded: ${i.planet} → ${i.toSign} on ${i.date} - outside range`);
      } else if (inMonth) {
        console.log(`  ✅ Ingress included: ${i.planet} → ${i.toSign} on ${i.date}`);
      }
      return inMonth;
    });

    // Filter each event type
    const monthlyEvents = {
      lunarPhases: lunarPhasesFiltered,
>>>>>>> claude/lazy-loading-agenda-clean-01D9YKGzw4x2TXkWyucstk5g
      retrogrades: allEvents.retrogrades.filter(r =>
        isInMonth(r.startDate) || isInMonth(r.endDate)
      ),
      eclipses: allEvents.eclipses.filter(e => isInMonth(e.date)),
<<<<<<< HEAD
      planetaryIngresses: allEvents.planetaryIngresses.filter(i => isInMonth(i.date)),
=======
      planetaryIngresses: planetaryIngressesFiltered,
>>>>>>> claude/lazy-loading-agenda-clean-01D9YKGzw4x2TXkWyucstk5g
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
