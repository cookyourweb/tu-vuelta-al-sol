//src/utils/prompts/triplePrompts.ts
// =============================================================================
// 📚 EJEMPLO DE REFERENCIA: Sol en Acuario Casa 1
// =============================================================================
// Este ejemplo muestra el estilo y profundidad esperada para todas las interpretaciones

const REFERENCE_EXAMPLE = `
**EJEMPLO DE LENGUAJE TRIPLE FUSIONADO:**

🌟 **Sol en Acuario Casa 1: El Visionario Auténtico**

📚 **QUÉ SIGNIFICA (Educativo):**

Tu Sol representa tu ESENCIA VITAL - el núcleo de quién eres cuando estás siendo completamente auténtico. Es tu propósito de vida, tu identidad fundamental, lo que viniste a SER en esta encarnación.

Acuario es el signo del VISIONARIO INNOVADOR. Rige la originalidad y el pensamiento revolucionario, la libertad individual y colectiva, la conexión con el futuro y las posibilidades, la autenticidad radical y la ruptura de moldes, la mente científica combinada con intuición, y los grupos, comunidades y causas sociales.

Casa 1 es tu IDENTIDAD EXTERNA - cómo te presentas al mundo, tu personalidad visible, tu forma de iniciar las cosas. Es tu "primera impresión" y tu forma natural de SER sin esfuerzo.

Tu Sol en Acuario en Casa 1 significa que tu identidad COMPLETA está construida desde la autenticidad radical. No es que "tengas" rasgos acuarianos - es que TU ESENCIA ES acuariana.

🔥 **CÓMO USARLO COMO SUPERPODER (Poderoso):**

Probablemente has vivido momentos donde sentiste que tu "rareza" era un problema. Quizás intentaste "encajar" y te sentiste asfixiado. Quizás te rechazaron por ser "demasiado diferente".

AQUÍ ESTÁ LA VERDAD CÓSMICA: Esa sensación de "no pertenecer" NO es tu debilidad. Es tu antena cósmica.

Tu sistema nervioso está literalmente sintonizado con frecuencias del FUTURO que otros aún no pueden percibir. Cuando te sientes "fuera de lugar" en situaciones convencionales, no es que algo esté mal contigo - es que estás captando la LIMITACIÓN de ese espacio.

🌙 **LA METÁFORA (Poético):**

Imagina que naciste con GAFAS DE VER FUTUROS. Mientras la mayoría de las personas caminan mirando al suelo, calculando el siguiente paso seguro en el camino conocido, tú levantas la vista automáticamente y ves CONSTELACIONES DE POSIBILIDADES flotando en el aire que aún no se han manifestado en el plano físico.

No viniste a ser vela. Viniste a ser TORMENTA ELÉCTRICA.

⚠️ **SOMBRAS A TRABAJAR:**

1. **Rebeldía sin Causa**: Ser diferente SOLO por ser diferente, sin propósito real.
   - ❌ Trampa: Rechazar todo lo establecido por principio, sin discernimiento
   - ✅ Regalo: Ser auténtico porque es tu naturaleza, y elegir conscientemente qué apoyar

2. **Desapego Emocional Excesivo**: Usar tu mente acuariana como ESCUDO contra la vulnerabilidad emocional.
   - ❌ Trampa: Usar tu 'rareza' como excusa para no conectar profundamente
   - ✅ Regalo: Ser único Y vulnerable - la verdadera revolución

✨ **SÍNTESIS:**

"Tu rareza es tu revolución. No la escondas, actívala."

YO SOY el Visionario Auténtico, y mi autenticidad acuariana es mi propósito. No vine a este mundo a encajar en identidades limitantes. Vine a expandir los límites de lo que significa ser humano. Mi diferencia no es mi problema - es mi MISIÓN.
`;

// =============================================================================
// 🎯 INTERFACES PARA INTERPRETACIONES TRIPLE FUSIONADO
// =============================================================================

export interface TripleFusedInterpretation {
  // Tooltip (resumen)
  tooltip: {
    titulo: string;
    descripcionBreve: string;
    significado: string;      // 2-3 líneas con lenguaje triple
    efecto: string;           // 1 línea
    tipo: string;             // 1 línea
  };

