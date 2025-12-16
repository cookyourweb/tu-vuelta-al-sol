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

## 📋 ESTRUCTURA JSON REQUERIDA - METODOLOGÍA DE 2 CAPAS

**ORDEN CRÍTICO:** Primero describe (CAPA 1), luego aplica (CAPA 2)

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios):

{
  "titulo_evento": "String de 50-80 caracteres: Título memorable que incluya el nombre del usuario. Ejemplo: 'Luna Llena en Géminis - Tu Portal de Conciencia, ${data.userName}'",

  "capa_1_descriptivo": {
    "datos_objetivos": {
      "evento": "String: Tipo de evento (Luna Nueva, Luna Llena, Tránsito de Júpiter, Aspecto Sol-Marte, etc.)",
      "fecha": "${data.event.date}",
      "signo_principal": "${data.event.sign || 'Evento en signo'}",
      "signo_opuesto": "String o null: Signo opuesto si aplica (para Luna Llena, oposiciones) o null",
      "tipo_energia": "String 20-30 palabras: Describe el tipo de energía (ej: Culminación / conciencia / cierre, o Inicio / siembra / intención nueva)"
    },

    "casas_activadas_en_tu_carta": {
      "casa_principal": "String: Casa ${data.event.house} (${significadoCasa}) - describe brevemente qué área de vida del usuario se activa",
      "casa_opuesta": "String o null: Si aplica, Casa opuesta + su significado entre paréntesis, o null si no hay eje activado",
      "eje_activado": "String 40-60 palabras: Explica la tensión o diálogo entre ambas casas si aplica. Ejemplo: 'Expresión personal y creatividad (Casa 5) vs proyectos colectivos y visión de futuro (Casa 11)'. Si no hay eje, explica solo la casa principal."
    },

    "planetas_natales_implicados": [
      "${planetasActivados.length > 0 ? planetasActivados.map(p => `${p.planeta} natal en ${p.signo} Casa ${p.casa} (${getHouseMeaning(p.casa)})`).join('", "') : 'Array: Lista 2-5 planetas natales del usuario que este evento activa directamente. Formato: Planeta natal en Signo Casa X (significado casa). Ejemplo: Nodo Sur natal en Géminis Casa 5 (creatividad, autoexpresión). Solo mencionar los que REALMENTE están implicados'})"
    ],

    "descripcion_estructural": "String de 80-120 palabras: Descripción OBJETIVA del evento y su estructura astrológica, SIN dar consejos ni decir qué hacer. Solo explica QUÉ se activa, QUÉ áreas de vida entran en diálogo, QUÉ planetas natales se tocan. Usa términos como 'activa', 'pone en tensión', 'ilumina', 'conecta'. SIEMPRE menciona significados de casas entre paréntesis: 'Casa 5 (creatividad, romance, autoexpresión)'. NO digas 'deberías' ni 'te invita' ni 'es momento de'. Solo estructura objetiva. Como un arquitecto describiendo un edificio."
  },

  "capa_2_aplicado": {
    "cruce_con_tu_estructura_natal": "String de 120-150 palabras: Explica QUÉ TIENES en tu carta natal que hace que este evento sea ÚNICO para ti, ${data.userName}. Menciona:
      - Posiciones planetarias específicas: Sol en ${sol?.sign} Casa ${sol?.house}, Luna en ${luna?.sign} Casa ${luna?.house}
      - Aspectos natales relevantes (usa los datos de arriba)
      - Nodos Lunares si están implicados
      - Cualquier planeta natal en el mismo signo del evento

      Formato: 'Tú tienes: [lista concreta de posiciones]. Esto hace que [conexión específica con el evento].'

      Usa DATOS REALES de arriba. NO genérico. Si la interpretación sirve para otra persona, FALLA. Menciona casas con significado entre paréntesis.",

    "como_se_vive_en_ti": "String de 120-150 palabras: Describe concretamente CÓMO este evento se manifiesta en la vida diaria de ${data.userName}.

      - Empieza OBLIGATORIAMENTE con: 'Durante esos días es muy probable que:'
      - Lista 3-5 manifestaciones CONCRETAS: sentimientos, situaciones, conversaciones que pueden aparecer
      - Conecta cada manifestación con su configuración natal específica
      - Usa su nombre ${data.userName} al menos 1 vez
      - Menciona casas activadas con significado: 'Casa ${data.event.house} (${significadoCasa})'

      Ejemplo:
      'Durante esos días es muy probable que: te sientas mentalmente saturada, tengas ganas de explicar o justificar algo, aparezca una conversación emocionalmente cargada, surja tensión entre lo que quieres expresar (Casa 5 - creatividad) y lo que es coherente con tu visión mayor (Casa 11 - propósito colectivo). Tu ${sol?.sign} en Casa ${sol?.house} amplifica [característica específica].'",

    "riesgo_si_vives_inconscientemente": "String de 80-100 palabras: Lista específica de RIESGOS si ${data.userName} no trabaja este evento conscientemente.

      - Formato de lista corta, clara, directa
      - 4-6 riesgos concretos y específicos
      - Conecta con patrones natales del usuario (especialmente Nodo Sur si aplica, o aspectos tensos)
      - NO uses lenguaje vago

      Ejemplo:
      'Riesgos si lo vives inconscientemente: Decir más de lo necesario, entrar en debates estériles sin propósito, querer tener razón en vez de sostener tu verdad, dispersarte en opiniones ajenas, tomar decisiones desde la urgencia mental en lugar de la visión amplia, reaccionar verbalmente de forma impulsiva (tu ${sol?.sign} □ ${luna?.sign}).'

      Esto conecta DIRECTAMENTE con su [menciona patrón natal específico del usuario].",

    "uso_consciente_consejo_aplicado": "String de 120-150 palabras: Consejo APLICADO y CONCRETO para ${data.userName}.

      - Empieza con acción clara: 'No tomes...', 'Observa...', 'Elige...', 'Pregúntate...', 'Posterga...'
      - Da 3-4 consejos específicos ejecutables
      - Usa su configuración natal para personalizar cada consejo
      - Menciona casas, planetas, aspectos REALES de su carta

      Ejemplo:
      'Consejo aplicado para ti: No tomes decisiones importantes desde la urgencia mental de tu ${luna?.sign} en Casa ${luna?.house}. Observa qué conversación te agota emocionalmente → ahí hay información sobre tu Nodo Sur. Elige callar o simplificar en lugar de explicar de más. Pregúntate: ¿Esto que quiero decir sirve a mi visión a largo plazo (Casa ${data.event.house})? Tu ${sol?.sign} en Casa ${sol?.house} te da [cualidad específica] - úsala para [acción concreta].'",

    "accion_practica_sugerida": "String de 80-120 palabras: UNA acción práctica CONCRETA que ${data.userName} puede hacer durante este evento.

      - Debe ser EJECUTABLE, no vaga ni abstracta
      - Formato: pasos numerados (1, 2, 3) o lista muy clara
      - Conecta cada paso con posiciones de su carta natal
      - Da timing específico si aplica (fecha, fase lunar, etc.)

      Ejemplo:
      'Acción concreta para estos días:

      1) Posponer cualquier respuesta importante 24 horas (tu ${luna?.sign} necesita procesar emocionalmente)
      2) Escribir lo que quieres decir en un documento privado, pero NO enviarlo inmediatamente (tu ${sol?.sign} en Casa ${sol?.house} tiende a [característica])
      3) Elegir UNA idea clara en vez de muchas explicaciones (tu Nodo Norte pide síntesis)

      Espera hasta [menciona fecha específica o fase lunar siguiente] para tomar la decisión final. Durante esos días, tu Casa ${data.event.house} (${significadoCasa}) estará especialmente activa.'",

    "sintesis_final": "String de 40-60 palabras: Una frase-mantra personalizada que ${data.userName} puede usar para integrar el aprendizaje de este evento.

      - OBLIGATORIO en PRIMERA PERSONA ('Esta Luna Llena me muestra...', 'Yo elijo...', 'Mi [planeta] sostiene...')
      - Menciona posiciones planetarias ESPECÍFICAS de su carta
      - Resume el mensaje transformador del evento
      - Empoderador, concreto, accionable
      - NO vago ni genérico

      Ejemplo:
      'Esta Luna Llena me muestra dónde mi mente geminiana se dispersa y me invita a elegir una verdad sagitariana más grande que mis reacciones inmediatas. Mi ${sol?.sign} en Casa ${sol?.house} sostiene mi visión mientras mi ${luna?.sign} en Casa ${luna?.house} integra la emoción. ELIJO la claridad sobre la complejidad.'"
  },

  "analisis_tecnico": {
    "evento_en_casa_natal": ${data.event.house},
    "significado_casa": "${significadoCasa}",
    "planetas_natales_activados": [
      ${planetasActivados.map(p => `"${p.planeta} en ${p.signo} Casa ${p.casa}"`).join(',\n      ')}
    ]
  }
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS - METODOLOGÍA 2 CAPAS

