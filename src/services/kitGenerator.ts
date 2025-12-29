// src/services/kitGenerator.ts

// =============================================================================
// 🕯️ GENERADOR DE KITS MENSUALES (Objetos Simbólicos)
// =============================================================================
// Genera kits personalizados (velas, piedras, rituales) basados en
// las comparaciones planetarias Natal vs Solar Return
// =============================================================================

import type {
  ComparacionPlanetaria,
  KitMensual,
  ObjetoSimbolico
} from '@/types/astrology/interpretation';

// =============================================================================
// 🎨 CONFIGURACIÓN DE COLORES Y PIEDRAS POR PLANETA
// =============================================================================

const PLANET_CONFIGS = {
  sol: {
    icon: '☀️',
    vela: {
      color: 'Dorado',
      hex: '#FFD700',
      nombre: 'Vela de Propósito Solar'
    },
    piedra: {
      nombre: 'Citrino',
      descripcion: 'Piedra solar de claridad y propósito'
    }
  },
  luna: {
    icon: '🌙',
    vela: {
      color: 'Blanco plateado',
      hex: '#F8F8FF',
      nombre: 'Vela de Nutrición Lunar'
    },
    piedra: {
      nombre: 'Cuarzo rosa',
      descripcion: 'Piedra de autoempatía y cuidado emocional'
    }
  },
  mercurio: {
    icon: '🗣️',
    vela: {
      color: 'Azul claro',
      hex: '#87CEEB',
      nombre: 'Vela de Claridad Mental'
    },
    piedra: {
      nombre: 'Sodalita',
      descripcion: 'Piedra de mente tranquila y comunicación clara'
    }
  },
  venus: {
    icon: '💚',
    vela: {
      color: 'Rosa',
      hex: '#FFB6C1',
      nombre: 'Vela de Autovaloración'
    },
    piedra: {
      nombre: 'Cuarzo rosa',
      descripcion: 'Piedra de amor propio y valores internos'
    }
  },
  marte: {
    icon: '⚔️',
    vela: {
      color: 'Terracota',
      hex: '#E2725B',
      nombre: 'Vela de Acción Sostenida'
    },
    piedra: {
      nombre: 'Hematita',
      descripcion: 'Piedra de tierra + acción, enraizamiento'
    }
  },
  jupiter: {
    icon: '🎯',
    vela: {
      color: 'Morado',
      hex: '#9370DB',
      nombre: 'Vela de Expansión Consciente'
    },
    piedra: {
      nombre: 'Amatista',
      descripcion: 'Piedra de expansión y confianza'
    }
  },
  saturno: {
    icon: '🏔️',
    vela: {
      color: 'Negro',
      hex: '#2C2C2C',
      nombre: 'Vela de Límites Sanos'
    },
    piedra: {
      nombre: 'Obsidiana',
      descripcion: 'Piedra de estructura y límites claros'
    }
  }
} as const;

type PlanetKey = keyof typeof PLANET_CONFIGS;

// =============================================================================
// 🔥 FUNCIÓN PRINCIPAL: GENERAR KIT DEL MES
// =============================================================================

export function generarKitDelMes(
  comparacion: ComparacionPlanetaria,
  planeta: string,
  mes: string
): KitMensual {

  const planetKey = planeta.toLowerCase() as PlanetKey;
  const config = PLANET_CONFIGS[planetKey];

  if (!config) {
    throw new Error(`Configuración no encontrada para planeta: ${planeta}`);
  }

  // =========================================================================
  // 🕯️ GENERAR VELA
  // =========================================================================
  const vela: ObjetoSimbolico = {
    tipo: 'vela',
    nombre: config.vela.nombre,
    color: config.vela.color,
    descripcion: `Representa tu compromiso con: ${comparacion.que_hacer.substring(0, 80)}...`,
    funcion: `Sellar decisiones relacionadas con ${planeta}`,
    como_usar: 'Enciéndela antes de elegir UNA acción concreta relacionada con este entrenamiento. Apágala tras decidir.',
    cuando_usar: `Cuando notes que estás cayendo en: "${comparacion.error_automatico}"`,
    advertencia: 'No la dejes prendida. La vela no pide, compromete.',
    frase_ancla: comparacion.frase_clave
  };

  // =========================================================================
  // 💎 GENERAR PIEDRA
  // =========================================================================
  const piedra: ObjetoSimbolico = {
    tipo: 'piedra',
    nombre: config.piedra.nombre,
    descripcion: config.piedra.descripcion,
    funcion: `Recordatorio físico de: ${comparacion.frase_clave}`,
    como_usar: 'Llévala SOLO los días que notes resistencia a la acción entrenada. No todos los días.',
    cuando_usar: `Cuando sientas que estás evitando: ${comparacion.que_hacer.substring(0, 60)}...`,
    advertencia: 'Si la llevas siempre, pierde fuerza. Úsala estratégicamente.',
    frase_ancla: comparacion.frase_clave
  };

  // =========================================================================
  // 🧘 GENERAR MICRO-RITUAL
  // =========================================================================
  const microRitual = {
    duracion: '2 minutos',
    pasos: [
      'Sostén la piedra en tu mano',
      'Respira profundo 3 veces',
      'Repite la frase mental en voz baja',
      'Visualiza UNA acción concreta que vas a realizar',
      'Guarda la piedra conscientemente'
    ],
    frase_mental: comparacion.frase_clave
  };

  // =========================================================================
  // 🎁 RETORNAR KIT COMPLETO
  // =========================================================================
  return {
    mes,
    planeta_activo: planeta,
    entrenamiento: comparacion.que_hacer,
    vela,
    piedra,
    micro_ritual: microRitual
  };
}

