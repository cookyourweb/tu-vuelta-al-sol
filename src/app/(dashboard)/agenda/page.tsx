//src/app/(dashboard)/agenda/page.tsx - NUEVO UX DISRUPTIVO CON CARGA LAZY
'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Home, Sparkles, Sun, BookOpen, Star } from 'lucide-react';
import type { UserProfile, AstrologicalEvent, EventType } from '@/types/astrology/unified-types';

import EventsLoadingModal from '@/components/astrology/EventsLoadingModal';
import EventInterpretationButton from '@/components/agenda/EventInterpretationButton';
import PlanetarySection from '@/components/agenda/PlanetarySection';
import { AgendaLibro } from '@/components/agenda/AgendaLibro';
import { StyleProvider } from '@/context/StyleContext';
import { mapAstrologicalEventToEventData } from '@/utils/eventMapping';

interface AstronomicalDay {
  date: Date;
  events: AstrologicalEvent[];
  isCurrentMonth: boolean;
  hasEvents: boolean;
}

const AgendaPersonalizada = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Inicializar con fecha actual
  const [selectedDayEvents, setSelectedDayEvents] = useState<AstrologicalEvent[]>([]);
  const [events, setEvents] = useState<AstrologicalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estados para modal (en lugar de tooltip)
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalEvent, setModalEvent] = useState<AstrologicalEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<AstrologicalEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  // Estado para mostrar modal de día seleccionado
  const [showDayModal, setShowDayModal] = useState(false);
  // Estado para mostrar Agenda Libro
  const [showAgendaLibro, setShowAgendaLibro] = useState(false);
  // Estados para carga de agenda completa (birthday to next birthday)
  const [loadingYearEvents, setLoadingYearEvents] = useState(false);
  const [yearRange, setYearRange] = useState<{start: Date, end: Date} | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [loadingMonthlyEvents, setLoadingMonthlyEvents] = useState(false);
  const [loadingMonthName, setLoadingMonthName] = useState<string>('');
  const [isPreviousYear, setIsPreviousYear] = useState(false); // Detectar si vemos año anterior
  const [isLastDayOfCycle, setIsLastDayOfCycle] = useState(false); // Último día del ciclo (cumpleaños)
  const [isDayAfterBirthday, setIsDayAfterBirthday] = useState(false); // Primer día después del cumpleaños

  // 🆕 Estados para sistema de ciclos múltiples
  const [availableCycles, setAvailableCycles] = useState<Array<{
    yearLabel: string;
    start: string;
    end: string;
    eventCount: number;
    isCurrent: boolean;
    isFuture: boolean;
  }>>([]);
  const [currentCycleLabel, setCurrentCycleLabel] = useState<string>('');
  const [selectedCycleLabel, setSelectedCycleLabel] = useState<string>('');
  const [canGenerateNext, setCanGenerateNext] = useState<boolean>(false);
  const [loadingCycles, setLoadingCycles] = useState<boolean>(false);
  const [generatingCycle, setGeneratingCycle] = useState<boolean>(false);

  // Perfil de usuario REAL (no datos de prueba)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  // Planetas activos del año
  const [activePlanets, setActivePlanets] = React.useState<Array<{
    name: string;
    symbol: string;
    natalSign: string;
    natalHouse: number;
    srSign?: string;
    srHouse?: number;
    duration: string;
    isSlowPlanet: boolean;
  }> | null>(null);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;

      try {
        const res = await fetch(`/api/birth-data?userId=${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            // Calcular edad actual y próxima edad
            const birthDateObj = new Date(data.data.birthDate);
            const now = new Date();
            let currentAge = now.getFullYear() - birthDateObj.getFullYear();
            const hasHadBirthdayThisYear = (now.getMonth() > birthDateObj.getMonth()) || (now.getMonth() === birthDateObj.getMonth() && now.getDate() >= birthDateObj.getDate());
            if (!hasHadBirthdayThisYear) currentAge -= 1;
            const nextAge = currentAge + 1;

            setUserProfile({
              userId: user.uid,
              name: user.displayName || 'Usuario',
              birthDate: data.data.birthDate,
              birthTime: data.data.birthTime || '',
              birthPlace: data.data.birthPlace || '',
              currentAge,
              nextAge,
              latitude: data.data.latitude || 0,
              longitude: data.data.longitude || 0,
              timezone: data.data.timezone || '',
              place: data.data.birthPlace || '',
              astrological: data.data.astrological || undefined
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Cargar planetas activos del año con fechas específicas
  React.useEffect(() => {
    const fetchActivePlanets = async () => {
      if (!user?.uid || !userProfile) return;

      try {
        const birthDate = new Date(userProfile.birthDate);
        const now = new Date();
        const currentYear = now.getFullYear();
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();
        const thisYearBirthday = new Date(currentYear, birthMonth, birthDay);

        const startYear = now >= thisYearBirthday ? currentYear : currentYear - 1;
        const endYear = startYear + 1;

        const yearStart = new Date(startYear, birthMonth, birthDay);
        const yearEnd = new Date(endYear, birthMonth, birthDay);

        // Definir duraciones específicas para cada planeta
        // Planetas lentos: duran todo el año
        // Planetas rápidos: cambios más frecuentes (simplificado por ahora)

        const planets = [
          {
            name: 'Júpiter',
            symbol: getPlanetSymbol('Júpiter'),
            natalSign: 'Tu natal',
            natalHouse: 1,
            duration: `${formatDate(yearStart)} – ${formatDate(yearEnd)}`,
            isSlowPlanet: true
          },
          {
            name: 'Saturno',
            symbol: getPlanetSymbol('Saturno'),
            natalSign: 'Tu natal',
            natalHouse: 1,
            duration: `${formatDate(yearStart)} – ${formatDate(yearEnd)}`,
            isSlowPlanet: true
          },
          {
            name: 'Marte',
            symbol: getPlanetSymbol('Marte'),
            natalSign: 'Tu natal',
            natalHouse: 1,
            duration: `${formatDate(yearStart)} – ${formatDate(yearEnd)}`,
            isSlowPlanet: false
          },
          {
            name: 'Venus',
            symbol: getPlanetSymbol('Venus'),
            natalSign: 'Tu natal',
            natalHouse: 1,
            duration: `${formatDate(yearStart)} – ${formatDate(yearEnd)}`,
            isSlowPlanet: false
          },
          {
            name: 'Mercurio',
            symbol: getPlanetSymbol('Mercurio'),
            natalSign: 'Tu natal',
            natalHouse: 1,
            duration: `${formatDate(yearStart)} – ${formatDate(yearEnd)}`,
            isSlowPlanet: false
          }
        ];

        setActivePlanets(planets);
      } catch (error) {
        console.error('Error loading active planets:', error);
      }
    };

    fetchActivePlanets();
  }, [user, userProfile]);

  const formatDate = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getPlanetSymbol = (planet: string): string => {
    const symbols: Record<string, string> = {
      'Sol': '☉',
      'Luna': '☽',
      'Mercurio': '☿',
      'Venus': '♀',
      'Marte': '♂',
      'Júpiter': '♃',
      'Saturno': '♄',
    };
    return symbols[planet] || '●';
  };

  const getMonthName = (month: number): string => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return months[month];
  };

  // 🔧 NUEVO: Cargar datos de carta progresada si vienen desde esa página
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromProgressedChart = urlParams.get('from') === 'solar-return';

    if (fromProgressedChart) {
      const progressedData = localStorage.getItem('progressedChartData');
      const timestamp = localStorage.getItem('progressedChartTimestamp');

      if (progressedData && timestamp) {
        // Verificar que los datos no sean demasiado antiguos (menos de 24 horas)
        const dataAge = Date.now() - parseInt(timestamp);
        const isDataFresh = dataAge < 24 * 60 * 60 * 1000; // 24 horas

        if (isDataFresh) {
          try {
            const parsedData = JSON.parse(progressedData);
            console.log('📡 Datos de carta progresada cargados desde localStorage:', parsedData);

            // Aquí puedes usar los datos de la carta progresada para enriquecer los eventos
            // Por ejemplo, agregar eventos basados en aspectos progresados
            if (parsedData.aspects && parsedData.aspects.length > 0) {
              console.log('🔮 Aspectos progresados encontrados:', parsedData.aspects);
              // Podrías generar eventos adicionales basados en estos aspectos
            }

            // Limpiar localStorage después de usar los datos
            localStorage.removeItem('progressedChartData');
            localStorage.removeItem('progressedChartTimestamp');

          } catch (error) {
            console.error('Error parsing progressed chart data:', error);
          }
        } else {
          console.log('Datos de carta progresada expirados, usando datos normales');
          localStorage.removeItem('progressedChartData');
          localStorage.removeItem('progressedChartTimestamp');
        }
      }
    }
  }, []);

  // 🌞 NUEVO: Fetch ciclos disponibles del usuario
  const fetchAvailableCycles = async () => {
    if (!user?.uid) return;

    setLoadingCycles(true);
    try {
      const response = await fetch(`/api/astrology/solar-cycles?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setAvailableCycles(data.data.cycles);
        setCurrentCycleLabel(data.data.currentCycleLabel);
        setCanGenerateNext(data.data.canGenerateNext);

        // 🆕 Si NO hay ciclos, auto-generar el primero
        if (!data.data.cycles || data.data.cycles.length === 0) {
          console.log('📅 [CYCLES] No hay ciclos, auto-generando el primero...');
          await autoGenerateFirstCycle();
          return; // fetchAvailableCycles se llamará de nuevo después de generar
        }

        // Si no hay ciclo seleccionado, usar el predeterminado (que ahora sabemos que existe)
        if (!selectedCycleLabel) {
          setSelectedCycleLabel(data.data.defaultCycle);
        }

        console.log('✅ [CYCLES] Ciclos disponibles:', data.data.cycles);
      }
    } catch (error) {
      console.error('❌ [CYCLES] Error fetching cycles:', error);
    } finally {
      setLoadingCycles(false);
    }
  };

  // 🆕 Auto-generar primer ciclo cuando el usuario no tiene ninguno
  const autoGenerateFirstCycle = async () => {
    if (!user?.uid) return;

    setGeneratingCycle(true);
    try {
      console.log('🔄 [CYCLES] Auto-generando primer ciclo solar...');

      const response = await fetch('/api/astrology/solar-cycles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ [CYCLES] Primer ciclo auto-generado:', data.data.cycle.yearLabel);
        // Recargar ciclos disponibles
        await fetchAvailableCycles();
      } else if (data.error?.includes('ya existe') || response.status === 409) {
        // 🆕 El ciclo ya existe - esto puede pasar por race condition o cache
        // Simplemente recargar los ciclos sin mostrar error
        console.log('ℹ️ [CYCLES] El ciclo ya existe, recargando lista de ciclos...');
        // Forzar recarga de ciclos sin pasar por autoGenerate
        setLoadingCycles(true);
        const reloadResponse = await fetch(`/api/astrology/solar-cycles?userId=${user.uid}`);
        const reloadData = await reloadResponse.json();
        if (reloadData.success && reloadData.data.cycles?.length > 0) {
          setAvailableCycles(reloadData.data.cycles);
          setCurrentCycleLabel(reloadData.data.currentCycleLabel);
          setCanGenerateNext(reloadData.data.canGenerateNext);
          setSelectedCycleLabel(reloadData.data.defaultCycle);
          console.log('✅ [CYCLES] Ciclos recargados:', reloadData.data.cycles);
        }
        setLoadingCycles(false);
      } else {
        console.error('❌ [CYCLES] Error auto-generando primer ciclo:', data.error);
      }
    } catch (error) {
      console.error('❌ [CYCLES] Error auto-generando primer ciclo:', error);
    } finally {
      setGeneratingCycle(false);
    }
  };

  // 🌞 NUEVO: Generar nuevo ciclo
  const generateNewCycle = async () => {
    if (!user?.uid || generatingCycle) return;

    setGeneratingCycle(true);
    setLoadingYearEvents(true);

    try {
      console.log('🔄 [CYCLES] Generando nuevo ciclo...');

      const response = await fetch('/api/astrology/solar-cycles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ [CYCLES] Ciclo generado:', data.data.cycle.yearLabel);

        // Recargar ciclos disponibles
        await fetchAvailableCycles();

        // Cambiar al nuevo ciclo
        setSelectedCycleLabel(data.data.cycle.yearLabel);

        // Cargar eventos del nuevo ciclo
        await loadCycleEvents(data.data.cycle.yearLabel);
      } else {
        console.error('❌ [CYCLES] Error generando ciclo:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('❌ [CYCLES] Error generando ciclo:', error);
      setError('Error al generar el nuevo ciclo');
    } finally {
      setGeneratingCycle(false);
      setLoadingYearEvents(false);
    }
  };

  // 🌞 NUEVO: Cambiar entre ciclos
  const switchToCycle = async (yearLabel: string) => {
    if (selectedCycleLabel === yearLabel) return;

    console.log('🔄 [CYCLES] Cambiando a ciclo:', yearLabel);
    setSelectedCycleLabel(yearLabel);

    // Cargar eventos de ese ciclo
    await loadCycleEvents(yearLabel);
  };

  // 🌞 NUEVO: Cargar eventos de un ciclo específico desde BD
  const loadCycleEvents = async (yearLabel: string) => {
    if (!user?.uid) return;

    setLoadingYearEvents(true);
    try {
      console.log(`🔄 [CYCLES] Cargando eventos del ciclo ${yearLabel} desde BD...`);

      // Cargar ciclo específico desde la API
      const response = await fetch(`/api/astrology/solar-cycles?userId=${user.uid}&yearLabel=${yearLabel}`);
      const data = await response.json();

      if (!data.success || !data.data.cycle) {
        console.warn('⚠️ [CYCLES] Ciclo no encontrado en BD:', yearLabel);
        // Si no existe, intentar generar
        await loadYearEvents();
        return;
      }

      const { cycle } = data.data;

      // Establecer eventos del ciclo
      setEvents(cycle.events || []);

      // Actualizar el rango de fechas
      setYearRange({
        start: new Date(cycle.start),
        end: new Date(cycle.end)
      });

      console.log(`✅ [CYCLES] ${cycle.events?.length || 0} eventos cargados del ciclo ${yearLabel}`);
    } catch (error) {
      console.error('❌ [CYCLES] Error loading cycle events:', error);
      setError('Error al cargar eventos del ciclo');
    } finally {
      setLoadingYearEvents(false);
    }
  };

  // 📅 CARGA COMPLETA: Fetch Year Events (birthday to next birthday)
  const fetchYearEvents = async (forceNextYear: boolean = false): Promise<AstrologicalEvent[]> => {
    if (!userProfile || !userProfile.birthDate) {
      console.log('⚠️ [YEAR-EVENTS] Cannot fetch - missing userProfile or birthDate');
      return [];
    }

    try {
      console.log('📅 [YEAR-EVENTS] Fetching complete year events from birthday to next birthday...');
      if (forceNextYear) console.log('🔄 [YEAR-EVENTS] FORCING next year cycle...');

      // Calcular el rango del año astrológico (cumpleaños actual al próximo)
      const birthDate = new Date(userProfile.birthDate);
      const now = new Date();
      const currentYear = now.getFullYear();

      // Fecha de cumpleaños de este año y del año pasado
      const currentYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      const lastYearBirthday = new Date(currentYear - 1, birthDate.getMonth(), birthDate.getDate());

      // Determinar el rango del año astrológico ACTUAL
      // (desde el cumpleaños hasta el DÍA ANTES del próximo cumpleaños)
      let startDate: Date;
      let endDate: Date;

      if (forceNextYear) {
        // 🔄 FORZAR año siguiente: próximo cumpleaños → día antes del cumpleaños del año después
        const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
        startDate = nextYearBirthday;
        const nextNextYearBirthday = new Date(currentYear + 2, birthDate.getMonth(), birthDate.getDate());
        endDate = new Date(nextNextYearBirthday);
        endDate.setDate(endDate.getDate() - 1); // Día ANTES del cumpleaños
      } else if (currentYearBirthday <= now) {
        // Si ya pasó el cumpleaños este año, el rango es: cumpleaños este año → día antes del cumpleaños próximo año
        startDate = currentYearBirthday;
        const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
        endDate = new Date(nextYearBirthday);
        endDate.setDate(endDate.getDate() - 1); // Día ANTES del cumpleaños
      } else {
        // Si aún no ha pasado el cumpleaños este año, el rango es: cumpleaños año pasado → día antes del cumpleaños este año
        startDate = lastYearBirthday;
        endDate = new Date(currentYearBirthday);
        endDate.setDate(endDate.getDate() - 1); // Día ANTES del cumpleaños
      }

      // 🔍 DETECTAR si estamos viendo el año ANTERIOR del retorno solar
      // (si el final del rango ya pasó, estamos viendo el año anterior)
      const isViewingPreviousYear = endDate < now && !forceNextYear;
      setIsPreviousYear(isViewingPreviousYear);

      // 🎂 DETECTAR si HOY es el último día del ciclo (día ANTES del cumpleaños)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDateOnly = new Date(endDate);
      endDateOnly.setHours(0, 0, 0, 0);
      const isLastDay = today.getTime() === endDateOnly.getTime();
      setIsLastDayOfCycle(isLastDay);

      // 🎉 DETECTAR si HOY es el día del cumpleaños (primer día del NUEVO ciclo)
      const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      birthdayThisYear.setHours(0, 0, 0, 0);
      const isBirthday = today.getTime() === birthdayThisYear.getTime();
      setIsDayAfterBirthday(isBirthday); // Reutilizamos este estado para el cumpleaños

      setYearRange({ start: startDate, end: endDate });

      console.log('📅 [YEAR-EVENTS] Year range:', {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });

      const response = await fetch('/api/astrology/solar-year-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: userProfile.birthDate,
          birthTime: userProfile.birthTime,
          birthPlace: userProfile.birthPlace,
          currentYear: startDate.getFullYear(),
          userId: user?.uid // ✅ Enviar userId para cálculo de casas
        })
      });

      if (!response.ok) {
        console.error('❌ [YEAR-EVENTS] Failed to fetch solar year events');
        return generateExampleEvents();
      }

      const result = await response.json();
      console.log('✅ [YEAR-EVENTS] Solar year events fetched successfully');
      console.log('📊 [YEAR-EVENTS] Stats:', result.stats);

      // Transform API events to AstrologicalEvent format (igual que antes)
      const transformedEvents: AstrologicalEvent[] = [];

      // Lunar Phases
      result.data.events.lunarPhases?.forEach((phase: any) => {
        const eventDate = new Date(phase.date);
        // Solo incluir eventos dentro del rango del año astrológico
        if (eventDate >= startDate && eventDate < endDate) {
          const isNewMoon = phase.phase.includes('Nueva');
          transformedEvents.push({
            id: `lunar-${phase.date}`,
            date: phase.date,
            title: `🌙 ${phase.phase}${phase.zodiacSign ? ` en ${phase.zodiacSign}` : ''}`,
            description: `Fase lunar importante para reflexión y manifestación`,
            type: 'lunar_phase',
            priority: 'high',
            importance: 'high',
            planet: 'Luna',
            sign: phase.zodiacSign || 'N/A',
            personalInterpretation: {
              meaning: `¡ACTIVACIÓN LUNAR PODEROSA ${userProfile?.name?.toUpperCase()}! Esta ${phase.phase} es un momento clave para ${isNewMoon ? 'nuevos comienzos y manifestaciones' : 'culminaciones y liberaciones'}.`,
              lifeAreas: isNewMoon
                ? ['Manifestaciones', 'Nuevos Proyectos', 'Intenciones', 'Intuición']
                : ['Liberación', 'Cosecha', 'Culminación', 'Gratitud'],
              advice: isNewMoon
                ? 'ESTABLECE intenciones claras y planta semillas para tus proyectos. Es momento de iniciar ciclos.'
                : 'LIBERA lo que ya no sirve y celebra tus logros. Momento de cosecha emocional.',
              mantra: isNewMoon
                ? 'MANIFIESTO MIS DESEOS CON CLARIDAD Y PROPÓSITO.'
                : 'LIBERO CON GRATITUD LO QUE YA CUMPLIÓ SU CICLO.'
            }
          });
        }
      });

      // Retrogrades
      result.data.events.retrogrades?.forEach((retrograde: any) => {
        const eventDate = new Date(retrograde.startDate);
        if (eventDate >= startDate && eventDate < endDate) {
          transformedEvents.push({
            id: `retro-${retrograde.planet}-${retrograde.startDate}`,
            date: retrograde.startDate,
            title: `⏪ ${retrograde.planet} Retrógrado`,
            description: `Período de revisión y reflexión en temas de ${retrograde.planet}`,
            type: 'retrograde',
            priority: retrograde.planet === 'Mercurio' ? 'high' : 'medium',
            importance: retrograde.planet === 'Mercurio' ? 'high' : 'medium',
            planet: retrograde.planet,
            sign: retrograde.sign || 'N/A',
            aiInterpretation: {
              meaning: `MOMENTO DE REFLEXIÓN ${retrograde.planet.toUpperCase()}. Desde el ${new Date(retrograde.startDate).toLocaleDateString('es-ES')} hasta el ${new Date(retrograde.endDate).toLocaleDateString('es-ES')}.`,
              advice: `REVISA y reorganiza temas relacionados con ${getPlanetTheme(retrograde.planet)}. No es momento de iniciar, sino de perfeccionar.`,
              mantra: `ACEPTO EL TIEMPO DE REFLEXIÓN Y CRECIMIENTO INTERNO.`,
              ritual: `Dedica tiempo diario a revisar proyectos pasados relacionados con ${getPlanetTheme(retrograde.planet)}.`,
              lifeAreas: [getPlanetTheme(retrograde.planet), 'Reflexión', 'Revisión']
            }
          });
        }
      });

      // Eclipses
      result.data.events.eclipses?.forEach((eclipse: any) => {
        const eventDate = new Date(eclipse.date);
        if (eventDate >= startDate && eventDate < endDate) {
          transformedEvents.push({
            id: `eclipse-${eclipse.date}`,
            date: eclipse.date,
            title: `🌑 Eclipse ${eclipse.type === 'solar' ? 'Solar' : 'Lunar'}`,
            description: `Portal de transformación y cambios importantes`,
            type: 'eclipse',
            priority: 'high',
            importance: 'high',
            planet: eclipse.type === 'solar' ? 'Sol' : 'Luna',
            sign: eclipse.zodiacSign || 'N/A',
            aiInterpretation: {
              meaning: `¡PORTAL DE ECLIPSE TRANSFORMADOR! Los eclipses son puntos de inflexión que marcan cambios profundos en tu vida.`,
              advice: `PREPÁRATE para cambios inevitables. Los eclipses revelan verdades ocultas y abren nuevos caminos.`,
              mantra: 'ABRAZO LOS CAMBIOS QUE EL UNIVERSO TRAE PARA MI EVOLUCIÓN.',
              ritual: 'Medita sobre qué necesitas soltar y qué nuevo capítulo está comenzando en tu vida.',
              lifeAreas: ['Transformación', 'Cambios Mayores', 'Evolución']
            }
          });
        }
      });

      // Planetary Ingresses
      result.data.events.planetaryIngresses?.forEach((ingress: any) => {
        const eventDate = new Date(ingress.date);
        if (eventDate >= startDate && eventDate < endDate) {
          transformedEvents.push({
            id: `ingress-${ingress.planet}-${ingress.date}`,
            date: ingress.date,
            title: `${ingress.planet} entra en ${ingress.newSign}`,
            description: `Cambio de energía planetaria`,
            type: 'planetary_transit',
            priority: ingress.planet === 'Sol' ? 'medium' : 'low',
            importance: ingress.planet === 'Sol' ? 'medium' : 'low',
            planet: ingress.planet,
            sign: ingress.newSign,
            aiInterpretation: {
              meaning: `${ingress.planet} cambia de ${ingress.previousSign} a ${ingress.newSign}, modificando la energía de ${getPlanetTheme(ingress.planet)}.`,
              advice: `Adapta tu enfoque en ${getPlanetTheme(ingress.planet)} según la nueva energía ${ingress.newSign}.`,
              mantra: `FLUYO CON LOS CAMBIOS CÓSMICOS Y ME ADAPTO CONSCIENTEMENTE.`,
              ritual: 'Observa cómo esta nueva energía influye en tu vida diaria durante los próximos días.',
              lifeAreas: [getPlanetTheme(ingress.planet), 'Adaptación', 'Cambios']
            }
          });
        }
      });

      // Seasonal Events
      result.data.events.seasonalEvents?.forEach((seasonal: any) => {
        const eventDate = new Date(seasonal.date);
        if (eventDate >= startDate && eventDate < endDate) {
          transformedEvents.push({
            id: `seasonal-${seasonal.date}`,
            date: seasonal.date,
            title: `🌸 ${seasonal.type.replace('_', ' ')}`,
            description: seasonal.description || 'Evento estacional importante',
            type: 'seasonal',
            priority: 'medium',
            importance: 'medium',
            planet: 'Sol',
            sign: seasonal.zodiacSign || 'N/A',
            aiInterpretation: {
              meaning: `Cambio estacional que marca un nuevo ciclo natural y energético.`,
              advice: 'Alinéate con los ciclos naturales de la Tierra para mayor armonía.',
              mantra: 'ME SINCRONIZO CON LOS RITMOS NATURALES DEL UNIVERSO.',
              ritual: 'Pasa tiempo en la naturaleza y observa los cambios estacionales.',
              lifeAreas: ['Naturaleza', 'Ciclos', 'Equilibrio']
            }
          });
        }
      });

      console.log(`✅ [YEAR-EVENTS] Loaded ${transformedEvents.length} events for the complete year`);
      return transformedEvents;

    } catch (error) {
      console.error('❌ [YEAR-EVENTS] Error fetching year events:', error);
      return generateExampleEvents();
    }
  };

  // 🔧 NEW: Fetch Solar Year Events from API
  const fetchSolarYearEvents = async (): Promise<AstrologicalEvent[]> => {
    if (!userProfile || !userProfile.birthDate) {
      console.log('⚠️ [AGENDA] Cannot fetch events - missing userProfile or birthDate');
      return [];
    }

    try {
      console.log('🌟 [AGENDA] Fetching Solar Year Events...');
      console.log('📤 [AGENDA] Request payload:', {
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        birthPlace: userProfile.birthPlace,
        currentYear: new Date().getFullYear()
      });

      const response = await fetch('/api/astrology/solar-year-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: userProfile.birthDate,
          birthTime: userProfile.birthTime,
          birthPlace: userProfile.birthPlace,
          currentYear: new Date().getFullYear()
        })
      });

      console.log('📥 [AGENDA] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [AGENDA] Failed to fetch Solar Year Events');
        console.error('❌ [AGENDA] Error response:', errorText);
        return generateExampleEvents();
      }

      const result = await response.json();
      console.log('✅ [AGENDA] Solar Year Events fetched successfully');
      console.log('📊 [AGENDA] Stats:', result.stats);
      console.log('📦 [AGENDA] Data structure:', {
        hasData: !!result.data,
        hasEvents: !!result.data?.events,
        eventTypes: result.data?.events ? Object.keys(result.data.events) : []
      });

      // Transform API events to AstrologicalEvent format
      const transformedEvents: AstrologicalEvent[] = [];

      // Lunar Phases - Con ejercicios y advertencias detalladas
      result.data.events.lunarPhases?.forEach((phase: any) => {
        const isNewMoon = phase.phase.includes('Nueva');
        transformedEvents.push({
          id: `lunar-${phase.date}`,
          date: phase.date,
          title: `🌙 ${phase.phase}${phase.zodiacSign ? ` en ${phase.zodiacSign}` : ''}`,
          description: `Fase lunar importante para reflexión y manifestación`,
          type: 'lunar_phase',
          priority: 'high',
          importance: 'high',
          planet: 'Luna',
          sign: phase.zodiacSign || 'N/A',
          personalInterpretation: {
            meaning: `¡ACTIVACIÓN LUNAR PODEROSA ${userProfile?.name?.toUpperCase()}! Esta ${phase.phase} es un momento clave para ${isNewMoon ? 'nuevos comienzos y manifestaciones' : 'culminaciones y liberaciones'}.`,
            lifeAreas: isNewMoon
              ? ['Manifestaciones', 'Nuevos Proyectos', 'Intenciones', 'Intuición']
              : ['Liberación', 'Cosecha', 'Culminación', 'Gratitud'],
            advice: isNewMoon
              ? 'ESTABLECE intenciones claras y planta semillas para tus proyectos. Es momento de iniciar ciclos.'
              : 'LIBERA lo que ya no sirve y celebra tus logros. Momento de cosecha emocional.',
            mantra: isNewMoon
              ? 'MANIFIESTO MIS DESEOS CON CLARIDAD Y PROPÓSITO.'
              : 'LIBERO CON GRATITUD LO QUE YA CUMPLIÓ SU CICLO.',
            ritual: isNewMoon
              ? '🌑 RITUAL LUNA NUEVA:\n1. Escribe 3 intenciones específicas en papel\n2. Léelas en voz alta bajo la luz de la luna (o visualizándola)\n3. Guarda el papel en un lugar especial\n4. Actúa en las próximas 48 horas hacia una de ellas'
              : '🌕 RITUAL LUNA LLENA:\n1. Lista 3 cosas que quieres soltar\n2. Escríbelas en papel y quémalas (con seguridad)\n3. Lista 3 logros que celebras este mes\n4. Agradece en voz alta cada uno',
            actionPlan: isNewMoon ? [
              {
                category: 'crecimiento',
                action: 'Inicia UN proyecto nuevo que hayas estado postergando',
                timing: 'inmediato',
                difficulty: 'fácil',
                impact: 'transformador'
              },
              {
                category: 'creatividad',
                action: 'Dedica 20 minutos a brainstorming de ideas sin filtros',
                timing: 'esta_semana',
                difficulty: 'fácil',
                impact: 'medio'
              },
              {
                category: 'relaciones',
                action: 'Inicia una conversación importante que has estado evitando',
                timing: 'esta_semana',
                difficulty: 'moderado',
                impact: 'alto'
              }
            ] : [
              {
                category: 'crecimiento',
                action: 'Haz una lista de 10 logros del último mes (grandes y pequeños)',
                timing: 'inmediato',
                difficulty: 'fácil',
                impact: 'medio'
              },
              {
                category: 'salud',
                action: 'Suelta un hábito que sabes que no te sirve',
                timing: 'esta_semana',
                difficulty: 'desafiante',
                impact: 'transformador'
              },
              {
                category: 'relaciones',
                action: 'Perdona a alguien (aunque sea en tu mente) y libera esa energía',
                timing: 'este_mes',
                difficulty: 'moderado',
                impact: 'alto'
              }
            ],
            warningsAndOpportunities: {
              warnings: isNewMoon ? [
                '⚠️ No te sobrecargues con demasiadas intenciones - elige MÁXIMO 3 prioridades',
                '⚠️ Evita tomar decisiones importantes sin reflexionar al menos 24 horas',
                '⚠️ Cuidado con el exceso de entusiasmo que te haga prometer lo que no puedes cumplir'
              ] : [
                '⚠️ No fuerces conclusiones - algunas cosas necesitan más tiempo para resolverse',
                '⚠️ Evita confrontaciones emocionales intensas - las emociones están amplificadas',
                '⚠️ No tomes decisiones drásticas bajo el impulso de la luna llena'
              ],
              opportunities: isNewMoon ? [
                '🌟 Ventana perfecta para manifestar cambios importantes en tu vida',
                '🌟 Tu intuición está especialmente activa - confía en tus corazonadas',
                '🌟 Excelente momento para networking y conocer gente nueva'
              ] : [
                '🌟 Claridad máxima sobre situaciones que has estado analizando',
                '🌟 Momento ideal para completar proyectos y cerrar ciclos',
                '🌟 Tu carisma y magnetismo personal están en el punto más alto'
              ]
            }
          }
        });
      });

      // Retrogrades
      result.data.events.retrogrades?.forEach((retrograde: any) => {
        transformedEvents.push({
          id: `retro-${retrograde.planet}-${retrograde.startDate}`,
          date: retrograde.startDate,
          title: `⏪ ${retrograde.planet} Retrógrado`,
          description: `Período de revisión y reflexión en temas de ${retrograde.planet}`,
          type: 'retrograde',
          priority: retrograde.planet === 'Mercurio' ? 'high' : 'medium',
          importance: retrograde.planet === 'Mercurio' ? 'high' : 'medium',
          planet: retrograde.planet,
          sign: retrograde.sign || 'N/A',
          aiInterpretation: {
            meaning: `MOMENTO DE REFLEXIÓN ${retrograde.planet.toUpperCase()}. Desde el ${new Date(retrograde.startDate).toLocaleDateString('es-ES')} hasta el ${new Date(retrograde.endDate).toLocaleDateString('es-ES')}.`,
            advice: `REVISA y reorganiza temas relacionados con ${getPlanetTheme(retrograde.planet)}. No es momento de iniciar, sino de perfeccionar.`,
            mantra: `ACEPTO EL TIEMPO DE REFLEXIÓN Y CRECIMIENTO INTERNO.`,
            ritual: `Dedica tiempo diario a revisar proyectos pasados relacionados con ${getPlanetTheme(retrograde.planet)}.`,
            lifeAreas: [getPlanetTheme(retrograde.planet), 'Reflexión', 'Revisión']
          }
        });
      });

      // Eclipses
      result.data.events.eclipses?.forEach((eclipse: any) => {
        transformedEvents.push({
          id: `eclipse-${eclipse.date}`,
          date: eclipse.date,
          title: `🌑 Eclipse ${eclipse.type === 'solar' ? 'Solar' : 'Lunar'}`,
          description: `Portal de transformación y cambios importantes`,
          type: 'eclipse',
          priority: 'high',
          importance: 'high',
          planet: eclipse.type === 'solar' ? 'Sol' : 'Luna',
          sign: eclipse.zodiacSign || 'N/A',
          aiInterpretation: {
            meaning: `¡PORTAL DE ECLIPSE TRANSFORMADOR! Los eclipses son puntos de inflexión que marcan cambios profundos en tu vida.`,
            advice: `PREPÁRATE para cambios inevitables. Los eclipses revelan verdades ocultas y abren nuevos caminos.`,
            mantra: 'ABRAZO LOS CAMBIOS QUE EL UNIVERSO TRAE PARA MI EVOLUCIÓN.',
            ritual: 'Medita sobre qué necesitas soltar y qué nuevo capítulo está comenzando en tu vida.',
            lifeAreas: ['Transformación', 'Cambios Mayores', 'Evolución']
          }
        });
      });

      // Planetary Ingresses
      result.data.events.planetaryIngresses?.forEach((ingress: any) => {
        transformedEvents.push({
          id: `ingress-${ingress.planet}-${ingress.date}`,
          date: ingress.date,
          title: `${ingress.planet} entra en ${ingress.newSign}`,
          description: `Cambio de energía planetaria`,
          type: 'planetary_transit',
          priority: ingress.planet === 'Sol' ? 'medium' : 'low',
          importance: ingress.planet === 'Sol' ? 'medium' : 'low',
          planet: ingress.planet,
          sign: ingress.newSign,
          aiInterpretation: {
            meaning: `${ingress.planet} cambia de ${ingress.previousSign} a ${ingress.newSign}, modificando la energía de ${getPlanetTheme(ingress.planet)}.`,
            advice: `Adapta tu enfoque en ${getPlanetTheme(ingress.planet)} según la nueva energía ${ingress.newSign}.`,
            mantra: `FLUYO CON LOS CAMBIOS CÓSMICOS Y ME ADAPTO CONSCIENTEMENTE.`,
            ritual: 'Observa cómo esta nueva energía influye en tu vida diaria durante los próximos días.',
            lifeAreas: [getPlanetTheme(ingress.planet), 'Adaptación', 'Cambios']
          }
        });
      });

      // Seasonal Events
      result.data.events.seasonalEvents?.forEach((seasonal: any) => {
        transformedEvents.push({
          id: `seasonal-${seasonal.date}`,
          date: seasonal.date,
          title: `🌸 ${seasonal.type.replace('_', ' ')}`,
          description: seasonal.description || 'Evento estacional importante',
          type: 'seasonal',
          priority: 'medium',
          importance: 'medium',
          planet: 'Sol',
          sign: seasonal.zodiacSign || 'N/A',
          aiInterpretation: {
            meaning: `Cambio estacional que marca un nuevo ciclo natural y energético.`,
            advice: 'Alinéate con los ciclos naturales de la Tierra para mayor armonía.',
            mantra: 'ME SINCRONIZO CON LOS RITMOS NATURALES DEL UNIVERSO.',
            ritual: 'Pasa tiempo en la naturaleza y observa los cambios estacionales.',
            lifeAreas: ['Naturaleza', 'Ciclos', 'Equilibrio']
          }
        });
      });

      console.log(`✅ [AGENDA] Transformed ${transformedEvents.length} total events`);
      console.log('📈 [AGENDA] Event breakdown:', {
        lunarPhases: transformedEvents.filter(e => e.type === 'lunar_phase').length,
        retrogrades: transformedEvents.filter(e => e.type === 'retrograde').length,
        eclipses: transformedEvents.filter(e => e.type === 'eclipse').length,
        planetaryTransits: transformedEvents.filter(e => e.type === 'planetary_transit').length,
        seasonal: transformedEvents.filter(e => e.type === 'seasonal').length
      });

      if (transformedEvents.length > 0) {
        const dates = transformedEvents.map(e => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime());
        console.log('📅 [AGENDA] Event date range:', {
          first: dates[0].toISOString(),
          last: dates[dates.length - 1].toISOString(),
          currentMonth: new Date().toISOString().substring(0, 7)
        });
      }

      return transformedEvents;

    } catch (error) {
      console.error('❌ [AGENDA] Error fetching Solar Year Events:', error);
      console.error('❌ [AGENDA] Stack trace:', error instanceof Error ? error.stack : 'No stack');
      return generateExampleEvents();
    }
  };

  // Helper function to get planet theme
  const getPlanetTheme = (planet: string): string => {
    const themes: Record<string, string> = {
      'Mercurio': 'Comunicación',
      'Venus': 'Amor y Valores',
      'Marte': 'Acción y Energía',
      'Júpiter': 'Expansión y Abundancia',
      'Saturno': 'Estructura y Disciplina',
      'Urano': 'Innovación y Cambio',
      'Neptuno': 'Espiritualidad e Intuición',
      'Plutón': 'Transformación Profunda'
    };
    return themes[planet] || 'Crecimiento Personal';
  };

  // Eventos de ejemplo ÉPICOS (fallback)
  const generateExampleEvents = (): AstrologicalEvent[] => {
    if (!userProfile) return [];

    return [
      // Fases Lunares (4 por mes)
      {
        id: 'luna-nueva-sept',
        date: '2025-09-02',
        title: 'Luna Nueva en Virgo',
        description: 'Momento perfecto para nuevos comienzos y organización',
        type: 'lunar_phase',
        priority: 'high',
        importance: 'high',
        planet: 'Luna',
        sign: 'Virgo',
        aiInterpretation: {
          meaning: `¡REVOLUCIÓN ORGANIZATIVA ${userProfile.name?.toUpperCase()}! Como Géminis con ${userProfile.currentAge} años, esta Luna Nueva en Virgo te ayuda a estructurar tu mente curiosa.`,
          advice: 'ORGANIZA tus ideas y proyectos. Tu Mercurio en Géminis necesita esta energía Virgo para dar forma práctica a tu creatividad.',
          mantra: 'SOY ORDEN Y CREATIVIDAD EN PERFECTA ARMONÍA.',
          ritual: 'Escribe una lista de 3 proyectos que quieres organizar y dedica 10 minutos diarios a trabajar en ellos.',
          lifeAreas: ['Organización', 'Estudio', 'Rutinas']
        }
      },
      {
        id: 'luna-llena-sept',
        date: '2025-09-17',
        title: 'Luna Llena en Piscis',
        description: 'Culminación emocional e intuición elevada',
        type: 'lunar_phase',
        priority: 'high',
        importance: 'high',
        planet: 'Luna',
        sign: 'Piscis',
        aiInterpretation: {
          meaning: `¡ACTIVACIÓN EMOCIONAL PROFUNDA ${userProfile.name?.toUpperCase()}! Tu Luna en Cáncer resuena con esta energía Piscis.`,
          advice: 'CONFÍA en tu intuición. A los ${userProfile.currentAge} años, desarrollas tu sensibilidad emocional - esta luna te conecta con tu mundo interior.',
          mantra: 'MI INTUICIÓN ME GUÍA HACIA MIS SUEÑOS MÁS PROFUNDOS.',
          ritual: 'Meditación de 5 minutos conectando con tus emociones y escribiendo un sueño que hayas tenido recientemente.',
          lifeAreas: ['Emociones', 'Intuición', 'Creatividad']
        }
      },

      // Tránsitos Planetarios
      {
        id: 'mercurio-geminis',
        date: '2025-09-05',
        title: 'Mercurio entra en Libra',
        description: 'Tu planeta regente mejora tu comunicación y relaciones',
        type: 'planetary_transit',
        priority: 'medium',
        importance: 'medium',
        planet: 'Mercurio',
        sign: 'Libra',
        aiInterpretation: {
          meaning: `¡UPGRADE COMUNICATIVO ÉPICO! Tu Mercurio natal en Géminis recibe apoyo de Libra para equilibrar tu expresión.`,
          advice: 'APROVECHA para mejorar tus relaciones sociales. Como Géminis, tu don de comunicación se refina con diplomatismo.',
          mantra: 'MIS PALABRAS CREAN ARMONÍA Y CONEXIONES AUTÉNTICAS.',
          ritual: 'Escribe una carta o mensaje positivo a un amigo o familiar expresando tu gratitud.',
          lifeAreas: ['Comunicación', 'Relaciones', 'Social']
        }
      },

      // Retrogradaciones
      {
        id: 'venus-retrogrado',
        date: '2025-09-12',
        title: 'Venus Retrógrado en Escorpio',
        description: 'Revisión profunda de valores y relaciones',
        type: 'retrograde',
        priority: 'medium',
        importance: 'medium',
        planet: 'Venus',
        sign: 'Escorpio',
        aiInterpretation: {
          meaning: `MOMENTO DE REFLEXIÓN VENUSINA. Con ${userProfile.currentAge} años, es perfecto para entender qué valoras realmente en las amistades.`,
          advice: 'REFLEXIONA sobre tus relaciones. ¿Cuáles son auténticas? Tu Venus en Tauro busca estabilidad emocional.',
          mantra: 'RECONOZCO LO QUE VERDADERAMENTE VALORO EN MI CORAZÓN.',
          ritual: 'Haz una lista de 5 cosas que valoras en tus amistades más importantes.',
          lifeAreas: ['Relaciones', 'Valores', 'Autoestima']
        }
      },

      // Aspectos importantes
      {
        id: 'sol-jupiter-trigono',
        date: '2025-09-20',
        title: 'Sol trígono Júpiter',
        description: 'Expansión, oportunidades y optimismo',
        type: 'aspect',
        priority: 'high',
        importance: 'high',
        planet: 'Sol',
        sign: 'Géminis',
        aiInterpretation: {
          meaning: `¡EXPANSIÓN SOLAR ÉPICA ${userProfile.name?.toUpperCase()}! Tu Sol Géminis se conecta con la abundancia jupiteriana.`,
          advice: 'ABRAZA nuevas oportunidades de aprendizaje. Es momento perfecto para cursos, idiomas o habilidades que amplíen tu mundo.',
          mantra: 'ME EXPANDO CON CONFIANZA HACIA NUEVOS HORIZONTES DE CONOCIMIENTO.',
          ritual: 'Investiga sobre un tema que te interese y dedica 15 minutos diarios a aprender algo nuevo.',
          lifeAreas: ['Aprendizaje', 'Crecimiento', 'Oportunidades']
        }
      },

      // Más eventos distribuidos
      {
        id: 'marte-virgo',
        date: '2025-09-08',
        title: 'Marte entra en Virgo',
        description: 'Energía enfocada en perfeccionamiento y rutinas',
        type: 'planetary_transit',
        priority: 'low',
        importance: 'low',
        planet: 'Marte',
        sign: 'Virgo',
        aiInterpretation: {
          meaning: `ORGANIZACIÓN ENERGÉTICA. Tu Marte en Virgo se activa para dar estructura a tu energía Géminis.`,
          advice: 'CREA rutinas que te ayuden a enfocar tu mente dispersa. Pequeños hábitos diarios harán gran diferencia.',
          mantra: 'CANALIZO MI ENERGÍA CON PRECISIÓN Y PROPÓSITO.',
          ritual: 'Crea una rutina matutina de 10 minutos que incluya organización y planificación del día.',
          lifeAreas: ['Rutinas', 'Productividad', 'Salud']
        }
      },

      {
        id: 'eclipse-solar',
        date: '2025-09-25',
        title: 'Eclipse Solar en Libra',
        description: 'Portal de transformación en relaciones',
        type: 'eclipse',
        priority: 'high',
        importance: 'high',
        planet: 'Sol',
        sign: 'Libra',
        aiInterpretation: {
          meaning: `¡PORTAL ECLIPSE TRANSFORMADOR! Este eclipse activa tu Casa de relaciones y comunicación equilibrada.`,
          advice: 'PREPÁRATE para cambios importantes en cómo te relacionas. Tu Ascendente Leo brilla con nueva diplomatismo.',
          mantra: 'SOY EQUILIBRIO Y ARMONÍA EN TODAS MIS RELACIONES.',
          ritual: 'Reflexiona sobre una relación importante en tu vida y escribe cómo puedes mejorarla.',
          lifeAreas: ['Relaciones', 'Equilibrio', 'Transformación']
        }
      }
    ];
  };

  // 📅 FUNCIÓN: Cargar eventos del año completo
  const loadYearEvents = async (forceNextYear: boolean = false) => {
    if (!userProfile) {
      console.log('⚠️ [AGENDA] No userProfile available yet');
      return;
    }

    setLoading(true);
    setLoadingYearEvents(true);
    console.log('📅 [AGENDA] Loading complete year events (birthday to birthday)...');

    try {
      const yearEvents = await fetchYearEvents(forceNextYear);
      console.log(`✅ [AGENDA] Loaded ${yearEvents.length} events for the complete year`);

      setEvents(yearEvents);
    } catch (error) {
      console.error('❌ [AGENDA] Error loading year events:', error);
      console.error('❌ [AGENDA] Error details:', error instanceof Error ? error.message : String(error));
      // Fallback to example events
      const exampleEvents = generateExampleEvents();
      console.log(`⚠️ [AGENDA] Using ${exampleEvents.length} fallback example events`);
      setEvents(exampleEvents);
      setError('No se pudieron cargar los eventos. Mostrando eventos de ejemplo.');
    } finally {
      setLoading(false);
      setLoadingYearEvents(false);
    }
  };

  // Helper para extraer ciudad de una dirección completa
  const extractCity = (address: string | undefined): string => {
    if (!address) return 'Madrid';

    const parts = address.split(',').map(p => p.trim());

    // Buscar "Madrid" específicamente
    const madridIndex = parts.findIndex(p => p.toLowerCase().includes('madrid') && !p.toLowerCase().includes('comunidad'));
    if (madridIndex !== -1) {
      return parts[madridIndex];
    }

    // Si no encuentra Madrid, buscar ciudad antes de "Comunidad de"
    const comunidadIndex = parts.findIndex(p => p.toLowerCase().includes('comunidad'));
    if (comunidadIndex > 0) {
      return parts[comunidadIndex - 1];
    }

    // Fallback: devolver las dos últimas partes relevantes (ej: "Madrid, Comunidad de Madrid")
    if (parts.length >= 2) {
      const filtered = parts.filter(p =>
        !p.match(/^\d+$/) && // no números solos
        !p.toLowerCase().includes('calle') &&
        !p.toLowerCase().includes('hospital') &&
        p.length > 2
      );
      return filtered.slice(-2, -1)[0] || parts[parts.length - 2];
    }

    return parts[0] || 'Madrid';
  };

  // Helper para extraer ciudad y región
  const extractCityAndRegion = (address: string | undefined): string => {
    if (!address) return 'Madrid, Comunidad de Madrid';

    const parts = address.split(',').map(p => p.trim());

    // Buscar índice de "Comunidad de"
    const comunidadIndex = parts.findIndex(p => p.toLowerCase().includes('comunidad'));

    if (comunidadIndex > 0) {
      const city = parts[comunidadIndex - 1];
      const region = parts[comunidadIndex];
      return `${city}, ${region}`;
    }

    return extractCity(address);
  };

  // Cargar eventos del año completo al iniciar
  useEffect(() => {
    if (!userProfile) {
      console.log('⚠️ [AGENDA] No userProfile available yet');
      return;
    }

    console.log('🎯 [AGENDA] UserProfile loaded:', {
      hasUser: !!userProfile,
      hasBirthDate: !!userProfile.birthDate,
      birthDate: userProfile.birthDate
    });

    loadYearEvents();
  }, [userProfile]);

  // 🌞 NUEVO: Cargar ciclos disponibles al iniciar
  useEffect(() => {
    if (!user?.uid) return;

    fetchAvailableCycles();
  }, [user?.uid]);

  // 📅 Inicializar currentMonth al MES DE CUMPLEAÑOS (inicio del ciclo solar)
  useEffect(() => {
    if (yearRange && yearRange.start) {
      const birthdayMonth = yearRange.start;
      console.log('📅 [AGENDA] Setting currentMonth to BIRTHDAY month:', birthdayMonth);
      setCurrentMonth(birthdayMonth);
    }
  }, [yearRange]);

  // 🎯 Actualizar eventos del día seleccionado cuando cambien los events o selectedDate
  useEffect(() => {
    if (selectedDate && events.length > 0) {
      let dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, selectedDate);
      });

      // Agregar eventos especiales usando helper
      dayEvents = addSpecialEvents(selectedDate, dayEvents);

      setSelectedDayEvents(dayEvents);
      console.log(`📅 [AGENDA] Updated selectedDayEvents for ${selectedDate.toDateString()}: ${dayEvents.length} events`);
    } else if (selectedDate) {
      setSelectedDayEvents([]);
    }
  }, [selectedDate, events, yearRange, userProfile, canGenerateNext]);

  // 🎂 AUTO-GENERAR nuevo ciclo solar el día después del cumpleaños
  useEffect(() => {
    if (isDayAfterBirthday && yearRange && userProfile) {
      const hasGeneratedNewCycle = localStorage.getItem(`newCycle_${userProfile.userId}_${yearRange.end.getFullYear()}`);

      if (!hasGeneratedNewCycle) {
        console.log('[BIRTHDAY] Dia después del cumpleaños detectado - Generando nuevo ciclo automáticamente...');

        // Generar nuevo ciclo
        loadYearEvents(true);

        // Marcar como generado para no volver a generar
        localStorage.setItem(`newCycle_${userProfile.userId}_${yearRange.end.getFullYear()}`, 'generated');

        // Navegar al día del cumpleaños (que es el inicio del nuevo ciclo yearRange.start)
        // pero como estamos en el día DESPUÉS, restamos 1 día para ir al cumpleaños
        const today = new Date();
        const birthday = new Date(today);
        birthday.setDate(birthday.getDate() - 1); // Ayer = día del cumpleaños

        setSelectedDate(birthday);
        setCurrentMonth(birthday);

        console.log('[BIRTHDAY] Nuevo ciclo generado y navegado al día del cumpleaños:', birthday.toDateString());
      }
    }
  }, [isDayAfterBirthday, yearRange, userProfile]);

  // Funciones auxiliares
  const getRandomEventTitle = () => {
    const titles = [
      'Activación Solar Épica', 'Resonancia Lunar Profunda', 'Portal de Manifestación',
      'Trígono Venus-Júpiter', 'Conjunción Mercurio-Urano', 'Despertar de Plutón',
      'Bendición de Júpiter', 'Sabiduría de Saturno', 'Magia Venusina'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomEventType = (): EventType => {
    const types: EventType[] = ['ai_generated', 'lunar_phase', 'planetary_transit', 'aspect', 'eclipse'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomImportance = () => {
    const importances = ['high', 'medium', 'low'];
    return importances[Math.floor(Math.random() * importances.length)];
  };

  const getRandomPlanet = () => {
    const planets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
    return planets[Math.floor(Math.random() * planets.length)];
  };

  const getRandomSign = () => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    return signs[Math.floor(Math.random() * signs.length)];
  };

  // 🎂 Helper: Agregar eventos especiales (último día y cumpleaños) a un día
  const addSpecialEvents = (day: Date, dayEvents: AstrologicalEvent[]): AstrologicalEvent[] => {
    let enhancedEvents = [...dayEvents];

    // 🌅 EVENTO ESPECIAL: Último día del ciclo
    if (yearRange) {
      const lastDayOfCycle = new Date(yearRange.end);
      lastDayOfCycle.setHours(0, 0, 0, 0);
      const dayOnly = new Date(day);
      dayOnly.setHours(0, 0, 0, 0);

      if (lastDayOfCycle.getTime() === dayOnly.getTime()) {
        const lastDayEvent: AstrologicalEvent = {
          id: 'last-day-of-cycle',
          date: day,
          title: '🌅 Tu ciclo ha llegado al fin',
          type: 'seasonal',
          description: 'Hoy es el último día de tu ciclo solar actual. Mañana comienza un nuevo ciclo con tu cumpleaños.',
          importance: 'high',
          metadata: {
            isSpecialEvent: true,
            eventType: 'cycle_end'
          }
        };
        enhancedEvents = [lastDayEvent, ...enhancedEvents];
      }
    }

    // 🎉 EVENTO ESPECIAL: Cumpleaños
    if (yearRange && userProfile) {
      const birthDate = new Date(userProfile.birthDate);
      const birthdayThisYear = new Date(day.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      birthdayThisYear.setHours(0, 0, 0, 0);
      const dayOnly = new Date(day);
      dayOnly.setHours(0, 0, 0, 0);

      if (birthdayThisYear.getTime() === dayOnly.getTime()) {
        const birthdayEvent: AstrologicalEvent = {
          id: 'birthday-special',
          date: day,
          title: '🎂 ¡Felicidades por tu nueva vuelta al Sol!',
          type: 'seasonal',
          description: 'Hoy comienza tu nuevo ciclo solar. Es el momento perfecto para revisar tu Retorno Solar y establecer intenciones para los próximos 12 meses.',
          importance: 'high',
          metadata: {
            isSpecialEvent: true,
            eventType: 'birthday',
            canGenerateNewCycle: canGenerateNext
          }
        };
        enhancedEvents = [birthdayEvent, ...enhancedEvents];
      }
    }

    return enhancedEvents;
  };

  // 📅 Obtener días del mes actual con eventos (para vista mensual)
  const getCurrentMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Incluir días del mes anterior/siguiente para completar semanas
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay() + 1);
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (7 - monthEnd.getDay()));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const daysWithEvents = days.map(day => {
      let dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(day, eventDate);
      });

      // Agregar eventos especiales
      dayEvents = addSpecialEvents(day, dayEvents);

      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentMonth),
        hasEvents: dayEvents.length > 0
      };
    });

    return daysWithEvents;
  };

  // Vista completa del año - generar todos los meses
  const getYearView = () => {
    if (!yearRange) return [];

    const months = [];
    let currentDate = new Date(yearRange.start);

    while (currentDate < yearRange.end) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = new Date(monthStart);
      startDate.setDate(startDate.getDate() - monthStart.getDay() + 1);
      const endDate = new Date(monthEnd);
      endDate.setDate(endDate.getDate() + (7 - monthEnd.getDay()));

      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const daysWithEvents = days.map(day => {
        let dayEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return isSameDay(day, eventDate);
        });

        // Agregar eventos especiales
        dayEvents = addSpecialEvents(day, dayEvents);

        return {
          date: day,
          events: dayEvents,
          isCurrentMonth: isSameMonth(day, currentDate),
          hasEvents: dayEvents.length > 0
        };
      });

      months.push({
        month: currentDate,
        monthName: format(currentDate, 'MMMM yyyy', { locale: es }),
        days: daysWithEvents
      });

      currentDate = addMonths(currentDate, 1);
    }

    console.log('📅 [YEAR-VIEW] Generated view for', months.length, 'months');
    return months;
  };

  // No necesitamos navegación mensual - mostramos el año completo



  const handleDayClick = (day: AstronomicalDay) => {
    // Simplemente actualizar fecha seleccionada - el useEffect actualizará selectedDayEvents automáticamente
    // Los eventos se mostrarán debajo del calendario
    setSelectedDate(day.date);

    // 🎂 Si es primer o último día del ciclo, agregar evento especial a los selectedDayEvents
    const isFirstDay = yearRange && isSameDay(day.date, yearRange.start);
    const isLastDay = yearRange && isSameDay(day.date, yearRange.end);

    if (isFirstDay || isLastDay) {
      const specialMessage = isFirstDay
        ? {
            title: '🎂 ¡FELIZ CUMPLEAÑOS! PRIMER DÍA DE TU NUEVO RETORNO SOLAR',
            subtitle: `Inicio de tu ciclo ${yearRange.start.getFullYear()}-${yearRange.end.getFullYear() + 1}`,
            description: `¡Hoy es tu cumpleaños y comienza un nuevo año astrológico para ti! Este es el día en que el Sol regresa a la posición exacta que tenía cuando naciste.`,
            guidance: [
              '✨ Este es el momento perfecto para establecer tus intenciones para el año',
              '🎯 Define qué quieres manifestar en este nuevo ciclo solar',
              '🔮 Realiza un ritual de cumpleaños consciente: enciende una vela, escribe tus deseos',
              '📝 Revisa tu Carta de Retorno Solar para entender las energías del año',
              '🌟 Celebra: tu existencia es un regalo para el universo'
            ],
            color: 'green',
            mantra: 'Hoy nace un nuevo yo. Abrazo este ciclo con consciencia y gratitud.',
            showNewCycleButton: true
          }
        : {
            title: '🌅 ÚLTIMO DÍA DE TU RETORNO SOLAR',
            subtitle: `Culminación de tu ciclo ${yearRange.start.getFullYear()}-${yearRange.end.getFullYear()}`,
            description: `Hoy cierra tu año astrológico. Mañana será tu cumpleaños y comenzará un nuevo ciclo solar.`,
            guidance: [
              '🙏 Agradece todo lo vivido en este ciclo: aprendizajes, personas, experiencias',
              '💭 Reflexiona: ¿Qué llegó a mi vida? ¿Qué se transformó? ¿Qué solté?',
              '🔥 Realiza un ritual de cierre: escribe lo que dejas ir y quémalo simbólicamente',
              '📔 Lee tu diario del año para ver tu evolución',
              '🌙 Prepárate para tu nuevo retorno solar con apertura y claridad'
            ],
            color: 'pink',
            mantra: 'Cierro este ciclo con amor. Honro mi camino y me preparo para renacer.'
          };

      // Los eventos especiales se agregan automáticamente al hacer el handleDayClick en el calendario
      // y se mostrarán debajo del calendario
    }
    // Los eventos del día se actualizarán automáticamente vía useEffect
  };

  // Modal handlers (reemplaza tooltip)
  const handleEventClick = (event: AstrologicalEvent) => {
    setModalEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setModalEvent(null);
  };

  // Tooltip handlers
  const handleEventHover = (event: AstrologicalEvent, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  // Obtener icono para evento (más variedad visual)
  const getEventIcon = (type: string, priority?: string) => {
    if (priority === 'high') {
      return '🔥';
    }

    switch (type) {
      case 'lunar_phase': return '🌙';
      case 'planetary_transit': return '🪐';
      case 'retrograde': return '⏪';
      case 'direct': return '▶️';
      case 'eclipse': return '🌑';
      case 'aspect': return '✨';
      case 'ai_generated': return '🚀';
      default: return '⭐';
    }
  };

  // Obtener color de evento
  const getEventColor = (type: string, priority?: string) => {
    if (priority === 'high') {
      return 'from-red-500 to-orange-500';
    }

    switch (type) {
      case 'lunar_phase': return 'from-indigo-500 to-purple-500';
      case 'planetary_transit': return 'from-blue-500 to-cyan-500';
      case 'eclipse': return 'from-purple-600 to-pink-600';
      case 'aspect': return 'from-yellow-500 to-amber-500';
      case 'ai_generated': return 'from-emerald-500 to-teal-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];



  // ✅ HELPER: Mapear tipo de evento a formato de EventInterpretationButton
  // Ahora usa la función de mapeo completo de utils
  const mapEventTypeToInterpretation = (event: AstrologicalEvent): {
    type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
    house: number;
  } => {
    const eventData = mapAstrologicalEventToEventData(event, {
      defaultHouse: 1 // Fallback si no hay casa calculada
    });

    return {
      type: eventData.type,
      house: eventData.house
    };
  };

  // Si está en modo Agenda Libro, mostrar solo eso
  if (showAgendaLibro && userProfile && yearRange) {
    return (
      <StyleProvider>
        <AgendaLibro
          onClose={() => setShowAgendaLibro(false)}
          userName={userProfile.name || 'Usuario'}
          startDate={yearRange.start}
          endDate={yearRange.end}
          sunSign={userProfile.astrological?.signs?.sun}
          moonSign={userProfile.astrological?.signs?.moon}
          ascendant={userProfile.astrological?.signs?.ascendant ? `Ascendente ${userProfile.astrological.signs.ascendant}` : undefined}
          userId={user?.uid || ''}
          yearLabel={selectedCycleLabel || ''}
        />
      </StyleProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">

      {/* Partículas mágicas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 lg:p-8">

        {/* HEADER ÉPICO INSPIRADO EN DASHBOARD */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
              <span className="text-5xl">🚀</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
            Bienvenido a tu
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"> agenda cósmica</span>
          </h1>

          {/* CALENDARIO PERSONALIZADO */}
          {userProfile && userProfile.birthDate && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-md border-2 border-purple-400/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-2xl font-bold text-yellow-300">Calendario Personalizado</h2>
                  <Star className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-white text-lg leading-relaxed">
                    <span className="font-bold text-yellow-200">{userProfile.name || 'Usuario'}</span>
                    {' '}nacida {new Date(userProfile.birthDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    {' '}en <span className="font-bold">{extractCity(userProfile.birthPlace)}</span>
                    {userProfile.birthTime && (
                      <span> {userProfile.birthTime}</span>
                    )}
                    <span> y vive en <span className="font-bold">{extractCity(userProfile.birthPlace)}</span></span>
                  </p>
                  <div className="pt-2 border-t border-purple-300/30 mt-3">
                    <p className="text-sm text-purple-100 leading-relaxed flex items-center justify-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> Tu carta dice quién eres
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Sun className="w-4 h-4" /> Tu retorno muestra qué se activa
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> La agenda te enseña cómo vivirlo
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {userProfile?.name ? `✨ Hola ${userProfile.name}, ` : '✨ Hola, explorador cósmico, '}
              aquí encontrarás tu calendario astrológico personalizado con eventos cósmicos importantes y momentos de poder personal.
            </p>

            {/* Texto de personalidad con modal */}
            {userProfile && userProfile.astrological && (
              <>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {userProfile.astrological.lifeThemes?.join(', ') || 'Descubre tu personalidad astrológica única'}
                </p>
                <button
                  onClick={() => setShowPersonalityModal(true)}
                  className="text-yellow-400 underline hover:text-yellow-300 transition-colors duration-200"
                >
                  Continuar leyendo...
                </button>

                {showPersonalityModal && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                      onClick={() => setShowPersonalityModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[201] p-6">
                      <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 text-white">
                        <h3 className="text-2xl font-bold mb-4">Perfil de Personalidad</h3>
                        <p className="whitespace-pre-line leading-relaxed">
                          {userProfile.astrological.strengths?.join(', ') || 'Tus fortalezas astrológicas serán reveladas aquí'}
                        </p>
                        <button
                          onClick={() => setShowPersonalityModal(false)}
                          className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Estadísticas de progreso + Control de Año Solar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              {/* Badges de tipos de eventos */}
              <div className="flex justify-center items-center space-x-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-green-300">🌙</span>
                  <span className="text-green-300 ml-2">Fases Lunares</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-blue-300">⭐</span>
                  <span className="text-blue-300 ml-2">Tránsitos</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-pink-300">✨</span>
                  <span className="text-pink-300 ml-2">Eventos Épicos</span>
                </div>
              </div>

              {/* 🌞 Control de Ciclos Solares */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Selector de Ciclos - Solo mostrar si hay ciclos disponibles */}
                {availableCycles.length > 0 ? (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/30 rounded-xl px-4 py-3">
                    <span className="text-yellow-400 text-lg">☀️</span>
                    <span className="text-purple-200 text-sm font-medium mr-2">Ciclo Solar:</span>

                    {/* Tabs para cambiar entre ciclos */}
                    <div className="flex gap-1 bg-black/20 rounded-lg p-1">
                      {availableCycles.map(cycle => (
                        <button
                          key={cycle.yearLabel}
                          onClick={() => switchToCycle(cycle.yearLabel)}
                          disabled={loadingYearEvents}
                          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                            selectedCycleLabel === cycle.yearLabel
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'text-purple-200 hover:text-white hover:bg-white/10'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {cycle.yearLabel}
                        </button>
                      ))}
                    </div>

                    {/* Botón generar nuevo ciclo (solo si se puede) */}
                    {canGenerateNext && (
                      <button
                        onClick={generateNewCycle}
                        disabled={generatingCycle || loadingYearEvents}
                        className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/50 flex items-center gap-2"
                      >
                        {generatingCycle ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generando...</span>
                          </>
                        ) : (
                          <>
                            <span>+</span>
                            <span>Generar {currentCycleLabel ? parseInt(currentCycleLabel.split('-')[1]) : new Date().getFullYear()}-{currentCycleLabel ? parseInt(currentCycleLabel.split('-')[1]) + 1 : new Date().getFullYear() + 1}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Si no hay ciclos, mostrar botón para generar el primer ciclo */
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="text-white text-sm font-medium bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-400/30 rounded-xl px-5 py-3">
                      <span className="text-yellow-400">☀️</span> Ciclo Solar: {selectedCycleLabel || (yearRange ? `${yearRange.start.getFullYear()}-${yearRange.end.getFullYear()}` : '...')}
                    </div>
                    <button
                      onClick={generateNewCycle}
                      disabled={generatingCycle || loadingYearEvents}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center gap-2"
                      title="Generar ciclo solar con eventos astrológicos"
                    >
                      {generatingCycle || loadingYearEvents ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">✨</span>
                          <span>Generar Ciclo Solar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Ver Agenda Libro - Separado del grupo */}
                <button
                  onClick={() => setShowAgendaLibro(true)}
                  disabled={!selectedCycleLabel || loadingCycles || generatingCycle}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2"
                  title={!selectedCycleLabel ? "Primero genera un ciclo solar" : "Ver tu agenda en formato libro"}
                >
                  <span className="text-lg">📖</span>
                  <span className="text-white font-bold text-sm">Ver Agenda Libro</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🎂 BANNER: ÚLTIMO DÍA DEL CICLO - Mostrar en el día del cumpleaños */}
        {isLastDayOfCycle && yearRange && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/70 to-pink-900/70 border-2 border-pink-500/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl animate-pulse">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎂</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-pink-200 mb-2 flex items-center gap-2">
                  <span>✨</span>
                  ¡Hoy es el Último Día de tu Retorno Solar!
                </h3>
                <p className="text-pink-100 leading-relaxed">
                  Hoy culmina tu ciclo solar {yearRange.start.getFullYear()}-{yearRange.end.getFullYear()}.
                  <br />
                  <span className="text-yellow-200">Mañana comienza un <strong>nuevo año astrológico</strong> lleno de posibilidades. ¡Feliz cumpleaños! 🎉</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🎂 BANNER: CUMPLEAÑOS - Mostrar el día del cumpleaños */}
        {isDayAfterBirthday && yearRange && (
          <div className="mb-8 bg-gradient-to-r from-green-900/70 to-emerald-900/70 border-2 border-green-500/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎂</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-200 mb-2 flex items-center gap-2">
                  <span>🎉</span>
                  ¡Feliz Cumpleaños! Hoy Comienza tu Nueva Vuelta al Sol
                </h3>
                <p className="text-green-100 mb-4 leading-relaxed">
                  ¡Hoy es tu cumpleaños y comienza un nuevo ciclo solar!
                  <br />
                  <span className="text-white">Genera tu <strong>Agenda Astrológica {yearRange.end.getFullYear() + 1}-{yearRange.end.getFullYear() + 2}</strong> para planificar este nuevo año lleno de oportunidades.</span>
                </p>
                {canGenerateNext && (
                  <button
                    onClick={generateNewCycle}
                    disabled={generatingCycle || loadingYearEvents}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center gap-2"
                  >
                    {generatingCycle || loadingYearEvents ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🔄</span>
                        <span>Generar Nuevo Ciclo {yearRange.end.getFullYear() + 1}-{yearRange.end.getFullYear() + 2}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ⚠️ BANNER: AÑO ANTERIOR - Mostrar cuando estamos viendo el año pasado del retorno solar */}
        {isPreviousYear && yearRange && (
          <div className="mb-8 bg-gradient-to-r from-orange-900/70 to-red-900/70 border-2 border-orange-500/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-orange-200 mb-2 flex items-center gap-2">
                  <span>⏰</span>
                  Estás Viendo tu Año Solar Anterior
                </h3>
                <p className="text-orange-100 leading-relaxed">
                  Este es tu ciclo solar del <strong className="text-white">{yearRange.start.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> al <strong className="text-white">{yearRange.end.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
                  <br />
                  <span className="text-yellow-200">El {yearRange.end.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} fue el <strong>último día de tu Retorno Solar anterior</strong>.</span>
                  <br />
                  <span className="text-orange-200 text-sm mt-2 inline-block">💡 Usa los botones superiores para cambiar entre ciclos disponibles.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR BANNER - Si hay errores cargando eventos */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-red-200 font-bold mb-1">Problema al cargar eventos</h3>
                <p className="text-red-300 text-sm">{error}</p>
                <p className="text-red-400 text-xs mt-2">
                  Por favor, revisa la consola del navegador para más detalles o intenta recargar la página.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DEBUG INFO - Mostrar cuando hay pocos o ningún evento */}
        {!loading && events.length === 0 && (
          <div className="mb-6 bg-yellow-900/50 border border-yellow-500/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div className="flex-1">
                <h3 className="text-yellow-200 font-bold mb-1">No hay eventos disponibles</h3>
                <p className="text-yellow-300 text-sm">
                  No se encontraron eventos astrológicos. Por favor, verifica:
                </p>
                <ul className="text-yellow-400 text-xs mt-2 list-disc list-inside space-y-1">
                  <li>Que tu fecha de nacimiento esté configurada correctamente</li>
                  <li>La consola del navegador para mensajes de diagnóstico</li>
                  <li>Tu conexión a internet</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT DESKTOP/MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CALENDARIO PRINCIPAL - 2/3 en desktop */}
          <div className="lg:col-span-2">

            {/* Header del calendario */}
            <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-white capitalize flex items-center">
                  <Calendar className="mr-3 h-7 w-7 lg:h-8 lg:w-8" />
                  Agenda Cósmica
                </h2>

                {/* Navegación de meses */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
                    title="Mes anterior"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <span className="text-white font-semibold min-w-[120px] text-center">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                  </span>

                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
                    title="Mes siguiente"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Calendario mensual */}
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-400/20 overflow-hidden">

              {/* Días de la semana */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-purple-700/30 to-indigo-700/30">
                {weekDays.map((day, index) => (
                  <div key={index} className="py-3 text-center text-sm font-bold text-purple-100 border-r border-purple-400/20 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes actual */}
              <div className="grid grid-cols-7">
                {getCurrentMonthDays().map((day, index) => {
                      const isToday = isSameDay(day.date, new Date());
                      const isSelected = selectedDate && isSameDay(day.date, selectedDate);

                      // 🎂 Detectar primer y último día del ciclo solar
                      const isFirstDayOfCycle = yearRange && isSameDay(day.date, yearRange.start);
                      const isLastDayOfCycle = yearRange && isSameDay(day.date, yearRange.end);

                      return (
                        <div
                          key={index}
                          onClick={() => handleDayClick(day)}
                          className={`
                            relative min-h-[80px] lg:min-h-[100px] p-2 cursor-pointer transition-all duration-300 border-r border-b border-purple-400/20 last:border-r-0 group
                            ${day.isCurrentMonth
                              ? isFirstDayOfCycle
                                ? 'bg-gradient-to-br from-green-600/30 to-emerald-600/30 border-2 border-green-400/60 shadow-lg shadow-green-500/30'
                                : isLastDayOfCycle
                                ? 'bg-gradient-to-br from-pink-600/30 to-rose-600/30 border-2 border-pink-400/60 shadow-lg shadow-pink-500/30'
                                : isToday
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                                : isSelected
                                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/60'
                                : 'bg-gradient-to-br from-purple-800/10 to-indigo-800/10 hover:from-purple-600/20 hover:to-indigo-600/20'
                              : 'bg-gradient-to-br from-gray-800/20 to-slate-800/20 text-gray-500'
                            }
                            ${isSelected && !isFirstDayOfCycle && !isLastDayOfCycle ? 'ring-4 ring-purple-400/80 ring-offset-2 ring-offset-purple-900/50' : ''}
                          `}
                        >
                          {/* Badge para primer/último día */}
                          {isFirstDayOfCycle && (
                            <div className="absolute -top-1 -left-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10">
                              🌱 Inicio
                            </div>
                          )}
                          {isLastDayOfCycle && (
                            <div className="absolute -top-1 -left-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10">
                              🎂 Final
                            </div>
                          )}

                          {/* Número del día */}
                          <div className={`
                            text-sm font-bold mb-1
                            ${isFirstDayOfCycle ? 'text-green-300' : isLastDayOfCycle ? 'text-pink-300' : isToday ? 'text-yellow-300' : day.isCurrentMonth ? 'text-white' : 'text-gray-500'}
                          `}>
                            {day.date.getDate()}
                          </div>

                          {/* Eventos del día con iconos */}
                          {day.hasEvents && (
                            <div className="space-y-1">
                              {day.events.slice(0, 2).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                  }}
                                  className={`
                                    flex items-start gap-1 p-1.5 rounded cursor-pointer transition-all duration-200 group-hover:scale-105
                                    bg-gradient-to-r ${getEventColor(event.type, event.priority)} bg-opacity-80 backdrop-blur-sm
                                    hover:shadow-lg hover:shadow-purple-500/30
                                  `}
                                >
                                  <span className="text-xs shrink-0">{getEventIcon(event.type, event.priority)}</span>
                                  <span className="text-white text-[10px] leading-tight font-medium line-clamp-2 flex-1">
                                    {event.title}
                                  </span>
                                  {event.priority === 'high' && (
                                    <span className="text-yellow-300 text-xs animate-pulse">!</span>
                                  )}
                                </div>
                              ))}

                              {day.events.length > 2 && (
                                <div className="text-purple-300 text-xs font-medium text-center bg-purple-600/20 rounded px-1 py-0.5">
                                  +{day.events.length - 2}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Efecto hover */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/40 rounded-lg transition-colors duration-200 pointer-events-none"></div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* EVENTOS DEL DÍA SELECCIONADO - Debajo del calendario */}
            {selectedDate && (
              <div className="mt-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-pink-400/30">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    {isSameDay(selectedDate, new Date())
                      ? `Hoy, ${selectedDate.getDate()} de ${format(selectedDate, 'MMMM', { locale: es })}`
                      : `${selectedDate.getDate()} de ${format(selectedDate, 'MMMM', { locale: es })}`}
                  </h3>
                  <p className="text-pink-200 text-sm">
                    {selectedDayEvents.length === 0
                      ? 'No hay eventos cósmicos para este día'
                      : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} cósmico${selectedDayEvents.length > 1 ? 's' : ''}`
                    }
                  </p>
                </div>

                {/* Lista de eventos - ancho completo */}
                {selectedDayEvents.length > 0 && (
                  <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`
                        bg-gradient-to-r ${getEventColor(event.type, event.priority)}/20 backdrop-blur-sm
                        rounded-2xl p-4 border border-white/20 hover:shadow-lg transition-all duration-200
                        cursor-pointer hover:scale-105
                      `}
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleEventLeave}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getEventIcon(event.type, event.priority)}</span>
                          <div>
                            <h4 className="font-bold text-white text-sm lg:text-base">{event.title}</h4>
                            {event.planet && event.sign && (
                              <p className="text-purple-200 text-xs">{event.planet} en {event.sign}</p>
                            )}
                          </div>
                        </div>
                        {event.priority === 'high' && (
                          <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            CRÍTICO
                          </span>
                        )}
                      </div>

                      <p className="text-gray-200 text-sm mb-3">{event.description}</p>

                      <div className="text-purple-300 text-xs italic">
                        Hover para ver interpretación completa ✨
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* CONTENIDO DE IMPRESIÓN OCULTO - Solo visible al imprimir */}
            <div className="print-only hidden">
              {/* Página 1: Vista anual completa */}
              <div className="print-month-overview">
                <h1 className="text-center text-3xl font-bold mb-8 text-black">
                  Agenda Astrológica Completa
                </h1>

                {/* Calendario anual para impresión */}
                <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
                  <p className="text-center text-purple-800 mb-4">
                    Vista completa del año astrológico (cumpleaños a cumpleaños)
                  </p>
                  <div className="text-center text-gray-600">
                    {yearRange ? `Del ${yearRange.start.toLocaleDateString('es-ES')} al ${yearRange.end.toLocaleDateString('es-ES')}` : 'Cargando rango...'}
                  </div>
                </div>
              </div>

              {/* Páginas de días individuales - Vista completa del año */}
              {(() => {
                const allDays = getYearView().flatMap(month => month.days.filter(day => day.isCurrentMonth && day.hasEvents));
                const daysPerPage = 3; // 3 días por página
                const pages = [];

                for (let i = 0; i < allDays.length; i += daysPerPage) {
                  const pageDays = allDays.slice(i, i + daysPerPage);
                  pages.push(
                    <div key={i} className="print-day-page">
                      <div className="print-days-grid">
                        {pageDays.map((day) => (
                          <div key={day.date.getTime()} className="print-day-card">
                            <div className="print-day-header">
                              {day.date.getDate()} de {format(day.date, 'MMMM', { locale: es })}
                            </div>

                            {day.hasEvents && (
                              <div className="print-day-events">
                                {day.events.map((event, eventIndex) => (
                                  <div key={eventIndex} className="print-day-event">
                                    <div className="font-semibold text-purple-800">
                                      {getEventIcon(event.type, event.priority)} {event.title}
                                    </div>
                                    <div className="text-gray-600 text-xs mt-1">
                                      {event.description}
                                    </div>
                                    {event.planet && event.sign && (
                                      <div className="text-purple-600 text-xs mt-1">
                                        {event.planet} en {event.sign}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="print-exercises-space">
                              <div className="print-exercises-title">
                                📝 Ejercicios y tareas para hoy:
                              </div>
                              <div className="print-exercises-lines">
                                1. ________________________________________________________________<br/>
                                2. ________________________________________________________________<br/>
                                3. ________________________________________________________________<br/>
                                4. ________________________________________________________________<br/>
                                5. ________________________________________________________________<br/>
                                <br/>
                                Notas adicionales:<br/>
                                ________________________________________________________________<br/>
                                ________________________________________________________________<br/>
                                ________________________________________________________________<br/>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return pages;
              })()}
            </div>
          </div>

          {/* SIDEBAR - 1/3 en desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">

              {/* SECCIÓN UNIFICADA DE PLANETAS */}
              <PlanetarySection activePlanets={activePlanets} />

              {/* CTA inspirado en Dididaze */}
              <div className="mt-6 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 text-center">
                <div className="text-2xl mb-3">🔮</div>
                <h4 className="text-white font-bold mb-2">¿Quieres más magia?</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Descubre interpretaciones aún más profundas de tu carta natal
                </p>
                <Link
                  href="/natal-chart"
                  className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explorar más ✨
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TOOLTIP ÉPICO */}
        {hoveredEvent && hoveredEvent.aiInterpretation && (
          <div
            className="fixed bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6 shadow-2xl max-w-sm pointer-events-none z-[202]"
            style={{
              left: Math.min(tooltipPosition.x - 200, window.innerWidth - 400),
              top: tooltipPosition.y - 20,
              transform: 'translateY(-100%)'
            }}
          >
            {/* Header */}
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{getEventIcon(hoveredEvent.type, hoveredEvent.priority)}</span>
              <div>
                <div className="text-white font-bold">{hoveredEvent.title}</div>
                <div className="text-purple-200 text-sm">
                  {hoveredEvent.planet && hoveredEvent.sign && `${hoveredEvent.planet} en ${hoveredEvent.sign}`}
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="text-yellow-300 font-semibold text-sm mb-1 flex items-center">
                  <span className="mr-2">🔥</span>SIGNIFICADO:
                </div>
                <div className="text-white text-sm leading-relaxed">
                  {hoveredEvent.aiInterpretation.meaning}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="text-emerald-300 font-semibold text-sm mb-1 flex items-center">
                  <span className="mr-2">⚡</span>CONSEJO:
                </div>
                <div className="text-white text-sm leading-relaxed">
                  {hoveredEvent.aiInterpretation.advice}
                </div>
              </div>

              {hoveredEvent.aiInterpretation.mantra && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                  <div className="text-yellow-300 font-semibold text-sm mb-1">✨ MANTRA:</div>
                  <div className="text-white text-sm font-medium italic">
                    "{hoveredEvent.aiInterpretation.mantra}"
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL CENTRADO CON OVERLAY */}
        {showEventModal && modalEvent && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              onClick={closeEventModal}
            />

            {/* Modal centrado */}
            <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
              <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{getEventIcon(modalEvent.type, modalEvent.priority)}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{modalEvent.title}</h2>
                        <p className="text-purple-200 text-sm">
                          {new Date(modalEvent.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        {modalEvent.planet && modalEvent.sign && (
                          <p className="text-purple-300 text-xs mt-1">
                            {modalEvent.planet} en {modalEvent.sign}
                            {modalEvent.house && ` • Casa ${modalEvent.house}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botón cerrar */}
                    <button
                      onClick={closeEventModal}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Nivel de importancia */}
                  {modalEvent.priority === 'high' && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2">
                      <span className="text-red-300 text-sm font-medium">🔥 PRIORIDAD CRÍTICA</span>
                    </div>
                  )}
                </div>

                {/* Contenido del modal con scroll */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* 📅 RESUMEN DIARIO: Lista de eventos del día */}
                  {modalEvent.type === 'daily_summary' && (modalEvent as any).events && (
                    <div>
                      <p className="text-purple-200 text-sm mb-6 text-center">
                        Click en cualquier evento para ver su interpretación completa
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {((modalEvent as any).events as AstrologicalEvent[]).map((event) => (
                          <button
                            key={event.id}
                            onClick={() => {
                              // Cerrar modal actual y abrir con el evento específico
                              setModalEvent(event);
                            }}
                            className={`
                              bg-gradient-to-r ${getEventColor(event.type, event.priority)}/20 backdrop-blur-sm
                              rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-200
                              cursor-pointer hover:scale-105 text-left
                            `}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-3xl">{getEventIcon(event.type, event.priority)}</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-white text-sm">{event.title}</h4>
                                {event.planet && event.sign && (
                                  <p className="text-purple-200 text-xs mt-1">{event.planet} en {event.sign}</p>
                                )}
                              </div>
                              {event.priority === 'high' && (
                                <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  CRÍTICO
                                </span>
                              )}
                            </div>

                            <p className="text-gray-300 text-xs line-clamp-2">{event.description}</p>

                            <div className="mt-3 text-purple-400 text-xs flex items-center gap-1">
                              <span>Ver detalles</span>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🎂 SECCIÓN ESPECIAL: Primer/Último Día del Ciclo Solar */}
                  {(modalEvent as any).metadata?.guidance && (
                    <div className={`mb-6 bg-gradient-to-br ${
                      (modalEvent as any).metadata.color === 'green'
                        ? 'from-green-600/20 to-emerald-600/20 border-green-400/40'
                        : 'from-pink-600/20 to-rose-600/20 border-pink-400/40'
                    } border-2 rounded-3xl p-6`}>
                      {/* Subtítulo */}
                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold text-white/90">
                          {(modalEvent as any).metadata.subtitle}
                        </p>
                      </div>

                      {/* Descripción */}
                      <div className="mb-6">
                        <p className="text-white/90 leading-relaxed text-center">
                          {(modalEvent as any).metadata.description}
                        </p>
                      </div>

                      {/* Pautas / Guía */}
                      <div className="bg-black/20 rounded-2xl p-5 mb-5">
                        <h3 className={`text-lg font-bold mb-4 flex items-center ${
                          (modalEvent as any).metadata.color === 'green' ? 'text-green-300' : 'text-pink-300'
                        }`}>
                          <span className="mr-2">🌟</span>
                          PAUTAS PARA ESTE DÍA SAGRADO
                        </h3>
                        <div className="space-y-3">
                          {(modalEvent as any).metadata.guidance.map((guide: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`min-w-[8px] h-[8px] rounded-full mt-2 ${
                                (modalEvent as any).metadata.color === 'green' ? 'bg-green-400' : 'bg-pink-400'
                              }`} />
                              <p className="text-white/90 leading-relaxed">{guide}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mantra especial */}
                      <div className={`bg-gradient-to-r ${
                        (modalEvent as any).metadata.color === 'green'
                          ? 'from-green-500/20 to-emerald-500/20 border-green-400/30'
                          : 'from-pink-500/20 to-rose-500/20 border-pink-400/30'
                      } border-2 rounded-2xl p-5 text-center`}>
                        <h3 className="text-md font-semibold text-white/80 mb-2 flex items-center justify-center">
                          <span className="mr-2">🙏</span>
                          MANTRA PARA HOY
                        </h3>
                        <p className="text-white text-lg font-medium italic leading-relaxed">
                          "{(modalEvent as any).metadata.mantra}"
                        </p>
                      </div>

                      {/* Botón generar nuevo ciclo (solo en primer día) */}
                      {(modalEvent as any).metadata?.showNewCycleButton && (
                        <div className="mt-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-2 border-yellow-400/40 rounded-2xl p-6 text-center">
                          <h3 className="text-lg font-bold text-yellow-300 mb-3">
                            🌅 ¿Listo para tu Nuevo Año Astrológico?
                          </h3>
                          <p className="text-white/90 text-sm mb-4 leading-relaxed">
                            Genera los eventos del próximo ciclo solar ({yearRange?.end ? yearRange.end.getFullYear() + 1 : new Date().getFullYear() + 1}-{yearRange?.end ? yearRange.end.getFullYear() + 2 : new Date().getFullYear() + 2}) para empezar a planificar tu nuevo año.
                          </p>
                          <button
                            onClick={async () => {
                              // Generar nuevo ciclo usando la nueva función
                              await generateNewCycle();

                              // Navegar al inicio del nuevo ciclo (próximo cumpleaños)
                              if (userProfile?.birthDate) {
                                const birthDate = new Date(userProfile.birthDate);
                                const currentYear = new Date().getFullYear();
                                const nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());

                                setSelectedDate(nextBirthday);
                                setCurrentMonth(nextBirthday);

                                console.log('[NEW-CYCLE] Navegando al inicio del nuevo ciclo:', nextBirthday.toDateString());
                              }

                              closeEventModal();
                            }}
                            disabled={generatingCycle || loadingYearEvents}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {generatingCycle || loadingYearEvents ? (
                              <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Generando...
                              </span>
                            ) : (
                              '🔄 Generar Nuevo Ciclo Solar'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Descripción (solo si NO es un día especial) */}
                  {!(modalEvent as any).metadata?.guidance && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="text-purple-300 mr-2">📝</span>
                        Descripción del Evento
                      </h3>
                      <p className="text-gray-200 leading-relaxed">{modalEvent.description}</p>
                    </div>
                  )}

                  {/* Interpretación personalizada */}
                  {modalEvent.aiInterpretation && (
                    <div className="space-y-6">
                      {/* Significado épico */}
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                          <span className="mr-2">🔥</span>
                          SIGNIFICADO ÉPICO
                        </h3>
                        <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.meaning}</p>
                      </div>

                      {/* Consejo revolucionario */}
                      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center">
                          <span className="mr-2">⚡</span>
                          CONSEJO REVOLUCIONARIO
                        </h3>
                        <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.advice}</p>
                      </div>

                      {/* Mantra */}
                      {modalEvent.aiInterpretation.mantra && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-2xl p-5 text-center">
                          <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center justify-center">
                            <span className="mr-2">✨</span>
                            MANTRA DE PODER
                          </h3>
                          <p className="text-white text-lg font-medium italic">
                            "{modalEvent.aiInterpretation.mantra}"
                          </p>
                        </div>
                      )}

                      {/* Ritual opcional */}
                      {modalEvent.aiInterpretation.ritual && (
                        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-400/20 rounded-2xl p-5">
                          <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center">
                            <span className="mr-2">🔮</span>
                            RITUAL RECOMENDADO
                          </h3>
                          <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.ritual}</p>
                        </div>
                      )}

                      {/* Áreas de vida activadas */}
                      {modalEvent.aiInterpretation.lifeAreas && (
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl p-5">
                          <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center">
                            <span className="mr-2">🎯</span>
                            ÁREAS DE VIDA ACTIVADAS
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {modalEvent.aiInterpretation.lifeAreas.map((area: string, index: number) => (
                              <span key={index} className="bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 px-3 py-1 rounded-full text-sm">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🌟 INTERPRETACIÓN PERSONALIZADA PROFUNDA - Siempre visible */}
                  {user?.uid && modalEvent && !(modalEvent as any).metadata?.guidance && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 rounded-2xl p-6 mt-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                          <span className="mr-2">✨</span>
                          Interpretación ULTRA Personalizada
                        </h3>
                        <p className="text-purple-200 text-sm mb-4">
                          Genera una interpretación única cruzando <strong>TU carta natal + Solar Return + Este evento</strong> que analiza:
                        </p>
                        <ul className="text-purple-200 text-sm space-y-1 mb-4 ml-4">
                          <li>✓ Cómo este evento te afecta específicamente</li>
                          <li>✓ Qué fortalezas de tu carta usar</li>
                          <li>✓ Qué bloqueos transformar</li>
                          <li>✓ Ejercicios concretos para este momento</li>
                          <li>✓ Mantra personalizado con tus posiciones planetarias</li>
                          <li>✓ Timing evolutivo preciso</li>
                        </ul>
                        {modalEvent.house && (
                          <div className="bg-purple-700/30 rounded-lg p-3 text-sm text-purple-100 mb-4">
                            <strong>📍 Casa Activada:</strong> Casa {modalEvent.house} de tu carta natal
                          </div>
                        )}
                      </div>

                      <EventInterpretationButton
                        userId={user.uid}
                        event={{
                          type: mapEventTypeToInterpretation(modalEvent).type,
                          date: modalEvent.date,
                          sign: modalEvent.sign || 'Desconocido',
                          house: mapEventTypeToInterpretation(modalEvent).house,
                          planetsInvolved: modalEvent.planet ? [modalEvent.planet] : []
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Footer del modal */}
                <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="text-purple-200 text-sm">
                      <span className="font-medium">Tipo:</span> {modalEvent.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <button
                      onClick={closeEventModal}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
                    >
                      Cerrar ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODAL DE DÍA SELECCIONADO */}
        {showDayModal && selectedDate && selectedDayEvents.length > 0 && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
              onClick={() => setShowDayModal(false)}
            />

            {/* Modal fullscreen */}
            <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
              <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">📅</span>
                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {selectedDate.getDate()} de {format(selectedDate, 'MMMM', { locale: es })}
                        </h2>
                        <p className="text-purple-200 text-sm">
                          {selectedDayEvents.length} evento{selectedDayEvents.length > 1 ? 's' : ''} cósmico{selectedDayEvents.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Botón cerrar */}
                    <button
                      onClick={() => setShowDayModal(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contenido del modal con grid de 2 columnas */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`
                          bg-gradient-to-r ${getEventColor(event.type, event.priority)}/20 backdrop-blur-sm
                          rounded-2xl p-5 border border-white/20 hover:shadow-lg transition-all duration-200
                          hover:scale-105 cursor-pointer
                        `}
                        onClick={() => {
                          setShowDayModal(false);
                          setModalEvent(event);
                          setShowEventModal(true);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getEventIcon(event.type, event.priority)}</span>
                            <div>
                              <h4 className="font-bold text-white text-base">{event.title}</h4>
                              {event.planet && event.sign && (
                                <p className="text-purple-200 text-xs">{event.planet} en {event.sign}</p>
                              )}
                            </div>
                          </div>
                          {event.priority === 'high' && (
                            <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              CRÍTICO
                            </span>
                          )}
                        </div>

                        <p className="text-gray-200 text-sm mb-4 line-clamp-3">{event.description}</p>

                        <div className="flex items-center justify-between text-purple-300 text-xs">
                          <span>Click para ver detalles completos</span>
                          <span>→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer del modal */}
                <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-t border-white/20">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setShowDayModal(false)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
                    >
                      Cerrar ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AgendaPersonalizada;
