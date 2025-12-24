//src/utils/prompts/triplePrompts.ts
// =============================================================================
// 📚 EJEMPLO DE REFERENCIA: Mercurio en Piscis Casa 1 - FORMATO EDUCATIVO
// =============================================================================
// Este ejemplo muestra el estilo educativo esperado para todas las interpretaciones

const REFERENCE_EXAMPLE = `
**EJEMPLO DE FORMATO EDUCATIVO:**

☿️ MERCURIO EN PISCIS EN CASA 1
→ TU FORMA DE PENSAR Y COMUNICAR

(Casa 1: identidad, forma de ser, cómo te presentas al mundo)

Tu Mercurio representa tu forma de pensar, procesar información y comunicarte con el mundo. En Piscis, un signo de agua mutable, tu mente funciona de forma intuitiva y sensible, más allá de la lógica pura.

Piscis le da a tu Mercurio una cualidad imaginativa y empática. Tu forma de pensar no es lineal, sino que fluye como el agua, conectando ideas aparentemente inconexas a través de la intuición. Captas matices emocionales y simbólicos que otros pasan por alto.

En la Casa 1, que representa tu identidad y forma de ser, este Mercurio en Piscis se convierte en una parte visible de quién eres. Las personas te perciben como alguien sensible, imaginativo y con una forma única de expresarse. Tu comunicación tiende a ser suave, empática, a veces poética.

Desde pequeño/a, probablemente te diste cuenta de que tu forma de aprender era diferente. Mientras otros memorizaban datos y seguían instrucciones lineales, tú necesitabas conectar emocionalmente con lo que aprendías, visualizarlo, sentirlo. Quizás te costaba concentrarte en temas áridos, pero brillabas en áreas creativas o emocionales.

En tu vida adulta, esto se manifiesta como una habilidad especial para comprender a los demás sin necesidad de palabras. Eres bueno/a captando el subtexto, leyendo entre líneas, entendiendo lo que no se dice. Tu comunicación es empática y conecta con el corazón de las personas.

La sombra de este Mercurio puede ser la confusión mental o la dificultad para poner límites claros en tu comunicación. A veces puedes sentirte abrumado/a por tanta información sutil, o tener problemas para estructurar tus pensamientos de forma práctica. Puedes idealizar o distorsionar la realidad a través de tu filtro emocional.

La luz emerge cuando aprendes a confiar en tu intuición sin perder el contacto con la realidad práctica. Tu don es traducir lo intangible en palabras, comunicar lo que otros sienten pero no saben expresar, y pensar de forma holística e integradora.

━━━━━━━━━━━━━━━━━━
✨ EN RESUMEN

Eres más tú mismo/a cuando: Puedes explorar ideas de forma libre y creativa, sin presión por ser lógico/a o estructurado/a.

Tu don mayor en esta área: La capacidad de comunicar desde el corazón y comprender el lenguaje emocional del mundo.
`;

// =============================================================================
// 🎯 INTERFACES PARA INTERPRETACIONES EDUCATIVAS
// =============================================================================

export interface TripleFusedInterpretation {
  // Tooltip (resumen)
  tooltip: {
    titulo: string;
    descripcionBreve: string;
    significado: string;      // 2-3 líneas con lenguaje claro y educativo
    efecto: string;           // 1 línea
    tipo: string;             // 1 línea
  };

  // Drawer (contenido completo - FORMATO EDUCATIVO)
  drawer: {
    titulo: string;              // Ej: "☿️ MERCURIO EN PISCIS EN CASA 1"
    subtitulo: string;           // Ej: "→ TU FORMA DE PENSAR Y COMUNICAR"
    explicacion_casa: string;    // Ej: "(Casa 1: identidad, forma de ser...)"
    parrafos: string[];          // Array de párrafos educativos que explican:
                                 // 1. Qué representa el planeta/punto
                                 // 2. Qué añade el signo
                                 // 3. Qué significa en esta casa
                                 // 4. Cómo se formó desde pequeño/a
                                 // 5. Cómo se manifiesta en adulto
                                 // 6. Sombra
                                 // 7. Luz
    cierre: {
      activacion: string;        // "Eres más tú mismo/a cuando..." (lenguaje permanente, NO temporal)
      don_mayor: string;         // "Tu don mayor en esta área..."
    };
  };
}

// =============================================================================
// 🌟 PROMPT PARA PLANETAS (Sol, Luna, Mercurio, etc.)
// =============================================================================

