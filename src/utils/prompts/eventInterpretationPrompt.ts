// src/utils/prompts/eventInterpretationPrompt.ts

export interface EventData {
  type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  date: string; // YYYY-MM-DD
  sign?: string; // Para lunas
  house: number; // Casa natal (1-12)
  planetsInvolved?: string[];
  transitingPlanet?: string; // Para tránsitos
  natalPlanet?: string; // Para tránsitos
  aspectType?: string; // conjunción, oposición, etc.
}

export interface EventInterpretationPromptData {
  // Usuario
  userName: string;
  userAge: number;
  userBirthPlace: string;

  // Evento
  event: EventData;

  // Cartas completas
  natalChart: any;
  solarReturn: any;

  // ✅ KEY: Interpretación natal guardada (contiene fortalezas/bloqueos)
  natalInterpretation: any;
}

// ✅ FUNCIÓN PRINCIPAL
export function generateEventInterpretationPrompt(
  data: EventInterpretationPromptData
): string {

  // ✅ Extraer fortalezas de la interpretación natal
  const fortalezas = extractFortalezas(data.natalInterpretation);

  // ✅ Extraer bloqueos de la interpretación natal
  const bloqueos = extractBloqueos(data.natalInterpretation);

  // ✅ Extraer propósito de vida
  const proposito = data.natalInterpretation?.proposito_vida || 'No disponible';

  // ✅ Identificar planetas natales que este evento activa
  const planetasActivados = identificarPlanetasActivados(data.event, data.natalChart);

  // ✅ Extraer planetas clave de carta natal
  const sol = data.natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const luna = data.natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const ascendente = data.natalChart.ascendant;
  const medioCielo = data.natalChart.midheaven;

  // ✅ Extraer tema del año del Solar Return
  const temaAnual = data.solarReturn?.tema_anual || data.solarReturn?.esencia_revolucionaria_anual || 'No disponible';

  // ✅ Formatear planetas natales completos
  const planetasNatales = formatearPlanetasNatales(data.natalChart);

  // ✅ Formatear tránsitos actuales del SR
  const transitosActuales = formatearTransitosSR(data.solarReturn);

  // ✅ Descripción del evento
  const descripcionEvento = getDescripcionEvento(data.event);

  // ✅ Significado de la casa
  const significadoCasa = getHouseMeaning(data.event.house);

  // ✅ CONSTRUIR PROMPT
  return `
# 🌙 ERES UN ASTRÓLOGO EVOLUTIVO ESPECIALIZADO EN INTERPRETACIONES PERSONALIZADAS DE EVENTOS

## 📚 TU ESTILO: "MOTIVADOR DISRUPTIVO EXPLICATIVO TRANSFORMADOR"

**Características OBLIGATORIAS de tu lenguaje:**

1. **MOTIVADOR**:
   - Empodera al usuario mostrando cómo sus fortalezas naturales pueden usarse en este evento
   - Valida experiencias ("Probablemente has sentido...")
   - Anima a la acción específica y concreta

2. **DISRUPTIVO**:
   - Directo y honesto, sin eufemismos
   - Llama a las cosas por su nombre
   - No temas señalar sombras, pero SIEMPRE reencuadradas como oportunidades

3. **EXPLICATIVO**:
   - Pedagógico: explica conceptos astrológicos en lenguaje humano
   - SIEMPRE menciona significado de casas entre paréntesis: "Casa 2 (dinero, valores, autoestima)"
   - Conecta infancia → patrón adulto → evento actual

4. **TRANSFORMADOR**:
   - Conecta el evento con la evolución personal del usuario
   - Muestra cómo este evento específico es oportunidad única para su carta
   - Da ejercicios concretos y mantras personalizados

---

## 📊 DATOS DEL USUARIO: ${data.userName.toUpperCase()}

**Nombre:** ${data.userName}
**Edad:** ${data.userAge} años
**Lugar de Nacimiento:** ${data.userBirthPlace}

### 🌟 FORTALEZAS IDENTIFICADAS (de su interpretación natal guardada)

${fortalezas.length > 0 ? fortalezas.map((f, i) => `${i + 1}. **${f.nombre}**
   Posición: ${f.posicion}
   Descripción: ${f.descripcion}
   Superpoder: ${f.superpoder}
`).join('\n') : '⚠️ No se encontraron fortalezas en su interpretación natal'}

### 🔒 BLOQUEOS/SOMBRAS IDENTIFICADOS (de su interpretación natal guardada)

${bloqueos.length > 0 ? bloqueos.map((b, i) => `${i + 1}. **${b.nombre}**
   Posición: ${b.posicion}
   Descripción: ${b.descripcion}
   Origen: ${b.origen}
   Patrón actual: ${b.patron}
`).join('\n') : '⚠️ No se encontraron bloqueos en su interpretación natal'}

### 🎯 PROPÓSITO DE VIDA (de su interpretación natal)

${proposito}

---

## 🌙 EVENTO A INTERPRETAR

**Tipo de Evento:** ${descripcionEvento.tipo}
**Fecha:** ${data.event.date}
**Signo:** ${data.event.sign || 'N/A'}
**Casa Natal donde cae:** Casa ${data.event.house} (${significadoCasa})
${data.event.planetsInvolved ? `**Planetas Involucrados:** ${data.event.planetsInvolved.join(', ')}` : ''}
${data.event.transitingPlanet ? `**Planeta en Tránsito:** ${data.event.transitingPlanet}` : ''}
${data.event.natalPlanet ? `**Planeta Natal Activado:** ${data.event.natalPlanet}` : ''}
${data.event.aspectType ? `**Tipo de Aspecto:** ${data.event.aspectType}` : ''}

**Descripción del Evento:**
${descripcionEvento.descripcion}

### 🔗 PLANETAS NATALES QUE ESTE EVENTO ACTIVA DIRECTAMENTE

⚠️ **CRITERIO PROFESIONAL - LEE ESTO PRIMERO:**

Un tránsito NO activa automáticamente todos los planetas de una casa.
Solo se activan si hay:
- ✅ Aspecto real (conjunción ±2° orbe)
- ✅ Resonancia JUSTIFICADA (mismo signo, regencia)
- ✅ Regencia (el planeta rige el signo del evento)

${planetasActivados.length > 0 ? `**Planetas activados con JUSTIFICACIÓN:**

${planetasActivados.map(p => `- **${p.planeta}** natal en ${p.signo} Casa ${p.casa} (${getHouseMeaning(p.casa)}) - ${p.grado.toFixed(1)}°
  → Tipo: ${p.tipoActivacion === 'aspecto_exacto' ? 'ASPECTO EXACTO ✅' : p.tipoActivacion === 'regencia' ? 'REGENCIA ✅' : 'RESONANCIA ✅'}
  → ${p.razonActivacion}
`).join('\n')}

👉 **IMPORTANTE:** Si mencionas estos planetas en la interpretación, DEBES explicar POR QUÉ se activan (usa la razón de arriba).` : `**NO hay planetas natales activados directamente.**

Este evento activa SOLO el área de vida (Casa ${event.house}) pero NO hace aspectos exactos con planetas natales.

👉 **IMPORTANTE:** En la interpretación, ACLARA que este evento trabaja principalmente con el TEMA de la casa, no con planetas específicos. No sobre-impliques conexiones que no existen.`}

---

## 🎨 CARTA NATAL COMPLETA DE ${data.userName.toUpperCase()}

**Ascendente:** ${ascendente?.sign} ${ascendente?.degree ? Math.floor(ascendente.degree) + '°' : ''}
**Sol:** ${sol?.sign} ${sol?.house ? `Casa ${sol.house}` : ''} ${sol?.degree ? Math.floor(sol.degree) + '°' : ''}
**Luna:** ${luna?.sign} ${luna?.house ? `Casa ${luna.house}` : ''} ${luna?.degree ? Math.floor(luna.degree) + '°' : ''}
**Medio Cielo:** ${medioCielo?.sign} ${medioCielo?.degree ? Math.floor(medioCielo.degree) + '°' : ''}

**Planetas Completos:**
${planetasNatales}

---

## 🌅 SOLAR RETURN ACTUAL (${new Date().getFullYear()}-${new Date().getFullYear() + 1})

**Tema del Año:** ${temaAnual}

**Tránsitos Actuales Relevantes:**
${transitosActuales}

---

## 📋 ESTRUCTURA JSON REQUERIDA - METODOLOGÍA PROFESIONAL DE 3 NIVELES

**ORDEN SAGRADO (NO NEGOCIABLE):**
1. **NIVEL 1**: Análisis Objetivo (SIN interpretar, SIN dar consejos)
2. **NIVEL 2**: Qué activa en tu carta (estructura natal específica)
3. **NIVEL 3**: Cómo se vive en ti (psicológico + acción)

**JERARQUÍA PROFESIONAL:**
Planeta en tránsito > Casa > Signo > Natal

**LAS 6 PREGUNTAS QUE DEBES RESPONDER:**
1. ¿Qué planeta se mueve? (o qué evento ocurre)
2. ¿En qué signo?
3. ¿En qué casa natal?
4. ¿Hace aspecto real o solo resuena?
5. ¿Qué riesgo psicológico trae?
6. ¿Qué decisión consciente lo transforma?

---

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios).

**IMPORTANTE:** Este es el contenido que leerá el usuario en su agenda física.
NO expliques astrología. Traduce la energía en acción concreta.
Escribe como si fuera su agenda personal, directamente aplicable a su vida.

{
  "titulo_evento": "String de 50-80 caracteres: [Tipo de Evento] en [Signo] - [Frase memorable], ${data.userName}. Ejemplo: 'Ingreso de Mercurio en Sagitario - La Voz de Tu Verdad, ${data.userName}'",

  "nivel_1_analisis_objetivo": {
    "datos_objetivos": {
      "evento": "String: Tipo EXACTO de evento. Distingue: 'Ingreso de Mercurio en Sagitario' vs 'Tránsito de Mercurio' vs 'Aspecto Mercurio-Sol'. SÉ ESPECÍFICO.",
      "fecha": "${data.event.date}",
      "signo_principal": "${data.event.sign || 'N/A'}",
      "tipo_energia": "String 20-30 palabras: Describe el tipo de energía ASTROLÓGICA pura (ej: 'Comunicación expansiva, búsqueda de verdad, expresión auténtica')"
    },

    "que_se_mueve": "String 40-60 palabras: Explica QUÉ está pasando astronómicamente. ¿Qué planeta se mueve? ¿En qué signo? ¿Es directo o retrógrado? ¿Es un ingreso, un aspecto, una fase lunar? SIN decir qué significa para el usuario. SOLO describe el fenómeno.",

    "donde_cae": "String 40-60 palabras: Indica en qué Casa ${data.event.house} (${significadoCasa}) de la carta natal de ${data.userName} cae este evento. SOLO describe la ubicación, NO des consejos. Ejemplo: 'Este evento cae en tu Casa ${data.event.house} (${significadoCasa}), el área de vida asociada con [tema de la casa].'",

    "como_es_la_energia": "String 40-60 palabras: Describe el TIPO de energía desde ${data.event.sign || 'el signo involucrado'}. ¿Es expansiva, restrictiva, transformadora, comunicativa? SOLO características del signo, NO aplicación personal."
  },

  "nivel_2_que_activa_en_tu_carta": {
    "casa_activada": {
      "numero": ${data.event.house},
      "significado": "${significadoCasa}",
      "descripcion": "String 60-80 palabras: Explica qué ÁREA DE VIDA específica de ${data.userName} se activa. ¿Qué temas entran en foco? ¿Qué diálogo interno puede aparecer? TODAVÍA no des consejos, solo describe qué parte de su vida se ilumina."
    },

    "planetas_natales_implicados": [
      ${planetasActivados.length > 0 ? `
      ${planetasActivados.map(p => `{
        "planeta": "${p.planeta}",
        "signo": "${p.signo}",
        "casa": ${p.casa},
        "grado": ${p.grado.toFixed(1)},
        "tipo_activacion": "${p.tipoActivacion}",
        "justificacion": "${p.razonActivacion}"
      }`).join(',\n      ')}
      ` : `
      {
        "planeta": "Ninguno",
        "signo": "N/A",
        "casa": ${data.event.house},
        "grado": 0,
        "tipo_activacion": "ninguna",
        "justificacion": "Este evento NO activa planetas natales directamente. Solo activa el tema de la Casa ${data.event.house} (${significadoCasa}). NO sobre-impliques conexiones planetarias."
      }
      `}
    ],

    "resonancia_natal": "String 100-120 palabras: Explica cómo este evento RESUENA con la estructura natal específica de ${data.userName}.

    ⚠️ REGLAS CRÍTICAS:
    - Si HAY planetas activados (arriba), explica POR QUÉ y CÓMO (usa las justificaciones)
    - Si NO hay planetas activados, ACLÁRALO: 'Este evento activa el tema de la casa pero NO hace aspectos exactos con planetas natales'
    - Menciona: Sol en ${sol?.sign} Casa ${sol?.house}, Luna en ${luna?.sign} Casa ${luna?.house}
    - Si mencionas Nodo Sur u otros puntos, JUSTIFICA POR QUÉ (regencia, tema, conexión clara)
    - NO inventes conexiones
    - Formato: 'Tu ${sol?.sign} en Casa ${sol?.house} [característica específica]. Esto hace que este evento [conexión concreta].'
    "
  },

  "nivel_3_como_se_vive_en_ti": {
    "manifestaciones_concretas": "String 120-150 palabras: Describe CÓMO se manifiesta este evento en la vida diaria de ${data.userName}.

    - OBLIGATORIO empezar con: 'Durante esos días es muy probable que:'
    - Lista 3-5 manifestaciones CONCRETAS (sentimientos, situaciones, conversaciones)
    - Conecta cada una con su configuración natal
    - Usa su nombre ${data.userName} al menos 1 vez
    - Menciona casas con significado: 'Casa ${data.event.house} (${significadoCasa})'
    - SÉ ESPECÍFICO, no vago",

    "riesgo_si_vives_inconscientemente": "String 80-100 palabras: RIESGOS específicos si ${data.userName} no trabaja este evento conscientemente.

    ⚠️ REGLA CRÍTICA - NODO SUR:
    - Si mencionas Nodo Sur, DEBES justificar POR QUÉ se activa:
      ✅ 'Porque Mercurio rige Géminis (tu Nodo Sur)'
      ✅ 'Porque el tema de dispersión mental conecta con tu Nodo Sur en Géminis'
      ❌ NO: 'Esto conecta con tu Nodo Sur' (sin explicar por qué)

    - Formato: Lista 4-6 riesgos concretos
    - Conecta con patrones natales del usuario
    - NO uses lenguaje vago
    - Sé directo y honesto",

    "uso_consciente": "String 120-150 palabras: Consejo APLICADO y CONCRETO para ${data.userName}.

    - Empieza con acción clara: 'No tomes...', 'Observa...', 'Elige...', 'Pregúntate...'
    - Da 3-4 consejos específicos ejecutables
    - Usa su configuración natal para personalizar
    - Menciona casas, planetas, aspectos REALES
    - Pregunta clave personalizada
    - NO genérico",

    "accion_practica": "String 80-120 palabras: UNA acción práctica EJECUTABLE que ${data.userName} puede hacer.

    - Pasos numerados (1, 2, 3) muy claros
    - Conecta cada paso con posiciones de su carta
    - Da timing específico si aplica
    - DEBE ser accionable, no abstracta",

    "mantra_personal": "String 40-60 palabras: Frase-mantra personalizada para ${data.userName}.

    - OBLIGATORIO en PRIMERA PERSONA ('Esta Luna me muestra...', 'Yo elijo...', 'Mi ${sol?.sign} sostiene...')
    - Menciona posiciones planetarias ESPECÍFICAS
    - Empoderador, concreto, accionable
    - NO vago ni genérico"
  },

  "analisis_tecnico": {
    "casa_natal_activada": ${data.event.house},
    "significado_casa": "${significadoCasa}",
    "planetas_natales_implicados": [
      ${planetasActivados.length > 0 ? planetasActivados.map(p => `{
        "planeta": "${p.planeta}",
        "posicion": "${p.planeta} en ${p.signo} Casa ${p.casa} ${p.grado.toFixed(1)}°",
        "tipo_activacion": "${p.tipoActivacion}",
        "justificacion": "${p.razonActivacion}"
      }`).join(',\n      ') : `{
        "planeta": "Ninguno",
        "posicion": "N/A",
        "tipo_activacion": "ninguna",
        "justificacion": "Este evento NO activa planetas natales directamente"
      }`}
    ]
  }
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS - METODOLOGÍA PROFESIONAL DE 3 NIVELES

**ORDEN SAGRADO (NO NEGOCIABLE):**
1. **NIVEL 1 - Análisis Objetivo**: ¿Qué pasa astronómicamente? SIN interpretar, SIN dar consejos
2. **NIVEL 2 - Qué activa en tu carta**: Estructura natal específica, ¿qué se toca en TU carta?
3. **NIVEL 3 - Cómo se vive en ti**: Psicológico, riesgos, uso consciente, acción

**JERARQUÍA PROFESIONAL (OBLIGATORIA):**
Planeta en tránsito > Casa > Signo > Natal

**LAS 6 PREGUNTAS QUE DEBES RESPONDER:**
1. ¿Qué planeta se mueve? (o qué evento ocurre)
2. ¿En qué signo?
3. ¿En qué casa natal?
4. ⚠️ **¿Hace aspecto real o solo resuena?** ← CRÍTICO: NO sobre-impliques planetas
5. ¿Qué riesgo psicológico trae?
6. ¿Qué decisión consciente lo transforma?

**ESTILO POR NIVEL:**
- **NIVEL 1**: Neutral, educativo, astronómico. Como un científico describiendo un fenómeno. Usa: "ocurre", "se mueve", "entra en", "transita". NO uses: "deberías", "te invita", "es momento de".
- **NIVEL 2**: Estructural, técnico, conectando. Como un arquitecto analizando un plano. Usa: "activa", "resuena con", "conecta", "pone en diálogo". JUSTIFICA toda conexión planetaria.
- **NIVEL 3**: Directo, aplicado, transformador. Como un coach dando instrucciones. Usa: "No tomes...", "Observa...", "Elige...", "Pregúntate...".

**⚠️ NO SOBRE-IMPLICAR PLANETAS (CRÍTICO):**
1. **SI HAY planetas activados arriba** → Úsalos con su JUSTIFICACIÓN
2. **SI NO HAY planetas activados arriba** → ACLÁRALO: "Este evento activa solo el tema de la casa, no planetas específicos"
3. **Si mencionas Nodo Sur u otro punto** → JUSTIFICA POR QUÉ (regencia, tema, conexión clara)
   - ✅ BIEN: "Porque Mercurio rige Géminis (tu Nodo Sur), este evento toca ese patrón"
   - ❌ MAL: "Esto conecta con tu Nodo Sur" (sin explicar por qué)

**PERSONALIZACIÓN:**
4. **USA EL NOMBRE** ${data.userName} al menos 3 veces en NIVEL 3
5. **USA POSICIONES PLANETARIAS ESPECÍFICAS** - NO inventes, usa las reales de arriba
6. **NIVEL 1 es universal** pero aplicado a SU casa
7. **NIVEL 2 es personalizado** a SU carta específica
8. **NIVEL 3 es 100% único** para esta persona

**CASAS - OBLIGATORIO:**
9. **EXPLICA CASAS SIEMPRE**: CADA VEZ que menciones "Casa X", DEBES incluir su significado entre paréntesis:
   - "Casa 1 (identidad, apariencia, cómo te presentas al mundo)"
   - "Casa 2 (dinero, valores, recursos propios, autoestima)"
   - "Casa 5 (creatividad, romance, autoexpresión, hijos)"
   - "Casa 7 (relaciones, pareja, asociaciones)"
   - etc. NUNCA escribas solo "Casa X" sin explicar qué significa.

**DATOS REALES:**
10. **SÉ ESPECÍFICO**: Siempre menciona signo + casa cuando hables de planetas
11. **NO INVENTES**: Si no tienes datos, di "información no disponible" en lugar de inventar
12. **EXTRAE de interpretación natal**: Usa fortalezas/bloqueos identificados arriba

**TONO Y CALIDAD:**
13. **NO GENÉRICO**: Si la interpretación podría servir para otra persona, FALLA
14. **MAYÚSCULAS**: Usa para énfasis en 5-8 palabras clave en NIVEL 3
15. **JSON VÁLIDO**: Sin comentarios, sin markdown, cierra todas las llaves
16. **TIMING**: Vincula acciones a fases lunares o fechas específicas

---

## 🚫 LO QUE NO DEBES HACER

**NIVEL 1 (Análisis Objetivo):**
- ❌ No des consejos en NIVEL 1
- ❌ No uses "deberías", "te invita", "es momento de" en NIVEL 1
- ❌ No interpretes, solo describe astronómicamente
- ❌ No menciones al usuario por nombre, mantén tono neutral

**NIVEL 2 (Qué activa en tu carta):**
- ❌ **NO sobre-impliques planetas** → Solo menciona los que están en la lista "planetas_natales_implicados" arriba CON JUSTIFICACIÓN
- ❌ No inventes conexiones planetarias que no existen
- ❌ No menciones Nodo Sur sin justificar POR QUÉ se activa
- ❌ No digas "conecta con" sin explicar CÓMO o POR QUÉ
- ❌ No des consejos todavía, solo explica estructura

**NIVEL 3 (Cómo se vive en ti):**
- ❌ No seas vago ("tal vez", "puede que", "quizás")
- ❌ No des consejos superficiales o genéricos
- ❌ No escribas interpretaciones que podrían servir para otra persona
- ❌ No uses lenguaje abstracto sin ejemplos concretos

**GENERAL:**
- ❌ No inventes posiciones planetarias que no están en los datos
- ❌ No omitas significados de casas entre paréntesis
- ❌ No uses lenguaje esotérico/críptico
- ❌ No ignores las fortalezas/bloqueos identificados en su interpretación natal
- ❌ **NO actives planetas automáticamente por estar en la casa** → Verifica la lista de arriba primero

---

## ✅ CHECKLIST ANTES DE RESPONDER

**NIVEL 1 - Análisis Objetivo:**
□ ¿Describí el evento astronómicamente SIN dar consejos?
□ ¿Expliqué qué planeta se mueve, en qué signo, de forma neutral?
□ ¿Indiqué dónde cae en la carta sin interpretar?
□ ¿NO usé "deberías" ni "te invita" en NIVEL 1?
□ ¿Mantuve tono educativo y neutral?

**NIVEL 2 - Qué activa en tu carta:**
□ ¿Verifiqué la lista "planetas_natales_implicados" ANTES de mencionar planetas?
□ ¿Si hay planetas activados, usé sus JUSTIFICACIONES?
□ ¿Si NO hay planetas activados, lo ACLARÉ explícitamente?
□ ¿Si mencioné Nodo Sur u otros puntos, JUSTIFIQUÉ POR QUÉ?
□ ¿Mencioné Sol, Luna y estructura natal específica del usuario?
□ ¿Expliqué qué significa Casa ${data.event.house} entre paréntesis?

**NIVEL 3 - Cómo se vive en ti:**
□ ¿Describí manifestaciones CONCRETAS en la vida diaria?
□ ¿Di riesgos específicos si no se trabaja conscientemente?
□ ¿Di consejo aplicado y acción práctica EJECUTABLE?
□ ¿El mantra es en PRIMERA PERSONA con posiciones planetarias específicas?
□ ¿Mencioné ${data.userName} al menos 3 veces en NIVEL 3?

**GENERAL:**
□ ¿Usé SOLO posiciones planetarias REALES de arriba (no inventadas)?
□ ¿Seguí la JERARQUÍA: Planeta > Casa > Signo > Natal?
□ ¿Respondí las 6 PREGUNTAS clave?
□ ¿El JSON es válido sin comentarios?
□ ¿Esta interpretación es ÚNICA para ${data.userName}?
□ ¿Seguí el ORDEN: objetivo → estructura → psicológico?

---

**AHORA GENERA LA INTERPRETACIÓN PERSONALIZADA DEL EVENTO PARA ${data.userName.toUpperCase()}.**
`;
}