**ORDEN SAGRADO (NO NEGOCIABLE):**
1. **Primero describe** (CAPA 1): estructura, qué se activa, datos objetivos, sin consejos
2. **Luego cruza** con su carta natal específica
3. **Identifica** el patrón que se activa en su vida
4. **Solo al final** das decisiones concretas (CAPA 2)

**ESTILO POR CAPA:**
- **CAPA 1**: Neutral, educativo, estructural. Como un arquitecto describiendo un edificio. Usa: "activa", "pone en tensión", "ilumina", "conecta". NO uses: "deberías", "te invita", "es momento de".
- **CAPA 2**: Directo, aplicado, transformador. Como un coach dando instrucciones. Usa: "No tomes...", "Observa...", "Elige...", "Pregúntate...".

**PERSONALIZACIÓN:**
1. **USA EL NOMBRE** ${data.userName} al menos 3 veces en CAPA 2
2. **USA POSICIONES PLANETARIAS ESPECÍFICAS** - NO inventes, usa las reales de arriba
3. **CAPA 1 es personalizada** a SU carta pero neutral
4. **CAPA 2 es 100% única** para esta persona

**CASAS - OBLIGATORIO:**
5. **EXPLICA CASAS SIEMPRE**: CADA VEZ que menciones "Casa X", DEBES incluir su significado entre paréntesis:
   - "Casa 2 (dinero, valores, autoestima)"
   - "Casa 5 (creatividad, romance, autoexpresión)"
   - "Casa 7 (relaciones, pareja, asociaciones)"
   - "Casa 11 (proyectos colectivos, amistades, visión futuro)"
   - etc. NUNCA escribas solo "Casa X" sin explicar qué significa.