export function generatePlanetTripleFusedPrompt(
  planetName: string,
  sign: string,
  degree: number,
  house: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  
  return `
Eres un astrólogo evolutivo EXPERTO en crear interpretaciones transformacionales.

Tu tarea: Generar una interpretación del **${planetName} en ${sign} Casa ${house}** para ${userName} usando el **LENGUAJE TRIPLE FUSIONADO** (educativo + poderoso + poético).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${userName}
Edad: ${userProfile.age} años
Nacimiento: ${userProfile.birthDate}
Lugar: ${userProfile.birthPlace}

Posición a interpretar: **${planetName} en ${sign} ${Math.floor(degree)}° Casa ${house}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 EJEMPLO DE REFERENCIA (Estilo a seguir)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${REFERENCE_EXAMPLE}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA - FORMATO EDUCATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder SOLO con JSON válido en este formato:

{
  "tooltip": {
    "titulo": "String: Símbolo del planeta + descripción clara (Ej: '☿️ Tu Forma de Pensar')",
    "descripcionBreve": "${planetName} en ${sign} en Casa ${house}",
    "significado": "String de 2-3 líneas: Resumen claro y educativo de qué significa esta posición. Lenguaje accesible, sin misticismo.",
    "efecto": "String de 1 línea: El efecto principal de esta posición en tu vida",
    "tipo": "String de 1 línea: Categoría simple (Ej: 'Comunicación intuitiva', 'Identidad visionaria')"
  },

  "drawer": {
    "titulo": "String: Emoji + PLANETA EN SIGNO EN CASA X (Ej: '☿️ MERCURIO EN PISCIS EN CASA 1')",
    "subtitulo": "String: → TU [ÁREA DE VIDA] (Ej: '→ TU FORMA DE PENSAR Y COMUNICAR')",
    "explicacion_casa": "String: (Casa X: breve explicación del área de vida que representa)",

    "parrafos": [
      "Párrafo 1: Explica qué representa ${planetName} y qué significa en ${sign}. Conecta planeta + signo de forma clara.",
      "Párrafo 2: Explica qué añade el signo (elemento, modalidad, características principales).",
      "Párrafo 3: Explica qué significa estar en Casa ${house} y cómo esto se manifiesta.",
      "Párrafo 4: INFANCIA - Cómo se formó este patrón desde pequeño/a. Usa 'Desde pequeño/a...' o 'Probablemente de niño/a...'",
      "Párrafo 5: VIDA ADULTA - Cómo se manifiesta en la actualidad. Usa 'En tu vida adulta...' o 'Actualmente...'",
      "Párrafo 6: SOMBRA - Explica la sombra de esta posición sin dramatismo. Usa 'La sombra puede ser...'",
      "Párrafo 7: LUZ - Explica el don y la integración. Usa 'La luz emerge cuando...' o 'Tu don es...'"
    ],

    "cierre": {
      "activacion": "String de 1-2 líneas: Cuándo eres más tú mismo/a en esta área. USA LENGUAJE PERMANENTE: 'Eres más tú mismo/a cuando...', 'Tu esencia fluye cuando...', 'Estás en tu elemento cuando...'. NUNCA uses 'Te activas cuando...' (eso es para Solar Return).",
      "don_mayor": "String de 1-2 líneas: Tu don mayor en esta área (completa: 'Tu don mayor en esta área...')"
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: CARTA NATAL ES IDENTIDAD PERMANENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Carta Natal** = Mapa de esencia permanente e identidad
**SÍ** defines quién ES la persona en su núcleo
**NO** describes eventos temporales o ciclos anuales

LENGUAJE OBLIGATORIO:
✅ "Eres..."
✅ "Tu esencia es..."
✅ "Naciste para..."
✅ "YO SOY..." / "Yo, ${userName}, SOY..." (en declaraciones)
✅ Lenguaje de identidad permanente y atemporal
✅ "En tu núcleo eres..."
✅ "Tu naturaleza es..."

LENGUAJE PROHIBIDO:
❌ "Este año..."
❌ "Durante 2025..."
❌ "Este ciclo..."
❌ "En este momento..."
❌ Referencias a períodos temporales específicos
❌ Lenguaje transitorio o anual

IMPORTANTE: Usa "Eres...", NO "Este año eres...". La carta natal define identidad permanente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS - FORMATO EDUCATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **LENGUAJE:**
   ✅ Claro, pedagógico, humano
   ✅ Como si le explicaras a alguien sin conocimientos de astrología
   ✅ Usa "Eres...", "Tu propósito es...", "Naciste para..."
   ✅ Explica conceptos sin tecnicismos
   ✅ Conecta infancia → patrón adulto → sombra → luz

   ❌ PROHIBIDO:
   - Lenguaje épico o místico ("Alma Radical", "Viajero Cósmico")
   - Lenguaje temporal ("Este año...", "Durante 2025...")
   - Declaraciones dramáticas exageradas
   - Espiritualidad vacía o new age
   - MAYÚSCULAS enfáticas excesivas
   - Metáforas rebuscadas

2. **TONO:**
   - Educativo y accesible
   - Honesto y realista (no idealizado)
   - Empático sin ser dramático
   - Práctico y aplicable a la vida real

3. **ESTRUCTURA DE PÁRRAFOS:**
   - Exactamente 7 párrafos en el array "parrafos"
   - Cada párrafo: 4-6 líneas (no más, no menos)
   - Sigue la secuencia: planeta+signo → signo → casa → infancia → adulto → sombra → luz
   - Escribe de forma fluida y continua, sin subtítulos dentro de los párrafos

4. **PERSONALIZACIÓN:**
   - Usa "tu", "eres", "tienes" (segunda persona)
   - NO uses el nombre de ${userName} en exceso (máximo 1-2 veces)
   - Conecta con experiencias de vida reales

5. **FORMATO:**
   - Responde SOLO con JSON válido
   - NO incluyas markdown, NO incluyas emojis dentro de los párrafos del array
   - Los emojis SOLO van en título y subtítulo
   - NO uses secciones como "📚 QUÉ SIGNIFICA" dentro de los párrafos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Genera ahora la interpretación completa en JSON con formato educativo:
`;
}

