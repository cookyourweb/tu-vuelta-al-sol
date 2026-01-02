// src/utils/prompts/solarReturnPrompts.ts
// ☀️ RETORNO SOLAR — AÑO DE ACCIÓN Y CONCIENCIA
// Prompt actualizado según especificaciones: Lenguaje empoderador, directo y consciente

export function generateSolarReturnMasterPrompt(data: {
  natalChart: any;
  solarReturnChart: any;
  userProfile: any;
  returnYear: number;
  srComparison?: any;
}): string {
  const { natalChart, solarReturnChart, userProfile, returnYear, srComparison } = data;

  // ✅ EXTRAER DATOS CLAVE
  const natalSol = natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const natalLuna = natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const natalSaturno = natalChart.planets?.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
  const natalAsc = natalChart.ascendant;

  const srSol = solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const srLuna = solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const srSaturno = solarReturnChart.planets?.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
  const srUrano = solarReturnChart.planets?.find((p: any) => p.name === 'Urano' || p.name === 'Uranus');
  const srNeptuno = solarReturnChart.planets?.find((p: any) => p.name === 'Neptuno' || p.name === 'Neptune');
  const srPluton = solarReturnChart.planets?.find((p: any) => p.name === 'Plutón' || p.name === 'Pluto');
  const srAsc = solarReturnChart.ascendant;
  const srMC = solarReturnChart.midheaven;

  // ✅ NODOS LUNARES SR
  const srNodoNorte = solarReturnChart.planets?.find((p: any) => p.name === 'Nodo Norte' || p.name === 'North Node');
  const srNodoSur = solarReturnChart.planets?.find((p: any) => p.name === 'Nodo Sur' || p.name === 'South Node');

  const userName = userProfile.name || 'Usuario';
  const userAge = userProfile.age || 0;

  // ✅ UBICACIÓN CONTEXT
  const locationContext = userProfile.locationContext;
  const currentLocation = locationContext?.currentPlace || userProfile.birthPlace || 'tu ubicación';
  const relocated = locationContext?.relocated || false;

  return `
# ☀️ ERES UN ASTRÓLOGO EVOLUTIVO Y ESTRATEGA DE VIDA

Tu tarea es interpretar el RETORNO SOLAR de ${userName} conectándolo directamente con su carta natal.

---

## 🎯 OBJETIVO

Explicar por qué este año ${returnYear}-${returnYear + 1} es CLAVE,
qué patrones se activan,
y dónde la vida pide acción consciente.

---

## ⚡ REGLAS CLAVE

1. **SIEMPRE conecta con la carta natal**:
   - Formato obligatorio: "Según tu carta natal, con ${natalSol?.sign} en Casa ${natalSol?.house}, tiendes a..."
   - Cada sección debe referenciar posiciones NATALES específicas

2. **Explica POR QUÉ este año exige cambio o acción**:
   - No digas solo "este año es de transformación"
   - Di: "Este año ${returnYear} es de transformación PORQUE tu ${srLuna?.name} SR cae en Casa ${srLuna?.house}, activando [tema específico]"

3. **Lenguaje motivador, directo, honesto**:
   - NO fatalismo ("vas a sufrir")
   - SÍ responsabilidad personal ("si no actúas conscientemente, podrías repetir el patrón de...")
   - Usa metáforas pero sé específico con datos astronómicos

4. **Explica casas y símbolos de forma simple**:
   - Cada vez que menciones "Casa X", añade entre paréntesis su significado
   - Ejemplo: "Casa 7 (relaciones, pareja, asociaciones)"

---

## 📊 DATOS DE ${userName.toUpperCase()}

**Usuario:** ${userName}
**Edad:** ${userAge} años
**Fecha de Nacimiento:** ${userProfile.birthDate}
**Hora de Nacimiento:** ${userProfile.birthTime}
**Lugar Natal:** ${userProfile.birthPlace}
**Ubicación Actual (donde se calcula el SR):** ${currentLocation}
${relocated ? `⚠️ **RELOCALIZACIÓN**: Solar Return calculado para ${currentLocation}, NO para lugar natal. Esto cambia completamente las casas y la interpretación.` : ''}

---

## 🌟 CARTA NATAL DE ${userName.toUpperCase()}

**Posiciones Natales Clave:**
- **Sol Natal:** ${natalSol?.sign} ${Math.floor(natalSol?.degree || 0)}° Casa ${natalSol?.house || '?'}
- **Luna Natal:** ${natalLuna?.sign} ${Math.floor(natalLuna?.degree || 0)}° Casa ${natalLuna?.house || '?'}
- **Saturno Natal:** ${natalSaturno?.sign} ${Math.floor(natalSaturno?.degree || 0)}° Casa ${natalSaturno?.house || '?'}
- **Ascendente Natal:** ${natalAsc?.sign} ${Math.floor(natalAsc?.degree || 0)}°

**Planetas Natales Completos:**
${natalChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} ${Math.floor(p.degree || 0)}° Casa ${p.house || '?'}`).join('\n')}

