// src/components/astrology/NatalChartWheel.tsx - VERSIÓN CORREGIDA Y MEJORADA
'use client';

import React, { useState,useEffect, useMemo } from 'react';

// =============================================================================
// INTERFACES Y TIPOS
// =============================================================================

interface Planet {
  name: string;
  sign: string;
  longitude: number;
  isRetrograde?: boolean;
  house?: number;
}

interface House {
  number: number;
  longitude: number;
  sign?: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  angle?: number;
}

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant?: any;
  midheaven?: any;
  showAspects?: boolean;
  showPlanetNames?: boolean;
  showDegrees?: boolean;
  width?: number;
  height?: number;
}

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS MEJORADA
// =============================================================================

const ASPECT_DEFINITIONS = {
  conjunction: { angle: 0, orb: 8, color: '#FFD700', width: 4, style: 'solid', priority: 1 },
  opposition: { angle: 180, orb: 8, color: '#FF4444', width: 3.5, style: 'solid', priority: 2 },
  trine: { angle: 120, orb: 8, color: '#4CAF50', width: 3, style: 'solid', priority: 3 },
  square: { angle: 90, orb: 8, color: '#FF9800', width: 3, style: 'solid', priority: 4 },
  sextile: { angle: 60, orb: 6, color: '#2196F3', width: 2.5, style: 'dashed', priority: 5 },
  quincunx: { angle: 150, orb: 3, color: '#9C27B0', width: 2, style: 'dotted', priority: 6 }
};

// =============================================================================
// FUNCIONES DE CÁLCULO DE ASPECTOS
// =============================================================================

function calculateAngularDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(angle1 - angle2);
  return Math.min(diff, 360 - diff);
}

function findAspectType(separation: number): string | null {
  for (const [type, config] of Object.entries(ASPECT_DEFINITIONS)) {
    const exactAngle = config.angle;
    const orb = config.orb;
    
    // Verificar aspecto directo
    if (Math.abs(separation - exactAngle) <= orb) {
      return type;
    }
    
    // Verificar aspecto complementario (ej: 180° también es 180° desde el otro lado)
    if (Math.abs((360 - separation) - exactAngle) <= orb) {
      return type;
    }
  }
  return null;
}

function calculateAllAspects(planets: Planet[]): Aspect[] {
  const calculatedAspects: Aspect[] = [];
  
  // Verificar cada par de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calcular separación angular
      const separation = calculateAngularDifference(planet1.longitude, planet2.longitude);
      
      // Buscar tipo de aspecto
      const aspectType = findAspectType(separation);
      
      if (aspectType) {
        const aspectConfig = ASPECT_DEFINITIONS[aspectType as keyof typeof ASPECT_DEFINITIONS];
        const orb = Math.abs(separation - aspectConfig.angle);
        
        calculatedAspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          type: aspectType,
          orb: orb,
          angle: separation
        });
      }
    }
  }
  
  // Ordenar por prioridad y orbe
  return calculatedAspects.sort((a, b) => {
    const configA = ASPECT_DEFINITIONS[a.type as keyof typeof ASPECT_DEFINITIONS];
    const configB = ASPECT_DEFINITIONS[b.type as keyof typeof ASPECT_DEFINITIONS];
    
    if (configA.priority !== configB.priority) {
      return configA.priority - configB.priority;
    }
    
    return a.orb - b.orb;
  });
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
const NatalChartWheel: React.FC<NatalChartWheelProps> = (props) => {
  // 🆕 SOLUCIÓN 1: Renderizar solo en cliente para evitar hidratación
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Mientras no esté en el cliente, mostrar placeholder
  if (!isClient) {
    return (
      <div 
        style={{ width: props.width || 650, height: props.height || 650 }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl border border-purple-200/50 animate-pulse flex items-center justify-center"
      >
        <div className="text-purple-400">
          <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  // 🆕 SOLUCIÓN 2: Convertir números a string con precisión fija
  // Esto asegura que servidor y cliente generen exactamente el mismo string
  const toFixedString = (value: number, decimals: number = 6): string => {
    return value.toFixed(decimals);
  };
  
  // Definir centerX y centerY basados en el tamaño del SVG
  const svgWidth = props.width || 650;
  const svgHeight = props.height || 650;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Modificar getPositionFromLongitude para devolver strings
  const getPositionFromLongitude = (longitude: number, radius: number) => {
    if (longitude === null || longitude === undefined || 
        typeof longitude !== 'number' || isNaN(longitude) || !isFinite(longitude)) {
      return { x: toFixedString(centerX), y: toFixedString(centerY) };
    }

    const adjustedAngle = (longitude + 270) % 360;
    const angleInRadians = (adjustedAngle * Math.PI) / 180;
    
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      return { x: toFixedString(centerX), y: toFixedString(centerY) };
    }
    
    // Devolver como strings con precisión fija
    return { 
      x: toFixedString(x), 
      y: toFixedString(y) 
    };
  };
  
  // ... resto del componente igual, pero usando los valores string en el SVG
};

// 🆕 SOLUCIÓN 3 (ALTERNATIVA): Wrapper que solo renderiza en cliente
export const ClientOnlyNatalChartWheel: React.FC<NatalChartWheelProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div 
        className="animate-pulse bg-gray-200 rounded-2xl"
        style={{ width: props.width || 650, height: props.height || 650 }}
      />
    );
  }
  
  return <NatalChartWheel {...props} />;
};

export default NatalChartWheel;
