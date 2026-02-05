import { useState, useEffect } from 'react';

interface AstrologicalEvent {
  id: string;
  type: string;
  date: string;
  title: string;
  sign?: string;
  house?: number;
  planet?: string;
  interpretation?: any;
  description?: string;
  priority?: string;
  // ✅ Campos adicionales para casas y metadata
  metadata?: {
    house?: number;
    zodiacSign?: string;
    degree?: number;
    [key: string]: any;
  };
}

interface SolarCycle {
  _id: string;
  userId: string;
  yearLabel: string;
  cycleStart: string;
  cycleEnd: string;
  events: AstrologicalEvent[];
}

interface UseInterpretacionesProps {
  userId: string;
  yearLabel: string;
}

interface UseInterpretacionesReturn {
  solarCycle: SolarCycle | null;
  loading: boolean;
  generatingMissing: boolean;
  progress: number;
  error: string | null;
  getEventosForMonth: (monthIndex: number) => AstrologicalEvent[];
  refetchCycle: () => Promise<void>;
  // ✅ NUEVO: Estadísticas de interpretaciones
  eventStats: {
    total: number;
    conInterpretacion: number;
    sinInterpretacion: number;
  };
  // ✅ NUEVO: Mapa de interpretaciones personalizadas cargadas
  storedInterpretations: Map<string, any>;
}

/**
 * Hook personalizado para manejar la carga de interpretaciones del SolarCycle
 *
 * Flujo:
 * 1. Carga el ciclo solar del usuario
 * 2. Verifica si faltan interpretaciones
 * 3. Si faltan, las genera automáticamente
 * 4. Proporciona helpers para obtener eventos por mes
 */