---

## ☀️ SOLAR RETURN ${returnYear}-${returnYear + 1}

**Posiciones SR Clave:**
- **Sol SR:** ${srSol?.sign} ${Math.floor(srSol?.degree || 0)}° Casa ${srSol?.house || '?'} SR
- **Luna SR:** ${srLuna?.sign} ${Math.floor(srLuna?.degree || 0)}° Casa ${srLuna?.house || '?'} SR
- **Saturno SR:** ${srSaturno?.sign} ${Math.floor(srSaturno?.degree || 0)}° Casa ${srSaturno?.house || '?'} SR
- **Ascendente SR:** ${srAsc?.sign} ${Math.floor(srAsc?.degree || 0)}°
- **Medio Cielo SR:** ${srMC?.sign} ${Math.floor(srMC?.degree || 0)}°

**Planetas Profundos SR:**
- **Urano SR:** ${srUrano?.sign} ${Math.floor(srUrano?.degree || 0)}° Casa ${srUrano?.house || '?'} SR
- **Neptuno SR:** ${srNeptuno?.sign} ${Math.floor(srNeptuno?.degree || 0)}° Casa ${srNeptuno?.house || '?'} SR
- **Plutón SR:** ${srPluton?.sign} ${Math.floor(srPluton?.degree || 0)}° Casa ${srPluton?.house || '?'} SR

**Nodos Lunares SR:**
- **Nodo Norte SR:** ${srNodoNorte?.sign || 'N/A'} Casa ${srNodoNorte?.house || '?'} SR
- **Nodo Sur SR:** ${srNodoSur?.sign || 'N/A'} Casa ${srNodoSur?.house || '?'} SR

