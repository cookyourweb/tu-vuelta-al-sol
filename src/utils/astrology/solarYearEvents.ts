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

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  // Calculate all New Moons in the period
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() - 30); // Start searching 30 days before to catch edge cases

  while (currentDate < endDate) {
    try {
      // Search for next New Moon (phase = 0)
      const newMoonSearch = Astronomy.SearchMoonPhase(0, currentDate, 40);
      if (newMoonSearch && newMoonSearch.date.getTime() <= endDate.getTime()) {
        const newMoonDate = newMoonSearch.date; // Convert AstroTime to Date

        // Get Moon's ecliptic longitude at new moon
        const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, newMoonDate, false);
        const ecliptic = Astronomy.Ecliptic(moonVec);
        const zodiacInfo = eclipticLongitudeToZodiac(ecliptic.elon);

        if (newMoonDate.getTime() >= startDate.getTime()) {
          phases.push({
            type: 'new_moon',
            date: newMoonDate,
            sign: zodiacInfo.sign,
            degree: zodiacInfo.degree,
            description: `🌑 Luna Nueva en ${zodiacInfo.sign} ${zodiacInfo.degree.toFixed(1)}°`
          });
        }

        // Search for Full Moon (phase = 2) after this New Moon
        const fullMoonSearch = Astronomy.SearchMoonPhase(2, newMoonDate, 20);
        if (fullMoonSearch && fullMoonSearch.date.getTime() <= endDate.getTime()) {
          const fullMoonDate = fullMoonSearch.date; // Convert AstroTime to Date

          // Get Moon's position at full moon
          const moonVecFull = Astronomy.GeoVector(Astronomy.Body.Moon, fullMoonDate, false);
          const eclipticFull = Astronomy.Ecliptic(moonVecFull);
          const zodiacInfoFull = eclipticLongitudeToZodiac(eclipticFull.elon);

          if (fullMoonDate.getTime() >= startDate.getTime()) {
            phases.push({
              type: 'full_moon',
              date: fullMoonDate,
              sign: zodiacInfoFull.sign,
              degree: zodiacInfoFull.degree,
              description: `🌕 Luna Llena en ${zodiacInfoFull.sign} ${zodiacInfoFull.degree.toFixed(1)}°`
            });
          }
        }

        // Move to next cycle
        currentDate = new Date(newMoonDate);
        currentDate.setDate(currentDate.getDate() + 25); // Jump ~25 days to next cycle
      } else {
        break;
      }
    } catch (error) {
      console.error('Error calculating lunar phase:', error);
      break;
    }
  }

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

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  // Extend search range to catch retrogrades that start before or end after period
  const searchStart = new Date(startDate);
  searchStart.setDate(searchStart.getDate() - 60);
  const searchEnd = new Date(endDate);
  searchEnd.setDate(searchEnd.getDate() + 60);

  for (const body of RETROGRADE_PLANETS) {
    try {
      let currentDate = new Date(searchStart);
      let wasRetrograde = false;
      let retrogradeStart: Date | null = null;
      let retrogradeStartSign = '';
      let lastLongitude: number | null = null;

      // Sample every 2 days to detect retrograde motion
      while (currentDate < searchEnd) {
        const pos = Astronomy.Ecliptic(Astronomy.GeoVector(body, currentDate, false));
        const longitude = pos.elon;

        // Detect retrograde by checking if longitude is decreasing
        // (accounting for 360° wrap-around)
        if (lastLongitude !== null) {
          let lonDiff = longitude - lastLongitude;

          // Handle 360° boundary crossing
          if (lonDiff > 180) lonDiff -= 360;
          if (lonDiff < -180) lonDiff += 360;

          const isRetrograde = lonDiff < -0.01; // Moving backwards

          if (isRetrograde && !wasRetrograde) {
            // Retrograde period starts
            retrogradeStart = new Date(currentDate);
            retrogradeStartSign = eclipticLongitudeToZodiac(longitude).sign;
            wasRetrograde = true;
          } else if (!isRetrograde && wasRetrograde && retrogradeStart) {
            // Retrograde period ends
            const retrogradeEnd = new Date(currentDate);
            const retrogradeEndSign = eclipticLongitudeToZodiac(longitude).sign;

            // Only include if it overlaps with our actual date range
            if (retrogradeEnd >= startDate && retrogradeStart <= endDate) {
              const planetName = getPlanetName(body);
              retrogrades.push({
                planet: planetName,
                startDate: retrogradeStart,
                endDate: retrogradeEnd,
                startSign: retrogradeStartSign,
                endSign: retrogradeEndSign,
                description: `☿️ ${planetName} Retrógrado en ${retrogradeStartSign}`
              });
            }

            wasRetrograde = false;
            retrogradeStart = null;
          }
        }

        lastLongitude = longitude;
        currentDate.setDate(currentDate.getDate() + 2); // Check every 2 days
      }

      // If still in retrograde at the end, close the period
      if (wasRetrograde && retrogradeStart) {
        const retrogradeEnd = new Date(currentDate);
        const pos = Astronomy.Ecliptic(Astronomy.GeoVector(body, retrogradeEnd, false));
        const retrogradeEndSign = eclipticLongitudeToZodiac(pos.elon).sign;

        if (retrogradeEnd >= startDate && retrogradeStart <= endDate) {
          const planetName = getPlanetName(body);
          retrogrades.push({
            planet: planetName,
            startDate: retrogradeStart,
            endDate: retrogradeEnd,
            startSign: retrogradeStartSign,
            endSign: retrogradeEndSign,
            description: `☿️ ${planetName} Retrógrado en ${retrogradeStartSign}`
          });
        }
      }
    } catch (error) {
      console.error(`Error calculating retrograde for ${getPlanetName(body)}:`, error);
    }
  }

  return retrogrades.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

