// =============================================================================
// 🪐 COMPONENTE: Planet Clickable Solar Return
// =============================================================================
// Componente que maneja tooltip + click para planetas en Solar Return
// - Tooltip: Muestra info técnica rápida (hover)
// - Click: Abre drawer con 8 secciones profesionales
// =============================================================================

'use client';

import React, { useState } from 'react';
import { usePlanetIndividualSR } from '@/hooks/usePlanetIndividualSR';
import { PlanetIndividualDrawerSR } from './PlanetIndividualDrawerSR';

// =============================================================================
// 📚 INTERFACES
// =============================================================================

interface PlanetClickableSRProps {
  // Identificación
  planetName: string; // "sol", "luna", "mercurio", etc.
  userId: string;
  returnYear: number;
  userFirstName: string;

  // Datos natales
  natalSign: string;
  natalHouse: number;
  natalDegree: number;
  natalInterpretation?: string;

  // Datos Solar Return
  srSign: string;
  srHouse: number;
  srDegree: number;

  // Render props
  children: (props: {
    onClick: () => void;
    isLoading: boolean;
  }) => React.ReactNode;
}

// =============================================================================
// 🎨 COMPONENTE PRINCIPAL
// =============================================================================

export const PlanetClickableSR: React.FC<PlanetClickableSRProps> = ({
  planetName,
  userId,
  returnYear,
  userFirstName,
  natalSign,
  natalHouse,
  natalDegree,
  natalInterpretation,
  srSign,
  srHouse,
  srDegree,
  children,
}) => {

  const { interpretation, isLoading, fetchInterpretation } = usePlanetIndividualSR();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // =========================================================================
  // 🖱️ HANDLER: Click en planeta
  // =========================================================================
  const handlePlanetClick = async () => {
    console.log(`🖱️ [PlanetClickableSR] Click on ${planetName}`);

    // Si ya tenemos interpretación, solo abrir drawer
    if (interpretation) {
      setIsDrawerOpen(true);
      return;
    }

    // Fetch interpretación
    setIsDrawerOpen(true); // Abrir drawer inmediatamente (mostrará loading)

    await fetchInterpretation({
      userId,
      planetName,
      returnYear,
      userFirstName,
      natalSign,
      natalHouse,
      natalDegree,
      natalInterpretation,
      srSign,
      srHouse,
      srDegree,
    });
  };

  // =========================================================================
  // 🎨 RENDERIZADO
  // =========================================================================
  return (
    <>
      {/* Render children con props */}
      {children({
        onClick: handlePlanetClick,
        isLoading,
      })}

      {/* Drawer */}
      <PlanetIndividualDrawerSR
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        planetName={planetName}
        interpretation={interpretation}
        isLoading={isLoading}
      />
    </>
  );
};
