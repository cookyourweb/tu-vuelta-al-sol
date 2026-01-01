//src/app/(dashboard)/agenda/page.tsx - NUEVO UX DISRUPTIVO CON CARGA LAZY
'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addWeeks, subWeeks, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UserProfile, AstrologicalEvent, EventType } from '@/types/astrology/unified-types';

import EventsLoadingModal from '@/components/astrology/EventsLoadingModal';
import EventInterpretationButton from '@/components/agenda/EventInterpretationButton';
import AgendaBookGenerator from '@/components/agenda/AgendaBookGenerator';
import AperturaAnual from '@/components/agenda/AperturaAnual';
import FichasPlanetarias from '@/components/agenda/FichasPlanetarias';
import CalendarioSidebar from '@/components/agenda/CalendarioSidebar';
import EventModal from '@/components/agenda/EventModal';

interface AstronomicalDay {
  date: Date;
  events: AstrologicalEvent[];
  isCurrentMonth: boolean;
  hasEvents: boolean;
}

const AgendaPersonalizada = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
  // Estados para carga de agenda completa (birthday to next birthday)
  const [loadingYearEvents, setLoadingYearEvents] = useState(false);
  const [yearRange, setYearRange] = useState<{start: Date, end: Date} | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [loadingMonthlyEvents, setLoadingMonthlyEvents] = useState(false);
  const [loadingMonthName, setLoadingMonthName] = useState<string>('');
  // Estados para vista mensual/semanal
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [weekData, setWeekData] = useState<any | null>(null);
  const [loadingWeekData, setLoadingWeekData] = useState(false);

  // Estados para vista de calendario
  const [calendarView, setCalendarView] = useState<'mes' | 'semana' | 'dia'>('mes');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [eventFilter, setEventFilter] = useState<'all' | 'moon_phase' | 'eclipse' | 'retrograde' | 'high_priority'>('all');

  // Perfil de usuario REAL (no datos de prueba)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  // Estados para interpretaciones
  const [solarReturnInterpretation, setSolarReturnInterpretation] = useState<any | null>(null);
  const [natalInterpretation, setNatalInterpretation] = useState<any | null>(null);
  const [loadingInterpretations, setLoadingInterpretations] = useState(false);

  // Estados para planetas activos del año
  const [activePlanets, setActivePlanets] = useState<any[]>([]);
  const [loadingActivePlanets, setLoadingActivePlanets] = useState(false);

  // Estados para interpretación V3 cruzada del evento
  const [crossedInterpretation, setCrossedInterpretation] = useState<any | null>(null);
  const [loadingCrossedInterpretation, setLoadingCrossedInterpretation] = useState(false);

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

  // 🌟 Cargar interpretaciones (Retorno Solar y Carta Natal)
  React.useEffect(() => {
    const fetchInterpretations = async () => {
      if (!user?.uid) return;

      setLoadingInterpretations(true);

      try {
        // Fetch Retorno Solar
        const srRes = await fetch(`/api/interpretations?userId=${user.uid}&chartType=solar-return`);
        if (srRes.ok) {
          const srData = await srRes.json();
          if (srData && srData.interpretation) {
            console.log('✅ [INTERPRETATIONS] Solar Return loaded:', srData.interpretation);
            setSolarReturnInterpretation(srData.interpretation);
          }
        }

        // Fetch Carta Natal
        const natalRes = await fetch(`/api/interpretations?userId=${user.uid}&chartType=natal`);
        if (natalRes.ok) {
          const natalData = await natalRes.json();
          if (natalData && natalData.interpretation) {
            console.log('✅ [INTERPRETATIONS] Natal chart loaded:', natalData.interpretation);
            setNatalInterpretation(natalData.interpretation);
          }
        }
      } catch (error) {
        console.error('❌ [INTERPRETATIONS] Error fetching interpretations:', error);
      } finally {
        setLoadingInterpretations(false);
      }
    };

    // Cargar interpretaciones para la apertura anual
    fetchInterpretations();
  }, [user]);

  // 🌟 Cargar planetas activos del año
  React.useEffect(() => {
    const fetchActivePlanets = async () => {
      if (!user?.uid) return;

      setLoadingActivePlanets(true);

      try {
        const currentYear = new Date().getFullYear();
        const res = await fetch(`/api/agenda/planetary-activation?userId=${user.uid}&year=${currentYear}`);

        if (res.ok) {
          const data = await res.json();
          if (data && data.planetas_activos) {
            console.log('✅ [PLANETAS ACTIVOS] Loaded:', data.planetas_activos);
            setActivePlanets(data.planetas_activos);
          }
        }
      } catch (error) {
        console.error('❌ [PLANETAS ACTIVOS] Error fetching active planets:', error);
      } finally {
        setLoadingActivePlanets(false);
      }
    };

    // Cargar planetas activos para las fichas
    if (user?.uid) {
      fetchActivePlanets();
    }
  }, [user]);

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

  // 📅 CARGA COMPLETA: Fetch Year Events (birthday to next birthday)
  const fetchYearEvents = async (): Promise<AstrologicalEvent[]> => {
    if (!userProfile || !userProfile.birthDate) {
      console.log('⚠️ [YEAR-EVENTS] Cannot fetch - missing userProfile or birthDate');
      return [];
    }

    try {
      console.log('📅 [YEAR-EVENTS] Fetching complete year events from birthday to next birthday...');

      // 🔧 FIX: Parse birth date carefully to avoid timezone issues
      const birthDate = new Date(userProfile.birthDate);
      const birthMonth = birthDate.getMonth(); // 0-indexed (0=Jan, 1=Feb, etc)
      const birthDay = birthDate.getDate();

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      // 📊 DEBUG: Log current state
      console.log('📊 [DEBUG] Current state:', {
        now: now.toISOString(),
        currentYear,
        currentMonth,
        currentDay,
        birthMonth,
        birthDay,
        userProfileBirthDate: userProfile.birthDate
      });

      // Fecha de cumpleaños de este año (en hora local para evitar problemas de timezone)
      const currentBirthday = new Date(currentYear, birthMonth, birthDay, 0, 0, 0, 0);

      // 📊 DEBUG: Log comparison values
      console.log('📊 [DEBUG] Birthday comparison:', {
        currentBirthday: currentBirthday.toISOString(),
        now: now.toISOString(),
        hasBirthdayPassedThisYear: currentBirthday <= now
      });

      // Determinar el rango: siempre desde el ÚLTIMO cumpleaños hasta el PRÓXIMO
      let startDate: Date;
      let endDate: Date;

      if (currentBirthday <= now) {
        // El cumpleaños ya pasó este año
        startDate = new Date(currentYear, birthMonth, birthDay, 0, 0, 0, 0); // Último cumpleaños (este año)
        endDate = new Date(currentYear + 1, birthMonth, birthDay, 0, 0, 0, 0); // Próximo cumpleaños (año que viene)
        console.log('✅ [YEAR-EVENTS] Birthday has passed this year');
      } else {
        // El cumpleaños todavía no llegó este año
        startDate = new Date(currentYear - 1, birthMonth, birthDay, 0, 0, 0, 0); // Último cumpleaños (año pasado)
        endDate = new Date(currentYear, birthMonth, birthDay, 0, 0, 0, 0); // Próximo cumpleaños (este año)
        console.log('✅ [YEAR-EVENTS] Birthday has NOT passed yet this year');
      }

      setYearRange({ start: startDate, end: endDate });

      // 🔧 FIX: Use date-fns format to avoid timezone conversion issues
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

      console.log('📅 [YEAR-EVENTS] Year range (LOCAL):', {
        start: startDateStr,
        end: endDateStr,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear()
      });

      const yearToFetch = startDate.getFullYear();

      console.log('📤 [YEAR-EVENTS] Sending request to API:', {
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        birthPlace: userProfile.birthPlace,
        currentYear: yearToFetch,
        expectedRange: `${startDateStr} to ${endDateStr}`
      });

      const response = await fetch('/api/astrology/solar-year-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: userProfile.birthDate,
          birthTime: userProfile.birthTime,
          birthPlace: userProfile.birthPlace,
          currentYear: yearToFetch
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [YEAR-EVENTS] Failed to fetch solar year events');
        console.error('❌ [YEAR-EVENTS] Error response:', errorText);
        return generateExampleEvents();
      }

      const result = await response.json();
      console.log('✅ [YEAR-EVENTS] Solar year events fetched successfully');
      console.log('📊 [YEAR-EVENTS] Stats:', result.stats);
      console.log('📊 [YEAR-EVENTS] API returned period:', result.period);

      // 🔍 DEBUG: Log sample events to verify zodiac signs (tropical vs vedic)
      console.log('🔍 [DEBUG] Sample Lunar Phases:', result.data.events.lunarPhases?.slice(0, 3).map((p: any) => ({
        date: p.date,
        phase: p.phase,
        sign: p.zodiacSign,
        type: p.type
      })));
      console.log('🔍 [DEBUG] Sample Retrogrades:', result.data.events.retrogrades?.slice(0, 2).map((r: any) => ({
        planet: r.planet,
        startDate: r.startDate,
        endDate: r.endDate,
        sign: r.sign || r.startSign
      })));
      console.log('🔍 [DEBUG] Sample Planetary Ingresses:', result.data.events.planetaryIngresses?.slice(0, 3).map((i: any) => ({
        planet: i.planet,
        date: i.date,
        fromSign: i.fromSign,
        toSign: i.toSign || i.newSign
      })));

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
            title: `🪐 ${ingress.planet} entra en ${ingress.newSign}`,
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
          title: `🪐 ${ingress.planet} entra en ${ingress.newSign}`,
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

    const loadYearEvents = async () => {
      setLoading(true);
      setLoadingYearEvents(true);
      console.log('📅 [AGENDA] Loading complete year events (birthday to birthday)...');

      try {
        const yearEvents = await fetchYearEvents();
        console.log(`✅ [AGENDA] Loaded ${yearEvents.length} events for the complete year`);

        // ⚡ FILTRAR eventos importantes (pero incluir retrogradaciones, tránsitos y aspectos clave)
        const importantEvents = yearEvents.filter((e: AstrologicalEvent) => {
          return (
            e.type === 'lunar_phase' ||      // Lunas nuevas/llenas
            e.type === 'eclipse' ||          // Eclipses
            e.type === 'retrograde' ||       // Planetas retrógrados
            e.type === 'direct' ||           // Planetas directos (fin de retrogradación)
            e.type === 'planetary_transit' || // Cambios de signo (Júpiter, Saturno, etc.)
            e.type === 'seasonal' ||         // Equinoccios y solsticios
            e.type === 'aspect' ||           // Aspectos planetarios importantes
            e.priority === 'high'            // Cualquier evento de alta prioridad
          );
        });
        console.log(`✅ [AGENDA] Filtered to ${importantEvents.length} important events (lunas, eclipses, retrogradaciones, tránsitos, aspectos)`);

        setEvents(importantEvents);
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

    loadYearEvents();
  }, [userProfile]);

  // 📅 Inicializar currentMonth al mes actual (no al cumpleaños)
  useEffect(() => {
    if (yearRange) {
      const now = new Date();
      console.log('📅 [AGENDA] Setting currentMonth to current month:', now);
      // Ya está inicializado en useState con new Date(), pero lo reforzamos
      setCurrentMonth(now);
    }
  }, [yearRange]);

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
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(day, eventDate);
      });

      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentMonth),
        hasEvents: dayEvents.length > 0
      };
    });

    return daysWithEvents;
  };

  // 📆 Obtener días de la semana actual con eventos (para vista semanal)
  const getCurrentWeekDays = () => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 }); // Lunes
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 }); // Domingo

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const daysWithEvents = days.map(day => {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(day, eventDate);
      });

      return {
        date: day,
        dayName: format(day, 'EEEE', { locale: es }),
        dayNumber: format(day, 'd'),
        monthName: format(day, 'MMM', { locale: es }),
        events: dayEvents,
        isToday: isSameDay(day, new Date()),
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
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return isSameDay(day, eventDate);
        });

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



  const handleDayClick = async (day: AstronomicalDay) => {
    setSelectedDate(day.date);
    setSelectedDayEvents(day.events);

    // 🌟 NUEVO: Cargar interpretaciones personalizadas para eventos HIGH/MEDIUM
    const importantEvents = day.events.filter(e => e.priority === 'high' || e.priority === 'medium');

    if (importantEvents.length > 0 && user && userProfile) {
      console.log(`🔮 [INTERPRETATIONS] Loading personalized interpretations for ${importantEvents.length} events`);

      // Cargar interpretaciones en background (no bloquear UI)
      loadEventInterpretations(importantEvents);
    }
  };

  // 🔮 Cargar interpretaciones personalizadas para eventos
  const loadEventInterpretations = async (events: AstrologicalEvent[]) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      // Cargar interpretaciones para cada evento importante
      for (const event of events) {
        // Si ya tiene interpretación personalizada, skip
        if (event.aiInterpretation && 'capa_2_aplicado' in event.aiInterpretation && (event.aiInterpretation as any).capa_2_aplicado) continue;

        try {
          const response = await fetch('/api/interpretations/event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              event: {
                type: event.type === 'lunar_phase' ? 'luna_nueva' :
                      event.type === 'retrograde' ? 'transito' :
                      event.type === 'eclipse' ? 'transito' : 'aspecto',
                date: event.date,
                sign: event.sign,
                house: 1, // TODO: calcular casa real basada en carta natal
                planetsInvolved: event.planet ? [event.planet] : [],
                transitingPlanet: event.planet,
              },
              regenerate: false
            })
          });

          if (response.ok) {
            const data = await response.json();

            // Actualizar el evento con la interpretación personalizada
            setSelectedDayEvents(prev => prev.map(e =>
              e.id === event.id
                ? { ...e, aiInterpretation: data.interpretation }
                : e
            ));

            console.log(`✅ [INTERPRETATIONS] Loaded for ${event.title}`);
          }
        } catch (err) {
          console.error(`❌ [INTERPRETATIONS] Error loading for ${event.title}:`, err);
        }
      }
    } catch (error) {
      console.error('❌ [INTERPRETATIONS] Error getting token:', error);
    }
  };

  // Modal handlers (reemplaza tooltip)
  const handleEventClick = async (event: AstrologicalEvent) => {
    setModalEvent(event);
    setShowEventModal(true);

    // ✅ Cargar interpretación V3 cruzada si hay planetas activos
    if (user?.uid && activePlanets.length > 0) {
      setLoadingCrossedInterpretation(true);
      setCrossedInterpretation(null); // Reset previous

      try {
        const res = await fetch('/api/agenda/event-crossed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            event: event,
            skipCache: false
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.interpretation) {
            console.log('✅ [V3 CROSSED] Loaded interpretation:', data.interpretation);
            setCrossedInterpretation(data.interpretation);
          }
        }
      } catch (error) {
        console.error('❌ [V3 CROSSED] Error loading interpretation:', error);
      } finally {
        setLoadingCrossedInterpretation(false);
      }
    }
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setModalEvent(null);
    setCrossedInterpretation(null);
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
  const mapEventTypeToInterpretation = (event: AstrologicalEvent): {
    type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
    date: string;
    sign?: string;
    house: number;
    planetsInvolved?: string[];
    transitingPlanet?: string;
    natalPlanet?: string;
    aspectType?: string;
  } => {
    let type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
    let sign = event.sign;
    let planetsInvolved: string[] = [];
    let transitingPlanet: string | undefined;
    let natalPlanet: string | undefined;
    let aspectType: string | undefined;

    // Mapear tipo de evento y extraer información específica
    if (event.type === 'lunar_phase') {
      // Determinar si es Luna Nueva o Llena basado en el título o descripción
      type = event.title.toLowerCase().includes('nueva') || event.phase?.toLowerCase().includes('nueva') ? 'luna_nueva' : 'luna_llena';
      planetsInvolved = ['Luna'];
      if (event.planet && event.planet !== 'Luna') {
        planetsInvolved.push(event.planet);
      }
    } else if (event.type === 'retrograde') {
      type = 'transito';
      transitingPlanet = event.planet;
      natalPlanet = event.planet; // Para retrógrados, el planeta natal es el mismo
      aspectType = 'retrógrado';
    } else if (event.type === 'planetary_transit') {
      type = 'transito';
      transitingPlanet = event.planet;
      // Para tránsitos, intentar identificar el planeta natal basado en el contexto
      if (event.description) {
        // Buscar menciones de planetas en la descripción
        const planetMatches = event.description.match(/(Sol|Luna|Mercurio|Venus|Marte|Júpiter|Saturno|Urano|Neptuno|Plutón)/g);
        if (planetMatches && planetMatches.length > 0) {
          natalPlanet = planetMatches[0];
        }
      }
      aspectType = 'tránsito';
    } else if (event.type === 'aspect') {
      type = 'aspecto';
      transitingPlanet = event.planet;
      aspectType = 'aspecto';
    } else if (event.type === 'eclipse') {
      type = 'aspecto'; // Los eclipses se tratan como aspectos especiales
      planetsInvolved = ['Sol', 'Luna'];
      aspectType = event.title.toLowerCase().includes('solar') ? 'eclipse_solar' : 'eclipse_lunar';
    } else {
      type = 'aspecto'; // Default
    }

    // ✅ Calcular casa: usar la del evento si existe, o calcular basándose en el signo
    let house: number;
    if (event.house && event.house >= 1 && event.house <= 12) {
      house = event.house;
    } else if (event.sign && userProfile?.astrological?.signs?.ascendant) {
      // Calcular casa aproximada basándose en el signo del evento y el ascendente
      house = calculateHouseFromSign(event.sign, userProfile.astrological.signs.ascendant);
    } else {
      // Default: usar casa 1
      house = 1;
    }

    return {
      type,
      date: event.date,
      sign,
      house,
      planetsInvolved: planetsInvolved.length > 0 ? planetsInvolved : undefined,
      transitingPlanet,
      natalPlanet,
      aspectType
    };
  };

  // Helper para calcular casa aproximada desde signo (simple: asume casas enteras)
  const calculateHouseFromSign = (eventSign: string, ascendantSign: string): number => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    const eventIndex = signs.findIndex(s => s.toLowerCase() === eventSign.toLowerCase());
    const ascIndex = signs.findIndex(s => s.toLowerCase() === ascendantSign.toLowerCase());

    if (eventIndex === -1 || ascIndex === -1) return 1;

    // Casa = distancia desde el ascendente + 1
    let house = ((eventIndex - ascIndex + 12) % 12) + 1;
    return house;
  };

  const generatePages = () => {
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
  };

  return (
    <div className="relative max-w-7xl mx-auto p-4 lg:p-8">

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
                      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                      onClick={() => setShowPersonalityModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
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

            {/* Estadísticas de progreso */}
            <div className="flex justify-center items-center space-x-6 text-sm">
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
          </div>
        </div>

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

        {/* A. APERTURA ANUAL */}
        <AperturaAnual
          userProfile={userProfile}
          solarReturnInterpretation={solarReturnInterpretation}
        />

        {/* B. FICHAS PLANETARIAS */}
        <FichasPlanetarias
          activePlanets={activePlanets}
          loadingActivePlanets={loadingActivePlanets}
        />

        {/* 📖 TAB: MI AÑO */}
        {activeTab === 'mi-anio' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">📖</span>
                Mi Año Cósmico
              </h2>

              {loadingInterpretations ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
                  <p className="text-white">Cargando tu interpretación del año...</p>
                </div>
              ) : !solarReturnInterpretation ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-white mb-4">No tienes interpretación de Retorno Solar aún</h3>
                  <p className="text-gray-300 mb-6">Genera tu Retorno Solar para ver el contenido de tu año cósmico</p>
                  <button
                    onClick={() => window.location.href = '/solar-return'}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
                  >
                    Generar Retorno Solar
                  </button>
                </div>
              ) : (
                <div className="space-y-8 text-white">
                  {/* 🌟 CAPA 1: APERTURA ANUAL */}
                  {solarReturnInterpretation.apertura_anual && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl p-8 border-2 border-yellow-400/40">
                        <h2 className="text-3xl font-bold mb-6 text-yellow-300 flex items-center gap-3">
                          <span>🌟</span>
                          Apertura Anual {solarReturnInterpretation.apertura_anual.ano_solar}
                        </h2>

                        <div className="space-y-4">
                          {solarReturnInterpretation.apertura_anual.tema_central && (
                            <div className="bg-black/20 rounded-xl p-4">
                              <h3 className="text-xl font-bold text-yellow-200 mb-2">🎯 Tema Central</h3>
                              <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.apertura_anual.tema_central}</p>
                            </div>
                          )}

                          {solarReturnInterpretation.apertura_anual.eje_del_ano && (
                            <div className="bg-black/20 rounded-xl p-4">
                              <h3 className="text-xl font-bold text-orange-200 mb-2">⚡ Eje del Año</h3>
                              <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.apertura_anual.eje_del_ano}</p>
                            </div>
                          )}

                          {solarReturnInterpretation.apertura_anual.como_se_siente && (
                            <div className="bg-black/20 rounded-xl p-4">
                              <h3 className="text-xl font-bold text-yellow-200 mb-2">💫 Cómo Se Siente Este Año</h3>
                              <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.apertura_anual.como_se_siente}</p>
                            </div>
                          )}

                          {solarReturnInterpretation.apertura_anual.conexion_natal && (
                            <div className="bg-black/20 rounded-xl p-4">
                              <h3 className="text-xl font-bold text-orange-200 mb-2">🔗 Conexión con Tu Carta Natal</h3>
                              <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.apertura_anual.conexion_natal}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 🎭 CAPA 2: CÓMO SE VIVE SIENDO TÚ */}
                  {solarReturnInterpretation.como_se_vive_siendo_tu && (
                    <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl p-8 border-2 border-purple-400/40">
                      <h2 className="text-3xl font-bold mb-6 text-purple-300 flex items-center gap-3">
                        <span>🎭</span>
                        Cómo Se Vive Siendo Tú
                      </h2>

                      <div className="space-y-4">
                        {solarReturnInterpretation.como_se_vive_siendo_tu.facilidad && (
                          <div className="bg-black/20 rounded-xl p-4">
                            <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.como_se_vive_siendo_tu.facilidad}</p>
                          </div>
                        )}

                        {solarReturnInterpretation.como_se_vive_siendo_tu.incomodidad && (
                          <div className="bg-black/20 rounded-xl p-4">
                            <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.como_se_vive_siendo_tu.incomodidad}</p>
                          </div>
                        )}

                        {solarReturnInterpretation.como_se_vive_siendo_tu.medida_del_ano && (
                          <div className="bg-black/20 rounded-xl p-4 border-l-4 border-purple-400">
                            <p className="text-purple-200 font-semibold leading-relaxed">{solarReturnInterpretation.como_se_vive_siendo_tu.medida_del_ano}</p>
                          </div>
                        )}

                        {solarReturnInterpretation.como_se_vive_siendo_tu.reflejos_obsoletos && (
                          <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                            <h3 className="text-lg font-bold text-red-300 mb-2">❌ Reflejos Obsoletos</h3>
                            <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.como_se_vive_siendo_tu.reflejos_obsoletos}</p>
                          </div>
                        )}

                        {solarReturnInterpretation.como_se_vive_siendo_tu.actitud_nueva && (
                          <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                            <h3 className="text-lg font-bold text-green-300 mb-2">✅ Actitud Nueva</h3>
                            <p className="text-gray-200 leading-relaxed">{solarReturnInterpretation.como_se_vive_siendo_tu.actitud_nueva}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 🪐 CAPA 3: COMPARACIONES PLANETARIAS */}
                  {solarReturnInterpretation.comparaciones_planetarias && (
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-3">
                        <span>🪐</span>
                        Energías Planetarias del Año
                      </h2>

                      {Object.entries(solarReturnInterpretation.comparaciones_planetarias).map(([planeta, data]: [string, any]) => (
                        <details key={planeta} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30 overflow-hidden">
                          <summary className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors font-bold text-xl text-cyan-200 capitalize">
                            {planeta === 'sol' && '☀️'} {planeta === 'luna' && '🌙'} {planeta === 'mercurio' && '☿️'}
                            {planeta === 'venus' && '♀️'} {planeta === 'marte' && '♂️'} {planeta === 'jupiter' && '♃'}
                            {planeta === 'saturno' && '♄'} {planeta.toUpperCase()}
                          </summary>

                          <div className="px-6 pb-6 space-y-3">
                            {data.natal && (
                              <div className="bg-black/30 rounded-lg p-4">
                                <h4 className="text-sm font-bold text-cyan-300 mb-1">📍 En Tu Carta Natal</h4>
                                <p className="text-xs text-gray-400 mb-2">{data.natal.posicion}</p>
                                <p className="text-gray-200 text-sm">{data.natal.descripcion}</p>
                              </div>
                            )}

                            {data.solar_return && (
                              <div className="bg-black/30 rounded-lg p-4">
                                <h4 className="text-sm font-bold text-yellow-300 mb-1">🔄 En Tu Retorno Solar</h4>
                                <p className="text-xs text-gray-400 mb-2">{data.solar_return.posicion}</p>
                                <p className="text-gray-200 text-sm">{data.solar_return.descripcion}</p>
                              </div>
                            )}

                            {data.choque && (
                              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                                <h4 className="text-sm font-bold text-orange-300 mb-2">⚡ El Choque</h4>
                                <p className="text-gray-200 text-sm">{data.choque}</p>
                              </div>
                            )}

                            {data.que_hacer && (
                              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                                <h4 className="text-sm font-bold text-green-300 mb-2">✅ Qué Hacer</h4>
                                <p className="text-gray-200 text-sm">{data.que_hacer}</p>
                              </div>
                            )}

                            {data.mandato_del_ano && (
                              <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-purple-400">
                                <p className="text-purple-200 font-semibold text-sm italic">"{data.mandato_del_ano}"</p>
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  )}

                  {/* ⏰ CAPA 4: LÍNEA DE TIEMPO ANUAL */}
                  {solarReturnInterpretation.linea_tiempo_anual && (
                    <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl p-8 border-2 border-indigo-400/40">
                      <h2 className="text-3xl font-bold mb-6 text-indigo-300 flex items-center gap-3">
                        <span>⏰</span>
                        Línea de Tiempo del Año
                      </h2>

                      <div className="space-y-4">
                        {Object.entries(solarReturnInterpretation.linea_tiempo_anual).map(([periodo, data]: [string, any]) => (
                          <div key={periodo} className="bg-black/20 rounded-xl p-4 border-l-4 border-indigo-400">
                            <h3 className="text-lg font-bold text-indigo-200 mb-2">{data.titulo}</h3>
                            <p className="text-gray-200 mb-3">{data.descripcion}</p>
                            <div className="bg-indigo-900/30 rounded-lg px-4 py-2 inline-block">
                              <span className="text-indigo-300 font-semibold text-sm">🎯 {data.accion_clave}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🌑 SOMBRAS DEL AÑO */}
                  {solarReturnInterpretation.sombras_del_ano && solarReturnInterpretation.sombras_del_ano.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-700/30 to-gray-900/30 rounded-2xl p-6 border border-gray-500/30">
                      <h3 className="text-2xl font-bold mb-4 text-gray-300 flex items-center gap-3">
                        <span>🌑</span>
                        Sombras del Año
                      </h3>
                      <ul className="space-y-2">
                        {solarReturnInterpretation.sombras_del_ano.map((sombra: string, index: number) => (
                          <li key={index} className="text-gray-200 leading-relaxed flex items-start gap-2">
                            <span className="text-gray-400 flex-shrink-0">⚠️</span>
                            <span>{sombra}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 🔑 CLAVES DE INTEGRACIÓN */}
                  {solarReturnInterpretation.claves_integracion && solarReturnInterpretation.claves_integracion.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl p-6 border border-emerald-400/30">
                      <h3 className="text-2xl font-bold mb-4 text-emerald-300 flex items-center gap-3">
                        <span>🔑</span>
                        Claves de Integración
                      </h3>
                      <ul className="space-y-2">
                        {solarReturnInterpretation.claves_integracion.map((clave: string, index: number) => (
                          <li key={index} className="text-gray-200 leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 flex-shrink-0">✨</span>
                            <span>{clave}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🌟 TAB: MI CARTA */}
        {activeTab === 'mi-carta' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">🌟</span>
                Mi Carta Natal
              </h2>

              {loadingInterpretations ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mb-4"></div>
                  <p className="text-white">Cargando tu interpretación natal...</p>
                </div>
              ) : !natalInterpretation ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-2xl font-bold text-white mb-4">No tienes interpretación de Carta Natal aún</h3>
                  <p className="text-gray-300 mb-6">Genera tu Carta Natal para descubrir tu propósito de vida</p>
                  <button
                    onClick={() => window.location.href = '/natal-chart'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
                  >
                    Generar Carta Natal
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-white">
                  {/* Esencia Revolucionaria */}
                  {natalInterpretation.esencia_revolucionaria && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                      <h3 className="text-xl font-bold mb-3 text-yellow-300">✨ Tu Esencia</h3>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {natalInterpretation.esencia_revolucionaria}
                      </p>
                    </div>
                  )}

                  {/* Propósito de Vida */}
                  {natalInterpretation.proposito_vida && (
                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-400/30">
                      <h3 className="text-xl font-bold mb-3 text-pink-300">🎯 Propósito de Vida</h3>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {natalInterpretation.proposito_vida}
                      </p>
                    </div>
                  )}

                  {/* Misión de Vida */}
                  {natalInterpretation.mision_vida && (
                    <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 border border-blue-400/30">
                      <h3 className="text-xl font-bold mb-3 text-blue-300">🚀 Misión de Vida</h3>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {natalInterpretation.mision_vida}
                      </p>
                    </div>
                  )}

                  {/* Poder Magnético */}
                  {natalInterpretation.poder_magnetico && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                      <h3 className="text-xl font-bold mb-3 text-purple-300">⚡ Poder Magnético</h3>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {natalInterpretation.poder_magnetico}
                      </p>
                    </div>
                  )}

                  {/* Super Poderes */}
                  {natalInterpretation.super_poderes && natalInterpretation.super_poderes.length > 0 && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                      <h3 className="text-xl font-bold mb-3 text-green-300">💪 Tus Super Poderes</h3>
                      <ul className="space-y-2">
                        {natalInterpretation.super_poderes.map((poder: string, index: number) => (
                          <li key={index} className="text-gray-200 leading-relaxed flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✨</span>
                            <span>{poder}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Desafíos Evolutivos */}
                  {natalInterpretation.desafios_evolutivos && natalInterpretation.desafios_evolutivos.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-400/30">
                      <h3 className="text-xl font-bold mb-3 text-orange-300">🎓 Desafíos Evolutivos</h3>
                      <ul className="space-y-2">
                        {natalInterpretation.desafios_evolutivos.map((desafio: string, index: number) => (
                          <li key={index} className="text-gray-200 leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 flex-shrink-0">•</span>
                            <span>{desafio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Planeta Dominante y Elemento */}
                  {(natalInterpretation.planeta_dominante || natalInterpretation.elemento_dominante) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {natalInterpretation.planeta_dominante && (
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-400/30">
                          <h3 className="text-lg font-bold mb-2 text-indigo-300">🪐 Planeta Dominante</h3>
                          <p className="text-white font-semibold text-xl">
                            {natalInterpretation.planeta_dominante}
                          </p>
                        </div>
                      )}
                      {natalInterpretation.elemento_dominante && (
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-400/30">
                          <h3 className="text-lg font-bold mb-2 text-cyan-300">🌊 Elemento Dominante</h3>
                          <p className="text-white font-semibold text-xl">
                            {natalInterpretation.elemento_dominante}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📅 TAB: CALENDARIO */}
        {activeTab === 'calendario' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CALENDARIO PRINCIPAL - 2/3 en desktop */}
          <div className="lg:col-span-2">

            {/* Header del calendario */}
            <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white capitalize flex items-center">
                    <span className="mr-3">🗓️</span>
                    Agenda Cósmica
                  </h2>

                  <div className="flex items-center gap-4 flex-wrap justify-center">
                  {/* Botón regenerar eventos DEL MES ACTUAL */}
                  <button
                    onClick={async () => {
                      const monthName = format(currentMonth, 'MMMM yyyy', { locale: es });
                      console.log(`🔄 [REGENERATE-MONTH] Regenerating events for ${monthName}`);
                      setLoadingMonthlyEvents(true);
                      setLoadingMonthName(monthName);

                      try {
                        // Re-fetch todos los eventos del año
                        const yearEvents = await fetchYearEvents();
                        console.log(`✅ [REGENERATE-MONTH] Fetched ${yearEvents.length} total events`);

                        // ⚡ FILTRAR solo eventos importantes
                        const importantEvents = yearEvents.filter((e: AstrologicalEvent) => {
                          return (
                            e.type === 'lunar_phase' ||
                            e.type === 'eclipse' ||
                            e.type === 'retrograde' ||
                            e.priority === 'high'
                          );
                        });
                        console.log(`✅ [REGENERATE-MONTH] Filtered to ${importantEvents.length} important events`);

                        // Actualizar eventos filtrados
                        setEvents(importantEvents);
                      } catch (error) {
                        console.error('❌ [REGENERATE-MONTH] Error:', error);
                      } finally {
                        setLoadingMonthlyEvents(false);
                        setLoadingMonthName('');
                      }
                    }}
                    disabled={loading || loadingMonthlyEvents}
                    className="px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-all duration-200 border border-green-400/30 hover:border-green-400/50 text-white text-xs lg:text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerar eventos de este mes"
                  >
                    <svg className={`h-4 w-4 ${(loading || loadingMonthlyEvents) ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">{loadingMonthlyEvents ? `Cargando...` : 'Regenerar Mes'}</span>
                    <span className="sm:hidden">🔄</span>
                  </button>

                  {/* Navegación de meses */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
                      title="Mes anterior"
                    >
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <span className="text-white font-semibold min-w-[120px] text-center text-sm lg:text-base">
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

                {/* Subtabs para vistas de calendario */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setCalendarView('mes')}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${calendarView === 'mes'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    📅 Mes
                  </button>

                  <button
                    onClick={() => setCalendarView('semana')}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${calendarView === 'semana'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    📆 Semana
                  </button>

                  <button
                    onClick={() => setCalendarView('dia')}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${calendarView === 'dia'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    📋 Día
                  </button>
                </div>
              </div>
            </div>

            {/* 📅 VISTA: MES */}
            {calendarView === 'mes' && (
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

                      return (
                        <div
                          key={index}
                          onClick={() => handleDayClick(day)}
                          className={`
                            relative min-h-[80px] lg:min-h-[100px] p-2 cursor-pointer transition-all duration-300 border-r border-b border-purple-400/20 last:border-r-0 group
                            ${day.isCurrentMonth
                              ? isToday
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                                : isSelected
                                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/60'
                                : 'bg-gradient-to-br from-purple-800/10 to-indigo-800/10 hover:from-purple-600/20 hover:to-indigo-600/20'
                              : 'bg-gradient-to-br from-gray-800/20 to-slate-800/20 text-gray-500'
                            }
                          `}
                        >
                          {/* Número del día */}
                          <div className={`
                            text-sm font-bold mb-1
                            ${isToday ? 'text-yellow-300' : day.isCurrentMonth ? 'text-white' : 'text-gray-500'}
                          `}>
                            {day.date.getDate()}
                          </div>

                          {/* Eventos del día con iconos - FILTRADO SOLO HIGH/MEDIUM PRIORITY */}
                          {day.hasEvents && (
                            <div className="space-y-1">
                              {day.events
                                .filter(e => e.priority === 'high' || e.priority === 'medium')
                                .slice(0, 2)
                                .map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                  }}
                                  className={`
                                    p-1.5 rounded cursor-pointer transition-all duration-200 group-hover:scale-105
                                    bg-gradient-to-r ${getEventColor(event.type, event.priority)} bg-opacity-80 backdrop-blur-sm
                                    hover:shadow-lg hover:shadow-purple-500/30
                                  `}
                                >
                                  <div className="flex items-start gap-1">
                                    <span className="text-xs flex-shrink-0">{getEventIcon(event.type, event.priority)}</span>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-white text-xs font-medium leading-tight block">
                                        {event.title}
                                      </span>
                                      {event.priority === 'high' && (
                                        <span className="text-yellow-300 text-xs animate-pulse block">!</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {day.events.filter(e => e.priority === 'high' || e.priority === 'medium').length > 2 && (
                                <div className="text-purple-300 text-xs font-medium text-center bg-purple-600/20 rounded px-1 py-0.5">
                                  +{day.events.filter(e => e.priority === 'high' || e.priority === 'medium').length - 2}
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
            )}

            {/* 📆 VISTA: SEMANA */}
            {calendarView === 'semana' && (
              <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-400/20 overflow-hidden">
                {/* Header de navegación semanal */}
                <div className="bg-gradient-to-r from-purple-700/30 to-indigo-700/30 p-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
                    title="Semana anterior"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h3 className="text-white font-bold text-lg">
                    Semana del {format(startOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'd MMM', { locale: es })} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}
                  </h3>

                  <button
                    onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50"
                    title="Semana siguiente"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Días de la semana */}
                <div className="p-6 space-y-4">
                  {getCurrentWeekDays().map((day, index) => (
                    <div
                      key={index}
                      className={`
                        rounded-xl p-4 border transition-all duration-200 cursor-pointer
                        ${day.isToday
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
                          : 'bg-white/5 border-purple-400/20 hover:bg-white/10 hover:border-purple-400/30'
                        }
                      `}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setCalendarView('dia');
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`
                            text-center
                            ${day.isToday ? 'text-yellow-300' : 'text-purple-300'}
                          `}>
                            <div className="text-xs font-semibold uppercase">{day.dayName}</div>
                            <div className="text-2xl font-bold">{day.dayNumber}</div>
                            <div className="text-xs">{day.monthName}</div>
                          </div>

                          <div className={`text-sm font-medium ${day.isToday ? 'text-yellow-200' : 'text-white'}`}>
                            {day.hasEvents ? `${day.events.length} evento${day.events.length > 1 ? 's' : ''}` : 'Sin eventos'}
                          </div>
                        </div>

                        {day.isToday && (
                          <span className="bg-yellow-400/80 text-black text-xs font-bold px-2 py-1 rounded-full">
                            HOY
                          </span>
                        )}
                      </div>

                      {day.hasEvents && (
                        <div className="space-y-2">
                          {day.events
                            .filter(e => e.priority === 'high' || e.priority === 'medium')
                            .slice(0, 3)
                            .map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="bg-white/5 rounded-lg p-2 border border-white/10"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm flex-shrink-0">{getEventIcon(event.type, event.priority)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-medium">{event.title}</div>
                                  {event.planet && event.sign && (
                                    <div className="text-purple-300 text-xs">{event.planet} en {event.sign}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {day.events.length > 3 && (
                            <div className="text-purple-300 text-xs text-center">
                              +{day.events.length - 3} evento{day.events.length - 3 > 1 ? 's' : ''} más
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📋 VISTA: DÍA */}
            {calendarView === 'dia' && selectedDate && (
              <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-400/20 overflow-hidden">
                {/* Header del día */}
                <div className="bg-gradient-to-r from-purple-700/30 to-indigo-700/30 p-6 border-b border-purple-400/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {format(selectedDate, 'EEEE d', { locale: es })}
                      </h3>
                      <p className="text-purple-200 text-sm mt-1">
                        {format(selectedDate, 'MMMM yyyy', { locale: es })}
                      </p>
                    </div>

                    <button
                      onClick={() => setCalendarView('mes')}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-2 rounded-lg border border-purple-400/30 transition-all duration-200 text-sm font-medium"
                    >
                      ← Volver al mes
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Resumen del día */}
                  {selectedDayEvents.length > 0 ? (
                    <>
                      {/* Mantra del día */}
                      {selectedDayEvents.some(e => e.aiInterpretation?.mantra) && (
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                          <h4 className="font-bold text-yellow-300 mb-3 text-lg flex items-center gap-2">
                            <span>🌟</span>
                            Mantra del Día
                          </h4>
                          <p className="text-white text-lg italic font-medium leading-relaxed">
                            "{selectedDayEvents.find(e => e.aiInterpretation?.mantra)?.aiInterpretation?.mantra}"
                          </p>
                        </div>
                      )}

                      {/* Ritual del día */}
                      {selectedDayEvents.some(e => e.aiInterpretation?.ritual) && (
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                          <h4 className="font-bold text-green-300 mb-3 text-lg flex items-center gap-2">
                            <span>🔥</span>
                            Ritual del Día (5 minutos)
                          </h4>
                          <p className="text-white leading-relaxed whitespace-pre-line">
                            {selectedDayEvents.find(e => e.aiInterpretation?.ritual)?.aiInterpretation?.ritual || 'Ritual de 5 minutos para conectar con la energía del día'}
                          </p>
                        </div>
                      )}

                      {/* Consejo del día */}
                      {selectedDayEvents.some(e => e.aiInterpretation?.advice) && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 border border-blue-400/30">
                          <h4 className="font-bold text-blue-300 mb-3 text-lg flex items-center gap-2">
                            <span>💡</span>
                            Consejo para Ti
                          </h4>
                          <p className="text-white leading-relaxed">
                            {selectedDayEvents.find(e => e.aiInterpretation?.advice)?.aiInterpretation?.advice}
                          </p>
                        </div>
                      )}

                      {/* Pregunta clave */}
                      {selectedDayEvents.some(e => e.aiInterpretation && 'pregunta_clave' in e.aiInterpretation && (e.aiInterpretation as any).pregunta_clave) && (
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                          <h4 className="font-bold text-purple-300 mb-3 text-lg flex items-center gap-2">
                            <span>❓</span>
                            Pregunta del Día
                          </h4>
                          <p className="text-white text-lg font-medium italic leading-relaxed">
                            {(selectedDayEvents.find(e => e.aiInterpretation && 'pregunta_clave' in e.aiInterpretation)?.aiInterpretation as any)?.pregunta_clave}
                          </p>
                        </div>
                      )}

                      {/* Eventos del día */}
                      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-400/30">
                        <h4 className="font-bold text-pink-300 mb-4 text-lg flex items-center gap-2">
                          <span>🎯</span>
                          Eventos Astrológicos del Día ({selectedDayEvents.length})
                        </h4>

                        <div className="space-y-3">
                          {selectedDayEvents.map((event, index) => (
                            <div
                              key={index}
                              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                              onClick={() => {
                                setModalEvent(event);
                                setShowEventModal(true);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">{getEventIcon(event.type, event.priority)}</span>
                                <div className="flex-1">
                                  <h5 className="text-white font-bold mb-1">{event.title}</h5>
                                  {event.planet && event.sign && (
                                    <p className="text-purple-300 text-sm mb-2">{event.planet} en {event.sign}</p>
                                  )}
                                  <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>

                                  {event.aiInterpretation && (
                                    <div className="mt-2 text-purple-200 text-xs">
                                      Click para ver interpretación completa ✨
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🌙</div>
                      <h4 className="text-2xl font-bold text-white mb-2">Día sin eventos especiales</h4>
                      <p className="text-gray-300">
                        Este día no tiene eventos astrológicos destacados. ¡Perfecto para descansar y consolidar!
                      </p>
                    </div>
                  )}
                </div>
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
                  {generatePages()}
            </div>
          </div>

          {/* SIDEBAR INFO DEL DÍA - 1/3 en desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">

              {/* 📅 SELECTOR DE FECHA */}
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <span className="mr-2">📅</span>
                  Ir a una fecha
                </h3>
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setSelectedDate(newDate);
                    setCurrentMonth(newDate);
                    // Buscar eventos del día seleccionado
                    const dayEvents = events.filter(event =>
                      isSameDay(new Date(event.date), newDate)
                    );
                    setSelectedDayEvents(dayEvents);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-purple-900/50 border border-yellow-400/30 text-white font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* 🪐 PLANETAS ACTIVOS DEL AÑO */}
              {loadingActivePlanets ? (
                <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                </div>
              ) : activePlanets.length > 0 && (
                <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <span className="mr-2">🪐</span>
                    Planetas Activos {new Date().getFullYear()}
                  </h3>
                  <div className="space-y-3">
                    {activePlanets.filter(p => p.prioridad === 1).slice(0, 3).map((planet, idx) => (
                      <div key={idx} className="bg-purple-900/40 rounded-lg p-3 border border-purple-400/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-bold text-sm">{planet.planet}</span>
                          <span className="text-xs text-yellow-400 font-semibold">⭐ Alta</span>
                        </div>
                        <p className="text-purple-200 text-xs line-clamp-2">
                          {planet.traduccion_practica}
                        </p>
                      </div>
                    ))}
                    {activePlanets.length > 3 && (
                      <p className="text-purple-300 text-xs text-center mt-2">
                        + {activePlanets.length - 3} planetas más activos
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 📖 AGENDA IMPRIMIBLE */}
              <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <span className="mr-2">📖</span>
                  Tu Agenda Física
                </h3>
                <div className="space-y-3">
                  <AgendaBookGenerator />
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-400/90 hover:to-emerald-400/90 transition-all duration-200 shadow-lg hover:shadow-green-500/25 border border-white/10 p-3 rounded-lg group"
                    title="Imprimir agenda actual"
                  >
                    <svg className="h-5 w-5 text-white group-hover:scale-110 transition-transform inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-sm font-semibold">Imprimir Vista Actual</span>
                  </button>
                </div>
              </div>

              {/* Header del sidebar - Día seleccionado */}
              <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/30">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3">🌙</span>
                  {selectedDate
                    ? `${selectedDate.getDate()} de ${format(selectedDate, 'MMMM', { locale: es })}`
                    : 'Selecciona un día'
                  }
                </h3>
                <p className="text-pink-200 text-sm">
                  {selectedDayEvents.length === 0
                    ? 'Haz click en un día para ver sus eventos'
                    : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''} cósmico${selectedDayEvents.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* 🌟 INFORMACIÓN DEL DÍA: Interpretaciones Personalizadas */}
              {selectedDate && selectedDayEvents.length > 0 && (
                <div className="space-y-4 mb-6">
                  {/* 🔮 INTERPRETACIÓN PERSONALIZADA - CAPA 2 */}
                  {selectedDayEvents.some(e => (e.aiInterpretation as any)?.capa_2_aplicado) && (
                    <>
                      {/* Cómo Se Vive en Ti */}
                      {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.como_se_vive_en_ti) && (
                        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-violet-400/30">
                          <h4 className="text-violet-300 font-bold text-sm mb-2 flex items-center">
                            <span className="mr-2">💫</span>
                            Cómo Se Vive en Ti
                          </h4>
                          <p className="text-white text-sm leading-relaxed">
                            {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.como_se_vive_en_ti) ? ((selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.como_se_vive_en_ti)?.aiInterpretation as any)?.capa_2_aplicado?.como_se_vive_en_ti) : ''}
                          </p>
                        </div>
                      )}

                      {/* Uso Consciente */}
                      {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.uso_consciente_consejo_aplicado) && (
                        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-400/30">
                          <h4 className="text-emerald-300 font-bold text-sm mb-2 flex items-center">
                            <span className="mr-2">✅</span>
                            Uso Consciente
                          </h4>
                          <p className="text-white text-sm leading-relaxed">
                            {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.uso_consciente_consejo_aplicado) ? ((selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.uso_consciente_consejo_aplicado)?.aiInterpretation as any)?.capa_2_aplicado?.uso_consciente_consejo_aplicado) : ''}
                          </p>
                        </div>
                      )}

                      {/* Acción Práctica */}
                      {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.accion_practica_sugerida) && (
                        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
                          <h4 className="text-blue-300 font-bold text-sm mb-2 flex items-center">
                            <span className="mr-2">🎯</span>
                            Acción Práctica
                          </h4>
                          <p className="text-white text-sm leading-relaxed">
                            {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.accion_practica_sugerida) ? ((selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.accion_practica_sugerida)?.aiInterpretation as any)?.capa_2_aplicado?.accion_practica_sugerida) : ''}
                          </p>
                        </div>
                      )}

                      {/* Síntesis/Mantra */}
                      {selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.sintesis_final) && (
                        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/30">
                          <h4 className="text-amber-300 font-bold text-sm mb-2 flex items-center">
                            <span className="mr-2">✨</span>
                            Tu Mantra
                          </h4>
                          <p className="text-white text-sm italic font-bold text-center">
                            "{selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.sintesis_final)?.aiInterpretation ? ((selectedDayEvents.find(e => (e.aiInterpretation as any)?.capa_2_aplicado?.sintesis_final)?.aiInterpretation as any)?.capa_2_aplicado?.sintesis_final) : ''}"
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* FALLBACK: Mostrar interpretaciones genéricas si no hay personalizadas */}
                  {!selectedDayEvents.some(e => (e.aiInterpretation as any)?.capa_2_aplicado) && (
                    <>
                      {/* Mantra del día */}
                      {selectedDayEvents.some(e => e.aiInterpretation?.mantra) && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                      <h4 className="text-yellow-300 font-bold text-sm mb-2 flex items-center">
                        <span className="mr-2">🌟</span>
                        Mantra del Día
                      </h4>
                      <p className="text-white text-sm italic font-medium">
                        "{selectedDayEvents.find(e => e.aiInterpretation?.mantra)?.aiInterpretation?.mantra}"
                      </p>
                    </div>
                  )}

                  {/* Ritual del día */}
                  {selectedDayEvents.some(e => e.aiInterpretation?.ritual) && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30">
                      <h4 className="text-green-300 font-bold text-sm mb-2 flex items-center">
                        <span className="mr-2">🔥</span>
                        Ritual del Día
                      </h4>
                      <p className="text-white text-sm leading-relaxed">
                        {selectedDayEvents.find(e => e.aiInterpretation?.ritual)?.aiInterpretation?.ritual || 'Ritual de 5 minutos para conectar con la energía del día'}
                      </p>
                    </div>
                  )}

                  {/* Consejo del día */}
                  {selectedDayEvents.some(e => e.aiInterpretation?.advice) && (
                    <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
                      <h4 className="text-blue-300 font-bold text-sm mb-2 flex items-center">
                        <span className="mr-2">💡</span>
                        Consejo del Día
                      </h4>
                      <p className="text-white text-sm leading-relaxed">
                        {selectedDayEvents.find(e => e.aiInterpretation?.advice)?.aiInterpretation?.advice}
                      </p>
                    </div>
                  )}

                  {/* Pregunta clave */}
                  {selectedDayEvents.some(e => e.aiInterpretation && 'pregunta_clave' in e.aiInterpretation && (e.aiInterpretation as any).pregunta_clave) && (
                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-pink-400/30">
                      <h4 className="text-pink-300 font-bold text-sm mb-2 flex items-center">
                        <span className="mr-2">❓</span>
                        Pregunta del Día
                      </h4>
                      <p className="text-white text-sm leading-relaxed font-medium italic">
                        {(selectedDayEvents.find(e => e.aiInterpretation && 'pregunta_clave' in e.aiInterpretation)?.aiInterpretation as any)?.pregunta_clave}
                      </p>
                    </div>
                  )}
                    </>
                  )}
                </div>
              )}

              {/* Lista de eventos */}
              {selectedDayEvents.length > 0 && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
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

                      <p className="text-gray-200 text-sm mb-3 line-clamp-2">{event.description}</p>

                      <div className="text-purple-300 text-xs italic">
                        Hover para ver interpretación completa ✨
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
        )}


        {/* TOOLTIP ÉPICO */}
        {hoveredEvent && hoveredEvent?.aiInterpretation && (
          <div
            className="fixed bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-2xl p-6 shadow-2xl max-w-sm pointer-events-none z-50"
            style={{
              left: Math.min(tooltipPosition.x - 200, window.innerWidth - 400),
              top: tooltipPosition.y - 20,
              transform: 'translateY(-100%)'
            }}
          >
            {/* Header */}
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{getEventIcon(hoveredEvent!.type, hoveredEvent!.priority)}</span>
              <div>
                <div className="text-white font-bold">{hoveredEvent!.title}</div>
                <div className="text-purple-200 text-sm">
                  {hoveredEvent!.planet && hoveredEvent!.sign && `${hoveredEvent!.planet} en ${hoveredEvent!.sign}`}
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
                  {hoveredEvent?.aiInterpretation?.meaning}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="text-emerald-300 font-semibold text-sm mb-1 flex items-center">
                  <span className="mr-2">⚡</span>CONSEJO:
                </div>
                <div className="text-white text-sm leading-relaxed">
                  {hoveredEvent?.aiInterpretation?.advice}
                </div>
              </div>

              {hoveredEvent?.aiInterpretation?.mantra && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                  <div className="text-yellow-300 font-semibold text-sm mb-1">✨ MANTRA:</div>
                  <div className="text-white text-sm font-medium italic">
                    "{hoveredEvent?.aiInterpretation?.mantra}"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={closeEventModal}
            />

            {/* Modal centrado */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{modalEvent ? getEventIcon(modalEvent.type, modalEvent.priority) : ''}</span>
                      <div className="flex-1">
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
                          </p>
                        )}
                        {/* DURACIÓN del evento */}
                        {(modalEvent as any).duration && (
                          <div className="mt-2 inline-block bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                            <p className="text-yellow-200 text-xs font-semibold">
                              ⏱️ Duración: {(modalEvent as any).duration}
                            </p>
                          </div>
                        )}
                        {/* TIPO DE TRÁNSITO */}
                        {(modalEvent as any).transitType && (
                          <div className="mt-2 inline-block bg-cyan-500/20 border border-cyan-400/30 rounded-lg px-3 py-1 ml-2">
                            <p className="text-cyan-200 text-xs font-semibold">
                              {(modalEvent as any).transitType === 'lento' && '🐢 Tránsito Lento (generacional)'}
                              {(modalEvent as any).transitType === 'mediano' && '🏃 Tránsito Mediano (anual)'}
                              {(modalEvent as any).transitType === 'rápido' && '⚡ Tránsito Rápido (mensual)'}
                            </p>
                          </div>
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
                  {/* Descripción síntesis */}
                  <div className="mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400 rounded-lg p-4">
                    <p className="text-white text-lg font-semibold leading-relaxed">{modalEvent.description}</p>
                  </div>

                  {/* ✨ INTERPRETACIÓN V3 CRUZADA (Nueva Metodología) */}
                  {loadingCrossedInterpretation ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-purple-300 text-sm">Generando interpretación cruzada...</p>
                      </div>
                    </div>
                  ) : crossedInterpretation ? (
                    <div className="space-y-5">
                      {/* ENERGÍA DOMINANTE DEL DÍA */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
                        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                          <span className="mr-2">🔥</span>
                          ENERGÍA DOMINANTE DEL DÍA
                        </h3>
                        <p className="text-white leading-relaxed">{crossedInterpretation.energia_dominante}</p>
                      </div>

                      {/* INTERPRETACIÓN CRUZADA - Preguntas por Planeta Activo */}
                      {crossedInterpretation.interpretacion_cruzada && crossedInterpretation.interpretacion_cruzada.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl p-5">
                          <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center">
                            <span className="mr-2">🪐</span>
                            INTERPRETACIÓN CRUZADA
                          </h3>
                          <div className="space-y-4">
                            {crossedInterpretation.interpretacion_cruzada.map((planetQ: any, idx: number) => (
                              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-yellow-400 font-bold text-sm">{planetQ.planet}</span>
                                  <span className="text-indigo-300 text-xs">({planetQ.context})</span>
                                </div>
                                <p className="text-white font-semibold italic">
                                  {planetQ.question}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CÓMO VIVIR ESTE DÍA SIENDO TÚ */}
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-5">
                        <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                          <span className="mr-2">🧭</span>
                          CÓMO VIVIR ESTE DÍA SIENDO TÚ
                        </h3>
                        <p className="text-white leading-relaxed">{crossedInterpretation.como_vivir_siendo_tu}</p>
                      </div>

                      {/* ACCIÓN CONSCIENTE RECOMENDADA */}
                      {crossedInterpretation.accion_recomendada && crossedInterpretation.accion_recomendada.length > 0 && (
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-5">
                          <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center">
                            <span className="mr-2">✨</span>
                            ACCIÓN CONSCIENTE RECOMENDADA
                          </h3>
                          <ul className="space-y-2">
                            {crossedInterpretation.accion_recomendada.map((action: string, idx: number) => (
                              <li key={idx} className="text-white leading-relaxed flex items-start">
                                <span className="text-cyan-400 mr-2">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* SOMBRA A EVITAR HOY */}
                      {crossedInterpretation.sombra_a_evitar && crossedInterpretation.sombra_a_evitar.length > 0 && (
                        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-5">
                          <h3 className="text-lg font-bold text-orange-300 mb-3 flex items-center">
                            <span className="mr-2">⚠️</span>
                            SOMBRA A OBSERVAR HOY
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {crossedInterpretation.sombra_a_evitar.map((sombra: string, idx: number) => (
                              <span key={idx} className="bg-orange-500/20 border border-orange-400/30 rounded-full px-3 py-1 text-orange-200 text-sm">
                                {sombra}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FRASE ANCLA DEL DÍA */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-2xl p-6 text-center">
                        <h3 className="text-base font-bold text-purple-300 mb-3">🔑 FRASE ANCLA DEL DÍA</h3>
                        <p className="text-white text-xl font-bold italic leading-relaxed">
                          "{crossedInterpretation.frase_ancla}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Fallback: Interpretación antigua si no hay V3 */
                    modalEvent.aiInterpretation && (
                      <div className="space-y-5">
                        {/* ENERGÍA DOMINANTE DEL DÍA - Planeta líder */}
                        {modalEvent.aiInterpretation.meaning && (
                          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
                            <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                              <span className="mr-2">🧠</span>
                              ENERGÍA DOMINANTE DEL DÍA
                            </h3>
                            <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.meaning}</p>
                          </div>
                        )}

                        {/* CÓMO VIVIR ESTE DÍA SIENDO TÚ */}
                        {modalEvent.aiInterpretation.advice && (
                          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-5">
                            <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                              <span className="mr-2">🧭</span>
                              CÓMO VIVIR ESTE DÍA SIENDO TÚ
                            </h3>
                            <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.advice}</p>
                          </div>
                        )}

                        {/* FRASE ANCLA DEL DÍA */}
                        {modalEvent.aiInterpretation.mantra && (
                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-2xl p-6 text-center">
                            <h3 className="text-base font-bold text-purple-300 mb-3">🔑 FRASE ANCLA DEL DÍA</h3>
                            <p className="text-white text-xl font-bold italic leading-relaxed">
                              "{modalEvent.aiInterpretation.mantra}"
                            </p>
                          </div>
                        )}
                      </div>
                    )
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

      </div>
  );
};

export default AgendaPersonalizada;