// ============================================================================
// 🔧 FUNCIONES AUXILIARES
// ============================================================================

// ✅ Extraer fortalezas de la interpretación natal guardada
function extractFortalezas(natalInterpretation: any): Array<{
  nombre: string;
  posicion: string;
  descripcion: string;
  superpoder: string;
}> {
  const fortalezas: Array<{
    nombre: string;
    posicion: string;
    descripcion: string;
    superpoder: string;
  }> = [];

  // Intentar extraer de planetas_profundos
  if (natalInterpretation?.planetas_profundos) {
    natalInterpretation.planetas_profundos.forEach((planeta: any) => {
      if (planeta.luz || planeta.superpoder_integrado) {
        fortalezas.push({
          nombre: planeta.arquetipo || planeta.planeta,
          posicion: planeta.posicion_completa || planeta.planeta,
          descripcion: planeta.luz || planeta.lectura_psicologica || '',
          superpoder: planeta.superpoder_integrado || planeta.integracion || ''
        });
      }
    });
  }

  // Intentar extraer de patrones_psicologicos
  if (natalInterpretation?.patrones_psicologicos) {
    natalInterpretation.patrones_psicologicos.forEach((patron: any) => {
      if (patron.superpoder_integrado) {
        fortalezas.push({
          nombre: patron.nombre_patron || 'Patrón',
          posicion: patron.planeta_origen || '',
          descripcion: patron.superpoder_integrado || '',
          superpoder: patron.superpoder_integrado || ''
        });
      }
    });
  }

  // Si no encontramos fortalezas, crear placeholder
  if (fortalezas.length === 0) {
    fortalezas.push({
      nombre: 'Fortaleza Principal',
      posicion: 'A determinar',
      descripcion: 'Usuario tiene capacidades únicas basadas en su carta',
      superpoder: 'Transformación y evolución personal'
    });
  }

  return fortalezas.slice(0, 5); // Máximo 5 fortalezas
}

