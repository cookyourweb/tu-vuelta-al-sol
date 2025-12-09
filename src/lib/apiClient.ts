// src/lib/apiClient.ts
// Helper para hacer fetch con autenticación automática

import { getAuth } from 'firebase/auth';

/**
 * Obtiene headers de autenticación para llamadas a la API
 * Incluye el token Bearer si el usuario está autenticado
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      };
    }
  } catch (error) {
    console.warn('No se pudo obtener token de autenticación:', error);
  }

  // Fallback: headers sin autenticación
  return {
    'Content-Type': 'application/json'
  };
}

/**
 * Wrapper de fetch que añade automáticamente headers de autenticación
 *
 * @example
 * const data = await authenticatedFetch('/api/birth-data?userId=123');
 * const result = await authenticatedFetch('/api/charts/natal', {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * });
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const authHeaders = await getAuthHeaders();

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  };

  return fetch(url, mergedOptions);
}
