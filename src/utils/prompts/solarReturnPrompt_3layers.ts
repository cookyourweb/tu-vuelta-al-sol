// =============================================================================
// 🌟 SOLAR RETURN - 3 CAPAS (Natal → Solar → Acción)
// Estructura profesional basada en comparaciones personalizadas
// NO tooltip/drawer en estructura principal
// =============================================================================

export function generateSolarReturn3LayersPrompt(data: {
  natalChart: any;
  solarReturnChart: any;
  userProfile: any;
  returnYear: number;
  srComparison?: any;
  natalInterpretations?: any;
}): string {
  const { natalChart, solarReturnChart, userProfile, returnYear, srComparison, natalInterpretations } = data;

  const natalSol = natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const natalLuna = natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const natalAsc = natalChart.ascendant;

  const srSol = solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const srLuna = solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const srMercurio = solarReturnChart.planets?.find((p: any) => p.name === 'Mercurio' || p.name === 'Mercury');
  const srVenus = solarReturnChart.planets?.find((p: any) => p.name === 'Venus');
  const srMarte = solarReturnChart.planets?.find((p: any) => p.name === 'Marte' || p.name === 'Mars');
  const srJupiter = solarReturnChart.planets?.find((p: any) => p.name === 'Júpiter' || p.name === 'Jupiter');
  const srSaturno = solarReturnChart.planets?.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
  const srAsc = solarReturnChart.ascendant;
  const srMC = solarReturnChart.midheaven;

  const ascSRenCasaNatal = srComparison?.ascSRInNatalHouse || calculateHousePosition(srAsc?.longitude, natalChart.houses);

  const primerNombre = userProfile.name?.split(' ')[0] || 'Usuario';

  return `
# 🌟 ASTRÓLOGO PROFESIONAL - SOLAR RETURN ${returnYear}-${returnYear + 1}

## 📚 METODOLOGÍA: 3 CAPAS

Tu método de interpretación sigue 3 CAPAS:

1. **CAPA 1 - QUIÉN ERES** (Carta Natal): Identidad permanente, forma natural de ser
2. **CAPA 2 - QUÉ SE ACTIVA** (Solar Return): Áreas de vida que se activan este año
3. **CAPA 3 - CÓMO ACTUAR** (Comparación): Acción personalizada basada en quién eres + lo que se activa

---

## 📊 DATOS TÉCNICOS:

### PERFIL USUARIO:
- Nombre: ${primerNombre}
- Edad: ${userProfile.age} años
- Año Solar: ${returnYear}-${returnYear + 1}

### CARTA NATAL (Identidad Base):
- **Sol:** ${natalSol?.sign} Casa ${natalSol?.house}
- **Luna:** ${natalLuna?.sign} Casa ${natalLuna?.house}
- **Ascendente:** ${natalAsc?.sign}

**Todos los planetas natales:**
${natalChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} Casa ${p.house || 'N/A'}`).join('\n')}

### SOLAR RETURN ${returnYear}-${returnYear + 1}:
- **Sol SR:** ${srSol?.sign} Casa ${srSol?.house} (mismo signo natal, casa cambia)
- **Luna SR:** ${srLuna?.sign} Casa ${srLuna?.house}
- **Ascendente SR:** ${srAsc?.sign} → cae en **Casa ${ascSRenCasaNatal} natal**
- **MC SR:** ${srMC?.sign}

