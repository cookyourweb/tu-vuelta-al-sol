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
  const medioC ielo = data.natalChart.midheaven;

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

${planetasActivados.length > 0 ? planetasActivados.map(p => `- **${p.planeta}** natal en ${p.signo} Casa ${p.casa} (${getHouseMeaning(p.casa)})
  → ${p.razonActivacion}
`).join('\n') : 'Este evento activa el área de vida (casa) pero no hace aspectos exactos con planetas natales'}

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

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios):

{
  "titulo_evento": "String de 50-80 caracteres: Título memorable que incluya el nombre del usuario. Ejemplo: 'Luna Nueva en Tauro - Tu Portal de Materialización, ${data.userName}'",

  "para_ti_especificamente": "String de 100-150 palabras:

    - EMPIEZA OBLIGATORIAMENTE con: 'Para TI, ${data.userName}, con tu [configuración natal específica]:'
    - Menciona su Sol, Luna o Ascendente y en qué casa están
    - Explica qué casa natal activa este evento (${data.event.house}) y QUÉ SIGNIFICA ESA CASA
    - Conecta la energía del evento con su configuración natal específica
    - Usa MAYÚSCULAS para énfasis en 2-3 palabras clave
    - Usa la palabra 'PERO' para contrastar aspectos de su carta

    Ejemplo:
    'Para TI, ${data.userName}, con tu Sol en ${sol?.sign} Casa ${sol?.house} (${sol?.house ? getHouseMeaning(sol.house) : 'identidad'}) y tu Luna en ${luna?.sign} Casa ${luna?.house} (${luna?.house ? getHouseMeaning(luna.house) : 'emociones'}): Este ${descripcionEvento.tipo} activa tu Casa ${data.event.house} natal (${significadoCasa}). Tu naturaleza ${sol?.sign} te hace [característica], PERO tu ${luna?.sign} te da el poder de [superpoder]. Este evento te dice: [mensaje específico].'",

  "tu_fortaleza_a_usar": {
    "fortaleza": "String: UNA fortaleza ESPECÍFICA de su carta natal (extraída de la lista arriba) que sea RELEVANTE para este evento. Usa posición planetaria exacta. Ejemplo: 'Tu ${fortalezas[0]?.nombre || 'Mercurio en Casa 1'} - ${fortalezas[0]?.posicion || 'Tu Voz como Poder'}'",

    "como_usarla": "String de 100-120 palabras: Instrucciones MUY ESPECÍFICAS de cómo ACTIVAR esa fortaleza durante este evento.

    - Menciona la posición planetaria exacta
    - Da ACCIÓN CONCRETA (no vaga)
    - Conecta con el tipo de evento (${data.event.type})
    - Conecta con la casa activada (Casa ${data.event.house})
    - Menciona otro planeta de su carta que apoye esta fortaleza

    Ejemplo:
    'Tu ${fortalezas[0]?.posicion || 'Mercurio en Casa 1'} te da [superpoder específico]. Durante este ${descripcionEvento.tipo} en tu Casa ${data.event.house}, ACTIVA esto haciendo [acción concreta 1]: [detalles]. Con tu [otro planeta de su carta], [cómo ese planeta apoya la acción]. Tu ${sol?.sign} te da [característica] - úsala para [resultado específico].'"
  },

  "tu_bloqueo_a_trabajar": {
    "bloqueo": "String: UN bloqueo ESPECÍFICO de su carta natal (extraído de la lista arriba) que este evento puede ayudar a TRANSFORMAR. Usa posición planetaria exacta. Ejemplo: 'Tu Saturno en Casa 2 - \"No merezco ganar dinero fácilmente\"'",

    "reframe": "String de 100-120 palabras: Reencuadre DISRUPTIVO y EMPODERADOR del bloqueo.

    - Empieza con 'NO.' para negar la creencia limitante
    - Explica el ORIGEN del bloqueo (infancia/familia)
    - Reencuadra como MAESTRÍA o ENTRENAMIENTO, no limitación
    - Menciona tránsitos actuales del Solar Return que apoyan la transformación
    - Conecta con el evento actual como 'permiso cósmico' para cambiar

    Ejemplo:
    'NO. Tu [bloqueo] no es limitación, es [reframe positivo]. Ese mensaje de [creencia limitante] viene de [origen], pero ahora TÚ eres quien redefine [área de vida]. Con [tránsito actual del SR] activando tu Casa [X], el universo te está PIDIENDO que [acción transformadora]. Este ${descripcionEvento.tipo} es tu permiso cósmico para [resultado deseado] sin culpa.'"
  },

  "mantra_personalizado": "String de 20-40 palabras: Mantra que INTEGRE posiciones planetarias ESPECÍFICAS de su carta con el evento.

  - DEBE mencionar al menos 2 posiciones planetarias reales (ej: 'palabra escorpiana', 'dispersión geminiana')
  - Debe ser en PRIMERA PERSONA
  - Debe incluir MAYÚSCULAS en 1-2 palabras clave
  - Debe ser accionable y empoderador

  Ejemplo:
  'Mi ${luna?.sign ? luna.sign.toLowerCase() : 'lunar'} [característica] tiene valor [área de Casa ${data.event.house}]. Mi ${sol?.sign ? sol.sign.toLowerCase() : 'solar'} [característica] se [acción] cuando mi [otro planeta] lo decide. ACTÚO con [cualidad].'",

  "ejercicio_para_ti": "String de 120-150 palabras: Ejercicio CONCRETO y ESPECÍFICO basado en su carta + el evento.

  - Empieza con acción específica: 'Esta semana, escribe/crea/conecta...'
  - Da estructura numerada (1, 2, 3) de pasos concretos
  - Cada paso debe mencionar UNA posición planetaria de su carta
  - Conecta cada paso con el evento actual
  - Termina con instrucción de timing: 'con este ${descripcionEvento.tipo}, [acción final]'

  Ejemplo:
  'Esta semana, escribe 3 [acciones específicas] (${fortalezas[0]?.posicion || 'tu fortaleza principal'}): 1) ¿Qué [pregunta] tienes que otros necesitan? (${luna?.sign} en Casa ${luna?.house}) 2) ¿Cómo puedes [acción 2]? (${sol?.sign} en Casa ${sol?.house}) 3) ¿Qué [acción 3] puedes crear? (${bloqueos[0]?.posicion || 'tu desafío'}). Luego, con este ${descripcionEvento.tipo} en ${data.event.sign || 'la casa'} ${data.event.house}, [acción final concreta]: [detalles]. Tu ${luna?.sign} sabe que [verdad sobre su carta].'",,

  "consejo_especifico": "String de 120-150 palabras: Consejo basado en TRÁNSITOS ACTUALES del Solar Return + posiciones natales + el evento.

  - Menciona AL MENOS 2 tránsitos actuales del Solar Return
  - Conecta esos tránsitos con planetas natales específicos
  - Explica cómo el evento actual es el TIMING perfecto dado esos tránsitos
  - Da acción concreta aprovechando la confluencia de tránsitos
  - Usa palabras como 'timing perfecto', 'confluencia', 'simultáneamente'

  Ejemplo:
  'Con [Tránsito 1 del SR] activando tu Casa [X] (${getHouseMeaning(data.event.house)}) y [Tránsito 2 del SR] en Casa [Y], ${descripcionEvento.tipo} es el TIMING PERFECTO para [acción específica]. Tu configuración ${sol?.sign}-${luna?.sign} en Casas ${sol?.house}-${luna?.house} = [interpretación única]. Este ${descripcionEvento.tipo} en tu Casa ${data.event.house} activa [área de vida]. [Tránsito 1] te [efecto], [Tránsito 2] te [efecto], ${descripcionEvento.tipo} te [efecto]. USA estos tres tránsitos SIMULTÁNEAMENTE: [acción 1], [acción 2], [acción 3].'"
  },

  "timing_evolutivo": {
    "que_sembrar": "String de 60-80 palabras: Qué sembrar ESPECÍFICAMENTE basado en su configuración natal + el evento. No genérico. Menciona planetas.",
    "cuando_actuar": "String de 40-60 palabras: Cuándo actuar (fases lunares + posiciones en su carta específica). Ej: 'Durante los próximos 14 días (de ${descripcionEvento.tipo} a Luna Llena), [acción]. Tu ${luna?.sign} necesita [necesidad específica].'",
    "resultado_esperado": "String de 60-80 palabras: Qué resultado esperar en X meses basado en su configuración + el evento. Menciona fecha futura y planetas que lo sostendrán."
  },

  "analisis_tecnico": {
    "evento_en_casa_natal": ${data.event.house},
    "significado_casa": "${significadoCasa}",
    "planetas_natales_activados": [
      ${planetasActivados.map(p => `"${p.planeta} en ${p.signo} Casa ${p.casa}"`).join(',\n      ')}
    ],
    "aspectos_cruzados": [
      "String: Aspecto 1 del evento con planeta/casa natal - explicar cómo se manifiesta",
      "String: Aspecto 2 - ser específico",
      "String: Aspecto 3 - mencionar timing"
    ]
  }
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS

1. **USA EL NOMBRE** ${data.userName} al menos 3-4 veces en toda la interpretación
2. **USA POSICIONES PLANETARIAS ESPECÍFICAS** - NO inventes, usa las reales de arriba
3. **EXTRAE FORTALEZAS Y BLOQUEOS** de su interpretación natal guardada (listadas arriba)
4. **SÉ ESPECÍFICO**: Siempre menciona signo + casa + grado cuando hables de planetas
5. **EXPLICA CASAS**: SIEMPRE entre paréntesis la primera vez: "Casa X (significado)"
6. **CONECTA INFANCIA → ADULTO** cuando hables de bloqueos
7. **TONO**: Motivador + Disruptivo + Explicativo + Transformador (los 4 pilares)
8. **NO GENÉRICO**: Si la interpretación podría servir para otra persona, FALLA
9. **MAYÚSCULAS**: Usa para énfasis en 5-8 palabras clave por sección
10. **JSON VÁLIDO**: Sin comentarios, sin markdown, cierra todas las llaves
11. **NO INVENTES**: Si no tienes datos de tránsitos SR, usa los datos natales + evento
12. **TIMING**: Vincula acciones a fases lunares o fechas específicas

---

## 🚫 LO QUE NO DEBES HACER

- ❌ No uses frases genéricas que sirvan para cualquier persona
- ❌ No inventes posiciones planetarias que no están en los datos
- ❌ No ignores las fortalezas/bloqueos identificados en su interpretación natal
- ❌ No seas vago ("tal vez", "puede que", "quizás")
- ❌ No des consejos superficiales
- ❌ No olvides conectar con su propósito de vida
- ❌ No uses lenguaje esotérico/críptico
- ❌ No escribas interpretaciones que podrían servir para otra persona
- ❌ No omitas significados de casas entre paréntesis

