//src/utils/prompts/triplePrompts.ts
// =============================================================================
// 📚 EJEMPLO DE REFERENCIA: Sol en Acuario Casa 1
// =============================================================================
// Este ejemplo muestra el estilo y profundidad esperada para todas las interpretaciones

const REFERENCE_EXAMPLE = `
**EJEMPLO DE LENGUAJE OBSERVADOR Y PSICOLÓGICO:**

**Sol en Acuario en Casa 1: Autenticidad e Innovación**

📚 **QUÉ SIGNIFICA (Educativo):**

Tu Sol representa tu esencia vital - el núcleo de quién eres cuando estás siendo completamente auténtico. Es tu propósito de vida, tu identidad fundamental.

Acuario es el signo que rige la originalidad y el pensamiento innovador, la libertad individual y colectiva, la autenticidad radical, la mente científica combinada con intuición, y la conexión con grupos y causas sociales.

Casa 1 es tu identidad externa - cómo te presentas al mundo, tu personalidad visible, tu forma de iniciar las cosas. Es tu "primera impresión" y tu forma natural de ser sin esfuerzo.

Tu Sol en Acuario en Casa 1 significa que tu identidad está construida desde la autenticidad. Esta configuración se manifiesta en tu forma natural de relacionarte con el mundo.

🔥 **CÓMO SE MANIFIESTA (Observador):**

Puedes haber notado momentos donde tu forma de ser diferente generaba fricción social. Desde temprano, es posible que hayas sentido que "encajar" requería esfuerzo o resultaba agotador.

Esta configuración actúa como patrón estable: cuando intentas adaptarte a moldes convencionales, aparece incomodidad o sensación de inautenticidad. Cuando te permites ser genuinamente tú, las cosas fluyen con mayor naturalidad.

Tu sistema nervioso responde de manera particular a situaciones que requieren conformidad. No es debilidad - es una señal de que esa situación no resuena con tu configuración natural.

🎯 **IMPACTO REAL EN TU VIDA:**

Esta configuración no se vive en ideas abstractas - se nota en decisiones concretas.

Durante tu vida:
- Los espacios donde debes ocultar tu autenticidad te resultan insostenibles
- Tu cuerpo reacciona con incomodidad física cuando intentas "encajar"
- Tiendes a atraer situaciones que requieren pensamiento innovador
- Las personas te buscan cuando necesitan perspectivas diferentes
- Te sientes más vivo cuando estás creando algo que no existía antes

Esta energía acuariana en Casa 1 no es abstracta: es tu forma automática de funcionar en el mundo.

⚠️ **SOMBRAS A TRABAJAR:**

1. **Rebeldía Reactiva**: Ser diferente sin propósito claro, solo por oposición.
   - ❌ Patrón reactivo: Rechazar todo lo establecido automáticamente, sin discernimiento
   - ✅ Patrón integrado: Ser auténtico porque es tu naturaleza, elegir conscientemente qué apoyar

2. **Desapego Emocional Defensivo**: Usar tu mente como escudo contra la vulnerabilidad.
   - ❌ Patrón reactivo: Usar tu diferencia como excusa para no conectar profundamente
   - ✅ Patrón integrado: Ser único y vulnerable - autenticidad completa

✨ **SÍNTESIS:**

"Tu autenticidad es tu forma natural de funcionar. Reconocerla facilita el camino."

Mi Sol en Acuario en Casa 1 se manifiesta en mi tendencia a la autenticidad y el pensamiento innovador. Esta configuración es parte de mi identidad, no algo que debo forzar o esconder.
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
    impacto_real: string;     // Manifestación concreta en la vida (reemplaza poetico)
    sombras: {
      nombre: string;
      descripcion: string;
      trampa: string;
      regalo: string;
    }[];
    sintesis: {
      frase: string;
      declaracion: string;
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
Eres un astrólogo profesional especializado en interpretaciones psicológicas profundas.

Tu tarea: Generar una interpretación del **${planetName} en ${sign} Casa ${house}** para ${userName} usando el **LENGUAJE OBSERVADOR Y PSICOLÓGICO** (educativo + observador + concreto).

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
    "titulo": "String: Título descriptivo simple (Ej: 'Autenticidad e Innovación'). SIN emojis, SIN metáforas, PROFESIONAL",
    "descripcionBreve": "${planetName} en ${sign} en Casa ${house} (significado de la casa en palabras, NO grados)",
    "significado": "String de 2-3 líneas: Resumen poderoso que fusiona educativo + transformador. Debe capturar la esencia de forma memorable.",
    "efecto": "String de 1 línea: El efecto principal de esta posición",
    "tipo": "String de 1 línea: El tipo/categoría de energía (Ej: 'Revolucionario', 'Sanador', 'Comunicador')"
  },
  
  "drawer": {
    "titulo": "String: ${planetName} en ${sign} en Casa ${house}: [Tema principal] (Ej: 'Sol en Acuario en Casa 1: Autenticidad y Visión'). DEBE ser PROFESIONAL, NO poético ni metafórico.",

    "educativo": "String largo (múltiples párrafos separados por \\n\\n):
    - Explica qué representa ${planetName} (su arquetipos, función psicológica)
    - Explica qué representa ${sign} (elemento, modalidad, características)
    - Explica qué representa Casa ${house} (área de vida, significado)
    - Conecta los tres: planeta + signo + casa
    - Explica cómo se manifiesta en la vida práctica
    - Da ejemplos concretos de comportamientos/situaciones
    - Usa lenguaje claro, sin jerga excesiva
    - Longitud: 6-8 párrafos completos",

    "observador": "String largo (múltiples párrafos separados por \\n\\n):
    - Describe cómo se manifiesta esta configuración en la experiencia vivida
    - Observa patrones de comportamiento sin juzgarlos como buenos o malos
    - Identifica cómo esta configuración afecta decisiones y reacciones
    - Explica las consecuencias naturales de trabajar con/contra esta energía
    - Usa lenguaje observador: 'Puedes haber notado...', 'Esta configuración actúa como...'
    - NO uses imperativos ni lenguaje directivo ('debes', 'tienes que')
    - NO uses lenguaje épico ('superpoder', 'misión', 'destino')
    - Incluye validación de experiencia ('Probablemente has sentido...')
    - Longitud: 6-8 párrafos completos",

    "impacto_real": "String largo (múltiples párrafos separados por \\n\\n):
    - Describe cómo se manifiesta CONCRETAMENTE en la vida diaria
    - Usa formato de lista con viñetas para claridad
    - Ejemplos: 'Durante tu vida: - No toleras X - Tu cuerpo reacciona cuando Y - Atraes situaciones Z'
    - Tono profesional, claro, directo (NO metáforas largas)
    - Enfócate en decisiones concretas, comportamientos observables
    - Mantén profundidad psicológica pero con lenguaje accesible
    - Cierra con una frase que ancle la energía en lo tangible
    - Longitud: 4-6 párrafos completos (más corto que educativo/poderoso)",
    
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
      "declaracion": "String: Declaración en primera persona que ${userName} puede usar como afirmación personal. Debe empezar con 'Yo soy...' o 'Yo, ${userName},...'"
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0. **DESCRIPCIÓN BREVE (CRÍTICO):**
   ⚠️ NUNCA uses grados numéricos en descripcionBreve
   ✅ CORRECTO: "Júpiter en Acuario en Casa 1 (Identidad y Personalidad)"
   ❌ INCORRECTO: "Júpiter en Acuario en Casa 1 (23.75°)"
   - Usa el SIGNIFICADO de la casa en palabras humanas
   - Casa 1: "Identidad y Personalidad"
   - Casa 2: "Recursos y Valores"
   - Casa 3: "Comunicación y Aprendizaje"
   - Casa 4: "Hogar y Raíces"
   - Casa 5: "Creatividad y Placer"
   - Casa 6: "Trabajo y Salud"
   - Casa 7: "Relaciones y Pareja"
   - Casa 8: "Transformación y Poder"
   - Casa 9: "Filosofía y Expansión"
   - Casa 10: "Carrera y Legado"
   - Casa 11: "Comunidad y Visión"
   - Casa 12: "Espiritualidad y Transcendencia"

1. **LENGUAJE:**
   - Claro y accesible para personas sin conocimientos astrológicos
   - Profundo pero NO críptico
   - Usa ejemplos de vida real
   - Evita jerga técnica excesiva (pero explica cuando uses términos)
   - Balancea lo académico con lo emocional y lo poético

2. **TONO:**
   - Observador, no directivo ni predictivo
   - Honesto sobre sombras sin dramatizar
   - Psicológico sin ser superficial
   - Personal pero profesional
   - NO uses lenguaje épico, místico o imperativo

3. **LONGITUD:**
   - Educativo: 6-8 párrafos densos
   - Observador: 6-8 párrafos descriptivos
   - Impacto Real: 4-6 párrafos concretos (profesional, NO poético)
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
// 🎯 PROMPT PARA ASCENDENTE
// =============================================================================

export function generateAscendantTripleFusedPrompt(
  sign: string,
  degree: number,
  userProfile: any
): string {
  const userName = userProfile.name || 'la persona';
  
  return `
