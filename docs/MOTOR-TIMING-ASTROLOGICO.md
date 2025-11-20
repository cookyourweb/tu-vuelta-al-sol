# 🌟 MOTOR DE TIMING ASTROLÓGICO - SISTEMA DE SCORING

## 📋 OBJETIVO

Calcular para CADA DÍA del año un **SCORE DE ACCIÓN** que determine:
- ✅ Días ÓPTIMOS para acción/manifestación (magnificar ejercicios)
- ⚡ Días de PODER MÁXIMO (múltiples factores alineados)
- ⏸️ Días de REVISIÓN (retrogradaciones activas)
- ❌ Días de PAUSA (evitar decisiones importantes)

---

## 🔢 FACTORES QUE AFECTAN EL SCORE

### **1. RETROGRADACIONES** (Peso: -20 a -50 puntos cada una)

```javascript
const retrogradaciones = {
  // PLANETAS PERSONALES (afectan día a día)
  mercurio_retro: {
    peso: -30,
    que_evitar: [
      "Firmar contratos",
      "Lanzar productos/servicios",
      "Comprar tecnología/vehículos",
      "Iniciar cursos/formaciones",
      "Enviar emails importantes",
      "Tomar decisiones de comunicación"
    ],
    que_magnificar: [
      "Revisar proyectos pasados",
      "Re-editar contenido antiguo",
      "Re-conectar con clientes antiguos",
      "Re-negociar contratos existentes",
      "Hacer backup de información",
      "Journaling profundo"
    ],
    periodo_sombra_pre: -14, // 14 días antes (afecta -10 puntos)
    periodo_sombra_post: +14 // 14 días después (afecta -10 puntos)
  },

  venus_retro: {
    peso: -40,
    que_evitar: [
      "Iniciar relación romántica nueva",
      "Casarse / comprometerse",
      "Cirugía estética",
      "Compras grandes (casa, coche, joyería)",
      "Lanzar producto de belleza/lujo",
      "Cambiar imagen personal drástico"
    ],
    que_magnificar: [
      "Revisar valores personales",
      "Sanar relaciones pasadas (cerrar ciclos)",
      "Re-evaluar finanzas",
      "Re-conectar con exs (para cierre, no para volver)",
      "Terapia de pareja (revisar patrones)",
      "Ritual de amor propio profundo"
    ],
    periodo_sombra_pre: -21,
    periodo_sombra_post: +21
  },

  marte_retro: {
    peso: -35,
    que_evitar: [
      "Iniciar proyectos nuevos grandes",
      "Cirugía (especialmente invasiva)",
      "Confrontaciones importantes",
      "Inversiones financieras arriesgadas",
      "Iniciar rutina ejercicio nueva intensa"
    ],
    que_magnificar: [
      "Re-estrategizar plan de acción",
      "Revisar uso de energía/tiempo",
      "Fortalecer proyectos existentes",
      "Trabajar ira/frustración acumulada",
      "Descanso activo / recuperación"
    ],
    periodo_sombra_pre: -30,
    periodo_sombra_post: +30
  },

  // PLANETAS SOCIALES
  jupiter_retro: {
    peso: -15,
    que_evitar: [
      "Expandir demasiado rápido",
      "Sobre-prometer",
      "Inversiones especulativas grandes"
    ],
    que_magnificar: [
      "Consolidar crecimiento existente",
      "Revisar creencias limitantes",
      "Estudiar filosofía/espiritualidad profundo"
    ]
  },

  saturno_retro: {
    peso: -20,
    que_evitar: [
      "Evitar responsabilidades",
      "Saltar límites necesarios"
    ],
    que_magnificar: [
      "Revisar estructuras de vida",
      "Fortalecer disciplina",
      "Sanar relación con autoridad/padre",
      "Construir fundaciones sólidas"
    ]
  },

  // PLANETAS EXTERNOS (afectan menos día a día, más generacional)
  urano_retro: { peso: -5 },
  neptuno_retro: { peso: -5 },
  pluton_retro: { peso: -10 }
};
```