// =============================================================================
// ECLIPSES
// =============================================================================

export function calculateEclipses(startDate: Date, endDate: Date): Eclipse[] {
  const eclipses: Eclipse[] = [];

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  try {
    // Calculate Solar Eclipses
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - 30); // Start a bit earlier

    for (let i = 0; i < 10; i++) { // Max 10 solar eclipses in ~1 year period
      try {
        const solarEclipse = Astronomy.SearchGlobalSolarEclipse(currentDate);
        if (solarEclipse && solarEclipse.peak.date.getTime() <= endDate.getTime()) {
          const eclipseDate = solarEclipse.peak.date; // Convert AstroTime to Date

          // Get Sun's position at eclipse
          const sunPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, eclipseDate, false));
          const zodiacInfo = eclipticLongitudeToZodiac(sunPos.elon);

          if (eclipseDate.getTime() >= startDate.getTime()) {
            eclipses.push({
              type: 'solar',
              date: eclipseDate,
              sign: zodiacInfo.sign,
              degree: zodiacInfo.degree,
              magnitude: solarEclipse.obscuration || 0.5,
              description: `☀️🌑 Eclipse Solar en ${zodiacInfo.sign} ${zodiacInfo.degree.toFixed(1)}°`
            });
          }

          // Move to day after eclipse to search for next one
          currentDate = new Date(eclipseDate);
          currentDate.setDate(currentDate.getDate() + 150); // Eclipses are ~6 months apart minimum
        } else {
          break;
        }
      } catch (error) {
        break;
      }
    }

    // Calculate Lunar Eclipses
    currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - 30);

    for (let i = 0; i < 10; i++) { // Max 10 lunar eclipses in ~1 year period
      try {
        const lunarEclipse = Astronomy.SearchLunarEclipse(currentDate);
        if (lunarEclipse && lunarEclipse.peak.date.getTime() <= endDate.getTime()) {
          const eclipseDate = lunarEclipse.peak.date; // Convert AstroTime to Date

          // Get Moon's position at eclipse
          const moonPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, eclipseDate, false));
          const zodiacInfo = eclipticLongitudeToZodiac(moonPos.elon);

          if (eclipseDate.getTime() >= startDate.getTime()) {
            eclipses.push({
              type: 'lunar',
              date: eclipseDate,
              sign: zodiacInfo.sign,
              degree: zodiacInfo.degree,
              magnitude: lunarEclipse.obscuration || 0.5,
              description: `🌑🌕 Eclipse Lunar en ${zodiacInfo.sign} ${zodiacInfo.degree.toFixed(1)}°`
            });
          }

          // Move to day after eclipse
          currentDate = new Date(eclipseDate);
          currentDate.setDate(currentDate.getDate() + 150);
        } else {
          break;
        }
      } catch (error) {
        break;
      }
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

  // For the Sun, use seasonal calculations which are more efficient
  const sunIngresses = calculateSunIngresses(startDate, endDate);
  ingresses.push(...sunIngresses);

  // For other planets, use a simplified approach with known ingress dates
  // This is a compromise between accuracy and performance
  const knownIngresses = getKnownPlanetaryIngresses(startDate, endDate);
  ingresses.push(...knownIngresses);

  return ingresses.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Helper function for efficient Sun ingress calculations
