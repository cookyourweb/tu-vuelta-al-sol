//src/utils/prompts/triplePrompts.ts
// =============================================================================
// 📚 EJEMPLO DE REFERENCIA: Sol en Acuario Casa 1
// =============================================================================
// Este ejemplo muestra el estilo y profundidad esperada para todas las interpretaciones

const REFERENCE_EXAMPLE = `
**EJEMPLO DE ESTRUCTURA NATAL CORRECTA:**

☉ **Sol en Acuario — Casa 1**
21.13° Acuario

**Función psicológica:**

El Sol representa tu identidad consciente, tu sentido de individualidad, tu forma de afirmarte y de sentirte válida en el mundo. Es el núcleo de quién eres cuando actúas desde tu autenticidad.

**Cómo funciona en ti:**

Con el Sol en Acuario en Casa 1 (identidad, personalidad, forma de presentarte), tu identidad se construye desde la diferencia. Necesitas sentirte auténtica, libre y mentalmente independiente para reconocerte a ti misma.

No te defines por lo convencional ni por lo esperado, sino por tu forma única de pensar y estar en el mundo. Tu manera de presentarte naturalmente tiende hacia lo original, lo poco predecible.

**Patrón automático:**

Tiendes a presentarte como alguien autosuficiente, original y poco predecible. De manera inconsciente puedes marcar distancia emocional para proteger tu libertad personal.

En situaciones nuevas, tu primer impulso es evaluar si el espacio permite o limita tu autenticidad. Si detectas restricciones, automáticamente te separas mentalmente.

**Origen del patrón:**

Desde etapas tempranas aprendiste que ser distinta, no encajar del todo o pensar diferente era una forma de mantener tu integridad y tu espacio propio.

Probablemente recibiste mensajes contradictorios: admiración por tu originalidad, pero también presión para "ser más normal". Esto consolidó tu identidad como alguien que necesita diferenciarse para existir.

**Luz integrada:**

Capacidad para liderar desde la autenticidad, inspirar cambios, abrir nuevas perspectivas y sostener tu individualidad sin aislarte.

Cuando está integrado, este patrón te permite ser innovadora sin ser reactiva, auténtica sin ser distante, y libre sin rechazar toda estructura.

**Sombra:**

Sensación de no pertenecer, desapego emocional, resistencia a depender de otros incluso cuando el vínculo lo requiere.

En su expresión bloqueada, puedes usar tu diferencia como escudo para evitar vulnerabilidad, o rechazar automáticamente cualquier cosa convencional sin discernimiento real.

**Necesidad psicológica:**

"Necesito sentir que soy libre para ser quien soy."
`;

// =============================================================================
// 🎯 INTERFACES PARA INTERPRETACIONES TRIPLE FUSIONADO
// =============================================================================

export interface TripleFusedInterpretation {
  // Tooltip (resumen)
  tooltip: {
    titulo: string;
    descripcionBreve: string;
    significado: string;      // 2-3 líneas
    efecto: string;           // 1 línea
    tipo: string;             // 1 línea
  };

