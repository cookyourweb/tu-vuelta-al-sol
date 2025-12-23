// =============================================================================
// 🎨 CHART TOOLTIPS - FIXED WITH LONGER DELAYS
// src/components/astrology/ChartTooltips.tsx
// =============================================================================
// ✅ LONGER DELAY: 2000ms (2 seconds) for aspect tooltips
// ✅ 1000ms (1 second) for planet tooltips
// ✅ pointer-events-auto on ALL tooltips with buttons
// =============================================================================

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Planet, Aspect } from '@/types/astrology/chartDisplay';
import { planetMeanings, signMeanings, houseMeanings, aspectMeanings, PLANET_SYMBOLS, PLANET_COLORS } from '@/constants/astrology';
import { getPersonalizedPlanetInterpretation, getPersonalizedAspectInterpretation } from '@/services/chartInterpretationsService';
import { getExampleInterpretation } from '@/data/interpretations/ExampleInterpretations';
import { useAuth } from '@/context/AuthContext';

interface ChartTooltipsProps {
  hoveredPlanet: string | null;
  hoveredAspect: string | null;
  hoveredHouse: number | null;
  hoveredCard?: string | null;
  clickedCard?: string | null;
  ascendant?: { degree?: number; sign?: string };
  midheaven?: { degree?: number; sign?: string };
  planets: Planet[];
  calculatedAspects: (Aspect & { config: { color: string; difficulty: string; name: string; angle: number; orb: number }; exact: boolean })[];
  tooltipPosition: { x: number; y: number };
  setHoveredPlanet: (planet: string | null) => void;
  setHoveredAspect: (aspect: string | null) => void;
  setHoveredHouse: (house: number | null) => void;
  setHoveredCard?: (card: string | null) => void;
  onOpenDrawer?: (content: any) => void;
  onCloseDrawer?: () => void;
  drawerOpen?: boolean;
  clickedPlanet?: string | null;
  setClickedPlanet?: (planet: string | null) => void;
  clickedAspect?: string | null;
  setClickedAspect?: (planet: string | null) => void;
  userId?: string;
  chartType?: 'natal' | 'progressed' | 'solar-return';
  birthData?: any;
  elementDistribution?: any;
  modalityDistribution?: any;
  solarReturnYear?: number;
  solarReturnTheme?: string;
  ascSRInNatalHouse?: number;
  natalChart?: any; // ⭐ Carta natal para conectar con SR
  cardHoverTimer?: NodeJS.Timeout | null;
  setCardHoverTimer?: (timer: NodeJS.Timeout | null) => void;
}

