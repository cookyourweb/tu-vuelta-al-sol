// src/services/agendaGenerator.ts

// =============================================================================
// 📅 GENERADOR DE AGENDA MENSUAL (Layer 3 - Funcional)
// =============================================================================
// Genera agenda personalizada con rituales y ejercicios basados en
// las comparaciones planetarias. NO requiere objetos físicos.
// =============================================================================

import type {
  ComparacionPlanetaria,
  AgendaMensual,
  EjercicioPersonalizado,
  RitualPractico,
  GuiaLunar
} from '@/types/astrology/interpretation';

// =============================================================================
// 📅 FUNCIÓN PRINCIPAL: GENERAR AGENDA DEL MES
// =============================================================================

export function generarAgendaMensual(
  comparacion: ComparacionPlanetaria,
  planeta: string,
  mes: string
): AgendaMensual {

  const ejercicios = generarEjerciciosPersonalizados(comparacion, planeta);
  const rituales = generarRitualesPracticos(comparacion, planeta);
  const guias_lunares = generarGuiasLunares(comparacion, planeta);

  return {
    mes,
    planeta_activo: planeta,
    entrenamiento_principal: comparacion.que_hacer,
    frase_clave: comparacion.frase_clave,
    error_evitar: comparacion.error_automatico,
    rituales,
    ejercicios,
    guias_lunares
  };
}

// =============================================================================
// 📝 GENERAR 5 TIPOS DE EJERCICIOS PERSONALIZADOS
// =============================================================================

function generarEjerciciosPersonalizados(
  comparacion: ComparacionPlanetaria,
  planeta: string
): EjercicioPersonalizado[] {

  const ejercicios: EjercicioPersonalizado[] = [];

  // 1️⃣ EJERCICIO DE CONCIENCIA (Journaling)
  ejercicios.push({
    tipo: 'conciencia',
    titulo: `Diario de ${planeta}: Conciencia del patrón`,
    instrucciones: `
Cada noche, escribe en tu diario:

1. ¿Hoy caí en el error automático? ("${comparacion.error_automatico}")
   - Sí/No
   - ¿Cómo lo noté?

2. ¿Pude aplicar la acción entrenada?
   - "${comparacion.que_hacer.substring(0, 80)}..."
   - ¿Qué pasó?

3. Escribe tu frase clave del día:
   "${comparacion.frase_clave}"

⏱️ 5 minutos al día.
    `.trim(),
    duracion: '5 minutos',
    cuando_hacerlo: 'Cada noche antes de dormir'
  });

  // 2️⃣ ACCIÓN GUIADA (Micro-acción)
  ejercicios.push({
    tipo: 'accion_guiada',
    titulo: `Micro-acción de ${planeta}`,
    instrucciones: `
Elige UNA micro-acción concreta basada en tu entrenamiento:

"${comparacion.que_hacer.substring(0, 150)}..."

Esta semana, tu micro-acción es:
1. Identifica UNA situación donde normalmente actuarías como siempre (natal)
2. Pausa 3 segundos antes de actuar
3. Pregúntate: "¿Qué haría si estuviera entrenando esto?"
4. Actúa diferente, aunque sea imperfecto

NO necesitas hacerlo perfecto. Solo DIFERENTE.

⏱️ 1 micro-acción por semana mínimo.
    `.trim(),
    duracion: '2 minutos',
    cuando_hacerlo: 'Al menos 1 vez por semana'
  });

  // 3️⃣ MANTRA FUNCIONAL (Corrección conductual)
  ejercicios.push({
    tipo: 'mantra_funcional',
    titulo: `Mantra de ${planeta}`,
    instrucciones: `
Tu mantra NO es para "atraer", es para RECORDAR.

Cuando notes que estás cayendo en:
"${comparacion.error_automatico}"

Di en voz alta o mentalmente:
"${comparacion.frase_clave}"

Luego pregúntate:
"¿Qué haría ahora si esto fuera verdad?"

Y actúa.

⏱️ Usar cuando notes el patrón automático.
    `.trim(),
    duracion: '30 segundos',
    cuando_hacerlo: 'Cuando notes el error automático'
  });

  // 4️⃣ MEDITACIÓN BREVE (Funcional, no mística)
  ejercicios.push({
    tipo: 'meditacion',
    titulo: `Anclaje de ${planeta} (2 min)`,
    instrucciones: `
Esta NO es una meditación "espiritual". Es un ANCLAJE MENTAL.

Pasos:
1. Siéntate cómodamente
2. Respira profundo 3 veces
3. Repite mentalmente tu frase clave:
   "${comparacion.frase_clave}"
4. Visualiza una situación concreta donde aplicarás esto HOY
5. Observa cómo tu cuerpo responde a esa imagen
6. Abre los ojos y actúa

⏱️ 2 minutos, preferiblemente por la mañana.
    `.trim(),
    duracion: '2 minutos',
    cuando_hacerlo: 'Cada mañana o antes de situaciones clave'
  });

  // 5️⃣ PREGUNTA DE INTEGRACIÓN (Reflexión)
  ejercicios.push({
    tipo: 'pregunta_integracion',
    titulo: `Pregunta semanal de ${planeta}`,
    instrucciones: `
Cada domingo, reflexiona sobre esta pregunta:

"Esta semana, ¿en qué momento actué desde mi natal en lugar de entrenar mi SR?"

Específicamente:
- Natal: ${comparacion.natal.posicion}
  ("${comparacion.natal.descripcion.substring(0, 80)}...")

- SR: ${comparacion.solar_return.posicion}
  ("${comparacion.solar_return.descripcion.substring(0, 80)}...")

Escribe:
1. El momento específico
2. Por qué elegí actuar desde el patrón natal
3. Qué habría pasado si hubiera entrenado el SR
4. Qué haré diferente la próxima semana

⏱️ 10 minutos cada domingo.
    `.trim(),
    duracion: '10 minutos',
    cuando_hacerlo: 'Cada domingo'
  });

  return ejercicios;
}

