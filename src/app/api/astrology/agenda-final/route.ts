// src/app/api/astrology/agenda-final/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getAgendaNatalChart,
  getAgendaProgressedChart,
  getAgendaAstronomicalEvents,
  validateBirthData
} from '@/utils/prokeralaUtils';

/**
 * ✅ ENDPOINT FINAL DE AGENDA - Con utilidades consolidadas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone = 'Europe/Madrid',
      startDate,
      endDate,
      fullName
    } = body;

    console.log('📅 Generando agenda final con utilidades consolidadas:', {
      birthData: `${birthDate} ${birthTime}`,
      coordinates: `${latitude}, ${longitude}`,
      period: `${startDate} - ${endDate}`,
      fullName
    });

    // ✅ PASO 1: Validar datos de entrada
    const validation = validateBirthData({
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone
    });

    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: validation.errors
      }, { status: 400 });
    }

    // Usar datos corregidos
    const correctedData = validation.corrected!;

    // ✅ PASO 2: Obtener carta natal
    console.log('🔮 Obteniendo carta natal con utilidades...');
    const natalResult = await getAgendaNatalChart(correctedData);

    if (!natalResult.success) {
      throw new Error(`Error carta natal: ${natalResult.error}`);
    }

    console.log('✅ Carta natal obtenida exitosamente');

    // ✅ PASO 3: Obtener carta progresada
    const currentYear = new Date(startDate || new Date()).getFullYear();
    console.log(`🔮 Obteniendo carta progresada para año ${currentYear}...`);
    
    const progressedResult = await getAgendaProgressedChart({
      ...correctedData,
      progressionYear: currentYear
    });

    if (!progressedResult.success) {
      console.warn(`⚠️ Carta progresada falló: ${progressedResult.error}`);
    }

    console.log('✅ Carta progresada procesada');

    // ✅ PASO 4: Obtener eventos astrológicos
    console.log('📅 Obteniendo eventos astrológicos...');
    const eventsResult = await getAgendaAstronomicalEvents(
      { latitude: correctedData.latitude, longitude: correctedData.longitude },
      startDate || `${currentYear}-01-01`,
      endDate || `${currentYear}-12-31`
    );

    console.log('✅ Eventos astrológicos procesados');

    // ✅ PASO 5: Generar agenda estructurada
    const agenda = {
      // Portada personalizada
      portada: {
        titulo: `Tu Vuelta al Sol ${currentYear}`,
        subtitulo: 'Agenda Astrológica Personalizada',
        nombre: fullName || 'Alma Especial',
        periodo: {
          inicio: formatFechaEspanol(startDate || `${currentYear}-01-01`),
          fin: formatFechaEspanol(endDate || `${currentYear}-12-31`)
        },
        datosNacimiento: {
          fecha: formatFechaEspanol(correctedData.birthDate),
          hora: correctedData.birthTime,
          coordenadas: `${correctedData.latitude.toFixed(4)}°, ${correctedData.longitude.toFixed(4)}°`,
          timezone: correctedData.timezone,
          lugar: determinarLugar(correctedData.latitude, correctedData.longitude)
        }
      },

      // Cartas astrológicas
      cartas: {
        natal: {
          estado: 'obtenida exitosamente',
          planetas: procesarPlanetas(natalResult.data?.planets),
          casas: procesarCasas(natalResult.data?.houses),
          aspectos: procesarAspectos(natalResult.data?.aspects),
          angulos: procesarAngulos(natalResult.data)
        },
        progresada: progressedResult.success ? {
          estado: 'obtenida exitosamente',
          año: currentYear,
          planetas: procesarPlanetas(progressedResult.data?.planets),
          evolutivo: true
        } : {
          estado: 'no disponible',
          error: progressedResult.error
        }
      },

      // Eventos astrológicos del período
      eventos: {
        fasesLunares: eventsResult.moonPhases ? 
          procesarFasesLunares(eventsResult.moonPhases) : null,
        retrogradaciones: eventsResult.retrogrades ? 
          procesarRetrogradaciones(eventsResult.retrogrades) : null,
        estado: eventsResult.success ? 'completos' : 'parciales',
        errores: eventsResult.errors
      },

      // Análisis personalizado
      analisis: generarAnalisisPersonalizado(
        natalResult.data,
        progressedResult.success ? progressedResult.data : null
      ),

      // Rituales y recomendaciones
      rituales: generarRitualesPersonalizados(currentYear),

      // Metadata técnica
      metadata: {
        generadaEn: new Date().toISOString(),
        configuracion: {
          ayanamsa: 'tropical (0)',
          sistemaCasas: 'placidus',
          precisionCoordenadas: 4,
          timezone: correctedData.timezone,
          version: 'v2.0-utilidades-consolidadas'
        },
        datosCorregidos: {
          fechaOriginal: birthDate,
          fechaCorregida: correctedData.birthDate,
          horaOriginal: birthTime,
          horaCorregida: correctedData.birthTime,
          timezoneAplicado: correctedData.timezone
        }
      }
    };

    console.log('✅ Agenda generada exitosamente con utilidades consolidadas');

    return NextResponse.json({
      success: true,
      agenda,
      resumen: {
        cartaNatal: natalResult.success ? '✅ Exitosa' : '❌ Error',
        cartaProgresada: progressedResult.success ? '✅ Exitosa' : '⚠️ No disponible',
        eventosAstrologicos: eventsResult.success ? '✅ Completos' : '⚠️ Parciales',
        estado: 'AGENDA GENERADA CON COORDENADAS CORREGIDAS'
      }
    });

  } catch (error) {
    console.error('❌ Error generando agenda final:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      estado: 'ERROR EN GENERACIÓN DE AGENDA'
    }, { status: 500 });
  }
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Formatear fecha en español
 */
