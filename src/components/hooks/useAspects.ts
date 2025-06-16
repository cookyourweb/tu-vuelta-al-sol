/**
 * Hook personalizado para gestionar aspectos astrológicos
 * Archivo: hooks/useAspects.ts
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { AspectFilter, AspectType, ExtendedPlanet, Planet, PlanetaryAspect } from '../../../types/astrology';
import { calculateAllAspects, CalculatedAspect } from '@/utils/astrology/aspectCalculations';

// =============================================================================
// AUXILIAR: CONVERTIR CalculatedAspect a PlanetaryAspect
// =============================================================================

function convertToPlanetaryAspect(a: CalculatedAspect): PlanetaryAspect {
  // Asumimos que CalculatedAspect y PlanetaryAspect tienen campos similares.
  // Si hay diferencias, mapea los campos aquí.
return {
  planet1: a.planet1 as Planet,
  planet2: a.planet2 as Planet,
  aspect_type: a.aspect_type,
  orb: a.orb,
  strength: a.strength,
  id: '',
  exact_angle: 0,
  applying: false,
  separating: false,
  visual: {
    color: '',
    line_width: 0,
    line_style: 'solid',
    opacity: 0,
    z_index: 0
  }
};
}