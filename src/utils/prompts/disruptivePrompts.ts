// =============================================================================
// 🔥 PROMPTS DISRUPTIVOS MEJORADOS CON PROFUNDIDAD PSICOLÓGICA
// src/utils/prompts/disruptivePrompts.ts
// =============================================================================

// ✅ NUEVA INTERFAZ PARA CARTA NATAL
interface NatalInterpretation {
  esencia_revolucionaria?: string;
  proposito_vida?: string;
  formacion_temprana?: {
    casa_lunar?: {
      planeta: string;
      infancia_emocional: string;
      patron_formado: string;
      impacto_adulto: string;
    };
    casa_saturnina?: {
      planeta: string;
      limites_internalizados: string;
      mensaje_recibido: string;
      impacto_adulto: string;
    };
    casa_venusina?: {
      planeta: string;
      amor_aprendido: string;
      modelo_relacional: string;
      impacto_adulto: string;
    };
  };
  patrones_psicologicos?: Array<{
    nombre_patron: string;
    planeta_origen: string;
    como_se_manifiesta: string[];
    origen_infancia: string;
    dialogo_interno: string[];
    ciclo_karmico: string[];
    sombra_junguiana: string;
    superpoder_integrado: string;
    pregunta_reflexion: string;
  }>;
  planetas_profundos?: Array<{
    planeta: string;
    posicion_completa: string;
    lectura_psicologica: string;
    arquetipo: string;
    luz: string;
    sombra: string;
    integracion: string;
  }>;
  nodos_lunares?: {
    nodo_sur: {
      signo_casa: string;
      zona_comfort: string;
      patron_repetitivo: string;
    };
    nodo_norte: {
      signo_casa: string;
      direccion_evolutiva: string;
      desafio: string;
    };
    eje_completo: string;
  };
  declaracion_poder?: string;
  advertencias?: string[];
  insights_transformacionales?: string[];
  pregunta_final_reflexion?: string;
}

export interface ChartData {
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house?: number;
    houseNumber?: number;
    retrograde?: boolean;
    longitude?: number;
  }>;
  houses?: Array<{
    number: number;
    sign: string;
    degree: number;
  }>;
  aspects?: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
  ascendant?: {
    sign: string;
    degree: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
  };
  elementDistribution?: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
}

export interface UserProfile {
  name: string;
  age: number;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
}

// =============================================================================
// 🎯 FUNCIÓN PRINCIPAL: PROMPT CARTA NATAL PROFUNDO
// =============================================================================

