// =============================================================================
// 🌟 SOLAR YEAR EVENTS CALCULATOR
// src/utils/astrology/solarYearEvents.ts
// =============================================================================
// Calcula todos los eventos astrológicos para el año de Revolución Solar
// (desde el cumpleaños hasta el siguiente cumpleaños)
// =============================================================================

import * as Astronomy from 'astronomy-engine';

// =============================================================================
// TYPES
// =============================================================================

export interface LunarPhase {
  type: 'new_moon' | 'full_moon';
  date: Date;
  sign: string;
  degree: number;
  description: string;
}

export interface Retrograde {
  planet: string;
  startDate: Date;
  endDate: Date;
  startSign: string;
  endSign: string;
  description: string;
}

export interface Eclipse {
  type: 'solar' | 'lunar';
  date: Date;
  sign: string;
  degree: number;
  magnitude: number;
  description: string;
}

export interface PlanetaryIngress {
  planet: string;
  date: Date;
  fromSign: string;
  toSign: string;
  description: string;
}

export interface SeasonalEvent {
  type: 'spring_equinox' | 'summer_solstice' | 'autumn_equinox' | 'winter_solstice';
  date: Date;
  description: string;
}

export interface SolarYearEvents {
  lunarPhases: LunarPhase[];
  retrogrades: Retrograde[];
  eclipses: Eclipse[];
  planetaryIngresses: PlanetaryIngress[];
  seasonalEvents: SeasonalEvent[];
}

// =============================================================================
// ZODIAC UTILITIES
// =============================================================================

const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function eclipticLongitudeToZodiac(longitude: number): { sign: string; degree: number } {
  // Normalize to 0-360
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degree
  };
}

// =============================================================================
// LUNAR PHASES
// =============================================================================

export function calculateLunarPhases(startDate: Date, endDate: Date): LunarPhase[] {
  const phases: LunarPhase[] = [];

  // Convert to Astronomy.AstroTime
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    try {
      // Search for next new moon
      const newMoonSearch = Astronomy.SearchMoonPhase(0, new Astronomy.AstroTime(currentDate), 45);
      if (newMoonSearch && newMoonSearch.date <= endDate) {
        const moonPos = Astronomy.EclipticGeoMoon(newMoonSearch);
        const zodiac = eclipticLongitudeToZodiac(moonPos.lon);

        phases.push({
          type: 'new_moon',
          date: newMoonSearch.date,
          sign: zodiac.sign,
          degree: zodiac.degree,
          description: `🌑 Luna Nueva en ${zodiac.sign} ${zodiac.degree.toFixed(1)}°`
        });
      }

      // Search for next full moon
      const fullMoonSearch = Astronomy.SearchMoonPhase(180, new Astronomy.AstroTime(currentDate), 45);
      if (fullMoonSearch && fullMoonSearch.date <= endDate) {
        const moonPos = Astronomy.EclipticGeoMoon(fullMoonSearch);
        const zodiac = eclipticLongitudeToZodiac(moonPos.lon);

        phases.push({
          type: 'full_moon',
          date: fullMoonSearch.date,
          sign: zodiac.sign,
          degree: zodiac.degree,
          description: `🌕 Luna Llena en ${zodiac.sign} ${zodiac.degree.toFixed(1)}°`
        });
      }

      // Move to next cycle (15 days ahead)
      currentDate.setDate(currentDate.getDate() + 15);

    } catch (error) {
      console.error('Error calculating lunar phase:', error);
      break;
    }
  }

  // Sort by date
  return phases.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// =============================================================================
// PLANETARY RETROGRADES
// =============================================================================

const RETROGRADE_PLANETS: Astronomy.Body[] = [
  Astronomy.Body.Mercury,
  Astronomy.Body.Venus,
  Astronomy.Body.Mars,
  Astronomy.Body.Jupiter,
  Astronomy.Body.Saturn,
  Astronomy.Body.Uranus,
  Astronomy.Body.Neptune,
  Astronomy.Body.Pluto
];

const PLANET_NAMES: Record<Astronomy.Body, string> = {
  [Astronomy.Body.Mercury]: 'Mercurio',
  [Astronomy.Body.Venus]: 'Venus',
  [Astronomy.Body.Mars]: 'Marte',
  [Astronomy.Body.Jupiter]: 'Júpiter',
  [Astronomy.Body.Saturn]: 'Saturno',
  [Astronomy.Body.Uranus]: 'Urano',
  [Astronomy.Body.Neptune]: 'Neptuno',
  [Astronomy.Body.Pluto]: 'Plutón',
  [Astronomy.Body.Sun]: 'Sol',
  [Astronomy.Body.Moon]: 'Luna',
  [Astronomy.Body.Earth]: 'Tierra',
  [Astronomy.Body.EMB]: 'EMB',
  [Astronomy.Body.SSB]: 'SSB',
  [Astronomy.Body.Star1]: 'Estrella1',
  [Astronomy.Body.Star2]: 'Estrella2',
  [Astronomy.Body.Star3]: 'Estrella3',
  [Astronomy.Body.Star4]: 'Estrella4',
  [Astronomy.Body.Star5]: 'Estrella5',
  [Astronomy.Body.Star6]: 'Estrella6',
  [Astronomy.Body.Star7]: 'Estrella7',
  [Astronomy.Body.Star8]: 'Estrella8'
};