  // Drawer (contenido completo)
  drawer: {
    titulo: string;
    educativo: string;        // Varios párrafos educativos
    poderoso: string;         // Varios párrafos empoderadores
    poetico: string;          // Varios párrafos poéticos/metafóricos
    sombras: {
      nombre: string;
      descripcion: string;
      trampa: string;
      regalo: string;
    }[];
    sintesis: {
      frase: string;
      declaracion: string;
      donMayor?: string;         // ⭐ NATAL: Talento permanente
      teActivasCuando?: string;  // ⭐ SOLAR RETURN: Triggers del año
    };
  };
}

// =============================================================================
// 🌟 PROMPT PARA PLANETAS (Sol, Luna, Mercurio, etc.)
// =============================================================================

// =============================================================================
// 🏠 SIGNIFICADOS DE CASAS PARA USAR EN PROMPTS
// =============================================================================

const HOUSE_MEANINGS_SHORT: Record<number, string> = {
  1: "Identidad, apariencia, primeras impresiones",
  2: "Recursos, dinero, valores personales",
  3: "Comunicación, hermanos, aprendizaje",
  4: "Hogar, familia, raíces",
  5: "Creatividad, romance, hijos",
  6: "Trabajo diario, salud, rutinas",
  7: "Pareja, matrimonio, socios",
  8: "Transformación, sexualidad, recursos compartidos",
  9: "Filosofía, viajes, estudios superiores",
  10: "Carrera, reputación, imagen pública",
  11: "Amistades, grupos, ideales",
  12: "Espiritualidad, subconsciente, karma, sacrificio"
};