const ChartTooltipsComponent = (props: ChartTooltipsProps) => {
  const { user } = useAuth();
  const {
    hoveredPlanet,
    hoveredAspect,
    hoveredHouse,
    hoveredCard,
    ascendant,
    midheaven,
    planets,
    calculatedAspects,
    tooltipPosition,
    setHoveredPlanet,
    setHoveredAspect,
    setHoveredHouse,
    setHoveredCard,
    onOpenDrawer,
    onCloseDrawer,
    drawerOpen = false,
    clickedPlanet = null,
    setClickedPlanet,
    clickedAspect = null,
    setClickedAspect,
    userId,
    chartType = 'natal',
    birthData,
    elementDistribution,
    modalityDistribution,
    solarReturnYear,
    solarReturnTheme,
    ascSRInNatalHouse,
    natalChart // ⭐ Carta natal para referencia
  } = props;

  // =============================================================================
  // STATE
  // =============================================================================

  // =============================================================================

  const [natalInterpretations, setNatalInterpretations] = useState<any>(null);
  const [loadingInterpretations, setLoadingInterpretations] = useState(true);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [generatingAspect, setGeneratingAspect] = useState(false);
  const [aspectTooltipLocked, setAspectTooltipLocked] = useState(false);
  const [showLongGeneratingMessage, setShowLongGeneratingMessage] = useState(false);

  // ✅ NEW: Hover delay timers (matching ChartDisplay.tsx)
  const [planetTooltipTimer, setPlanetTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [aspectTooltipTimer, setAspectTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [clickedTooltipTimer, setClickedTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [tooltipLocked, setTooltipLocked] = useState(false); // ⭐ NUEVO: Controla si tooltip permanece abierto con drawer

  // ⭐ NUEVO: Estado global de generación para el modal
  const [isGenerating, setIsGenerating] = useState(false);
  // =============================================================================

  // ✅ Hook para detectar clic fuera - SIMPLIFICADO Y CONSISTENTE
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Verificar si el clic fue en tooltip, drawer o chart
      const isTooltip = target && typeof target.closest === 'function' ? target.closest('[class*="tooltip"], [class*="chart-tooltip"]') : null;
      const isDrawer = target && typeof target.closest === 'function' ? target.closest('.interpretation-drawer') : null;
      const isChart = target && typeof target.closest === 'function' ? target.closest('.chart-container') : null;

      // ⭐ CRÍTICO: NO cerrar si está generando
      if (isGenerating) {
        console.log('🔒 GENERANDO - NO CERRAR TOOLTIP');
        return;
      }

      // ⭐ Si el tooltip está "locked" (porque se abrió el drawer), solo cerrar si se hace click fuera del tooltip Y fuera del drawer
      if (tooltipLocked) {
        if (!isTooltip && !isDrawer) {
          console.log('🔓 Desbloqueando tooltip y cerrando');
          setHoveredPlanet(null);
          setHoveredAspect(null);
          setHoveredHouse(null);
          setHoveredCard?.(null);
          setClickedPlanet?.(null);
          setClickedAspect?.(null);
          setTooltipLocked(false);
        }
        return;
      }

      // Comportamiento normal: cerrar si se hace click fuera de tooltip, drawer y chart
      if (!isTooltip && !isDrawer && !isChart) {
        console.log('🎯 Click fuera - cerrando todos los tooltips');
        setHoveredPlanet(null);
        setHoveredAspect(null);
        setHoveredHouse(null);
        setHoveredCard?.(null);
        setClickedPlanet?.(null);
        setClickedAspect?.(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tooltipLocked, isGenerating]);

  // =============================================================================
  // FETCH AI INTERPRETATIONS
  // =============================================================================
  
  useEffect(() => {
    async function fetchInterpretations() {
      if (!userId) {
        setLoadingInterpretations(false);
        return;
      }

      setLoadingInterpretations(true);

      try {
        console.log('🔍 Fetching interpretations for userId:', userId, 'chartType:', chartType);

        // ⭐ NUEVO: Construir URL con chartType
        let url = `/api/astrology/interpret-natal?userId=${userId}`;
        if (chartType === 'solar-return') {
          url = `/api/interpretations/save?userId=${userId}&chartType=solar-return`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data) {
          console.log('✅ AI Interpretations loaded:', Object.keys(result.data.planets || {}).length, 'planets');
          setNatalInterpretations(result.data);
        } else if (result.needsGeneration) {
          console.log('⚠️ No interpretations found - needs generation');
          setNatalInterpretations(null);
        }
      } catch (error) {
        console.error('❌ Error fetching interpretations:', error);
        setNatalInterpretations(null);
      } finally {
        setLoadingInterpretations(false);
      }
    }

    fetchInterpretations();
  }, [userId, chartType, solarReturnYear]);

  // =============================================================================
  // TOOLTIP HOVER DELAY (CONFIGURABLE PER TYPE)
  // =============================================================================

  const handleMouseLeaveTooltip = (callback: () => void, delay: number = 1000, unlockAspect: boolean = false) => {
    // ⭐ CRÍTICO: NO cerrar si está generando
    if (isGenerating) {
      console.log('🔒 Generando - tooltip NO se cierra');
      return;
    }

    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }

    const timer = setTimeout(() => {
      callback();
      if (unlockAspect) {
        setAspectTooltipLocked(false);
      }
    }, delay);

    setTooltipTimer(timer);
  };

  // ✅ NEW: Cancel tooltip close timer
  const cancelTooltipClose = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
    if (tooltipCloseTimeout) {
      clearTimeout(tooltipCloseTimeout);
      setTooltipCloseTimeout(null);
    }
  };

  // ✅ NEW: State for tooltip close timeout
  const [tooltipCloseTimeout, setTooltipCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnterTooltip = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
  };

  // ✅ NEW: Handle planet tooltip with delay
  const handlePlanetMouseEnter = () => {
    if (planetTooltipTimer) clearTimeout(planetTooltipTimer);
    const timer = setTimeout(() => {
      // Tooltip is shown by the parent component's state
    }, 300); // 300ms delay like ChartDisplay
    setPlanetTooltipTimer(timer);
  };

  const handlePlanetMouseLeave = () => {
    if (planetTooltipTimer) {
      clearTimeout(planetTooltipTimer);
      setPlanetTooltipTimer(null);
    }
    // Tooltip is hidden by the parent component's state, unless clicked
    if (clickedPlanet) {
      // If clicked, keep tooltip open for longer (5 seconds)
      if (clickedTooltipTimer) clearTimeout(clickedTooltipTimer);
      const timer = setTimeout(() => {
        setHoveredPlanet(null);
        if (setClickedPlanet) setClickedPlanet(null);
        if (onCloseDrawer) onCloseDrawer();
        setClickedTooltipTimer(null);
      }, 5000); // 5 seconds delay when clicked
      setClickedTooltipTimer(timer);
    }
  };

  // ✅ NEW: Handle tooltip mouse enter/leave with type-specific behavior
  const handleTooltipMouseEnter = () => {
    handleMouseEnterTooltip();
  };

  const handleTooltipMouseLeave = (type: 'planet' | 'aspect' | 'angle' | 'house') => {
    switch (type) {
      case 'angle':
        handleMouseLeaveTooltip(() => {
          setHoveredPlanet(null);
        }, 2000); // 2 seconds for angles
        break;
      case 'planet':
        handleMouseLeaveTooltip(() => {
          if (!drawerOpen) {
            setHoveredPlanet(null);
          }
        }, 1000); // 1 second for planets
        break;
      case 'aspect':
        handleMouseLeaveTooltip(() => {
          setHoveredAspect(null);
        }, 2000, true); // 2 seconds for aspects, unlock aspect tooltip
        break;
      case 'house':
        handleMouseLeaveTooltip(() => {
          setHoveredHouse(null);
        }, 1000); // 1 second for houses
        break;
      default:
        handleMouseLeaveTooltip(() => {}, 1000);
    }
  };

  // ✅ NEW: Handle aspect tooltip with delay
  const handleAspectMouseEnter = () => {
    if (aspectTooltipTimer) clearTimeout(aspectTooltipTimer);
    const timer = setTimeout(() => {
      // Tooltip is shown by the parent component's state
    }, 300); // 300ms delay like ChartDisplay
    setAspectTooltipTimer(timer);
  };

  const handleAspectMouseLeave = () => {
    if (aspectTooltipTimer) {
      clearTimeout(aspectTooltipTimer);
      setAspectTooltipTimer(null);
    }
    // Hide tooltip after delay if not locked
    if (!aspectTooltipLocked && !generatingAspect) {
      const hideTimer = setTimeout(() => {
        setHoveredAspect(null);
        setClickedAspect?.(null);
      }, 2000); // 2 seconds delay for aspects
      setTooltipTimer(hideTimer);
    }
  };

  // =============================================================================
  // GENERATE ASPECT INTERPRETATION
  // =============================================================================

  const generateAspectInterpretation = async (planet1: string, planet2: string, aspectType: string, orb: number) => {
    if (!userId) {
      alert('Usuario no encontrado');
      return;
    }

    setGeneratingAspect(true);
    setIsGenerating(true); // ⭐ NUEVO: Para el modal
    setAspectTooltipLocked(true);
    setShowLongGeneratingMessage(false);

    // ⭐ Timer para mensaje largo
    const longGenerationTimer = setTimeout(() => {
      setShowLongGeneratingMessage(true);
    }, 5000); // Después de 5 segundos

    try {
      console.log(`🎯 Generating aspect: ${planet1} ${aspectType} ${planet2}`);

      const response = await fetch('/api/astrology/interpret-natal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planet1,
          planet2,
          aspectType,
          orb
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Aspect interpretation generated');

        // Get Firebase ID token for authentication
        const token = await user!.getIdToken();

        // Refresh interpretations
        const refreshResponse = await fetch(`/api/astrology/interpret-natal?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const refreshResult = await refreshResponse.json();

        if (refreshResult.success) {
          setNatalInterpretations(refreshResult.data);
          console.log('✅ Interpretations refreshed');

          // Open drawer immediately after generation
          const aspectKeyFull = `${planet1}-${planet2}-${aspectType}`;
          const aspectInterpretation = refreshResult.data?.aspects?.[aspectKeyFull];

          if (aspectInterpretation?.drawer && onOpenDrawer) {
            console.log('🎯 Opening drawer after generation for aspect:', aspectKeyFull);
            onOpenDrawer(aspectInterpretation.drawer);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error generating aspect:', error);
      alert('❌ Error generando interpretación');
    } finally {
      setGeneratingAspect(false);
      setIsGenerating(false); // ⭐ NUEVO: Para el modal
      setShowLongGeneratingMessage(false);
      clearTimeout(longGenerationTimer);
    }
  };

  // =============================================================================
  // 🪐 TOOLTIP FOR PLANET (WITH AI)
  // =============================================================================

  if ((hoveredPlanet || clickedPlanet) && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo') {
    const planetName = clickedPlanet || hoveredPlanet;
    const planet = planets.find(p => p.name === planetName);
    if (!planet) return null;

    const interpretationKey = `${planet.name}-${planet.sign}-${planet.house}`;
    let interpretation = null;

    // Check planets first, then asteroids (for Lilith, Chiron, etc.)
    if (natalInterpretations?.planets?.[interpretationKey]) {
      interpretation = natalInterpretations.planets[interpretationKey];
      console.log('✅ Using AI interpretation for planet', interpretationKey);
    } else if (natalInterpretations?.asteroids?.[interpretationKey]) {
      interpretation = natalInterpretations.asteroids[interpretationKey];
      console.log('✅ Using AI interpretation for asteroid', interpretationKey);
    } else {
      interpretation = getExampleInterpretation(interpretationKey);
      console.log('⚠️ Using fallback for', interpretationKey);
      console.log('   - Interpretation:', interpretation);
      console.log('   - Has drawer?', !!interpretation?.drawer);
      console.log('   - onOpenDrawer exists?', !!onOpenDrawer);
    }

    return (
      <div
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
        style={{
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
          transform: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'translate(-50%, -50%)'
            : (tooltipPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none')
        }}
        onMouseEnter={(e) => {
          console.log('🎯 MOUSE ENTERED TOOLTIP - PLANET');
          e.stopPropagation();
          handleTooltipMouseEnter();
        }}
          onMouseLeave={(e) => {
            console.log('🎯 MOUSE LEFT TOOLTIP - PLANET');

            // ⭐ NUEVO: Si está locked O generando, NO cerrar
            if (tooltipLocked || isGenerating) {
              console.log('🔒 Tooltip locked o generando - no se cierra');
              return;
            }

            handleMouseLeaveTooltip(() => {
              if (!drawerOpen) {
                setHoveredPlanet(null);
              }
            }, 1000); // 1 second for planets
          }}
        onClick={(e) => {
          console.log('🎯 TOOLTIP CLICKED (parent) - PLANET');
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span
              className="text-4xl mr-3"
              style={{ color: PLANET_COLORS[planet.name] || '#ffffff' }}
            >
              {PLANET_SYMBOLS[planet.name] || planet.name.charAt(0)}
            </span>
            <div>
            <div className="text-white font-bold text-lg">
              {PLANET_SYMBOLS[planet.name] || planet.name.charAt(0)} {typeof interpretation?.tooltip?.titulo === 'string' ? interpretation.tooltip.titulo : planet.name}
            </div>
              <div className="text-gray-200 text-sm">
                {planet.degree}° {planet.sign}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setHoveredPlanet(null);
              if (setClickedPlanet) setClickedPlanet(null);
              if (onCloseDrawer) onCloseDrawer();
              if (clickedTooltipTimer) {
                clearTimeout(clickedTooltipTimer);
                setClickedTooltipTimer(null);
              }
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-gray-300 text-sm mb-3">
          <strong style={{ color: PLANET_COLORS[planet.name] || '#ffffff', fontSize: '1.125rem' }}>
            {planet.name} en {planet.sign} en Casa {planet.house} ({planet.degree}°)
          </strong>
        </div>

        <div className="mb-3">
          <div className="text-white text-sm font-semibold mb-2">
            <span style={{ color: PLANET_COLORS[planet.name] || '#ffffff' }}>
              {PLANET_SYMBOLS[planet.name] || planet.name.charAt(0)}
            </span> Significado:
          </div>
          <div className="text-gray-200 text-sm leading-relaxed">
            {typeof interpretation?.tooltip?.significado === 'string' ? interpretation.tooltip.significado : getPersonalizedPlanetInterpretation(planet)}
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <div className="text-cyan-200 text-xs">
            <strong>Efecto:</strong> {typeof interpretation?.tooltip?.efecto === 'string' ? interpretation.tooltip.efecto : 'Influencia planetaria significativa'}
          </div>
          <div className="text-purple-200 text-xs">
            <strong>Tipo:</strong> {typeof interpretation?.tooltip?.tipo === 'string' ? interpretation.tooltip.tipo : 'Energía transformadora'}
          </div>
        </div>

        {planet.retrograde && (
          <div className="bg-red-400/20 rounded-lg p-2 mb-3">
            <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
            <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
          </div>
        )}

        {interpretation?.drawer && (
          <button
            onMouseDown={async (e) => {
              e.stopPropagation();
              e.preventDefault();

              const interpretationKey = `${planet.name}-${planet.sign}-${planet.house}`;
              const hasAI = natalInterpretations?.planets?.[interpretationKey];

              if (!hasAI && userId) {
                // ⭐ GENERAR PLANETA INDIVIDUAL
                setTooltipLocked(true);
                setGeneratingAspect(true);
                setIsGenerating(true); // ⭐ NUEVO: Para el modal

                // ⭐ AGREGAR: Timer para mensaje largo
                const longGenerationTimer = setTimeout(() => {
                  setShowLongGeneratingMessage(true);
                }, 5000); // Después de 5 segundos

                try {
                  console.log('🎯 Generando planeta individual:', planet.name);

                  // ⭐ Si es SR, buscar posición natal del mismo planeta
                  let natalPosition = undefined;
                  if (chartType === 'solar-return' && natalChart?.planets) {
                    const natalPlanet = natalChart.planets.find((p: any) => p.name === planet.name);
                    if (natalPlanet) {
                      natalPosition = {
                        sign: natalPlanet.sign,
                        house: natalPlanet.house
                      };
                      console.log(`  └─ Posición natal: ${natalPlanet.sign} Casa ${natalPlanet.house}`);
                    }
                  }

                  // ⭐ LLAMAR AL NUEVO ENDPOINT
                  const response = await fetch('/api/astrology/interpret-planet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId,
                      planetName: planet.name,
                      sign: planet.sign,
                      house: planet.house,
                      degree: planet.degree,
                      chartType,  // ⭐ Incluye chartType
                      year: solarReturnYear,
                      natalPosition // ⭐ Posición natal para conectar
                    })
                  });

                  const result = await response.json();

                  if (result.success) {
                    console.log('✅ Planeta generado:', planet.name);

                    // Get Firebase ID token for authentication
                    const token = await user!.getIdToken();

                    // Refrescar interpretaciones
                    const refreshResponse = await fetch(`/api/astrology/interpret-natal?userId=${userId}`, {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    const refreshResult = await refreshResponse.json();

                    // ⭐ DEBUGGING: Ver qué devuelve la API
                    console.log('📦 Refresh result completo:', refreshResult);
                    console.log('📦 refreshResult.success:', refreshResult.success);
                    console.log('📦 refreshResult.data:', refreshResult.data);
                    console.log('📦 refreshResult.data?.planets:', refreshResult.data?.planets);

                    if (refreshResult.success) {
                      console.log('🔄 Actualizando estado con:', refreshResult.data);
                      setNatalInterpretations(refreshResult.data);

                      const newKey = `${planet.name}-${planet.sign}-${planet.house}`;
                      console.log('🔍 Buscando interpretación con key:', newKey);

                      // ⭐ CRÍTICO: Buscar en refreshResult.data (NO en estado)
                      let newInterpretation =
                        refreshResult.data?.planets?.[newKey] ||
                        refreshResult.data?.asteroids?.[newKey] ||
                        refreshResult.data?.nodes?.[newKey];

                      console.log('📖 Interpretación encontrada:', !!newInterpretation);

                      if (newInterpretation?.drawer && onOpenDrawer) {
                        console.log('✅ Abriendo drawer para:', planet.name);
                        onOpenDrawer(newInterpretation.drawer);
                      } else {
                        console.error('❌ No se encontró interpretación para:', newKey);
                        console.error('   - Secciones disponibles:', Object.keys(refreshResult.data || {}));
                        console.error('   - Nodes keys:', Object.keys(refreshResult.data?.nodes || {}));
                        console.error('   - Asteroids keys:', Object.keys(refreshResult.data?.asteroids || {}));
                      }
                    } else {
                      console.error('❌ Refresh failed:', refreshResult);
                    }
                  } else {
                    throw new Error(result.error || 'Error generando interpretación');
                  }
                } catch (error) {
                  console.error('❌ Error:', error);
                  alert('Error generando interpretación: ' + (error as Error).message);
                } finally {
                  setGeneratingAspect(false);
                  setIsGenerating(false); // ⭐ NUEVO: Para el modal
                  setShowLongGeneratingMessage(false);
                }
                clearTimeout(longGenerationTimer); // ⭐ Limpiar timer después del finally
                return;
              }

              // Si ya tiene AI, abrir drawer
              setTooltipLocked(true);
              if (onOpenDrawer && interpretation?.drawer) {
                onOpenDrawer(interpretation.drawer);
              }
            }}
            disabled={generatingAspect}
            style={{
              pointerEvents: 'auto',
              zIndex: 9999999,
              cursor: 'pointer'
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingAspect ? (
              <>
                <div className="animate-spin">⏳</div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                {(natalInterpretations?.planets?.[`${planet.name}-${planet.sign}-${planet.house}`] || natalInterpretations?.asteroids?.[`${planet.name}-${planet.sign}-${planet.house}`]) ? (
                  <>
                    <span>📖 Ver interpretación completa</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                ) : (
                  <>
                    <span>✨ Generar Interpretación IA</span>
                  </>
                )}
              </>
            )}
          </button>
        )}

        {!interpretation?.drawer && (
          <div className="text-center text-xs text-gray-400 py-2">
            💡 Haz hover más tiempo para ver la interpretación
          </div>
        )}
      </div>
    );
  }

  // =============================================================================
  // 🌅 TOOLTIP FOR ASCENDANT
  // =============================================================================

  if (hoveredPlanet === 'Ascendente' && ascendant) {
    let interpretation = null;

    if (natalInterpretations?.angles?.Ascendente) {
      interpretation = natalInterpretations.angles.Ascendente;
    }

    return (
      <div
        className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
        style={{
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
          transform: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'translate(-50%, -50%)'
            : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
        }}
        onMouseEnter={(e) => {
          console.log('🎯 MOUSE ENTERED TOOLTIP - ASCENDANT');
          e.stopPropagation();
          handleTooltipMouseEnter();
        }}
        onMouseLeave={(e) => {
          console.log('🎯 MOUSE LEFT TOOLTIP - ASCENDANT');
          // ⭐ NUEVO: Si está locked, NO cerrar
          if (tooltipLocked) {
            return;
          }
          // Add a small delay to allow drawer state to update
          setTimeout(() => {
            // Don't close tooltip immediately if mouse is over a button
            const target = e.relatedTarget as HTMLElement;
            const isButton = target && typeof target.closest === 'function' ? target.closest('button') : null;
            if (!isButton && !drawerOpen) {
              setHoveredPlanet(null);
            }
          }, 100); // 100ms delay to allow drawer state update
        }}
        onClick={(e) => {
          console.log('🎯 TOOLTIP CLICKED (parent) - ASCENDANT');
          e.stopPropagation();
        }}
      >
        {/* ✅ NUEVO: Botón de cierre */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHoveredPlanet(null);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5,12 12,5 19,12"/>
          </svg>
          <div>
            <div className="text-white font-bold text-lg">
              {typeof interpretation?.tooltip?.titulo === 'string' ? interpretation.tooltip.titulo : 'Ascendente'}
            </div>
            <div className="text-gray-200 text-sm">
              {ascendant.degree}° {ascendant.sign}
            </div>
          </div>
        </div>

        <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          {typeof interpretation?.tooltip?.significado === 'string' ? interpretation.tooltip.significado :
            `Tu máscara social, cómo te presentas al mundo y tu apariencia física.`}
        </div>

        <div className="space-y-1 mb-3">
          <div className="text-cyan-200 text-xs">
            <strong>Efecto:</strong> {typeof interpretation?.tooltip?.efecto === 'string' ? interpretation.tooltip.efecto : 'Influencia angular significativa'}
          </div>
          <div className="text-purple-200 text-xs">
            <strong>Tipo:</strong> {typeof interpretation?.tooltip?.tipo === 'string' ? interpretation.tooltip.tipo : 'Energía directiva'}
          </div>
        </div>

        {interpretation?.drawer && (
          <button
            onMouseDown={(e) => {
              console.log('═══════════════════════════════════');
              console.log('🎯 ABRIENDO DRAWER CON MOUSEDOWN - ASCENDANT');
              console.log('1. onOpenDrawer exists?', !!onOpenDrawer);
              console.log('2. interpretation.drawer:', interpretation.drawer);
              console.log('3. interpretation.drawer.titulo:', interpretation?.drawer?.titulo);
              console.log('═══════════════════════════════════');

              e.stopPropagation();
              e.preventDefault();

              if (!onOpenDrawer) {
                console.error('❌ onOpenDrawer is undefined');
                return;
              }

              if (!interpretation?.drawer) {
                console.error('❌ interpretation.drawer is undefined');
                return;
              }

              try {
                console.log('✅ Calling onOpenDrawer...');
                onOpenDrawer(interpretation.drawer);
                console.log('✅ onOpenDrawer called successfully');
              } catch (error) {
                console.error('❌ Error calling onOpenDrawer:', error);
              }
            }}
            style={{
              pointerEvents: 'auto',
              zIndex: 9999999,
              cursor: 'pointer'
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            📖 Ver interpretación completa
          </button>
        )}
      </div>
    );
  }

  // =============================================================================
  // 🎯 TOOLTIP FOR MIDHEAVEN
  // =============================================================================

  if (hoveredPlanet === 'Medio Cielo' && midheaven) {
    let interpretation = null;

    if (natalInterpretations?.angles?.MedioCielo) {
      interpretation = natalInterpretations.angles.MedioCielo;
    }

    return (
      <div
        className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
        style={{
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
          transform: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'translate(-50%, -50%)'
            : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
        }}
        onMouseEnter={(e) => {
          console.log('🎯 MOUSE ENTERED TOOLTIP - MIDHEAVEN');
          e.stopPropagation();
          handleTooltipMouseEnter();
        }}
        onMouseLeave={(e) => {
          console.log('🎯 MOUSE LEFT TOOLTIP - MIDHEAVEN');
          // ⭐ NUEVO: Si está locked, NO cerrar
          if (tooltipLocked) {
            return;
          }
          // Don't close tooltip if drawer is open - tooltip should stay visible with drawer
          if (!drawerOpen) {
            // Don't close tooltip immediately if mouse is over a button
            const target = e.relatedTarget as HTMLElement;
            const isButton = target && typeof target.closest === 'function' ? target.closest('button') : null;
            if (!isButton) {
              setHoveredPlanet(null);
            }
          }
        }}
        onClick={(e) => {
          console.log('🎯 TOOLTIP CLICKED (parent) - MIDHEAVEN');
          e.stopPropagation();
        }}
      >
        <div className="flex items-center mb-3">
          <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 L12 12 L8 8 M12 12 L16 8" />
            <circle cx="12" cy="18" r="4" />
          </svg>
          <div>
            <div className="text-white font-bold text-lg">
              {typeof interpretation?.tooltip?.titulo === 'string' ? interpretation.tooltip.titulo : 'Medio Cielo'}
            </div>
            <div className="text-gray-200 text-sm">
              {midheaven.degree}° {midheaven.sign}
            </div>
          </div>
        </div>
        
        <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
        <div className="text-gray-200 text-xs mb-2">
          {typeof interpretation?.tooltip?.significado === 'string' ? interpretation.tooltip.significado :
            `Tu vocación, imagen pública y dirección profesional.`}
        </div>

        <div className="space-y-1 mb-3">
          <div className="text-cyan-200 text-xs">
            <strong>Efecto:</strong> {typeof interpretation?.tooltip?.efecto === 'string' ? interpretation.tooltip.efecto : 'Influencia angular significativa'}
          </div>
          <div className="text-purple-200 text-xs">
            <strong>Tipo:</strong> {typeof interpretation?.tooltip?.tipo === 'string' ? interpretation.tooltip.tipo : 'Energía directiva'}
          </div>
        </div>

        {interpretation?.drawer && (
          <button
            onMouseDown={(e) => {
              console.log('═══════════════════════════════════');
              console.log('🎯 ABRIENDO DRAWER CON MOUSEDOWN - MIDHEAVEN');
              console.log('1. onOpenDrawer exists?', !!onOpenDrawer);
              console.log('2. interpretation.drawer:', interpretation.drawer);
              console.log('3. interpretation.drawer.titulo:', interpretation?.drawer?.titulo);
              console.log('═══════════════════════════════════');

              e.stopPropagation();
              e.preventDefault();

              if (!onOpenDrawer) {
                console.error('❌ onOpenDrawer is undefined');
                return;
              }

              if (!interpretation?.drawer) {
                console.error('❌ interpretation.drawer is undefined');
                return;
              }

              try {
                // ⭐ NUEVO: Marcar tooltip como "locked" para que NO se cierre
                setTooltipLocked(true);

                console.log('✅ Calling onOpenDrawer...');
                onOpenDrawer(interpretation.drawer);
                console.log('✅ onOpenDrawer called successfully');
              } catch (error) {
                console.error('❌ Error calling onOpenDrawer:', error);
              }
            }}
            style={{
              pointerEvents: 'auto',
              zIndex: 9999999,
              cursor: 'pointer'
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            📖 Ver interpretación completa
          </button>
        )}
      </div>
    );
  }

  // =============================================================================
  // ⚡ TOOLTIP FOR ASPECT (WITH LONGER DELAY - 2 SECONDS!)
  // =============================================================================

  if ((hoveredAspect || clickedAspect) && calculatedAspects.length > 0) {
    const aspectKey = clickedAspect || hoveredAspect;
    const currentAspect = calculatedAspects.find((aspect: Aspect & { config: { color: string; difficulty: string; name: string; angle: number; orb: number }; exact: boolean }) =>
      `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === aspectKey
    );

    if (!currentAspect) return null;

    const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
    const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';

    const aspectKeyFull = `${currentAspect.planet1}-${currentAspect.planet2}-${currentAspect.type}`;
    const hasAIInterpretation = natalInterpretations?.aspects && natalInterpretations.aspects[aspectKeyFull] ? true : false;

    return (
      <div
        className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-lg md:max-w-xl overflow-y-auto pointer-events-auto z-50"
        style={{
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x,
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y,
          transform: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'translate(-50%, -50%)'
            : (tooltipPosition.x > window.innerWidth - 450 ? 'translateX(-100%)' : 'none')
        }}
        onMouseEnter={(e) => {
          console.log('🎯 MOUSE ENTERED TOOLTIP - ASPECT');
          e.stopPropagation();
          handleAspectMouseEnter();
          setAspectTooltipLocked(true);
        }}
        onMouseLeave={(e) => {
          console.log('🎯 MOUSE LEFT TOOLTIP - ASPECT');

          // ⭐ Si está locked O generando, NO cerrar
          if (tooltipLocked || isGenerating) {
            console.log('🔒 Tooltip locked o generando - no se cierra');
            return;
          }

          // Comportamiento consistente: cerrar después de delay
          handleMouseLeaveTooltip(() => {
            setHoveredAspect(null);
          }, 2000); // 2 seconds for aspects
        }}
        onClick={(e) => {
          console.log('🎯 TOOLTIP CLICKED (parent) - ASPECT');
          e.stopPropagation();
        }}
      >
        {/* ✅ NUEVO: Botón de cierre */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHoveredAspect(null);
            setClickedAspect?.(null);
            setAspectTooltipLocked(false);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-1">
            <div
              className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
              style={{ backgroundColor: currentAspect.config.color }}
            ></div>
            <div>
              <div className="text-white font-bold text-lg">{currentAspect.config.name}</div>
              <div className="text-gray-200 text-sm">
                entre {currentAspect.planet1} y {currentAspect.planet2}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/10">
          <div className="text-blue-300 text-xs mb-1">
            <strong>Ángulo:</strong> {currentAspect.config.angle}°
          </div>
          <div className="text-blue-300 text-xs mb-1">
            <strong>Orbe:</strong> {currentAspect.orb.toFixed(2)}° (máx ±{currentAspect.config.orb}°)
          </div>
          <div className="text-yellow-300 text-xs font-semibold">
            {currentAspect.exact ? '⭐ EXACTO' : `Orbe: ${currentAspect.orb.toFixed(2)}°`}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
          <div className="text-gray-200 text-xs mb-2">
            {getPersonalizedAspectInterpretation(currentAspect)}
          </div>
          <div className="text-gray-300 text-xs mb-1">
            <strong>Efecto:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.effect}
          </div>
          <div className="text-gray-300 text-xs">
            <strong>Tipo:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.type}
          </div>
        </div>
        
        {currentAspect.exact && (
          <div className="mb-3 p-2 bg-yellow-400/20 border border-yellow-400/40 rounded">
            <div className="text-yellow-200 text-xs font-bold mb-1">⭐ Aspecto Exacto</div>
            <div className="text-yellow-100 text-xs leading-relaxed">
              <strong>Máxima potencia</strong> (orbe &lt; 1°). Influencia muy poderosa.
            </div>
          </div>
        )}

        {/* Generate AI interpretation button */}
        {!hasAIInterpretation && userId && (
          <div className="space-y-2">
            <button
              onMouseDown={async (e) => {
                console.log('═══════════════════════════════════');
                console.log('🎯 GENERANDO ASPECTO - MOUSEDOWN');
                console.log('═══════════════════════════════════');

                e.stopPropagation();
                e.preventDefault();

                // ⭐ CRÍTICO: Marcar tooltip como "locked" INMEDIATAMENTE
                setTooltipLocked(true);
                setAspectTooltipLocked(true);

                console.log('🔒 Tooltip locked - permanecerá abierto durante generación');

                // ⭐ AGREGAR: Timer para mensaje largo
                const longGenerationTimer = setTimeout(() => {
                  setShowLongGeneratingMessage(true);
                }, 5000); // Después de 5 segundos

                try {
                  await generateAspectInterpretation(
                    currentAspect.planet1,
                    currentAspect.planet2,
                    currentAspect.type,
                    currentAspect.orb
                  );
                } finally {
                  clearTimeout(longGenerationTimer); // ⭐ Limpiar timer
                  setShowLongGeneratingMessage(false);
                }
              }}
              disabled={generatingAspect}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generatingAspect ? (
                <>
                  <div className="animate-spin">⏳</div>
                  <span>Generando interpretación...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generar Interpretación IA</span>
                </>
              )}
            </button>

            {/* Show message when generation takes too long */}
            {showLongGeneratingMessage && (
              <div className="text-center text-yellow-300 text-xs bg-yellow-500/20 rounded-lg p-2 border border-yellow-500/30">
                <div className="font-semibold">⏳ Calculando interpretación...</div>
                <div className="text-yellow-200">Esto puede tomar unos momentos. ¡Gracias por tu paciencia!</div>
              </div>
            )}
          </div>
        )}

        {/* Show full interpretation if available */}
        {hasAIInterpretation && (
          <button
            onMouseDown={(e) => {
              console.log('═══════════════════════════════════');
              console.log('🎯 ABRIENDO DRAWER CON MOUSEDOWN - ASPECT');
              console.log('1. onOpenDrawer exists?', !!onOpenDrawer);
              console.log('2. aspectKeyFull:', aspectKeyFull);
              console.log('3. drawer content:', natalInterpretations?.aspects?.[aspectKeyFull]?.drawer);
              console.log('═══════════════════════════════════');

              e.stopPropagation();
              e.preventDefault();

              if (!onOpenDrawer) {
                console.error('❌ onOpenDrawer is undefined');
                return;
              }

              const aspectInterpretation = natalInterpretations?.aspects?.[aspectKeyFull];
              if (!aspectInterpretation) {
                console.error('❌ aspectInterpretation is undefined');
                return;
              }

              if (!aspectInterpretation.drawer) {
                console.error('❌ aspectInterpretation.drawer is undefined');
                return;
              }

              try {
                // ⭐ NUEVO: Marcar tooltip como "locked" para que NO se cierre
                setTooltipLocked(true);

                console.log('✅ Calling onOpenDrawer...');
                onOpenDrawer(aspectInterpretation.drawer);
                console.log('✅ onOpenDrawer called successfully');
              } catch (error) {
                console.error('❌ Error calling onOpenDrawer:', error);
              }
            }}
            style={{
              pointerEvents: 'auto',
              zIndex: 9999999,
              cursor: 'pointer'
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg"
          >
            <span>📖</span>
            <span>Ver interpretación completa</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {/* Tooltip stays visible hint */}
        <div className="mt-2 text-center text-xs text-gray-400">
          💡 Tooltip permanece 2 segundos después de salir
        </div>
      </div>
    );
  }

  // =============================================================================
  // 🏠 TOOLTIP FOR HOUSE
  // =============================================================================

  if (hoveredHouse) {
    return (
      <div
        className="chart-tooltip fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
        style={{
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
          transform: typeof window !== 'undefined' && window.innerWidth < 768
            ? 'translate(-50%, -50%)'
            : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
        }}
      >
        {/* ✅ NUEVO: Botón de cierre */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHoveredHouse(null);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-start mb-3">
          <span className="text-3xl mr-3">🏠</span>
          <div>
            <div className="text-white font-bold text-lg">
              {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.name}
            </div>
            <div className="text-gray-200 text-sm mb-2">
              {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.meaning}
            </div>
            <div className="text-gray-300 text-xs">
              <strong>Temas:</strong> {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.keywords}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // 🎯 TOOLTIP FOR CARDS
  // =============================================================================

  if (hoveredCard) {
    if (hoveredCard === 'birth-data') {
      return (
        <div
          className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
          style={{
            left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
            transform: typeof window !== 'undefined' && window.innerWidth < 768
              ? 'translate(-50%, -50%)'
              : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
          }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={() => {
          // Don't close tooltip if drawer is open - tooltip should stay visible with drawer
          if (!drawerOpen) {
            handleMouseLeaveTooltip(() => { setHoveredCard?.(null); }, 2000);
          }
        }}
        >
          <div className="flex items-center mb-3">
            <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <div className="text-white font-bold text-lg">Tu Momento Cósmico</div>
              <div className="text-gray-200 text-sm">Datos de nacimiento y precisión</div>
            </div>
          </div>

          <div className="text-gray-200 text-sm leading-relaxed mb-3">
            <strong>🌟 Significado:</strong> Esta información representa el momento exacto en que entraste al mundo físico.
            Tu carta natal se calcula basándose en estos datos precisos, que determinan la posición de todos los planetas
            en el momento de tu nacimiento.
          </div>

          <div className="space-y-2 mb-3">
            <div className="text-cyan-200 text-xs">
              <strong>Fecha:</strong> Define el ciclo solar en el que naces
            </div>
            <div className="text-cyan-200 text-xs">
              <strong>Hora:</strong> Determina la posición de la Luna y Ascendente
            </div>
            <div className="text-cyan-200 text-xs">
              <strong>Lugar:</strong> Establece las casas astrológicas y coordenadas
            </div>
          </div>

          <div className="bg-green-400/20 rounded-lg p-2 border border-green-400/30">
            <div className="text-green-200 text-xs text-center">
              💫 <strong>Precisión garantizada</strong> - Datos verificados para máxima exactitud
            </div>
          </div>
        </div>
      );
    }

    if (hoveredCard === 'angles') {
      // Calculate dominant element and modality for personalized analysis
      const elementEntries = Object.entries(elementDistribution || {});
      const modalityEntries = Object.entries(modalityDistribution || {});

      const dominantElement = elementEntries.reduce((max, [key, value]) =>
        (value as number) > (max.value as number) ? { key, value: value as number } : max,
        { key: '', value: 0 }
      );

      const dominantModality = modalityEntries.reduce((max, [key, value]) =>
        (value as number) > (max.value as number) ? { key, value: value as number } : max,
        { key: '', value: 0 }
      );

      const ascSign = ascendant?.sign || 'Desconocido';
      const mcSign = midheaven?.sign || 'Desconocido';

      return (
        <div
          className="fixed bg-gradient-to-r from-indigo-500/95 to-purple-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
          style={{
            left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
            transform: typeof window !== 'undefined' && window.innerWidth < 768
              ? 'translate(-50%, -50%)'
              : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
          }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={() => {
          // Don't close tooltip if drawer is open - tooltip should stay visible with drawer
          if (!drawerOpen) {
            handleMouseLeaveTooltip(() => setHoveredCard?.(null), 2000);
          }
        }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">⚡</span>
            <div>
              <div className="text-white font-bold text-lg">Tu Perfil de Ángulos Personales</div>
              <div className="text-gray-200 text-sm">{ascSign} ↑ • {mcSign} MC</div>
            </div>
          </div>

          <div className="text-gray-200 text-sm leading-relaxed mb-3">
            <strong>🌟 Análisis Personal:</strong> Tu combinación única de {ascSign} en el Ascendente y {mcSign} en el Medio Cielo
            crea un perfil energético distintivo que solo tú posees en el universo.
          </div>

          {/* Ascendant Analysis */}
          <div className="bg-indigo-800/30 rounded-lg p-3 mb-3 border border-indigo-400/20">
            <div className="flex items-center mb-2">
              <span className="text-indigo-300 text-sm font-semibold">↑ Ascendente en {ascSign}</span>
            </div>
            <div className="text-indigo-200 text-xs leading-relaxed">
              {ascSign === 'Acuario' && 'Tu apariencia es innovadora y futurista. Te presentas al mundo como alguien independiente, intelectual y humanitario. Los demás te perciben como original y un poco distante.'}
              {ascSign === 'Escorpio' && 'Tu presencia es intensa y magnética. Irradias poder y misterio. Los demás sienten tu profundidad emocional y tu capacidad de transformación.'}
              {ascSign === 'Aries' && 'Eres directo, valiente y competitivo. Tu energía es pura acción - entras a los espacios con confianza y determinación.'}
              {ascSign === 'Tauro' && 'Transmites estabilidad y sensualidad. Tu presencia es grounding, confiable y persistentemente atractiva.'}
              {ascSign === 'Géminis' && 'Eres comunicativo, curioso y adaptable. Tu mente rápida y tu capacidad de conectar ideas te hace fascinante.'}
              {ascSign === 'Cáncer' && 'Irradias calidez emocional y protección. Eres intuitivo y nurturing, creando espacios seguros para los demás.'}
              {ascSign === 'Leo' && 'Tu carisma es natural y dramático. Lideras con corazón, creatividad y un sentido innato de espectáculo.'}
              {ascSign === 'Virgo' && 'Eres preciso, servicial y analítico. Tu atención al detalle y tu ética de trabajo son admirables.'}
              {ascSign === 'Libra' && 'Eres diplomático, armonioso y estéticamente consciente. Creas belleza y equilibrio dondequiera que vayas.'}
              {ascSign === 'Sagitario' && 'Eres aventurero, filosófico y expansivo. Tu visión amplia y tu optimismo inspiran a los demás.'}
              {ascSign === 'Capricornio' && 'Transmites autoridad, ambición y estabilidad. Eres el epítome de la responsabilidad y el logro.'}
              {ascSign === 'Piscis' && 'Eres compasivo, artístico y espiritual. Tu sensibilidad y empatía crean conexiones profundas.'}
            </div>
          </div>

          {/* Midheaven Analysis */}
          <div className="bg-purple-800/30 rounded-lg p-3 mb-3 border border-purple-400/20">
            <div className="flex items-center mb-2">
              <span className="text-purple-300 text-sm font-semibold">⬆ Medio Cielo en {mcSign}</span>
            </div>
            <div className="text-purple-200 text-xs leading-relaxed">
              {mcSign === 'Acuario' && 'Tu vocación involucra innovación, comunidad y pensamiento progresivo. Tu carrera ideal sirve a la humanidad y desafía el status quo.'}
              {mcSign === 'Escorpio' && 'Estás destinado a profundos procesos de transformación. Tu carrera involucra poder, investigación, sanación o finanzas profundas.'}
              {mcSign === 'Aries' && 'Tu propósito es liderar con valentía y acción decisiva. Eres un pionero natural en tu campo elegido.'}
              {mcSign === 'Tauro' && 'Tu camino profesional valora la estabilidad, la belleza y los recursos tangibles. Construyes imperios duraderos.'}
              {mcSign === 'Géminis' && 'Tu vocación requiere comunicación, aprendizaje continuo y versatilidad mental. Eres el mensajero perfecto.'}
              {mcSign === 'Cáncer' && 'Estás llamado a cuidar, nutrir y crear entornos emocionales seguros. Tu carrera tiene un componente maternal.'}
              {mcSign === 'Leo' && 'Tu destino es liderar con corazón, creatividad y carisma. Estás hecho para el escenario o posiciones de autoridad.'}
              {mcSign === 'Virgo' && 'Tu propósito es servir con precisión, análisis y mejora continua. Eres el artesano maestro de tu oficio.'}
              {mcSign === 'Libra' && 'Tu vocación armoniza relaciones, justicia y estética. Creas equilibrio en sistemas sociales o artísticos.'}
              {mcSign === 'Sagitario' && 'Estás destinado a expandir horizontes a través del conocimiento, viajes o filosofía. Eres el explorador eterno.'}
              {mcSign === 'Capricornio' && 'Tu camino es construir estructuras duraderas y lograr posiciones de autoridad. Eres el arquitecto del éxito.'}
              {mcSign === 'Piscis' && 'Tu vocación sirve a través de la compasión, el arte o la espiritualidad. Conectas con lo divino en tu trabajo.'}
            </div>
          </div>

          {/* Unique Combination Conclusion */}
          <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-lg p-3 border border-indigo-400/30">
            <div className="text-indigo-200 text-xs text-center font-semibold mb-2">
              🎯 Tu Configuración Única: {ascSign} + {mcSign}
            </div>
            <div className="text-indigo-100 text-xs leading-relaxed">
              Esta poderosa combinación fusiona la energía de presentación de {ascSign.toLowerCase()} con la dirección profesional de {mcSign.toLowerCase()}.
              Creas un puente único entre cómo te muestras al mundo y hacia dónde te diriges, generando un perfil de liderazgo
              que combina {dominantElement.key ? `${dominantElement.key} (${dominantElement.value}%)` : 'tu energía elemental'} con estilo {dominantModality.key ? `${dominantModality.key} (${dominantModality.value}%)` : 'modal'}.
              Esta configuración crea un perfil energético que solo tú posees en el universo.
            </div>
          </div>
        </div>
      );
    }

    if (hoveredCard === 'distributions') {
      // Calculate dominant element and modality
      const elementEntries = Object.entries(elementDistribution || {});
      const modalityEntries = Object.entries(modalityDistribution || {});

      const dominantElement = elementEntries.reduce((max, [key, value]) =>
        (value as number) > (max.value as number) ? { key, value: value as number } : max,
        { key: '', value: 0 }
      );

      const dominantModality = modalityEntries.reduce((max, [key, value]) =>
        (value as number) > (max.value as number) ? { key, value: value as number } : max,
        { key: '', value: 0 }
      );

      const ascSign = ascendant?.sign || 'Desconocido';
      const mcSign = midheaven?.sign || 'Desconocido';

      return (
        <div
          className="fixed bg-gradient-to-r from-orange-500/95 to-red-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md overflow-y-auto pointer-events-auto z-50"
          style={{
            left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
            transform: typeof window !== 'undefined' && window.innerWidth < 768
              ? 'translate(-50%, -50%)'
              : (tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none')
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={() => {
            // Don't close tooltip if drawer is open - tooltip should stay visible with drawer
            if (!drawerOpen) {
              handleTooltipMouseLeave('house');
            }
          }}
        >
          {/* ✅ NUEVO: Botón de cierre */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHoveredCard?.(null);
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">🔥</span>
            <div>
              <div className="text-white font-bold text-lg">Tu Perfil Energético Único</div>
              <div className="text-gray-200 text-sm">{dominantElement.key} • {dominantModality.key}</div>
            </div>
          </div>

          <div className="text-gray-200 text-sm leading-relaxed mb-3">
            <strong>🌟 Análisis Personal:</strong> Tu distribución energética revela el equilibrio único de fuerzas
            que te hacen ser quien eres. Esta combinación específica de elementos y modalidades crea un patrón
            que solo tú posees en el universo.
          </div>

          {/* Dominant Element Analysis */}
          <div className="bg-orange-800/30 rounded-lg p-3 mb-3 border border-orange-400/20">
            <div className="flex items-center mb-2">
              <span className="text-orange-300 text-lg font-semibold">⚡ Dominante: {dominantElement.key} ({dominantElement.value}%)</span>
            </div>
            <div className="text-orange-200 text-xs leading-relaxed">
              {dominantElement.key === 'Aire' && 'Tu energía es intelectual, comunicativa y adaptable. Te expresas con claridad y visión amplia. Tu mente es tu superpoder - procesas información rápidamente y conectas ideas de manera innovadora.'}
              {dominantElement.key === 'Agua' && 'Tu energía es emocional, intuitiva y profunda. Sientes las corrientes invisibles de la vida. Tu intuición es tu guía, creando conexiones emocionales profundas con el mundo.'}
              {dominantElement.key === 'Fuego' && 'Tu energía es apasionada, creativa y dinámica. Irradias calidez y entusiasmo. Tu capacidad de inspirar acción y liderar con corazón es tu don natural.'}
              {dominantElement.key === 'Tierra' && 'Tu energía es práctica, estable y grounded. Construyes con paciencia y determinación. Tu capacidad de manifestar sueños en la realidad es extraordinaria.'}
            </div>
          </div>

          {/* Dominant Modality Analysis */}
          <div className="bg-red-800/30 rounded-lg p-3 mb-3 border border-red-400/20">
            <div className="flex items-center mb-2">
              <span className="text-red-300 text-lg font-semibold">🎯 Estilo: {dominantModality.key} ({dominantModality.value}%)</span>
            </div>
            <div className="text-red-200 text-xs leading-relaxed">
              {dominantModality.key === 'Cardinal' && 'Inicias proyectos con energía decisiva. Tu superpoder es comenzar revoluciones y liderar cambios. Eres el catalizador que transforma ideas en acción.'}
              {dominantModality.key === 'Fijo' && 'Perseveras con determinación inquebrantable. Tu superpoder es profundizar y estabilizar. Construyes imperios duraderos con tu enfoque constante.'}
              {dominantModality.key === 'Mutable' && 'Te adaptas con gracia infinita. Tu superpoder es conectar y transformar. Navegas los cambios con facilidad, siendo el puente entre mundos.'}
            </div>
          </div>

          {/* Unique Profile Conclusion */}
          <div className="bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-lg p-3 border border-orange-400/30">
            <div className="text-orange-200 text-xs text-center font-semibold mb-2">
              ✨ Tu Configuración Única: {ascSign} + {mcSign} + {dominantElement.key} + {dominantModality.key}
            </div>
            <div className="text-orange-100 text-xs leading-relaxed">
              "Tu configuración única combina {ascSign} en el Ascendente, {mcSign} en el Medio Cielo, dominancia de {dominantElement.key} y estilo {dominantModality.key}.
              Esta combinación crea un perfil energético que solo tú posees en el universo."
            </div>
          </div>
        </div>
      );
    }

    if (hoveredCard === 'solar-return') {
      return (
        <div
          className="fixed bg-gradient-to-r from-rose-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl w-[90vw] md:w-auto max-w-sm md:max-w-md pointer-events-auto z-50"
          style={{
            left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.x + 25,
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : tooltipPosition.y - 50,
            transform: typeof window !== 'undefined' && window.innerWidth < 768
              ? 'translate(-50%, -50%)'
              : (tooltipPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none')
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={() => {
            // Don't close tooltip if drawer is open - tooltip should stay visible with drawer
            if (!drawerOpen) {
              handleMouseLeaveTooltip(() => setHoveredCard?.(null), 2000);
            }
          }}
        >
          {/* ✅ NUEVO: Botón de cierre */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHoveredCard?.(null);
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">✨</span>
            <div>
              <div className="text-white font-bold text-lg">Solar Return {solarReturnYear}</div>
              <div className="text-gray-200 text-sm">Ciclo anual personalizado</div>
            </div>
          </div>

          <div className="text-gray-200 text-sm leading-relaxed mb-3">
            <strong>🌟 Significado:</strong> Tu Solar Return marca el inicio de un nuevo ciclo solar personal.
            Es como "cumpleaños cósmico" donde el Sol regresa a su posición natal, activando nuevas energías
            y oportunidades para el año que comienza.
          </div>

          <div className="space-y-2 mb-3">
            <div className="text-cyan-200 text-xs">
              <strong>Ciclo Anual:</strong> De cumpleaños a cumpleaños, un año de transformación
            </div>
            <div className="text-cyan-200 text-xs">
              <strong>Lugar del SR:</strong> Las coordenadas donde se activa este ciclo
            </div>
            <div className="text-cyan-200 text-xs">
              <strong>Tema Central:</strong> La energía dominante del año
            </div>
          </div>

          <div className="bg-rose-400/20 rounded-lg p-2 border border-rose-400/30">
            <div className="text-rose-200 text-xs text-center">
              🎂 <strong>Año de oportunidades</strong> - Tu ciclo personal de crecimiento
            </div>
          </div>

          <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded">
            ⏱️ 2s delay
          </div>
        </div>
      );
    }
  }

  // =============================================================================
  // ⭐ MODAL DE GENERACIÓN - ANTES DEL RETURN NULL FINAL
  // =============================================================================

  if (isGenerating) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200000] flex items-center justify-center"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl max-w-md mx-4 border-2 border-white/20">
          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-white/30 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-white text-2xl font-bold text-center mb-4">
            Generando Interpretación
          </h3>

          {/* Mensaje */}
          <div className="text-white/90 text-center space-y-2 mb-6">
            <p className="text-lg">Analizando tu configuración astrológica...</p>
            <p className="text-sm text-white/70">Esto puede tomar 5-40 segundos</p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-4">
            <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>

          {/* Mensaje si tarda mucho */}
          {showLongGeneratingMessage && (
            <div className="text-center text-yellow-200 text-sm bg-yellow-500/20 rounded-lg p-3 border border-yellow-400/30 animate-pulse">
              <div className="font-semibold">⏳ Calculando interpretación profunda...</div>
              <div className="text-yellow-100 text-xs mt-1">
                ¡Gracias por tu paciencia! Estamos creando algo único para ti.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ChartTooltipsComponent;