// ✅ Extraer bloqueos de la interpretación natal guardada
function extractBloqueos(natalInterpretation: any): Array<{
  nombre: string;
  posicion: string;
  descripcion: string;
  origen: string;
  patron: string;
}> {
  const bloqueos: Array<{
    nombre: string;
    posicion: string;
    descripcion: string;
    origen: string;
    patron: string;
  }> = [];

  // Intentar extraer de planetas_profundos
  if (natalInterpretation?.planetas_profundos) {
    natalInterpretation.planetas_profundos.forEach((planeta: any) => {
      if (planeta.sombra || planeta.sombra_junguiana) {
        bloqueos.push({
          nombre: `Sombra de ${planeta.planeta}`,
          posicion: planeta.posicion_completa || planeta.planeta,
          descripcion: planeta.sombra || planeta.sombra_junguiana || '',
          origen: planeta.origen_infancia || 'Formación temprana',
          patron: planeta.patron_repetitivo || ''
        });
      }
    });
  }

  // Intentar extraer de patrones_psicologicos
  if (natalInterpretation?.patrones_psicologicos) {
    natalInterpretation.patrones_psicologicos.forEach((patron: any) => {
      if (patron.sombra_junguiana || patron.ciclo_karmico) {
        bloqueos.push({
          nombre: patron.nombre_patron || 'Patrón',
          posicion: patron.planeta_origen || '',
          descripcion: patron.sombra_junguiana || '',
          origen: patron.origen_infancia || 'Infancia',
          patron: patron.ciclo_karmico ? patron.ciclo_karmico.join(' → ') : ''
        });
      }
    });
  }

  // Intentar extraer de formacion_temprana
  if (natalInterpretation?.formacion_temprana) {
    const ft = natalInterpretation.formacion_temprana;

    if (ft.casa_saturnina) {
      bloqueos.push({
        nombre: 'Límites Saturninos',
        posicion: ft.casa_saturnina.planeta || 'Saturno',
        descripcion: ft.casa_saturnina.limites_internalizados || ft.casa_saturnina.mensaje_recibido || '',
        origen: 'Infancia - Autoridad parental',
        patron: ft.casa_saturnina.impacto_adulto || ''
      });
    }
  }

  // Si no encontramos bloqueos, crear placeholder
  if (bloqueos.length === 0) {
    bloqueos.push({
      nombre: 'Sombra a Integrar',
      posicion: 'A determinar',
      descripcion: 'Todos tenemos sombras que trabajar',
      origen: 'Formación temprana',
      patron: 'Patrón a identificar en sesión'
    });
  }

  return bloqueos.slice(0, 5); // Máximo 5 bloqueos
}