function formatFechaEspanol(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  } catch {
    return fecha;
  }
}

/**
 * Determinar lugar aproximado por coordenadas
 */
function determinarLugar(lat: number, lon: number): string {
  // Algunos lugares conocidos para referencia rápida
  const lugares = [
    { lat: 40.4164, lon: -3.7025, nombre: 'Madrid, España' },
    { lat: 41.3851, lon: 2.1734, nombre: 'Barcelona, España' },
    { lat: 40.7128, lon: -74.0060, nombre: 'Nueva York, Estados Unidos' },
    { lat: 51.5074, lon: -0.1278, nombre: 'Londres, Reino Unido' },
    { lat: -34.6037, lon: -58.3816, nombre: 'Buenos Aires, Argentina' }
  ];
  
  // Buscar el lugar más cercano
  let lugarMasCercano = 'Ubicación personalizada';
  let distanciaMinima = Infinity;
  
  lugares.forEach(lugar => {
    const distancia = Math.sqrt(
      Math.pow(lat - lugar.lat, 2) + Math.pow(lon - lugar.lon, 2)
    );
    
    if (distancia < distanciaMinima && distancia < 0.1) { // Aprox 11km
      distanciaMinima = distancia;
      lugarMasCercano = lugar.nombre;
    }
  });
  
  return lugarMasCercano;
}

/**
 * Procesar datos de planetas
 */
function procesarPlanetas(planetas: any[]): any[] {
  if (!planetas || !Array.isArray(planetas)) return [];
  
  return planetas.map(planeta => ({
    nombre: planeta.name || planeta.nombre,
    signo: planeta.sign || planeta.signo,
    grado: planeta.degree || planeta.grado,
    casa: planeta.house || planeta.casa,
    retrogrado: planeta.retrograde || planeta.retrogrado || false,
    longitud: planeta.longitude || planeta.longitud
  }));
}

/**
 * Procesar datos de casas
 */
function procesarCasas(casas: any[]): any[] {
  if (!casas || !Array.isArray(casas)) return [];
  
  return casas.map((casa, index) => ({
    numero: casa.number || casa.numero || (index + 1),
    signo: casa.sign || casa.signo,
    grado: casa.degree || casa.grado,
    longitud: casa.longitude || casa.longitud
  }));
}

/**
 * Procesar aspectos astrológicos
 */
