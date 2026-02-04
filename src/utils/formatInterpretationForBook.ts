/**
 * Utilidades para formatear interpretaciones de eventos al formato del Agenda Libro
 */

// Orden zodiacal para cálculos de casas
const ZODIAC_ORDER = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

// Descripciones de cada casa para personalizar interpretaciones lunares
const HOUSE_DESCRIPTIONS: Record<number, { area: string; tema: string }> = {
  1: { area: 'tu identidad y presencia', tema: 'quién eres y cómo te presentas al mundo' },
  2: { area: 'tus recursos y valores', tema: 'lo que valoras y tu seguridad material' },
  3: { area: 'tu comunicación y entorno cercano', tema: 'cómo piensas, hablas y te relacionas con tu entorno' },
  4: { area: 'tu hogar y raíces', tema: 'tu vida privada, familia y fundamentos emocionales' },
  5: { area: 'tu creatividad y expresión', tema: 'lo que te da alegría, el amor y los proyectos personales' },
  6: { area: 'tu rutina y salud', tema: 'el trabajo diario, el servicio y el cuidado del cuerpo' },
  7: { area: 'tus relaciones significativas', tema: 'las asociaciones, el matrimonio y los acuerdos' },
  8: { area: 'tus transformaciones profundas', tema: 'los recursos compartidos, la intimidad y los renacimientos' },
  9: { area: 'tu búsqueda de sentido', tema: 'la filosofía, los viajes y la expansión de la mente' },
  10: { area: 'tu carrera y vocación', tema: 'tu reputación pública y logros profesionales' },
  11: { area: 'tus amistades y comunidad', tema: 'los grupos, proyectos colectivos y aspiraciones futuras' },
  12: { area: 'tu mundo interior y espiritualidad', tema: 'lo oculto, la intuición y la conexión con lo trascendente' }
};

interface NatalHouse {
  number: number;
  sign: string;
  degree?: number;
  longitude?: number;
}

interface EventInterpretation {
  titulo_evento?: string;
  clima_del_dia?: string[];
  energias_activas?: string[];
  mensaje_sintesis?: string;
  como_te_afecta?: string;
  interpretacion_practica?: string[];
  acciones_concretas?: string[];
  preguntas_reflexion?: string[];
  perspectiva_evolutiva?: string;
  para_ti_especificamente?: string;
  tu_fortaleza_a_usar?: {
    fortaleza: string;
    como_usarla: string;
  };
  tu_bloqueo_a_trabajar?: {
    bloqueo: string;
    reframe: string;
  };
  mantra_personalizado?: string;
  ejercicio_para_ti?: string;
  consejo_especifico?: string;
  timing_evolutivo?: {
    que_sembrar: string;
    cuando_actuar: string;
    resultado_esperado: string;
  };
}

/**
 * Convierte el JSON de interpretación de evento a texto formateado para el libro
 *
 * El formato del libro es más narrativo y enfocado en la acción que el formato de la agenda online
 *
 * @param interpretation - JSON de interpretación desde la API
 * @returns Texto formateado para mostrar en el libro impreso
 */