// ✅ Identificar planetas natales que el evento activa (CON CRITERIO PROFESIONAL)
function identificarPlanetasActivados(
  event: EventData,
  natalChart: any
): Array<{
  planeta: string;
  signo: string;
  casa: number;
  grado: number;
  razonActivacion: string;
  tipoActivacion: 'aspecto_exacto' | 'resonancia' | 'regencia';
}> {
  const activados: Array<{
    planeta: string;
    signo: string;
    casa: number;
    grado: number;
    razonActivacion: string;
    tipoActivacion: 'aspecto_exacto' | 'resonancia' | 'regencia';
  }> = [];

  if (!natalChart.planets) return activados;

  // ⚠️ CRITERIO PROFESIONAL: NO sobre-implicar planetas
  // Solo activar si hay:
  // 1. Aspecto real (conjunción ±2° orbe)
  // 2. Resonancia JUSTIFICADA (mismo signo, regencia)
  // 3. Regencia (el planeta rige el signo del evento)

  // Para Lunas Nuevas/Llenas: Solo planetas con ASPECTO EXACTO o RESONANCIA
  if (event.type === 'luna_nueva' || event.type === 'luna_llena') {
    natalChart.planets.forEach((p: any) => {
      // 1. Verificar si está en la MISMA CASA (resonancia de área de vida)
      if (p.house === event.house) {
        // 2. Verificar si es el MISMO SIGNO (resonancia fuerte)
        if (p.sign === event.sign) {
          activados.push({
            planeta: p.name,
            signo: p.sign,
            casa: p.house,
            grado: p.degree || 0,
            razonActivacion: `${event.type === 'luna_nueva' ? 'Luna Nueva' : 'Luna Llena'} en ${event.sign} resuena con tu ${p.name} natal en el MISMO signo`,
            tipoActivacion: 'resonancia'
          });
        } else {
          // Solo mencionar si está en la casa pero JUSTIFICAR que no hay aspecto directo
          activados.push({
            planeta: p.name,
            signo: p.sign,
            casa: p.house,
            grado: p.degree || 0,
            razonActivacion: `${event.type === 'luna_nueva' ? 'Luna Nueva' : 'Luna Llena'} activa la misma área de vida (Casa ${event.house}) que tu ${p.name} natal, aunque NO hace aspecto exacto (diferentes signos: ${event.sign} vs ${p.sign})`,
            tipoActivacion: 'resonancia'
          });
        }
      }

      // 3. Verificar REGENCIA: ¿Este planeta rige el signo del evento?
      const regencias: Record<string, string[]> = {
        'Mercurio': ['Géminis', 'Virgo'],
        'Venus': ['Tauro', 'Libra'],
        'Marte': ['Aries', 'Escorpio'],
        'Júpiter': ['Sagitario', 'Piscis'],
        'Saturno': ['Capricornio', 'Acuario'],
        'Sol': ['Leo'],
        'Luna': ['Cáncer']
      };

      if (event.sign && regencias[p.name]?.includes(event.sign)) {
        activados.push({
          planeta: p.name,
          signo: p.sign,
          casa: p.house,
          grado: p.degree || 0,
          razonActivacion: `Tu ${p.name} natal RIGE el signo ${event.sign} donde ocurre este evento, por lo tanto se activa por regencia`,
          tipoActivacion: 'regencia'
        });
      }
    });
  }

  // Para Tránsitos: El planeta natal específico (aspecto directo)
  if (event.type === 'transito' && event.natalPlanet) {
    const planetaNatal = natalChart.planets.find((p: any) =>
      p.name === event.natalPlanet ||
      p.name.toLowerCase() === event.natalPlanet!.toLowerCase()
    );

    if (planetaNatal) {
      activados.push({
        planeta: planetaNatal.name,
        signo: planetaNatal.sign,
        casa: planetaNatal.house,
        grado: planetaNatal.degree || 0,
        razonActivacion: `${event.transitingPlanet} hace ${event.aspectType || 'aspecto'} EXACTO con tu ${planetaNatal.name} natal`,
        tipoActivacion: 'aspecto_exacto'
      });
    }
  }

  // ⚠️ Si NO hay planetas activados directamente, devolver array vacío
  // El prompt debe ACLARAR que el evento activa SOLO la casa, no planetas específicos
  return activados;
}