function calculateSunIngresses(startDate: Date, endDate: Date): PlanetaryIngress[] {
  const ingresses: PlanetaryIngress[] = [];

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  try {
    // Use astronomy-engine's Seasons function for precise equinox/solstice dates
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    for (let year = startYear; year <= endYear + 1; year++) {
      try {
        const seasons = Astronomy.Seasons(year);

        // Spring Equinox - Sun enters Aries (0°)
        const marEquinoxDate = seasons.mar_equinox.date;
        if (marEquinoxDate.getTime() >= startDate.getTime() && marEquinoxDate.getTime() <= endDate.getTime()) {
          ingresses.push({
            planet: 'Sol',
            date: marEquinoxDate,
            fromSign: 'Piscis',
            toSign: 'Aries',
            description: '♈ Sol ingresa en Aries'
          });
        }

        // Summer Solstice - Sun enters Cancer (90°)
        const junSolsticeDate = seasons.jun_solstice.date;
        if (junSolsticeDate.getTime() >= startDate.getTime() && junSolsticeDate.getTime() <= endDate.getTime()) {
          ingresses.push({
            planet: 'Sol',
            date: junSolsticeDate,
            fromSign: 'Géminis',
            toSign: 'Cáncer',
            description: '♋ Sol ingresa en Cáncer'
          });
        }

        // Autumn Equinox - Sun enters Libra (180°)
        const sepEquinoxDate = seasons.sep_equinox.date;
        if (sepEquinoxDate.getTime() >= startDate.getTime() && sepEquinoxDate.getTime() <= endDate.getTime()) {
          ingresses.push({
            planet: 'Sol',
            date: sepEquinoxDate,
            fromSign: 'Virgo',
            toSign: 'Libra',
            description: '♎ Sol ingresa en Libra'
          });
        }

        // Winter Solstice - Sun enters Capricorn (270°)
        const decSolsticeDate = seasons.dec_solstice.date;
        if (decSolsticeDate.getTime() >= startDate.getTime() && decSolsticeDate.getTime() <= endDate.getTime()) {
          ingresses.push({
            planet: 'Sol',
            date: decSolsticeDate,
            fromSign: 'Sagitario',
            toSign: 'Capricornio',
            description: '♑ Sol ingresa en Capricornio'
          });
        }
      } catch (error) {
        console.error(`Error calculating seasons for year ${year}:`, error);
      }
    }
  } catch (error) {
    console.error('Error calculating sun ingresses:', error);
  }

  return ingresses;
}