### **2. FASES LUNARES** (Peso: -10 a +30 puntos)

```javascript
const fasesLunares = {
  luna_nueva: {
    peso: +25,
    ventana: "0-48 horas post exacta",
    que_magnificar: [
      "Plantar intenciones nuevas",
      "Iniciar proyectos",
      "Rituales de manifestación",
      "Compromisos con uno mismo"
    ],
    peso_fuera_ventana: +10 // Si estás en fase creciente pero no en ventana óptima
  },

  luna_creciente: {
    peso: +15,
    periodo: "Luna Nueva → Luna Llena (14 días)",
    que_magnificar: [
      "Construir momentum",
      "Acción sostenida",
      "Nutrición de intenciones",
      "Visibilidad creciente"
    ]
  },

  luna_llena: {
    peso: +20, // Para liberación/culminación
    ventana: "24 horas antes y después de exacta",
    que_magnificar: [
      "Rituales de liberación",
      "Soltar lo que no sirve",
      "Celebrar logros",
      "Revelaciones/insights"
    ],
    peso_fuera_ventana: -5 // Energía puede ser intensa/caótica
  },

  luna_menguante: {
    peso: 0, // Neutral para acción externa
    periodo: "Luna Llena → Luna Nueva (14 días)",
    que_magnificar: [
      "Descanso",
      "Integración",
      "Cierre de ciclos",
      "Preparación para siguiente ciclo"
    ],
    peso_para_liberacion: +15 // Bueno para soltar
  },

  luna_oscura: {
    peso: -15, // 3 días antes de Luna Nueva
    periodo: "72 horas antes de Luna Nueva",
    que_evitar: [
      "Iniciar cosas importantes",
      "Decisiones grandes"
    ],
    que_magnificar: [
      "Descanso profundo",
      "Meditación",
      "Rendición",
      "Trabajo en sombras"
    ]
  }
};
```

### **3. ECLIPSES** (Peso: -30 a +40 puntos según tipo y relación con carta)

```javascript
const eclipses = {
  eclipse_solar: {
    peso_en_ventana: +40, // Si cae en casa importante de tu carta
    peso_fuera_ventana: -20, // Evitar ventana ±3 días si NO es en casa relevante

    ventana_optima: "8 horas post eclipse exacto",

    que_magnificar: [
      "Intenciones MAYORES (6 meses de poder)",
      "Inicios importantes alineados con casa donde cae",
      "Rituales de transformación profunda"
    ],

    que_evitar: [
      "Si cae en casa NO relevante: evitar decisiones ±3 días",
      "Expectativas rígidas (eclipses traen sorpresas)"
    ],

    poder_por_casa: {
      casa_1: +40, // Identidad
      casa_7: +40, // Relaciones
      casa_10: +40, // Carrera
      casa_4: +35, // Hogar/familia
      casa_2: +30, // Dinero
      casa_8: +30, // Transformación/intimidad
      // ... otras casas +15 a +25
    }
  },

  eclipse_lunar: {
    peso_en_ventana: +35, // Para liberación profunda
    peso_fuera_ventana: -15,

    ventana_optima: "24 horas durante eclipse",

    que_magnificar: [
      "Liberación PROFUNDA (soltar grandes)",
      "Revelaciones emocionales",
      "Rituales de cierre de ciclos mayores"
    ],

    poder_por_casa: {
      casa_8: +40, // Máximo poder transformación
      casa_12: +40, // Máximo poder liberación espiritual
      casa_4: +35, // Liberación patrones familiares
      // ... otras casas
    }
  }
};
```

### **4. ASPECTOS IMPORTANTES** (Peso: -20 a +30 puntos)