export function generateDisruptiveNatalPrompt(
  chartData: ChartData,
  userProfile: UserProfile
): string {

  console.log('🎨 Building Disruptive Prompt...');
  console.log('📊 Chart Data for Prompt:', {
    planets: chartData.planets?.map((p: any) => ({
      name: p.name,
      sign: p.sign,
      house: p.house || p.houseNumber,
      degree: p.degree
    })),
    ascendant: chartData.ascendant
  });

  // Verify all planets have houses
  const missingHouses = chartData.planets?.filter((p: any) =>
    !p.house && !p.houseNumber
  );

  if (missingHouses?.length > 0) {
    console.warn('⚠️ Planets missing house positions:', missingHouses);
  }

  const userName = userProfile.name || 'Usuario';
  
  // Extraer planetas clave
  const sol = chartData.planets.find(p => p.name === 'Sol');
  const luna = chartData.planets.find(p => p.name === 'Luna');
  const mercurio = chartData.planets.find(p => p.name === 'Mercurio');
  const venus = chartData.planets.find(p => p.name === 'Venus');
  const marte = chartData.planets.find(p => p.name === 'Marte');
  const jupiter = chartData.planets.find(p => p.name === 'Júpiter' || p.name === 'Jupiter');
  const saturno = chartData.planets.find(p => p.name === 'Saturno' || p.name === 'Saturn');
  const urano = chartData.planets.find(p => p.name === 'Urano' || p.name === 'Uranus');
  const neptuno = chartData.planets.find(p => p.name === 'Neptuno' || p.name === 'Neptune');
  const pluton = chartData.planets.find(p => p.name === 'Plutón' || p.name === 'Pluto');

  // ✅ CONSTRUIR TEXTOS DINÁMICAMENTE PARA EVITAR ERRORES
  const lunaTexto = luna 
    ? `Luna en ${luna.sign} Casa ${luna.house || luna.houseNumber || '?'}`
    : 'Luna';
  
  const saturnoTexto = saturno
    ? `Saturno en ${saturno.sign} Casa ${saturno.house || saturno.houseNumber || '?'}`
    : 'Saturno';
  
  const venusTexto = venus
    ? `Venus en ${venus.sign} Casa ${venus.house || venus.houseNumber || '?'}`
    : 'Venus';

  // Formatear planetas para el prompt
  const planetasTexto = chartData.planets
    .map(p => {
      const house = p.house || p.houseNumber || 'sin casa';
      const retro = p.retrograde ? ' (Retrógrado)' : '';
      return `${p.name} en ${p.sign} ${Math.floor(p.degree)}° Casa ${house}${retro}`;
    })
    .join('\n');

  // Formatear aspectos principales
  const aspectosTexto = (chartData.aspects || [])
    .filter(a => ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(a.type))
    .slice(0, 10)
    .map(a => `${a.planet1} ${a.type} ${a.planet2} (orbe ${a.orb.toFixed(1)}°)`)
    .join('\n');

  // =============================================================================
  // 📝 PROMPT COMPLETO
  // =============================================================================

  const prompt = `
Eres un astrólogo evolutivo EXPERTO en psicología profunda (Jung, Rudhyar, Greene, Sasportas).

Tu tarea: Interpretar la carta natal de ${userName.toUpperCase()} con PROFUNDIDAD PSICOLÓGICA TRANSFORMACIONAL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS DE ${userName.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${userName}
Edad: ${userProfile.age} años
Nacimiento: ${userProfile.birthDate} a las ${userProfile.birthTime}
Lugar: ${userProfile.birthPlace}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🪐 POSICIONES PLANETARIAS EXACTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${planetasTexto}

Ascendente: ${chartData.ascendant?.sign || 'desconocido'} ${chartData.ascendant?.degree ? Math.floor(chartData.ascendant.degree) + '°' : ''}
Medio Cielo: ${chartData.midheaven?.sign || 'desconocido'} ${chartData.midheaven?.degree ? Math.floor(chartData.midheaven.degree) + '°' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ASPECTOS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${aspectosTexto}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 SIGNIFICADO DE LAS CASAS (Para tu referencia)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Casa 1: Identidad, apariencia, cómo te presentas al mundo
Casa 2: Valores, dinero, recursos propios, autoestima
Casa 3: Comunicación, aprendizaje, hermanos, entorno cercano
Casa 4: Hogar, familia, raíces, mundo interior
Casa 5: Creatividad, romance, autoexpresión, hijos, placer
Casa 6: Trabajo diario, salud, rutinas, servicio
Casa 7: Relaciones, pareja, asociaciones, el otro
Casa 8: Transformación profunda, intimidad, recursos compartidos, muerte/renacimiento
Casa 9: Filosofía, viajes largos, educación superior, búsqueda de sentido
Casa 10: Carrera, reputación pública, autoridad, legado
Casa 11: Amistades, comunidad, sueños, causas colectivas
Casa 12: Espiritualidad, subconsciente, karma, retiro, lo oculto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INSTRUCCIONES CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ENFOQUE PSICOLÓGICO-EVOLUTIVO:**

1. Esta NO es astrología predictiva ni de horóscopo genérico
2. Usa psicología profunda: arquetipos junguianos, formación temprana, sombra
3. Conecta infancia → patrones adultos → evolución posible
4. Nombra patrones psicológicos con títulos MEMORABLES
5. Balancea luz + sombra + integración

**LENGUAJE:**

- Disruptivo pero educativo
- Usa el nombre ${userName} SOLO 2-3 veces en momentos clave (inicio, momentos importantes, cierre)
- NO repitas el nombre constantemente - usa "tú", "tu", "tienes", etc.
- CAPS para énfasis en palabras clave
- Emojis relevantes (no excesivos)
- Ejemplos de vida real, NO jerga abstracta
- **SIEMPRE explica qué representa cada casa cuando la menciones**
  Ejemplo: "Casa 8 (transformación, intimidad, recursos compartidos)"
  Ejemplo: "Casa 5 (creatividad, autoexpresión, romance)"

**MUY IMPORTANTE:**

- NO incluyas acciones/rituales/mantras (eso va en Solar Return)
- NO incluyas "haz esto hoy/semana/mes"
- SÍ incluye preguntas de reflexión profunda
- SÍ explica CÓMO se formó cada patrón

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: CARTA NATAL ES IDENTIDAD PERMANENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Carta Natal** = Mapa de tu esencia permanente
**SÍ** defines quién ES la persona en su núcleo
**NO** describes eventos temporales o ciclos anuales

OBLIGATORIO:
✅ "Eres..."
✅ "Tu esencia es..."
✅ "YO, [NOMBRE], SOY..."
✅ Lenguaje de identidad permanente
✅ "Naciste para..."
✅ "Tu alma vino a..."
✅ "En tu núcleo eres..."

PROHIBIDO:
❌ "Este año..."
❌ "Durante 2025..."
❌ "Este ciclo..."
❌ Lenguaje temporal o anual
❌ Acciones con fecha ("haz esto hoy/semana/mes")
❌ Referencias a períodos específicos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ÃNGULOS VITALES - INTERPRETACIÃ"N OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASCENDENTE (AC): ${chartData.ascendant?.sign} ${chartData.ascendant?.degree}°
- Representa cÃ³mo ${userName} se presenta al mundo
- Su "mÃ¡scara social" y primera impresiÃ³n
- El enfoque automÃ¡tico que tiene hacia la vida
- DEBE interpretarse en "angulos_vitales.ascendente"

MEDIO CIELO (MC): ${chartData.midheaven?.sign} ${chartData.midheaven?.degree}°
- Representa su vocaciÃ³n y propÃ³sito pÃºblico
- Su imagen profesional y reputaciÃ³n
- El tipo de legado que quiere dejar
- DEBE interpretarse en "angulos_vitales.medio_cielo"

⚠️ IMPORTANTE: Estos Ã¡ngulos son TAN importantes como el Sol y la Luna.
NO los omitas. Son OBLIGATORIOS en la respuesta JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder SOLO con JSON válido en este formato exacto:

{
  "esencia_revolucionaria": "String épico sobre quién ES ${userName} en su núcleo. LENGUAJE DE IDENTIDAD PERMANENTE: 'Eres...', 'Tu esencia es...', 'En tu núcleo eres...'. SIN lenguaje temporal, SIN 'este año', SIN 'durante 2025'. Define su naturaleza permanente.",

  "proposito_vida": "String sobre su misión evolutiva en ESTA VIDA (no este año). LENGUAJE PERMANENTE: 'Naciste para...', 'Tu alma vino a...', 'Tu propósito es...'. SIN referencias temporales. Define su misión de alma.",
  
  "formacion_temprana": {
    "casa_lunar": {
      "planeta": "${lunaTexto}",
      "infancia_emocional": "String: Cómo fue su infancia emocional. Qué aprendió sobre las emociones siendo niña.",
      "patron_formado": "String: Qué patrón emocional se grabó en su psique desde pequeña.",
      "impacto_adulto": "String: Cómo ese patrón se manifiesta HOY en su vida adulta. Ejemplos concretos."
    },
    "casa_saturnina": {
      "planeta": "${saturnoTexto}",
      "limites_internalizados": "String: Qué límites o miedos internalizó de niña. Qué le dijeron (explícita o implícitamente) que NO podía hacer/ser.",
      "mensaje_recibido": "String: Mensaje sobre responsabilidad, estructura o 'cómo debía ser' que recibió temprano.",
      "impacto_adulto": "String: Cómo esos límites la afectan HOY. Su autocrítica interna, sus bloqueos."
    },
    "casa_venusina": {
      "planeta": "${venusTexto}",
      "amor_aprendido": "String: Cómo aprendió a dar/recibir amor. Qué modelo de amor vio en su infancia.",
      "modelo_relacional": "String: Qué tipo de relaciones observó. Cómo se relacionaban las figuras importantes.",
      "impacto_adulto": "String: Cómo eso moldea su forma de amar HOY. Sus patrones en relaciones."
    }
  },
  
  "patrones_psicologicos": [
    {
      "nombre_patron": "String memorable tipo 'La Pacificadora Invisible' o 'La Rebelde Incomprendida'",
      "planeta_origen": "Ejemplo: Luna en Libra Casa 8",
      "como_se_manifiesta": [
        "String: Comportamiento concreto 1",
        "String: Comportamiento concreto 2",
        "String: Comportamiento concreto 3"
      ],
      "origen_infancia": "String: Explica SIN jerga terapéutica cómo se formó este patrón en la infancia",
      "dialogo_interno": [
        "String: 'Pensamiento automático 1 que tiene'",
        "String: 'Pensamiento automático 2 que tiene'"
      ],
      "ciclo_karmico": [
        "String: Paso 1 del ciclo repetitivo",
        "String: Paso 2",
        "String: Paso 3",
        "String: Paso 4: Confirma creencia limitante",
        "String: Paso 5: Repite el ciclo"
      ],
      "sombra_junguiana": "String: Qué parte de sí misma reprimió o no integró. La parte 'no aceptable'.",
      "superpoder_integrado": "String: Qué SUPERPODER emerge cuando integra luz + sombra de este patrón",
      "pregunta_reflexion": "String: Pregunta profunda para que reflexione sobre este patrón"
    }
  ],
  
  "planetas_profundos": [
    {
      "planeta": "Nombre del planeta",
      "posicion_completa": "Signo Grado Casa",
      "lectura_psicologica": "String: Explicación psicológica profunda de este planeta. Conecta con su vida real.",
      "arquetipo": "String: Ej. 'La Visionaria Incomprendida', 'El Guerrero Frenado'",
      "luz": "String: Cuando este planeta está en su mejor expresión",
      "sombra": "String: Cuando este planeta está en su peor expresión o reprimido",
      "integracion": "String: Cómo integrar luz + sombra de este planeta"
    }
  ],
  
  "angulos_vitales": {
    "ascendente": {
      "posicion": "${chartData.ascendant?.sign} ${chartData.ascendant?.degree}°",
      "mascara_social": "String: Cómo ${userName} se presenta al mundo. Su 'primera impresión'. La energía que proyecta ANTES de que la conozcan de verdad. Ejemplos concretos de cómo esto se manifiesta en su vida.",
      "cuerpo_fisico": "String: Cómo se manifiesta en su cuerpo, su apariencia física, su vitalidad, su forma de moverse en el mundo. El Ascendente se ve en el físico.",
      "enfoque_vida": "String: El LENTE a través del cual ve y experimenta la vida. Su approach natural a nuevas situaciones. Su instinto automático.",
      "desafio_evolutivo": "String: Qué necesita desarrollar conscientemente para evolucionar más allá de su Ascendente. El Ascendente puede ser una máscara que oculta su verdadero ser (Sol).",
      "superpoder": "String: Cuando usa su Ascendente conscientemente e intencionalmente, qué poder tiene. Cómo puede aprovechar esta energía."
    },
    "medio_cielo": {
      "posicion": "${chartData.midheaven?.sign} ${chartData.midheaven?.degree}°",
      "vocacion_soul": "String: Su verdadera vocación del alma. Qué vino a HACER en el mundo. No es solo 'trabajo', es CONTRIBUCIÓN. Sea específico con ejemplos.",
      "imagen_publica": "String: Cómo la ve el mundo profesionalmente. Su reputación natural. Qué tipo de autoridad proyecta cuando está en su elemento.",
      "legado": "String: Qué tipo de huella o legado quiere dejar en el mundo. Qué quiere que digan de ella cuando no esté.",
      "carrera_ideal": "String: Tipos de carreras, roles o contextos profesionales donde brillaría naturalmente. Sé MUY específico con ejemplos reales de profesiones o industrias.",
      "autoridad_interna": "String: Cómo desarrolla su propia autoridad y liderazgo. Qué tipo de líder es naturalmente. Cómo se empodera profesionalmente."
    }
  },

  "nodos_lunares": {
    "nodo_sur": {
      "signo_casa": "Acuario 21° en Casa 1",
      "zona_comfort": "String: Habilidades que ya domina. Su zona de confort.",
      "patron_repetitivo": "String: Qué tiende a repetir que ya no la sirve"
    },
    "nodo_norte": {
      "signo_casa": "Leo 21° en Casa 7",
      "direccion_evolutiva": "String: Hacia dónde necesita crecer en esta vida",
      "desafio": "String: Por qué da miedo moverse hacia allá"
    },
    "eje_completo": "String: Explicación del balance entre ambos nodos. Su GPS evolutivo."
  },

  "declaracion_poder": "String: Declaración de IDENTIDAD poderosa en primera persona como si ${userName} la dijera. OBLIGATORIO usar 'YO SOY...', 'SOY...'. Ejemplo: 'YO, ${userName.toUpperCase()}, SOY...' Define su ESENCIA permanente, NO acciones temporales. SIN 'este año haré...', SÍ 'SOY...'",
  
  "advertencias": [
    "String: Advertencia honesta 1 sobre patrones autodestructivos",
    "String: Advertencia honesta 2",
    "String: Advertencia honesta 3"
  ],

  "insights_transformacionales": [
    "String: Insight profundo 1",
    "String: Insight profundo 2",
    "String: Insight profundo 3",
    "String: Insight profundo 4",
    "String: Insight profundo 5"
  ],

  "rituales_recomendados": [
    "String: Ritual 1 - práctico y específico para activar su energía planetaria",
    "String: Ritual 2 - relacionado con su Luna para sanar patrones emocionales",
    "String: Ritual 3 - para integrar luz y sombra de sus aspectos principales",
    "String: Ritual 4 - para conectar con su Nodo Norte y evolución"
  ],

  "pregunta_final_reflexion": "String: Pregunta profunda para que ${userName} reflexione sobre su carta completa"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REQUISITOS CRÍTICOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. USA EL NOMBRE ${userName} al menos 10 veces en toda la interpretación
2. USA LAS POSICIONES EXACTAS de los planetas (signos, grados, casas)
3. SÉ ESPECÍFICA: "Luna en Libra Casa 8" no solo "Luna en Libra"
4. SIEMPRE incluye el significado de la casa entre paréntesis la PRIMERA vez que la menciones
  Ejemplo: "Casa 8 (transformación, intimidad, recursos compartidos)"
5. CONECTA INFANCIA → PATRÓN ADULTO en cada análisis
6. USA EJEMPLOS DE VIDA REAL, no abstracciones
7. BALANCEA: Por cada sombra, muestra la luz y la integración
8. RESPONDE SOLO CON JSON VÁLIDO. Sin texto antes ni después.
9. CIERRA TODAS las llaves, corchetes y comillas correctamente
10. Si llegas al límite de tokens, PRIORIZA completar el JSON correctamente
11. NUNCA incluyas acciones temporales, rituales o mantras (eso NO va aquí)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKLIST ANTES DE RESPONDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ ¿Usé LENGUAJE DE IDENTIDAD PERMANENTE? ("Eres...", "Tu esencia es...", "Naciste para...")
□ ¿EVITÉ lenguaje temporal? ("este año", "durante 2025", "este ciclo")
□ ¿La declaración_poder usa "YO SOY..." definiendo IDENTIDAD, no acciones temporales?
□ ¿Conecté infancia → patrón adulto en formación_temprana?
□ ¿Incluí todos los campos obligatorios del JSON?
□ ¿El JSON es válido y está completo?

**AHORA GENERA LA INTERPRETACIÓN NATAL CON LENGUAJE DE IDENTIDAD PERMANENTE.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 EJEMPLOS DE LENGUAJE CORRECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ MAL: "Tienes Luna en Libra, lo que indica necesidad de armonía"
✅ BIEN: "Tu Luna en Libra Casa 8 (transformación profunda, intimidad, recursos compartidos) te formó como una niña que aprendió que mantener la paz era MÁS importante que expresar tu intensidad emocional real. Hoy, ese patrón se manifiesta cuando absorbes las emociones de otros como esponja, sacrificando tu propia intensidad para no 'romper el equilibrio'."

❌ MAL: "Venus en Capricornio indica amor maduro"
✅ BIEN: "Tu Venus en Capricornio Casa 12 (espiritualidad, subconsciente, karma) te enseñó que el amor es RESPONSABILIDAD, trabajo, estructura. Probablemente de niña viste relaciones donde el afecto se demostraba con hechos, no con palabras. Hoy amas con lealtad inquebrantable, pero te cuesta RECIBIR amor sin sentir que debes 'ganártelo' primero."

❌ MAL: "Saturno en Géminis indica disciplina mental"
✅ BIEN: "Tu Saturno en Géminis Casa 5 (creatividad, autoexpresión, romance) instaló en ti una voz interna que dice 'no eres suficientemente inteligente/brillante/ingeniosa'. De niña quizás sentiste que debías PROBAR tu valor intelectual constantemente. Hoy, esa exigencia mental te bloquea la creatividad espontánea y el juego. Te cuesta permitirte crear SIN que sea 'perfecto' primero."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ COMIENZA AHORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Genera la interpretación completa para ${userName} en JSON válido.
Recuerda: Profundidad psicológica + lenguaje claro + ejemplos reales.
`;

  return prompt;
}

