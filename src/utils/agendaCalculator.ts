// src/utils/agendaDateCalculator.ts
export interface AgendaPeriod {
  startDate: string;
  endDate: string;
  currentAge: number;
  nextAge: number;
  nextBirthday: string;
  isCurrentYearComplete: boolean;
  daysUntilBirthday: number;
}

/**
 * 🎯 FUNCIÓN PRINCIPAL: Calcular período de agenda
 * Siempre calcula 1 año completo desde el próximo cumpleaños
 */
export function calculateAgendaPeriod(birthDate: string): AgendaPeriod {
  const today = new Date();
  const birth = new Date(birthDate);
  
  // Calcular edad actual
  const currentAge = calculateCurrentAge(birth, today);
  
  // Calcular próximo cumpleaños
  const nextBirthday = calculateNextBirthday(birth, today);
  
  // Período de agenda: 1 año desde próximo cumpleaños
  const startDate = nextBirthday.toISOString().split('T')[0];
  
  const endDate = new Date(nextBirthday);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Calcular días hasta cumpleaños
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const result: AgendaPeriod = {
    startDate,
    endDate: endDateStr,
    currentAge,
    nextAge: currentAge + 1,
    nextBirthday: startDate,
    isCurrentYearComplete: daysUntilBirthday <= 0,
    daysUntilBirthday: Math.max(0, daysUntilBirthday)
  };
  
  console.log('📅 Período de agenda calculado:', result);
  return result;
}

/**
 * Calcular edad actual
 */
function calculateCurrentAge(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcular próximo cumpleaños
 */
function calculateNextBirthday(birthDate: Date, today: Date): Date {
  const thisYear = today.getFullYear();
  const nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  
  // Si ya pasó el cumpleaños este año, usar el del año siguiente
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(thisYear + 1);
  }
  
  return nextBirthday;
}

/**
 * 🎯 PROMPT PARA IA con información contextual
 */
export function generateAIPromptContext(
  agendaPeriod: AgendaPeriod,
  birthDate: string
): string {
  const { currentAge, nextAge, daysUntilBirthday, startDate, endDate } = agendaPeriod;
  
  return `
CONTEXTO TEMPORAL DEL USUARIO:
- Fecha de nacimiento: ${birthDate}
- Edad actual: ${currentAge} años
- Próxima edad: ${nextAge} años
- Días hasta cumpleaños: ${daysUntilBirthday}
- Período de agenda: ${startDate} a ${endDate}

FASE DE VIDA:
${getLifePhaseDescription(nextAge)}

INSTRUCCIONES:
Personaliza todas las interpretaciones considerando:
1. La edad específica (${nextAge} años)
2. Las prioridades típicas de esta fase de vida
3. Los desafíos y oportunidades de esta edad
4. El contexto temporal del período de la agenda

Haz las interpretaciones relevantes para alguien de ${nextAge} años.
`;
}

/**
 * Descripción de fase de vida según la edad
 */
function getLifePhaseDescription(age: number): string {
  if (age < 25) {
    return 'Exploración y establecimiento de identidad';
  } else if (age < 35) {
    return 'Construcción de carrera y relaciones estables';
  } else if (age < 45) {
    return 'Consolidación y crecimiento profesional/familiar';
  } else if (age < 55) {
    return 'Madurez y posible reevaluación de prioridades';
  } else if (age < 65) {
    return 'Preparación para nueva etapa, sabiduría acumulada';
  } else {
    return 'Plenitud, legado y transmisión de experiencia';
  }
}