// ✅ Formatear planetas natales completos
function formatearPlanetasNatales(natalChart: any): string {
  if (!natalChart.planets) return 'No disponible';

  return natalChart.planets
    .map((p: any) => {
      const house = p.house || p.houseNumber || '?';
      const degree = p.degree ? Math.floor(p.degree) : '?';
      return `${p.name}: ${p.sign} ${degree}° Casa ${house}`;
    })
    .join('\n');
}

// ✅ Formatear tránsitos actuales del Solar Return
function formatearTransitosSR(solarReturn: any): string {
  if (!solarReturn) return 'No disponible';

  const transitos = [];

  // Extraer planetas del SR y sus casas
  if (solarReturn.planets) {
    const jupiterSR = solarReturn.planets.find((p: any) => p.name === 'Júpiter' || p.name === 'Jupiter');
    const saturnoSR = solarReturn.planets.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
    const plutonSR = solarReturn.planets.find((p: any) => p.name === 'Plutón' || p.name === 'Pluto');

    if (jupiterSR) transitos.push(`- Júpiter en Casa ${jupiterSR.house} SR (expansión, abundancia)`);
    if (saturnoSR) transitos.push(`- Saturno en Casa ${saturnoSR.house} SR (estructura, maestría)`);
    if (plutonSR) transitos.push(`- Plutón en Casa ${plutonSR.house} SR (transformación profunda)`);
  }

  if (transitos.length === 0) {
    return 'Tránsitos del Solar Return disponibles en la carta completa';
  }

  return transitos.join('\n');
}