```javascript
const aspectos = {
  // ASPECTOS ARMÓNICOS (favorables)
  trigono: {
    peso: +20,
    planetas_clave: {
      "Venus-Jupiter": +30, // Máxima abundancia/amor
      "Sol-Jupiter": +25, // Expansión personal
      "Luna-Venus": +20, // Bienestar emocional
      "Mercurio-Jupiter": +20, // Comunicación expansiva
      "Venus-Saturno": +15 // Amor maduro/compromisos
    }
  },

  sextil: {
    peso: +15,
    nota: "Oportunidad disponible, requiere acción"
  },

  conjuncion: {
    peso: +25, // Si planetas compatibles
    peso_negativo: -15, // Si planetas incompatibles
    combinaciones_poder: {
      "Sol-Venus": +30, // Amor propio
      "Sol-Jupiter": +30, // Confianza
      "Luna-Venus": +25, // Nutrición emocional
      "Mercurio-Sol": +30, // Cazimi (máximo poder mental)
      "Venus-Jupiter": +30, // Abundancia máxima
      "Marte-Pluton": -20 // Poder intenso pero peligroso
    }
  },

  // ASPECTOS TENSOS (desafiantes)
  cuadratura: {
    peso: -15,
    nota: "Energía disponible pero requiere trabajo consciente",
    que_magnificar: [
      "Trabajo interno profundo",
      "Confrontar bloqueos",
      "Terapia/coaching"
    ],
    que_evitar: [
      "Confrontaciones innecesarias",
      "Decisiones impulsivas"
    ]
  },

  oposicion: {
    peso: -10,
    nota: "Polaridades a integrar",
    que_magnificar: [
      "Ver perspectivas opuestas",
      "Integración de sombras",
      "Negociación/balance"
    ]
  }
};
```

### **5. CAZIMI** (Peso: +50 puntos - MÁXIMO PODER)

```javascript
const cazimi = {
  descripcion: "Planeta a menos de 17 minutos del Sol",
  peso: +50,
  poder: "MÁXIMO - El planeta está 'en el corazón del Sol'",

  planetas_cazimi: {
    mercurio: {
      ocurre: "3x año (aprox)",
      duracion: "~2 horas ventana exacta",
      que_magnificar: [
        "Decisiones mentales importantes",
        "Firmar contratos (si Mercurio directo)",
        "Lanzar comunicaciones",
        "Negociaciones clave",
        "Estudiar/aprender intensamente"
      ],
      poder_extra_si_directo: +20 // Total +70 si Mercurio directo
    },

    venus: {
      ocurre: "1x cada 19 meses (aprox)",
      duracion: "~6 horas ventana",
      que_magnificar: [
        "Declaraciones de amor",
        "Propuestas matrimonio",
        "Lanzar productos de belleza/lujo",
        "Ritual de amor propio máximo",
        "Manifestar dinero/abundancia"
      ]
    },

    marte: {
      ocurre: "1x cada 2 años (aprox)",
      duracion: "~8 horas ventana",
      que_magnificar: [
        "Iniciar proyectos de acción",
        "Competiciones/desafíos",
        "Ejercicio intenso",
        "Tomar iniciativa en amor/carrera"
      ]
    }
  }
};
```

### **6. NODOS LUNARES** (Peso: +15 a +30 según cercanía)

```javascript
const nodosLunares = {
  transito_sobre_nodo_norte: {
    peso: +30,
    descripcion: "Planeta tránsito conjunción Nodo Norte natal",
    que_magnificar: [
      "Acciones alineadas con propósito",
      "Salir zona confort",
      "Desarrollar nuevas cualidades",
      "Seguir intuición de 'sí, aunque da miedo'"
    ]
  },

  transito_sobre_nodo_sur: {
    peso: +20, // Para liberación consciente
    descripcion: "Planeta tránsito conjunción Nodo Sur natal",
    que_magnificar: [
      "Soltar talentos que ya dominaste",
      "Agradecer lecciones pasadas",
      "Liberar apegos",
      "Cerrar capítulos kármicos"
    ],
    que_evitar: [
      "Caer en patrones viejos",
      "Zona confort disfrazada de 'lo que sé hacer'"
    ]
  },

  eclipse_eje_nodal: {
    peso: +40,
    descripcion: "Eclipse cae en tu eje de Nodos Lunares",
    poder: "MÁXIMO - Destino activado",
    duracion_efecto: "6 meses",
    que_magnificar: [
      "Ajustes mayores de vida alineados con propósito",
      "Dejar ir (Nodo Sur) y abrazar (Nodo Norte) simultáneamente"
    ]
  }
};
```