function procesarAspectos(aspectos: any[]): any[] {
  if (!aspectos || !Array.isArray(aspectos)) return [];
  
  return aspectos.map(aspecto => ({
    planeta1: aspecto.planet1 || aspecto.planeta1,
    planeta2: aspecto.planet2 || aspecto.planeta2,
    tipo: aspecto.type || aspecto.tipo || aspecto.aspect?.name,
    orbe: aspecto.orb || aspecto.orbe,
    naturaleza: determinarNaturalezaAspecto(aspecto.type || aspecto.tipo)
  }));
}

/**
 * Procesar ángulos importantes (Ascendente, MC, etc.)
 */
function procesarAngulos(data: any): any {
  if (!data) return {};
  
  return {
    ascendente: data.ascendant ? {
      signo: data.ascendant.sign,
      grado: data.ascendant.degree,
      longitud: data.ascendant.longitude
    } : null,
    medicielo: data.mc || data.midheaven ? {
      signo: (data.mc || data.midheaven).sign,
      grado: (data.mc || data.midheaven).degree,
      longitud: (data.mc || data.midheaven).longitude
    } : null
  };
}

/**
 * Determinar naturaleza del aspecto
 */
function determinarNaturalezaAspecto(tipo: string): string {
  const aspectosArmonicos = ['trine', 'sextile', 'trigono', 'sextil'];
  const aspectosTensionales = ['square', 'opposition', 'cuadratura', 'oposicion'];
  
  if (aspectosArmonicos.some(a => tipo?.toLowerCase().includes(a))) {
    return 'armonico';
  } else if (aspectosTensionales.some(a => tipo?.toLowerCase().includes(a))) {
    return 'tensional';
  }
  return 'neutro';
}

/**
 * Procesar fases lunares
 */
function procesarFasesLunares(fases: any): any[] {
  if (!fases || !Array.isArray(fases)) return [];
  
  return fases.map(fase => ({
    fecha: fase.date || fase.fecha,
    tipo: fase.phase || fase.tipo || fase.name,
    signo: fase.sign || fase.signo,
    grado: fase.degree || fase.grado,
    hora: fase.time || fase.hora
  }));
}

/**
 * Procesar retrogradaciones planetarias
 */
function procesarRetrogradaciones(retrogrades: any): any[] {
  if (!retrogrades || !Array.isArray(retrogrades)) return [];
  
  return retrogrades.map(retro => ({
    planeta: retro.planet || retro.planeta,
    fechaInicio: retro.start_date || retro.fecha_inicio,
    fechaFin: retro.end_date || retro.fecha_fin,
    signoInicio: retro.start_sign || retro.signo_inicio,
    signoFin: retro.end_sign || retro.signo_fin
  }));
}

/**
 * Generar análisis personalizado
 */
function generarAnalisisPersonalizado(natalData: any, progressedData: any): any {
  const analisis: {
    enfoquesPrincipales: string[],
    temasPredominantes: string[],
    recomendacionesClave: string[]
  } = {
    enfoquesPrincipales: [
      'Propósito evolutivo y destino del alma',
      'Sanación emocional y liberación kármica',
      'Manifestación consciente y abundancia',
      'Relaciones y conexiones significativas'
    ],
    temasPredominantes: [],
    recomendacionesClave: []
  };

  // Análisis basado en planetas dominantes
  if (natalData?.planets) {
    const elementosCount = contarElementos(natalData.planets);
    const elementoDominante = (Object.keys(elementosCount) as Elemento[]).reduce((a, b) => 
      elementosCount[a] > elementosCount[b] ? a : b
    );
    
    analisis.temasPredominantes.push(`Elemento ${elementoDominante} dominante`);
    
    // Recomendaciones según elemento dominante
    switch (elementoDominante) {
      case 'fuego':
        analisis.recomendacionesClave.push('Canalizar la energía creativa en proyectos inspiradores');
        break;
      case 'tierra':
        analisis.recomendacionesClave.push('Construir bases sólidas para la manifestación material');
        break;
      case 'aire':
        analisis.recomendacionesClave.push('Desarrollar la comunicación y las conexiones intelectuales');
        break;
      case 'agua':
        analisis.recomendacionesClave.push('Honrar la intuición y el mundo emocional');
        break;
    }
  }

  // Análisis de progresiones si está disponible
  if (progressedData) {
    analisis.temasPredominantes.push('Año de transformación evolutiva');
    analisis.recomendacionesClave.push('Integrar las nuevas energías progresadas en la vida diaria');
  }

  return analisis;
}