// =============================================================================
// 🎯 PROMPT PARA ASCENDENTE
// =============================================================================

export function generateAscendantTripleFusedPrompt(
  sign: string,
  degree: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  
  return `
Eres un astrólogo evolutivo EXPERTO en crear interpretaciones transformacionales.

Tu tarea: Generar una interpretación del **Ascendente en ${sign}** para ${userName} usando el **LENGUAJE TRIPLE FUSIONADO** (educativo + poderoso + poético).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${userName}
Edad: ${userProfile.age} años
Nacimiento: ${userProfile.birthDate}
Lugar: ${userProfile.birthPlace}

Posición a interpretar: **Ascendente en ${sign} ${Math.floor(degree)}°**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 QUÉ ES EL ASCENDENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El Ascendente es:
- Tu MÁSCARA SOCIAL: cómo te presentas al mundo
- Tu PRIMERA IMPRESIÓN: la energía que proyectas antes de que te conozcan
- Tu CUERPO FÍSICO: cómo se manifiesta en tu apariencia y vitalidad
- Tu ENFOQUE DE VIDA: el lente a través del cual experimentas la realidad
- Tu INSTINTO AUTOMÁTICO: tu forma natural de responder a nuevas situaciones

NO es tu esencia (eso es el Sol), pero SÍ es tu forma de ESTAR en el mundo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: CARTA NATAL ES IDENTIDAD PERMANENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LENGUAJE OBLIGATORIO:
✅ "Eres...", "Tu presencia es...", "Naciste con..."
✅ "YO SOY..." (en declaraciones)
✅ Lenguaje de identidad permanente

LENGUAJE PROHIBIDO:
❌ "Este año...", "Durante 2025...", "Este ciclo..."
❌ Referencias temporales

El Ascendente define cómo ERES en tu presencia, no cómo estás este año.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sigue la misma estructura que para planetas, pero adaptada al Ascendente:

{
  "tooltip": {
    "titulo": "String con emoji del tipo de presencia/máscara",
    "descripcionBreve": "Ascendente en ${sign} (Identidad Externa)",
    "significado": "2-3 líneas sobre cómo proyectas tu energía al mundo",
    "efecto": "1 línea sobre el efecto en primeras impresiones",
    "tipo": "Tipo de presencia (Ej: 'Magnética', 'Intelectual', 'Protectora')"
  },
  
  "drawer": {
    "titulo": "Título memorable sobre su máscara/presencia",
    
    "educativo": "Explica:
    - Qué es el Ascendente y por qué es importante
    - Características de ${sign} como Ascendente
    - Cómo se manifiesta en su cuerpo físico
    - Cómo afecta sus primeras impresiones
    - Cómo influye en su vitalidad y energía
    - Ejemplos concretos de comportamientos
    6-8 párrafos completos",
    
    "poderoso": "Explica:
    - El superpoder de su Ascendente en ${sign}
    - Cómo usar conscientemente esta máscara
    - La diferencia entre Ascendente auténtico vs defensivo
    - Cómo su Ascendente protege/sirve a su Sol
    - Herramientas para activarlo positivamente
    6-8 párrafos completos",
    
    "poetico": "Metáforas sobre:
    - Su presencia en el mundo
    - La 'máscara' como herramienta, no mentira
    - La primera impresión como portal
    4-6 párrafos poéticos",
    
    "sombras": [
      {
        "nombre": "Sombra 1 del Ascendente en ${sign}",
        "descripcion": "Cómo se manifiesta",
        "trampa": "❌ La trampa de esta sombra",
        "regalo": "✅ El regalo al integrarla"
      },
      {
        "nombre": "Sombra 2",
        "descripcion": "...",
        "trampa": "❌ ...",
        "regalo": "✅ ..."
      }
    ],
    
    "sintesis": {
      "frase": "Frase memorable sobre su presencia/máscara",
      "declaracion": "Declaración en primera persona sobre cómo elige presentarse al mundo"
    }
  }
}

Genera ahora la interpretación completa en JSON:
`;
}