// Helper function for known planetary ingresses (simplified approach)
function getKnownPlanetaryIngresses(startDate: Date, endDate: Date): PlanetaryIngress[] {
  const ingresses: PlanetaryIngress[] = [];

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  // Calculate ingresses for fast-moving planets: Mercury, Venus, Mars
  const ingressPlanets = [
    { body: Astronomy.Body.Mercury, name: 'Mercurio', sampleDays: 2 },
    { body: Astronomy.Body.Venus, name: 'Venus', sampleDays: 3 },
    { body: Astronomy.Body.Mars, name: 'Marte', sampleDays: 4 },
    { body: Astronomy.Body.Jupiter, name: 'Júpiter', sampleDays: 7 },
    { body: Astronomy.Body.Saturn, name: 'Saturno', sampleDays: 10 }
  ];

  for (const planetInfo of ingressPlanets) {
    try {
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - 40); // Start earlier to catch edge cases

      let lastSign = '';

      // Sample planet positions at regular intervals
      while (currentDate < endDate) {
        const pos = Astronomy.Ecliptic(Astronomy.GeoVector(planetInfo.body, currentDate, false));
        const zodiacInfo = eclipticLongitudeToZodiac(pos.elon);
        const currentSign = zodiacInfo.sign;

        if (lastSign && currentSign !== lastSign && currentDate >= startDate) {
          // Sign change detected - refine the exact moment
          let refinedDate = new Date(currentDate);

          // Binary search for exact ingress moment (within 1 hour precision)
          let searchStart = new Date(currentDate);
          searchStart.setDate(searchStart.getDate() - planetInfo.sampleDays);
          let searchEnd = new Date(currentDate);

          for (let i = 0; i < 10; i++) { // 10 iterations = ~1 hour precision
            const midDate = new Date((searchStart.getTime() + searchEnd.getTime()) / 2);
            const midPos = Astronomy.Ecliptic(Astronomy.GeoVector(planetInfo.body, midDate, false));
            const midSign = eclipticLongitudeToZodiac(midPos.elon).sign;

            if (midSign === lastSign) {
              searchStart = midDate;
            } else {
              searchEnd = midDate;
            }
          }

          refinedDate = searchEnd;

          if (refinedDate >= startDate && refinedDate <= endDate) {
            ingresses.push({
              planet: planetInfo.name,
              date: refinedDate,
              fromSign: lastSign,
              toSign: currentSign,
              description: `♈ ${planetInfo.name} ingresa en ${currentSign}`
            });
          }
        }

        lastSign = currentSign;
        currentDate.setDate(currentDate.getDate() + planetInfo.sampleDays);
      }
    } catch (error) {
      console.error(`Error calculating ingresses for ${planetInfo.name}:`, error);
    }
  }

  return ingresses;
}

// =============================================================================
// SEASONAL EVENTS
// =============================================================================

export function calculateSeasonalEvents(startDate: Date, endDate: Date): SeasonalEvent[] {
  const events: SeasonalEvent[] = [];

  // 🚀 DYNAMIC CALCULATION - Works for ANY year
  try {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    for (let year = startYear; year <= endYear + 1; year++) {
      try {
        const seasons = Astronomy.Seasons(year);

        // Spring Equinox
        const marEquinoxDate = seasons.mar_equinox.date;
        if (marEquinoxDate.getTime() >= startDate.getTime() && marEquinoxDate.getTime() <= endDate.getTime()) {
          events.push({
            type: 'spring_equinox',
            date: marEquinoxDate,
            description: '🌸 Equinoccio de Primavera (Sol ingresa en Aries)'
          });
        }

        // Summer Solstice
        const junSolsticeDate = seasons.jun_solstice.date;
        if (junSolsticeDate.getTime() >= startDate.getTime() && junSolsticeDate.getTime() <= endDate.getTime()) {
          events.push({
            type: 'summer_solstice',
            date: junSolsticeDate,
            description: '☀️ Solsticio de Verano (Sol ingresa en Cáncer)'
          });
        }

        // Autumn Equinox
        const sepEquinoxDate = seasons.sep_equinox.date;
        if (sepEquinoxDate.getTime() >= startDate.getTime() && sepEquinoxDate.getTime() <= endDate.getTime()) {
          events.push({
            type: 'autumn_equinox',
            date: sepEquinoxDate,
            description: '🍂 Equinoccio de Otoño (Sol ingresa en Libra)'
          });
        }

        // Winter Solstice
        const decSolsticeDate = seasons.dec_solstice.date;
        if (decSolsticeDate.getTime() >= startDate.getTime() && decSolsticeDate.getTime() <= endDate.getTime()) {
          events.push({
            type: 'winter_solstice',
            date: decSolsticeDate,
            description: '❄️ Solsticio de Invierno (Sol ingresa en Capricornio)'
          });
        }
      } catch (error) {
        console.error(`Error calculating seasonal events for year ${year}:`, error);
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