export function formatInterpretationForBook(interpretation: EventInterpretation | null | undefined): string {
  if (!interpretation) {
    return '';
  }

  let texto = '';

  // 1. TÍTULO DEL EVENTO (si existe)
  if (interpretation.titulo_evento) {
    texto += `${interpretation.titulo_evento}\n\n`;
  }

  // 2. PARA TI ESPECÍFICAMENTE (mensaje personalizado principal)
  if (interpretation.para_ti_especificamente) {
    texto += `${interpretation.para_ti_especificamente}\n\n`;
  } else if (interpretation.mensaje_sintesis) {
    // Fallback si no existe para_ti_especificamente
    texto += `🔥 PARA TI:\n${interpretation.mensaje_sintesis}\n\n`;
  }

  // 3. CÓMO TE AFECTA (conexión con carta natal)
  if (interpretation.como_te_afecta) {
    texto += `Qué se activa en tu Natal:\n${interpretation.como_te_afecta}\n\n`;
  }

  // 4. TU FORTALEZA A USAR (muy importante para el libro)
  if (interpretation.tu_fortaleza_a_usar) {
    texto += `✨ Tu fortaleza para este momento:\n`;
    texto += `${interpretation.tu_fortaleza_a_usar.fortaleza}\n`;
    texto += `${interpretation.tu_fortaleza_a_usar.como_usarla}\n\n`;
  }

  // 5. ACCIONES CONCRETAS (práctico y accionable)
  if (interpretation.acciones_concretas && interpretation.acciones_concretas.length > 0) {
    texto += `Qué hacer con esta energía:\n`;
    interpretation.acciones_concretas.forEach((accion) => {
      texto += `• ${accion}\n`;
    });
    texto += '\n';
  }

  // 6. TU BLOQUEO A TRABAJAR (transformación)
  if (interpretation.tu_bloqueo_a_trabajar) {
    texto += `⚠️ Ten en cuenta:\n`;
    texto += `${interpretation.tu_bloqueo_a_trabajar.bloqueo}\n`;
    if (interpretation.tu_bloqueo_a_trabajar.reframe) {
      texto += `\nPero recuerda: ${interpretation.tu_bloqueo_a_trabajar.reframe}\n\n`;
    }
  }

  // 7. EJERCICIO PARA TI (muy valioso para el libro)
  if (interpretation.ejercicio_para_ti) {
    texto += `📝 Ejercicio sugerido:\n${interpretation.ejercicio_para_ti}\n\n`;
  }

  // 8. TIMING EVOLUTIVO (para Lunas Nuevas principalmente)
  if (interpretation.timing_evolutivo) {
    if (interpretation.timing_evolutivo.que_sembrar) {
      texto += `🌱 Qué sembrar: ${interpretation.timing_evolutivo.que_sembrar}\n`;
    }
    if (interpretation.timing_evolutivo.cuando_actuar) {
      texto += `⏰ Cuándo actuar: ${interpretation.timing_evolutivo.cuando_actuar}\n`;
    }
    if (interpretation.timing_evolutivo.resultado_esperado) {
      texto += `🎯 Resultado esperado: ${interpretation.timing_evolutivo.resultado_esperado}\n`;
    }
    texto += '\n';
  }

  // 9. PREGUNTA DE REFLEXIÓN (cierre contemplativo)
  if (interpretation.preguntas_reflexion && interpretation.preguntas_reflexion.length > 0) {
    texto += `Pregunta para reflexionar:\n`;
    texto += `${interpretation.preguntas_reflexion[0]}\n`;
  }

  return texto.trim();
}

/**
 * Mapea tipo de evento del sistema al formato del libro
 *
 * @param eventType - Tipo de evento en formato API ('new_moon', 'full_moon', etc.)
 * @returns Tipo de evento en formato libro ('lunaNueva', 'lunaLlena', etc.)
 */
export function mapEventType(eventType: string): 'lunaNueva' | 'lunaLlena' | 'ingreso' | 'retrogrado' | 'eclipse' | 'cumpleanos' | 'especial' {
  const map: Record<string, 'lunaNueva' | 'lunaLlena' | 'ingreso' | 'retrogrado' | 'eclipse' | 'cumpleanos' | 'especial'> = {
    'new_moon': 'lunaNueva',
    'full_moon': 'lunaLlena',
    'eclipse': 'eclipse',
    'retrograde': 'retrogrado',
    'planetary_transit': 'ingreso',
    'lunar_phase': 'lunaLlena', // Por defecto, puede ser nueva también
    'ingress': 'ingreso',
    'station': 'retrogrado'
  };

  return map[eventType] || 'especial';
}

/**
 * Detecta si un evento de fase lunar es Luna Nueva o Llena basándose en el título
 *
 * @param title - Título del evento
 * @param eventType - Tipo del evento
 * @returns Tipo específico de luna
 */
export function detectLunarPhase(title: string, eventType: string): 'lunaNueva' | 'lunaLlena' | 'ingreso' {
  if (eventType !== 'lunar_phase' && eventType !== 'new_moon' && eventType !== 'full_moon') {
    return 'ingreso'; // Default para otros eventos
  }

  const titleLower = title.toLowerCase();

  if (titleLower.includes('nueva') || titleLower.includes('new moon')) {
    return 'lunaNueva';
  }

  if (titleLower.includes('llena') || titleLower.includes('full moon')) {
    return 'lunaLlena';
  }

  // Por defecto, si es lunar_phase sin especificar, asumir llena
  return 'lunaLlena';
}

/**
 * Calcula en qué casa natal cae un signo dado, basándose en las cúspides de casas
 * @param sign - El signo zodiacal (ej: "Aries")
 * @param natalHouses - Array de casas natales con sus signos
 * @returns Número de casa (1-12) o undefined si no se puede calcular
 */