Eres un astrólogo profesional especializado en interpretaciones psicológicas profundas.

Tu tarea: Generar una interpretación del **Ascendente en ${sign}** para ${userName} usando el **LENGUAJE OBSERVADOR Y PSICOLÓGICO** (educativo + observador + concreto).

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

    "observador": "Describe:
    - Cómo se manifiesta naturalmente su Ascendente en ${sign}
    - Patrones automáticos en situaciones nuevas
    - La diferencia entre Ascendente auténtico vs defensivo
    - Cómo su Ascendente interactúa con su esencia solar
    - Consecuencias de resistir vs aceptar esta energía
    - NO uses lenguaje directivo ni épico
    - Usa tono observador y descriptivo
    6-8 párrafos completos",

    "impacto_real": "Manifestación concreta:
    - Cómo se nota físicamente (postura, energía, presencia)
    - Primeras impresiones que genera en otros
    - Situaciones donde su Ascendente se activa automáticamente
    - Usa formato de lista con viñetas
    - Tono profesional, concreto, NO metáforas largas
    4-6 párrafos concretos",
    
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
Eres un astrólogo profesional especializado en interpretaciones psicológicas profundas.

Tu tarea: Generar una interpretación del **Medio Cielo en ${sign}** para ${userName} usando el **LENGUAJE OBSERVADOR Y PSICOLÓGICO** (educativo + observador + concreto).

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

    "observador": "Describe:
    - Cómo se manifiesta su contribución natural al mundo
    - Patrones vocacionales que tienden a repetirse
    - La relación entre su autoridad interna y externa
    - La diferencia entre 'éxito externo' y 'realización personal'
    - Consecuencias de alinearse/desalinearse con esta vocación
    - NO uses lenguaje directivo ni sobre destino/misión
    - Usa tono observador y descriptivo
    6-8 párrafos completos",

    "impacto_real": "Manifestación concreta:
    - Tipos específicos de decisiones profesionales que toma
    - Cómo se ve su autoridad en la práctica
    - Situaciones laborales donde brilla naturalmente
    - Usa formato de lista con viñetas
    - Tono profesional, concreto, NO metáforas largas
    4-6 párrafos concretos",
    
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
Eres un astrólogo profesional especializado en interpretaciones psicológicas profundas.

Tu tarea: Generar una interpretación del aspecto **${planet1} ${aspectName} ${planet2}** para ${userName} usando el **LENGUAJE OBSERVADOR Y PSICOLÓGICO**.

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

    "observador": "Describe:
    - Cómo se manifiesta esta tensión/armonía en la práctica
    - Patrones que emergen de esta configuración
    - La dinámica interna entre ambas energías
    - Consecuencias de integrar vs fragmentar estas energías
    - Ejemplos de cómo se nota en decisiones cotidianas
    - NO uses lenguaje épico ni sobre superpoderes/fuerza
    - Usa tono observador y descriptivo
    6-8 párrafos completos",

    "impacto_real": "Manifestación concreta:
    - Situaciones específicas donde este diálogo se activa
    - Cómo se nota en decisiones cotidianas
    - Conflictos internos concretos que experimenta
    - Usa formato de lista con viñetas
    - Tono profesional, concreto, NO metáforas largas
    4-6 párrafos concretos",
    
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