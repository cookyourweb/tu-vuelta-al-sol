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
   * Obtiene los eventos de un mes específico que tienen interpretación
   *
   * @param monthIndex - Índice del mes (0 = Enero, 1 = Febrero, etc.)
   * @returns Array de eventos del mes con interpretación
   */
  function getEventosForMonth(monthIndex: number): AstrologicalEvent[] {
    if (!solarCycle || !solarCycle.events || !Array.isArray(solarCycle.events)) {
      return [];
    }

    return solarCycle.events.filter(event => {
      const eventDate = new Date(event.date);
      const hasInterpretation = !!event.interpretation;

      // Filtrar por mes Y que tenga interpretación
      return eventDate.getMonth() === monthIndex && hasInterpretation;
    });
  }

  return {
    solarCycle,
    loading,
    generatingMissing,
    progress,
    error,
    getEventosForMonth,
    refetchCycle
  };
}
