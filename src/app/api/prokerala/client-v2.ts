//src/app/api/prokerala/client-v2.ts
import axios from 'axios';

// URLs para la API de Prokerala
const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';

// Credenciales desde variables de entorno
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Almacenamiento en memoria para el token de acceso
interface TokenCache {
  token: string;
  expiresAt: number; // timestamp en segundos
}

let tokenCache: TokenCache | null = null;

/**
 * Cliente para la API de Prokerala (Versión 2)
 * Implementa el formato exacto de solicitud de la API v2
 */
export class ProkeralaClientV2 {
  /**
   * Obtiene un token de acceso, usando caché si es posible
   * @returns Token de acceso
   */
  private async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    // Usar token en caché si todavía es válido
    if (tokenCache && tokenCache.expiresAt > now + 60) {
      return tokenCache.token;
    }
    
    try {
      // Verificar credenciales
      if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Faltan credenciales de Prokerala. Verifica tus variables de entorno.');
      }
      
      // Obtener nuevo token
      const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      // Validar respuesta
      if (!response.data || !response.data.access_token) {
        throw new Error('Respuesta de token inválida');
      }
      
      // Guardar token en caché
      tokenCache = {
        token: response.data.access_token,
        expiresAt: now + response.data.expires_in
      };
      
      return tokenCache.token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        console.error('Error obteniendo token:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message
        });
      } else {
        console.error('Error desconocido obteniendo token:', error);
      }
      throw new Error('No se pudo obtener el token de autenticación');
    }
  }
  
  /**
   * Genera una carta natal usando la API de Prokerala (formato V2)
   * @param birthDate Fecha de nacimiento (YYYY-MM-DD)
   * @param birthTime Hora de nacimiento (HH:MM:SS)
   * @param latitude Latitud
   * @param longitude Longitud
   * @param timezone Zona horaria (ej: 'Europe/Madrid')
   * @returns Carta natal
   */
  async getNatalChart(
    birthDate: string,
    birthTime: string,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<any> {
    try {
      // Obtener token
      const token = await this.getAccessToken();
      
      // Formatear datetime en formato ISO 8601 con zona horaria
      const tzOffset = this.getTimezoneOffset(timezone);
      const datetime = `${birthDate}T${birthTime}${tzOffset}`;
      
      // Construir URL de API con el formato específico V2
      const url = new URL(`${API_BASE_URL}/astrology/natal-chart`);
      
      // Añadir parámetros según el formato exacto de la API
      url.searchParams.append('profile[datetime]', datetime);
      url.searchParams.append('profile[coordinates]', `${latitude},${longitude}`);
      url.searchParams.append('birth_time_unknown', 'false');
      url.searchParams.append('house_system', 'placidus');
      url.searchParams.append('orb', 'default');
      url.searchParams.append('birth_time_rectification', 'flat-chart');
      url.searchParams.append('aspect_filter', 'all');
      url.searchParams.append('la', 'es');
      url.searchParams.append('ayanamsa', '0'); // 0 para zodíaco tropical
      
      console.log('URL completa para API de Prokerala:', url.toString());
      
      // Hacer solicitud a la API
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      // Procesar respuesta
      return this.processChartResponse(response.data, latitude, longitude, timezone);
    } catch (error) {
      console.error('Error en solicitud de carta natal:', error);
      
      // Manejar errores específicos
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        console.error('Detalles del error:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: axiosError.config?.url
        });
        
        // Propagar mensaje de error específico si existe
        if (axiosError.response?.data?.error) {
          throw new Error(`Error de API: ${axiosError.response.data.error}`);
        }
      }
      
      // Propagar error original
      throw error;
    }
  }
  
  /**
   * Alternativa usando POST con body según el formato que proporcionaste
   */
  async getNatalChartPost(
    birthDate: string,
    birthTime: string,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<any> {
    try {
      // Obtener token
      const token = await this.getAccessToken();
      
      // Formatear datetime en formato ISO 8601 con zona horaria
      const tzOffset = this.getTimezoneOffset(timezone);
      const datetime = `${birthDate}T${birthTime}${tzOffset}`;
      
      // Construir URL y datos para la solicitud POST
      const url = `${API_BASE_URL}/astrology/natal-chart`;
      
      // Crear cuerpo de la solicitud exactamente como el ejemplo
      const postData = {
        profile: {
          datetime: datetime,
          coordinates: `${latitude},${longitude}`
        },
        birth_time_unknown: false,
        house_system: "placidus",
        orb: "default",
        birth_time_rectification: "flat-chart",
        aspect_filter: "all",
        la: "es",
        ayanamsa: 0 // 0 para zodíaco tropical
      };
      
      console.log('Datos POST para API de Prokerala:', JSON.stringify(postData));
      
      // Hacer solicitud POST a la API
      const response = await axios.post(url, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Procesar respuesta
      return this.processChartResponse(response.data, latitude, longitude, timezone);
    } catch (error) {
      console.error('Error en solicitud POST de carta natal:', error);
      
      // Manejar errores específicos
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        console.error('Detalles del error:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: axiosError.config?.url
        });
        
        // Propagar mensaje de error específico si existe
        if (axiosError.response?.data?.error) {
          throw new Error(`Error de API: ${axiosError.response.data.error}`);
        }
      }
      
      // Propagar error original
      throw error;
    }
  }
  
  /**
   * Obtiene el offset de zona horaria en formato "+/-HH:MM"
   */
  private getTimezoneOffset(timezone: string): string {
    try {
      // Crear una fecha actual en la zona horaria especificada
      const date = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      }).format(date);
      
      // Extraer la parte GMT+X o GMT-X
      const matches = formattedDate.match(/GMT([+-]\d+)/);
      if (matches && matches[1]) {
        const offset = matches[1];
        
        // Formatear para asegurar el formato +/-HH:MM
        if (offset.length === 3) { // e.g., +/-XX
          const hours = offset.substring(0, 3);
          return `${hours}:00`;
        } else { // e.g., +/-XXXX
          const hours = offset.substring(0, 3);
          const minutes = offset.substring(3);
          return `${hours}:${minutes}`;
        }
      }
      
      // Si no se puede determinar, devolver UTC
      return '+00:00';
    } catch (error) {
      console.warn('Error obteniendo offset de zona horaria, usando UTC:', error);
      return '+00:00';
    }
  }
  
  /**
   * Procesa la respuesta de la API para adaptarla al formato de nuestra aplicación
   */
  private processChartResponse(apiResponse: any, latitude: number, longitude: number, timezone: string): any {
    try {
      // Extraer componentes principales
      const { planets = [], houses = [], aspects = [], ascendant, mc: midheaven } = apiResponse;
      
      // Procesar planetas
      const processedPlanets = planets.map((planet: any) => ({
        name: this.translatePlanetName(planet.name),
        sign: planet.sign || this.getSignFromLongitude(planet.longitude),
        degree: this.formatDegree(planet.longitude),
        longitude: planet.longitude,
        houseNumber: planet.house || 1,
        isRetrograde: planet.is_retrograde || false
      }));
      
      // Procesar casas
      const processedHouses = houses.map((house: any) => ({
        number: house.number,
        sign: house.sign || this.getSignFromLongitude(house.longitude),
        degree: this.formatDegree(house.longitude),
        longitude: house.longitude
      }));
      
      // Procesar aspectos
      const processedAspects = aspects.map((aspect: any) => ({
        planet1: {
          id: aspect.planet1?.id || 0,
          name: this.translatePlanetName(aspect.planet1?.name || '')
        },
        planet2: {
          id: aspect.planet2?.id || 0,
          name: this.translatePlanetName(aspect.planet2?.name || '')
        },
        aspect: {
          id: aspect.aspect?.id || 0,
          name: this.translateAspectName(aspect.aspect?.name || '')
        },
        orb: aspect.orb || 0
      }));
      
      // Procesar ángulos
      const processedAngles = [];
      
      if (ascendant) {
        processedAngles.push({
          name: 'Ascendente',
          sign: ascendant.sign || this.getSignFromLongitude(ascendant.longitude),
          degree: this.formatDegree(ascendant.longitude),
          longitude: ascendant.longitude
        });
      }
      
      if (midheaven) {
        processedAngles.push({
          name: 'Medio Cielo',
          sign: midheaven.sign || this.getSignFromLongitude(midheaven.longitude),
          degree: this.formatDegree(midheaven.longitude),
          longitude: midheaven.longitude
        });
      }
      
      // Calcular distribuciones
      const elementDistribution = this.calculateElementDistribution(processedPlanets);
      const modalityDistribution = this.calculateModalityDistribution(processedPlanets);
      
      // Filtrar aspectos clave
      const keyAspects = this.filterKeyAspects(processedAspects);
      
      // Construir objeto final
      return {
        houses: processedHouses,
        planets: processedPlanets,
        aspects: processedAspects,
        angles: processedAngles,
        elementDistribution,
        modalityDistribution,
        keyAspects
      };
    } catch (error) {
      console.error('Error procesando datos de carta natal:', error);
      throw new Error('Error al procesar los datos de la carta natal');
    }
  }
  
  /**
   * Obtiene el signo zodiacal a partir de una longitud
   */
  private getSignFromLongitude(longitude: number): string {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer',
      'Leo', 'Virgo', 'Libra', 'Escorpio',
      'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    const signIndex = Math.floor((longitude % 360) / 30);
    return signs[signIndex];
  }
  
  /**
   * Formatea un grado decimal en formato legible
   */
  private formatDegree(longitude: number): string {
    const totalDegrees = longitude % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    
    return `${degrees}°${minutes}'`;
  }
  
  /**
   * Traduce nombres de planetas del inglés al español
   */
  private translatePlanetName(englishName: string): string {
    const translations: Record<string, string> = {
      'Sun': 'Sol',
      'Moon': 'Luna',
      'Mercury': 'Mercurio',
      'Venus': 'Venus',
      'Mars': 'Marte',
      'Jupiter': 'Júpiter',
      'Saturn': 'Saturno',
      'Uranus': 'Urano',
      'Neptune': 'Neptuno',
      'Pluto': 'Plutón',
      'Chiron': 'Quirón',
      'Lilith': 'Lilith',
      'North Node': 'Nodo N Verdadero',
      'South Node': 'Nodo S Verdadero'
    };
    
    return translations[englishName] || englishName;
  }
  
  /**
   * Traduce nombres de aspectos del inglés al español
   */
  private translateAspectName(englishName: string): string {
    const translations: Record<string, string> = {
      'Conjunction': 'Conjunción',
      'Opposition': 'Oposición',
      'Trine': 'Trígono',
      'Square': 'Cuadratura',
      'Sextile': 'Sextil',
      'Quincunx': 'Quincuncio',
      'Semi-sextile': 'Semisextil',
      'Sesquiquadrate': 'Sesquicuadratura',
      'Semi-square': 'Semicuadratura',
      'Quintile': 'Quintil',
      'Biquintile': 'Biquintil',
      'Parallel': 'Paralelo',
      'Contraparallel': 'Contraparalelo'
    };
    
    return translations[englishName] || englishName;
  }
  
  /**
   * Filtra los aspectos más relevantes
   */
  private filterKeyAspects(aspects: any[]): any[] {
    // Aspectos principales
    const MAJOR_ASPECTS = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
    
    // Filtrar aspectos importantes y ordenar por orbe
    return aspects
      .filter(aspect => MAJOR_ASPECTS.includes(aspect.aspect.name))
      .sort((a, b) => a.orb - b.orb)
      .slice(0, 10);
  }
  
  /**
   * Calcula la distribución de elementos (fuego, tierra, aire, agua)
   */
  private calculateElementDistribution(planets: any[]): { fire: number; earth: number; air: number; water: number } {
    const elementMap: Record<string, string> = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
      'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
      'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
      'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water'
    };
    
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    let total = 0;
    
    planets.forEach(planet => {
      const element = elementMap[planet.sign];
      if (element && counts[element as keyof typeof counts] !== undefined) {
        counts[element as keyof typeof counts]++;
        total++;
      }
    });
    
    // Evitar división por cero
    if (total === 0) {
      return { fire: 25, earth: 25, air: 25, water: 25 };
    }
    
    return {
      fire: Math.round((counts.fire / total) * 100),
      earth: Math.round((counts.earth / total) * 100),
      air: Math.round((counts.air / total) * 100),
      water: Math.round((counts.water / total) * 100)
    };
  }
  
  /**
   * Calcula la distribución por modalidad (cardinal, fijo, mutable)
   */
  private calculateModalityDistribution(planets: any[]): { cardinal: number; fixed: number; mutable: number } {
    const modalityMap: Record<string, string> = {
      'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
      'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
      'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable'
    };
    
    const counts = { cardinal: 0, fixed: 0, mutable: 0 };
    let total = 0;
    
    planets.forEach(planet => {
      const modality = modalityMap[planet.sign];
      if (modality && counts[modality as keyof typeof counts] !== undefined) {
        counts[modality as keyof typeof counts]++;
        total++;
      }
    });
    
    // Evitar división por cero
    if (total === 0) {
      return { cardinal: 33, fixed: 33, mutable: 34 };
    }
    
    return {
      cardinal: Math.round((counts.cardinal / total) * 100),
      fixed: Math.round((counts.fixed / total) * 100),
      mutable: Math.round((counts.mutable / total) * 100)
    };
  }
}

// Exportar una instancia única del cliente
export const prokeralaClientV2 = new ProkeralaClientV2();