### **7. INGRESOS PLANETARIOS** (Peso: +10 a +25 según planeta)

```javascript
const ingresosPlanetarios = {
  descripcion: "Planeta entra en nuevo signo",

  ingreso_jupiter: {
    peso: +25,
    duracion_efecto: "~1 año",
    que_magnificar: [
      "Primera semana del ingreso: ritual de bienvenida",
      "Manifestar en área de casa donde entra",
      "Expandir en esa área"
    ]
  },

  ingreso_saturno: {
    peso: +20,
    duracion_efecto: "~2.5 años",
    que_magnificar: [
      "Construir estructura en casa donde entra",
      "Compromisos de largo plazo",
      "Madurez en esa área"
    ]
  },

  ingreso_pluton: {
    peso: +30,
    duracion_efecto: "~20 años",
    poder: "GENERACIONAL - Define época",
    que_magnificar: [
      "Transformación profunda en casa donde entra",
      "Dejar morir lo viejo en esa área",
      "Prepararse para renacimiento"
    ]
  }
};
```

---

## 🧮 ALGORITMO DE CÁLCULO DE SCORE

```javascript
function calcularScoreDia(fecha, cartaNatal) {
  let score = 50; // Base neutral
  let factores = [];
  let advertencias = [];
  let magnificaciones = [];

  // ============================================
  // 1. RETROGRADACIONES (más peso)
  // ============================================
  const retrogradosActivos = obtenerRetrogradosActivos(fecha);

  retrogradosActivos.forEach(retro => {
    score += retrogradaciones[retro.planeta].peso;

    // Agregar a advertencias
    advertencias.push({
      tipo: "retrogrado",
      planeta: retro.planeta,
      que_evitar: retrogradaciones[retro.planeta].que_evitar,
      que_magnificar: retrogradaciones[retro.planeta].que_magnificar
    });

    factores.push(`${retro.planeta} retrógrado (-${Math.abs(retrogradaciones[retro.planeta].peso)} pts)`);
  });

  // Sombras pre/post retrogrado
  const sombras = obtenerPeriodosSombra(fecha);
  sombras.forEach(sombra => {
    score -= 10;
    factores.push(`${sombra.planeta} en sombra ${sombra.tipo} (-10 pts)`);
  });

  // ============================================
  // 2. FASES LUNARES
  // ============================================
  const faseLunar = obtenerFaseLunar(fecha);

  if (faseLunar.tipo === "luna_nueva" && faseLunar.dentroVentana) {
    score += fasesLunares.luna_nueva.peso;
    magnificaciones.push({
      tipo: "luna_nueva",
      poder: "ALTO",
      que_hacer: fasesLunares.luna_nueva.que_magnificar,
      casa_activada: calcularCasaNatal(faseLunar.signo, cartaNatal)
    });
    factores.push(`Luna Nueva en ${faseLunar.signo} (+${fasesLunares.luna_nueva.peso} pts)`);
  } else if (faseLunar.tipo === "luna_llena" && faseLunar.dentroVentana) {
    score += fasesLunares.luna_llena.peso;
    magnificaciones.push({
      tipo: "luna_llena",
      poder: "ALTO",
      que_hacer: fasesLunares.luna_llena.que_magnificar
    });
    factores.push(`Luna Llena en ${faseLunar.signo} (+${fasesLunares.luna_llena.peso} pts)`);
  } else if (faseLunar.tipo === "creciente") {
    score += fasesLunares.luna_creciente.peso;
    factores.push(`Luna Creciente (+${fasesLunares.luna_creciente.peso} pts)`);
  } else if (faseLunar.tipo === "oscura") {
    score += fasesLunares.luna_oscura.peso;
    advertencias.push({
      tipo: "luna_oscura",
      que_evitar: fasesLunares.luna_oscura.que_evitar,
      que_magnificar: fasesLunares.luna_oscura.que_magnificar
    });
    factores.push(`Luna Oscura (${fasesLunares.luna_oscura.peso} pts)`);
  }

  // ============================================
  // 3. ECLIPSES
  // ============================================
  const eclipse = verificarEclipse(fecha);

  if (eclipse) {
    const casaEclipse = calcularCasaNatal(eclipse.signo, cartaNatal);
    const pesoEclipse = eclipses[eclipse.tipo].poder_por_casa[`casa_${casaEclipse}`] || 20;

    score += pesoEclipse;

    magnificaciones.push({
      tipo: eclipse.tipo,
      poder: "MÁXIMO",
      casa: casaEclipse,
      que_hacer: eclipses[eclipse.tipo].que_magnificar,
      duracion_efecto: "6 meses"
    });

    factores.push(`${eclipse.tipo} en Casa ${casaEclipse} (+${pesoEclipse} pts)`);
  }

  // ============================================
  // 4. CAZIMI
  // ============================================
  const cazimiActivo = verificarCazimi(fecha);

  if (cazimiActivo) {
    let pesoCazimi = cazimi.peso;

    // Bonus si planeta está directo
    if (!retrogradosActivos.find(r => r.planeta === cazimiActivo.planeta)) {
      pesoCazimi += cazimi.planetas_cazimi[cazimiActivo.planeta].poder_extra_si_directo || 0;
    }

    score += pesoCazimi;

    magnificaciones.push({
      tipo: "cazimi",
      planeta: cazimiActivo.planeta,
      poder: "MÁXIMO",
      ventana_exacta: cazimiActivo.ventanaExacta,
      que_hacer: cazimi.planetas_cazimi[cazimiActivo.planeta].que_magnificar
    });

    factores.push(`${cazimiActivo.planeta} Cazimi (+${pesoCazimi} pts) ⚡⚡⚡`);
  }

  // ============================================
  // 5. ASPECTOS IMPORTANTES
  // ============================================
  const aspectosDelDia = calcularAspectosMayores(fecha);

  aspectosDelDia.forEach(asp => {
    const pesoAspecto = aspectos[asp.tipo].planetas_clave?.[asp.combinacion]
                     || aspectos[asp.tipo].peso;

    score += pesoAspecto;

    if (pesoAspecto > 0) {
      magnificaciones.push({
        tipo: "aspecto",
        aspecto: asp.descripcion,
        poder: pesoAspecto > 20 ? "ALTO" : "MEDIO",
        que_hacer: aspectos[asp.tipo].nota
      });
    } else {
      advertencias.push({
        tipo: "aspecto_tenso",
        aspecto: asp.descripcion,
        que_evitar: aspectos[asp.tipo].que_evitar,
        que_magnificar: aspectos[asp.tipo].que_magnificar
      });
    }

    factores.push(`${asp.descripcion} (${pesoAspecto > 0 ? '+' : ''}${pesoAspecto} pts)`);
  });

  // ============================================
  // 6. NODOS LUNARES
  // ============================================
  const transitoNodal = verificarTransitoNodal(fecha, cartaNatal);

  if (transitoNodal) {
    score += nodosLunares[transitoNodal.tipo].peso;

    magnificaciones.push({
      tipo: transitoNodal.tipo,
      poder: "ALTO",
      que_hacer: nodosLunares[transitoNodal.tipo].que_magnificar,
      que_evitar: nodosLunares[transitoNodal.tipo].que_evitar
    });

    factores.push(`${transitoNodal.descripcion} (+${nodosLunares[transitoNodal.tipo].peso} pts)`);
  }

  // ============================================
  // 7. INGRESOS PLANETARIOS
  // ============================================
  const ingresos = verificarIngresosPlanetarios(fecha);

  ingresos.forEach(ingreso => {
    const casaIngreso = calcularCasaNatal(ingreso.signo_nuevo, cartaNatal);
    const pesoIngreso = ingresosPlanetarios[`ingreso_${ingreso.planeta}`]?.peso || 10;

    score += pesoIngreso;

    magnificaciones.push({
      tipo: "ingreso_planetario",
      planeta: ingreso.planeta,
      signo: ingreso.signo_nuevo,
      casa: casaIngreso,
      poder: pesoIngreso > 20 ? "ALTO" : "MEDIO",
      duracion: ingresosPlanetarios[`ingreso_${ingreso.planeta}`]?.duracion_efecto,
      que_hacer: ingresosPlanetarios[`ingreso_${ingreso.planeta}`]?.que_magnificar
    });

    factores.push(`${ingreso.planeta} entra en ${ingreso.signo} (+${pesoIngreso} pts)`);
  });

  // ============================================
  // RESULTADO FINAL
  // ============================================

  return {
    fecha: fecha,
    score: score,
    nivel: determinarNivel(score),
    factores: factores,
    advertencias: advertencias,
    magnificaciones: magnificaciones,
    recomendacion: generarRecomendacion(score, advertencias, magnificaciones)
  };
}

// ============================================
// FUNCIÓN DE CLASIFICACIÓN
// ============================================

function determinarNivel(score) {
  if (score >= 90) return {
    nivel: "MÁXIMO_PODER",
    emoji: "⚡⚡⚡",
    color: "gold",
    descripcion: "Día PERFECTO para acciones mayores"
  };

  if (score >= 70) return {
    nivel: "ALTO_PODER",
    emoji: "⚡⚡",
    color: "green",
    descripcion: "Excelente día para manifestar/actuar"
  };

  if (score >= 50) return {
    nivel: "NEUTRAL",
    emoji: "⚖️",
    color: "blue",
    descripcion: "Día normal - acción moderada"
  };

  if (score >= 30) return {
    nivel: "BAJO_PODER",
    emoji: "⚠️",
    color: "orange",
    descripcion: "Día de cautela - evitar decisiones mayores"
  };

  return {
    nivel: "EVITAR_ACCIÓN",
    emoji: "❌",
    color: "red",
    descripcion: "Día de PAUSA - solo revisión/reflexión"
  };
}
```