// =============================================================================
// 🎯 PROMPT PARA MEDIO CIELO
// =============================================================================

export function generateMidheavenTripleFusedPrompt(
  sign: string,
  degree: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  
  return `
Eres un astrólogo evolutivo EXPERTO en crear interpretaciones transformacionales.

Tu tarea: Generar una interpretación del **Medio Cielo en ${sign}** para ${userName} usando el **LENGUAJE TRIPLE FUSIONADO** (educativo + poderoso + poético).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${userName}
Edad: ${userProfile.age} años
Nacimiento: ${userProfile.birthDate}
Lugar: ${userProfile.birthPlace}

Posición a interpretar: **Medio Cielo en ${sign} ${Math.floor(degree)}°**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 QUÉ ES EL MEDIO CIELO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El Medio Cielo (MC) es:
- Tu VOCACIÓN DEL ALMA: no solo "trabajo", sino contribución al mundo
- Tu IMAGEN PÚBLICA: cómo te ve el mundo profesionalmente
- Tu LEGADO: qué huella quieres dejar
- Tu AUTORIDAD: qué tipo de liderazgo/poder ejerces
- Tu REALIZACIÓN: cómo te sientes satisfecho en lo público

Es el punto más alto del cielo en tu carta - simboliza tu culminación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: CARTA NATAL ES IDENTIDAD PERMANENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LENGUAJE OBLIGATORIO:
✅ "Tu vocación es...", "Naciste para...", "Eres llamado/a a..."
✅ "YO SOY..." (en declaraciones)
✅ Lenguaje de identidad permanente

LENGUAJE PROHIBIDO:
❌ "Este año...", "Durante 2025...", "Este ciclo..."
❌ Referencias temporales

El Medio Cielo define tu VOCACIÓN DE ALMA permanente, no qué harás este año.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "tooltip": {
    "titulo": "String con emoji del tipo de vocación",
    "descripcionBreve": "Medio Cielo en ${sign} (Vocación y Legado)",
    "significado": "2-3 líneas sobre su vocación del alma y contribución",
    "efecto": "1 línea sobre su imagen pública/profesional",
    "tipo": "Tipo de vocación (Ej: 'Sanadora', 'Visionaria', 'Constructora')"
  },
  
  "drawer": {
    "titulo": "Título memorable sobre su vocación/legado",
    
    "educativo": "Explica:
    - Qué es el Medio Cielo y por qué define vocación
    - Características de ${sign} como vocación
    - Tipos de carreras/roles donde brillaría
    - Cómo desarrolla su autoridad natural
    - Qué tipo de liderazgo ejerce
    - Ejemplos específicos de profesiones/industrias
    6-8 párrafos completos",
    
    "poderoso": "Explica:
    - Su verdadera contribución al mundo (más allá de 'trabajo')
    - El legado que está destinada a dejar
    - Cómo activar su autoridad interna
    - La diferencia entre 'éxito' y 'realización' para ella
    - Herramientas para manifestar su MC
    6-8 párrafos completos",
    
    "poetico": "Metáforas sobre:
    - Su vocación como llamado del alma
    - El legado como semilla plantada
    - La autoridad como servicio
    4-6 párrafos poéticos",
    
    "sombras": [
      {
        "nombre": "Sombra vocacional 1",
        "descripcion": "Cómo se manifiesta en su carrera/vocación",
        "trampa": "❌ La trampa",
        "regalo": "✅ El regalo"
      },
      {
        "nombre": "Sombra vocacional 2",
        "descripcion": "...",
        "trampa": "❌ ...",
        "regalo": "✅ ..."
      }
    ],
    
    "sintesis": {
      "frase": "Frase memorable sobre su vocación/legado",
      "declaracion": "Declaración en primera persona sobre su contribución al mundo"
    }
  }
}

Genera ahora la interpretación completa en JSON:
`;
}

// =============================================================================
// 🎯 PROMPT PARA ASPECTOS
// =============================================================================