  // Drawer (contenido completo para NATAL)
  drawer: {
    titulo: string;                    // Título técnico claro
    funcion_psicologica: string;       // Qué representa el planeta
    como_funciona: string;             // Signo + Casa + manifestación
    patron_automatico: string;         // Conductas observables
    origen_patron: string;             // Aprendizaje temprano
    luz_integrada: string;             // Cuando está equilibrado
    sombra: string;                    // Cuando está bloqueado
    necesidad_psicologica: string;     // Frase en primera persona
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
📋 ESTRUCTURA JSON REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder SOLO con JSON válido en este formato:

{
  "tooltip": {
    "titulo": "String: Título memorable con emoji (Ej: '🌟 El Visionario Auténtico')",
    "descripcionBreve": "${planetName} en ${sign} en Casa ${house} (Significado de la casa)",
    "significado": "String de 2-3 líneas: Resumen poderoso que fusiona educativo + transformador. Debe capturar la esencia de forma memorable.",
    "efecto": "String de 1 línea: El efecto principal de esta posición",
    "tipo": "String de 1 línea: El tipo/categoría de energía (Ej: 'Revolucionario', 'Sanador', 'Comunicador')"
  },
  
  "drawer": {
    "titulo": "String: Título técnico claro (Ej: '${planetName} en ${sign} — Casa ${house}')",

    "funcion_psicologica": "String de 2-3 párrafos:
    - Explica qué representa ${planetName} en la psique humana
    - Lenguaje pedagógico, claro y simple
    - SIN metáforas largas, SIN lenguaje místico
    - Ejemplo: 'El Sol representa tu identidad consciente, tu sentido de individualidad...'",

    "como_funciona": "String de 3-4 párrafos:
    - Describe cómo se expresa este planeta por el signo y por la casa
    - SIEMPRE explica la casa entre paréntesis la primera vez
    - Ejemplo: 'Casa 1 (identidad, personalidad, forma de presentarte)'
    - Conecta planeta + signo + casa de forma clara
    - SIN consejos, SIN acciones, SIN 'deberías'",

    "patron_automatico": "String de 2-3 párrafos:
    - Qué hace ${userName} sin darse cuenta cuando esta energía se activa
    - Conductas observables, NO ideas abstractas
    - Ejemplo: 'Tiendes a presentarte como alguien autosuficiente...'",

    "origen_patron": "String de 2-3 párrafos:
    - Cómo se formó este patrón (aprendizaje temprano, clima emocional)
    - Mensajes recibidos en la infancia/adolescencia
    - Lenguaje comprensivo, NO culpabilizador",

    "luz_integrada": "String de 2-3 párrafos:
    - Cómo se manifiesta esta energía cuando está consciente y equilibrada
    - Talentos y capacidades que emergen
    - SIN rituales, SIN acciones concretas, SIN 'debes hacer'",

    "sombra": "String de 2-3 párrafos:
    - Cómo se manifiesta cuando se reprime, exagera o se vive desde el miedo
    - Riesgos y bloqueos recurrentes
    - Tono constructivo, NO alarmista",

    "necesidad_psicologica": "String: UNA frase clara en primera persona.
    - Formato: 'Necesito [verbo] para [propósito]'
    - Ejemplo: 'Necesito sentir que soy libre para ser quien soy.'
    - SIN mantras largos, SIN declaraciones épicas"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ INSTRUCCIONES CRÍTICAS - CARTA NATAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 PROHIBIDO EN CARTA NATAL (SIN EXCEPCIÓN):
   ❌ Rituales, prácticas, ejercicios
   ❌ Mantras o declaraciones motivacionales
   ❌ Metáforas largas o lenguaje épico/místico
   ❌ "Cómo usarlo como superpoder"
   ❌ Consejos prácticos o acciones ("deberías...", "haz...")
   ❌ Mencionar "este año", fechas específicas, timing
   ❌ Predicciones o eventos futuros
   ❌ Lenguaje de coaching espiritual
   ❌ Usar palabras como "misión del alma", "destino cósmico"

✅ PERMITIDO EN CARTA NATAL:
   ✓ Explicación psicológica clara de patrones
   ✓ Descripción de cómo funciona la energía
   ✓ Origen del patrón (aprendizaje temprano)
   ✓ Luz y sombra del patrón
   ✓ Necesidad psicológica base
   ✓ Lenguaje pedagógico y accesible
   ✓ Ejemplos de comportamientos observables

1. **LENGUAJE:**
   - Pedagógico, claro y directo
   - SIN metáforas extensas o lenguaje poético
   - Estructura psicológica, NO narrativa espiritual
   - Ejemplos concretos de vida real
   - Tono informativo y comprensivo

2. **TONO:**
   - Diagnóstico psicológico (QUIÉN ERES)
   - Explicativo, NO prescriptivo
   - Honesto sobre sombras, constructivo
   - Neutro temporalmente (sin fechas ni timing)

3. **LONGITUD:**
   - Cada campo: 2-4 párrafos concisos
   - Párrafos de 3-5 líneas máximo
   - Total drawer: lectura de 3-5 minutos

4. **PERSONALIZACIÓN:**
   - Usa el nombre ${userName} SOLO 1-2 veces
   - Resto del tiempo usa "tú", "tu", "tienes"
   - Segunda persona directa

5. **FORMATO:**
   - Responde SOLO con JSON válido
   - NO incluyas markdown
   - NO incluyas comentarios fuera del JSON
   - Usa \\n\\n para separar párrafos dentro de strings

6. **REGLA DE ORO:**
   Si un texto natal puede emocionar → está mal colocado (va en Solar Return/Agenda)
   Si un texto natal no explica un patrón → está incompleto

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