// =============================================================================
// 🔒 AGENDA ACCESS CONTROL
// src/utils/agendaAccessControl.ts
// =============================================================================
// Controla el acceso a eventos de la agenda según estado de pago
// Estrategia: 2 meses preview gratuito + 10 meses post-pago
// =============================================================================

import { addMonths, isBefore, isAfter, parseISO } from 'date-fns';

// =============================================================================
// TYPES
// =============================================================================

export interface AgendaAccessStatus {
  userId: string;
  hasPaid: boolean;
  previewMonths: number; // Número de meses gratuitos (default: 2)
  purchaseDate?: Date;
  agendaYear: number;
  fullYearUnlocked: boolean;
}

export interface EventWithAccess {
  id: string;
  date: string;
  title: string;
  type: string;
  isLocked: boolean; // true si no tiene acceso
  requiresPurchase: boolean; // true si necesita pagar para ver
}

// =============================================================================
// ACCESS CONTROL FUNCTIONS
// =============================================================================

/**
 * Determina si un usuario tiene acceso a un evento específico
 */
export function hasAccessToEvent(
  eventDate: string | Date,
  birthDate: string | Date,
  status: AgendaAccessStatus
): boolean {
  // Si ya pagó, tiene acceso a todo
  if (status.hasPaid || status.fullYearUnlocked) {
    return true;
  }

  // Calcular fecha límite del preview (birthDate + N meses)
  const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const previewCutoff = addMonths(birthDateObj, status.previewMonths);

  // Convertir eventDate a Date si es string
  const eventDateObj = typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;

  // Tiene acceso si el evento está dentro del periodo de preview
  return isBefore(eventDateObj, previewCutoff) || eventDateObj.getTime() === previewCutoff.getTime();
}

/**
 * Filtra eventos según acceso del usuario
 */
export function filterEventsByAccess<T extends { date: string | Date }>(
  events: T[],
  birthDate: string | Date,
  status: AgendaAccessStatus
): T[] {
  if (status.hasPaid || status.fullYearUnlocked) {
    return events; // Devolver todos si pagó
  }

  // Filtrar solo eventos dentro del periodo de preview
  return events.filter(event =>
    hasAccessToEvent(event.date, birthDate, status)
  );
}

/**
 * Marca eventos como bloqueados/desbloqueados
 */
export function markEventsWithAccessStatus<T extends { id: string; date: string | Date; title: string; type: string }>(
  events: T[],
  birthDate: string | Date,
  status: AgendaAccessStatus
): (T & { isLocked: boolean; requiresPurchase: boolean })[] {

  return events.map(event => ({
    ...event,
    isLocked: !hasAccessToEvent(event.date, birthDate, status),
    requiresPurchase: !status.hasPaid && !status.fullYearUnlocked
  }));
}

/**
 * Obtiene estadísticas de acceso
 */
export function getAccessStats(
  totalEvents: number,
  accessibleEvents: number,
  status: AgendaAccessStatus
): {
  totalEvents: number;
  accessibleEvents: number;
  lockedEvents: number;
  accessPercentage: number;
  previewMonthsRemaining: number;
  message: string;
} {
  const lockedEvents = totalEvents - accessibleEvents;
  const accessPercentage = Math.round((accessibleEvents / totalEvents) * 100);

  let message = '';
  if (status.hasPaid || status.fullYearUnlocked) {
    message = '🎉 Tienes acceso completo a tu agenda anual';
  } else {
    message = `📅 Tienes acceso a ${status.previewMonths} meses de preview. ${lockedEvents} eventos bloqueados.`;
  }

  return {
    totalEvents,
    accessibleEvents,
    lockedEvents,
    accessPercentage,
    previewMonthsRemaining: status.previewMonths,
    message
  };
}

/**
 * Calcula cuántos eventos se generarán con AI según el estado de pago
 */
export function calculateAIBudget(
  totalEvents: number,
  status: AgendaAccessStatus
): {
  maxAIInterpretations: number;
  estimatedCost: number;
  message: string;
} {
  if (status.hasPaid || status.fullYearUnlocked) {
    // Año completo: generar AI para todos los eventos importantes
    const aiEvents = Math.ceil(totalEvents * 0.4); // 40% con AI (lunas, eclipses, retrógrados)
    return {
      maxAIInterpretations: aiEvents,
      estimatedCost: aiEvents * 0.12, // $0.12 por evento AI promedio
      message: `🤖 Generando ${aiEvents} interpretaciones AI para tu agenda completa`
    };
  } else {
    // Preview: solo eventos de los primeros 2 meses
    const previewEvents = Math.ceil(totalEvents * (status.previewMonths / 12));
    const aiEvents = Math.min(20, Math.ceil(previewEvents * 0.6)); // Máximo 20 eventos AI en preview
    return {
      maxAIInterpretations: aiEvents,
      estimatedCost: aiEvents * 0.12,
      message: `🎁 Generando ${aiEvents} interpretaciones AI para tu preview de ${status.previewMonths} meses`
    };
  }
}

/**
 * Crea un estado de acceso por defecto (preview gratuito)
 */
export function createDefaultAccessStatus(
  userId: string,
  agendaYear: number
): AgendaAccessStatus {
  return {
    userId,
    hasPaid: false,
    previewMonths: 2, // 2 meses de preview por defecto
    agendaYear,
    fullYearUnlocked: false
  };
}

/**
 * Crea un estado de acceso pagado (año completo)
 */
export function createPaidAccessStatus(
  userId: string,
  agendaYear: number,
  purchaseDate: Date
): AgendaAccessStatus {
  return {
    userId,
    hasPaid: true,
    previewMonths: 12, // Acceso completo
    purchaseDate,
    agendaYear,
    fullYearUnlocked: true
  };
}

// =============================================================================
// UI HELPERS
// =============================================================================

/**
 * Genera mensaje de bloqueo para eventos no accesibles
 */
export function getLockedEventMessage(
  eventDate: string | Date,
  eventTitle: string
): {
  title: string;
  message: string;
  cta: string;
} {
  return {
    title: '🔒 Evento Bloqueado',
    message: `"${eventTitle}" está disponible en la versión completa de tu agenda. Desbloquea todo tu año solar para acceder a interpretaciones personalizadas de todos los eventos astrológicos.`,
    cta: 'Desbloquear Año Completo - 29€'
  };
}

/**
 * Genera mensaje de preview para motivar compra
 */
export function getPreviewExpiryMessage(
  remainingMonths: number,
  totalLockedEvents: number
): {
  title: string;
  message: string;
  cta: string;
} {
  return {
    title: `📅 ${remainingMonths} meses de preview disponibles`,
    message: `Estás viendo interpretaciones AI personalizadas de tus primeros meses. ${totalLockedEvents} eventos más te esperan en tu agenda completa.`,
    cta: 'Ver Año Completo'
  };
}

// =============================================================================
// EXPORT DEFAULT ACCESS LEVELS
// =============================================================================

export const ACCESS_LEVELS = {
  FREE_PREVIEW: {
    months: 2,
    aiEvents: 20,
    description: 'Preview gratuito con interpretaciones AI'
  },
  PAID_FULL: {
    months: 12,
    aiEvents: 999, // Sin límite práctico
    description: 'Acceso completo con todas las interpretaciones AI'
  }
} as const;