export function generateAspectTripleFusedPrompt(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  
  // Traducir tipos de aspectos
  const aspectTypeSpanish: Record<string, string> = {
    'conjunction': 'Conjunción',
    'opposition': 'Oposición',
    'trine': 'Trígono',
    'square': 'Cuadratura',
    'sextile': 'Sextil'
  };
  
  const aspectName = aspectTypeSpanish[aspectType] || aspectType;
  const isExact = orb < 1;
  
  return `
Eres un astrólogo evolutivo EXPERTO en crear interpretaciones transformacionales.

Tu tarea: Generar una interpretación del aspecto **${planet1} ${aspectName} ${planet2}** para ${userName} usando el **LENGUAJE TRIPLE FUSIONADO**.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${userName}
Aspecto: **${planet1} ${aspectName} ${planet2}**
Orbe: ${orb.toFixed(2)}°${isExact ? ' (EXACTO - máxima potencia)' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 QUÉ SON LOS ASPECTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los aspectos son "conversaciones" entre planetas. Representan cómo diferentes partes de tu personalidad se relacionan entre sí.

${aspectName}:
${getAspectDescription(aspectName)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: CARTA NATAL ES IDENTIDAD PERMANENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LENGUAJE OBLIGATORIO:
✅ "Este diálogo ES...", "Eres alguien que...", "Tu naturaleza incluye..."
✅ "YO SOY..." (en declaraciones)
✅ Lenguaje de identidad permanente

LENGUAJE PROHIBIDO:
❌ "Este año...", "Durante 2025...", "Este ciclo..."
❌ Referencias temporales

Los aspectos natales definen diálogos PERMANENTES en tu psique, no temporales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "tooltip": {
    "titulo": "String con emoji del aspecto",
    "descripcionBreve": "${aspectName} entre ${planet1} y ${planet2}",
    "significado": "2-3 líneas sobre el diálogo interno entre estos planetas",
    "efecto": "1 línea sobre cómo se manifiesta en la vida",
    "tipo": "Tipo de aspecto (Ej: 'Tenso - Forja maestría', 'Fluido - Talento natural')"
  },
  
  "drawer": {
    "titulo": "Título memorable sobre este diálogo planetario",
    
    "educativo": "Explica:
    - Qué representa ${planet1} (arquetipo, función)
    - Qué representa ${planet2} (arquetipo, función)
    - Qué significa ${aspectName} (ángulo, naturaleza)
    - Cómo estos dos planetas 'conversan' en su psique
    - Ejemplos concretos de cómo se manifiesta
    - Por qué este aspecto es significativo
    6-8 párrafos completos",
    
    "poderoso": "Explica:
    - El superpoder que emerge de esta tensión/armonía
    - Cómo usar este aspecto conscientemente
    - Por qué esta 'conversación interna' es su FUERZA
    - Herramientas para integrar ambos planetas
    - Ejemplos de personas famosas con este aspecto
    6-8 párrafos completos",
    
    "poetico": "Metáforas sobre:
    - El diálogo entre estos dos arquetipos
    - La danza/batalla entre estas energías
    - La integración como síntesis creativa
    4-6 párrafos poéticos",
    
    "sombras": [
      {
        "nombre": "Sombra del aspecto 1",
        "descripcion": "Manifestación no integrada",
        "trampa": "❌ La trampa",
        "regalo": "✅ El regalo al integrar"
      },
      {
        "nombre": "Sombra del aspecto 2",
        "descripcion": "...",
        "trampa": "❌ ...",
        "regalo": "✅ ..."
      }
    ],
    
    "sintesis": {
      "frase": "Frase memorable sobre este aspecto",
      "declaracion": "Declaración sobre cómo integra ambas energías"
    }
  }
}

Genera ahora la interpretación completa en JSON:
`;
}

// =============================================================================
// ☀️ PROMPT PARA PLANETAS DE SOLAR RETURN
// =============================================================================