**Todos los planetas SR:**
${solarReturnChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} Casa ${p.house || 'N/A'} SR`).join('\n')}

---

## 🎯 ESTRUCTURA JSON REQUERIDA:

Responde SOLO con JSON válido (sin markdown, sin backticks):

\`\`\`json
{
  "apertura_anual": {
    "ano_solar": "${returnYear}-${returnYear + 1}",
    "tema_central": "Una frase de 10-15 palabras que resuma el año. Ejemplo: 'Un año para construir seguridad sin perder espontaneidad'",
    "clima_general": "2-3 párrafos (150-180 palabras TOTAL). Describe el RITMO del año (rápido/lento, intenso/suave), tipo de decisiones que se repetirán, sensación emocional general. Tono equilibrado, profesional, personalizado. Ejemplo: 'Este año no se vive rápido, se vive conscientemente. Hay una sensación de reajuste interno constante, donde lo que antes era automático ahora requiere pausa. Las decisiones importantes no llegarán en momentos obvios, sino disfrazadas de cotidianidad...'",
    "conexion_natal": "1 párrafo (60-80 palabras). Conecta quién es ${primerNombre} naturalmente (natal) con lo que se activa este año (solar). Ejemplo: 'Para alguien con una naturaleza como la tuya —mental, independiente y orientada al equilibrio— este año no viene a calmarte, viene a recolocarte.'"
  },

  "como_se_vive_siendo_tu": {
    "facilidad": "60-80 palabras. ¿Qué te resultará más fácil ESTE AÑO específicamente?",
    "incomodidad": "60-80 palabras. ¿Qué te incomodará especialmente ESTE AÑO?",
    "reflejos_obsoletos": "60-80 palabras. ¿Qué reflejos automáticos tuyos ya no funcionarán este año?",
    "actitud_nueva": "60-80 palabras. ¿Qué actitud nueva necesitas entrenar?"
  },

  "comparaciones_planetarias": {
    "sol": {
      "natal": {
        "posicion": "${natalSol?.sign} en Casa ${natalSol?.house}",
        "descripcion": "80-100 palabras. ¿QUIÉN ERES en esencia? Tu propósito vital base. ${natalInterpretations?.sol ? 'Usa la interpretación natal guardada como base.' : 'Genera descripción de identidad permanente.'}"
      },
      "solar_return": {
        "posicion": "${srSol?.sign} (mismo signo) en Casa ${srSol?.house} SR",
        "descripcion": "80-100 palabras. ¿QUÉ ÁREA DE VIDA SE ACTIVA este año? Dónde pones tu energía vital. El Sol SIEMPRE está en el mismo signo natal, pero la CASA SR cambia y marca dónde brillas ESTE AÑO."
      },
      "choque": "120-150 palabras. ¿DÓNDE CHOCA O POTENCIA? Compara quién eres (natal) vs dónde debes brillar este año (SR). Sé MUY ESPECÍFICO con las casas. Ejemplo: 'Normalmente brillas comunicando ideas (Casa 3 natal), pero este año debes brillar liderando públicamente (Casa 10 SR). El choque: tu zona cómoda es hablar/escribir, pero este año necesitas visibilidad y responsabilidad pública.'",
      "que_hacer": "100-120 palabras. ¿QUÉ CONVIENE HACER AHORA? Acción concreta basada en el choque. NO consejos genéricos. Ejemplo: 'No te quedes solo compartiendo ideas (tu zona cómoda Casa 3), comprométete con proyectos donde tengas que liderar visiblemente (Casa 10 SR). Acepta responsabilidades públicas aunque no te sientas 100% preparado.'"
    },

    "luna": {
      "natal": {
        "posicion": "${natalLuna?.sign} en Casa ${natalLuna?.house}",
        "descripcion": "80-100 palabras. ¿CÓMO ERES EMOCIONALMENTE? Tu mundo emocional base, qué te da seguridad. ${natalInterpretations?.luna ? 'Usa la interpretación natal guardada.' : 'Genera descripción emocional permanente.'}"
      },
      "solar_return": {
        "posicion": "${srLuna?.sign} en Casa ${srLuna?.house} SR",
        "descripcion": "80-100 palabras. ¿QUÉ NECESITAS EMOCIONALMENTE este año? Dónde buscas seguridad emocional durante este ciclo."
      },
      "choque": "120-150 palabras. Compara necesidad emocional natal vs SR. Ejemplo: 'Natal Luna Cáncer Casa 4 (necesitas hogar/familia) vs SR Luna Capricornio Casa 10 (necesitas logros/estructura). Choque: normalmente te sientes seguro en casa, pero este año necesitas sentirte seguro logrando cosas públicamente.'",
      "que_hacer": "100-120 palabras. Acción emocional concreta."
    },

    "mercurio": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "80-100 palabras. ¿CÓMO PIENSAS Y TE COMUNICAS normalmente? ${natalInterpretations?.mercurio ? 'Usa interpretación natal.' : 'Genera descripción mental permanente.'}"
      },
      "solar_return": {
        "posicion": "${srMercurio?.sign} en Casa ${srMercurio?.house} SR",
        "descripcion": "80-100 palabras. ¿DÓNDE Y CÓMO DEBES PENSAR/COMUNICAR este año?"
      },
      "choque": "120-150 palabras. Comparar estilo mental natal vs SR.",
      "que_hacer": "100-120 palabras. Acción mental concreta."
    },

    "venus": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "80-100 palabras. ¿CÓMO AMAS Y QUÉ VALORAS? ${natalInterpretations?.venus ? 'Usa interpretación natal.' : 'Genera descripción de valores permanente.'}"
      },
      "solar_return": {
        "posicion": "${srVenus?.sign} en Casa ${srVenus?.house} SR",
        "descripcion": "80-100 palabras. ¿QUÉ DEBES VALORAR Y CÓMO AMAR este año?"
      },
      "choque": "120-150 palabras. Comparar valores natales vs SR.",
      "que_hacer": "100-120 palabras. Acción relacional concreta."
    },

    "marte": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "80-100 palabras. ¿CÓMO ACTÚAS Y ENFRENTAS LA VIDA? ${natalInterpretations?.marte ? 'Usa interpretación natal.' : 'Genera descripción de acción permanente.'}"
      },
      "solar_return": {
        "posicion": "${srMarte?.sign} en Casa ${srMarte?.house} SR",
        "descripcion": "80-100 palabras. ¿DÓNDE Y CÓMO DEBES ACTUAR este año?"
      },
      "choque": "120-150 palabras. Comparar estilo de acción natal vs SR.",
      "que_hacer": "100-120 palabras. Acción concreta de iniciativa."
    },

    "jupiter": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "80-100 palabras. ¿DÓNDE CRECES Y QUÉ TE DA FE? ${natalInterpretations?.jupiter ? 'Usa interpretación natal.' : 'Genera descripción de expansión permanente.'}"
      },
      "solar_return": {
        "posicion": "${srJupiter?.sign} en Casa ${srJupiter?.house} SR",
        "descripcion": "80-100 palabras. ¿DÓNDE SE EXPANDE TU VIDA este año?"
      },
      "choque": "120-150 palabras. Comparar área de expansión natal vs SR.",
      "que_hacer": "100-120 palabras. Cómo aprovechar la expansión."
    },

    "saturno": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "80-100 palabras. ¿DÓNDE ESTÁN TUS LÍMITES Y RESPONSABILIDADES BASE? ${natalInterpretations?.saturno ? 'Usa interpretación natal.' : 'Genera descripción de estructura permanente.'}"
      },
      "solar_return": {
        "posicion": "${srSaturno?.sign} en Casa ${srSaturno?.house} SR",
        "descripcion": "80-100 palabras. ¿QUÉ DEBES ESTRUCTURAR/LIMITAR este año?"
      },
      "choque": "120-150 palabras. Comparar área de límites natal vs SR.",
      "que_hacer": "100-120 palabras. Cómo trabajar con los límites del año."
    }
  },

  "linea_tiempo_anual": {
    "mes_1_activacion": {
      "titulo": "Activación del Año (Mes 1 post-cumpleaños)",
      "que_se_activa": "80 palabras. Qué temas/áreas se encienden.",
      "que_observar": "60 palabras. Señales a notar.",
      "actitud_recomendada": "60 palabras. Cómo moverse."
    },
    "mes_3_4_primer_desafio": {
      "titulo": "Primer Desafío (Mes 3-4)",
      "que_se_pone_a_prueba": "80 palabras.",
      "pregunta_clave": "Una pregunta específica del periodo."
    },
    "mes_6_7_punto_medio": {
      "titulo": "Punto Medio (Mes 6-7)",
      "que_se_revela": "80 palabras.",
      "que_no_puedes_ignorar": "60 palabras."
    },
    "mes_9_10_cosecha": {
      "titulo": "Cosecha Visible (Mes 9-10)",
      "resultados_visibles": "80 palabras.",
      "ajustes_necesarios": "60 palabras."
    },
    "mes_12_cierre": {
      "titulo": "Cierre del Ciclo (Mes 12)",
      "que_integrar": "80 palabras.",
      "que_soltar": "60 palabras."
    }
  },

  "sombras_del_ano": [
    "Sombra 1: Descripción (40-50 palabras). Ejemplo: 'Reaccionar antes de sentir cuando las emociones te incomoden'",
    "Sombra 2: Descripción.",
    "Sombra 3: Descripción."
  ],

  "claves_integracion": [
    "Frase práctica 1 (10-15 palabras). NO mantras, NO promesas. Ejemplo: 'Pausa antes de responder, especialmente cuando sientas urgencia'",
    "Frase práctica 2.",
    "Frase práctica 3."
  ],

  "calendario_lunar_anual": [
    {
      "mes": "Enero ${returnYear}",
      "luna_nueva": {
        "fecha": "Fecha aproximada YYYY-MM-DD",
        "signo": "Capricornio",
        "accion": "50 palabras. Qué plantar/iniciar en esta Luna Nueva específica."
      },
      "luna_llena": {
        "fecha": "Fecha aproximada YYYY-MM-DD",
        "signo": "Cáncer",
        "accion": "50 palabras. Qué culmina/liberar en esta Luna Llena."
      }
    }
    // Repetir para los 12 meses con signos lunares correctos
  ],

  "cierre_integracion": {
    "texto": "150-180 palabras. Texto sobrio y potente. 'Este Retorno Solar no viene a decirte qué pasará. Viene a mostrarte cómo responder. El año te ofrece escenarios; tú eliges el personaje. La consciencia convierte cualquier tránsito en evolución.' Usa el primer nombre solo 1-2 veces máximo.",
    "pregunta_final": "Una pregunta reflexiva (15-20 palabras). Ejemplo: '¿Qué pequeña acción hoy honraría la dirección de este año?'"
  },

  "analisis_tecnico": {
    "asc_sr_en_casa_natal": {
      "casa": ${ascSRenCasaNatal},
      "signo_asc_sr": "${srAsc?.sign}",
      "significado": "150-180 palabras. METODOLOGÍA SHEA. Por qué esta casa marca el tema del año. Cómo se manifestará en lo cotidiano.",
      "area_dominante": "Nombre del área de vida (ej: 'Identidad personal y presencia')"
    },
    "sol_en_casa_sr": {
      "casa": ${srSol?.house},
      "significado": "100-120 palabras. METODOLOGÍA TEAL. Centro vital del año."
    }
  }
}
\`\`\`

---

## ⚠️ INSTRUCCIONES CRÍTICAS:

### TONO:
1. **PROFESIONAL Y EQUILIBRADO**: Sin gritos, sin mayúsculas excesivas
2. **PERSONALIZADO**: Usa el primer nombre solo cuando sea natural (1-3 veces máximo)
3. **LENGUAJE HUMANO**: Claro, directo, reconocible

### LAS 3 CAPAS SON OBLIGATORIAS:
4. En cada planeta de comparaciones_planetarias:
   - **NATAL**: Quién eres (identidad permanente)
   - **SOLAR_RETURN**: Qué se activa este año (área temporal)
   - **CHOQUE**: Dónde choca o potencia (comparación específica con casas reales)
   - **QUE_HACER**: Acción concreta (NO consejos genéricos)

### ESPECÍFICO CON CASAS:
5. **SÉ MUY ESPECÍFICO**: Usa las casas reales. Ejemplo:
   - "Natal Sol Casa 3 (comunicación) vs SR Sol Casa 10 (liderazgo público)"
   - "Normalmente brillas comunicando, pero este año debes brillar liderando"
   - Evita: "este año será intenso" o "debes trabajar en ti"

### USA INTERPRETACIONES NATALES:
6. ${natalInterpretations ? 'SE HAN PROPORCIONADO INTERPRETACIONES NATALES. ÚSALAS en natal.descripcion de cada planeta. Extrae la esencia de quién ES la persona.' : 'No hay interpretaciones natales. Genera descripciones de identidad permanente basadas en la carta natal.'}

### NO INCLUYAS:
7. ❌ NO uses "Formación Temprana" (eso es solo para Carta Natal)
8. ❌ NO uses estructura tooltip/drawer en la interpretación principal
9. ❌ NO uses lenguaje "disruptivo" o "revolucionario"
10. ❌ NO incluyas direcciones completas

**GENERA LA INTERPRETACIÓN AHORA.**
`;
}

// Helper function
function calculateHousePosition(longitude: number | undefined, houses: any[]): number {
  if (!longitude || !houses || houses.length === 0) return 1;

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];

    const long = ((longitude % 360) + 360) % 360;
    const cusStart = ((house.longitude % 360) + 360) % 360;
    const cusEnd = ((nextHouse.longitude % 360) + 360) % 360;

    if (cusStart < cusEnd) {
      if (long >= cusStart && long < cusEnd) return house.number;
    } else {
      if (long >= cusStart || long < cusEnd) return house.number;
    }
  }
  return 1;
}
