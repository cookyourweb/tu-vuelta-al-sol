'use client';

import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X, FileDown, RefreshCw, Download, Info, Sparkles, BarChart3, AlertTriangle, Clock, Lightbulb, Calendar, BookOpen, Zap, Star, Target } from 'lucide-react';
import { useInterpretaciones } from '@/hooks/useInterpretaciones';
import { formatEventForBook, formatInterpretationCompact } from '@/utils/formatInterpretationForBook';

// Secciones del libro
import { PortadaPersonalizada, PaginaIntencion, PaginaIntencionAnualSR } from './PortalEntrada';
import { CartaBienvenida, GuiaAgenda, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from './TuAnioTuViaje';
import { TuAnioOverview, TuAnioCiclos, PaginaCumpleanos } from './TuAnio';
import { LineaTiempoEmocional, MesesClavePuntosGiro, GrandesAprendizajes } from './CiclosAnuales';
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from './SoulChart';
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, MercurioRetorno, VenusRetorno, MarteRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from './RetornoSolar';
import { IndiceNavegable } from './Indice';
import { CalendarioYMapaMes, LunasYEjercicios, SemanaConInterpretacion, CierreMes, PrimerDiaCiclo as PrimerDiaCicloMes } from './MesCompleto';
import { TransitosDelMes } from './TransitosDelMes';
import { CalendarioMensualTabla } from './CalendarioMensualTabla';
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from './TerapiaCreativa';
import { PrimerDiaCiclo, UltimoDiaCiclo, QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada, PaginaBlanca } from './PaginasEspeciales';
import '@/styles/print-libro.css';

interface AgendaLibroProps {
  onClose: () => void;
  userName: string;
  startDate: Date;
  endDate: Date;
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
  userId: string;          // NUEVO: ID del usuario para cargar interpretaciones
  yearLabel: string;       // NUEVO: Etiqueta del año (ej: "2025-2026")
}

// ✅ Helper para verificar si un evento tiene interpretación REAL (no vacía)
const eventoSinInterpretacion = (e: any): boolean => {
  const interp = e?.interpretation;
  if (!interp) return true;
  if (typeof interp === 'string') return interp.trim().length === 0;
  if (typeof interp === 'object') {
    return Object.keys(interp).length === 0 ||
      !Object.values(interp).some((v: any) => v !== null && v !== undefined && v !== '');
  }
  return false;
};

export const AgendaLibro = ({
  onClose,
  userName,
  startDate,
  endDate,
  sunSign,
  moonSign,
  ascendant,
  userId,
  yearLabel
}: AgendaLibroProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

  // Hook para manejar interpretaciones
  const {
    solarCycle,
    loading,
    generatingMissing,
    progress,
    error,
    getEventosForMonth,
    eventStats  // ✅ NUEVO: Estadísticas de eventos
  } = useInterpretaciones({ userId, yearLabel });

  // Estado para almacenar la interpretación del Retorno Solar
  const [solarReturnInterpretation, setSolarReturnInterpretation] = useState<any>(null);
  const [loadingSolarReturn, setLoadingSolarReturn] = useState(true);
  const [generatingSolarReturn, setGeneratingSolarReturn] = useState(false);
  const [shouldAutoGenerateSR, setShouldAutoGenerateSR] = useState(false);

  // Estado para almacenar la interpretación Natal
  const [natalInterpretation, setNatalInterpretation] = useState<any>(null);
  const [loadingNatal, setLoadingNatal] = useState(true);

  // Estado para almacenar la carta natal (con casas para personalizar lunares)
  const [natalChart, setNatalChart] = useState<any>(null);

  // Estado para almacenar la carta del Solar Return (con ejes)
  const [solarReturnChart, setSolarReturnChart] = useState<any>(null);

  // Estado para mostrar instrucciones de PDF
  const [showPdfInstructions, setShowPdfInstructions] = useState(false);

  // ✅ NUEVO: Estado para generación batch de interpretaciones
  const [generatingBatch, setGeneratingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // Efecto para cargar la interpretación del Retorno Solar desde la BD
  useEffect(() => {
    const fetchSolarReturnInterpretation = async () => {
      if (!userId) {
        setLoadingSolarReturn(false);
        return;
      }

      try {
        console.log('🔍 [SOLAR_RETURN] Buscando interpretación de Retorno Solar...');
        const response = await fetch(`/api/interpretations?userId=${userId}&chartType=solar-return`);
        const data = await response.json();

        if (data.exists && data.interpretation) {
          console.log('✅ [SOLAR_RETURN] Interpretación encontrada:', data.interpretation);

          // 🔍 DEBUG: Verificar campos específicos para páginas 11-12
          console.log('🔍 [DEBUG] linea_tiempo_emocional:', data.interpretation.linea_tiempo_emocional);
          console.log('🔍 [DEBUG] meses_clave_puntos_giro:', data.interpretation.meses_clave_puntos_giro);
          console.log('🔍 [DEBUG] Todas las keys:', Object.keys(data.interpretation));

          setSolarReturnInterpretation(data);
        } else {
          console.log('⚠️ [SOLAR_RETURN] No se encontró interpretación - marcando para auto-regenerar...');
          setSolarReturnInterpretation(null);
          // 🔄 AUTO-REGENERAR: Marcar para que el efecto siguiente lo genere
          setShouldAutoGenerateSR(true);
        }
      } catch (error) {
        console.error('❌ [SOLAR_RETURN] Error al cargar interpretación:', error);
      } finally {
        setLoadingSolarReturn(false);
      }
    };

    fetchSolarReturnInterpretation();

    // ✅ NUEVO: Recargar cuando el usuario vuelve a la pestaña/ventana
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ [SOLAR_RETURN] Pestaña visible, recargando interpretación...');
        fetchSolarReturnInterpretation();
      }
    };

    const handleFocus = () => {
      console.log('🎯 [SOLAR_RETURN] Ventana en foco, recargando interpretación...');
      fetchSolarReturnInterpretation();
    };

    // Escuchar cambios de visibilidad y foco
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId]);

  // Efecto para cargar la interpretación Natal desde la BD
  useEffect(() => {
    const fetchNatalInterpretation = async () => {
      if (!userId) {
        setLoadingNatal(false);
        return;
      }

      try {
        console.log('🔍 [NATAL] Buscando interpretación Natal...');
        const response = await fetch(`/api/interpretations?userId=${userId}&chartType=natal`);
        const data = await response.json();

        if (data.exists && data.interpretation) {
          console.log('✅ [NATAL] Interpretación encontrada');
          setNatalInterpretation(data);
        } else {
          console.log('⚠️ [NATAL] No se encontró interpretación Natal');
          setNatalInterpretation(null);
        }
      } catch (error) {
        console.error('❌ [NATAL] Error al cargar interpretación:', error);
      } finally {
        setLoadingNatal(false);
      }
    };

    fetchNatalInterpretation();
  }, [userId]);

  // Efecto para cargar la carta natal (con casas) desde la BD
  useEffect(() => {
    const fetchNatalChart = async () => {
      if (!userId) return;

      try {
        console.log('🌟 [NATAL_CHART] Cargando carta natal para casas...');
        const response = await fetch(`/api/charts/natal?userId=${userId}`);
        const data = await response.json();

        if (data.natalChart || data.chart || data.data?.chart) {
          const chart = data.natalChart || data.chart || data.data?.chart;
          console.log('✅ [NATAL_CHART] Carta natal cargada, casas disponibles:', chart.houses?.length || 0);
          setNatalChart(chart);
        } else {
          console.log('⚠️ [NATAL_CHART] No se encontró carta natal');
        }
      } catch (error) {
        console.error('❌ [NATAL_CHART] Error al cargar carta natal:', error);
      }
    };

    fetchNatalChart();
  }, [userId]);

  // Efecto para cargar la carta del Solar Return (con ejes)
  useEffect(() => {
    const fetchSolarReturnChart = async () => {
      if (!userId) return;

      try {
        console.log('☀️ [SR_CHART] Cargando carta Solar Return para ejes...');
        const response = await fetch(`/api/charts/solar-return?userId=${userId}`);
        const data = await response.json();

        const chart = data.data?.solarReturnChart || data.solarReturnChart || data.chart;
        if (chart) {
          console.log('✅ [SR_CHART] Carta SR cargada:', {
            ascendant: chart.ascendant?.sign,
            midheaven: chart.midheaven?.sign,
            houses: chart.houses?.length
          });
          setSolarReturnChart(chart);
        } else {
          console.log('⚠️ [SR_CHART] No se encontró carta Solar Return');
        }
      } catch (error) {
        console.error('❌ [SR_CHART] Error al cargar carta SR:', error);
      }
    };

    fetchSolarReturnChart();
  }, [userId]);

  // ==========================================
  // 🚀 AUTO-GENERAR SOLAR RETURN
  // ==========================================
  const handleGenerateSolarReturn = async () => {
    if (!userId || generatingSolarReturn) return;

    try {
      setGeneratingSolarReturn(true);
      console.log('🌅 [AUTO_GEN] Iniciando generación automática de Solar Return...');

      // 0. Verificar si ya existe SR
      console.log('🔍 [AUTO_GEN] Verificando si ya existe SR...');
      const checkResponse = await fetch(`/api/interpretations?userId=${userId}&chartType=solar-return`);
      const checkData = await checkResponse.json();

      if (checkData.exists && checkData.interpretation) {
        console.log('✅ [AUTO_GEN] SR ya existe, solo recargando...');
        setSolarReturnInterpretation(checkData);
        return;
      }

      // 1. Obtener birth data
      console.log('📍 [AUTO_GEN] Obteniendo birth data...');
      const birthDataResponse = await fetch(`/api/birth-data?userId=${userId}`);
      if (!birthDataResponse.ok) {
        throw new Error('No se encontraron datos de nacimiento');
      }
      const birthDataResult = await birthDataResponse.json();
      const birthData = birthDataResult.data || birthDataResult.birthData;

      if (!birthData) {
        console.error('❌ [AUTO_GEN] Birth data no encontrada en respuesta:', birthDataResult);
        throw new Error('Birth data no encontrada en la respuesta del servidor');
      }
      console.log('✅ [AUTO_GEN] Birth data obtenida:', { fullName: birthData.fullName, birthPlace: birthData.birthPlace });

      // 2. Obtener carta natal
      console.log('🌟 [AUTO_GEN] Obteniendo carta natal...');
      const natalResponse = await fetch(`/api/charts/natal?userId=${userId}`);
      if (!natalResponse.ok) {
        throw new Error('No se encontró la carta natal');
      }
      const natalData = await natalResponse.json();
      // ✅ FIX: Buscar en el campo correcto
      const natalChart = natalData.natalChart || natalData.chart || natalData.data?.chart;

      if (!natalChart) {
        console.error('❌ [AUTO_GEN] Carta natal no encontrada en respuesta:', natalData);
        throw new Error('Carta natal no encontrada en la respuesta del servidor');
      }
      console.log('✅ [AUTO_GEN] Carta natal obtenida correctamente');

      // 3. Generar carta de Solar Return
      console.log('☀️ [AUTO_GEN] Generando carta de Solar Return...');
      const srChartResponse = await fetch(`/api/charts/solar-return?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!srChartResponse.ok) {
        throw new Error('Error al generar carta de Solar Return');
      }
      const srChartData = await srChartResponse.json();
      // ✅ FIX: Buscar en el campo correcto
      const solarReturnChart = srChartData.data?.solarReturnChart || srChartData.solarReturnChart || srChartData.chart;

      if (!solarReturnChart) {
        console.error('❌ [AUTO_GEN] Carta SR no encontrada en respuesta:', srChartData);
        throw new Error('Carta Solar Return no encontrada en la respuesta del servidor');
      }
      console.log('✅ [AUTO_GEN] Carta Solar Return obtenida correctamente');

      // 4. Construir perfil de usuario desde birthData
      console.log('👤 [AUTO_GEN] Construyendo perfil de usuario desde birthData...');

      // Calcular edad desde birthDate
      const birthDateStr = birthData.date || birthData.birthDate;
      const birthDateObj = new Date(birthDateStr);
      const now = new Date();
      let age = now.getFullYear() - birthDateObj.getFullYear();
      const hasHadBirthdayThisYear = (now.getMonth() > birthDateObj.getMonth()) ||
        (now.getMonth() === birthDateObj.getMonth() && now.getDate() >= birthDateObj.getDate());
      if (!hasHadBirthdayThisYear) age -= 1;

      const userProfile = {
        name: birthData.fullName || 'Usuario',
        birthDate: birthDateStr,
        birthPlace: birthData.location || birthData.birthPlace,
        age: age
      };
      console.log('✅ [AUTO_GEN] UserProfile construido:', userProfile);

      // 5. Generar interpretación del Solar Return
      console.log('🤖 [AUTO_GEN] Generando interpretación con IA...');
      console.log('📦 [AUTO_GEN] Datos a enviar:', {
        userId: userId ? '✅' : '❌',
        natalChart: natalChart ? '✅' : '❌',
        solarReturnChart: solarReturnChart ? '✅' : '❌',
        userProfile: userProfile ? '✅' : '❌',
        birthData: birthData ? '✅' : '❌'
      });

      const interpretResponse = await fetch(`/api/astrology/interpret-solar-return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          natalChart,
          solarReturnChart,
          userProfile,
          birthData,
          regenerate: false
        })
      });

      if (!interpretResponse.ok) {
        const errorData = await interpretResponse.json();
        const errorMsg = errorData.error || errorData.message || 'Error desconocido';
        console.error('❌ [AUTO_GEN] Error del endpoint:', errorMsg);
        throw new Error(`Error al generar interpretación: ${errorMsg}`);
      }

      const interpretData = await interpretResponse.json();
      console.log('✅ [AUTO_GEN] Solar Return generado exitosamente:', interpretData);

      // 6. Recargar la interpretación
      const reloadResponse = await fetch(`/api/interpretations?userId=${userId}&chartType=solar-return`);
      const reloadData = await reloadResponse.json();

      if (reloadData.exists && reloadData.interpretation) {
        setSolarReturnInterpretation(reloadData);
        console.log('✅ [AUTO_GEN] Interpretación cargada en el libro');
      }

    } catch (error: any) {
      console.error('❌ [AUTO_GEN] Error al generar Solar Return:', error);
      alert(`Error al generar Solar Return: ${error.message}\n\nPor favor, intenta generar manualmente desde la página de Solar Return.`);
    } finally {
      setGeneratingSolarReturn(false);
    }
  };

  // ==========================================
  // 🔄 AUTO-TRIGGER: Generar SR cuando no existe
  // ==========================================
  useEffect(() => {
    if (shouldAutoGenerateSR && !generatingSolarReturn && userId) {
      console.log('🚀 [AUTO_TRIGGER] shouldAutoGenerateSR es true, llamando a handleGenerateSolarReturn...');
      setShouldAutoGenerateSR(false); // Reset el flag
      handleGenerateSolarReturn();
    }
  }, [shouldAutoGenerateSR, generatingSolarReturn, userId]);

  // ==========================================
  // 🚀 AUTO-TRIGGER: Generar interpretaciones batch cuando faltan
  // El libro SIEMPRE debe generar las interpretaciones si no existen
  // ==========================================
  useEffect(() => {
    if (
      !loading &&
      !generatingBatch &&
      !generatingMissing &&
      eventStats.total > 0 &&
      eventStats.sinInterpretacion > 0 &&
      userId &&
      yearLabel
    ) {
      console.log(`🚀 [AUTO_BATCH] Detectadas ${eventStats.sinInterpretacion} interpretaciones faltantes. Generando automáticamente...`);
      handleGenerateBatch();
    }
  }, [loading, eventStats.total, eventStats.sinInterpretacion, generatingBatch, generatingMissing, userId, yearLabel]);

  // ==========================================
  // 🔄 REGENERAR SOLAR RETURN (FORZADO)
  // ==========================================
  const handleRegenerateSolarReturn = async () => {
    if (!userId || generatingSolarReturn) return;

    const confirmRegenerate = window.confirm(
      '¿Estás seguro de que quieres regenerar la interpretación del Solar Return?\n\n' +
      'Esto borrará la interpretación actual y creará una nueva con los campos actualizados.\n\n' +
      'El proceso puede tardar 1-2 minutos.'
    );

    if (!confirmRegenerate) return;

    try {
      setGeneratingSolarReturn(true);
      console.log('🔄 [REGENERATE] Iniciando regeneración forzada...');

      // 1. Borrar la interpretación existente
      console.log('🗑️ [REGENERATE] Borrando interpretación existente...');
      const deleteResponse = await fetch(`/api/interpretations/save?userId=${userId}&chartType=solar-return`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log('✅ [REGENERATE] Interpretación borrada correctamente');
      } else {
        console.warn('⚠️ [REGENERATE] No se pudo borrar la interpretación (puede no existir)');
      }

      // 2. Obtener datos necesarios para la generación
      console.log('📍 [REGENERATE] Obteniendo birth data...');
      const birthDataResponse = await fetch(`/api/birth-data?userId=${userId}`);
      if (!birthDataResponse.ok) {
        throw new Error('No se encontraron datos de nacimiento');
      }
      const birthDataResult = await birthDataResponse.json();
      const birthData = birthDataResult.data || birthDataResult.birthData;

      if (!birthData) {
        console.error('❌ [REGENERATE] Birth data no encontrada en respuesta:', birthDataResult);
        throw new Error('Birth data no encontrada en la respuesta del servidor');
      }
      console.log('✅ [REGENERATE] Birth data obtenida:', { fullName: birthData.fullName, birthPlace: birthData.birthPlace });

      console.log('🌟 [REGENERATE] Obteniendo carta natal...');
      const natalResponse = await fetch(`/api/charts/natal?userId=${userId}`);
      if (!natalResponse.ok) {
        throw new Error('No se encontró la carta natal');
      }
      const natalData = await natalResponse.json();
      // ✅ FIX: Buscar en el campo correcto
      const natalChart = natalData.natalChart || natalData.chart || natalData.data?.chart;

      if (!natalChart) {
        console.error('❌ [REGENERATE] Estructura de respuesta natal:', natalData);
        throw new Error('Carta natal no encontrada en la respuesta');
      }

      console.log('✅ [REGENERATE] Carta natal obtenida correctamente');

      console.log('☀️ [REGENERATE] Obteniendo carta de Solar Return...');
      const srChartResponse = await fetch(`/api/charts/solar-return?userId=${userId}`);
      if (!srChartResponse.ok) {
        throw new Error('No se encontró la carta de Solar Return');
      }
      const srChartData = await srChartResponse.json();
      // ✅ FIX: Buscar en el campo correcto primero
      const solarReturnChart = srChartData.data?.solarReturnChart || srChartData.solarReturnChart || srChartData.chart;

      if (!solarReturnChart) {
        console.error('❌ [REGENERATE] Estructura de respuesta SR:', srChartData);
        throw new Error('Carta Solar Return no encontrada en la respuesta');
      }

      console.log('✅ [REGENERATE] Carta Solar Return obtenida correctamente');

      console.log('👤 [REGENERATE] Construyendo perfil de usuario desde birthData...');

      // Calcular edad desde birthDate
      const birthDateStr = birthData.date || birthData.birthDate;
      const birthDateObj = new Date(birthDateStr);
      const now = new Date();
      let age = now.getFullYear() - birthDateObj.getFullYear();
      const hasHadBirthdayThisYear = (now.getMonth() > birthDateObj.getMonth()) ||
        (now.getMonth() === birthDateObj.getMonth() && now.getDate() >= birthDateObj.getDate());
      if (!hasHadBirthdayThisYear) age -= 1;

      const userProfile = {
        name: birthData.fullName || 'Usuario',
        birthDate: birthDateStr,
        birthPlace: birthData.location || birthData.birthPlace,
        age: age
      };
      console.log('✅ [REGENERATE] UserProfile construido:', userProfile);

      // 3. Generar nueva interpretación con regenerate=true
      console.log('🤖 [REGENERATE] Generando nueva interpretación con IA...');
      const interpretResponse = await fetch(`/api/astrology/interpret-solar-return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          natalChart,
          solarReturnChart,
          userProfile,
          birthData,
          regenerate: true  // ✅ FORZAR REGENERACIÓN
        })
      });

      if (!interpretResponse.ok) {
        const errorData = await interpretResponse.json();
        const errorMsg = errorData.error || errorData.message || 'Error desconocido';
        throw new Error(`Error al generar interpretación: ${errorMsg}`);
      }

      const interpretData = await interpretResponse.json();
      console.log('✅ [REGENERATE] Nueva interpretación generada exitosamente');

      // 4. Recargar la página para mostrar la nueva interpretación
      console.log('🔄 [REGENERATE] Recargando página...');
      window.location.reload();

    } catch (error: any) {
      console.error('❌ [REGENERATE] Error:', error);
      alert(`Error al regenerar la interpretación:\n\n${error.message}\n\nPor favor, verifica que tengas una carta de Solar Return generada primero.`);
    } finally {
      setGeneratingSolarReturn(false);
    }
  };

  // ==========================================
  // 🚀 GENERAR TODAS LAS INTERPRETACIONES FALTANTES (BATCH)
  // ==========================================
  const handleGenerateBatch = async () => {
    if (generatingBatch || eventStats.sinInterpretacion === 0) return;

    try {
      setGeneratingBatch(true);
      setBatchProgress(0);
      console.log(`🚀 [BATCH] Generando ${eventStats.sinInterpretacion} interpretaciones faltantes...`);

      const response = await fetch('/api/astrology/interpretations/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          yearLabel,
          maxConcurrent: 3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error generando interpretaciones');
      }

      const data = await response.json();
      console.log('✅ [BATCH] Resultado:', data);

      if (data.success) {
        setBatchProgress(100);
        // Recargar la página para ver las nuevas interpretaciones
        window.location.reload();
      }
    } catch (error: any) {
      console.error('❌ [BATCH] Error:', error);
      alert(`Error al generar interpretaciones: ${error.message}`);
    } finally {
      setGeneratingBatch(false);
    }
  };

  const handlePrint = () => {
    // Forzar el layout antes de imprimir
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExportPDF = () => {
    setShowPdfInstructions(true);
  };

  const handleConfirmPDF = () => {
    setShowPdfInstructions(false);
    // Pequeño delay para que se cierre el modal antes de imprimir
    window.setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleExportTXT = () => {
    let t = '';
    const sep = '═══════════════════════════════════════════════════════════';
    const sub = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    const section = (title: string) => `\n${sep}\n  ${title}\n${sep}\n\n`;
    const heading = (title: string) => `━━━ ${title} ━━━\n`;

    // PORTADA
    t += section('TU VUELTA AL SOL - AGENDA ASTROLÓGICA');
    t += `Agenda de: ${userName}\n`;
    t += `Período: ${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })} - ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}\n`;
    if (sunSign) t += `Sol en: ${sunSign}\n`;
    if (moonSign) t += `Luna en: ${moonSign}\n`;
    if (ascendant) t += `Ascendente: ${ascendant}\n`;
    t += '\n';

    // CARTA DE BIENVENIDA
    t += section('CARTA DE BIENVENIDA');
    t += `Querida ${userName},\n\n`;
    t += 'Hoy empieza un nuevo ciclo. No es un año más: es TU año.\n';
    t += 'Cumples años, y el Sol vuelve al mismo lugar donde estaba cuando llegaste al mundo.\n';
    t += 'Ese instante no es solo simbólico: es un portal.\n\n';
    t += 'Esta agenda no te dirá qué hacer. Te ayudará a escucharte.\n';
    t += 'A bajar el ruido. A confiar en tu ritmo.\n\n';
    t += 'Bienvenida a tu vuelta al Sol.\n\n';

    // GUÍA DE LA AGENDA
    t += section('QUÉ VAS A ENCONTRAR EN ESTA AGENDA');
    t += 'Tu Carta Natal: Tu esencia, tus dones, tu propósito vital.\n';
    t += 'Tu Retorno Solar: El tema central de tu año y qué vino a moverte.\n';
    t += 'Calendario Astrológico: 13 meses con Lunas, eclipses, retrogradaciones y tránsitos.\n';
    t += 'Ejercicios y Rituales: Prácticas, mantras y espacios para escribir.\n\n';

    // ═══════════════════════════════════════════════════════════
    // CARTA NATAL
    // ═══════════════════════════════════════════════════════════
    const natalData = getNatalInterpretation();
    t += section('CARTA NATAL - TU ESENCIA');

    if (natalData) {
      const esencia = getEsenciaNatal();
      if (esencia) {
        if (esencia.proposito_vida) { t += heading('TU PROPÓSITO VITAL'); t += esencia.proposito_vida + '\n\n'; }
        if (esencia.emociones) { t += heading('TU MUNDO EMOCIONAL'); t += esencia.emociones + '\n\n'; }
        if (esencia.personalidad) { t += heading('TU PERSONALIDAD'); t += esencia.personalidad + '\n\n'; }
        if (esencia.pensamiento) { t += heading('CÓMO PIENSAS Y TE COMUNICAS'); t += esencia.pensamiento + '\n\n'; }
        if (esencia.amor) { t += heading('CÓMO AMAS'); t += esencia.amor + '\n\n'; }
        if (esencia.accion) { t += heading('CÓMO ACTÚAS'); t += esencia.accion + '\n\n'; }
      }

      // NODOS LUNARES
      const nodos = getNodosLunares();
      if (nodos) {
        if (nodos.nodo_sur) { t += heading('NODO SUR (De dónde vienes)'); t += nodos.nodo_sur + '\n\n'; }
        if (nodos.nodo_norte) { t += heading('NODO NORTE (Hacia dónde vas)'); t += nodos.nodo_norte + '\n\n'; }
      }

      // PLANETAS DOMINANTES
      const planetas = getPlanetasDominantes();
      if (planetas) {
        t += heading('PLANETAS DOMINANTES');
        if (planetas.como_piensas) t += `Mercurio (Pensamiento): ${planetas.como_piensas}\n\n`;
        if (planetas.proposito_vida) t += `Sol (Propósito): ${planetas.proposito_vida}\n\n`;
        if (planetas.emociones) t += `Luna (Emociones): ${planetas.emociones}\n\n`;
        if (planetas.como_amas) t += `Venus (Amor): ${planetas.como_amas}\n\n`;
        if (planetas.como_actuas) t += `Marte (Acción): ${planetas.como_actuas}\n\n`;
      }

      // PATRONES EMOCIONALES
      const patrones = getPatronesEmocionales();
      if (patrones) {
        t += heading('PATRONES EMOCIONALES');
        if (patrones.patrones && Array.isArray(patrones.patrones)) {
          patrones.patrones.forEach((p: any, i: number) => {
            const txt = typeof p === 'string' ? p : p.descripcion || p.nombre || JSON.stringify(p);
            t += `${i + 1}. ${txt}\n`;
          });
          t += '\n';
        }
        if (patrones.sombra) { t += `Sombra: ${patrones.sombra}\n\n`; }
      }
    } else {
      if (sunSign) t += `Sol en ${sunSign}: Tu esencia y propósito vital.\n`;
      if (moonSign) t += `Luna en ${moonSign}: Tus necesidades emocionales.\n`;
      if (ascendant) t += `Ascendente en ${ascendant}: Cómo te perciben los demás.\n`;
      t += '\n';
    }

    // ═══════════════════════════════════════════════════════════
    // RETORNO SOLAR
    // ═══════════════════════════════════════════════════════════
    const srData = getSRInterpretation();
    if (srData) {
      t += section('TU RETORNO SOLAR DEL AÑO');

      // APERTURA ANUAL
      if (srData.apertura_anual) {
        if (srData.apertura_anual.tema_central) { t += heading('TEMA CENTRAL DEL AÑO'); t += srData.apertura_anual.tema_central + '\n\n'; }
        if (srData.apertura_anual.eje_del_ano) { t += heading('EJE DEL AÑO'); t += srData.apertura_anual.eje_del_ano + '\n\n'; }
        if (srData.apertura_anual.como_se_siente) { t += heading('CÓMO SE SIENTE'); t += srData.apertura_anual.como_se_siente + '\n\n'; }
        if (srData.apertura_anual.conexion_natal) { t += heading('CONEXIÓN CON TU CARTA NATAL'); t += srData.apertura_anual.conexion_natal + '\n\n'; }
      }

      // CÓMO SE VIVE SIENDO TÚ
      if (srData.como_se_vive_siendo_tu) {
        t += heading('CÓMO SE VIVE SIENDO TÚ ESTE AÑO');
        const csv = srData.como_se_vive_siendo_tu;
        if (csv.facilidad) t += `Lo que fluye: ${csv.facilidad}\n\n`;
        if (csv.incomodidad) t += `Lo que incomoda: ${csv.incomodidad}\n\n`;
        if (csv.medida_del_ano) t += `La medida del año: ${csv.medida_del_ano}\n\n`;
        if (csv.reflejos_obsoletos) t += `Reflejos obsoletos: ${csv.reflejos_obsoletos}\n\n`;
        if (csv.actitud_nueva) t += `Actitud nueva: ${csv.actitud_nueva}\n\n`;
      }

      // COMPARACIONES PLANETARIAS DETALLADAS
      if (srData.comparaciones_planetarias) {
        t += heading('COMPARACIONES NATAL vs SOLAR RETURN');
        const planetas = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno'];
        planetas.forEach((planeta) => {
          const comp = srData.comparaciones_planetarias[planeta];
          if (comp) {
            t += `\n▸ ${planeta.toUpperCase()}\n`;
            if (comp.natal) t += `  Natal: ${typeof comp.natal === 'string' ? comp.natal : comp.natal.descripcion || ''}\n`;
            if (comp.solar_return) t += `  Solar Return: ${typeof comp.solar_return === 'string' ? comp.solar_return : comp.solar_return.descripcion || ''}\n`;
            if (comp.choque) t += `  Tensión: ${comp.choque}\n`;
            if (comp.que_hacer) t += `  Qué hacer: ${comp.que_hacer}\n`;
            if (comp.mandato_del_ano) t += `  Mandato del año: ${comp.mandato_del_ano}\n`;
          }
        });
        t += '\n';
      }

      // EJES DEL AÑO (datos reales)
      const ejes = getIntegracionEjes();
      const ejesSignos = getEjesSignos();
      if (ejes) {
        t += heading('LOS EJES DEL AÑO');
        if (ejes.asc) t += `Ascendente (Casa 1)${ejesSignos?.asc ? ` en ${ejesSignos.asc.sign}` : ''}: ${typeof ejes.asc === 'string' ? ejes.asc : ''}\n\n`;
        if (ejes.ic) t += `Fondo del Cielo IC (Casa 4)${ejesSignos?.ic ? ` en ${ejesSignos.ic.sign}` : ''}: ${typeof ejes.ic === 'string' ? ejes.ic : ''}\n\n`;
        if (ejes.mc) t += `Medio Cielo MC (Casa 10)${ejesSignos?.mc ? ` en ${ejesSignos.mc.sign}` : ''}: ${typeof ejes.mc === 'string' ? ejes.mc : ''}\n\n`;
        if (ejes.dsc) t += `Descendente (Casa 7)${ejesSignos?.dsc ? ` en ${ejesSignos.dsc.sign}` : ''}: ${typeof ejes.dsc === 'string' ? ejes.dsc : ''}\n\n`;
        if (ejes.frase_guia) t += `Frase guía: "${ejes.frase_guia}"\n\n`;
      }

      // MANTRA ANUAL
      const mantraAnual = srData.frase_guia || srData.mantra_anual || ejes?.frase_guia;
      if (mantraAnual) {
        t += heading('MANTRA ANUAL');
        t += `"${mantraAnual}"\n\n`;
      }

      // LÍNEA DE TIEMPO
      if (srData.linea_tiempo_anual?.length > 0) {
        t += heading('LÍNEA DE TIEMPO DEL AÑO');
        srData.linea_tiempo_anual.forEach((fase: any, i: number) => {
          t += `▸ ${fase.periodo || fase.mes || `Fase ${i + 1}`}`;
          if (fase.descripcion) t += `: ${fase.descripcion}`;
          if (fase.accion_clave) t += ` | Acción: ${fase.accion_clave}`;
          t += '\n';
        });
        t += '\n';
      }

      // LÍNEA DE TIEMPO EMOCIONAL
      if (srData.linea_tiempo_emocional?.length > 0) {
        t += heading('LÍNEA DE TIEMPO EMOCIONAL');
        srData.linea_tiempo_emocional.forEach((mes: any) => {
          t += `▸ ${mes.mes}: Intensidad ${mes.intensidad}/10`;
          if (mes.palabra_clave) t += ` · ${mes.palabra_clave}`;
          t += '\n';
        });
        t += '\n';
      }

      // MESES CLAVE Y PUNTOS DE GIRO
      if (srData.meses_clave_puntos_giro?.length > 0) {
        t += heading('MESES CLAVE Y PUNTOS DE GIRO');
        srData.meses_clave_puntos_giro.forEach((punto: any, i: number) => {
          t += `${i + 1}. ${punto.mes || punto.periodo}`;
          if (punto.evento_astrologico) t += ` — ${punto.evento_astrologico}`;
          if (punto.significado) t += `\n   ${punto.significado}`;
          t += '\n';
        });
        t += '\n';
      }

      // SOMBRAS Y DESAFÍOS
      if (srData.sombras_del_ano?.length > 0) {
        t += heading('SOMBRAS Y DESAFÍOS DEL AÑO');
        srData.sombras_del_ano.forEach((s: string, i: number) => { t += `${i + 1}. ${s}\n`; });
        t += '\n';
      }

      // CLAVES DE INTEGRACIÓN
      if (srData.claves_integracion?.length > 0) {
        t += heading('CLAVES DE INTEGRACIÓN');
        srData.claves_integracion.forEach((c: string, i: number) => { t += `${i + 1}. ${c}\n`; });
        t += '\n';
      }
    }

    // RITUAL DE CUMPLEAÑOS
    t += section('RITUAL DE CUMPLEAÑOS');
    t += 'Necesitas: Una vela, papel, bolígrafo y un momento de soledad.\n\n';
    t += '1. Enciende la vela y respira profundo tres veces.\n';
    t += '2. Escribe una carta a la versión de ti que cumple años el próximo año.\n';
    t += '3. Cuéntale qué esperas haber aprendido, sentido, soltado.\n';
    t += '4. Guarda la carta sin leerla hasta tu próximo cumpleaños.\n';
    t += '5. Apaga la vela con gratitud.\n\n';

    // PRIMER DÍA DEL CICLO
    t += section('PRIMER DÍA DE TU CICLO');
    t += `${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })}\n`;
    t += `¡Feliz cumpleaños, ${userName}!\n\n`;

    const temaCentral = getInterpretacionRetornoSolar();
    const mandato = getSRInterpretation()?.comparaciones_planetarias?.sol?.mandato_del_ano;
    if (temaCentral) { t += heading('TU TEMA PARA ESTE CICLO'); t += temaCentral + '\n\n'; }
    if (mandato) { t += heading('LA INVITACIÓN DEL AÑO'); t += `"${mandato}"\n\n`; }

    t += 'Preguntas para reflexionar:\n';
    t += '• ¿Qué sensaciones te ha dejado esta lectura?\n';
    t += '• ¿Qué palabras o frases resuenan más contigo?\n';
    t += '• ¿Hay algo que ya sabías pero necesitabas confirmar?\n\n';

    // ═══════════════════════════════════════════════════════════
    // CALENDARIO MENSUAL COMPLETO (13 meses con interpretaciones)
    // ═══════════════════════════════════════════════════════════
    t += section('CALENDARIO DE TU AÑO SOLAR');
    const mesesNombres = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const therapyExercises: Record<number, string> = {
      3: 'ESCRITURA TERAPÉUTICA\nEjercicio: Escribe durante 10 minutos sin parar. No corrijas, no juzgues.\nPregunta guía: "Si mi cuerpo pudiera hablar, ¿qué me diría que estoy ignorando?"\n',
      6: 'VISUALIZACIÓN GUIADA\nCierra los ojos. Imagina que caminas por un sendero hasta encontrar a tu yo del futuro.\nAnota: ¿Qué vi? ¿Qué escuché? ¿Qué sentí?\n',
      9: 'RITUAL SIMBÓLICO\nEscribe en un papel lo que necesitas soltar. Léelo en voz alta.\nQuémalo, entiérralo o sumérgelo en agua.\nAnota: ¿Qué solté hoy? ¿Qué siento ahora?\n',
      12: 'TRABAJO EMOCIONAL\nEscaneo corporal: Cierra los ojos y recorre tu cuerpo de pies a cabeza.\nAnota: ¿Dónde siento tensión? ¿Dónde siento ligereza?\n¿Qué me está diciendo mi cuerpo?\n'
    };

    calendarMonths.forEach((month) => {
      const mesNombre = mesesNombres[month.monthIndex];
      const year = month.monthDate.getFullYear();
      const mesLabel = month.isBirthdayMonth ? `${mesNombre} ${year} (Inicio del ciclo)` :
        month.isClosingMonth ? `${mesNombre} ${year} (Fin del ciclo)` :
        `${mesNombre} ${year}`;

      t += `\n${sub}\n  MES ${month.mesNumero}: ${mesLabel.toUpperCase()}\n`;
      if (month.nombre) t += `  ${month.nombre} · ${month.tema || ''}\n`;
      t += `${sub}\n\n`;

      // EVENTOS LUNARES con interpretaciones
      const lunarEvents = getLunarEventsForMonth(month.monthIndex);
      if (lunarEvents.length > 0) {
        lunarEvents.forEach((evento: any) => {
          const tipoLabel = evento.tipo === 'lunaNueva' ? 'LUNA NUEVA' : 'LUNA LLENA';
          t += `▸ ${evento.dia} - ${tipoLabel}${evento.signo ? ` en ${evento.signo}` : ''}`;
          if (evento.casaNatal) t += ` · Casa ${evento.casaNatal}`;
          t += '\n';
          if (evento.interpretacion) {
            t += `  ${evento.interpretacion}\n`;
          }
          t += '\n';
        });
      }

      // TRÁNSITOS con interpretaciones
      const transitos = getTransitEventsForMonth(month.monthIndex);
      if (transitos.length > 0) {
        t += '--- Tránsitos del mes ---\n';
        transitos.forEach((tr: any) => {
          const tipoLabel = tr.tipo === 'retrogrado' ? 'Retrogradación' : tr.tipo === 'ingreso' ? 'Ingreso' : 'Evento';
          t += `▸ ${tr.dia} - ${tipoLabel}: ${tr.titulo}`;
          if (tr.signo) t += ` en ${tr.signo}`;
          t += '\n';
          if (tr.interpretacion) {
            t += `  ${tr.interpretacion}\n`;
          }
          t += '\n';
        });
      }

      // REFLEXIÓN MENSUAL
      const reflexion = getMonthlyTransitReflection(month.monthIndex);
      if (reflexion) {
        t += `Reflexión del mes: ${reflexion}\n\n`;
      }

      // EJERCICIO Y MANTRA DEL MES
      const themeData = getMonthlyThemeData(month.monthIndex);
      if (themeData.ejercicioCentral) {
        t += `Ejercicio: ${themeData.ejercicioCentral.titulo}\n`;
        t += `${themeData.ejercicioCentral.descripcion}\n\n`;
      }
      if (themeData.mantra) {
        t += `Mantra del mes: "${themeData.mantra}"\n\n`;
      }

      // CIERRE DEL MES
      t += '--- Cierre del mes ---\n';
      t += '¿Qué cambió en mí este mes?\n';
      t += '¿Qué solté sin darme cuenta?\n';
      t += '¿Qué descubrí sobre mí?\n';
      t += 'Una palabra que resume este mes: _______________\n\n';

      // TERAPIA CREATIVA (para meses 3, 6, 9, 12)
      if (therapyExercises[month.mesNumero]) {
        t += `--- ${therapyExercises[month.mesNumero]}\n\n`;
      }
    });

    // ═══════════════════════════════════════════════════════════
    // CIERRE DEL CICLO
    // ═══════════════════════════════════════════════════════════
    t += section('CIERRE DEL CICLO');

    t += heading('¿QUIÉN ERA? ¿QUIÉN SOY?');
    t += '¿Quién era cuando empecé este año?\n\n';
    t += '¿Quién soy ahora?\n\n';
    t += '¿Qué versión de mí nació este año?\n\n';

    t += heading('PREPARACIÓN PARA LA PRÓXIMA VUELTA');
    const clavesI = getClavesIntegracion();
    if (clavesI?.length) {
      t += 'Claves de integración de este año:\n';
      clavesI.forEach((c: string, i: number) => { t += `${i + 1}. ${c}\n`; });
      t += '\n';
    }
    t += '¿Qué me llevo conmigo?\n\n';
    t += '¿Qué dejo aquí?\n\n';
    t += '¿Cuál es mi deseo para el próximo ciclo?\n\n';

    t += heading('CARTA DE CIERRE');
    t += `Querida ${userName},\n\n`;
    t += 'Has llegado al final de este ciclo.\n';
    t += 'Nada fue casual. Todo fue parte del proceso.\n';
    t += 'Lo que dolió te enseñó. Lo que fluyó te confirmó.\n\n';
    t += 'No importa si seguiste cada página o si saltaste donde te llamó la intuición.\n';
    t += 'Este libro fue tuyo desde el primer momento.\n\n';
    t += 'Nos vemos en la próxima vuelta al Sol.\n\n';

    t += `\n${sep}\n  No todo fue fácil. Pero todo tuvo sentido.\n  tuvueltaalsol.es\n${sep}\n`;

    // Descargar archivo
    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tu-vuelta-al-sol-${userName.toLowerCase().replace(/\s+/g, '-')}-${format(startDate, 'yyyy')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: Obtener eventos formateados para un mes específico
  const getFormattedEventosForMonth = (monthIndex: number) => {
    const eventos = getEventosForMonth(monthIndex);
    // Pasar casas natales para personalizar interpretaciones lunares
    const natalHouses = natalChart?.houses;
    return eventos.map(event => formatEventForBook(event, natalHouses));
  };

  // Helper: Obtener la interpretación completa del SR
  const getSRInterpretation = () => {
    if (loadingSolarReturn || !solarReturnInterpretation) {
      return null;
    }
    return solarReturnInterpretation.interpretation;
  };

  // Helper: Obtener tema central del Retorno Solar
  const getInterpretacionRetornoSolar = (): string | undefined => {
    const interpretation = getSRInterpretation();
    if (!interpretation) return undefined;

    const temaCentral =
      interpretation.apertura_anual?.tema_central ||
      interpretation.tema_central_del_anio ||
      interpretation.tema_central ||
      interpretation.overview ||
      interpretation.mensaje_principal;

    if (temaCentral) {
      console.log('✅ [SOLAR_RETURN] Tema central encontrado:', temaCentral.substring(0, 100) + '...');
    }
    return temaCentral;
  };

  // Helper: Obtener "Cómo se vive siendo tú"
  const getComoSeViveSiendoTu = () => {
    const interpretation = getSRInterpretation();
    if (!interpretation?.como_se_vive_siendo_tu) return null;

    return {
      facilidad: interpretation.como_se_vive_siendo_tu.facilidad,
      incomodidad: interpretation.como_se_vive_siendo_tu.incomodidad,
      medida_del_ano: interpretation.como_se_vive_siendo_tu.medida_del_ano,
      reflejos_obsoletos: interpretation.como_se_vive_siendo_tu.reflejos_obsoletos,
      actitud_nueva: interpretation.como_se_vive_siendo_tu.actitud_nueva
    };
  };

  // Helper: Obtener sombras del año
  const getSombrasDelAno = (): string[] | undefined => {
    const interpretation = getSRInterpretation();
    return interpretation?.sombras_del_ano;
  };

  // Helper: Obtener interpretación Natal completa
  const getNatalInterpretation = () => {
    if (loadingNatal || !natalInterpretation) {
      return null;
    }
    return natalInterpretation.interpretation;
  };

  // Helper: Obtener esencia natal
  // ✅ FIX: Mapear correctamente desde la estructura del prompt (campos anidados)
  const getEsenciaNatal = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation) return null;

    // Buscar en ambas estructuras posibles (nueva estructura anidada vs estructura plana antigua)
    return {
      // Propósito de vida: sol.interpretacion o proposito_vida (fallback)
      proposito_vida: interpretation.sol?.interpretacion || interpretation.proposito_vida,
      // Emociones: luna.interpretacion o emociones (fallback)
      emociones: interpretation.luna?.interpretacion || interpretation.emociones,
      // Personalidad: ascendente.interpretacion o personalidad (fallback)
      personalidad: interpretation.ascendente?.interpretacion || interpretation.personalidad,
      // Pensamiento: mercurio.interpretacion o como_piensas_y_hablas (fallback)
      pensamiento: interpretation.mercurio?.interpretacion || interpretation.como_piensas_y_hablas,
      // Amor: venus.interpretacion o como_amas (fallback)
      amor: interpretation.venus?.interpretacion || interpretation.como_amas,
      // Acción: marte.interpretacion o como_enfrentas_la_vida (fallback)
      accion: interpretation.marte?.interpretacion || interpretation.como_enfrentas_la_vida
    };
  };

  // Helper: Obtener nodos lunares
  // ✅ FIX: Buscar en estructura nueva (nodo_sur/nodo_norte directos) o antigua (nodos_lunares.nodo_sur/nodo_norte)
  const getNodosLunares = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation) return null;

    // Función para convertir nodo objeto a string
    const formatNodo = (nodo: any): string | undefined => {
      if (!nodo) return undefined;
      if (typeof nodo === 'string') return nodo;

      // Si tiene interpretacion directa (estructura nueva del prompt)
      if (nodo.interpretacion) {
        const parts: string[] = [nodo.interpretacion];
        if (nodo.zona_comoda) parts.push(`\n\nZona de confort: ${nodo.zona_comoda}`);
        if (nodo.direccion_evolutiva) parts.push(`\n\nDirección evolutiva: ${nodo.direccion_evolutiva}`);
        return parts.join('');
      }

      // Si es objeto con estructura antigua {signo_casa, direccion_evolutiva, desafio}
      const parts: string[] = [];
      if (nodo.signo_casa) parts.push(nodo.signo_casa);
      if (nodo.direccion_evolutiva) parts.push(`Dirección evolutiva: ${nodo.direccion_evolutiva}`);
      if (nodo.desafio) parts.push(`Desafío: ${nodo.desafio}`);
      if (nodo.patrones_pasados) parts.push(`Patrones pasados: ${nodo.patrones_pasados}`);
      if (nodo.zona_confort) parts.push(`Zona de confort: ${nodo.zona_confort}`);

      return parts.length > 0 ? parts.join('\n\n') : undefined;
    };

    // Buscar en estructura nueva (directa) o antigua (bajo nodos_lunares)
    const nodoSur = interpretation.nodo_sur || interpretation.nodos_lunares?.nodo_sur;
    const nodoNorte = interpretation.nodo_norte || interpretation.nodos_lunares?.nodo_norte;

    if (!nodoSur && !nodoNorte) return null;

    return {
      nodo_sur: formatNodo(nodoSur),
      nodo_norte: formatNodo(nodoNorte)
    };
  };

  // Helper: Obtener planetas dominantes
  // ✅ FIX: Mapear correctamente desde la estructura del prompt (campos anidados)
  const getPlanetasDominantes = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation) return null;

    return {
      // Mercurio: mercurio.interpretacion o como_piensas_y_hablas (fallback)
      como_piensas: interpretation.mercurio?.interpretacion || interpretation.como_piensas_y_hablas,
      // Sol: sol.interpretacion o proposito_vida (fallback)
      proposito_vida: interpretation.sol?.interpretacion || interpretation.proposito_vida,
      // Luna: luna.interpretacion o emociones (fallback)
      emociones: interpretation.luna?.interpretacion || interpretation.emociones,
      // Venus: venus.interpretacion o como_amas (fallback)
      como_amas: interpretation.venus?.interpretacion || interpretation.como_amas,
      // Marte: marte.interpretacion o como_enfrentas_la_vida (fallback)
      como_actuas: interpretation.marte?.interpretacion || interpretation.como_enfrentas_la_vida
    };
  };

  // Helper: Obtener patrones emocionales
  const getPatronesEmocionales = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation) return null;

    // Buscar patrones en diferentes campos posibles
    const patrones = interpretation.patrones_emocionales ||
                     interpretation.patrones ||
                     interpretation.patrones_a_observar;

    const sombra = interpretation.sombra ||
                   interpretation.aspectos_sombra ||
                   interpretation.desafios_emocionales;

    return {
      patrones: Array.isArray(patrones) ? patrones : patrones ? [patrones] : undefined,
      sombra: typeof sombra === 'string' ? sombra : sombra?.descripcion
    };
  };

  // Helper: Obtener claves de integración del SR
  const getClavesIntegracion = (): string[] | undefined => {
    const interpretation = getSRInterpretation();
    return interpretation?.claves_integracion;
  };

  // Helper: Obtener línea de tiempo anual del SR
  const getLineaTiempoAnual = (): any[] | undefined => {
    const interpretation = getSRInterpretation();
    return interpretation?.linea_tiempo_anual;
  };

  // Helper: Obtener comparaciones planetarias del SR
  const getComparacionesPlanetarias = () => {
    const interpretation = getSRInterpretation();
    return interpretation?.comparaciones_planetarias;
  };

  // Helper: Obtener integración de ejes del SR
  const getIntegracionEjes = () => {
    const interpretation = getSRInterpretation();
    if (!interpretation?.ejes) return null;

    const ejes = interpretation.ejes;
    return {
      asc: ejes.ascendente?.interpretacion || ejes.asc?.interpretacion || ejes.ascendente || ejes.asc,
      mc: ejes.medio_cielo?.interpretacion || ejes.mc?.interpretacion || ejes.medio_cielo || ejes.mc,
      dsc: ejes.descendente?.interpretacion || ejes.dsc?.interpretacion || ejes.descendente || ejes.dsc,
      ic: ejes.fondo_cielo?.interpretacion || ejes.ic?.interpretacion || ejes.fondo_cielo || ejes.ic,
      frase_guia: interpretation.frase_guia || interpretation.mantra_anual || ejes.frase_guia
    };
  };

  // Helper: Obtener los SIGNOS de los ejes desde la carta del SR
  const getEjesSignos = () => {
    if (!solarReturnChart) return null;

    // Obtener signos directamente de ascendant/midheaven o de las casas
    const ascSign = solarReturnChart.ascendant?.sign || solarReturnChart.houses?.[0]?.sign;
    const mcSign = solarReturnChart.midheaven?.sign || solarReturnChart.houses?.[9]?.sign;
    const dscSign = solarReturnChart.houses?.[6]?.sign; // Casa 7 (índice 6)
    const icSign = solarReturnChart.houses?.[3]?.sign;  // Casa 4 (índice 3)

    // Obtener grados si están disponibles
    const ascDegree = solarReturnChart.ascendant?.degree || solarReturnChart.houses?.[0]?.degree;
    const mcDegree = solarReturnChart.midheaven?.degree || solarReturnChart.houses?.[9]?.degree;

    return {
      asc: ascSign ? { sign: ascSign, degree: ascDegree } : null,
      mc: mcSign ? { sign: mcSign, degree: mcDegree } : null,
      dsc: dscSign ? { sign: dscSign } : null,
      ic: icSign ? { sign: icSign } : null
    };
  };

  // Helper: Obtener datos mensuales personalizados (ejercicio, mantra, etc.)
  const getMonthlyThemeData = (monthIndex: number) => {
    const interpretation = getSRInterpretation();
    const zodiacSigns = [
      { name: 'Capricornio', symbol: '♑', element: 'tierra' },
      { name: 'Acuario', symbol: '♒', element: 'aire' },
      { name: 'Piscis', symbol: '♓', element: 'agua' },
      { name: 'Aries', symbol: '♈', element: 'fuego' },
      { name: 'Tauro', symbol: '♉', element: 'tierra' },
      { name: 'Géminis', symbol: '♊', element: 'aire' },
      { name: 'Cáncer', symbol: '♋', element: 'agua' },
      { name: 'Leo', symbol: '♌', element: 'fuego' },
      { name: 'Virgo', symbol: '♍', element: 'tierra' },
      { name: 'Libra', symbol: '♎', element: 'aire' },
      { name: 'Escorpio', symbol: '♏', element: 'agua' },
      { name: 'Sagitario', symbol: '♐', element: 'fuego' }
    ];

    const monthlyThemes = [
      { // Enero - Capricornio
        ejercicio: { titulo: 'Revisar automatismos', descripcion: 'Identifica una acción que haces por inercia y pregúntate: ¿esto me sigue sirviendo?' },
        mantra: 'Arranco desde mi verdad, no desde la prisa'
      },
      { // Febrero - Acuario
        ejercicio: { titulo: 'Conectar con tu visión única', descripcion: 'Escribe cómo sería tu vida ideal sin las expectativas de otros. ¿Qué deseas realmente?' },
        mantra: 'Mi singularidad es mi mayor fortaleza'
      },
      { // Marzo - Piscis
        ejercicio: { titulo: 'Soltar el control', descripcion: 'Practica confiar en el flujo de la vida. Medita 10 minutos observando sin juzgar.' },
        mantra: 'Me dejo llevar por la corriente de mi intuición'
      },
      { // Abril - Aries
        ejercicio: { titulo: 'Actuar sin pensar demasiado', descripcion: 'Elige algo que has estado postergando y hazlo hoy. La acción genera claridad.' },
        mantra: 'Me permito empezar aunque no esté listo'
      },
      { // Mayo - Tauro
        ejercicio: { titulo: 'Cultivar el placer consciente', descripcion: 'Dedica tiempo a disfrutar algo con todos tus sentidos. Come, pasea, o crea algo bello.' },
        mantra: 'Merezco disfrutar del camino, no solo del destino'
      },
      { // Junio - Géminis
        ejercicio: { titulo: 'Explorar nuevas perspectivas', descripcion: 'Lee algo fuera de tu zona habitual o conversa con alguien muy diferente a ti.' },
        mantra: 'Cada conversación me expande'
      },
      { // Julio - Cáncer
        ejercicio: { titulo: 'Nutrir tu hogar interior', descripcion: 'Crea un espacio seguro para tus emociones. Escribe una carta a tu yo niño/a.' },
        mantra: 'Mi vulnerabilidad es sagrada'
      },
      { // Agosto - Leo
        ejercicio: { titulo: 'Brillar sin disculpas', descripcion: 'Haz algo que te haga sentir orgulloso/a de ti. Celebra un logro, por pequeño que sea.' },
        mantra: 'Mi luz inspira a otros a brillar'
      },
      { // Septiembre - Virgo
        ejercicio: { titulo: 'Ordenar con amor', descripcion: 'Organiza un área de tu vida (física o emocional) que necesite atención.' },
        mantra: 'En los detalles encuentro mi maestría'
      },
      { // Octubre - Libra
        ejercicio: { titulo: 'Buscar el equilibrio', descripcion: 'Identifica dónde estás dando de más o de menos. ¿Qué necesita ajustarse?' },
        mantra: 'Mis relaciones me reflejan'
      },
      { // Noviembre - Escorpio
        ejercicio: { titulo: 'Transformar la sombra', descripcion: 'Escribe sobre algo que temes o evitas. La conciencia transforma.' },
        mantra: 'De mis profundidades nace mi poder'
      },
      { // Diciembre - Sagitario
        ejercicio: { titulo: 'Expandir horizontes', descripcion: 'Planifica algo que te emocione: un viaje, un curso, una aventura interior.' },
        mantra: 'Mi búsqueda de sentido me guía'
      }
    ];

    // Intentar obtener datos personalizados del SR si existen
    const lineaTiempo = interpretation?.linea_tiempo_emocional;
    let monthData = lineaTiempo?.find((m: any) => {
      const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                         'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return m.mes?.toLowerCase().includes(monthNames[monthIndex]);
    });

    const defaultTheme = monthlyThemes[monthIndex] || monthlyThemes[0];

    return {
      ejercicioCentral: defaultTheme.ejercicio,
      mantra: monthData?.palabra_clave
        ? `${defaultTheme.mantra} · ${monthData.palabra_clave}`
        : defaultTheme.mantra,
      intensidad: monthData?.intensidad || 5,
      palabraClave: monthData?.palabra_clave
    };
  };

  // Helper: Filtrar eventos lunares para LunasYEjercicios
  const getLunarEventsForMonth = (monthIndex: number) => {
    const eventos = getFormattedEventosForMonth(monthIndex);
    return eventos.filter(e => e.tipo === 'lunaNueva' || e.tipo === 'lunaLlena');
  };

  // Helper: Filtrar eventos de tránsitos (retrogradaciones e ingresos) para TransitosDelMes
  const getTransitEventsForMonth = (monthIndex: number) => {
    const eventos = getFormattedEventosForMonth(monthIndex);
    return eventos
      .filter(e => e.tipo === 'retrogrado' || e.tipo === 'ingreso' || e.tipo === 'especial')
      .map(e => ({
        dia: e.dia,
        tipo: e.tipo as 'retrogrado' | 'ingreso' | 'especial',
        titulo: e.titulo,
        signo: e.signo,
        interpretacion: e.interpretacion
      }));
  };

  // Helper: Obtener reflexión mensual sobre tránsitos desde SR
  const getMonthlyTransitReflection = (monthIndex: number): string | undefined => {
    const interpretation = getSRInterpretation();
    if (!interpretation?.linea_tiempo_emocional) return undefined;

    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const monthData = interpretation.linea_tiempo_emocional.find((m: any) =>
      m.mes?.toLowerCase().includes(monthNames[monthIndex])
    );

    if (monthData?.palabra_clave) {
      return `Este mes la palabra clave es "${monthData.palabra_clave}" con intensidad ${monthData.intensidad || 5}/10.`;
    }
    return undefined;
  };

  // Helper: Generar los 12 meses del ciclo empezando desde el cumpleaños
  const generateCalendarMonths = () => {
    const months = [];
    const birthdayMonth = startDate.getMonth(); // 0-11
    const birthdayYear = startDate.getFullYear();

    // Datos de los signos zodiacales por mes
    const zodiacData = [
      { nombre: 'Capricornio → Acuario', simbolo: '♑', tema: 'Estructura y visión' },
      { nombre: 'Acuario → Piscis', simbolo: '♒', tema: 'Innovación y conexión' },
      { nombre: 'Piscis → Aries', simbolo: '♓', tema: 'Cierre y renacimiento' },
      { nombre: 'Aries → Tauro', simbolo: '♈', tema: 'Acción y manifestación' },
      { nombre: 'Tauro → Géminis', simbolo: '♉', tema: 'Estabilidad y placer' },
      { nombre: 'Géminis → Cáncer', simbolo: '♊', tema: 'Comunicación y curiosidad' },
      { nombre: 'Cáncer → Leo', simbolo: '♋', tema: 'Nutrición emocional' },
      { nombre: 'Leo → Virgo', simbolo: '♌', tema: 'Expresión y creatividad' },
      { nombre: 'Virgo → Libra', simbolo: '♍', tema: 'Discernimiento y servicio' },
      { nombre: 'Libra → Escorpio', simbolo: '♎', tema: 'Equilibrio y relaciones' },
      { nombre: 'Escorpio → Sagitario', simbolo: '♏', tema: 'Transformación profunda' },
      { nombre: 'Sagitario → Capricornio', simbolo: '♐', tema: 'Expansión y sabiduría' }
    ];

    // 13 meses: desde el mes del cumpleaños hasta el mismo mes del año siguiente
    // El ciclo solar empieza y termina el día del cumpleaños
    for (let i = 0; i <= 12; i++) {
      const monthIndex = (birthdayMonth + i) % 12;
      const yearOffset = birthdayMonth + i >= 12 ? 1 : 0;
      const year = birthdayYear + yearOffset;
      const monthDate = new Date(year, monthIndex, 1);
      const isBirthdayMonth = i === 0; // Primer mes es el del cumpleaños
      const isClosingMonth = i === 12; // Último mes: cierre del ciclo

      months.push({
        monthDate,
        mesNumero: i + 1,
        monthIndex,
        isBirthdayMonth,
        isClosingMonth,
        ...zodiacData[monthIndex]
      });
    }

    return months;
  };

  const calendarMonths = generateCalendarMonths();

  // LOADING STATE: Cargando datos iniciales
  if (loading && !solarCycle) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-purple-400/50">
          <div className="text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 bg-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-purple-200 animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6" />
              Cargando tu Agenda
            </h3>

            <p className="text-purple-200">
              Preparando tu libro personalizado...
            </p>

            {/* Loading Bar */}
            <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GENERATING STATE: Generando interpretaciones faltantes
  if (generatingMissing) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-purple-400/50">
          <div className="text-center space-y-6">

            {/* Animated Icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 bg-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-purple-200 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6" />
              Generando tu Agenda Personalizada
            </h3>

            {/* Progress Message */}
            <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-400/30">
              <p className="text-purple-100 text-lg font-semibold animate-pulse">
                Creando interpretaciones con IA...
              </p>
              {progress > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-200 text-xs">Progreso</span>
                    <span className="text-purple-200 text-xs">{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Text */}
            <div className="space-y-3 text-purple-200 text-sm">
              <p className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 animate-bounce" />
                Esto puede tomar 1-2 minutos la primera vez
              </p>
              <p className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
                ¡Siguientes veces será instantáneo!
              </p>
              <p className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4 animate-bounce" style={{ animationDelay: '0.2s' }} />
                Generando contenido único para ti
              </p>
            </div>

            {/* Loading Bar */}
            <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full animate-loading-bar"></div>
            </div>

            <p className="text-purple-300 text-xs italic flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              "La paciencia cósmica será recompensada con sabiduría estelar"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE: Error cargando datos
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-pink-900/95 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="libro-container min-h-screen bg-gray-100">
      {/* Header de controles - NO se imprime */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b ${config.headerBg} ${config.headerText} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X className="w-4 h-4" />
            Cerrar
          </button>

          <div className="flex items-center gap-4">
            <StyleSwitcher />

            {/* Botón para regenerar SR si faltan campos */}
            {solarReturnInterpretation &&
             (!solarReturnInterpretation.interpretation?.linea_tiempo_emocional ||
              !solarReturnInterpretation.interpretation?.meses_clave_puntos_giro) && (
              <button
                onClick={handleRegenerateSolarReturn}
                disabled={generatingSolarReturn}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold hover:from-orange-400 hover:to-yellow-400 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="La interpretación actual no tiene todos los campos. Regenerar para obtener la versión completa."
              >
                <RefreshCw className={`w-4 h-4 ${generatingSolarReturn ? 'animate-spin' : ''}`} />
                {generatingSolarReturn ? 'Regenerando...' : 'Regenerar SR'}
              </button>
            )}

            <button
              onClick={handleExportTXT}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm"
              title="Descargar texto plano"
            >
              <FileDown className="w-4 h-4" />
              TXT
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:from-red-400 hover:to-orange-400 transition-all duration-200 shadow-lg"
              title="Guardar como PDF"
            >
              <Download className="w-4 h-4" />
              Guardar PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
              title="Imprimir directamente"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-2 opacity-90">
          Agenda de <span className="font-semibold">{userName}</span> · {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
        </p>

        {/* DEBUG: Mostrar siempre el estado de interpretaciones */}
        <div className="mt-2 text-center text-xs opacity-70 flex items-center justify-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span>{eventStats.conInterpretacion}/{eventStats.total} eventos con interpretación</span>
          {eventStats.sinInterpretacion > 0 && (
            <span className="text-amber-400 ml-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {eventStats.sinInterpretacion} pendientes
            </span>
          )}
        </div>

        {/* ✅ Banner de generación automática de interpretaciones */}
        {(eventStats.sinInterpretacion > 0 || generatingBatch) && (
          <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              {generatingBatch ? (
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-sm font-semibold">
                {generatingBatch
                  ? `Generando ${eventStats.sinInterpretacion} interpretaciones personalizadas...`
                  : `${eventStats.sinInterpretacion} eventos pendientes de personalizar`
                }
              </span>
            </div>

            <p className="text-xs text-amber-200/80 flex items-center gap-1">
              <Clock className="w-3 h-3 inline" />
              <span>
                {generatingBatch
                  ? 'Creando interpretaciones personalizadas con IA. La página se recargará automáticamente al terminar.'
                  : 'La generación automática se iniciará en un momento...'
                }
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Modal de instrucciones para PDF */}
      {showPdfInstructions && (
        <div className="no-print fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={() => setShowPdfInstructions(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-full">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Guardar como PDF</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <p className="text-gray-700 text-sm">Haz clic en "Continuar" para abrir el diálogo de impresión</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <div className="text-sm">
                  <p className="text-gray-700">En "Destino" o "Impresora", selecciona:</p>
                  <p className="font-semibold text-purple-700">"Guardar como PDF"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <div className="text-sm">
                  <p className="text-gray-700">Configura estas opciones:</p>
                  <ul className="text-gray-600 text-xs mt-1 space-y-1">
                    <li>• Tamaño: <span className="font-medium">A5</span></li>
                    <li>• Márgenes: <span className="font-medium">Ninguno</span></li>
                    <li>• Gráficos de fondo: <span className="font-medium">Activado</span></li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">4</span>
                <p className="text-gray-700 text-sm">Haz clic en "Guardar" y elige dónde guardar tu PDF</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-semibold text-sm">Consejo</span>
              </div>
              <p className="text-amber-700 text-xs">
                Para mejor calidad, usa Chrome o Edge. Safari puede tener limitaciones con los colores de fondo.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPdfInstructions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPDF}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-400 hover:to-orange-400 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido del libro - ✅ libro-container inicializa el contador de páginas CSS */}
      <div ref={printRef} className="libro-container container mx-auto py-8 space-y-0 print:p-0">

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 1: PORTADA + ÍNDICE (para impresión de libro)
            ═══════════════════════════════════════════════════════════════ */}
        <div id="portal-entrada">
          <div id="portada">
            <PortadaPersonalizada
              name={userName}
              startDate={startDate}
              endDate={endDate}
              sunSign={sunSign}
              moonSign={moonSign}
              ascendant={ascendant}
            />
          </div>
        </div>

        {/* Página en blanco (reverso de la portada para impresión a doble cara) */}
        <PaginaBlanca />

        {/* Índice va justo después de la portada */}
        <IndiceNavegable startDate={startDate} />

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 2: BIENVENIDA Y GUÍA
            ═══════════════════════════════════════════════════════════════ */}
        <div id="bienvenida">
          <CartaBienvenida name={userName} />
          <GuiaAgenda />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 3: CARTA NATAL (Soul Chart)
            ═══════════════════════════════════════════════════════════════ */}
        <div id="soul-chart">
          <div id="esencia-natal">
            <EsenciaNatal
              proposito_vida={getEsenciaNatal()?.proposito_vida}
              emociones={getEsenciaNatal()?.emociones}
              personalidad={getEsenciaNatal()?.personalidad}
              pensamiento={getEsenciaNatal()?.pensamiento}
              amor={getEsenciaNatal()?.amor}
              accion={getEsenciaNatal()?.accion}
            />
          </div>
          <div id="nodo-norte">
            <NodoNorte
              nodo_norte={getNodosLunares()?.nodo_norte}
            />
          </div>
          <div id="nodo-sur">
            <NodoSur
              nodo_sur={getNodosLunares()?.nodo_sur}
            />
          </div>
          <div id="planetas-dominantes">
            <PlanetasDominantes
              como_piensas={getPlanetasDominantes()?.como_piensas}
              proposito_vida={getPlanetasDominantes()?.proposito_vida}
              emociones={getPlanetasDominantes()?.emociones}
              como_amas={getPlanetasDominantes()?.como_amas}
              como_actuas={getPlanetasDominantes()?.como_actuas}
            />
          </div>
          <div id="patrones-emocionales">
            <PatronesEmocionales
              patrones={getPatronesEmocionales()?.patrones}
              sombra={getPatronesEmocionales()?.sombra}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 4: RETORNO SOLAR
            ═══════════════════════════════════════════════════════════════ */}
        <div id="retorno-solar">
          <div id="que-es-retorno">
            <QueEsRetornoSolar />
          </div>
          <div id="ascendente-anio">
            <AscendenteAnio />
          </div>
          <div id="sol-retorno">
            <SolRetorno comparacion={getComparacionesPlanetarias()?.sol} />
          </div>
          <div id="luna-retorno">
            <LunaRetorno comparacion={getComparacionesPlanetarias()?.luna} />
          </div>
          <div id="mercurio-retorno">
            <MercurioRetorno comparacion={getComparacionesPlanetarias()?.mercurio} />
          </div>
          <div id="venus-retorno">
            <VenusRetorno comparacion={getComparacionesPlanetarias()?.venus} />
          </div>
          <div id="marte-retorno">
            <MarteRetorno comparacion={getComparacionesPlanetarias()?.marte} />
          </div>
          <div id="ejes-anio">
            <EjesDelAnio
              ascSign={getEjesSignos()?.asc}
              mcSign={getEjesSignos()?.mc}
            />
            <EjesDelAnio2
              dscSign={getEjesSignos()?.dsc}
              icSign={getEjesSignos()?.ic}
            />
            <IntegracionEjes
              asc={getIntegracionEjes()?.asc}
              mc={getIntegracionEjes()?.mc}
              dsc={getIntegracionEjes()?.dsc}
              ic={getIntegracionEjes()?.ic}
              frase_guia={getIntegracionEjes()?.frase_guia}
            />
          </div>
          <MantraAnual />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 5: CICLOS Y OVERVIEW DEL AÑO
            ═══════════════════════════════════════════════════════════════ */}
        <div id="ciclos-anuales">
          <LineaTiempoEmocional
            startDate={startDate}
            endDate={endDate}
            lineaTiempoData={solarReturnInterpretation?.interpretation?.linea_tiempo_emocional}
          />
          <MesesClavePuntosGiro
            lineaTiempo={solarReturnInterpretation?.interpretation?.meses_clave_puntos_giro || getLineaTiempoAnual()}
          />
          <GrandesAprendizajes
            clavesIntegracion={getClavesIntegracion()}
          />
        </div>

        <div id="tu-anio-overview">
          <TuAnioOverview
            startDate={startDate}
            endDate={endDate}
            userName={userName}
            hasSolarReturn={!!getInterpretacionRetornoSolar()}
          />
          <TuAnioCiclos
            startDate={startDate}
            endDate={endDate}
            userName={userName}
            hasSolarReturn={!!getInterpretacionRetornoSolar()}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 6: INTENCIÓN DEL AÑO + RITUAL DE APERTURA
            Orden: 1) Predicción, 2) Escribir, 3) Antes de Empezar, 4) Ritual
            ═══════════════════════════════════════════════════════════════ */}

        {/* 1. INTENCIÓN DEL AÑO - Predicción con tema central */}
        <div id="intencion-anual">
          <PaginaIntencionAnualSR
            temaCentral={getInterpretacionRetornoSolar()}
            ejeDelAno={getSRInterpretation()?.apertura_anual?.eje_del_ano}
            userName={userName}
          />
        </div>

        {/* 2. MI INTENCIÓN - Espacio para escribir */}
        <div id="mi-intencion">
          <PaginaIntencionAnual />
        </div>

        {/* 3. ANTES DE EMPEZAR - Ritual de apertura personalizado */}
        <div id="primer-dia-ciclo">
          <PrimerDiaCiclo
            nombre={userName}
            fecha={startDate}
            temaCentral={getInterpretacionRetornoSolar()}
            mandato={getSRInterpretation()?.comparaciones_planetarias?.sol?.mandato_del_ano}
          />
        </div>

        {/* 4. RITUAL DE CUMPLEAÑOS */}
        <div id="ritual-cumpleanos">
          <RitualCumpleanos />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN 7: CALENDARIO MENSUAL DINÁMICO
            Empieza desde el mes del cumpleaños
            ═══════════════════════════════════════════════════════════════ */}
        <div id="calendario-mensual">
          {calendarMonths.map((month, index) => (
            <div key={`mes-${index}`} id={`mes-${month.mesNumero}`}>
              {/* Página especial de cumpleaños solo en el primer mes */}
              {month.isBirthdayMonth && (
                <PaginaCumpleanos
                  birthDate={startDate}
                  userName={userName}
                />
              )}

              <CalendarioMensualTabla
                monthDate={month.monthDate}
                mesNumero={month.mesNumero}
                nombreZodiaco={month.nombre}
                simboloZodiaco={month.simbolo}
                temaDelMes={month.tema}
                birthday={month.isBirthdayMonth ? startDate : undefined}
                eventos={getFormattedEventosForMonth(month.monthIndex)}
              />
              <LunasYEjercicios
                monthDate={month.monthDate}
                eventos={getLunarEventsForMonth(month.monthIndex)}
                ejercicioCentral={getMonthlyThemeData(month.monthIndex).ejercicioCentral}
                mantra={getMonthlyThemeData(month.monthIndex).mantra}
              />
              <TransitosDelMes
                monthDate={month.monthDate}
                transitos={getTransitEventsForMonth(month.monthIndex)}
                reflexionMensual={getMonthlyTransitReflection(month.monthIndex)}
              />
              <CierreMes monthDate={month.monthDate} />
              {/* Terapia creativa integrada en meses especificos */}
              {month.mesNumero === 3 && <EscrituraTerapeutica />}
              {month.mesNumero === 6 && <Visualizacion />}
              {month.mesNumero === 9 && <RitualSimbolico />}
              {month.mesNumero === 12 && <TrabajoEmocional />}
            </div>
          ))}
        </div>

        {/* CIERRE DEL CICLO */}
        <div id="cierre-ciclo">
          <QuienEraQuienSoy />
          <PreparacionProximaVuelta
            clavesIntegracion={getClavesIntegracion()}
            temaCentral={getInterpretacionRetornoSolar()}
          />
          <CartaCierre name={userName} />
          <PaginaFinalBlanca />
        </div>

        {/* CONTRAPORTADA */}
        <Contraportada />

      </div>
    </div>
  );
};
