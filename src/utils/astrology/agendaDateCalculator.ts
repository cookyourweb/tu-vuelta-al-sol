// src/utils/agendaDateCalculator.ts - CORREGIDO PARA CUMPLEAÑOS A CUMPLEAÑOS
// ✅ PROBLEMA RESUELTO: Ahora calcula desde último cumpleaños hasta próximo

export interface AgendaPeriod {
  startDate: string;
  endDate: string;
  currentAge: number;
  nextAge: number;
  lastBirthday: string;
  nextBirthday: string;
  isCurrentYearComplete: boolean;
  daysUntilBirthday: number;
  daysSinceLastBirthday: number;
  progressPercentage: number; // % del año astrológico completado
}

/**
 * 🎯 FUNCIÓN PRINCIPAL: Calcular período de agenda COMPLETO
 * ✅ CORREGIDO: Desde último cumpleaños hasta próximo cumpleaños
 */
export function calculateAgendaPeriod(birthDate: string): AgendaPeriod {
  const today = new Date();
  const birth = new Date(birthDate);
  
  console.log('📅 Calculando período desde último cumpleaños hasta próximo...');
  
  // Calcular edad actual
  const currentAge = calculateCurrentAge(birth, today);
  
  // ✅ CALCULAR ÚLTIMO CUMPLEAÑOS (inicio del período)
  const lastBirthday = calculateLastBirthday(birth, today);
  
  // ✅ CALCULAR PRÓXIMO CUMPLEAÑOS (final del período)
  const nextBirthday = calculateNextBirthday(birth, today);
  
  // Período de agenda: desde último cumpleaños hasta próximo cumpleaños
  const startDate = lastBirthday.toISOString().split('T')[0];
  const endDate = nextBirthday.toISOString().split('T')[0];
  
  // Calcular días y progreso
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const daysSinceLastBirthday = Math.floor(
    (today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const totalYearDays = Math.floor(
    (nextBirthday.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const progressPercentage = Math.round((daysSinceLastBirthday / totalYearDays) * 100);
  
  const result: AgendaPeriod = {
    startDate,
    endDate,
    currentAge,
    nextAge: currentAge + 1,
    lastBirthday: startDate,
    nextBirthday: endDate,
    isCurrentYearComplete: daysUntilBirthday <= 0,
    daysUntilBirthday: Math.max(0, daysUntilBirthday),
    daysSinceLastBirthday: Math.max(0, daysSinceLastBirthday),
    progressPercentage
  };
  
  console.log('🎂 Período calculado:', {
    período: `${startDate} → ${endDate}`,
    edad: `${currentAge} → ${currentAge + 1} años`,
    progreso: `${progressPercentage}% del año astrológico`,
    días: {
      desde_cumpleaños: daysSinceLastBirthday,
      hasta_próximo: daysUntilBirthday
    }
  });
  
  return result;
}

/**
 * ✅ NUEVA FUNCIÓN: Calcular último cumpleaños (inicio del período)
 */
function calculateLastBirthday(birthDate: Date, today: Date): Date {
  const thisYear = today.getFullYear();
  const thisYearBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  
  // Si el cumpleaños de este año ya pasó, usar ese
  if (thisYearBirthday <= today) {
    return thisYearBirthday;
  } else {
    // Si aún no ha llegado, usar el del año anterior
    return new Date(thisYear - 1, birthDate.getMonth(), birthDate.getDate());
  }
}

/**
 * Calcular próximo cumpleaños (final del período)
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
 * 🎯 PROMPT PARA IA con información contextual MEJORADA
 */
export function generateAIPromptContext(
  agendaPeriod: AgendaPeriod,
  birthDate: string
): string {
  const { 
    currentAge, 
    nextAge, 
    daysUntilBirthday, 
    daysSinceLastBirthday, 
    progressPercentage,
    startDate, 
    endDate 
  } = agendaPeriod;
  
  return `
CONTEXTO TEMPORAL DEL USUARIO (PERÍODO ASTROLÓGICO COMPLETO):
- Fecha de nacimiento: ${birthDate}
- Edad actual: ${currentAge} años
- Próxima edad: ${nextAge} años
- Período de agenda: ${startDate} hasta ${endDate} (AÑO ASTROLÓGICO COMPLETO)

PROGRESO DEL AÑO ASTROLÓGICO:
- Días desde último cumpleaños: ${daysSinceLastBirthday}
- Días hasta próximo cumpleaños: ${daysUntilBirthday}
- Progreso del año: ${progressPercentage}% completado

FASE DE VIDA ESPECÍFICA:
${getLifePhaseDescription(nextAge)}

EVENTOS A INCLUIR:
- ✅ Eventos PASADOS: desde ${startDate} hasta HOY
- ✅ Eventos FUTUROS: desde HOY hasta ${endDate}
- ✅ Cobertura total del año astrológico

INSTRUCCIONES PERSONALIZADAS:
1. La edad específica (${nextAge} años) y sus desafíos únicos
2. Las prioridades típicas de esta fase de vida
3. Los eventos tanto pasados como futuros del período
4. El momento actual en el ciclo astrológico (${progressPercentage}% completado)
`;
}

/**
 * Descripción de fase de vida según edad
 */
function getLifePhaseDescription(age: number): string {
  if (age <= 12) {
    return 'Infancia - Descubrimiento del mundo, formación de personalidad básica';
  } else if (age <= 18) {
    return 'Adolescencia - Búsqueda de identidad, amistades, y expresión creativa';
  } else if (age <= 25) {
    return 'Juventud temprana - Independencia, estudios superiores, primeras decisiones importantes';
  } else if (age <= 35) {
    return 'Adultez joven - Establecimiento profesional, relaciones serias, metas a largo plazo';
  } else if (age <= 50) {
    return 'Adultez media - Consolidación profesional, familia, responsabilidades mayores';
  } else if (age <= 65) {
    return 'Madurez - Sabiduría acumulada, mentoría, preparación para nueva etapa';
  } else {
    return 'Edad dorada - Reflexión, transmisión de sabiduría, disfrute de logros';
  }
}