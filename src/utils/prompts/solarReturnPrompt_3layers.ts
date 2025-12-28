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

## 📚 METODOLOGÍA: JERARQUÍA + DIRECCIÓN

Tu método NO es describir todo por igual. Es:

1. **IDENTIFICAR EL EJE DEL AÑO**: ¿Qué está pasando realmente? (1-2 frases potentes)
2. **DAR PRIORIDAD PLANETARIA**: No todos los planetas pesan igual este año específico
3. **GUIAR, NO DESCRIBIR**: Cada párrafo debe conducir a una comprensión clara

### PRIORIDAD PLANETARIA ESTE AÑO:

Basándote en la carta SR, identifica qué planetas tienen MÁS PESO este año y desarróllalos más:

🔑 **PRIORIDAD 1** → Sol + Saturno + planetas en casas angulares (1, 4, 7, 10) → Identidad y estructura del año
⭐ **PRIORIDAD 2** → Mercurio + Luna → Procesamiento interno y emocional
💫 **PRIORIDAD 3** → Venus + Marte + Júpiter → Expansión, acción y valores

👉 Las comparaciones de **PRIORIDAD 1** deben ser MÁS DESARROLLADAS (200 palabras)
👉 Las de **PRIORIDAD 2-3** pueden ser MÁS SINTÉTICAS (120-150 palabras)

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
    "tema_central": "Una frase de 8-12 palabras. DIRECCIÓN CLARA, no descripción. Ejemplo: 'Un año para retirarte, redefinirte y volver con otra luz'",
    "eje_del_ano": "1-2 frases POTENTES (40-60 palabras MÁXIMO). ¿Qué está pasando REALMENTE? NO describir, DIRIGIR. Ejemplo: 'Este año no está diseñado para empujar hacia afuera, sino para reordenarte por dentro. La energía general te lleva a un proceso de cierre, limpieza y redefinición de identidad.'",
    "como_se_siente": "2 párrafos cortos (120-150 palabras TOTAL). Ritmo del año + tipo de decisiones. CONCRETO, NO METAFÓRICO. Ejemplo: 'No es un año de visibilidad constante. Es un año de gestación interna. Cada vez que intentes acelerar procesos o forzar resultados, sentirás confusión o desgaste. Cada vez que pares, observes y escuches, aparecerán respuestas claras. \n\nLas decisiones no llegarán como grandes revelaciones, sino como pequeños ajustes cotidianos que exigen honestidad brutal contigo mismo.'",
    "conexion_natal": "1 párrafo (70-90 palabras). Conecta QUIÉN ES (natal) con LO QUE PIDE EL AÑO (solar). USAR CONTRASTE CLARO. Ejemplo: 'Con Sol natal en Acuario Casa 1, tu naturaleza es: independiente, visible, orientada a marcar tu propio camino. Pero este año, con el Sol SR en Casa 12, la vida te pide lo contrario: bajar el ritmo, soltar la necesidad de definirte externamente, explorar lo que no se ve. 👉 No es contradicción. Es la fase previa a un nuevo comienzo.'"
  },

  "como_se_vive_siendo_tu": {
    "facilidad": "40-60 palabras. Lista de 3-4 items. Ejemplo: '✅ Soledad elegida · Reflexión profunda · Conexión espiritual o psicológica · Procesos creativos privados'",
    "incomodidad": "40-60 palabras. Lista de 3-4 items. Ejemplo: '⚠️ Falta de resultados visibles inmediatos · Sensación de estar parado · Menos validación externa'",
    "medida_del_ano": "60-80 palabras. UNA FRASE DIRECTA sobre cómo NO medir el año + cómo SÍ medirlo. Ejemplo: '👉 Si mides este año con criterios de productividad externa, sentirás frustración. Si lo mides por coherencia interna, será uno de los más importantes de tu vida.'",
    "reflejos_obsoletos": "30-50 palabras. Lista de 3 items. Ejemplo: 'Buscar aprobación · Definirte por lo que haces · Reaccionar antes de sentir'",
    "actitud_nueva": "30-50 palabras. Lista de 3 items. Ejemplo: 'Paciencia · Escucha interna · Confianza en procesos invisibles'"
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
    "mes_1_2": {
      "titulo": "Mes 1–2 | Activación",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Retiro, introspección, sueños intensos. Observa más de lo que actúas. Presta atención a los mensajes internos que surgen.'"
    },
    "mes_3_4": {
      "titulo": "Mes 3–4 | Primer ajuste",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Situaciones que te obligan a expresarte con más honestidad. No puedes seguir callando lo esencial. ¿Cómo puedes comunicarte de manera más auténtica?'"
    },
    "mes_6_7": {
      "titulo": "Mes 6–7 | Punto medio",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Comprensión clara de qué identidad ya no te representa. Decisiones internas importantes. No puedes ignorar la necesidad de alinearte con tus valores auténticos.'"
    },
    "mes_9_10": {
      "titulo": "Mes 9–10 | Primeros frutos",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Pequeñas manifestaciones externas de todo lo trabajado dentro. No es el final, es el anuncio. Es posible que necesites ajustar expectativas y ser flexible ante el cambio.'"
    },
    "mes_12": {
      "titulo": "Mes 12 | Cierre",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Sensación de coherencia interna. Preparación para un nuevo ciclo mucho más visible. Libera cualquier miedo o duda que te haya limitado.'"
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

  "sintesis_final": {
    "frase_cierre_potente": "3-4 frases CORTAS Y POTENTES (60-80 palabras MÁXIMO). Tono directo, sin metáforas. Ejemplo: 'Este no es un año para demostrar quién eres. Es un año para recordarlo en silencio. Lo que no sanes ahora, te perseguirá después. Lo que integres, será tu base futura.'",
    "pregunta_final": "Una pregunta reflexiva (10-15 palabras). Ejemplo: '¿Qué pequeña acción hoy honraría la dirección de este año?'"
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

### 1. JERARQUÍA, NO IGUALDAD:
❌ NO HAGAS: Desarrollar todos los planetas por igual
✅ SÍ HAZLO: Identifica qué planetas tienen MÁS PESO este año:
   - Sol + Saturno + planetas en casas angulares → MÁS DESARROLLO (200 palabras)
   - Mercurio + Luna → DESARROLLO MEDIO (150 palabras)
   - Venus + Marte + Júpiter → DESARROLLO SINTÉTICO (120 palabras)

### 2. GUIAR, NO DESCRIBIR:
❌ NO HAGAS: "Este año será intenso y transformador"
✅ SÍ HAZLO: "Este año no está diseñado para empujar hacia afuera, sino para reordenarte por dentro"

Cada párrafo debe CONDUCIR A UNA COMPRENSIÓN CLARA, no solo describir.

### 3. TONO DIRECTO Y POTENTE:
✅ Frases cortas
✅ Sin metáforas largas
✅ Contraste claro (quién eres vs qué pide el año)
✅ Ejemplos concretos con casas reales: "Natal Sol Casa 3 (comunicación) vs SR Sol Casa 10 (liderazgo público)"

### 4. USA INTERPRETACIONES NATALES:
${natalInterpretations ? '✅ SE HAN PROPORCIONADO INTERPRETACIONES NATALES. ÚSALAS en natal.descripcion de cada planeta. Extrae la esencia de quién ES la persona.' : 'No hay interpretaciones natales. Genera descripciones de identidad permanente basadas en la carta natal.'}

### 5. LA SÍNTESIS FINAL ES CRÍTICA:
La "sintesis_final" debe ser TU FRASE MÁS POTENTE.
Es lo que el usuario recordará. Hazla valer.

Ejemplo:
"Este no es un año para demostrar quién eres. Es un año para recordarlo en silencio. Lo que no sanes ahora, te perseguirá después. Lo que integres, será tu base futura."

### 6. NO INCLUYAS:
❌ Formación Temprana (solo para Natal)
❌ Estructura tooltip/drawer en interpretación principal
❌ Metáforas largas o lenguaje vago
❌ Primer nombre usado en exceso (máximo 2-3 veces)

### 7. LÍNEA DE TIEMPO SINTÉTICA:
Cada periodo debe ser CONCISO (50-70 palabras). No párrafos largos.

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