export function useInterpretaciones({
  userId,
  yearLabel
}: UseInterpretacionesProps): UseInterpretacionesReturn {

  const [solarCycle, setSolarCycle] = useState<SolarCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingMissing, setGeneratingMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // ✅ NUEVO: Mapa de interpretaciones personalizadas cargadas desde la colección separada
  const [storedInterpretations, setStoredInterpretations] = useState<Map<string, any>>(new Map());
  // ✅ NUEVO: Stats de eventos
  const [eventStats, setEventStats] = useState({ total: 0, conInterpretacion: 0, sinInterpretacion: 0 });

  useEffect(() => {
    if (userId && yearLabel) {
      loadInterpretaciones();
    }
  }, [userId, yearLabel]);

  /**
   * Carga el ciclo solar y genera interpretaciones faltantes si es necesario
   */
  async function loadInterpretaciones() {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener ciclo solar
      const cycleResponse = await fetch(
        `/api/astrology/solar-cycles?userId=${userId}&yearLabel=${yearLabel}`
      );

      if (!cycleResponse.ok) {
        const errorData = await cycleResponse.json().catch(() => ({}));
        if (errorData.error?.includes('datos de nacimiento')) {
          throw new Error('Necesitas completar tus datos de nacimiento primero.');
        }
        throw new Error(errorData.error || 'No se encontró el ciclo solar. Asegúrate de haberlo generado primero.');
      }

      const cycleData = await cycleResponse.json();

      if (!cycleData.success) {
        throw new Error(cycleData.error || 'Error al cargar el ciclo solar');
      }

      // ✅ FIX: La API devuelve data.cycle, no data directamente
      const cycle = cycleData.data.cycle || cycleData.data;

      console.log('🔍 Ciclo cargado:', cycle);
      console.log('📊 Tiene events?', !!cycle?.events);
      console.log('📈 Número de events:', cycle?.events?.length || 0);

      // ✅ NUEVO: Cargar interpretaciones personalizadas almacenadas
      // Usar el rango de fechas del ciclo solar para cargar TODO el año
      const interpretationsMap = new Map<string, any>();
      try {
        const startDate = cycle.cycleStart;
        const endDate = cycle.cycleEnd;
        const storedResponse = await fetch(
          `/api/interpretations/event?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
        );
        if (storedResponse.ok) {
          const storedData = await storedResponse.json();
          if (storedData.interpretations && Array.isArray(storedData.interpretations)) {
            storedData.interpretations.forEach((interp: any) => {
              // Usar eventId como clave - guardar objeto completo (interpretation + eventDetails)
              if (interp.eventId) {
                interpretationsMap.set(interp.eventId, {
                  interpretation: interp.interpretation,
                  eventDetails: interp.eventDetails
                });
              }
            });
            console.log(`✅ Cargadas ${interpretationsMap.size} interpretaciones personalizadas del ciclo`);
          }
        }
      } catch (err) {
        console.log('⚠️ No se pudieron cargar interpretaciones almacenadas:', err);
      }
      setStoredInterpretations(interpretationsMap);

      // ✅ NUEVO: Merge interpretaciones almacenadas con eventos del ciclo
      // Incluir tanto interpretation como eventDetails (que contiene la casa correcta)
      if (cycle?.events && interpretationsMap.size > 0) {
        cycle.events = cycle.events.map((event: AstrologicalEvent) => {
          const stored = interpretationsMap.get(event.id);
          if (stored && !event.interpretation) {
            return {
              ...event,
              interpretation: stored.interpretation,
              // Merge eventDetails si tiene la casa
              house: stored.eventDetails?.house || event.house
            };
          }
          return event;
        });
      }

      // ✅ NUEVO: Calcular estadísticas
      // Helper para verificar si una interpretación está realmente llena (no vacía)
      const tieneInterpretacionReal = (interp: any): boolean => {
        if (!interp) return false;
        if (typeof interp === 'string') return interp.trim().length > 0;
        if (typeof interp === 'object') {
          // Verificar si tiene al menos un campo con contenido
          return Object.keys(interp).length > 0 &&
            Object.values(interp).some(v => v !== null && v !== undefined && v !== '');
        }
        return false;
      };

      const total = cycle?.events?.length || 0;
      const conInterpretacion = cycle?.events?.filter((e: AstrologicalEvent) =>
        tieneInterpretacionReal(e.interpretation)
      )?.length || 0;
      setEventStats({
        total,
        conInterpretacion,
        sinInterpretacion: total - conInterpretacion
      });
      console.log(`📊 Stats: ${conInterpretacion}/${total} eventos con interpretación REAL`);

      setSolarCycle(cycle);

      // 2. Verificar interpretaciones faltantes
      const checkResponse = await fetch(
        `/api/astrology/interpretations/check-missing?userId=${userId}&yearLabel=${yearLabel}`
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        if (checkData.success && checkData.data.missing > 0) {
          console.log(`📊 Faltan ${checkData.data.missing} interpretaciones. Generando...`);
          await generateMissingInterpretations(checkData.data.missing);
        } else {
          console.log('✅ Todas las interpretaciones están listas');
        }
      }

      setLoading(false);

    } catch (err: any) {
      console.error('Error cargando interpretaciones:', err);
      setError(err.message || 'Error desconocido');
      setLoading(false);
    }
  }

  /**
   * Genera todas las interpretaciones faltantes en batch
   */
  async function generateMissingInterpretations(missingCount: number) {
    setGeneratingMissing(true);
    setProgress(0);

    try {
      // Generar todas las faltantes en batch
      const batchResponse = await fetch('/api/astrology/interpretations/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          yearLabel,
          maxConcurrent: 3 // Generar 3 a la vez
        })
      });

      if (!batchResponse.ok) {
        throw new Error('Error generando interpretaciones');
      }

      const batchData = await batchResponse.json();

      if (batchData.success) {
        console.log(`✅ Generadas ${batchData.data.generated} interpretaciones`);
        setProgress(100);

        // Recargar ciclo con interpretaciones nuevas
        await refetchCycle();
      }

    } catch (err: any) {
      console.error('Error generando interpretaciones:', err);
      // No seteamos error aquí porque queremos que el libro se muestre de todos modos
      // aunque falten algunas interpretaciones
    } finally {
      setGeneratingMissing(false);
    }
  }

  /**
   * Recarga el ciclo solar desde la API
   */
  async function refetchCycle() {
    try {
      const cycleResponse = await fetch(
        `/api/astrology/solar-cycles?userId=${userId}&yearLabel=${yearLabel}`
      );

      if (cycleResponse.ok) {
        const cycleData = await cycleResponse.json();
        if (cycleData.success) {
          // ✅ FIX: La API devuelve data.cycle, no data directamente
          setSolarCycle(cycleData.data.cycle || cycleData.data);
        }
      }
    } catch (err) {
      console.error('Error recargando ciclo:', err);
    }
  }

  /**
   * Obtiene los eventos de un mes específico
   * ✅ FIX: Devolver TODOS los eventos del mes, no solo los que tienen interpretación
   * El código de display manejará mostrar contenido genérico cuando no hay interpretación
   *
   * @param monthIndex - Índice del mes (0 = Enero, 1 = Febrero, etc.)
   * @returns Array de eventos del mes
   */
  function getEventosForMonth(monthIndex: number): AstrologicalEvent[] {
    if (!solarCycle || !solarCycle.events || !Array.isArray(solarCycle.events)) {
      return [];
    }

    return solarCycle.events.filter(event => {
      const eventDate = new Date(event.date);
      // ✅ FIX: Solo filtrar por mes, NO por si tiene interpretación
      // formatEventForBook generará contenido genérico si no hay interpretación personalizada
      return eventDate.getMonth() === monthIndex;
    });
  }

  return {
    solarCycle,
    loading,
    generatingMissing,
    progress,
    error,
    getEventosForMonth,
    refetchCycle,
    // ✅ NUEVO: Exponer estadísticas e interpretaciones
    eventStats,
    storedInterpretations
  };
}