/**
 * Contar elementos astrológicos
 */
type Elemento = 'fuego' | 'tierra' | 'aire' | 'agua';

function contarElementos(planetas: any[]): Record<Elemento, number> {
  const elementos: Record<Elemento, number> = { fuego: 0, tierra: 0, aire: 0, agua: 0 };
  
  const signosElementos: Record<string, Elemento> = {
    'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
    'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
    'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
    'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua'
  };
  
  planetas.forEach(planeta => {
    const elemento = signosElementos[planeta.sign || planeta.signo] as Elemento | undefined;
    if (elemento && elementos[elemento] !== undefined) {
      elementos[elemento]++;
    }
  });
  
  return elementos;
}

/**
 * Generar rituales personalizados
 */
function generarRitualesPersonalizados(año: number): any {
  return {
    lunasNuevas: [
      'Ritual de intenciones en luna nueva: Escribir 3 deseos específicos',
      'Meditación de manifestación con velas blancas',
      'Diario de gratitud y visión del futuro'
    ],
    lunasLlenas: [
      'Ritual de liberación en luna llena: Quemar lo que ya no sirve',
      'Baño purificador con sal marina y aceites esenciales',
      'Celebración de logros y reconocimiento personal'
    ],
    estaciones: [
      `Ritual de año nuevo ${año}: Renovación de propósitos`,
      'Ritual de equinoccio: Equilibrio entre luz y sombra',
      'Ritual de solsticio: Honrar los ciclos naturales'
    ],
    afirmaciones: [
      'Confío en el timing perfecto del universo',
      'Estoy alineado/a con mi propósito más elevado',
      'Abrazo los cambios como oportunidades de crecimiento',
      'Soy un canal de amor, sabiduría y abundancia'
    ]
  };
}

/**
 * ✅ ENDPOINT GET: Información del servicio
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/astrology/agenda-final',
    descripcion: 'Endpoint de agenda astrológica con utilidades consolidadas',
    version: 'v2.0',
    caracteristicas: [
      '✅ Validación completa de datos de entrada',
      '✅ Utilidades consolidadas para Prokerala API',
      '✅ Manejo de coordenadas de máxima precisión',
      '✅ Formato datetime compatible con HL/UT/LMT',
      '✅ Carta natal y progresada optimizadas',
      '✅ Eventos astrológicos anuales',
      '✅ Análisis personalizado inteligente',
      '✅ Rituales y recomendaciones adaptativas'
    ],
    configuracion: {
      ayanamsa: 'tropical (0)',
      sistemaCasas: 'placidus',
      precisionCoordenadas: 4,
      formatoDatetime: 'ISO 8601 con timezone',
      validacionDatos: 'completa'
    },
    uso: {
      metodo: 'POST',
      parametrosObligatorios: {
        birthDate: 'YYYY-MM-DD',
        birthTime: 'HH:MM:SS',
        latitude: 'number (-90 a 90)',
        longitude: 'number (-180 a 180)'
      },
      parametrosOpcionales: {
        timezone: 'string (default: Europe/Madrid)',
        startDate: 'YYYY-MM-DD (default: año actual)',
        endDate: 'YYYY-MM-DD (default: fin año actual)',
        fullName: 'string (default: Alma Especial)'
      }
    },
    ejemplo: {
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      latitude: 40.4164,
      longitude: -3.7025,
      timezone: 'Europe/Madrid',
      startDate: '2025-02-10',
      endDate: '2026-02-10',
      fullName: 'Verónica'
    },
    utilidades: {
      validacionAutomatica: 'Datos corregidos automáticamente',
      coordinadasPrecisas: 'Máximo 4 decimales de precisión',
      timezoneInteligente: 'Detección automática horario verano/invierno',
      manejoErrores: 'Respuestas detalladas para debugging'
    }
  });
}