---

## 📅 EJEMPLO DE SALIDA DIARIA

```json
{
  "fecha": "2025-06-14",
  "score": 135,
  "nivel": {
    "nivel": "MÁXIMO_PODER",
    "emoji": "⚡⚡⚡",
    "descripcion": "Día PERFECTO para acciones mayores"
  },

  "factores": [
    "Mercurio Cazimi (+70 pts) ⚡⚡⚡",
    "Venus tránsito conjunción Venus natal (+30 pts)",
    "Luna Nueva en Géminis (+25 pts)",
    "Luna Creciente (+15 pts)",
    "Venus-Júpiter trígono (+30 pts)",
    "SIN retrogrados activos (+0 pts bonus claridad)"
  ],

  "magnificaciones": [
    {
      "tipo": "cazimi",
      "planeta": "Mercurio",
      "poder": "MÁXIMO",
      "ventana_exacta": "14:32-16:32 UTC",
      "que_hacer": [
        "Firmar contrato importante EXACTAMENTE en esta ventana",
        "Lanzar producto/servicio de comunicación",
        "Tomar decisión mental clave",
        "Negociar con máximo poder mental"
      ]
    },
    {
      "tipo": "venus_return",
      "poder": "MÁXIMO",
      "que_hacer": [
        "Ritual de Venus Return (mini cumpleaños)",
        "Manifestar abundancia/amor",
        "Subir precios SIN justificar",
        "Declaración de amor (si aplica)"
      ]
    },
    {
      "tipo": "luna_nueva",
      "casa_activada": 3,
      "poder": "ALTO",
      "que_hacer": [
        "Plantar intenciones en área de comunicación (Casa 3)",
        "Ritual de manifestación Luna Nueva",
        "Escribir objetivos próximos 28 días"
      ]
    }
  ],

  "advertencias": [], // ¡CERO advertencias! Día perfecto

  "recomendacion": {
    "titulo": "🔥 DÍA DE MÁXIMO PODER CÓSMICO",

    "mensaje": "HOY es uno de los días MÁS PODEROSOS del año para ti. Mercurio Cazimi + Venus Return + Luna Nueva + aspectos armónicos = ALINEACIÓN PERFECTA.\n\nNO desperdicies este día. El cosmos te está apoyando x100.\n\nEste nivel de alineación ocurre 1-2 veces al año MÁXIMO.",

    "accion_prioritaria": "Entre 14:32-16:32 UTC (ventana Cazimi exacta):",

    "que_hacer_HOY": [
      {
        "hora": "14:00 UTC",
        "accion": "Preparación final de contrato/decisión/lanzamiento"
      },
      {
        "hora": "14:32 UTC EXACTO",
        "accion": "FIRMAR / DECIDIR / LANZAR",
        "porque": "Mercurio Cazimi exacto - máximo poder mental/comunicación"
      },
      {
        "hora": "15:00 UTC",
        "accion": "Ritual Venus Return - manifestar abundancia/amor"
      },
      {
        "hora": "20:00 UTC",
        "accion": "Ritual Luna Nueva - plantar intenciones próximos 28 días"
      }
    ],

    "bloqueos_trabajar_HOY": [
      {
        "bloqueo": "MB1 - 'Solo valgo si produzco'",
        "porque_hoy": "Venus Return + aspectos armónicos = momento perfecto de RECIBIR valor sin producir más",
        "ejercicio_magnificado": {
          "titulo": "💰 Manifestación de Valor Intrínseco MAGNIFICADA",
          "poder": "x10 por alineación cósmica",
          "que_hacer": [
            "14:32 UTC: Escribe cantidad específica que manifiestas ($X)",
            "Añade: 'Merezco recibir esto por QUIÉN SOY, no solo por producir'",
            "15:00 UTC: Ritual Venus Return con esta intención",
            "20:00 UTC: Confirma en ritual Luna Nueva",
            "Antes 23:59 HOY: Sube tus precios 2-3x SIN justificar"
          ],
          "mensaje_poder": "El universo está conspirando a tu favor HOY. No sabotees con dudas. ACTÚA.",
          "resultado_esperado": "En próximos 28 días: dinero inesperado, cliente que paga sin negociar, oportunidad de cobrar más"
        }
      },
      {
        "bloqueo": "LB1 - Miedo a expresar amor (Venus Casa 12)",
        "porque_hoy": "Venus Return = resetea tu capacidad de amar/expresar. Día perfecto para SACAR de Casa 12 (oculto) al mundo.",
        "ejercicio_magnificado": {
          "titulo": "💖 Expresión Vulnerable MAGNIFICADA",
          "que_hacer": [
            "15:00 UTC (Venus Return): Di en voz alta esa necesidad de amor que NUNCA has dicho",
            "Escríbela",
            "Antes 23:59 HOY: Exprésala a 1 persona real (mensaje/llamada/en persona)",
            "No edites. No justifiques. Solo di la verdad vulnerable."
          ],
          "resultado_esperado": "Conexión más profunda, o claridad de que esa persona no puede recibirte (ambas son victorias)"
        }
      }
    ],

    "trampa_evitar": "Tu Virgo querrá que todo sea PERFECTO antes de actuar. HOY no hay tiempo para perfección. HOY es DÍA DE ACCIÓN. Imperfecto y HECHO >> Perfecto y postergado.",

    "mensaje_final": "Si solo puedes hacer UNA cosa HOY: Entre 14:32-16:32 UTC, firma ese contrato / toma esa decisión / lanza ese proyecto que llevas postergando.\n\nEl timing NUNCA será más perfecto que HOY.\n\nEl universo está esperando que des el paso."
  }
}
```