function getPlanetName(body: Astronomy.Body): string {
  return PLANET_NAMES[body] || body.toString();
}

export function calculateRetrogrades(startDate: Date, endDate: Date): Retrograde[] {
  const retrogrades: Retrograde[] = [];

  // Known retrograde periods for 2024-2025 (can be expanded)
  // This is a simplified version - in production would use ephemeris calculations
  const knownRetrogrades = [
    {
      planet: 'Mercurio',
      periods: [
        { start: '2024-04-01', end: '2024-04-25', sign: 'Aries' },
        { start: '2024-08-05', end: '2024-08-28', sign: 'Virgo' },
        { start: '2024-11-25', end: '2024-12-15', sign: 'Sagitario' }
      ]
    },
    {
      planet: 'Venus',
      periods: [
        // Venus retrogrades are rare - approximately every 18 months
        // 2024 doesn't have a Venus retrograde
      ]
    },
    {
      planet: 'Marte',
      periods: [
        // Mars retrograde occurs approximately every 2 years
        // Next one is in 2025
        { start: '2025-01-06', end: '2025-02-23', sign: 'Cáncer' }
      ]
    },
    {
      planet: 'Júpiter',
      periods: [
        { start: '2024-10-09', end: '2025-02-04', sign: 'Géminis' }
      ]
    },
    {
      planet: 'Saturno',
      periods: [
        { start: '2024-06-29', end: '2024-11-15', sign: 'Piscis' }
      ]
    },
    {
      planet: 'Urano',
      periods: [
        { start: '2024-09-01', end: '2025-01-30', sign: 'Tauro' }
      ]
    },
    {
      planet: 'Neptuno',
      periods: [
        { start: '2024-07-02', end: '2024-12-07', sign: 'Piscis' }
      ]
    },
    {
      planet: 'Plutón',
      periods: [
        { start: '2024-05-02', end: '2024-10-11', sign: 'Acuario' }
      ]
    }
  ];

  // Filter retrogrades within the date range
  for (const planetData of knownRetrogrades) {
    for (const period of planetData.periods) {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);

      // Check if period overlaps with our date range
      if (periodEnd >= startDate && periodStart <= endDate) {
        retrogrades.push({
          planet: planetData.planet,
          startDate: periodStart,
          endDate: periodEnd,
          startSign: period.sign,
          endSign: period.sign,
          description: `☿️ ${planetData.planet} Retrógrado en ${period.sign}`
        });
      }
    }
  }

  return retrogrades.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

// =============================================================================
// ECLIPSES
// =============================================================================

