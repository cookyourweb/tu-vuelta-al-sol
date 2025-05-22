// src/app/api/prokerala/utils.ts

/**
 * Format timezone offset for API requests
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const formatted = formatter.format(date);
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
    console.warn('Error calculating timezone offset, using UTC:', error);
    return '+00:00';
  }
}

export function getPlanetSymbol(planetName: string): string {
  const symbols: Record<string, string> = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇',
    'Quirón': '⚷',
    'Nodo Norte': '☊',
    'Nodo Sur': '☋',
    'Lilith': '⚸'
  };
  
  return symbols[planetName] || '';
}

export function getSignSymbol(signName: string): string {
  const symbols: Record<string, string> = {
    'Aries': '♈',
    'Tauro': '♉',
    'Géminis': '♊',
    'Cáncer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Escorpio': '♏',
    'Sagitario': '♐',
    'Capricornio': '♑',
    'Acuario': '♒',
    'Piscis': '♓'
  };
  
  return symbols[signName] || '';
}

export function getAspectSymbol(aspectType: string): string {
  const symbols: Record<string, string> = {
    'conjunction': '☌',
    'opposition': '☍',
    'trine': '△',
    'square': '□',
    'sextile': '⚹',
    'quincunx': '⚻',
    'semi-sextile': '⚺',
    'sesqui-square': '⚼',
    'semi-square': '⚿',
    'quintile': '⚾',
    'bi-quintile': '⚽'
  };
  
  return symbols[aspectType] || '';
}