// =============================================================================
// 🌙 GENERAR RITUALES PRÁCTICOS (Sin objetos)
// =============================================================================

function generarRitualesPracticos(
  comparacion: ComparacionPlanetaria,
  planeta: string
): RitualPractico[] {

  const rituales: RitualPractico[] = [];

  // 🌑 RITUAL LUNA NUEVA (Inicio)
  rituales.push({
    nombre: `Ritual Luna Nueva - ${planeta}`,
    duracion: '2 minutos',
    pasos: [
      'Siéntate en silencio',
      'Respira profundo 3 veces',
      `Repite: "${comparacion.frase_clave}"`,
      'Define UNA acción concreta para este ciclo lunar',
      'Escribe esa acción en tu agenda',
      'Comprométete en voz alta'
    ],
    frase_mental: comparacion.frase_clave,
    cuando: 'luna_nueva'
  });

  // 🌕 RITUAL LUNA LLENA (Revisión)
  rituales.push({
    nombre: `Ritual Luna Llena - ${planeta}`,
    duracion: '2 minutos',
    pasos: [
      'Revisa tu acción de Luna Nueva',
      '¿La cumpliste? Sí/No (sin juicio)',
      `¿Caíste en: "${comparacion.error_automatico}"?`,
      'Respira profundo y suelta lo que no funcionó',
      'Define QUÉ ajustarás para el próximo ciclo',
      'Escríbelo'
    ],
    frase_mental: 'Suelto lo que no sirve. Ajusto lo que sí.',
    cuando: 'luna_llena'
  });

  // 📅 RITUAL SEMANAL (Check-in)
  rituales.push({
    nombre: `Check-in semanal - ${planeta}`,
    duracion: '2 minutos',
    pasos: [
      'Pregúntate: "¿Esta semana actué diferente o igual?"',
      'Identifica UN momento donde notaste el patrón',
      '¿Lo cambiaste o lo repetiste?',
      `Repite: "${comparacion.frase_clave}"`,
      'Define UNA micro-acción para la próxima semana'
    ],
    frase_mental: comparacion.frase_clave,
    cuando: 'semanal'
  });

  return rituales;
}

// =============================================================================
// 🌙 GENERAR GUÍAS LUNARES
// =============================================================================

function generarGuiasLunares(
  comparacion: ComparacionPlanetaria,
  planeta: string
): GuiaLunar[] {

  const guias: GuiaLunar[] = [];

  // 🌑 GUÍA LUNA NUEVA
  guias.push({
    tipo: 'luna_nueva',
    titulo: `Luna Nueva: Iniciar desde ${planeta}`,
    que_hacer: comparacion.uso_agenda.luna_nueva,
    ejercicio_sugerido: {
      tipo: 'accion_guiada',
      titulo: 'Acción de Luna Nueva',
      instrucciones: `
${comparacion.uso_agenda.luna_nueva}

Acción concreta:
1. Elige UNA situación donde aplicarás esto
2. Define QUÉ harás diferente
3. Escríbelo
4. Comprométete

⏱️ 5 minutos.
      `.trim(),
      duracion: '5 minutos',
      cuando_hacerlo: 'En las 48h siguientes a Luna Nueva'
    }
  });

  // 🌕 GUÍA LUNA LLENA
  guias.push({
    tipo: 'luna_llena',
    titulo: `Luna Llena: Revisar ${planeta}`,
    que_hacer: comparacion.uso_agenda.luna_llena,
    ejercicio_sugerido: {
      tipo: 'conciencia',
      titulo: 'Revisión de Luna Llena',
      instrucciones: `
${comparacion.uso_agenda.luna_llena}

Reflexión:
1. ¿Qué funcionó desde la última Luna Nueva?
2. ¿Qué no funcionó?
3. ¿Estás evitando algo? (sé honesto/a)
4. ¿Qué soltarás para el próximo ciclo?

⏱️ 5 minutos.
      `.trim(),
      duracion: '5 minutos',
      cuando_hacerlo: 'En las 48h siguientes a Luna Llena'
    }
  });

  return guias;
}

// =============================================================================
// 📅 GENERAR AGENDAS PARA TODO EL AÑO
// =============================================================================

export function generarAgendasAnuales(
  comparaciones: Record<string, ComparacionPlanetaria>,
  meses: string[]
): AgendaMensual[] {

  const agendas: AgendaMensual[] = [];
  const planetas = Object.keys(comparaciones);

  meses.forEach((mes, index) => {
    const planetaIndex = index % planetas.length;
    const planeta = planetas[planetaIndex];
    const comparacion = comparaciones[planeta];

    if (comparacion) {
      const agenda = generarAgendaMensual(comparacion, planeta, mes);
      agendas.push(agenda);
    }
  });

  return agendas;
}
