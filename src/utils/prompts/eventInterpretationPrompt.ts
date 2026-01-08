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

## 📋 ESTRUCTURA JSON REQUERIDA - FORMATO AGENDA FÍSICA

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios).

**IMPORTANTE:** Este es el contenido que leerá el usuario en su agenda física.
NO expliques astrología. Traduce la energía en acción concreta.
Escribe como si fuera su agenda personal, directamente aplicable a su vida.

{
  "titulo_evento": "String: Solo el nombre del evento. Ejemplo: 'Luna Llena en Capricornio', '${descripcionEvento.tipo}'",

  "clima_del_dia": [
    "String: Keyword 1 del clima energético",
    "String: Keyword 2 del clima energético",
    "String: Keyword 3 del clima energético"
  ],

  "energias_activas": [
    "String: Símbolo + Nombre del planeta 1 activo este año. Ejemplo: '♂ Marte'",
    "String: Símbolo + Nombre del planeta 2 activo este año. Ejemplo: '♀ Venus'",
    "String: Símbolo + Nombre del planeta 3 activo este año. Ejemplo: '♄ Saturno'"
  ],

  "mensaje_sintesis": "String de 2-3 frases POTENTES que resumen la esencia del día. Directo, sin florituras. Ejemplo: 'Cerrar con responsabilidad lo que ya ha cumplido su función. Hoy no se trata de sentir más, sino de asumir una decisión clara.'",

  "como_te_afecta": "String de 200-300 palabras:

ESTRUCTURA OBLIGATORIA:

Párrafo 1 (quién eres):
'Tú eres [descripción basada en ${sol?.sign}, ${luna?.sign}, ${ascendente?.sign}].'

Párrafo 2 (qué piden los planetas activos este año):
'Este año [Planeta 1] te está pidiendo [acción/transformación].
[Planeta 2] [qué te pide].
[Planeta 3] [qué te pide].'

Párrafo 3 (qué activa este evento):
'Este ${descripcionEvento.tipo} activa un punto clave:
👉 [Pregunta poderosa específica para ${data.userName}]'

Párrafo 4 (qué se ve con claridad):
'Hoy se ve con claridad:
- [Aspecto 1]
- [Aspecto 2]
- [Aspecto 3]'

TONO: Directo, personal, sin explicar astrología. Como si fueras su coach personal.",

  "interpretacion_practica": [
    {
      "planeta": "String: Nombre del planeta activo (ej: 'Marte')",
      "que_pide": "String de 1-2 frases: Qué te pide este planeta en este momento. Ejemplo: 'Tu cuerpo y tu energía ya saben qué no quieren empujar más'"
    },
    {
      "planeta": "String: Nombre del planeta activo 2",
      "que_pide": "String de 1-2 frases"
    },
    {
      "planeta": "String: Nombre del planeta activo 3",
      "que_pide": "String de 1-2 frases"
    }
  ],

  "sintesis_practica": "String de 1-2 frases que resume la interpretación práctica. Ejemplo: 'Esta Luna no exige acción inmediata, exige claridad interna.'",

  "accion_concreta": {
    "titulo": "String: Título del ejercicio. Ejemplo: 'Ejercicio de cierre consciente'",
    "pasos": [
      "String: Paso 1 con instrucciones CLARAS y CONCRETAS",
      "String: Paso 2 con instrucciones CLARAS y CONCRETAS"
    ]
  },

  "sombra_a_evitar": [
    "String: Sombra 1",
    "String: Sombra 2",
    "String: Sombra 3"
  ],

  "explicacion_sombra": "String de 1 frase que reencuadra positivamente. Ejemplo: 'Soltar hoy es ordenar tu energía, no rendirte.'",

  "frase_ancla": "String de 8-12 palabras. Frase POTENTE y memorizable. Ejemplo: 'Puedo ser responsable sin cargar con todo.'",

  "apoyo_energetico": [
    {
      "tipo": "String: tipo de apoyo (🕯️ Vela / 🪨 Piedra / 🧘 Ejercicio)",
      "elemento": "String: qué elemento específico. Ejemplo: 'Vela marrón o negra'",
      "proposito": "String: para qué sirve. Ejemplo: 'estructura y cierre consciente'"
    },
    {
      "tipo": "String",
      "elemento": "String",
      "proposito": "String"
    },
    {
      "tipo": "String",
      "elemento": "String",
      "proposito": "String"
    }
  ],

  "nota_apoyo": "String de 1-2 frases. Ejemplo: 'Nada obligatorio. Solo herramientas que acompañan la decisión.'",

  "cierre_dia": "String de 2-3 frases EMPODERADORAS que cierran el día. Ejemplo: 'Esta Luna Llena no viene a quitarte nada. Viene a devolverte espacio, foco y autoridad personal.'",

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
5. **EXPLICA CASAS SIEMPRE**: CADA VEZ que menciones "Casa X", DEBES incluir su significado entre paréntesis: "Casa 2 (dinero, valores, autoestima)", "Casa 7 (relaciones, pareja, asociaciones)", etc. NUNCA escribas solo "Casa X" sin explicar qué significa.
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