export function generatePlanetTripleFusedPrompt(
  planetName: string,
  sign: string,
  degree: number,
  house: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  const houseMeaning = HOUSE_MEANINGS_SHORT[house] || `Casa ${house}`;

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
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder SOLO con JSON válido en este formato:

{
  "tooltip": {
    "titulo": "String: Título memorable con emoji (Ej: '🌟 El Visionario Auténtico')",
    "descripcionBreve": "${planetName} en ${sign} en Casa ${house} (${houseMeaning})",
    "significado": "String de 2-3 líneas: Resumen poderoso que fusiona educativo + transformador. Debe capturar la esencia de forma memorable.",
    "efecto": "String de 1 línea: El efecto principal de esta posición",
    "tipo": "String de 1 línea: El tipo/categoría de energía (Ej: 'Revolucionario', 'Sanador', 'Comunicador')"
  },
  
  "drawer": {
    "titulo": "String: Título expandido y memorable (más poético que el del tooltip)",
    
    "educativo": "String largo (múltiples párrafos separados por \\n\\n):
    - Explica qué representa ${planetName} (su arquetipos, función psicológica)
    - Explica qué representa ${sign} (elemento, modalidad, características)
    - Explica qué representa Casa ${house} (área de vida, significado)
    - Conecta los tres: planeta + signo + casa
    - Explica cómo se manifiesta en la vida práctica
    - Da ejemplos concretos de comportamientos/situaciones
    - Usa lenguaje claro, sin jerga excesiva
    - Longitud: 6-8 párrafos completos",
    
    "poderoso": "String largo (múltiples párrafos separados por \\n\\n):
    - Conecta con la experiencia vivida de ${userName}
    - Reencuadra 'problemas' como superpoderes
    - Explica por qué esta configuración es FORTALEZA
    - Nombra el don específico que emerge
    - Da herramientas prácticas para activarlo
    - Habla directo al corazón, no solo a la mente
    - Usa MAYÚSCULAS para énfasis en palabras clave
    - Incluye validación emocional ('Probablemente has sentido...')
    - Longitud: 6-8 párrafos completos",
    
    "poetico": "String largo (múltiples párrafos separados por \\n\\n):
    - Usa metáforas poderosas y memorables
    - Crea imágenes visuales evocativas
    - Conecta con arquetipos universales
    - Usa lenguaje simbólico y poético
    - Evoca la ESENCIA de esta posición
    - Debe ser inspirador y memorable
    - Longitud: 4-6 párrafos completos",
    
    "sombras": [
      {
        "nombre": "String: Nombre memorable de la sombra (Ej: 'Rebeldía sin Causa')",
        "descripcion": "String: Explicación de cómo se manifiesta esta sombra en la vida real",
        "trampa": "String que empieza con ❌: La trampa de esta sombra",
        "regalo": "String que empieza con ✅: El regalo cuando se integra"
      },
      // Incluir 2-3 sombras principales
    ],
    
    "sintesis": {
      "frase": "String: Una frase memorable y poderosa que resume todo (como un mantra)",
      "declaracion": "String: Declaración en primera persona que ${userName} puede usar como afirmación personal. Debe empezar con 'Yo soy...' o 'Yo, ${userName},...'",
      "donMayor": "String de 1-2 líneas: El talento o poder PERMANENTE que emerge de esta posición. Este es tu don innato, tu habilidad natural, tu superpoder que llevas desde siempre."
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0. **FORMATO DESCRIPCIÓN BREVE - MUY IMPORTANTE:**
   - El campo "descripcionBreve" DEBE seguir EXACTAMENTE este formato:
     "${planetName} en ${sign} en Casa ${house} (${houseMeaning})"
   - Ejemplo correcto: "Venus en Capricornio en Casa 12 (Espiritualidad, subconsciente, karma, sacrificio)"
   - NO inventes tu propio significado de casa
   - NO uses frases como "área donde..." o "lugar de..."
   - USA EXACTAMENTE el significado de casa proporcionado: "${houseMeaning}"

1. **LENGUAJE:**
   - Claro y accesible para personas sin conocimientos astrológicos
   - Profundo pero NO críptico
   - Usa ejemplos de vida real
   - Evita jerga técnica excesiva (pero explica cuando uses términos)
   - Balancea lo académico con lo emocional y lo poético

2. **TONO:**
   - Empoderador, no predictivo
   - Honesto sobre sombras, pero constructivo
   - Inspirador sin ser superficial
   - Personal y directo

3. **LONGITUD:**
   - Educativo: 6-8 párrafos densos
    - Poderoso: 6-8 párrafos transformadores
    - Poético: 4-6 párrafos evocativos
    - Cada párrafo debe tener 4-6 líneas mínimo

4. **PERSONALIZACIÓN:**
   - Usa el nombre ${userName} SOLO 2-3 veces en momentos clave
   - Resto del tiempo usa "tú", "tu", "tienes"
   - Conecta con SU vida específica (edad, contexto)

5. **FORMATO:**
   - Responde SOLO con JSON válido
   - NO incluyas markdown
   - NO incluyas comentarios fuera del JSON
   - Usa \\n\\n para separar párrafos dentro de strings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Genera ahora la interpretación completa en JSON:
`;
}

// =============================================================================
// ☀️ PROMPT PARA PLANETAS DE SOLAR RETURN - ACTIVACIONES ANUALES
// =============================================================================

export function generateSolarReturnPlanetPrompt(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  year: number,
  userProfile: any,
  natalPosition?: { sign: string; house: number }
): string {
  const userName = userProfile.name || 'la persona';
  const userAge = userProfile.age || 0;
  const houseMeaning = HOUSE_MEANINGS_SHORT[house] || `Casa ${house}`;

  const natalReference = natalPosition
    ? `Tu ${planetName} natal está en ${natalPosition.sign} Casa ${natalPosition.house}, pero este año ${year} se entrena diferente.`
    : '';

  return `
Eres un astrólogo evolutivo EXPERTO en interpretar RETORNOS SOLARES.

Tu tarea: Generar una interpretación del **${planetName} en ${sign} Casa ${house}** en el RETORNO SOLAR ${year}-${year + 1} de ${userName}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ PRINCIPIO FUNDAMENTAL - LEE CON ATENCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CARTA NATAL = QUIÉN ERES (identidad permanente)**
**SOLAR RETURN = QUÉ SE ACTIVA/ENTRENA ESTE AÑO (temporal)**

En Solar Return:
- NO defines personalidad ni identidad
- NO hablas de "eres así" o "tu esencia es"
- NO mencionas infancia, traumas pasados, o psicología permanente

SÍ explicas:
- Qué función psicológica se ENTRENA este año
- En qué área de vida (casa SR)
- Con qué estilo energético (signo SR)
- Cómo se manifiesta en la vida cotidiana durante ${year}-${year + 1}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuario: ${userName}
Edad: ${userAge} años
Año del Retorno Solar: ${year}-${year + 1}

**Posición SR a interpretar:**
${planetName} en ${sign} ${Math.floor(degree)}° Casa ${house} SR

${natalReference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FÓRMULA DE LECTURA (APLICAR SIEMPRE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **FUNCIÓN DEL PLANETA** (qué se entrena)
   ${planetName} representa: [función psicológica específica]

2. **SIGNO SR** (cómo se entrena)
   ${sign} aporta el estilo: [características del signo]

3. **CASA SR** (dónde/en qué escenario)
   Casa ${house} (${houseMeaning}) es el área donde se manifiesta

4. **CONEXIÓN CON NATAL** (como filtro, opcional)
   "Dependiendo de cómo seas natalmente, este tránsito puede sentirse..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con JSON válido:

{
  "tooltip": {
    "titulo": "[Título corto sobre QUÉ SE ACTIVA - max 5 palabras]",
    "descripcionBreve": "${planetName} en ${sign} en Casa ${house} (${houseMeaning})",
    "significado": "String de 2-3 líneas: QUÉ se activa este año ${year}, NO quién es ${userName}. Usar lenguaje temporal: 'Durante ${year}...', 'Este año...'",
    "efecto": "String de 1 línea: Qué área de vida se entrena específicamente",
    "tipo": "String: Tipo de entrenamiento anual (Ej: 'Expansión mental', 'Disciplina emocional', 'Comunicación innovadora')"
  },

  "drawer": {
    "titulo": "[Título memorable sobre el entrenamiento del año]",

    "educativo": "String largo (6-8 párrafos):

    ESTRUCTURA OBLIGATORIA:

    Párrafo 1: '${planetName} en Retorno Solar no define quién eres, sino qué energía se entrena este año. En ${sign}, esta energía toma un carácter de [características]. En Casa ${house} (${houseMeaning}), se manifiesta específicamente en [área de vida].'

    Párrafo 2-3: 'Durante ${year}, es probable que [ejemplos concretos de manifestación]: conversaciones que..., decisiones que..., personas que..., situaciones que...'

    Párrafo 4: 'Este año la vida te entrena en la habilidad de [habilidad específica]. No es casualidad que ${planetName} esté aquí: el universo te pide [qué desarrollar este año].'

    Párrafo 5: 'Dependiendo de cómo seas natalmente, este tránsito puede sentirse como [opciones de vivencia]. El truco durante ${year} es [estrategia práctica].'

    Párrafo 6: 'A los ${userAge} años, este tránsito tiene especial relevancia porque [conexión con edad/etapa vital].'

    Párrafo 7-8: 'Durante ${year}-${year + 1}, tu trabajo es [objetivo del entrenamiento]. [Consecuencias de hacerlo consciente vs inconsciente].'",

    "poderoso": "String largo (4-6 párrafos):

    ENFOQUE: Cómo usar conscientemente este entrenamiento anual.

    - Validar lo que puede estar sintiendo durante ${year}
    - Explicar qué pasa si reacciona en automático vs conscientemente
    - Dar herramientas PRÁCTICAS para este año específico
    - Preguntas poderosas para cada mes/trimestre
    - Actitud que sirve durante ${year}

    EVITAR: Hablar de identidad permanente, sombras psicológicas de siempre, o traumas pasados.",

    "poetico": "String (3-4 párrafos):

    Metáfora específica del CICLO ANUAL.

    - 'Este año es como...'
    - 'El clima energético de ${year} te invita a...'
    - 'Al final del ciclo...'

    NO usar metáforas de identidad permanente.",

    "sombras": [
      {
        "nombre": "Sombra del entrenamiento 1",
        "descripcion": "Cómo se manifiesta SI NO prestas atención este año",
        "trampa": "❌ Si este año reaccionas sin consciencia: [consecuencia específica de ${year}]",
        "regalo": "✅ Si usas esto con consciencia este año: [beneficio específico de ${year}]"
      },
      {
        "nombre": "Sombra del entrenamiento 2",
        "descripcion": "...",
        "trampa": "❌ Tentación de [patrón reactivo durante ${year}]",
        "regalo": "✅ Oportunidad de [aprendizaje de ${year}]"
      }
    ],

    "sintesis": {
      "frase": "String de 3-6 palabras: Frase-clave del AÑO (NO identidad permanente)",
      "declaracion": "String de 20-40 palabras: [Declaración sobre el aprendizaje/entrenamiento del año]. Debe incluir: 'La [cualidad] transforma cualquier tránsito.'",
      "teActivasCuando": "String de 1-2 líneas: Qué circunstancias, situaciones o momentos ACTIVAN este entrenamiento durante ${year}. Describe los triggers o catalizadores específicos del año que pondrán en marcha esta energía."
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS - SOLAR RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0. **LENGUAJE TEMPORAL OBLIGATORIO:**
   ✅ "Este año ${year}..."
   ✅ "Durante ${year}-${year + 1}..."
   ✅ "Se te pide..."
   ✅ "La vida te entrena..."
   ✅ "Es una invitación a..."

   ❌ NUNCA: "Eres...", "Tu esencia...", "Desde siempre..."

1. **NO HABLES DE:**
   - Identidad permanente
   - Infancia o traumas pasados
   - Personalidad base
   - "Quién eres"

2. **SÍ HABLA DE:**
   - Qué se activa/entrena durante ${year}
   - Cómo se manifiesta en la vida cotidiana
   - Ejemplos concretos de situaciones del año
   - Herramientas prácticas para ${year}

3. **SOMBRAS = SOMBRAS DEL ENTRENAMIENTO ANUAL**
   - NO sombras psicológicas permanentes
   - SÍ patrones reactivos que pueden surgir durante ${year}
   - Siempre en formato: "Si este año... / Si usas esto este año..."

4. **SÍNTESIS = FRASE-CLAVE DEL AÑO**
   - 3-6 palabras que resumen el entrenamiento anual
   - NO describe identidad, describe el PROCESO del año

5. **EJEMPLOS CONCRETOS:**
   - Conversaciones, decisiones, personas, situaciones
   - Que puedan ocurrir durante ${year}
   - Relacionados con Casa ${house} SR

6. **FORMATO:**
   - JSON válido, sin markdown, sin comentarios
   - Párrafos separados con \\n\\n

Genera ahora la interpretación completa en JSON:
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
// ☀️ PROMPT PARA ASPECTOS DE SOLAR RETURN - DIÁLOGOS ANUALES
// =============================================================================

export function generateSolarReturnAspectPrompt(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  year: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  const userAge = userProfile.age || 0;

  // Traducir tipos de aspectos
  const aspectTypeSpanish: Record<string, string> = {
    'conjunction': 'Conjunción',
    'opposition': 'Oposición',
    'trine': 'Trígono',
    'square': 'Cuadratura',
    'sextile': 'Sextil',
    'semisextile': 'Semisextil',
    'semisquare': 'Semicuadratura',
    'sesquiquadrate': 'Sesquicuadratura',
    'quincunx': 'Quincuncio'
  };

  const aspectName = aspectTypeSpanish[aspectType] || aspectType;
  const isExact = orb < 1;

  return `
Eres un astrólogo evolutivo EXPERTO en interpretar ASPECTOS en RETORNOS SOLARES.

Tu tarea: Generar una interpretación del aspecto **${planet1} ${aspectName} ${planet2}** en el RETORNO SOLAR ${year}-${year + 1} de ${userName}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ PRINCIPIO FUNDAMENTAL - ASPECTOS EN SOLAR RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CARTA NATAL = Cómo conversan SIEMPRE estas energías (patrón permanente)**
**SOLAR RETURN = Qué DIÁLOGO se activa/entrena ESTE AÑO (temporal)**

En aspectos de Solar Return:
- NO describes patrones psicológicos permanentes
- NO hablas de "tu forma de ser" o "tu personalidad"
- NO mencionas infancia, heridas del pasado, o dinámicas profundas

SÍ explicas:
- Qué conversación/tensión/armonía se ACTIVA durante ${year}
- Cómo se manifiesta en la vida cotidiana este año
- Qué aprendizaje/entrenamiento ofrece este diálogo anual
- Ejemplos concretos de situaciones durante ${year}-${year + 1}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usuario: ${userName}
Edad: ${userAge} años
Año del Retorno Solar: ${year}-${year + 1}

**Aspecto SR a interpretar:**
${planet1} ${aspectName} ${planet2}
Orbe: ${orb.toFixed(2)}°${isExact ? ' (EXACTO - máxima intensidad este año)' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FÓRMULA DE LECTURA - ASPECTOS SR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **FUNCIÓN DE ${planet1}** (qué representa)
   Breve recordatorio: ${planet1} = [función psicológica]

2. **FUNCIÓN DE ${planet2}** (qué representa)
   Breve recordatorio: ${planet2} = [función psicológica]

3. **TIPO DE DIÁLOGO (${aspectName})**
   ${getAspectDescription(aspectName)}

4. **QUÉ SE ACTIVA ESTE AÑO**
   "Durante ${year}, estas dos funciones ${aspectName === 'Conjunción' ? 'se fusionan' : aspectName === 'Oposición' ? 'buscan balance' : aspectName === 'Cuadratura' ? 'generan tensión creativa' : aspectName === 'Trígono' ? 'fluyen con facilidad' : 'dialogan'} en tu vida de [manera específica]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con JSON válido:

{
  "tooltip": {
    "titulo": "[Título corto sobre QUÉ DIÁLOGO se activa - max 5 palabras]",
    "descripcionBreve": "${aspectName} entre ${planet1} y ${planet2} (${year})",
    "significado": "String de 2-3 líneas: QUÉ conversación/tensión/armonía se ACTIVA entre estas dos funciones durante ${year}, NO tu patrón psicológico permanente.",
    "efecto": "String de 1 línea: Cómo se manifiesta en la vida cotidiana este año",
    "tipo": "String: Tipo de diálogo anual (Ej: 'Tensión creativa', 'Armonía fluida', 'Fusión intensa')"
  },

  "drawer": {
    "titulo": "[Título memorable sobre el diálogo del año]",

    "educativo": "String largo (6-8 párrafos):

    ESTRUCTURA OBLIGATORIA:

    Párrafo 1: '${planet1} representa [función]. ${planet2} representa [función]. Cuando forman ${aspectName} en Solar Return, NO estamos hablando de tu psicología permanente, sino del DIÁLOGO que se activa entre estas funciones durante ${year}.'

    Párrafo 2-3: 'Este año ${year}, es probable que vivas situaciones donde: [ejemplos concretos de cómo se manifiesta este aspecto en la vida cotidiana]. No es casualidad que estas dos energías ${aspectName === 'Conjunción' ? 'trabajen juntas' : 'dialoguen así'} ahora.'

    Párrafo 4: 'El ${aspectName} te entrena en [habilidad específica que desarrolla este aspecto durante el año]. Este tipo de aspecto ${aspectName === 'Cuadratura' || aspectName === 'Oposición' ? 'genera fricción productiva' : 'facilita el flujo'}, y durante ${year} aprenderás [qué se aprende].'

    Párrafo 5: 'Dependiendo de cómo seas natalmente, este aspecto puede manifestarse como [opciones de vivencia]. La clave durante ${year} es [estrategia práctica para trabajar con este aspecto].'

    Párrafo 6: 'A los ${userAge} años, este diálogo ${planet1}-${planet2} tiene especial relevancia porque [conexión con edad/etapa vital].'

    Párrafo 7-8: 'Durante ${year}-${year + 1}, tu trabajo con este aspecto es [objetivo del entrenamiento]. [Consecuencias de trabajarlo consciente vs reactivamente].'",

    "poderoso": "String largo (4-6 párrafos):

    ENFOQUE: Cómo usar este diálogo conscientemente durante ${year}.

    - Validar lo que puede estar experimentando con este aspecto
    - Explicar qué pasa si lo vive en automático vs conscientemente
    - Dar herramientas PRÁCTICAS específicas para este año
    - Preguntas poderosas para cada trimestre del año
    - Actitud que sirve durante ${year}

    EVITAR: Hablar de patrones permanentes, heridas profundas, o dinámicas de toda la vida.",

    "poetico": "String (3-4 párrafos):

    Metáfora específica del DIÁLOGO ANUAL.

    - 'Este año, ${planet1} y ${planet2} ${aspectName === 'Conjunción' ? 'danzan juntos' : aspectName === 'Oposición' ? 'tiran de los extremos' : 'conversan'} como...'
    - 'El clima energético de ${year} con este aspecto es como...'
    - 'Al final del ciclo, habrás aprendido...'

    NO usar metáforas de identidad o patrones permanentes.",

    "sombras": [
      {
        "nombre": "Sombra del diálogo anual 1",
        "descripcion": "Cómo se manifiesta SI NO prestas atención este año",
        "trampa": "❌ Si este año reaccionas sin consciencia a este aspecto: [consecuencia específica de ${year}]",
        "regalo": "✅ Si trabajas este aspecto conscientemente durante ${year}: [beneficio específico]"
      },
      {
        "nombre": "Sombra del diálogo anual 2",
        "descripcion": "...",
        "trampa": "❌ Tentación de [patrón reactivo con este aspecto durante ${year}]",
        "regalo": "✅ Oportunidad de [aprendizaje del aspecto en ${year}]"
      }
    ],

    "sintesis": {
      "frase": "String de 3-6 palabras: Frase-clave del DIÁLOGO DEL AÑO (NO patrón permanente)",
      "declaracion": "String de 20-40 palabras: Declaración sobre el aprendizaje/integración de este aspecto durante ${year}. Debe reflejar el entrenamiento temporal, NO un patrón de toda la vida.",
      "teActivasCuando": "String de 1-2 líneas: Qué circunstancias o momentos durante ${year} activarán más intensamente este diálogo ${planet1}-${planet2}."
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS - ASPECTOS SOLAR RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0. **LENGUAJE TEMPORAL OBLIGATORIO:**
   ✅ "Este año ${year}..."
   ✅ "Durante ${year}-${year + 1}..."
   ✅ "Se activa un diálogo entre..."
   ✅ "La vida te entrena en..."

   ❌ NUNCA: "Tu psicología...", "Tu patrón interno...", "Siempre has..."

1. **NO HABLES DE:**
   - Patrones psicológicos permanentes
   - Dinámicas profundas de personalidad
   - Heridas del pasado o infancia
   - "Cómo eres"

2. **SÍ HABLA DE:**
   - Qué diálogo se activa durante ${year}
   - Cómo se manifiesta en situaciones concretas del año
   - Qué entrenamiento ofrece este aspecto
   - Herramientas prácticas para ${year}

3. **EJEMPLOS CONCRETOS:**
   - Conversaciones, decisiones, personas, situaciones
   - Que puedan ocurrir específicamente durante ${year}

4. **SOMBRAS = SOMBRAS DEL DIÁLOGO ANUAL**
   - NO sombras psicológicas profundas
   - SÍ patrones reactivos que pueden surgir con este aspecto durante ${year}

5. **SÍNTESIS = FRASE-CLAVE DEL DIÁLOGO DEL AÑO**
   - Describe el PROCESO/ENTRENAMIENTO del año
   - NO describe un patrón interno permanente

6. **FORMATO:**
   - JSON válido, sin markdown, sin comentarios
   - Párrafos separados con \\n\\n

Genera ahora la interpretación completa en JSON:
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