// =============================================================================
// 🪐 HOOK: usePlanetIndividualSR
// =============================================================================
// Hook para generar y obtener interpretaciones INDIVIDUALES de planetas
// en contexto de Retorno Solar (tono profesional, 8 secciones)
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import type { PlanetIndividualSRInterpretation } from '@/types/astrology/interpretation';

interface PlanetDataSR {
  userId: string;
  planetName: string;
  returnYear: number;

  // Natal
  natalSign: string;
  natalHouse: number;
  natalDegree: number;
  natalInterpretation?: string;

  // Solar Return
  srSign: string;
  srHouse: number;
  srDegree: number;

  // User
  userFirstName: string;
}

export function usePlanetIndividualSR() {
  const [interpretation, setInterpretation] = useState<PlanetIndividualSRInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  /**
   * Fetch planet interpretation (from cache or generate new)
   */
  const fetchInterpretation = useCallback(async (data: PlanetDataSR) => {
    setIsLoading(true);
    setError(null);
    setCached(false);

    try {
      console.log(`🪐 [usePlanetIndividualSR] Fetching ${data.planetName} interpretation...`);

      // Try to get from cache first
      const cacheUrl = `/api/astrology/interpret-planet-sr?userId=${data.userId}&planetName=${data.planetName}&returnYear=${data.returnYear}`;

      const cacheResponse = await fetch(cacheUrl);

      if (cacheResponse.ok) {
        const cacheData = await cacheResponse.json();
        if (cacheData.success && cacheData.interpretation) {
          console.log(`✅ [usePlanetIndividualSR] Found in cache`);
          setInterpretation(cacheData.interpretation);
          setCached(true);
          setIsLoading(false);
          return cacheData.interpretation;
        }
      }

      console.log(`📝 [usePlanetIndividualSR] Not in cache, generating new...`);

      // Not in cache, generate new
      const generateResponse = await fetch('/api/astrology/interpret-planet-sr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Error generating interpretation');
      }

      const result = await generateResponse.json();

      if (!result.success || !result.interpretation) {
        throw new Error('Invalid response from server');
      }

      console.log(`✅ [usePlanetIndividualSR] Generated successfully`);
      setInterpretation(result.interpretation);
      setCached(false);
      setIsLoading(false);

      return result.interpretation;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ [usePlanetIndividualSR] Error:`, errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Clear current interpretation
   */
  const clear = useCallback(() => {
    setInterpretation(null);
    setError(null);
    setCached(false);
  }, []);

  return {
    interpretation,
    isLoading,
    error,
    cached,
    fetchInterpretation,
    clear,
  };
}