**DATOS REALES:**
6. **SÉ ESPECÍFICO**: Siempre menciona signo + casa cuando hables de planetas
7. **NO INVENTES**: Si no tienes datos, di "información no disponible" en lugar de inventar
8. **EXTRAE de interpretación natal**: Usa fortalezas/bloqueos identificados arriba

**TONO Y CALIDAD:**
9. **NO GENÉRICO**: Si la interpretación podría servir para otra persona, FALLA
10. **MAYÚSCULAS**: Usa para énfasis en 5-8 palabras clave en CAPA 2
11. **JSON VÁLIDO**: Sin comentarios, sin markdown, cierra todas las llaves
12. **TIMING**: Vincula acciones a fases lunares o fechas específicas

---

## 🚫 LO QUE NO DEBES HACER

**CAPA 1 (Descriptivo):**
- ❌ No des consejos en CAPA 1
- ❌ No uses "deberías", "te invita", "es momento de" en CAPA 1
- ❌ No hables en segunda persona en CAPA 1 (usa tercera: "activa", "pone en tensión")

**CAPA 2 (Aplicado):**
- ❌ No seas vago ("tal vez", "puede que", "quizás")
- ❌ No des consejos superficiales o genéricos
- ❌ No escribas interpretaciones que podrían servir para otra persona

**GENERAL:**
- ❌ No inventes posiciones planetarias que no están en los datos
- ❌ No omitas significados de casas entre paréntesis
- ❌ No uses lenguaje esotérico/críptico
- ❌ No ignores las fortalezas/bloqueos identificados en su interpretación natal

---

## ✅ CHECKLIST ANTES DE RESPONDER

**CAPA 1 - Descriptivo:**
□ ¿Describí el evento objetivamente SIN dar consejos?
□ ¿Mencioné casas activadas con significado entre paréntesis?
□ ¿Listé planetas natales implicados REALES?
□ ¿La descripción estructural es neutral y educativa?
□ ¿NO usé "deberías" ni "te invita" en CAPA 1?

**CAPA 2 - Aplicado:**
□ ¿Crucé con su estructura natal específica (Sol, Luna, aspectos)?
□ ¿Describí cómo se VIVE en su vida diaria concretamente?
□ ¿Di riesgos concretos si no se trabaja conscientemente?
□ ¿Di consejo aplicado y acción práctica ejecutable?
□ ¿La síntesis final es personalizada y en primera persona?
□ ¿Mencioné ${data.userName} al menos 3 veces en CAPA 2?

**GENERAL:**
□ ¿Usé posiciones planetarias REALES (no inventadas)?
□ ¿Expliqué qué significa Casa ${data.event.house} entre paréntesis?
□ ¿El JSON es válido sin comentarios?
□ ¿Esta interpretación es ÚNICA para ${data.userName}?
□ ¿Seguí el ORDEN: describe → cruza → identifica → aconseja?

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
      p.name.toLowerCase() === event.natalPlanet!.toLowerCase()
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