---

## 🔄 CÓMO SE INTEGRA CON AGENDA

### **Agenda muestra cada día con color según score:**

```javascript
const calendarioVisual = {
  "2025-06-14": {
    color: "gold", // score 135 = MÁXIMO_PODER
    emoji: "⚡⚡⚡",
    tooltip: "DÍA DE PODER MÁXIMO - Mercurio Cazimi + Venus Return + Luna Nueva"
  },

  "2025-03-15": {
    color: "red", // score 25 = EVITAR_ACCIÓN
    emoji: "❌",
    tooltip: "Mercurio retro INICIA - Solo revisión, NO decisiones"
  },

  "2025-05-10": {
    color: "blue", // score 55 = NEUTRAL
    emoji: "⚖️",
    tooltip: "Día normal - acción moderada OK"
  }
};
```

### **Rituales lunares se MAGNIFICAN o SIMPLIFICAN según score:**

```javascript
// EJEMPLO: Luna Nueva en Piscis (Casa 12)

if (scoreDia >= 70) {
  // MAGNIFICAR ritual
  ritual = {
    titulo: "🌙 Ritual MAGNIFICADO de Luna Nueva",
    duracion: "90 minutos",
    poder: "x3 por aspectos favorables",
    pasos: [
      "Paso 1 extendido...",
      "Paso 2 con visualización profunda...",
      "Paso 3 AÑADIR: Como score es alto, añade petición adicional grande",
      // ... ritual completo
    ]
  };
} else if (scoreDia < 40) {
  // SIMPLIFICAR ritual
  ritual = {
    titulo: "🌙 Ritual SIMPLE de Luna Nueva",
    duracion: "15 minutos",
    advertencia: "Hoy hay retrogrados activos. Mantén ritual simple, solo plantar intención básica.",
    pasos: [
      "Paso 1 básico",
      "Paso 2 básico",
      "NO hagas compromisos grandes hoy - espera a mejor timing"
    ]
  };
}
```