// =============================================================================
// 📅 GENERAR KITS PARA TODO EL AÑO
// =============================================================================

export function generarKitsAnuales(
  comparaciones: Record<string, ComparacionPlanetaria>,
  meses: string[]
): KitMensual[] {

  const kits: KitMensual[] = [];
  const planetas = Object.keys(comparaciones);

  // Distribuir planetas a lo largo de los meses
  meses.forEach((mes, index) => {
    const planetaIndex = index % planetas.length;
    const planeta = planetas[planetaIndex];
    const comparacion = comparaciones[planeta];

    if (comparacion) {
      const kit = generarKitDelMes(comparacion, planeta, mes);
      kits.push(kit);
    }
  });

  return kits;
}

// =============================================================================
// 🎨 OBTENER COLOR DE VELA POR PLANETA
// =============================================================================

export function obtenerColorVela(planeta: string): string {
  const planetKey = planeta.toLowerCase() as PlanetKey;
  const config = PLANET_CONFIGS[planetKey];
  return config?.vela.hex || '#9370DB';
}

// =============================================================================
// 💎 OBTENER PIEDRA POR PLANETA
// =============================================================================

export function obtenerPiedraPorPlaneta(planeta: string): string {
  const planetKey = planeta.toLowerCase() as PlanetKey;
  const config = PLANET_CONFIGS[planetKey];
  return config?.piedra.nombre || 'Cuarzo';
}

// =============================================================================
// 📦 GENERAR KIT BÁSICO (sin comparaciones - fallback)
// =============================================================================

export function generarKitBasico(planeta: string, mes: string): KitMensual {
  const planetKey = planeta.toLowerCase() as PlanetKey;
  const config = PLANET_CONFIGS[planetKey];

  if (!config) {
    throw new Error(`Configuración no encontrada para planeta: ${planeta}`);
  }

  const vela: ObjetoSimbolico = {
    tipo: 'vela',
    nombre: config.vela.nombre,
    color: config.vela.color,
    descripcion: `Vela enfocada en la energía de ${planeta}`,
    funcion: `Trabajar con la energía de ${planeta}`,
    como_usar: 'Enciéndela durante 5 minutos mientras reflexionas sobre esta energía.',
    cuando_usar: 'Al inicio de cada semana o cuando necesites conectar con esta energía',
    frase_ancla: `Honro la energía de ${planeta} en mi vida`
  };

  const piedra: ObjetoSimbolico = {
    tipo: 'piedra',
    nombre: config.piedra.nombre,
    descripcion: config.piedra.descripcion,
    funcion: `Conectar con la energía de ${planeta}`,
    como_usar: 'Llévala contigo cuando necesites esta energía.',
    cuando_usar: 'En momentos relacionados con las áreas de vida de este planeta',
    frase_ancla: `${planeta} me guía`
  };

  return {
    mes,
    planeta_activo: planeta,
    entrenamiento: `Trabajar con la energía de ${planeta}`,
    vela,
    piedra,
    micro_ritual: {
      duracion: '2 minutos',
      pasos: [
        'Sostén la piedra',
        'Respira profundo 3 veces',
        'Conecta con la energía del planeta',
        'Establece una intención',
        'Guarda la piedra'
      ],
      frase_mental: `Honro la energía de ${planeta}`
    }
  };
}