export function calculateHouseForSign(sign: string, natalHouses?: NatalHouse[]): number | undefined {
  if (!sign || !natalHouses || natalHouses.length < 12) {
    return undefined;
  }

  // Normalizar el signo
  const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  const signIndex = ZODIAC_ORDER.indexOf(normalizedSign);

  if (signIndex === -1) {
    return undefined;
  }

  // Encontrar la casa cuya cúspide está en ese signo o justo antes
  // La lógica es: el signo está "en" la casa cuya cúspide es el signo,
  // o la casa anterior si ninguna cúspide está en ese signo exacto

  for (let i = 0; i < 12; i++) {
    const house = natalHouses[i];
    const houseSignIndex = ZODIAC_ORDER.indexOf(house.sign);
    const nextHouse = natalHouses[(i + 1) % 12];
    const nextHouseSignIndex = ZODIAC_ORDER.indexOf(nextHouse.sign);

    // Manejar el wrap-around del zodíaco (Piscis -> Aries)
    if (houseSignIndex <= nextHouseSignIndex) {
      // Caso normal: cúspide actual <= siguiente
      if (signIndex >= houseSignIndex && signIndex < nextHouseSignIndex) {
        return house.number;
      }
    } else {
      // Wrap-around: la siguiente casa está en un signo "antes" en el zodíaco
      if (signIndex >= houseSignIndex || signIndex < nextHouseSignIndex) {
        return house.number;
      }
    }
  }

  // Fallback: buscar casa con el mismo signo
  const matchingHouse = natalHouses.find(h => h.sign === normalizedSign);
  return matchingHouse?.number;
}

/**
 * Genera descripción personalizada basada en la casa natal
 */
function getHouseDescription(houseNumber: number, tipo: 'lunaNueva' | 'lunaLlena'): string {
  const house = HOUSE_DESCRIPTIONS[houseNumber];
  if (!house) return '';

  if (tipo === 'lunaNueva') {
    return `Esta Luna Nueva activa tu Casa ${houseNumber} natal, el área de ${house.area}. Es momento ideal para sembrar intenciones relacionadas con ${house.tema}.`;
  } else {
    return `Esta Luna Llena ilumina tu Casa ${houseNumber} natal, el área de ${house.area}. Observa qué culmina o necesita liberarse en relación a ${house.tema}.`;
  }
}

/**
 * Genera interpretación genérica para un evento cuando no hay personalizada
 */
function getGenericInterpretation(tipo: string, signo?: string, titulo?: string, casaNatal?: number): string {
  const signDescriptions: Record<string, { energia: string; tema: string }> = {
    'Aries': { energia: 'acción, iniciativa y coraje', tema: 'empezar algo nuevo con valentía' },
    'Tauro': { energia: 'estabilidad, disfrute y seguridad', tema: 'conectar con lo que te da paz y placer' },
    'Géminis': { energia: 'comunicación, curiosidad y adaptabilidad', tema: 'aprender, conversar y explorar nuevas ideas' },
    'Cáncer': { energia: 'emociones, hogar y nutrición', tema: 'cuidar tu mundo interior y tu familia' },
    'Leo': { energia: 'creatividad, expresión y brillo', tema: 'brillar con autenticidad y generosidad' },
    'Virgo': { energia: 'análisis, servicio y perfeccionamiento', tema: 'organizar, sanar y mejorar lo cotidiano' },
    'Libra': { energia: 'armonía, relaciones y equilibrio', tema: 'buscar balance y belleza en los vínculos' },
    'Escorpio': { energia: 'transformación, intensidad y profundidad', tema: 'soltar lo viejo para renacer' },
    'Sagitario': { energia: 'expansión, optimismo y búsqueda de sentido', tema: 'explorar nuevos horizontes y creencias' },
    'Capricornio': { energia: 'estructura, disciplina y logros', tema: 'construir con paciencia y responsabilidad' },
    'Acuario': { energia: 'innovación, libertad y comunidad', tema: 'ser auténtico y conectar con tu tribu' },
    'Piscis': { energia: 'intuición, espiritualidad y compasión', tema: 'fluir, soñar y conectar con lo trascendente' }
  };

  const signInfo = signo ? signDescriptions[signo] : null;

  // Información de casa natal (si está disponible)
  const houseInfo = casaNatal ? getHouseDescription(casaNatal, tipo as 'lunaNueva' | 'lunaLlena') : '';

  if (tipo === 'lunaNueva') {
    let text = '';
    if (signInfo) {
      text = `Esta Luna Nueva en ${signo} te invita a sembrar intenciones relacionadas con ${signInfo.energia}. Es momento de ${signInfo.tema}.`;
    } else {
      text = 'La Luna Nueva es momento de nuevos comienzos.';
    }
    // Añadir información de casa natal si está disponible
    if (houseInfo) {
      text += `\n\n${houseInfo}`;
    }
    text += '\n\nLas semillas que plantes hoy florecerán en los próximos 6 meses.';
    return text;
  }

  if (tipo === 'lunaLlena') {
    let text = '';
    if (signInfo) {
      text = `Esta Luna Llena en ${signo} ilumina temas de ${signInfo.energia}. Es momento de celebrar logros, soltar lo que ya no sirve y ${signInfo.tema}.`;
    } else {
      text = 'La Luna Llena trae culminación e iluminación.';
    }
    // Añadir información de casa natal si está disponible
    if (houseInfo) {
      text += `\n\n${houseInfo}`;
    }
    text += '\n\nObserva qué ha llegado a su punto máximo y qué necesitas soltar.';
    return text;
  }

  if (tipo === 'retrogrado') {
    const planeta = titulo?.split(' ')[0] || 'El planeta';
    return `${planeta} inicia su fase retrógrada. Es momento de revisar, reflexionar y reconectar con temas del pasado. Evita iniciar proyectos nuevos importantes y usa esta energía para completar lo pendiente.`;
  }

  if (tipo === 'ingreso') {
    if (signInfo && titulo) {
      const planeta = titulo.split(' ')[0] || 'El planeta';
      return `${planeta} entra en ${signo}, activando energías de ${signInfo.energia}. Los próximos meses te invitan a ${signInfo.tema}.`;
    }
    return 'Este tránsito marca un cambio de energía significativo. Presta atención a los nuevos temas que surgen.';
  }

  if (tipo === 'eclipse') {
    if (signInfo) {
      return `Este eclipse en ${signo} marca un punto de inflexión potente. Los temas de ${signInfo.energia} están siendo activados a nivel profundo. Los eclipses traen cambios que se despliegan durante los próximos 6 meses.`;
    }
    return 'Los eclipses son portales de transformación. Algo termina para que algo nuevo pueda comenzar.';
  }

  return 'Evento astrológico significativo. Presta atención a los temas que surgen en tu vida.';
}