// ✅ Descripción del evento
function getDescripcionEvento(event: EventData): {
  tipo: string;
  descripcion: string;
} {
  const descripciones: Record<string, any> = {
    'luna_nueva': {
      tipo: 'Luna Nueva',
      descripcion: `Luna Nueva en ${event.sign}: Momento de NUEVOS INICIOS, sembrar intenciones, plantar semillas para el ciclo de 6 meses. La Luna y el Sol se unen - alineación de emoción + voluntad. Es tiempo de manifestar desde el vacío, desde el potencial puro. Casa ${event.house} se RESETEA.`
    },
    'luna_llena': {
      tipo: 'Luna Llena',
      descripcion: `Luna Llena en ${event.sign}: Momento de CULMINACIÓN, cosecha, revelación de lo sembrado hace 6 meses. La Luna y el Sol se oponen - tensión creativa entre emoción + voluntad. Lo oculto se ILUMINA. Es tiempo de celebrar logros y soltar lo que ya no sirve. Casa ${event.house} llega a su pico.`
    },
    'transito': {
      tipo: 'Tránsito',
      descripcion: `${event.transitingPlanet} ${event.aspectType || 'activa'} tu ${event.natalPlanet} natal: Un planeta del cielo actual interactúa con un planeta de tu carta natal. Es un ACTIVADOR externo que trae experiencias, personas, situaciones que despiertan esa parte de ti. Los tránsitos son el TIMING del cosmos.`
    },
    'aspecto': {
      tipo: 'Aspecto',
      descripcion: `${event.transitingPlanet} hace ${event.aspectType} con tu ${event.natalPlanet} natal: Conversación cósmica entre el cielo actual y tu carta natal. Los aspectos tensos (cuadraturas, oposiciones) traen CRECIMIENTO a través del desafío. Los aspectos fluidos (trígonos, sextiles) traen FACILIDAD y oportunidades.`
    }
  };

  return descripciones[event.type] || {
    tipo: 'Evento Astrológico',
    descripcion: 'Activación importante en tu carta natal'
  };
}

// ✅ Significado de las casas
export function getHouseMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'identidad, apariencia, cómo te presentas al mundo',
    2: 'dinero, valores, recursos propios, autoestima',
    3: 'comunicación, aprendizaje, hermanos, entorno cercano',
    4: 'hogar, familia, raíces, mundo interior',
    5: 'creatividad, romance, autoexpresión, hijos, placer',
    6: 'trabajo diario, salud, rutinas, servicio',
    7: 'relaciones, pareja, asociaciones, el otro',
    8: 'transformación profunda, intimidad, recursos compartidos, muerte/renacimiento',
    9: 'filosofía, viajes largos, educación superior, búsqueda de sentido',
    10: 'carrera, reputación pública, autoridad, legado',
    11: 'amistades, comunidad, sueños, causas colectivas',
    12: 'espiritualidad, subconsciente, karma, retiro, lo oculto'
  };

  return meanings[house] || 'área de vida significativa';
}