---

## ✅ RESUMEN DEL SISTEMA

### **INPUT:**
- Fecha a evaluar
- Carta Natal completa
- Bloqueos/fortalezas identificados

### **CÁLCULOS:**
1. ✅ Retrogradaciones activas (Mercurio, Venus, Marte, Júpiter, Saturno, etc)
2. ✅ Periodos de sombra (pre y post retrogrado)
3. ✅ Fase Lunar actual + ventanas óptimas
4. ✅ Eclipses + casa donde caen
5. ✅ Cazimi (planeta a <17' del Sol)
6. ✅ Aspectos mayores del día
7. ✅ Tránsitos sobre Nodos Lunares natales
8. ✅ Ingresos planetarios en nuevos signos

### **OUTPUT:**
- **Score 0-150+**: Número que resume poder del día
- **Nivel**: MÁXIMO / ALTO / NEUTRAL / BAJO / EVITAR
- **Factores**: Lista de qué sumó/restó al score
- **Magnificaciones**: Qué hacer HOY para multiplicar poder
- **Advertencias**: Qué NO hacer HOY
- **Recomendación personalizada**: Acción específica según TUS bloqueos

### **INTEGRACIÓN:**
- Calendario visual con colores según score
- Rituales lunares magnificados o simplificados
- Ejercicios ajustados al poder del día
- Alertas automáticas días MÁXIMO_PODER

---

**Fin del documento**
