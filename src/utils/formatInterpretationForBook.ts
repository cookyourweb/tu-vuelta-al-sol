/**
 * Utilidades para formatear interpretaciones de eventos al formato del Agenda Libro
 */

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
    return 'Interpretación no disponible. Genera tus interpretaciones personalizadas desde la agenda online.';
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
 * Extrae el signo zodiacal del título del evento si no está disponible directamente
 *
 * @param title - Título del evento (ej: "Luna Nueva en Acuario")
 * @returns El signo zodiacal o undefined si no se encuentra
 */
function extractSignFromTitle(title: string): string | undefined {
  const signos = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  for (const signo of signos) {
    if (title.toLowerCase().includes(signo.toLowerCase())) {
      return signo;
    }
  }

  // Fallback para nombres en inglés
  const signosIngles: Record<string, string> = {
    'aries': 'Aries', 'taurus': 'Tauro', 'gemini': 'Géminis',
    'cancer': 'Cáncer', 'leo': 'Leo', 'virgo': 'Virgo',
    'libra': 'Libra', 'scorpio': 'Escorpio', 'sagittarius': 'Sagitario',
    'capricorn': 'Capricornio', 'aquarius': 'Acuario', 'pisces': 'Piscis'
  };

  const titleLower = title.toLowerCase();
  for (const [eng, esp] of Object.entries(signosIngles)) {
    if (titleLower.includes(eng)) {
      return esp;
    }
  }

  return undefined;
}

/**
 * Formatea un evento completo para el libro, mapeando todos los campos necesarios
 *
 * @param event - Evento astrológico desde el SolarCycle
 * @returns Objeto formateado para CalendarioMensualTabla
 */
export function formatEventForBook(event: any) {
  // Obtener signo del evento o extraerlo del título
  const signo = event.sign || extractSignFromTitle(event.title) || '';

  return {
    dia: new Date(event.date).getDate(),
    tipo: detectLunarPhase(event.title, event.type),
    titulo: event.title,
    signo: signo,
    interpretacion: formatInterpretationForBook(event.interpretation)
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
