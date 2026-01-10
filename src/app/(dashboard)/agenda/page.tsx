//src/app/(dashboard)/agenda/page.tsx - NUEVO UX DISRUPTIVO CON CARGA LAZY
'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UserProfile, AstrologicalEvent, EventType } from '@/types/astrology/unified-types';

import EventsLoadingModal from '@/components/astrology/EventsLoadingModal';
import EventInterpretationButton from '@/components/agenda/EventInterpretationButton';
import PlanetaryCards from '@/components/agenda/PlanetaryCards';
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
  // Estado para mostrar Agenda Libro
  const [showAgendaLibro, setShowAgendaLibro] = useState(false);
  // Estados para carga de agenda completa (birthday to next birthday)
  const [loadingYearEvents, setLoadingYearEvents] = useState(false);
  const [yearRange, setYearRange] = useState<{start: Date, end: Date} | null>(null);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [loadingMonthlyEvents, setLoadingMonthlyEvents] = useState(false);
  const [loadingMonthName, setLoadingMonthName] = useState<string>('');
  const [isPreviousYear, setIsPreviousYear] = useState(false); // Detectar si vemos año anterior

  // Perfil de usuario REAL (no datos de prueba)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

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
      // (desde el último cumpleaños que ya pasó hasta el próximo)
      let startDate: Date;
      let endDate: Date;

      if (forceNextYear) {
        // 🔄 FORZAR año siguiente: próximo cumpleaños → cumpleaños del año después
        const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
        startDate = nextYearBirthday;
        endDate = new Date(currentYear + 2, birthDate.getMonth(), birthDate.getDate());
      } else if (currentYearBirthday <= now) {
        // Si ya pasó el cumpleaños este año, el rango es: cumpleaños este año → cumpleaños próximo año
        startDate = currentYearBirthday;
        endDate = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
      } else {
        // Si aún no ha pasado el cumpleaños este año, el rango es: cumpleaños año pasado → cumpleaños este año
        startDate = lastYearBirthday;
        endDate = currentYearBirthday;
      }

      // 🔍 DETECTAR si estamos viendo el año ANTERIOR del retorno solar
      // (si el final del rango ya pasó, estamos viendo el año anterior)
      const isViewingPreviousYear = endDate < now && !forceNextYear;
      setIsPreviousYear(isViewingPreviousYear);

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

  // 🎂 Inicializar currentMonth al mes del cumpleaños cuando se calcula yearRange
  useEffect(() => {
    if (yearRange && yearRange.start) {
      console.log('🎂 [AGENDA] Setting currentMonth to birthday month:', yearRange.start);
      setCurrentMonth(yearRange.start);
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



  const handleDayClick = (day: AstronomicalDay) => {
    setSelectedDate(day.date);
    setSelectedDayEvents(day.events);
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
                <p className="text-orange-100 mb-4 leading-relaxed">
                  Este es tu ciclo solar del <strong className="text-white">{yearRange.start.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> al <strong className="text-white">{yearRange.end.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
                  <br />
                  <span className="text-yellow-200">El {yearRange.end.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} fue el <strong>último día de tu Retorno Solar anterior</strong>.</span>
                </p>
                <button
                  onClick={() => {
                    // Recargar eventos del año SIGUIENTE (forzar nuevo ciclo)
                    if (userProfile) {
                      // Limpiar eventos anteriores
                      setEvents([]);
                      setLoadedMonths(new Set());
                      // Cargar año siguiente con forceNextYear=true
                      loadYearEvents(true);
                    }
                  }}
                  disabled={loadingYearEvents}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center gap-2"
                >
                  {loadingYearEvents ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔄</span>
                      <span>Generar Nuevo Ciclo Solar {new Date().getFullYear()}</span>
                    </>
                  )}
                </button>
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

        {/* PLANETARY CARDS - Contexto anual */}
        <div className="mb-8">
          <PlanetaryCards />
        </div>

        {/* LAYOUT DESKTOP/MOBILE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CALENDARIO PRINCIPAL - 2/3 en desktop */}
          <div className="lg:col-span-2">

            {/* Header del calendario */}
            <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-white capitalize flex items-center">
                  <span className="mr-3">🗓️</span>
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
                                    flex items-center gap-1 p-1 rounded cursor-pointer transition-all duration-200 group-hover:scale-105
                                    bg-gradient-to-r ${getEventColor(event.type, event.priority)} bg-opacity-80 backdrop-blur-sm
                                    hover:shadow-lg hover:shadow-purple-500/30
                                  `}
                                >
                                  <span className="text-xs">{getEventIcon(event.type, event.priority)}</span>
                                  <span className="text-white text-xs font-medium truncate flex-1">
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

          {/* SIDEBAR EVENTOS - 1/3 en desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">

              {/* Info del usuario - MOVIDO ARRIBA */}
              {userProfile && (
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>

                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full p-3 backdrop-blur-sm mr-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{userProfile.name || 'Usuario'}</h4>
                      <p className="text-gray-300 text-sm">{userProfile.currentAge || 0} años</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Lugar</span>
                        <span className="text-white text-sm">📍 {userProfile.place || 'Sin ubicación'}</span>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                      <div className="text-gray-400 text-xs mb-2">Signos Astrológicos</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-300 text-xs">☉ Sol</span>
                          <span className="text-white text-sm">{userProfile.astrological?.signs?.sun || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 text-xs">☽ Luna</span>
                          <span className="text-white text-sm">{userProfile.astrological?.signs?.moon || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300 text-xs">↗ Ascendente</span>
                          <span className="text-white text-sm">{userProfile.astrological?.signs?.ascendant || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Header del sidebar */}
              <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-pink-400/30">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3">📅</span>
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

              {/* CTA inspirado en Dididaze */}
              <div className="mt-6 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 text-center">
                <div className="text-2xl mb-3">🔮</div>
                <h4 className="text-white font-bold mb-2">¿Quieres más magia?</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Descubre interpretaciones aún más profundas de tu carta natal
                </p>
                <div className="flex flex-col gap-3">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Explorar más ✨
                  </button>
                  <button
                    onClick={() => setShowAgendaLibro(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 border border-white/10 p-3 rounded-full group"
                    title="Ver tu agenda en formato libro"
                  >
                    <span className="text-xl mr-2">📖</span>
                    <span className="text-white font-bold">Ver Agenda Libro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOOLTIP ÉPICO */}
        {hoveredEvent && hoveredEvent.aiInterpretation && (
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeEventModal}
            />

            {/* Modal centrado */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
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
                  {/* Descripción */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="text-purple-300 mr-2">📝</span>
                      Descripción del Evento
                    </h3>
                    <p className="text-gray-200 leading-relaxed">{modalEvent.description}</p>
                  </div>

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

                      {/* 🌟 INTERPRETACIÓN PERSONALIZADA PROFUNDA (NUEVO) */}
                      {user?.uid && modalEvent && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 rounded-2xl p-6">
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
    </div>
  );
};

export default AgendaPersonalizada;