export function generateSolarReturnPlanetPrompt(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  year: number,
  natalPlanetPosition?: { sign: string; house: number },
  userProfile?: any
): string {
  const userName = userProfile?.name || 'la persona';
  const age = userProfile?.age || 'X';

  // Mapeo de casas a significados
  const houseKeywords: Record<number, string> = {
    1: 'identidad, cuerpo, iniciativa personal',
    2: 'dinero, recursos, valores, autoestima',
    3: 'comunicación, aprendizaje, entorno cercano',
    4: 'hogar, familia, raíces, vida privada',
    5: 'creatividad, romance, placer, hijos',
    6: 'salud, trabajo diario, hábitos',
    7: 'relaciones, asociaciones, pareja',
    8: 'transformación, recursos compartidos, intimidad',
    9: 'expansión, viajes, estudios, filosofía',
    10: 'carrera, imagen pública, logros',
    11: 'amistades, proyectos grupales, visión de futuro',
    12: 'introspección, espiritualidad, cierre de ciclos'
  };

  const houseKeyword = houseKeywords[house] || 'área específica de vida';

  return `
Eres un astrólogo evolutivo EXPERTO en Retornos Solares.

Tu misión: Crear una interpretación de **${planetName} en ${sign} Casa ${house} SR** para el año ${year}-${year + 1}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: RETORNO SOLAR NO ES IDENTIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Retorno Solar** = Mapa de entrenamiento anual
**NO** definas quién es la persona
**SÍ** describe qué se activa, qué se entrena, qué se pone a prueba ESTE año

PROHIBIDO:
❌ "Eres el guerrero poeta..."
❌ "Tu esencia es..."
❌ "Yo soy..."

OBLIGATORIO:
✅ "Este año se activa..."
✅ "Durante ${year} aprenderás..."
✅ "El reto este año es..."
✅ "Hasta tu próximo cumpleaños..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuario: ${userName}, ${age} años
Año Solar: ${year}-${year + 1}
Planeta: ${planetName} en ${sign} ${Math.floor(degree)}° Casa ${house} SR
Área de vida: ${houseKeyword}
${natalPlanetPosition ? `\nPosición Natal: ${planetName} en ${natalPlanetPosition.sign} Casa ${natalPlanetPosition.house}\n→ Este año cambia de enfoque` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON (sin emojis, tono claro y directo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "tooltip": {
    "titulo": "${planetName} SR ${year}: [Tema del año en 3-5 palabras]",
    "descripcionBreve": "${planetName} en ${sign} Casa ${house} (${houseKeyword})",
    "significado": "2-3 líneas explicando QUÉ SE ACTIVA este año respecto a ${planetName}. Lenguaje temporal: 'Este año...', 'Durante este ciclo...'",
    "efecto": "1 frase: Efecto principal del año",
    "tipo": "Año de [característica principal]"
  },

  "drawer": {
    "titulo": "[Título del aprendizaje anual - sin poesía excesiva]",

    "educativo": "6-8 párrafos en TEXTO CORRIDO que incluyan TODO esto (sin subtítulos):

    Párrafo 1: QUÉ SE ACTIVA ESTE AÑO
    '${planetName} en Retorno Solar no define quién eres, sino qué energía se entrena este año. En ${sign}, esta energía toma un carácter de [describe]. En Casa ${house} (${houseKeyword}), se manifiesta específicamente en [área concreta de vida].'

    Párrafo 2: CÓMO SE MANIFIESTA EN LA VIDA DIARIA
    Situaciones CONCRETAS del año ${year}:
    - Conversaciones específicas
    - Decisiones que se repiten
    - Personas que aparecen
    - Escenarios cotidianos
    NO poesía abstracta. Ejemplos reales.

    Párrafo 3: PARA QUÉ VIENE ESTO (aprendizaje del año)
    'Este año la vida te entrena en [habilidad/actitud específica]. No es casualidad que ${planetName} esté aquí: el universo te pide [qué desarrollar].'

    Párrafo 4: CÓMO SE CRUZA CON TU FORMA DE SER${natalPlanetPosition ? `
    'Natalmente, tu ${planetName} en ${natalPlanetPosition.sign} Casa ${natalPlanetPosition.house} te da una naturaleza [describe brevemente]. Pero este año, con ${planetName} en ${sign} Casa ${house} SR, la vida te pide [contraste/complemento con natal].'` : `
    'Dependiendo de cómo seas natalmente, este tránsito puede sentirse como [opciones según personalidad].'`}

    Párrafos 5-6: CÓMO USAR ESTO CONSCIENTEMENTE
    - Qué HACER durante ${year}
    - Qué observar mes a mes
    - Cómo convertir esto en ventaja
    - Herramientas prácticas

    Párrafos 7-8: CONEXIÓN CON LA EDAD Y MOMENTO VITAL
    'A los ${age} años, este tránsito tiene especial relevancia porque [contexto de edad]. Durante ${year}-${year + 1}, tu trabajo es [enfoque del año].'",

    "poderoso": "5-7 párrafos TEXTO CORRIDO (no lista) con tono motivacional pero sobrio:

    Este bloque responde: '¿Cómo convierto esto en poder personal?'

    - Validación sin drama: 'Durante este año es normal sentir...'
    - Riesgo si reaccionas en automático: 'Si no prestas atención, podrías...'
    - Oportunidad si usas consciencia: 'Si eliges conscientemente, puedes...'
    - Actitud que conviene: 'La actitud que te servirá este año es...'
    - Pregunta clave del año: '¿Qué versión de ti quiere emerger este año?'
    - Conexión con agenda/vida práctica: 'Cada mes, pregúntate...'

    SIN mantras. SIN declaraciones cósmicas. SOLO enfoque práctico.",

    "poetico": "3-5 párrafos SOBRIOS pero evocativos:

    Metáfora del CICLO ANUAL (no de identidad eterna)
    - Imagen del viaje de ESTE año específico
    - Referencia a estaciones si aplica
    - Clima energético de ${year}
    - Cierre inspirador TEMPORAL

    Ejemplo de tono correcto:
    'Este año es como una temporada de entrenamiento. El terreno donde entrenas es ${houseKeyword}. El estilo que usarás es ${sign}. No se trata de quién eres, sino de qué versión tuya se fortalece ahora.'

    NO épica atemporal. SÍ inspiración anclada al ciclo.",

    "sombras": [
      {
        "nombre": "Sombra del año 1",
        "descripcion": "Reacción automática típica de ESTE año (no de tu personalidad eterna)",
        "trampa": "❌ Si este año reaccionas sin consciencia: [consecuencia específica del año]",
        "regalo": "✅ Si usas esto con consciencia este año: [beneficio específico]"
      },
      {
        "nombre": "Sombra del año 2",
        "descripcion": "Patrón que puede emerger DURANTE ${year}",
        "trampa": "❌ Tentación de [patrón reactivo]",
        "regalo": "✅ Oportunidad de [integración consciente]"
      }
    ],

    "sintesis": {
      "frase": "Tema del año en 1 frase (5-10 palabras)",
      "declaracion": "Clave de integración para ${year}: [frase práctica sin 'Yo soy', tipo 'Pausa antes de responder' o 'La consciencia transforma cualquier tránsito']"
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKLIST FINAL ANTES DE ENVIAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Usaste lenguaje temporal: "este año", "durante ${year}", "hasta tu próximo cumpleaños"
[ ] NO dijiste "eres", dijiste "este año se activa"
[ ] Incluiste situaciones CONCRETAS de vida diaria
[ ] Explicaste PARA QUÉ viene este aprendizaje
[ ] Conectaste con natal (si disponible)
[ ] Especificaste sombra DEL AÑO (no eterna)
[ ] La declaración final NO es "Yo soy...", es una frase de integración práctica
[ ] El tono es motivacional pero SOBRIO
[ ] Todo suena ENTRENABLE, no definitorio

Ahora genera el JSON:
`;
}

