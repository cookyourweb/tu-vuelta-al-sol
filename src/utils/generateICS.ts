// src/utils/generateICS.ts
// Generador de archivos .ics (iCalendar) para exportar eventos astrológicos
// Compatible con Google Calendar, Apple Calendar, Outlook

interface CalendarEvent {
  title: string;
  date: string; // ISO string
  description?: string;
  type?: string;
  planet?: string;
  sign?: string;
  interpretation?: Record<string, string>; // Interpretación estructurada (V1/V2)
}

/**
 * Escapa caracteres especiales para formato ICS
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Formatea una fecha a formato ICS (YYYYMMDD)
 */
function formatDateICS(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Formatea una fecha+hora a formato ICS (YYYYMMDDTHHMMSS)
 */
function formatDateTimeICS(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}00`;
}

/**
 * Genera un UID único para cada evento
 */
function generateUID(event: CalendarEvent, index: number): string {
  const dateStr = formatDateICS(event.date);
  const slug = event.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  return `${dateStr}-${slug}-${index}@tuvueltaalsol.es`;
}

/**
 * Obtiene un emoji para el tipo de evento (para descripción legible)
 */
function getEventEmoji(type?: string): string {
  if (!type) return '✨';
  const t = type.toLowerCase();
  if (t.includes('lunar') || t.includes('moon')) return '🌙';
  if (t.includes('retrograde')) return '⏪';
  if (t.includes('eclipse')) return '🌑';
  if (t.includes('ingress') || t.includes('transit')) return '🔄';
  if (t.includes('solar')) return '☀️';
  return '✨';
}

/**
 * Genera el contenido completo de un archivo .ics a partir de eventos astrológicos
 */
export function generateICSContent(events: CalendarEvent[], calendarName?: string): string {
  const name = calendarName || 'Tu Vuelta al Sol - Agenda Astrológica';
  const now = new Date();
  const timestamp = formatDateTimeICS(now.toISOString());

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tu Vuelta al Sol//Agenda Astrologica//ES',
    `X-WR-CALNAME:${escapeICS(name)}`,
    'X-WR-TIMEZONE:Europe/Madrid',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  events.forEach((event, index) => {
    const emoji = getEventEmoji(event.type);
    const title = `${emoji} ${event.title}`;

    // Construir descripción con interpretación y link
    const descParts: string[] = [];
    if (event.description) descParts.push(event.description);
    if (event.planet) descParts.push(`Planeta: ${event.planet}`);
    if (event.sign) descParts.push(`Signo: ${event.sign}`);

    // Añadir interpretación personalizada si existe
    if (event.interpretation && typeof event.interpretation === 'object') {
      const interp = event.interpretation as any;
      descParts.push('');

      // EventInterpretation personalizada (V3 - máxima prioridad)
      if (interp.para_ti_especificamente) {
        descParts.push(`🌟 Para ti: ${interp.para_ti_especificamente}`);
      }
      if (interp.tu_fortaleza_a_usar) {
        const f = interp.tu_fortaleza_a_usar;
        if (f.fortaleza) descParts.push(`💪 Tu fortaleza: ${f.fortaleza}`);
        if (f.como_usarla) descParts.push(`   Cómo usarla: ${f.como_usarla}`);
      }
      if (interp.tu_bloqueo_a_trabajar) {
        const b = interp.tu_bloqueo_a_trabajar;
        if (b.bloqueo) descParts.push(`🔓 Bloqueo a trabajar: ${b.bloqueo}`);
        if (b.reframe) descParts.push(`   Reframe: ${b.reframe}`);
      }
      if (interp.consejo_especifico) descParts.push(`🔧 Consejo: ${interp.consejo_especifico}`);
      if (interp.ejercicio_para_ti) descParts.push(`📝 Ejercicio: ${interp.ejercicio_para_ti}`);
      if (interp.mantra_personalizado) descParts.push(`✨ Mantra: ${interp.mantra_personalizado}`);
      if (interp.timing_evolutivo) {
        const t = interp.timing_evolutivo;
        if (t.que_sembrar) descParts.push(`🌱 Qué sembrar: ${t.que_sembrar}`);
        if (t.cuando_actuar) descParts.push(`⏰ Cuándo actuar: ${t.cuando_actuar}`);
        if (t.resultado_esperado) descParts.push(`🎯 Resultado esperado: ${t.resultado_esperado}`);
      }

      // V2 batch: que_se_activa, como_se_siente, consejo, advertencias, mantra
      if (interp.que_se_activa) descParts.push(`🔥 Qué se activa: ${interp.que_se_activa}`);
      if (interp.como_se_siente) {
        const cs = Array.isArray(interp.como_se_siente) ? interp.como_se_siente.join(', ') : interp.como_se_siente;
        descParts.push(`🧠 Cómo se siente: ${cs}`);
      }
      if (interp.consejo && !interp.consejo_especifico) {
        const c = Array.isArray(interp.consejo) ? interp.consejo.join(', ') : interp.consejo;
        descParts.push(`🔧 Consejo: ${c}`);
      }
      if (interp.ritual_breve) descParts.push(`🕯️ Ritual: ${interp.ritual_breve}`);
      if (interp.oportunidades) {
        const o = Array.isArray(interp.oportunidades) ? interp.oportunidades.join(', ') : interp.oportunidades;
        descParts.push(`🌟 Oportunidades: ${o}`);
      }
      if (interp.advertencias) {
        const a = Array.isArray(interp.advertencias) ? interp.advertencias.join(', ') : interp.advertencias;
        descParts.push(`⚠️ Advertencias: ${a}`);
      }
      if (interp.mantra && !interp.mantra_personalizado) descParts.push(`✨ Mantra: ${interp.mantra}`);
      if (interp.pregunta_clave) descParts.push(`🔖 Pregunta clave: ${interp.pregunta_clave}`);

      // V1: mensaje_sintesis, como_te_afecta, sintesis_practica, accion_concreta, frase_ancla
      if (interp.mensaje_sintesis) descParts.push(`🔥 Síntesis: ${interp.mensaje_sintesis}`);
      if (interp.como_te_afecta) descParts.push(`🧠 Cómo te afecta: ${interp.como_te_afecta}`);
      if (interp.sintesis_practica) descParts.push(`🔧 Práctica: ${interp.sintesis_practica}`);
      if (interp.accion_concreta) descParts.push(`✏️ Acción concreta: ${interp.accion_concreta}`);
      if (interp.frase_ancla) descParts.push(`✨ Frase ancla: ${interp.frase_ancla}`);

      // Simple: personalMeaning, actionSteps, warnings
      if (interp.personalMeaning) descParts.push(`💡 Significado: ${interp.personalMeaning}`);
      if (interp.actionSteps) descParts.push(`📋 Pasos: ${interp.actionSteps}`);
    }

    descParts.push('');
    descParts.push('🌟 Ver tu agenda personalizada:');
    descParts.push('https://www.tuvueltaalsol.es/agenda');
    descParts.push('');
    descParts.push('Generado por Tu Vuelta al Sol — tuvueltaalsol.es');
    const description = descParts.join('\\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${generateUID(event, index)}`);
    lines.push(`DTSTAMP:${timestamp}Z`);
    // Evento de día completo (sin hora específica)
    lines.push(`DTSTART;VALUE=DATE:${formatDateICS(event.date)}`);
    lines.push(`DTEND;VALUE=DATE:${formatDateICS(event.date)}`);
    lines.push(`SUMMARY:${escapeICS(title)}`);
    lines.push(`DESCRIPTION:${escapeICS(description)}`);
    lines.push('URL:https://www.tuvueltaalsol.es/agenda');
    lines.push('TRANSP:TRANSPARENT'); // No bloquea el calendario
    // Recordatorio 9h de la mañana
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER;VALUE=DATE-TIME:' + formatDateICS(event.date) + 'T090000');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeICS(title)}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Convierte eventos del SolarCycle (AstrologicalEvent[]) al formato CalendarEvent
 */
export function convertEventsForCalendar(events: any[]): CalendarEvent[] {
  return events
    .filter(e => e && e.date && e.title)
    .map(event => ({
      title: event.title,
      date: event.date,
      description: event.description || '',
      type: event.type || '',
      planet: event.planet || '',
      sign: event.sign || '',
      interpretation: event.interpretation && typeof event.interpretation === 'object'
        ? event.interpretation
        : undefined,
    }));
}

/**
 * Genera y descarga un archivo .ics en el navegador
 */
export function downloadICS(events: CalendarEvent[], fileName?: string): void {
  const content = generateICSContent(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'tu-vuelta-al-sol-agenda.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