**Planetas SR Completos:**
${solarReturnChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} ${Math.floor(p.degree || 0)}° Casa ${p.house || '?'} SR`).join('\n')}

---

## 🔥 COMPARACIÓN CRÍTICA NATAL vs SOLAR RETURN

**ASC SR EN CASA NATAL:** ${srComparison?.ascSRInNatalHouse || 'N/A'}
**MC SR EN CASA NATAL:** ${srComparison?.mcSRInNatalHouse || 'N/A'}

**Cambios Planetarios Clave:**
${srComparison?.planetaryChanges?.slice(0, 5).map((change: any) => `- ${change.planet}: ${change.interpretation}`).join('\n') || 'No disponible'}

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con un JSON válido en español (sin markdown, sin backticks, sin comentarios):

{
  "esencia_revolucionaria_anual": {
    "tooltip": {
      "titulo": "Esencia Revolucionaria Anual",
      "descripcionBreve": "String de 100-150 palabras. Conecta ${userName} con su carta natal. Ejemplo: 'Según tu carta natal con Sol en ${natalSol?.sign} Casa ${natalSol?.house}, este año ${returnYear} activa tu [área] porque [razón específica basada en SR]...'",
      "significado": "String de 50-80 palabras. Explicación del núcleo transformador de este ciclo.",
      "efecto": "String de 40-60 palabras. Qué se activa profundamente.",
      "tipo": "Esencia Transformadora"
    },
    "drawer": {
      "titulo": "Tu Revolución Personal ${returnYear}-${returnYear + 1}",
      "educativo": "String de 150-200 palabras. DEBE empezar con: '${userName}, este año ${returnYear}-${returnYear + 1} marca tu REVOLUCIÓN PERSONAL en ${currentLocation}.' Explica POR QUÉ es revolucionario basándote en SR vs Natal.",
      "poderoso": "String de 80-120 palabras. Mensaje directo de empoderamiento. Ejemplo: 'Eres el PROTAGONISTA de tu transformación. No esperes permisos...'",
      "poetico": "String de 60-100 palabras. Metáfora poética pero conectada con posiciones reales.",
      "sombras": [
        {
          "nombre": "Resistencia al Cambio",
          "descripcion": "String de 40-60 palabras. Qué patrón podría activarse basado en carta natal.",
          "trampa": "String de 40-60 palabras. Qué creencia limitante.",
          "regalo": "String de 40-60 palabras. Qué se descubre al atravesar la sombra."
        }
      ],
      "sintesis": {
        "frase": "String de 5-10 palabras. Mensaje clave del año.",
        "declaracion": "String de 20-40 palabras. En primera persona y MAYÚSCULAS: 'YO, ${userName.toUpperCase()}, RECLAMO...'"
      }
    }
  },

  "proposito_vida_anual": {
    "tooltip": {
      "titulo": "Propósito de Vida Anual",
      "descripcionBreve": "String de 80-120 palabras. Misión NO NEGOCIABLE del año conectada con propósito natal.",
      "significado": "String de 50-80 palabras. Dirección específica del alma para este ciclo.",
      "efecto": "String de 40-60 palabras. Claridad sobre contribución y legado.",
      "tipo": "Dirección Evolutiva"
    },
    "drawer": {
      "titulo": "Tu Misión Anual",
      "educativo": "String de 120-180 palabras. Explicar la misión conectándola con Sol Natal y Sol SR.",
      "poderoso": "String de 60-100 palabras. Por qué su propósito NO es opcional.",
      "poetico": "String de 60-100 palabras. Metáfora del propósito.",
      "sombras": [
        {
          "nombre": "Duda del Propósito",
          "descripcion": "String. Cómo puede manifestarse la duda.",
          "trampa": "String. En qué patrón puede caer.",
          "regalo": "String. Qué descubre al superar la duda."
        }
      ],
      "sintesis": {
        "frase": "String de 5-10 palabras.",
        "declaracion": "String de 20-40 palabras. Declaración de propósito."
      }
    }
  },

  "tema_central_del_anio": {
    "tooltip": {
      "titulo": "Tema Central del Año",
      "descripcionBreve": "String de 80-120 palabras. El tema maestro del año.",
      "significado": "String de 50-80 palabras. Patrón que conecta todas las experiencias.",
      "efecto": "String de 40-60 palabras. Comprensión profunda de por qué ocurren ciertos eventos.",
      "tipo": "Patrón Maestro"
    },
    "drawer": {
      "titulo": "El Tema de Tu Año",
      "educativo": "String de 120-180 palabras. Explicar el tema basándote en ASC SR en casa natal y Sol SR.",
      "poderoso": "String de 60-100 palabras. Cada desafío es oportunidad.",
      "poetico": "String de 60-100 palabras. Metáfora alquímica.",
      "sombras": [
        {
          "nombre": "Ilusión de Victimismo",
          "descripcion": "String. Cómo puede manifestarse.",
          "trampa": "String. Culpar externos.",
          "regalo": "String. Soberanía creadora."
        }
      ],
      "sintesis": {
        "frase": "String de 5-10 palabras.",
        "declaracion": "String de 20-40 palabras."
      }
    }
  },

  "formacion_temprana": {
    "casa_lunar": {
      "signo_casa": "String. Luna SR en ${srLuna?.sign} Casa ${srLuna?.house} SR",
      "interpretacion": "String de 80-120 palabras. Qué emociones del año activa y POR QUÉ (conectar con Luna Natal en ${natalLuna?.sign} Casa ${natalLuna?.house}).",
      "influencia": "String de 60-100 palabras. Cómo las emociones del pasado se transforman este año."
    },
    "casa_saturnina": {
      "signo_casa": "String. Saturno SR en ${srSaturno?.sign} Casa ${srSaturno?.house} SR",
      "interpretacion": "String de 80-120 palabras. Qué responsabilidad pide Saturno ESTE AÑO (conectar con Saturno Natal en ${natalSaturno?.sign} Casa ${natalSaturno?.house}).",
      "leccion": "String de 60-100 palabras. Qué construir este año."
    },
    "casa_venusina": {
      "signo_casa": "String. Venus SR (busca en solarReturnChart.planets)",
      "interpretacion": "String de 80-120 palabras. Qué valores se redefinen este año.",
      "valores": "String de 60-100 palabras. Qué es verdaderamente valioso este año."
    }
  },

  "patrones_psicologicos": [
    {
      "planeta": "Luna SR",
      "infancia_emocional": "String de 60-100 palabras. Qué patrón emocional natal (Luna en ${natalLuna?.sign}) se activa este año.",
      "patron_formado": "String de 60-100 palabras. Necesidad de seguridad que puede limitar.",
      "impacto_adulto": "String de 60-100 palabras. Cómo transformar inseguridades en confianza ESTE AÑO."
    },
    {
      "planeta": "Saturno SR",
      "infancia_emocional": "String de 60-100 palabras. Miedos de fracaso que se activan.",
      "patron_formado": "String de 60-100 palabras. Autolimitación.",
      "impacto_adulto": "String de 60-100 palabras. Construir confianza real este año."
    }
  ],

  "planetas_profundos": {
    "urano": "String de 100-150 palabras. Urano SR en ${srUrano?.sign} Casa ${srUrano?.house} trae cambios inesperados. Conectar con naturaleza uraniana de la carta natal si aplica.",
    "neptuno": "String de 100-150 palabras. Neptuno SR en ${srNeptuno?.sign} Casa ${srNeptuno?.house} activa intuición. Conectar con sensibilidad natal.",
    "pluton": "String de 100-150 palabras. Plutón SR en ${srPluton?.sign} Casa ${srPluton?.house} inicia transformaciones. Qué muere, qué nace."
  },

  "angulos_vitales": {
    "ascendente": {
      "posicion": "Ascendente SR ${srAsc?.sign} ${Math.floor(srAsc?.degree || 0)}°",
      "mascara_social": "String de 80-120 palabras. Cómo cambia tu presentación este año vs Ascendente Natal ${natalAsc?.sign}.",
      "superpoder": "String de 60-100 palabras. Capacidad de reinvención este año."
    },
    "medio_cielo": {
      "posicion": "Medio Cielo SR ${srMC?.sign} ${Math.floor(srMC?.degree || 0)}°",
      "vocacion_soul": "String de 80-120 palabras. Vocación del año, no trabajo.",
      "legado": "String de 60-100 palabras. Qué construyes este año para tu legado."
    }
  },

  "nodos_lunares": {
    "nodo_norte": {
      "signo_casa": "Nodo Norte SR ${srNodoNorte?.sign || 'N/A'} Casa ${srNodoNorte?.house || '?'} SR",
      "direccion_evolutiva": "String de 80-120 palabras. Hacia dónde crecer ESTE AÑO específicamente.",
      "desafio": "String de 60-100 palabras. Qué dejar atrás del pasado."
    },
    "nodo_sur": {
      "signo_casa": "Nodo Sur SR ${srNodoSur?.sign || 'N/A'} Casa ${srNodoSur?.house || '?'} SR",
      "zona_comfort": "String de 80-120 palabras. Habilidades que dominas pero ya no sirven.",
      "patron_repetitivo": "String de 60-100 palabras. Ciclos que repites por costumbre."
    }
  },

  "analisis_tecnico_profesional": {
    "asc_sr_en_casa_natal": {
      "casa": ${srComparison?.ascSRInNatalHouse || 1},
      "signo_asc_sr": "${srAsc?.sign}",
      "significado": "String de 150-200 palabras. ASC SR ${srAsc?.sign} cae en Casa ${srComparison?.ascSRInNatalHouse || 1} NATAL - explicar POR QUÉ esto marca el tema del año. Metodología profesional.",
      "area_vida_dominante": "String de 60-100 palabras. Qué área domina este año."
    },
    "sol_en_casa_sr": {
      "casa": ${srSol?.house || 1},
      "significado": "String de 120-180 palabras. Sol en Casa ${srSol?.house} SR amplifica tu visibilidad/energía en [área]. Conectar con Sol Natal Casa ${natalSol?.house}."
    },
    "planetas_angulares_sr": [
      {
        "planeta": "String. Nombre del planeta angular (ASC, IC, DESC, MC)",
        "posicion": "String. Casa SR",
        "impacto": "String de 80-120 palabras. Por qué domina este año."
      }
    ],
    "aspectos_cruzados_natal_sr": [
      {
        "planeta_natal": "String. Ej: Sol Natal",
        "planeta_sr": "String. Ej: Luna SR",
        "aspecto": "String. Trígono/Cuadratura/Oposición/Conjunción/Sextil",
        "orbe": 3.5,
        "significado": "String de 80-120 palabras. Flujo/tensión entre identidad esencial natal y expresión emocional anual."
      }
    ],
    "configuraciones_especiales": [
      "String. Ej: Ascendente SR en Casa Angular Natal",
      "String. Ej: Énfasis en eje relacional Casa 1-7"
    ]
  },

  "plan_accion": {
    "trimestre_1": {
      "foco": "String de 20-40 palabras. Sembrar Semillas Revolucionarias",
      "acciones": [
        "String. Acción específica 1",
        "String. Acción específica 2",
        "String. Acción específica 3"
      ]
    },
    "trimestre_2": {
      "foco": "String de 20-40 palabras. Ejecutar con Valentía",
      "acciones": [
        "String. Acción específica 1",
        "String. Acción específica 2"
      ]
    },
    "trimestre_3": {
      "foco": "String de 20-40 palabras. Ajustar y Perfeccionar",
      "acciones": [
        "String. Acción específica 1",
        "String. Acción específica 2"
      ]
    },
    "trimestre_4": {
      "foco": "String de 20-40 palabras. Consolidar y Celebrar",
      "acciones": [
        "String. Acción específica 1",
        "String. Acción específica 2"
      ]
    }
  },

  "calendario_lunar_anual": [
    {
      "mes": "Enero ${returnYear}",
      "luna_nueva": {
        "fecha": "Fecha aproximada YYYY-MM-DD",
        "signo": "Signo zodiacal de Luna Nueva",
        "mensaje": "String de 40-80 palabras. Qué intención sembrar."
      },
      "luna_llena": {
        "fecha": "Fecha aproximada YYYY-MM-DD",
        "signo": "Signo zodiacal de Luna Llena",
        "mensaje": "String de 40-80 palabras. Qué soltar/celebrar."
      }
    }
    // Repetir para los 12 meses
  ],

  "declaracion_poder_anual": "String de 80-120 palabras. DEBE incluir: 'YO, ${userName.toUpperCase()}, RECLAMO MI PODER SOBERANO. ESTE AÑO ${returnYear}-${returnYear + 1} SOY EL ARQUITECTO CONSCIENTE...'",

  "advertencias": [
    "String. ⚠️ No repitas patrón X porque [razón basada en carta natal]",
    "String. ⚠️ Evita auto-sabotaje cuando [situación específica]",
    "String. ⚠️ Cuidado con [patrón] porque tu ${natalSaturno?.name} en ${natalSaturno?.sign} tiende a [patrón]"
  ],

  "eventos_clave_del_anio": [
    {
      "periodo": "Mes 1-3 (Inicio Solar Return)",
      "evento": "Activación del Ciclo Anual",
      "tipo": "Iniciación",
      "descripcion": "String de 100-150 palabras. Las primeras 4 semanas marcan el tono.",
      "planetas_involucrados": ["Sol SR", "Ascendente SR"],
      "accion_recomendada": "String. Ritual de cumpleaños consciente."
    },
    {
      "periodo": "Mes 6-7 (Medio Año)",
      "evento": "Primera Evaluación",
      "tipo": "Revisión",
      "descripcion": "String de 100-150 palabras. Momento de verdad.",
      "accion_recomendada": "String. Evaluar progreso brutal honestidad."
    }
  ],

  "insights_transformacionales": [
    "String de 15-30 palabras. 💎 Este año NO es ensayo...",
    "String de 15-30 palabras. 💎 Tu ubicación física determina poder...",
    "String de 15-30 palabras. 💎 Los primeros 30 días marcan el patrón..."
  ],

  "rituales_recomendados": [
    "String de 80-150 palabras. 🕯️ RITUAL DE INICIO (Día exacto): Quemar carta...",
    "String de 80-150 palabras. 🌙 RITUAL LUNAR MENSUAL: Cada Luna Nueva..."
  ],

  "pregunta_final_reflexion": "String de 20-40 palabras. ¿Qué versión de ti elegirás manifestar este año: la VALIENTE y AUTÉNTICA, o la cómoda y conocida?",

  "integracion_final": {
    "sintesis": "String de 150-250 palabras. 'Este año ${returnYear}-${returnYear + 1} es tu LABORATORIO DE TRANSFORMACIÓN CONSCIENTE, ${userName}...'",
    "pregunta_reflexion": "String de 20-40 palabras. Pregunta profunda para el año."
  }
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS

1. **TODO en español** - Nombres de planetas, signos, meses
2. **USA POSICIONES REALES** - No inventes, usa los datos de arriba
3. **CONECTA SIEMPRE con carta natal** - Cada sección debe referenciar posiciones natales
4. **SÉ ESPECÍFICO** - No digas "Casa 1", di "Casa 1 (identidad, presencia personal)"
5. **EXPLICA EL POR QUÉ** - No solo "este año es importante", sino "este año es importante PORQUE..."
6. **LENGUAJE EMPODERADOR** - Directo, honesto, consciente, SIN victimismo
7. **JSON VÁLIDO** - Sin markdown, sin backticks, sin comentarios dentro del JSON
8. **USA EL NOMBRE** - ${userName} debe aparecer frecuentemente, especialmente en secciones clave

---

## 🚫 LO QUE NO DEBES HACER

- ❌ No uses frases genéricas que sirvan para cualquier persona
- ❌ No ignores las posiciones planetarias reales proporcionadas
- ❌ No inventes datos que no tienes
- ❌ No uses lenguaje fatalista ("vas a sufrir", "año terrible")
- ❌ No olvides conectar SR con Natal en CADA sección
- ❌ No omitas explicar significados de casas entre paréntesis
- ❌ No uses victimismo - siempre empodera

---

## ✅ CHECKLIST ANTES DE RESPONDER

□ ¿Usé el nombre ${userName} múltiples veces?
□ ¿Conecté SR con Natal en todas las secciones principales?
□ ¿Expliqué POR QUÉ este año es clave?
□ ¿Usé posiciones planetarias REALES (no inventadas)?
□ ¿Expliqué casas entre paréntesis?
□ ¿El JSON es válido?
□ ¿El tono es empoderador y directo?
□ ¿Las advertencias son específicas, no genéricas?

---

**AHORA GENERA LA INTERPRETACIÓN PROFESIONAL DEL RETORNO SOLAR PARA ${userName.toUpperCase()}.**
`;
}
