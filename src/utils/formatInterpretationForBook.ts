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

// Estructura REAL que genera el prompt de OpenAI (eventInterpretationPrompt.ts)
interface EventInterpretation {
  titulo_evento?: string;
  clima_del_dia?: string[];
  energias_activas?: string[];
  mensaje_sintesis?: string;
  como_te_afecta?: string;
  interpretacion_practica?: Array<{
    planeta: string;
    que_pide: string;
  }>;
  sintesis_practica?: string;
  accion_concreta?: {
    titulo: string;
    pasos: string[];
  };
  sombra_a_evitar?: string[];
  explicacion_sombra?: string;
  frase_ancla?: string;
  apoyo_energetico?: Array<{
    tipo: string;
    elemento: string;
    proposito: string;
  }>;
  nota_apoyo?: string;
  cierre_dia?: string;
  analisis_tecnico?: {
    evento_en_casa_natal?: number;
    significado_casa?: string;
    planetas_natales_activados?: string[];
    aspectos_cruzados?: string[];
  };
}

/**
 * Convierte el JSON de interpretación de evento a texto formateado para el libro
 *
 * El formato del libro es más narrativo y enfocado en la acción que el formato de la agenda online
 * Usa los campos REALES que genera eventInterpretationPrompt.ts
 *
 * @param interpretation - JSON de interpretación desde la API
 * @returns Texto formateado para mostrar en el libro impreso
 */
export function formatInterpretationForBook(interpretation: EventInterpretation | null | undefined): string {
  if (!interpretation) {
    return '';
  }

  let texto = '';

  // 1. MENSAJE SÍNTESIS (resumen potente del día)
  if (interpretation.mensaje_sintesis) {
    texto += `${interpretation.mensaje_sintesis}\n\n`;
  }

  // 2. CÓMO TE AFECTA (conexión con carta natal - 200-300 palabras)
  if (interpretation.como_te_afecta) {
    texto += `${interpretation.como_te_afecta}\n\n`;
  }

  // 3. SÍNTESIS PRÁCTICA (resumen de la interpretación)
  if (interpretation.sintesis_practica) {
    texto += `${interpretation.sintesis_practica}\n\n`;
  }

  // 4. ACCIÓN CONCRETA (ejercicio con pasos)
  if (interpretation.accion_concreta) {
    if (interpretation.accion_concreta.titulo) {
      texto += `Ejercicio: ${interpretation.accion_concreta.titulo}\n`;
    }
    if (interpretation.accion_concreta.pasos && interpretation.accion_concreta.pasos.length > 0) {
      interpretation.accion_concreta.pasos.forEach((paso, idx) => {
        texto += `${idx + 1}. ${paso}\n`;
      });
    }
    texto += '\n';
  }

  // 5. SOMBRAS A EVITAR (advertencias)
  if (interpretation.sombra_a_evitar && interpretation.sombra_a_evitar.length > 0) {
    texto += `Ten en cuenta:\n`;
    interpretation.sombra_a_evitar.forEach((sombra) => {
      texto += `• ${sombra}\n`;
    });
    if (interpretation.explicacion_sombra) {
      texto += `${interpretation.explicacion_sombra}\n`;
    }
    texto += '\n';
  }

  // 6. FRASE ANCLA (mantra del día)
  if (interpretation.frase_ancla) {
    texto += `"${interpretation.frase_ancla}"\n\n`;
  }

  // 7. CIERRE DEL DÍA (mensaje empoderador)
  if (interpretation.cierre_dia) {
    texto += `${interpretation.cierre_dia}\n`;
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
 * REMOVIDO: Ya no generamos interpretaciones genéricas
 * Si no hay interpretación personalizada, retornamos null para indicar que falta
 */

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

  // ✅ FIX: Obtener signo primero (puede estar en sign o en metadata.zodiacSign)
  const signo = event.sign || event.metadata?.zodiacSign || undefined;

  // ✅ FIX CRÍTICO: Usar la casa YA CALCULADA del evento, NO recalcular
  // Orden de prioridad:
  // 1. Casa de la interpretación personalizada (calculada con grados por OpenAI)
  // 2. Casa del metadata del evento (calculada con grados al generar SolarCycle)
  // 3. Casa del evento mismo (de generate-book)
  // 4. Solo como ÚLTIMO fallback: recalcular (menos preciso, solo usa signo)
  let casaNatal: number | undefined =
    event.interpretation?.analisis_tecnico?.evento_en_casa_natal ||
    event.metadata?.house ||
    event.house;

  // ✅ LOG para debugging
  console.log(`🏠 [formatEventForBook] ${event.title}: casaNatal=${casaNatal}, metadata.house=${event.metadata?.house}, event.house=${event.house}`);

  // Solo recalcular si NO tenemos casa y es evento lunar con signo válido
  if (!casaNatal && natalHouses && (tipo === 'lunaNueva' || tipo === 'lunaLlena') && signo) {
    console.warn(`⚠️ [formatEventForBook] FALTA casa para ${event.title} - recalculando como fallback`);
    casaNatal = calculateHouseForSign(signo, natalHouses);
    console.log(`🔄 [formatEventForBook] Casa recalculada para ${event.title}: ${casaNatal}`);
  }

  // ✅ VALIDACIÓN: Asegurar que la casa es válida
  if (!casaNatal || casaNatal < 1 || casaNatal > 12) {
    console.error(`❌ [formatEventForBook] Casa inválida para ${event.title}: ${casaNatal} - usando Casa 1`);
    casaNatal = 1;
  }

  // SOLO interpretación personalizada - NO genérica
  // Si no hay interpretación, se devuelve undefined para indicar que falta por generar
  const interpretacion = formatInterpretationForBook(event.interpretation) || undefined;

  return {
    dia: new Date(event.date).getDate(),
    tipo,
    titulo: event.title,
    signo,
    interpretacion,
    casaNatal,
    // ✅ NUEVO: Flag para saber si tiene interpretación personalizada
    tieneInterpretacion: !!interpretacion,
    eventId: event._id || event.id // Para poder generar la interpretación después
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

  // Fallback a sintesis_practica
  if (interpretation.sintesis_practica) {
    return interpretation.sintesis_practica;
  }

  // Fallback a frase_ancla (mantra del día)
  if (interpretation.frase_ancla) {
    return interpretation.frase_ancla;
  }

  // Fallback a como_te_afecta (primeras 200 caracteres)
  if (interpretation.como_te_afecta) {
    const text = interpretation.como_te_afecta;
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  return 'Ver interpretación completa en el calendario mensual.';
}
