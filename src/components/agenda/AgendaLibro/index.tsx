'use client';

import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X, FileDown } from 'lucide-react';
import { useInterpretaciones } from '@/hooks/useInterpretaciones';
import { formatEventForBook, formatInterpretationCompact } from '@/utils/formatInterpretationForBook';

// Secciones del libro
import { PortadaPersonalizada, PaginaIntencion, PaginaIntencionAnualSR } from './PortalEntrada';
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from './TuAnioTuViaje';
import { TuAnioOverview, TuAnioCiclos, PaginaCumpleanos } from './TuAnio';
import { LineaTiempoEmocional, MesesClavePuntosGiro, GrandesAprendizajes } from './CiclosAnuales';
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from './SoulChart';
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, MercurioRetorno, VenusRetorno, MarteRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from './RetornoSolar';
import { IndiceNavegable } from './Indice';
import { CalendarioYMapaMes, LunasYEjercicios, SemanaConInterpretacion, CierreMes, PrimerDiaCiclo as PrimerDiaCicloMes } from './MesCompleto';
import { CalendarioMensualTabla } from './CalendarioMensualTabla';
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from './TerapiaCreativa';
import { PrimerDiaCiclo, UltimoDiaCiclo, QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada } from './PaginasEspeciales';
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
    getEventosForMonth
  } = useInterpretaciones({ userId, yearLabel });

  // Estado para almacenar la interpretación del Retorno Solar
  const [solarReturnInterpretation, setSolarReturnInterpretation] = useState<any>(null);
  const [loadingSolarReturn, setLoadingSolarReturn] = useState(true);
  const [generatingSolarReturn, setGeneratingSolarReturn] = useState(false);

  // Estado para almacenar la interpretación Natal
  const [natalInterpretation, setNatalInterpretation] = useState<any>(null);
  const [loadingNatal, setLoadingNatal] = useState(true);

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
          setSolarReturnInterpretation(data);
        } else {
          console.log('⚠️ [SOLAR_RETURN] No se encontró interpretación de Retorno Solar');
          setSolarReturnInterpretation(null);
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
      const { birthData } = await birthDataResponse.json();

      // 2. Obtener carta natal
      console.log('🌟 [AUTO_GEN] Obteniendo carta natal...');
      const natalResponse = await fetch(`/api/charts/natal?userId=${userId}`);
      if (!natalResponse.ok) {
        throw new Error('No se encontró la carta natal');
      }
      const natalData = await natalResponse.json();
      const natalChart = natalData.chart || natalData.data?.chart;

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
      const solarReturnChart = srChartData.chart || srChartData.data?.chart;

      // 4. Obtener perfil de usuario
      console.log('👤 [AUTO_GEN] Obteniendo perfil de usuario...');
      const profileResponse = await fetch(`/api/users/${userId}`);
      let userProfile = null;
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userProfile = profileData.user;
      }

      // 5. Generar interpretación del Solar Return
      console.log('🤖 [AUTO_GEN] Generando interpretación con IA...');
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

  const handlePrint = () => {
    // Forzar el layout antes de imprimir
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExportTXT = () => {
    // Construir contenido del libro en formato texto plano
    let txtContent = '';

    // ═══════════════════════════════════════════════════════════
    // PORTADA
    // ═══════════════════════════════════════════════════════════
    txtContent += '═══════════════════════════════════════════════════════════\n';
    txtContent += '           TU VUELTA AL SOL - AGENDA ASTROLÓGICA\n';
    txtContent += '═══════════════════════════════════════════════════════════\n\n';
    txtContent += `Agenda de: ${userName}\n`;
    txtContent += `Período: ${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })} - ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: es })}\n`;
    if (sunSign) txtContent += `Sol en: ${sunSign}\n`;
    if (moonSign) txtContent += `Luna en: ${moonSign}\n`;
    if (ascendant) txtContent += `Ascendente: ${ascendant}\n`;
    txtContent += '\n\n';

    // ═══════════════════════════════════════════════════════════
    // SOLAR RETURN - INTERPRETACIÓN COMPLETA
    // ═══════════════════════════════════════════════════════════
    const srData = getSRInterpretation();
    if (srData) {
      txtContent += '═══════════════════════════════════════════════════════════\n';
      txtContent += '                 TU RETORNO SOLAR DEL AÑO\n';
      txtContent += '═══════════════════════════════════════════════════════════\n\n';

      // Apertura anual
      if (srData.apertura_anual) {
        if (srData.apertura_anual.tema_central) {
          txtContent += '━━━ TEMA CENTRAL DEL AÑO ━━━\n';
          txtContent += srData.apertura_anual.tema_central + '\n\n';
        }

        if (srData.apertura_anual.eje_del_ano) {
          txtContent += '━━━ EJE DEL AÑO ━━━\n';
          txtContent += srData.apertura_anual.eje_del_ano + '\n\n';
        }

        if (srData.apertura_anual.como_se_siente) {
          txtContent += '━━━ CÓMO SE SIENTE ━━━\n';
          txtContent += srData.apertura_anual.como_se_siente + '\n\n';
        }

        if (srData.apertura_anual.conexion_natal) {
          txtContent += '━━━ CONEXIÓN CON TU CARTA NATAL ━━━\n';
          txtContent += srData.apertura_anual.conexion_natal + '\n\n';
        }
      }

      // Cómo se vive siendo tú
      if (srData.como_se_vive_siendo_tu) {
        txtContent += '\n━━━ CÓMO SE VIVE SIENDO TÚ ESTE AÑO ━━━\n\n';

        if (srData.como_se_vive_siendo_tu.facilidad) {
          txtContent += `▸ LO QUE FLUYE:\n  ${srData.como_se_vive_siendo_tu.facilidad}\n\n`;
        }
        if (srData.como_se_vive_siendo_tu.incomodidad) {
          txtContent += `▸ LO QUE INCOMODA:\n  ${srData.como_se_vive_siendo_tu.incomodidad}\n\n`;
        }
        if (srData.como_se_vive_siendo_tu.medida_del_ano) {
          txtContent += `▸ LA MEDIDA DEL AÑO:\n  ${srData.como_se_vive_siendo_tu.medida_del_ano}\n\n`;
        }
        if (srData.como_se_vive_siendo_tu.actitud_nueva) {
          txtContent += `▸ ACTITUD NUEVA:\n  ${srData.como_se_vive_siendo_tu.actitud_nueva}\n\n`;
        }
      }

      // Comparaciones planetarias Natal vs SR (es OBJETO, no array)
      if (srData.comparaciones_planetarias) {
        txtContent += '\n━━━ COMPARACIONES NATAL vs SOLAR RETURN ━━━\n\n';

        const planetas = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno'];
        planetas.forEach((planeta) => {
          const comp = srData.comparaciones_planetarias[planeta];
          if (comp) {
            txtContent += `▸ ${planeta.toUpperCase()}\n`;
            if (comp.natal?.descripcion) {
              txtContent += `  Natal: ${comp.natal.descripcion}\n`;
            }
            if (comp.solar_return?.descripcion) {
              txtContent += `  Solar Return: ${comp.solar_return.descripcion}\n`;
            }
            if (comp.choque) {
              txtContent += `  Choque/Tensión: ${comp.choque}\n`;
            }
            if (comp.que_hacer) {
              txtContent += `  Qué hacer: ${comp.que_hacer}\n`;
            }
            if (comp.mandato_del_ano) {
              txtContent += `  Mandato del año: ${comp.mandato_del_ano}\n`;
            }
            txtContent += '\n';
          }
        });
      }

      // Línea de tiempo anual (es OBJETO con períodos, no array)
      if (srData.linea_tiempo_anual) {
        txtContent += '\n━━━ LÍNEA DE TIEMPO DEL AÑO ━━━\n\n';

        const periodos = ['mes_1_2', 'mes_3_4', 'mes_6_7', 'mes_9_10', 'mes_12'];
        periodos.forEach((periodo) => {
          const evento = srData.linea_tiempo_anual[periodo];
          if (evento) {
            txtContent += `▸ ${evento.titulo || periodo.toUpperCase().replace(/_/g, ' ')}\n`;
            if (evento.descripcion) {
              txtContent += `  ${evento.descripcion}\n`;
            }
            if (evento.accion_clave) {
              txtContent += `  Acción clave: ${evento.accion_clave}\n`;
            }
            txtContent += '\n';
          }
        });
      }

      // Sombras del año
      if (srData.sombras_del_ano && srData.sombras_del_ano.length > 0) {
        txtContent += '\n━━━ SOMBRAS Y DESAFÍOS DEL AÑO ━━━\n\n';
        srData.sombras_del_ano.forEach((sombra: string, idx: number) => {
          txtContent += `${idx + 1}. ${sombra}\n`;
        });
        txtContent += '\n';
      }

      // Claves de integración
      if (srData.claves_integracion && srData.claves_integracion.length > 0) {
        txtContent += '\n━━━ CLAVES DE INTEGRACIÓN ━━━\n\n';
        srData.claves_integracion.forEach((clave: string, idx: number) => {
          txtContent += `${idx + 1}. ${clave}\n`;
        });
        txtContent += '\n';
      }

      // Uso del calendario lunar
      if (srData.uso_calendario_lunar) {
        txtContent += '\n━━━ USO DEL CALENDARIO LUNAR ━━━\n\n';

        if (srData.uso_calendario_lunar.marco_general) {
          txtContent += `${srData.uso_calendario_lunar.marco_general}\n\n`;
        }

        if (srData.uso_calendario_lunar.lunas_clave && srData.uso_calendario_lunar.lunas_clave.length > 0) {
          txtContent += '▸ LUNAS CLAVE DEL AÑO:\n\n';
          srData.uso_calendario_lunar.lunas_clave.forEach((luna: any) => {
            txtContent += `  • ${luna.fase || ''} en ${luna.signo || ''}\n`;
            if (luna.fecha_aproximada) {
              txtContent += `    Fecha aprox: ${luna.fecha_aproximada}\n`;
            }
            if (luna.por_que_es_clave) {
              txtContent += `    Por qué es clave: ${luna.por_que_es_clave}\n`;
            }
            txtContent += '\n';
          });
        }
      }

      // Síntesis final
      if (srData.sintesis_final) {
        txtContent += '\n━━━ SÍNTESIS FINAL ━━━\n\n';

        if (srData.sintesis_final.frase_cierre_potente) {
          txtContent += `"${srData.sintesis_final.frase_cierre_potente}"\n\n`;
        }
        if (srData.sintesis_final.pregunta_final) {
          txtContent += `Pregunta para reflexionar: ${srData.sintesis_final.pregunta_final}\n\n`;
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CARTA NATAL - ESENCIA
    // ═══════════════════════════════════════════════════════════
    const natalData = natalInterpretation?.interpretation;
    if (natalData) {
      txtContent += '\n═══════════════════════════════════════════════════════════\n';
      txtContent += '                  CARTA NATAL - TU ESENCIA\n';
      txtContent += '═══════════════════════════════════════════════════════════\n\n';

      // ✅ ESTRUCTURA ACTUALIZADA - interpret-natal-clean
      if (natalData.esencia_revolucionaria) {
        txtContent += '━━━ TU ESENCIA REVOLUCIONARIA ━━━\n';
        txtContent += natalData.esencia_revolucionaria + '\n\n';
      }

      if (natalData.proposito_vida) {
        txtContent += '━━━ TU PROPÓSITO DE VIDA ━━━\n';
        txtContent += natalData.proposito_vida + '\n\n';
      }

      // Declaración de poder
      if (natalData.declaracion_poder) {
        txtContent += '━━━ TU DECLARACIÓN DE PODER ━━━\n';
        txtContent += `"${natalData.declaracion_poder}"\n\n`;
      }

      // Nodos Lunares
      if (natalData.nodos_lunares) {
        txtContent += '━━━ TU GPS EVOLUTIVO: NODOS LUNARES ━━━\n\n';

        if (natalData.nodos_lunares.nodo_sur) {
          const ns = natalData.nodos_lunares.nodo_sur;
          txtContent += `▸ NODO SUR (${ns.signo_casa || 'Tu pasado'})\n`;
          if (ns.zona_comfort) txtContent += `  Zona de confort: ${ns.zona_comfort}\n`;
          if (ns.patron_repetitivo) txtContent += `  Patrón repetitivo: ${ns.patron_repetitivo}\n`;
          txtContent += '\n';
        }

        if (natalData.nodos_lunares.nodo_norte) {
          const nn = natalData.nodos_lunares.nodo_norte;
          txtContent += `▸ NODO NORTE (${nn.signo_casa || 'Tu futuro'})\n`;
          if (nn.direccion_evolutiva) txtContent += `  Dirección evolutiva: ${nn.direccion_evolutiva}\n`;
          if (nn.desafio) txtContent += `  Desafío: ${nn.desafio}\n`;
          txtContent += '\n';
        }

        if (natalData.nodos_lunares.eje_completo) {
          txtContent += `${natalData.nodos_lunares.eje_completo}\n\n`;
        }
      }

      // Patrones psicológicos
      if (natalData.patrones_psicologicos && natalData.patrones_psicologicos.length > 0) {
        txtContent += '━━━ TUS PATRONES PSICOLÓGICOS ━━━\n\n';
        natalData.patrones_psicologicos.forEach((patron: any, idx: number) => {
          txtContent += `${idx + 1}. ${patron.nombre_patron || 'Patrón'}\n`;
          if (patron.planeta_origen) txtContent += `   Origen: ${patron.planeta_origen}\n`;

          if (patron.como_se_manifiesta && patron.como_se_manifiesta.length > 0) {
            txtContent += `   Manifestación:\n`;
            patron.como_se_manifiesta.forEach((manifestacion: string) => {
              txtContent += `   • ${manifestacion}\n`;
            });
          }

          if (patron.superpoder_integrado) {
            txtContent += `   Superpoder: ${patron.superpoder_integrado}\n`;
          }

          txtContent += '\n';
        });
      }

      // Ángulos vitales
      if (natalData.angulos_vitales) {
        txtContent += '━━━ TUS ÁNGULOS VITALES ━━━\n\n';

        if (natalData.angulos_vitales.ascendente) {
          const asc = natalData.angulos_vitales.ascendente;
          txtContent += `▸ ASCENDENTE\n`;
          if (asc.mascara_social) txtContent += `  ${asc.mascara_social}\n`;
          if (asc.superpoder) txtContent += `  Superpoder: ${asc.superpoder}\n`;
          txtContent += '\n';
        }

        if (natalData.angulos_vitales.medio_cielo) {
          const mc = natalData.angulos_vitales.medio_cielo;
          txtContent += `▸ MEDIO CIELO\n`;
          if (mc.vocacion_soul) txtContent += `  ${mc.vocacion_soul}\n`;
          if (mc.legado) txtContent += `  Legado: ${mc.legado}\n`;
          txtContent += '\n';
        }
      }

      // Insights transformacionales
      if (natalData.insights_transformacionales && natalData.insights_transformacionales.length > 0) {
        txtContent += '━━━ INSIGHTS TRANSFORMACIONALES ━━━\n';
        natalData.insights_transformacionales.forEach((insight: string) => {
          txtContent += `${insight}\n`;
        });
        txtContent += '\n';
      }

      // Advertencias
      if (natalData.advertencias && natalData.advertencias.length > 0) {
        txtContent += '━━━ ADVERTENCIAS IMPORTANTES ━━━\n';
        natalData.advertencias.forEach((advertencia: string) => {
          txtContent += `${advertencia}\n`;
        });
        txtContent += '\n';
      }

      // Plan de acción
      if (natalData.plan_accion) {
        txtContent += '━━━ TU PLAN DE ACCIÓN ━━━\n\n';

        if (natalData.plan_accion.hoy_mismo && natalData.plan_accion.hoy_mismo.length > 0) {
          txtContent += `HOY MISMO:\n`;
          natalData.plan_accion.hoy_mismo.forEach((accion: string) => {
            txtContent += `• ${accion}\n`;
          });
          txtContent += '\n';
        }

        if (natalData.plan_accion.esta_semana && natalData.plan_accion.esta_semana.length > 0) {
          txtContent += `ESTA SEMANA:\n`;
          natalData.plan_accion.esta_semana.forEach((accion: string) => {
            txtContent += `• ${accion}\n`;
          });
          txtContent += '\n';
        }

        if (natalData.plan_accion.este_mes && natalData.plan_accion.este_mes.length > 0) {
          txtContent += `ESTE MES:\n`;
          natalData.plan_accion.este_mes.forEach((accion: string) => {
            txtContent += `• ${accion}\n`;
          });
          txtContent += '\n';
        }
      }

      // Pregunta final de reflexión
      if (natalData.pregunta_final_reflexion) {
        txtContent += '━━━ PREGUNTA PARA REFLEXIONAR ━━━\n';
        txtContent += `${natalData.pregunta_final_reflexion}\n\n`;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // MESES DEL AÑO CON EVENTOS
    // ═══════════════════════════════════════════════════════════
    if (solarCycle && solarCycle.events && solarCycle.events.length > 0) {
      txtContent += '\n═══════════════════════════════════════════════════════════\n';
      txtContent += '                CALENDARIO DE TU AÑO SOLAR\n';
      txtContent += '═══════════════════════════════════════════════════════════\n\n';

      // Helper para traducir tipos de eventos
      const translateEventType = (type: string): string => {
        const translations: { [key: string]: string } = {
          'new_moon': 'Luna Nueva',
          'full_moon': 'Luna Llena',
          'planetary_transit': 'Tránsito planetario',
          'retrograde': 'Retrogradación',
          'eclipse': 'Eclipse',
          'solar_eclipse': 'Eclipse Solar',
          'lunar_eclipse': 'Eclipse Lunar'
        };
        return translations[type] || type;
      };

      // Agrupar eventos por mes y deduplicar
      const monthsMap = new Map<number, any[]>();
      const seenEvents = new Set<string>(); // Para deduplicar
      const seenDates = new Map<string, Set<string>>(); // Para detectar fases lunares en mismo día

      solarCycle.events.forEach((event: any) => {
        const eventDate = new Date(event.date);
        const monthKey = eventDate.getMonth();
        const dateKey = format(eventDate, 'yyyy-MM-dd');

        // ✅ FIX: Crear clave única para deduplicar (fecha + tipo + signo desde metadata)
        const sign = event.metadata?.zodiacSign || event.metadata?.sign || event.metadata?.toSign || event.sign || '';
        const eventKey = `${dateKey}-${event.type}-${sign}`;

        // Validación astronómica: Luna Nueva y Luna Llena no pueden estar el mismo día
        if (event.type === 'new_moon' || event.type === 'full_moon') {
          if (!seenDates.has(dateKey)) {
            seenDates.set(dateKey, new Set());
          }
          const phasesOnThisDate = seenDates.get(dateKey)!;

          // Si ya hay una fase lunar este día, saltarla (imposible tener 2 fases el mismo día)
          if (phasesOnThisDate.has('lunar_phase')) {
            console.warn(`⚠️ Ignorando ${event.type} duplicada en ${dateKey} (ya hay fase lunar ese día)`);
            return; // Skip this event
          }
          phasesOnThisDate.add('lunar_phase');
        }

        // Solo agregar si no lo hemos visto antes
        if (!seenEvents.has(eventKey)) {
          seenEvents.add(eventKey);

          if (!monthsMap.has(monthKey)) {
            monthsMap.set(monthKey, []);
          }
          monthsMap.get(monthKey)?.push(event);
        }
      });

      // Generar 12 meses desde startDate
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        const monthName = format(monthDate, 'MMMM yyyy', { locale: es });
        const monthKey = monthDate.getMonth();

        txtContent += `\n━━━ ${monthName.toUpperCase()} ━━━\n\n`;

        const monthEvents = monthsMap.get(monthKey) || [];
        if (monthEvents.length > 0) {
          monthEvents.forEach((event: any) => {
            const eventDate = format(new Date(event.date), "d 'de' MMMM", { locale: es });
            const eventType = translateEventType(event.type || event.eventType || '');

            txtContent += `▸ ${eventDate} - ${eventType}`;

            // ✅ FIX: Leer sign y planet desde metadata
            const sign = event.metadata?.zodiacSign || event.metadata?.sign || event.metadata?.toSign || event.sign;
            const planet = event.metadata?.planet || event.planet;

            if (sign) txtContent += ` en ${sign}`;
            if (planet) txtContent += ` (${planet})`;
            txtContent += '\n';

            // NO imprimir event.description porque ya está incluido en el tipo + signo
            // (evita duplicación: "Luna Nueva" + "Luna Nueva en Piscis")

            // Agregar interpretación del evento si existe
            const interpretation = solarCycle.interpretations?.[event.eventId];
            if (interpretation) {
              if (interpretation.significado_personal) {
                txtContent += `  💫 ${interpretation.significado_personal}\n`;
              } else if (typeof interpretation === 'string') {
                txtContent += `  💫 ${interpretation}\n`;
              }
            }
            txtContent += '\n';
          });
        } else {
          txtContent += 'No hay eventos destacados este mes.\n';
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // MENSAJE FINAL
    // ═══════════════════════════════════════════════════════════
    txtContent += '\n\n═══════════════════════════════════════════════════════════\n';
    txtContent += '        Este es tu año. Confía en el proceso.\n';
    txtContent += '═══════════════════════════════════════════════════════════\n';

    // Crear y descargar archivo
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
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
    return eventos.map(formatEventForBook);
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
  const getEsenciaNatal = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation) return null;

    return {
      proposito_vida: interpretation.proposito_vida,
      emociones: interpretation.emociones,
      personalidad: interpretation.personalidad,
      pensamiento: interpretation.como_piensas_y_hablas,
      amor: interpretation.como_amas,
      accion: interpretation.como_enfrentas_la_vida
    };
  };

  // Helper: Obtener nodos lunares
  const getNodosLunares = () => {
    const interpretation = getNatalInterpretation();
    if (!interpretation?.nodos_lunares) return null;

    return {
      nodo_sur: interpretation.nodos_lunares.nodo_sur,
      nodo_norte: interpretation.nodos_lunares.nodo_norte
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

  // LOADING STATE: Cargando datos iniciales
  if (loading && !solarCycle) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-pink-900/95 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando tu agenda...</h2>
            <p className="text-gray-600">Preparando tu libro personalizado</p>
          </div>
        </div>
      </div>
    );
  }

  // GENERATING STATE: Generando interpretaciones faltantes
  if (generatingMissing) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-pink-900/95 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Generando interpretaciones personalizadas
              </h2>
              <p className="text-gray-600 mb-4">
                Esto puede tomar 1-2 minutos la primera vez.<br />
                ¡Siguientes veces será instantáneo!
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}%</p>
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
            <div className="text-6xl mb-4">⚠️</div>
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
            <button
              onClick={handleExportTXT}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all duration-200 shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              Exportar TXT
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Imprimir Libro
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-2 opacity-90">
          Agenda de <span className="font-semibold">{userName}</span> · {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Contenido del libro */}
      <div ref={printRef} className="container mx-auto py-8 space-y-0 print:p-0">

        {/* 1. PORTAL DE ENTRADA */}
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
          <div id="intencion-anio">
            <PaginaIntencion />
          </div>
        </div>
        <IndiceNavegable />

        {/* 2. CARTA DE BIENVENIDA Y TEMA CENTRAL - DESPUÉS DEL ÍNDICE */}
        <div id="tu-anio-tu-viaje">
          <div id="carta-bienvenida">
            <CartaBienvenida name={userName} />
          </div>
          <div id="tema-central">
            <TemaCentralAnio
              interpretacion={getInterpretacionRetornoSolar()}
              srInterpretation={getSRInterpretation()}
              onGenerateSolarReturn={handleGenerateSolarReturn}
              isGenerating={generatingSolarReturn}
            />
          </div>
          {/* INTENCIÓN DEL AÑO - Justo después del tema central */}
          <div id="intencion-anual-sr">
            <PaginaIntencionAnualSR
              temaCentral={getInterpretacionRetornoSolar()}
              ejeDelAno={getSRInterpretation()?.apertura_anual?.eje_del_ano}
              userName={userName}
            />
          </div>
        </div>

        {/* 3. PRIMER DÍA DEL CICLO */}
        <div id="primer-dia-ciclo">
          <PrimerDiaCiclo
            name={userName}
            fecha={startDate}
            temaCentral={getInterpretacionRetornoSolar()}
            mandato={getSRInterpretation()?.comparaciones_planetarias?.sol?.mandato_del_ano}
          />
        </div>

        {/* 4. LO QUE VIENE A MOVER Y SOLTAR */}
        <div id="viaje-interno">
          <div id="viene-mover">
            <LoQueVieneAMover
              facilidad={getComoSeViveSiendoTu()?.facilidad}
              incomodidad={getComoSeViveSiendoTu()?.incomodidad}
              medida_del_ano={getComoSeViveSiendoTu()?.medida_del_ano}
              actitud_nueva={getComoSeViveSiendoTu()?.actitud_nueva}
            />
          </div>
          <div id="pide-soltar">
            <LoQuePideSoltar
              reflejos_obsoletos={getComoSeViveSiendoTu()?.reflejos_obsoletos}
              sombras={getSombrasDelAno()}
            />
          </div>
        </div>

        {/* 5. TU AÑO 2026-2027 - OVERVIEW */}
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

        {/* 6. CICLOS ANUALES */}
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

        {/* 7. SOUL CHART */}
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
            <PlanetasDominantes />
          </div>
          <div id="patrones-emocionales">
            <PatronesEmocionales />
          </div>
        </div>

        {/* 4. RETORNO SOLAR */}
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
            <EjesDelAnio />
            <EjesDelAnio2 />
            <IntegracionEjes />
          </div>
          <div id="ritual-cumpleanos">
            <RitualCumpleanos />
          </div>
          <MantraAnual />
        </div>

        {/* 5. CALENDARIO MENSUAL (formato tabla profesional) */}
        <div id="calendario-mensual">
          <div id="mes-enero">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 0, 1)}
              mesNumero={1}
              nombreZodiaco="Capicornio → Acuario"
              simboloZodiaco="♑"
              temaDelMes="Inicios conscientes"
              eventos={getFormattedEventosForMonth(0)}
            />

        <LunasYEjercicios
          monthDate={new Date(2026, 0, 1)}
          eventos={[
            {
              dia: 13,
              tipo: 'lunaLlena',
              titulo: 'Luna Llena en Cáncer',
              interpretacion: 'Culminación emocional. Momento para soltar lo que ya no te pertenece en el ámbito familiar y emocional.'
            },
            {
              dia: 29,
              tipo: 'lunaNueva',
              titulo: 'Luna Nueva en Acuario',
              interpretacion: 'Siembra intenciones sobre libertad, comunidad e innovación. Tiempo de conectar con tu visión única.'
            }
          ]}
          ejercicioCentral={{
            titulo: 'Revisar automatismos',
            descripcion: 'Durante este mes, identifica una acción que haces por inercia y pregúntate: ¿esto me sigue sirviendo?'
          }}
          mantra="Arranco desde mi verdad, no desde la prisa"
        />
        <SemanaConInterpretacion
          weekStart={new Date(2026, 0, 5)}
          weekNumber={1}
          mesNombre="Enero 2026"
          tematica="Pausa y revisión"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' }
          ]}
          interpretacionSemanal="Esta primera semana del año es para bajar el ritmo y revisar qué quieres cultivar realmente. No hay prisa."
          ejercicioSemana="Escribe 3 cosas que NO quieres repetir este año."
        />
            <CierreMes monthDate={new Date(2026, 0, 1)} />
          </div>

          {/* FEBRERO 2026 - MES DE CUMPLEAÑOS (EJEMPLO) */}
          <div id="mes-febrero">
            {/* PÁGINA ESPECIAL DE CUMPLEAÑOS */}
            <PaginaCumpleanos
              birthDate={new Date(2026, 1, 10)} // 10 de febrero
              userName={userName}
            />

            <CalendarioMensualTabla
              monthDate={new Date(2026, 1, 1)}
              mesNumero={2}
              nombreZodiaco="Acuario → Piscis"
              simboloZodiaco="♒"
              temaDelMes="Renacimiento solar"
              birthday={new Date(2026, 1, 10)} // Marca el día 10 como cumpleaños
              eventos={getFormattedEventosForMonth(1)}
            />

            <CierreMes monthDate={new Date(2026, 1, 1)} />
          </div>

          {/* MARZO 2026 */}
          <div id="mes-marzo">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 2, 1)}
              mesNumero={3}
              nombreZodiaco="Piscis → Aries"
              simboloZodiaco="♓"
              temaDelMes="Culminación y renacimiento"
              eventos={getFormattedEventosForMonth(2)}
            />
            <CierreMes monthDate={new Date(2026, 2, 1)} />
          </div>

          {/* ABRIL 2026 */}
          <div id="mes-abril">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 3, 1)}
              mesNumero={4}
              nombreZodiaco="Aries → Tauro"
              simboloZodiaco="♈"
              temaDelMes="Acción y manifestación"
              eventos={getFormattedEventosForMonth(3)}
            />
            <CierreMes monthDate={new Date(2026, 3, 1)} />
          </div>

          {/* MAYO 2026 */}
          <div id="mes-mayo">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 4, 1)}
              mesNumero={5}
              nombreZodiaco="Tauro → Géminis"
              simboloZodiaco="♉"
              temaDelMes="Estabilidad y placer"
              eventos={getFormattedEventosForMonth(4)}
            />
            <CierreMes monthDate={new Date(2026, 4, 1)} />
          </div>

          {/* JUNIO 2026 */}
          <div id="mes-junio">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 5, 1)}
              mesNumero={6}
              nombreZodiaco="Géminis → Cáncer"
              simboloZodiaco="♊"
              temaDelMes="Comunicación y versatilidad"
              eventos={getFormattedEventosForMonth(5)}
            />
            <CierreMes monthDate={new Date(2026, 5, 1)} />
          </div>

          {/* JULIO 2026 */}
          <div id="mes-julio">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 6, 1)}
              mesNumero={7}
              nombreZodiaco="Cáncer → Leo"
              simboloZodiaco="♋"
              temaDelMes="Nutrición emocional"
              eventos={getFormattedEventosForMonth(6)}
            />
            <CierreMes monthDate={new Date(2026, 6, 1)} />
          </div>

          {/* AGOSTO 2026 */}
          <div id="mes-agosto">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 7, 1)}
              mesNumero={8}
              nombreZodiaco="Leo → Virgo"
              simboloZodiaco="♌"
              temaDelMes="Expresión y creatividad"
              eventos={getFormattedEventosForMonth(7)}
            />
            <CierreMes monthDate={new Date(2026, 7, 1)} />
          </div>

          {/* SEPTIEMBRE 2026 */}
          <div id="mes-septiembre">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 8, 1)}
              mesNumero={9}
              nombreZodiaco="Virgo → Libra"
              simboloZodiaco="♍"
              temaDelMes="Discernimiento y servicio"
              eventos={getFormattedEventosForMonth(8)}
            />
            <CierreMes monthDate={new Date(2026, 8, 1)} />
          </div>

          {/* OCTUBRE 2026 */}
          <div id="mes-octubre">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 9, 1)}
              mesNumero={10}
              nombreZodiaco="Libra → Escorpio"
              simboloZodiaco="♎"
              temaDelMes="Equilibrio y relaciones"
              eventos={getFormattedEventosForMonth(9)}
            />
            <CierreMes monthDate={new Date(2026, 9, 1)} />
          </div>

          {/* NOVIEMBRE 2026 */}
          <div id="mes-noviembre">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 10, 1)}
              mesNumero={11}
              nombreZodiaco="Escorpio → Sagitario"
              simboloZodiaco="♏"
              temaDelMes="Transformación profunda"
              eventos={getFormattedEventosForMonth(10)}
            />
            <CierreMes monthDate={new Date(2026, 10, 1)} />
          </div>

          {/* DICIEMBRE 2026 */}
          <div id="mes-diciembre">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 11, 1)}
              mesNumero={12}
              nombreZodiaco="Sagitario → Capricornio"
              simboloZodiaco="♐"
              temaDelMes="Expansión y sabiduría"
              eventos={getFormattedEventosForMonth(11)}
            />
            <CierreMes monthDate={new Date(2026, 11, 1)} />
          </div>

        </div>

        {/* TERAPIA ASTROLÓGICA CREATIVA */}
        <div id="terapia-creativa">
          <EscrituraTerapeutica />
          <Visualizacion />
          <RitualSimbolico />
          <TrabajoEmocional />
        </div>

        {/* CIERRE DEL CICLO */}
        <div id="cierre-ciclo">
          <QuienEraQuienSoy />
          <PreparacionProximaVuelta />
          <CartaCierre name={userName} />
          <PaginaFinalBlanca />
        </div>

        {/* CONTRAPORTADA */}
        <Contraportada />

      </div>
    </div>
  );
};