// =============================================================================
// ⚡ PROMPT PARA ASPECTOS DE SOLAR RETURN
// =============================================================================

export function generateSolarReturnAspectPrompt(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  year: number,
  natalAspect?: { exists: boolean; type?: string; orb?: number },
  userProfile?: any
): string {
  const userName = userProfile?.name || 'la persona';
  const age = userProfile?.age || 'X';

  // Traducir tipos de aspectos
  const aspectTypeSpanish: Record<string, string> = {
    'conjunction': 'Conjunción',
    'opposition': 'Oposición',
    'trine': 'Trígono',
    'square': 'Cuadratura',
    'sextile': 'Sextil'
  };

  const aspectName = aspectTypeSpanish[aspectType] || aspectType;
  const isExact = orb < 1;

  return `
Eres un astrólogo evolutivo EXPERTO en Retornos Solares.

Tu misión: Crear una interpretación del aspecto **${planet1} ${aspectName} ${planet2} SR** para el año ${year}-${year + 1}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REGLA DE ORO: ASPECTOS EN SOLAR RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Aspecto Natal** = Diálogo interno permanente
**Aspecto SR** = Qué parte de ese diálogo se ACTIVA este año

PROHIBIDO:
❌ "Esta tensión define tu personalidad..."
❌ "Siempre tendrás este conflicto..."
❌ "Eres el resultado de este aspecto..."

OBLIGATORIO:
✅ "Este año se activa..."
✅ "Durante ${year} este diálogo se intensifica..."
✅ "Hasta tu próximo cumpleaños..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuario: ${userName}, ${age} años
Año Solar: ${year}-${year + 1}
Aspecto SR: ${planet1} ${aspectName} ${planet2}
Orbe: ${orb.toFixed(2)}°${isExact ? ' (EXACTO - máxima potencia este año)' : ''}
${natalAspect?.exists ? `\nAspecto Natal: ${natalAspect.type ? `${planet1} ${aspectTypeSpanish[natalAspect.type]} ${planet2} (${natalAspect.orb?.toFixed(1)}°)` : 'Existe en carta natal'}\n→ Este año REACTIVA un patrón natal` : '\n→ NUEVO aspecto este año (no existe en natal)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 NATURALEZA DEL ASPECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${aspectName}: ${getAspectDescription(aspectName)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON (tono claro y directo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "tooltip": {
    "titulo": "${planet1} ${aspectName} ${planet2} SR ${year}",
    "descripcionBreve": "${aspectName} anual entre ${planet1} y ${planet2}",
    "significado": "2-3 líneas explicando QUÉ DIÁLOGO se activa este año entre estos planetas",
    "efecto": "1 frase: Efecto principal durante ${year}",
    "tipo": "${aspectName === 'Trígono' || aspectName === 'Sextil' ? 'Flujo del año' : aspectName === 'Cuadratura' || aspectName === 'Oposición' ? 'Tensión del año' : 'Fusión del año'}"
  },

  "drawer": {
    "titulo": "[Título del diálogo anual - sin poesía excesiva]",

    "educativo": "6-8 párrafos en TEXTO CORRIDO:

    Párrafo 1: QUÉ DIÁLOGO SE ACTIVA ESTE AÑO
    '${planet1} y ${planet2} en Retorno Solar crean un diálogo específico durante ${year}-${year + 1}. ${aspectName} indica [naturaleza del diálogo: tensión/armonía/fusión].'

    Párrafo 2: CÓMO SE MANIFIESTA EN LA VIDA DIARIA
    Situaciones CONCRETAS donde se nota este diálogo:
    - Decisiones específicas
    - Conflictos internos que aparecen
    - Escenarios donde ${planet1} choca/fluye con ${planet2}
    NO abstracto. Ejemplos reales del año.

    Párrafo 3: PARA QUÉ VIENE ESTE DIÁLOGO${natalAspect?.exists ? `
    'Natalmente, ya tienes este diálogo ${natalAspect.type ? `como ${aspectTypeSpanish[natalAspect.type]}` : 'activo'}. Pero este año, en Solar Return, se REACTIVA con ${aspectName} para que [qué aprendizaje específico del año].'` : `
    'Este aspecto NO existe en tu carta natal. Aparece SOLO este año para que [qué aprendizaje temporal].'`}

    Párrafos 4-5: CÓMO TRABAJAR CON ESTE DIÁLOGO
    - Qué hacer cuando ${planet1} y ${planet2} entren en conflicto/armonía
    - Cómo usar esta tensión/fluidez conscientemente
    - Herramientas prácticas para este año

    Párrafos 6-7: CONEXIÓN CON LA EDAD
    'A los ${age} años, este diálogo tiene relevancia porque [contexto de edad]. Durante ${year}, tu trabajo es [enfoque anual].'",

    "poderoso": "5-7 párrafos TEXTO CORRIDO motivacional pero sobrio:

    - Validación: 'Durante este año es normal sentir este tira y afloja...'
    - Riesgo si no integras: 'Si ignoras este diálogo, puede que...'
    - Oportunidad si integras: 'Si trabajas conscientemente con esto, puedes...'
    - Actitud del año: 'La actitud que te servirá es...'
    - Pregunta clave: '¿Cómo puedes hacer que ${planet1} y ${planet2} trabajen juntos este año?'

    SIN mantras eternos. SOLO enfoque del año.",

    "poetico": "3-5 párrafos SOBRIOS pero evocativos:

    Metáfora del DIÁLOGO ANUAL (no eterno):
    'Este año, ${planet1} y ${planet2} son como [metáfora del diálogo temporal]. No se trata de quién gana, sino de qué emerge cuando [imagen del proceso].'

    Referencia al ciclo de ${year}
    Cierre inspirador TEMPORAL

    NO épica atemporal. SÍ inspiración anclada al año.",

    "sombras": [
      {
        "nombre": "Sombra del diálogo anual 1",
        "descripcion": "Cómo puede manifestarse MAL este año si no hay consciencia",
        "trampa": "❌ Si este año ${planet1} domina a ${planet2} sin integración...",
        "regalo": "✅ Si integras ambos conscientemente durante ${year}..."
      },
      {
        "nombre": "Sombra del diálogo anual 2",
        "descripcion": "Patrón reactivo típico de ESTE año",
        "trampa": "❌ Tentación de [patrón del año]",
        "regalo": "✅ Oportunidad de [integración del año]"
      }
    ],

    "sintesis": {
      "frase": "Tema del diálogo anual en 1 frase (5-10 palabras)",
      "declaracion": "Clave de integración para ${year}: [frase práctica tipo 'Escucho ambas voces sin elegir bando']"
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKLIST FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Lenguaje temporal: "este año", "durante ${year}"
[ ] NO "eres así", SÍ "este año este diálogo..."
[ ] Situaciones concretas de vida diaria
[ ] Explicaste PARA QUÉ viene este aspecto
[ ] Comparaste con natal (si existe)
[ ] Sombra DEL AÑO (no eterna)
[ ] Declaración final práctica, no mantra
[ ] Tono motivacional pero SOBRIO
[ ] Todo suena ENTRENABLE

Genera el JSON:
`;
}

// =============================================================================
// 🔧 FUNCIONES AUXILIARES
// =============================================================================

function getAspectDescription(aspectName: string): string {
  const descriptions: Record<string, string> = {
    'Conjunción': 'Ángulo 0° - Fusión total de energías. Los planetas funcionan como UNO. Intensidad máxima.',
    'Oposición': 'Ángulo 180° - Polaridad creativa. Tensión entre opuestos que buscan integrarse. El desafío es el balance.',
    'Trígono': 'Ángulo 120° - Flujo armonioso. Talento natural. La energía fluye sin esfuerzo. Cuidado: puede dar pereza.',
    'Cuadratura': 'Ángulo 90° - Tensión creativa. Fricción que genera crecimiento. El desafío forja maestría.',
    'Sextil': 'Ángulo 60° - Oportunidad fácil. Talento que requiere activación consciente. Potencial disponible.'
  };
  
  return descriptions[aspectName] || 'Aspecto que conecta estas energías planetarias.';
}