// lib/prokerala/endpoints.ts

/**
 * Endpoints de Prokerala API configurados para astrología tropical occidental
 */

// URL base de la API
export const BASE_URL = "https://api.prokerala.com/v2";

// Endpoints para cartas natales
export const getEndpoints = (
  birthDate: string,        // Formato ISO8601: 'YYYY-MM-DDTHH:MM:SS+HH:MM'
  birthCoordinates: string, // Formato: 'latitud,longitud'
  currentDate: string = new Date().toISOString(),      // Formato ISO8601 para tránsitos
  currentCoordinates: string = birthCoordinates // Formato: 'latitud,longitud'
) => {
  // Configuración común para todos los endpoints
  const commonParams = `birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&la=es&ayanamsa=0`;
  
  return {
    // 1. Carta Natal
    natalChart: `${BASE_URL}/astrology/natal-chart?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&aspect_filter=all&${commonParams}`,
    
    // 2. Aspectos Natales
    natalAspects: `${BASE_URL}/astrology/natal-aspect-chart?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&aspect_filter=all&${commonParams}`,
    
    // 3. Posiciones Planetarias
    planetPositions: `${BASE_URL}/astrology/natal-planet-position?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&${commonParams}`,
    
    // 4. Tránsitos
    transitChart: `${BASE_URL}/astrology/transit-chart?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&transit_datetime=${currentDate}&current_coordinates=${currentCoordinates}&aspect_filter=all&${commonParams}`,
    
    // 5. Aspectos de Tránsitos
    transitAspects: `${BASE_URL}/astrology/transit-aspect-chart?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&transit_datetime=${currentDate}&current_coordinates=${currentCoordinates}&aspect_filter=all&${commonParams}`,
    
    // 6. Posiciones de Tránsitos
    transitPlanetPositions: `${BASE_URL}/astrology/transit-planet-position?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&transit_datetime=${currentDate}&current_coordinates=${currentCoordinates}&${commonParams}`,
    
    // 7. Carta de Progresión (año actual)
    progressionChart: (year: number) => `${BASE_URL}/astrology/progression-chart?profile[datetime]=${birthDate}&profile[coordinates]=${birthCoordinates}&progression_year=${year}&current_coordinates=${currentCoordinates}&aspect_filter=all&${commonParams}`
  };
};