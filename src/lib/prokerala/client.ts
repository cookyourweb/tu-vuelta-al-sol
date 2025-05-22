// src/lib/prokerala/client.ts
import axios from 'axios';
import type { NatalChartParams, NatalChartResponse } from './types';

const API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_URL = 'https://api.prokerala.com/token';

// Credentials from environment
const CLIENT_ID = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET;

// Token cache
let tokenCache: { token: string; expiresAt: number } | null = null;

export class ProkeralaClient {
  /**
   * Get access token with caching
   */
  private async getToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    // Use cached token if still valid
    if (tokenCache && tokenCache.expiresAt > now + 60) {
      return tokenCache.token;
    }
    
    // Verify credentials exist
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing Prokerala API credentials. Check environment variables.');
    }
    
    try {
      console.log('Requesting new token from Prokerala...');
      
      // Request new token
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
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid token response from Prokerala');
      }
      
      // Cache the new token
      tokenCache = {
        token: response.data.access_token,
        expiresAt: now + response.data.expires_in
      };
      
      console.log('Successfully obtained Prokerala token');
      return tokenCache.token;
    } catch (error) {
      console.error('Error getting Prokerala token:', error);
      throw new Error('Authentication failed with Prokerala API');
    }
  }
  
  /**
   * Get natal chart using the EXACT format that works in Postman
   */
  async getNatalChart(params: NatalChartParams): Promise<NatalChartResponse> {
    try {
      const token = await this.getToken();
      
      const { birthDate, birthTime, latitude, longitude, timezone } = params;
      
      // Format datetime with timezone offset
      const offset = this.getTimezoneOffset(timezone || 'UTC');
      const datetime = `${birthDate}T${birthTime || '00:00:00'}${offset}`;
      
      // Create URL with parameters exactly as in working Postman example
      const urlParams = new URLSearchParams();
      urlParams.append('profile[datetime]', datetime);
      urlParams.append('profile[coordinates]', `${latitude},${longitude}`);
      urlParams.append('birth_time_unknown', 'false');
      urlParams.append('house_system', 'placidus');
      urlParams.append('orb', 'default');
      urlParams.append('birth_time_rectification', 'flat-chart');
      urlParams.append('aspect_filter', 'all');
      urlParams.append('la', 'es');
      urlParams.append('ayanamsa', '0');
      
      // Log the exact request URL for debugging
      const url = `${API_BASE_URL}/astrology/natal-chart?${urlParams.toString()}`;
      console.log('Prokerala request URL:', url);
      
      // Make the GET request with correct headers
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      // Provide detailed error information
      if (axios.isAxiosError(error)) {
        console.error('Prokerala API error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
      } else {
        console.error('Unexpected error with Prokerala API:', error);
      }
      throw error;
    }
  }
  
  /**
   * Get timezone offset in "+/-HH:MM" format
   */
  private getTimezoneOffset(timezone: string): string {
    try {
      // Create a date formatter with the specified timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      });
      
      const formatted = formatter.format(new Date());
      const matches = formatted.match(/GMT([+-]\d+)/);
      
      if (matches && matches[1]) {
        const offset = matches[1];
        // Format to ensure +/-HH:MM format
        if (offset.length === 3) {
          return `${offset}:00`;
        }
        return offset.replace(/(\d{2})(\d{2})/, '$1:$2');
      }
      
      // Default to UTC if we can't determine
      return '+00:00';
    } catch (error) {
      console.warn('Error getting timezone offset, using UTC:', error);
      return '+00:00';
    }
  }
  
  /**
   * Search for a location by name
   */
  async searchLocation(query: string) {
    if (!query || query.length < 2) {
      return [];
    }
    
    try {
      const token = await this.getToken();
      
      const response = await axios.get(`${API_BASE_URL}/location-search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  }
  
  /**
   * Get astrological events for a date range
   */
  async getAstronomicalEvents(startDate: string, endDate: string) {
    try {
      const token = await this.getToken();
      
      const response = await axios.get(
        `${API_BASE_URL}/astrology/astronomical-events?start_date=${startDate}&end_date=${endDate}&la=es`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching astronomical events:', error);
      return { events: [] };
    }
  }
}

// Export singleton instance
export const prokeralaClient = new ProkeralaClient();