// =============================================================================
// 🔄 FUNCIÓN: PROMPT CARTA PROGRESADA (mantener simple por ahora)
// =============================================================================

export function generateDisruptiveProgressedPrompt(
  progressedChart: ChartData,
  natalChart: ChartData,
  userProfile: UserProfile,
  natalInterpretation?: any
): string {
  
  const userName = userProfile.name || 'Usuario';
  
  // Simplificado - puede mejorarse después
  const prompt = `
Eres un astrólogo evolutivo especializado en PROGRESIONES SECUNDARIAS.

Interpreta la carta progresada de ${userName.toUpperCase()} comparándola con su carta natal.

DATOS:
- Usuario: ${userName}, ${userProfile.age} años
- Carta Natal: ${formatChartForPrompt(natalChart)}
- Carta Progresada: ${formatChartForPrompt(progressedChart)}

Enfócate en:
1. Qué EVOLUCIONÓ desde el nacimiento
2. Qué patrones natales se están ACTIVANDO ahora
3. Qué está MADURANDO en su psique

Responde con JSON válido con estructura:
{
  "tema_anual": "String",
  "evolucion_personalidad": "String",
  "cambios_principales": [...],
  "recomendaciones_evolutivas": [...]
}
`;

  return prompt;
}

// =============================================================================
// 🛠️ FUNCIÓN AUXILIAR: Formatear Carta para Prompt
// =============================================================================

export function formatChartForPrompt(chartData: ChartData): string {
  if (!chartData || !chartData.planets) return 'Sin datos';
  
  const planetsText = chartData.planets
    .map(p => {
      const house = p.house || p.houseNumber || '?';
      return `${p.name} ${p.sign} ${Math.floor(p.degree)}° Casa ${house}`;
    })
    .join(', ');
  
  return planetsText;
}