export function calculateEclipses(startDate: Date, endDate: Date): Eclipse[] {
  const eclipses: Eclipse[] = [];

  try {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Search for next lunar eclipse
      const lunarEclipse = Astronomy.SearchLunarEclipse(new Astronomy.AstroTime(currentDate));
      if (lunarEclipse && lunarEclipse.peak.date <= endDate) {
        const moonPos = Astronomy.EclipticGeoMoon(lunarEclipse.peak);
        const zodiac = eclipticLongitudeToZodiac(moonPos.lon);

        eclipses.push({
          type: 'lunar',
          date: lunarEclipse.peak.date,
          sign: zodiac.sign,
          degree: zodiac.degree,
          magnitude: lunarEclipse.sd_total,
          description: `🌑🌕 Eclipse Lunar en ${zodiac.sign} ${zodiac.degree.toFixed(1)}°`
        });

        currentDate = new Date(lunarEclipse.peak.date);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Search for next solar eclipse
      const solarEclipse = Astronomy.SearchGlobalSolarEclipse(new Astronomy.AstroTime(currentDate));
      if (solarEclipse && solarEclipse.peak.date <= endDate) {
        const sunPos = Astronomy.SunPosition(solarEclipse.peak);
        const zodiac = eclipticLongitudeToZodiac(sunPos.elon);

        eclipses.push({
          type: 'solar',
          date: solarEclipse.peak.date,
          sign: zodiac.sign,
          degree: zodiac.degree,
          magnitude: 1.0, // Simplified
          description: `☀️🌑 Eclipse Solar en ${zodiac.sign} ${zodiac.degree.toFixed(1)}°`
        });

        currentDate = new Date(solarEclipse.peak.date);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Safety break if no eclipses found
      if (!lunarEclipse && !solarEclipse) break;
    }
  } catch (error) {
    console.error('Error calculating eclipses:', error);
  }

  return eclipses.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// =============================================================================
// PLANETARY INGRESSES
// =============================================================================

const INGRESS_PLANETS: Astronomy.Body[] = [
  Astronomy.Body.Sun,
  Astronomy.Body.Mercury,
  Astronomy.Body.Venus,
  Astronomy.Body.Mars,
  Astronomy.Body.Jupiter,
  Astronomy.Body.Saturn
];

export function calculatePlanetaryIngresses(startDate: Date, endDate: Date): PlanetaryIngress[] {
  const ingresses: PlanetaryIngress[] = [];

  for (const planet of INGRESS_PLANETS) {
    try {
      let currentDate = new Date(startDate);

      // Get initial sign
      const initialTime = new Astronomy.AstroTime(currentDate);
      const initialPos = planet === Astronomy.Body.Sun
        ? Astronomy.SunPosition(initialTime)
        : Astronomy.Ecliptic(Astronomy.HelioVector(planet, initialTime));

      let currentSign = eclipticLongitudeToZodiac(initialPos.elon).sign;

      while (currentDate <= endDate) {
        // Check position every day
        const checkTime = new Astronomy.AstroTime(currentDate);
        const checkPos = planet === Astronomy.Body.Sun
          ? Astronomy.SunPosition(checkTime)
          : Astronomy.Ecliptic(Astronomy.HelioVector(planet, checkTime));

        const newZodiac = eclipticLongitudeToZodiac(checkPos.elon);

        if (newZodiac.sign !== currentSign) {
          const planetName = getPlanetName(planet);
          ingresses.push({
            planet: planetName,
            date: new Date(currentDate),
            fromSign: currentSign,
            toSign: newZodiac.sign,
            description: `♈ ${planetName} ingresa en ${newZodiac.sign}`
          });

          currentSign = newZodiac.sign;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (error) {
      console.error(`Error calculating ingresses for ${getPlanetName(planet)}:`, error);
    }
  }

  return ingresses.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// =============================================================================
// SEASONAL EVENTS
// =============================================================================

export function calculateSeasonalEvents(startDate: Date, endDate: Date): SeasonalEvent[] {
  const events: SeasonalEvent[] = [];

  try {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      // March Equinox (Spring in Northern Hemisphere)
      const marchEquinox = Astronomy.Seasons(year);
      if (marchEquinox.mar_equinox.date >= startDate && marchEquinox.mar_equinox.date <= endDate) {
        events.push({
          type: 'spring_equinox',
          date: marchEquinox.mar_equinox.date,
          description: '🌸 Equinoccio de Primavera (Sol ingresa en Aries)'
        });
      }

      // June Solstice (Summer in Northern Hemisphere)
      if (marchEquinox.jun_solstice.date >= startDate && marchEquinox.jun_solstice.date <= endDate) {
        events.push({
          type: 'summer_solstice',
          date: marchEquinox.jun_solstice.date,
          description: '☀️ Solsticio de Verano (Sol ingresa en Cáncer)'
        });
      }

      // September Equinox (Autumn in Northern Hemisphere)
      if (marchEquinox.sep_equinox.date >= startDate && marchEquinox.sep_equinox.date <= endDate) {
        events.push({
          type: 'autumn_equinox',
          date: marchEquinox.sep_equinox.date,
          description: '🍂 Equinoccio de Otoño (Sol ingresa en Libra)'
        });
      }

      // December Solstice (Winter in Northern Hemisphere)
      if (marchEquinox.dec_solstice.date >= startDate && marchEquinox.dec_solstice.date <= endDate) {
        events.push({
          type: 'winter_solstice',
          date: marchEquinox.dec_solstice.date,
          description: '❄️ Solsticio de Invierno (Sol ingresa en Capricornio)'
        });
      }
    }
  } catch (error) {
    console.error('Error calculating seasonal events:', error);
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export async function calculateSolarYearEvents(birthDate: Date): Promise<SolarYearEvents> {
  console.log('🌟 Calculating Solar Year Events from', birthDate);

  // Calculate start and end dates (from birthday to next birthday)
  const startDate = new Date(birthDate);
  const endDate = new Date(birthDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  console.log('📅 Period:', startDate.toISOString(), 'to', endDate.toISOString());

  try {
    // Calculate all events in parallel
    const [lunarPhases, retrogrades, eclipses, planetaryIngresses, seasonalEvents] = await Promise.all([
      Promise.resolve(calculateLunarPhases(startDate, endDate)),
      Promise.resolve(calculateRetrogrades(startDate, endDate)),
      Promise.resolve(calculateEclipses(startDate, endDate)),
      Promise.resolve(calculatePlanetaryIngresses(startDate, endDate)),
      Promise.resolve(calculateSeasonalEvents(startDate, endDate))
    ]);

    console.log('✅ Solar Year Events calculated:');
    console.log(`  🌙 ${lunarPhases.length} lunar phases`);
    console.log(`  ☿️ ${retrogrades.length} retrogrades`);
    console.log(`  🌑 ${eclipses.length} eclipses`);
    console.log(`  ♈ ${planetaryIngresses.length} planetary ingresses`);
    console.log(`  🌸 ${seasonalEvents.length} seasonal events`);

    return {
      lunarPhases,
      retrogrades,
      eclipses,
      planetaryIngresses,
      seasonalEvents
    };
  } catch (error) {
    console.error('❌ Error calculating solar year events:', error);
    throw error;
  }
}