/**
 * Formatea un evento completo para el libro, mapeando todos los campos necesarios
 *
 * @param event - Evento astrológico desde el SolarCycle
 * @param natalHouses - Opcional: Array de casas natales para personalizar lunares
 * @returns Objeto formateado para CalendarioMensualTabla
 */
export function formatEventForBook(event: any, natalHouses?: NatalHouse[]) {
  // Usar detectLunarPhase para eventos lunares, mapEventType para el resto
  let tipo: 'lunaNueva' | 'lunaLlena' | 'ingreso' | 'retrogrado' | 'eclipse' | 'cumpleanos' | 'especial';

  if (event.type === 'lunar_phase' || event.type === 'new_moon' || event.type === 'full_moon') {
    tipo = detectLunarPhase(event.title, event.type);
  } else {
    tipo = mapEventType(event.type);
  }

  // Calcular casa natal para eventos lunares si tenemos datos
  let casaNatal: number | undefined;
  if (natalHouses && (tipo === 'lunaNueva' || tipo === 'lunaLlena') && event.sign) {
    casaNatal = calculateHouseForSign(event.sign, natalHouses);
  }

  // Obtener interpretación personalizada o genérica
  let interpretacion = formatInterpretationForBook(event.interpretation);

  // Si no hay interpretación personalizada, usar genérica (con casa natal si disponible)
  if (!interpretacion) {
    interpretacion = getGenericInterpretation(tipo, event.sign, event.title, casaNatal);
  }

  return {
    dia: new Date(event.date).getDate(),
    tipo,
    titulo: event.title,
    signo: event.sign || undefined,
    interpretacion,
    casaNatal // Incluir la casa natal en el objeto retornado
  };
}

/**
 * Versión compacta de interpretación para la sección de Lunas y Ejercicios
 *
 * @param interpretation - JSON de interpretación
 * @returns Texto corto (1-2 líneas)
 */
export function formatInterpretationCompact(interpretation: EventInterpretation | null | undefined): string {
  if (!interpretation) return '';

  // Priorizar mensaje_sintesis para versión compacta
  if (interpretation.mensaje_sintesis) {
    return interpretation.mensaje_sintesis;
  }

  // Fallback a para_ti_especificamente (primeras 200 caracteres)
  if (interpretation.para_ti_especificamente) {
    const text = interpretation.para_ti_especificamente;
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  // Fallback a como_te_afecta
  if (interpretation.como_te_afecta) {
    const text = interpretation.como_te_afecta;
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  return 'Ver interpretación completa en el calendario mensual.';
}
