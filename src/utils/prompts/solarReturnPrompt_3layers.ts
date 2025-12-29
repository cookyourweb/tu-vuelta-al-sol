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
    "tema_central": "Una frase de 10-15 palabras. DIRECCIÓN CLARA + PROPÓSITO. Ejemplo: 'Un año de retiro consciente para redefinir tu identidad antes de un nuevo comienzo visible'",
    "eje_del_ano": "1-2 frases POTENTES (40-60 palabras MÁXIMO). ¿Qué está pasando REALMENTE? NO describir, DIRIGIR. Ejemplo: 'Este año no está diseñado para empujar hacia afuera, sino para reordenarte por dentro. La energía general te lleva a un proceso de cierre, limpieza y redefinición de identidad.'",
    "como_se_siente": "1 párrafo (80-100 palabras). Ritmo del año + tipo de decisiones. CONCRETO, NO METAFÓRICO. SIN REPETIR la misma idea varias veces. UNA SOLA VEZ cada concepto. Termina con FRASE DE CONSECUENCIA. Ejemplo: 'No es un año de visibilidad constante, sino de gestación interna. Las decisiones no llegarán como grandes revelaciones, sino como pequeños ajustes cotidianos que exigen honestidad brutal. Este no es un año para acelerar, sino para depurar. Si escuchas, avanzas. Si fuerzas, te agotas.'",
    "conexion_natal": "1 párrafo (70-90 palabras). Conecta QUIÉN ES (natal) con LO QUE PIDE EL AÑO (solar). USAR CONTRASTE CLARO + FRASE DE DIRECCIÓN EVOLUTIVA. Ejemplo: 'Con Sol natal en Acuario Casa 1, tu naturaleza es: independiente, visible, orientada a marcar tu propio camino. Pero este año, con el Sol SR en Casa 12, la vida te pide lo contrario: bajar el ritmo, soltar la necesidad de definirte externamente, explorar lo que no se ve. 👉 Este año no anula tu naturaleza acuariana: la está preparando para su siguiente versión.'"
  },

  "como_se_vive_siendo_tu": {
    "facilidad": "40-60 palabras. Lista de 3-4 items. Ejemplo: '✅ Soledad elegida · Reflexión profunda · Conexión espiritual o psicológica · Procesos creativos privados'",
    "incomodidad": "40-60 palabras. Lista de 3-4 items. Ejemplo: '⚠️ Falta de resultados visibles inmediatos · Sensación de estar parado · Menos validación externa'",
    "medida_del_ano": "60-80 palabras. UNA FRASE DIRECTA sobre cómo NO medir el año + cómo SÍ medirlo. Ejemplo: '👉 Si mides este año con criterios de productividad externa, sentirás frustración. Si lo mides por coherencia interna, será uno de los más importantes de tu vida.'",
    "reflejos_obsoletos": "30-50 palabras. Lista de 3 items con LENGUAJE ACTIVO. Ejemplo: 'Buscar validación externa antes de actuar · Definirte por tus logros visibles · Reaccionar emocionalmente antes de comprender'",
    "actitud_nueva": "30-50 palabras. Lista de 3 items con LENGUAJE ACTIVO. Ejemplo: 'Elegir validarte desde dentro · Confiar en procesos invisibles · Pausar antes de responder'"
  },

  "comparaciones_planetarias": {
    "sol": {
      "natal": {
        "posicion": "${natalSol?.sign} en Casa ${natalSol?.house}",
        "descripcion": "60-80 palabras. ¿QUIÉN ERES en esencia? Tu propósito vital base. ${natalInterpretations?.sol ? 'Usa la interpretación natal guardada como base.' : 'Genera descripción de identidad permanente.'}"
      },
      "solar_return": {
        "posicion": "${srSol?.sign} (mismo signo) en Casa ${srSol?.house} SR",
        "descripcion": "60-80 palabras. ¿QUÉ ÁREA DE VIDA SE ACTIVA este año? Dónde pones tu energía vital. El Sol SIEMPRE está en el mismo signo natal, pero la CASA SR cambia y marca dónde brillas ESTE AÑO."
      },
      "choque": "100-120 palabras. ¿DÓNDE CHOCA O POTENCIA? Compara quién eres (natal) vs dónde debes brillar este año (SR). Sé MUY ESPECÍFICO con las casas. Ejemplo: 'Normalmente brillas comunicando ideas (Casa 3 natal), pero este año debes brillar liderando públicamente (Casa 10 SR). El choque: tu zona cómoda es hablar/escribir, pero este año necesitas visibilidad y responsabilidad pública.'",
      "que_hacer": "80-100 palabras. ¿QUÉ CONVIENE HACER AHORA? Acción concreta basada en el choque. NO consejos genéricos. Ejemplo: 'No te quedes solo compartiendo ideas (tu zona cómoda Casa 3), comprométete con proyectos donde tengas que liderar visiblemente (Casa 10 SR). Acepta responsabilidades públicas aunque no te sientas 100% preparado.'",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, este planeta te pide X. Si haces Y, fluye. Si haces Z, se bloquea.' Ejemplo: 'Este año tu Sol te pide retirarte y gestarte. Si escuchas, creces. Si fuerzas visibilidad, te agota.'"
    },

    "luna": {
      "natal": {
        "posicion": "${natalLuna?.sign} en Casa ${natalLuna?.house}",
        "descripcion": "60-80 palabras. ¿CÓMO ERES EMOCIONALMENTE? Tu mundo emocional base, qué te da seguridad. ${natalInterpretations?.luna ? 'Usa la interpretación natal guardada.' : 'Genera descripción emocional permanente.'}"
      },
      "solar_return": {
        "posicion": "${srLuna?.sign} en Casa ${srLuna?.house} SR",
        "descripcion": "60-80 palabras. ¿QUÉ NECESITAS EMOCIONALMENTE este año? Dónde buscas seguridad emocional durante este ciclo."
      },
      "choque": "100-120 palabras. Compara necesidad emocional natal vs SR. Ejemplo: 'Natal Luna Cáncer Casa 4 (necesitas hogar/familia) vs SR Luna Capricornio Casa 10 (necesitas logros/estructura). Choque: normalmente te sientes seguro en casa, pero este año necesitas sentirte seguro logrando cosas públicamente.'",
      "que_hacer": "80-100 palabras. Acción emocional concreta.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, tu Luna te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    },

    "mercurio": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "60-80 palabras. ¿CÓMO PIENSAS Y TE COMUNICAS normalmente? ${natalInterpretations?.mercurio ? 'Usa interpretación natal.' : 'Genera descripción mental permanente.'}"
      },
      "solar_return": {
        "posicion": "${srMercurio?.sign} en Casa ${srMercurio?.house} SR",
        "descripcion": "60-80 palabras. ¿DÓNDE Y CÓMO DEBES PENSAR/COMUNICAR este año?"
      },
      "choque": "80-100 palabras. Comparar estilo mental natal vs SR.",
      "que_hacer": "70-90 palabras. Acción mental concreta.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, Mercurio te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    },

    "venus": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "60-80 palabras. ¿CÓMO AMAS Y QUÉ VALORAS? ${natalInterpretations?.venus ? 'Usa interpretación natal.' : 'Genera descripción de valores permanente.'}"
      },
      "solar_return": {
        "posicion": "${srVenus?.sign} en Casa ${srVenus?.house} SR",
        "descripcion": "60-80 palabras. ¿QUÉ DEBES VALORAR Y CÓMO AMAR este año?"
      },
      "choque": "80-100 palabras. Comparar valores natales vs SR.",
      "que_hacer": "70-90 palabras. Acción relacional concreta.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, Venus te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    },

    "marte": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "60-80 palabras. ¿CÓMO ACTÚAS Y ENFRENTAS LA VIDA? ${natalInterpretations?.marte ? 'Usa interpretación natal.' : 'Genera descripción de acción permanente.'}"
      },
      "solar_return": {
        "posicion": "${srMarte?.sign} en Casa ${srMarte?.house} SR",
        "descripcion": "60-80 palabras. ¿DÓNDE Y CÓMO DEBES ACTUAR este año?"
      },
      "choque": "80-100 palabras. Comparar estilo de acción natal vs SR.",
      "que_hacer": "70-90 palabras. Acción concreta de iniciativa.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, Marte te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    },

    "jupiter": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "60-80 palabras. ¿DÓNDE CRECES Y QUÉ TE DA FE? ${natalInterpretations?.jupiter ? 'Usa interpretación natal.' : 'Genera descripción de expansión permanente.'}"
      },
      "solar_return": {
        "posicion": "${srJupiter?.sign} en Casa ${srJupiter?.house} SR",
        "descripcion": "60-80 palabras. ¿DÓNDE SE EXPANDE TU VIDA este año?"
      },
      "choque": "80-100 palabras. Comparar área de expansión natal vs SR.",
      "que_hacer": "70-90 palabras. Cómo aprovechar la expansión.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, Júpiter te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    },

    "saturno": {
      "natal": {
        "posicion": "Describir signo y casa natal",
        "descripcion": "60-80 palabras. ¿DÓNDE ESTÁN TUS LÍMITES Y RESPONSABILIDADES BASE? ${natalInterpretations?.saturno ? 'Usa interpretación natal.' : 'Genera descripción de estructura permanente.'}"
      },
      "solar_return": {
        "posicion": "${srSaturno?.sign} en Casa ${srSaturno?.house} SR",
        "descripcion": "60-80 palabras. ¿QUÉ DEBES ESTRUCTURAR/LIMITAR este año?"
      },
      "choque": "80-100 palabras. Comparar área de límites natal vs SR.",
      "que_hacer": "70-90 palabras. Cómo trabajar con los límites del año.",
      "mandato_del_ano": "UNA FRASE DIRECTIVA (15-25 palabras). Formato: 'Este año, Saturno te pide X. Si haces Y, fluye. Si haces Z, se bloquea.'"
    }
  },

  "linea_tiempo_anual": {
    "mes_1_2": {
      "titulo": "Mes 1–2 | Activación",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Retiro, introspección, sueños intensos. Observa más de lo que actúas. Presta atención a los mensajes internos que surgen.'",
      "accion_clave": "Una acción específica (3-5 palabras). Ejemplo: 'Observar sin decidir'"
    },
    "mes_3_4": {
      "titulo": "Mes 3–4 | Primer ajuste",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Situaciones que te obligan a expresarte con más honestidad. No puedes seguir callando lo esencial. ¿Cómo puedes comunicarte de manera más auténtica?'",
      "accion_clave": "Una acción específica (3-5 palabras). Ejemplo: 'Decir lo que llevas callando'"
    },
    "mes_6_7": {
      "titulo": "Mes 6–7 | Punto medio",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Comprensión clara de qué identidad ya no te representa. Decisiones internas importantes. No puedes ignorar la necesidad de alinearte con tus valores auténticos.'",
      "accion_clave": "Una acción específica (3-5 palabras). Ejemplo: 'Soltar una identidad'"
    },
    "mes_9_10": {
      "titulo": "Mes 9–10 | Primeros frutos",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Pequeñas manifestaciones externas de todo lo trabajado dentro. No es el final, es el anuncio. Es posible que necesites ajustar expectativas y ser flexible ante el cambio.'",
      "accion_clave": "Una acción específica (3-5 palabras). Ejemplo: 'Mostrar algo nuevo'"
    },
    "mes_12": {
      "titulo": "Mes 12 | Cierre",
      "descripcion": "50-70 palabras. SINTÉTICO. Ejemplo: 'Sensación de coherencia interna. Preparación para un nuevo ciclo mucho más visible. Libera cualquier miedo o duda que te haya limitado.'",
      "accion_clave": "Una acción específica (3-5 palabras). Ejemplo: 'Cerrar con conciencia'"
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

  "uso_calendario_lunar": {
    "marco_general": "80-100 palabras. CÓMO USAR las lunas este año específico. Ejemplo: 'Este no es un año para iniciar grandes proyectos en luna nueva, sino para observar qué emerge. 🌑 Lunas Nuevas → intención interna, siembra silenciosa. 🌕 Lunas Llenas → cierre emocional, comprensión, liberación. Las lunas funcionan como marcadores de ritmo interno, no de acción externa.'",
    "lunas_clave": [
      {
        "fase": "Luna Nueva o Luna Llena",
        "fecha_aproximada": "YYYY-MM-DD",
        "signo": "Signo zodiacal",
        "por_que_es_clave": "60-80 palabras. Por qué esta luna es especialmente importante ESTE AÑO para ESTE usuario. Conectar con temas del SR."
      },
      {
        "fase": "Luna Nueva o Luna Llena",
        "fecha_aproximada": "YYYY-MM-DD",
        "signo": "Signo zodiacal",
        "por_que_es_clave": "60-80 palabras."
      },
      {
        "fase": "Luna Nueva o Luna Llena",
        "fecha_aproximada": "YYYY-MM-DD",
        "signo": "Signo zodiacal",
        "por_que_es_clave": "60-80 palabras."
      }
    ]
  },

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

### 3. TONO DIRECTO Y FUNCIONAL (CRÍTICO):
❌ NO uses metáforas poéticas, lenguaje místico ni tono épico
❌ NO uses palabras como: "arquetipo cósmico", "portal", "misión del alma", "revolución interna", "superpoder"
❌ NO escribas en mayúsculas enfáticas ni uses emojis excesivos en el texto
❌ NO uses tono motivacional inspiracional
✅ Usa lenguaje psicológico y conductual
✅ Describe comportamientos observables y situaciones concretas
✅ Frases cortas y directas
✅ Contraste claro (quién eres vs qué pide el año)
✅ Ejemplos concretos con casas reales: "Natal Sol Casa 3 (comunicación) vs SR Sol Casa 10 (liderazgo público)"
✅ Tono adulto, analítico, claro

### 4. USA INTERPRETACIONES NATALES:
${natalInterpretations ? '✅ SE HAN PROPORCIONADO INTERPRETACIONES NATALES. ÚSALAS en natal.descripcion de cada planeta. Extrae la esencia de quién ES la persona.' : 'No hay interpretaciones natales. Genera descripciones de identidad permanente basadas en la carta natal.'}

### 5. LA SÍNTESIS FINAL:
La "sintesis_final" debe ser clara, directa y funcional.
Evita lenguaje poético. Usa tono psicológico.

Ejemplo de TONO CORRECTO:
"Este año no se trata de mostrar resultados, sino de reorganizar tu identidad desde dentro. Los cambios que hagas ahora en privado definirán tu próximo ciclo público."

Ejemplo de TONO INCORRECTO:
"Este es tu portal de transformación cósmica. Tu misión del alma se revela en el silencio sagrado."

### 6. NO INCLUYAS:
❌ Formación Temprana (solo para Natal)
❌ Estructura tooltip/drawer en interpretación principal
❌ Metáforas largas o lenguaje vago
❌ Primer nombre usado en exceso (máximo 2-3 veces)

### 7. LÍNEA DE TIEMPO SINTÉTICA:
Cada periodo debe ser CONCISO (50-70 palabras). No párrafos largos.
INCLUIR acción_clave por cada fase (3-5 palabras accionables).

### 8. CALENDARIO LUNAR - NO LISTAR TODO:
❌ NO HAGAS: Listar 24 fechas (12 lunas nuevas + 12 lunas llenas)
✅ SÍ HAZLO:
   - Marco general: CÓMO usar las lunas este año (80-100 palabras)
   - 3 LUNAS CLAVE: Las más importantes para ESTE usuario ESTE año
   - Conectar con temas específicos del SR

### 9. MANDATOS PLANETARIOS:
Cada planeta debe terminar con una FRASE DE MANDATO:
"Este año, [planeta] te pide X. Si haces Y, fluye. Si haces Z, se bloquea."

Esto convierte interpretación en guía accionable.

### 10. DESCRIPCIONES PLANETARIAS - LENGUAJE CONCRETO:
Para cada planeta (natal.descripcion, solar_return.descripcion, choque, que_hacer):

❌ NO ESCRIBAS: "Eres un arquitecto del lenguaje cuya misión cósmica es..."
❌ NO ESCRIBAS: "Tu superpoder está en transformar cada conversación en un acto de creación consciente"
✅ SÍ ESCRIBE: "Tu proceso de maduración está ligado a la expresión creativa y la comunicación. Desde temprano, puedes haber sentido que expresarte libremente no era tan sencillo."

❌ NO ESCRIBAS: "El gran maestro cósmico te presenta desafíos para forjar tu carácter"
✅ SÍ ESCRIBE: "Esta posición te pide aprender a estructurar tu creatividad y asumir responsabilidad sobre lo que comunicas."

Usa verbos de acción, comportamientos observables y situaciones concretas.

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