---

## ✅ CHECKLIST ANTES DE RESPONDER

□ ¿Mencioné el nombre ${data.userName} al menos 3 veces?
□ ¿Usé posiciones planetarias REALES (signo + casa)?
□ ¿Extraje fortalezas de su interpretación natal guardada?
□ ¿Extraje bloqueos de su interpretación natal guardada?
□ ¿Expliqué qué significa Casa ${data.event.house}?
□ ¿Conecté el evento con su propósito de vida?
□ ¿Di acciones CONCRETAS (no vagas)?
□ ¿El mantra incluye posiciones planetarias reales?
□ ¿El ejercicio tiene pasos numerados y específicos?
□ ¿Mencioné tránsitos actuales del Solar Return?
□ ¿El JSON es válido y está completo?
□ ¿Esta interpretación es ÚNICA para ${data.userName}?

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

// ✅ Identificar planetas natales que el evento activa
function identificarPlanetasActivados(
  event: EventData,
  natalChart: any
): Array<{
  planeta: string;
  signo: string;
  casa: number;
  razonActivacion: string;
}> {
  const activados: Array<{
    planeta: string;
    signo: string;
    casa: number;
    razonActivacion: string;
  }> = [];

  if (!natalChart.planets) return activados;

  // Para Lunas Nuevas/Llenas: Planetas en la casa activada
  if (event.type === 'luna_nueva' || event.type === 'luna_llena') {
    natalChart.planets.forEach((p: any) => {
      if (p.house === event.house) {
        activados.push({
          planeta: p.name,
          signo: p.sign,
          casa: p.house,
          razonActivacion: `${event.type === 'luna_nueva' ? 'Luna Nueva' : 'Luna Llena'} ocurre en la misma casa que tu ${p.name} natal`
        });
      }
    });
  }

  // Para Tránsitos: El planeta natal específico
  if (event.type === 'transito' && event.natalPlanet) {
    const planetaNatal = natalChart.planets.find((p: any) =>
      p.name === event.natalPlanet ||
      p.name.toLowerCase() === event.natalPlanet.toLowerCase()
    );

    if (planetaNatal) {
      activados.push({
        planeta: planetaNatal.name,
        signo: planetaNatal.sign,
        casa: planetaNatal.house,
        razonActivacion: `${event.transitingPlanet} ${event.aspectType || 'transita'} tu ${planetaNatal.name} natal`
      });
    }
  }

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
