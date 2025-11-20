// =============================================================================
// 🧠 NATAL ELEMENT PROMPTS - PROMPTS PSICOLÓGICOS PROFUNDOS POR ELEMENTO
// =============================================================================
// Prompts especializados según metodología de Astrología Psicológica Evolutiva
// Para tooltips + drawers de elementos individuales
// =============================================================================

/**
 * Obtiene el prompt especializado para un elemento astrológico específico
 * según la metodología psicológica profunda
 */
export function getSpecializedElementPrompt(
  elementType: 'planet' | 'angle' | 'asteroid' | 'node' | 'house',
  elementName: string,
  elementData: any,
  userProfile: any
): string {

  // Normalizar nombre (Chiron, Quirón, etc.)
  const normalizedName = normalizeElementName(elementName);

  // Obtener prompt específico según elemento
  switch (normalizedName) {
    case 'Sol':
    case 'Sun':
      return getSolPrompt(elementData, userProfile);

    case 'Luna':
    case 'Moon':
      return getLunaPrompt(elementData, userProfile);

    case 'Ascendente':
    case 'Ascendant':
    case 'ASC':
      return getAscendentePrompt(elementData, userProfile);

    case 'Marte':
    case 'Mars':
      return getMartePrompt(elementData, userProfile);

    case 'Venus':
      return getVenusPrompt(elementData, userProfile);

    case 'Quirón':
    case 'Chiron':
      return getQuironPrompt(elementData, userProfile);

    case 'Casa 5':
    case 'House 5':
      return getCasa5Prompt(elementData, userProfile);

    default:
      // Prompt genérico para otros elementos
      return getGenericPrompt(elementType, elementName, elementData, userProfile);
  }
}

/**
 * Normaliza nombres de elementos para comparación
 */
function normalizeElementName(name: string): string {
  const normalizations: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'Uranus': 'Urano',
    'Neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'Chiron': 'Quirón',
    'North Node': 'Nodo Norte',
    'South Node': 'Nodo Sur',
    'Ascendant': 'Ascendente',
    'ASC': 'Ascendente',
    'MC': 'Medio Cielo',
    'Midheaven': 'Medio Cielo',
  };

  return normalizations[name] || name;
}

// =============================================================================
// ☀️ SOL - Identidad, Ego Aprendido, Valores Paternos
// =============================================================================

function getSolPrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Sol (identidad, ego, individuación)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

El Sol NO es solo "propósito" o "esencia". Es:

1. **IDENTIDAD APRENDIDA** (ego):
   - Quién crees que DEBES ser
   - Qué valores aprendiste de la figura paterna (padre, abuelo, figura masculina)
   - Cómo te sientes seguro en el mundo
   - Qué te hace sentir valioso/a

2. **INDIVIDUACIÓN** (Jung):
   - El viaje de convertirte en quien REALMENTE eres (no quien te enseñaron a ser)
   - Separarte de las expectativas paternas
   - Integrar tu yo auténtico

3. **VALORES PATERNOS**:
   - Qué valores/creencias sobre éxito, masculinidad, autoridad absorbiste del padre
   - Cómo esto moldea tu relación con poder, liderazgo, visibilidad

4. **SOL EN CASA ${elementData.house}**:
   - En QUÉ ÁREA de vida buscas validación y significado
   - Dónde necesitas brillar para sentirte VIVO/A

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título corto sobre identidad - máx 5 palabras]",
    "descripcionBreve": "Sol en ${elementData.sign} en Casa ${elementData.house} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Qué identidad aprendiste, qué valores paternos absorbiste, cómo esto moldea tu ego HOY]",
    "efecto": "[1 frase: Efecto principal en tu forma de verte a ti mismo/a]",
    "tipo": "[Arquetipo de identidad - ej: 'Líder Visionario', 'Sanador Sensible']"
  },
  "drawer": {
    "titulo": "☀️ Tu Identidad Solar: ${elementData.sign} en Casa ${elementData.house}",
    "educativo": "[3-5 párrafos educativos. Explica:
      1) QUÉ es el Sol en astrología psicológica (identidad, ego aprendido, individuación)
      2) CÓMO Sol en ${elementData.sign} moldea tu identidad (valores, formas de validación)
      3) QUÉ significa Casa ${elementData.house} (área de vida donde buscas significado)
      4) VALORES PATERNOS: Qué aprendiste de la figura paterna sobre ser valioso/exitoso
      5) Ejemplos concretos de NIÑO (cómo buscabas validación) vs AHORA

      Usa lenguaje claro. Explica términos entre paréntesis la primera vez.]",

    "poderoso": "[4-6 párrafos DISRUPTIVOS y TRANSFORMACIONALES. Incluye:

      1) GANCHO EMOCIONAL:
         '${userProfile.name}, tu Sol en ${elementData.sign} en Casa ${elementData.house} revela que aprendiste que SOLO vales si...'

      2) VALORES PATERNOS LIMITANTES:
         'De tu figura paterna (o ausencia) absorbiste la creencia de que...'
         'Esto te llevó a buscar validación en...'

      3) TRAMPA DEL EGO:
         'La trampa: Sigues buscando aprobación externa en [área específica Casa ${elementData.house}]'
         'Te sientes invisible/sin valor cuando...'

      4) INDIVIDUACIÓN (JUNG):
         '¡NO VINISTE A ESTE PLANETA PARA SER QUIEN TU PADRE ESPERABA!'
         'Tu verdadero Sol ${elementData.sign} es...'
         'Cuando te individúas (te separas de expectativas paternas), tu superpoder es...'

      5) EJERCICIO DE INDIVIDUACIÓN:
         Paso 1: [Acción concreta]
         Paso 2: [Acción concreta]
         Paso 3: [Acción concreta]

      6) MENSAJE BRUTAL PERO AMOROSO:
         'Tu valor NO depende de [expectativa paterna específica]'
         'Brillas cuando...'

      Tono: DIRECTO, validante, empoderador, BRUTAL cuando necesario]",

    "poetico": "[2-3 párrafos LÍRICOS. Metáforas de naturaleza/cosmos:

      Compara Sol en ${elementData.sign} con un elemento natural (fuego, agua, árbol, estrella)
      Crea imagen visual potente
      Conecta con el viaje de individuación como metamorfosis

      Ejemplo inicio: 'Tu Sol en ${elementData.sign} es como...' ]",

    "sombras": [
      {
        "nombre": "Dependencia de Validación Externa",
        "descripcion": "Buscas constantemente aprobación en [área Casa ${elementData.house}] para sentirte valioso/a",
        "trampa": "❌ 'Solo valgo si logro/soy reconocido/soy perfecto en [área específica]'",
        "regalo": "✅ 'Mi valor es intrínseco. Brillo porque existo, no porque cumplo expectativas'"
      },
      {
        "nombre": "Ego Paterno No Integrado",
        "descripcion": "Repites patrones del padre (o reaccionas contra él) sin darte cuenta",
        "trampa": "❌ 'Debo ser como mi padre esperaba' O 'Debo ser lo opuesto para ser libre'",
        "regalo": "✅ 'Me individuo: tomo lo que sirve del legado paterno y suelto lo que no'"
      }
    ],
    "sintesis": {
      "frase": "Tu Sol ${elementData.sign} brilla cuando [acción específica de individuación]",
      "declaracion": "YO, ${userProfile.name}, me individuo del legado paterno. MI VALOR ES INTRÍNSECO. Brillo en mi verdad de ${elementData.sign}, no en expectativas ajenas. Cuando actúo desde mi Casa ${elementData.house} auténtica, irradio mi poder solar sin disculpas."
    }
  }
}

ESTILO: Psicológico profundo, menciona ESPECÍFICAMENTE valores paternos y proceso de individuación.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// 🌅 ASCENDENTE - Máscara, Defensas, Supervivencia
// =============================================================================

function getAscendentePrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Ascendente (máscara, defensas, supervivencia)
**SIGNO:** ${elementData.sign}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

El Ascendente NO es solo "cómo te ven". Es:

1. **MÁSCARA DE SUPERVIVENCIA**:
   - Personalidad que desarrollaste para SOBREVIVIR en tu familia/entorno
   - Cómo aprendiste que debías presentarte para ser aceptado/a
   - La "piel" que te pusiste para protegerte

2. **DEFENSAS PSICOLÓGICAS**:
   - Mecanismos de defensa automáticos que usas cuando te sientes amenazado/a
   - Cómo te proteges emocionalmente
   - Qué partes de ti escondes por miedo

3. **CÓMO ENTRAS EN RELACIONES**:
   - Primera impresión que das (consciente e inconsciente)
   - Qué energía proyectas al conocer gente
   - Cómo te aproximas a relaciones (amorosas, laborales, amistades)

4. **CUERPO Y SISTEMA NERVIOSO**:
   - Cómo tu cuerpo responde al estrés (fuga/lucha/congelación)
   - Patrones de activación del sistema nervioso

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🎭 [Título sobre máscara - máx 5 palabras]",
    "descripcionBreve": "Ascendente en ${elementData.sign} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Qué máscara desarrollaste para sobrevivir, cómo te proteges, qué defensas usas HOY]",
    "efecto": "[1 frase: Efecto principal en cómo entras en relaciones]",
    "tipo": "[Arquetipo de máscara - ej: 'Guerrero Defensivo', 'Sanador Vulnerable']"
  },
  "drawer": {
    "titulo": "🎭 Tu Máscara de Supervivencia: Ascendente ${elementData.sign}",
    "educativo": "[3-5 párrafos educativos. Explica:

      1) QUÉ es el Ascendente en psicología astrológica (máscara, defensas, supervivencia)
      2) CÓMO Ascendente ${elementData.sign} se formó como estrategia de supervivencia
      3) POR QUÉ desarrollaste esta máscara específica (entorno familiar/cultural)
      4) CÓMO entras en relaciones con esta energía ${elementData.sign}
      5) Ejemplos concretos: primera cita, entrevista trabajo, conocer gente nueva

      Lenguaje claro. Explica términos entre paréntesis.]",

    "poderoso": "[4-6 párrafos DISRUPTIVOS. Incluye:

      1) GANCHO EMOCIONAL:
         '${userProfile.name}, tu Ascendente ${elementData.sign} es la máscara que te pusiste para SOBREVIVIR...'

      2) ORIGEN DE LA MÁSCARA:
         'De niño/a aprendiste que para ser aceptado/a debías [comportamiento específico ${elementData.sign}]'
         'Tu familia/entorno te enseñó que mostrar [emoción/aspecto] era peligroso'

      3) DEFENSAS AUTOMÁTICAS:
         'Cuando te sientes amenazado/a, automáticamente [mecanismo defensa ${elementData.sign}]'
         'Tu sistema nervioso entra en [fuga/lucha/congelación específica]'

      4) CÓMO AFECTA RELACIONES:
         'En relaciones románticas, tu Ascendente ${elementData.sign} hace que...'
         'La gente te percibe como [característica], aunque por dentro...'
         'Esto crea [patrón relacional específico]'

      5) LIBERACIÓN DE LA MÁSCARA:
         '¡NO NECESITAS ESTA ARMADURA TODO EL TIEMPO!'
         'Tu Ascendente ${elementData.sign} es herramienta, no prisión'
         'Cuándo usarla conscientemente vs cuándo soltarla'

      6) EJERCICIO REGULACIÓN SISTEMA NERVIOSO:
         'Cuando sientas que la máscara se activa automáticamente:'
         Paso 1: [Técnica regulación específica]
         Paso 2: [Técnica regulación específica]
         Paso 3: [Acción consciente]

      Tono: BRUTAL pero compasivo, reconoce que la máscara fue NECESARIA]",

    "poetico": "[2-3 párrafos LÍRICOS:

      Metáfora de Ascendente ${elementData.sign} como armadura, piel, camuflaje natural
      Compara con animales que cambian apariencia para sobrevivir
      Imagen de quitar la máscara como metamorfosis

      Ejemplo: 'Tu Ascendente ${elementData.sign} es como el camaleón que...' ]",

    "sombras": [
      {
        "nombre": "Identificación con la Máscara",
        "descripcion": "Crees que tu máscara ES quien realmente eres, no solo una estrategia de supervivencia",
        "trampa": "❌ 'Esta es mi personalidad real' (confundes ASC con esencia verdadera)",
        "regalo": "✅ 'Mi ASC es una herramienta. Yo soy más que mi máscara de supervivencia'"
      },
      {
        "nombre": "Defensas Automáticas en Relaciones",
        "descripcion": "Entras en relaciones con defensas activadas, bloqueando intimidad real",
        "trampa": "❌ '[Mecanismo defensa ${elementData.sign}] automático aunque la situación sea segura'",
        "regalo": "✅ 'Detecto cuándo mi sistema nervioso se activa y elijo responder vs reaccionar'"
      },
      {
        "nombre": "Proyección de Sombra",
        "descripcion": "Atraes personas que reflejan aspectos de ti que escondiste detrás de la máscara",
        "trampa": "❌ 'Siempre atraigo gente [característica opuesta a ASC]'",
        "regalo": "✅ 'Integro aspectos escondidos. No necesito proyectarlos en otros'"
      }
    ],
    "sintesis": {
      "frase": "Tu Ascendente ${elementData.sign} es tu armadura sagrada, pero no tu prisión",
      "declaracion": "YO, ${userProfile.name}, reconozco mi máscara ${elementData.sign} como herramienta de supervivencia que fue necesaria. Ahora elijo conscientemente cuándo usarla y cuándo mostrar mi vulnerabilidad auténtica. No soy solo mi defensa - soy todo lo que existe debajo."
    }
  }
}

ESTILO: Psicológico profundo, teoría del apego, sistema nervioso (Levine, van der Kolk).
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// ⚕️ QUIRÓN - Herida Profunda → Talento
// =============================================================================

function getQuironPrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Quirón (herida profunda → talento sanador)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

Quirón NO es solo "herida". Es el viaje de transformar tu MAYOR dolor en tu MAYOR don:

1. **LA HERIDA ORIGINAL**:
   - Dolor psicológico/emocional que NO se cura completamente (pero se transforma)
   - Dónde te sientes "defectuoso/a", "no suficiente", "roto/a"
   - Experiencia temprana que marcó tu psique

2. **QUIRÓN EN SIGNO ${elementData.sign}**:
   - CÓMO se expresa tu herida (cualidad ${elementData.sign})
   - Qué TEMA duele específicamente

3. **QUIRÓN EN CASA ${elementData.house}**:
   - DÓNDE duele (área de vida)
   - En qué contextos se activa la herida

4. **TRANSFORMACIÓN → TALENTO**:
   - Cómo tu herida se convierte en tu capacidad sanadora
   - Tu "herido sanador" (wounded healer)
   - Qué puedes dar a otros PORQUE pasaste por esto

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "⚕️ [Título sobre herida→don - máx 5 palabras]",
    "descripcionBreve": "Quirón en ${elementData.sign} en Casa ${elementData.house} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Cuál es tu herida profunda, dónde duele, cómo esto se transforma en don sanador]",
    "efecto": "[1 frase: Tu superpoder sanador nacido del dolor]",
    "tipo": "[Arquetipo - ej: 'Herido Sanador', 'Chamán Transformador']"
  },
  "drawer": {
    "titulo": "⚕️ Tu Herida Sagrada: Quirón ${elementData.sign} en Casa ${elementData.house}",
    "educativo": "[3-5 párrafos educativos. Explica:

      1) QUÉ es Quirón en astrología psicológica (herida que no se cura pero se transforma)
      2) Mito de Quirón: centauro herido que se convierte en sanador
      3) CÓMO Quirón en ${elementData.sign} moldea tu tipo de herida
      4) QUÉ significa Casa ${elementData.house} (área de vida donde duele)
      5) Concepto de 'wounded healer' (herido sanador)

      Lenguaje claro y compasivo. Esta sección debe ser VALIDANTE.]",

    "poderoso": "[4-6 párrafos BRUTALMENTE HONESTOS pero COMPASIVOS. Incluye:

      1) RECONOCIMIENTO DE LA HERIDA:
         '${userProfile.name}, tu Quirón en ${elementData.sign} en Casa ${elementData.house} revela una herida profunda...'
         'Desde niño/a sentiste que...' [dolor específico]
         'Esto te hizo creer que eras...' [creencia limitante]

      2) CÓMO SE ACTIVA HOY:
         'Tu herida Quirón ${elementData.sign} se activa cuando...' [triggers específicos]
         'En el área de [Casa ${elementData.house}] sientes que nunca eres suficiente porque...'

      3) TRAMPA DE LA HERIDA:
         '¡ESCUCHA ESTO CON CUIDADO!'
         'Tu herida Quirón NO se "cura" con [estrategia compensatoria típica ${elementData.sign}]'
         'Intentar [acción compensatoria] solo profundiza el dolor'

      4) TRANSFORMACIÓN → TALENTO:
         'Tu herida se transforma cuando...'
         'PORQUE pasaste por [dolor específico], ahora puedes...'
         'Tu don sanador único es...'

      5) HERIDO SANADOR EN ACCIÓN:
         'Cuando alguien sufre de [dolor similar], TÚ puedes ayudar porque:'
         - Conoces el dolor desde adentro
         - No minimizas ni juzgas
         - Ofreces [don específico nacido de tu herida]

      6) EJERCICIO DE ALQUIMIA:
         'Transforma veneno en medicina:'
         Paso 1: Reconoce cuando Quirón se activa [señales específicas]
         Paso 2: [Técnica de regulación/compasión]
         Paso 3: Pregúntate: '¿Cómo puedo usar este dolor para servir?'
         Paso 4: [Acción sanadora concreta]

      Tono: BRUTAL en reconocer dolor, COMPASIVO en sostenerlo, EMPODERADOR en transformación]",

    "poetico": "[2-3 párrafos LÍRICOS sobre alquimia del dolor:

      Metáfora de Quirón ${elementData.sign} como herida que se convierte en portal
      Imagen de loto naciendo del barro
      Concepto de 'kintsugi' (arte japonés de reparar con oro) - tus grietas son tu oro

      Ejemplo: 'Tu Quirón ${elementData.sign} es como...' ]",

    "sombras": [
      {
        "nombre": "Identificación con la Herida",
        "descripcion": "Te defines por tu dolor en lugar de por tu capacidad sanadora",
        "trampa": "❌ 'Soy mi herida. Siempre estaré roto/a en [área Casa ${elementData.house}]'",
        "regalo": "✅ 'Mi herida es mi portal. No me define - me transforma. Soy sanador/a'"
      },
      {
        "nombre": "Compensación Excesiva",
        "descripcion": "Intentas demostrar que NO estás herido/a siendo perfecto/a en esa área",
        "trampa": "❌ 'Si logro [cosa compensatoria], probaré que no estoy roto/a'",
        "regalo": "✅ 'Mi herida no necesita demostración. Necesita compasión y transformación'"
      },
      {
        "nombre": "Proyección del Sanador",
        "descripcion": "Sanas a otros pero no te permites recibir sanación",
        "trampa": "❌ 'Yo sano a otros pero nadie puede sanarme a mí / No necesito ayuda'",
        "regalo": "✅ 'Puedo dar Y recibir. Mi herida me conecta con humanidad compartida'"
      }
    ],
    "sintesis": {
      "frase": "Tu herida Quirón ${elementData.sign} es tu medicina más potente",
      "declaracion": "YO, ${userProfile.name}, honro mi herida sagrada en ${elementData.sign} Casa ${elementData.house}. No intento curarla - la transformo. Mi dolor más profundo es mi portal sanador más poderoso. Sirvo a otros desde mi humanidad rota y hermosa."
    }
  }
}

ESTILO: Profundamente compasivo, brutalmente honesto sobre el dolor, empoderador en transformación.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// ⚔️ MARTE - Acción, Límites, Energía, Decir "NO"
// =============================================================================

function getMartePrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Marte (acción, límites, energía, rabia)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

Marte NO es solo "energía" o "pasión". Es:

1. **LÍMITES Y DECIR "NO"**:
   - Capacidad de establecer límites saludables
   - Defender tu espacio/tiempo/energía
   - Decir "NO" sin culpa

2. **RABIA SANA**:
   - Cómo manejas tu enojo (lo reprimes / lo exploras / lo expresas)
   - Qué aprendiste sobre rabia en tu familia
   - Si tu rabia fue permitida, castigada o invisibilizada

3. **ACCIÓN Y DESEO**:
   - Cómo vas tras lo que quieres
   - Si actúas o te paralizas
   - Relación con tu impulso vital

4. **AUTOAFIRMACIÓN**:
   - Capacidad de defenderte
   - Assertividad (decir lo que piensas/sientes)
   - Reclamar tu poder personal

5. **SEXUALIDAD** (si apropiado para edad):
   - Cómo expresas tu energía sexual
   - Relación con tu cuerpo y deseo

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "⚔️ [Título sobre límites/acción - máx 5 palabras]",
    "descripcionBreve": "Marte en ${elementData.sign} en Casa ${elementData.house} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Cómo estableces límites, cómo manejas rabia, cómo actúas]",
    "efecto": "[1 frase: Efecto principal en tu capacidad de defenderte/actuar]",
    "tipo": "[Arquetipo - ej: 'Guerrero Asertivo', 'Diplomático Pasivo']"
  },
  "drawer": {
    "titulo": "⚔️ Tu Marte: Límites y Poder Personal en ${elementData.sign}",
    "educativo": "[3-5 párrafos educativos. Explica:

      1) QUÉ es Marte en psicología astrológica (límites, rabia sana, acción, deseo)
      2) CÓMO Marte ${elementData.sign} establece límites (estilo específico)
      3) QUÉ significa Casa ${elementData.house} (área donde ejerces poder/límites)
      4) RABIA APRENDIDA: Qué te enseñaron sobre enojo/decir NO en tu familia
      5) Ejemplos concretos de límites sanos vs límites difusos

      Lenguaje claro. Validante.]",

    "poderoso": "[4-6 párrafos DISRUPTIVOS. Incluye:

      1) DIAGNÓSTICO BRUTAL:
         '${userProfile.name}, tu Marte en ${elementData.sign} en Casa ${elementData.house} revela que...'
         'En el área de [Casa ${elementData.house}] tu capacidad de decir NO es...'

      2) HERIDA DEL LÍMITE:
         'De niño/a aprendiste que expresar rabia/establecer límites era...'
         'Tu familia te enseñó que decir NO significaba...'
         'Esto te llevó a [patrón compensatorio]'

      3) MARTE BLOQUEADO:
         '¿DÓNDE ESTÁ TU RABIA?'
         Si Marte bloqueado: 'Reprimes tu rabia, dices SÍ cuando quieres decir NO, te tragas límites'
         Si Marte explosivo: 'Tu rabia explota porque no la expresas a tiempo, límites rígidos por miedo'
         Si Marte pasivo-agresivo: 'Atacas indirectamente porque expresar rabia directa da miedo'

      4) CÓMO AFECTA RELACIONES/TRABAJO:
         'En relaciones: [patrón específico límites]'
         'En trabajo: [patrón específico assertividad]'
         'Esto te cuesta...' [consecuencias reales]

      5) LIBERACIÓN DE MARTE:
         '¡TU RABIA ES SAGRADA!'
         'Tu NO es medicina'
         'Límites sanos = amor propio'
         'Cómo expresar Marte ${elementData.sign} conscientemente:'

      6) EJERCICIO DE LÍMITES:
         'Práctica semanal de poder personal:'
         Día 1: [Ejercicio específico decir NO]
         Día 2: [Ejercicio expresión rabia sana]
         Día 3: [Ejercicio autoafirmación]
         Día 4: [Ejercicio acción hacia deseo]

      Tono: BRUTAL, sin juzgar rabia, empoderador en límites]",

    "poetico": "[2-3 párrafos LÍRICOS sobre espada sagrada:

      Metáfora de Marte ${elementData.sign} como espada, fuego sagrado, rugido de león
      Imagen de límites como cerca sagrada que protege jardín interno
      Rabia como fuego que quema lo que no te sirve

      Ejemplo: 'Tu Marte ${elementData.sign} es como...' ]",

    "sombras": [
      {
        "nombre": "Marte Reprimido",
        "descripcion": "Rabia tragada, límites difusos, incapacidad de decir NO",
        "trampa": "❌ 'No puedo decir NO / Mi rabia es mala / Debo complacer siempre'",
        "regalo": "✅ 'Mi NO es sagrado. Mi rabia es información. Mis límites son amor propio'"
      },
      {
        "nombre": "Marte Explosivo",
        "descripcion": "Rabia descontrolada por no expresarla a tiempo, límites rígidos por miedo",
        "trampa": "❌ 'Exploto porque acumulé → nadie me entiende → me aíslo con límites rígidos'",
        "regalo": "✅ 'Expreso rabia a tiempo, en dosis pequeñas. Límites flexibles pero firmes'"
      },
      {
        "nombre": "Marte Pasivo-Agresivo",
        "descripcion": "Atacas indirectamente (sarcasmo, sabotaje silencioso) porque rabia directa da miedo",
        "trampa": "❌ '[Comportamiento pasivo-agresivo específico ${elementData.sign}]'",
        "regalo": "✅ 'Digo mi verdad directamente. Mi rabia es honesta y clara, no manipuladora'"
      }
    ],
    "sintesis": {
      "frase": "Tu Marte ${elementData.sign} es tu espada sagrada de límites y verdad",
      "declaracion": "YO, ${userProfile.name}, reclamo mi Marte ${elementData.sign}. Mi NO es completo. Mi rabia es información sagrada. Establezco límites sin culpa. Actúo hacia mis deseos sin disculpas. En Casa ${elementData.house}, defiendo mi espacio con amor propio inquebrantable."
    }
  }
}

ESTILO: Empoderador en límites, sin juzgar rabia, brutalmente honesto sobre patrones.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// 💕 VENUS - Amor, Dinero, Valores
// =============================================================================

function getVenusPrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Venus (amor, dinero, valores, placer)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

Venus rige AMOR y DINERO (misma energía):

1. **AMOR - Cómo das y recibes**:
   - Lenguaje de amor (actos servicio/palabras/tiempo/regalos/tacto)
   - ¿PUEDES RECIBIR o solo das?
   - Love blocks (bloqueos de amor = bloqueos de dinero)

2. **DINERO - Valor propio**:
   - Relación con abundancia/escasez
   - Qué crees que vales
   - Cómo recibes dinero (facilidad vs rechazo)

3. **VALORES - Qué es importante**:
   - Sistema de valores desde familia
   - Qué te hace sentir valioso/a
   - Placer permitido vs culpa

4. **CONEXIÓN AMOR = DINERO**:
   - Si no puedes recibir amor → no puedes recibir dinero
   - Si no te valoras → cobras menos de lo que vales

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "💕 [Título sobre amor/valor - máx 5 palabras]",
    "descripcionBreve": "Venus en ${elementData.sign} en Casa ${elementData.house} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Cómo amas, qué valoras, relación con dinero]",
    "efecto": "[1 frase: Efecto principal en amor Y dinero]",
    "tipo": "[Arquetipo - ej: 'Amante Generoso', 'Sanador de Valor']"
  },
  "drawer": {
    "titulo": "💕 Tu Venus: Amor, Dinero y Valor en ${elementData.sign}",
    "educativo": "[3-5 párrafos claros explicando que Venus rige AMOR y DINERO simultáneamente, cómo ${elementData.sign} expresa esto, qué significa Casa ${elementData.house}, ejemplos concretos]",
    "poderoso": "[4-6 párrafos DISRUPTIVOS sobre: 1) Tu lenguaje de amor ${elementData.sign}, 2) ¿Puedes RECIBIR o solo das?, 3) Love blocks = money blocks SIEMPRE, 4) Ejercicios de merecimiento, 5) Conexión valor propio con abundancia, 6) Mensaje brutal sobre cobrar tu valor]",
    "poetico": "[2-3 párrafos líricos comparando Venus ${elementData.sign} con belleza natural, tesoro oculto, jardín que florece cuando se cuida]",
    "sombras": [
      {
        "nombre": "Bloqueo de Recibir",
        "descripcion": "Das amor/dinero pero no puedes recibir",
        "trampa": "❌ 'Solo valgo si doy / Recibir es egoísta / No merezco'",
        "regalo": "✅ 'Puedo DAR Y RECIBIR. Mi valor es intrínseco'"
      },
      {
        "nombre": "Valor Propio Bloqueado",
        "descripcion": "Cobras menos de lo que vales, atraes amor que te infravalora",
        "trampa": "❌ 'No puedo pedir más / Soy demasiado caro/a / No merezco amor pleno'",
        "regalo": "✅ 'Mi Venus ${elementData.sign} vale ORO. Cobro mi valor sin disculpas'"
      }
    ],
    "sintesis": {
      "frase": "Tu Venus ${elementData.sign} es tu portal de amor Y abundancia",
      "declaracion": "YO, ${userProfile.name}, reclamo mi Venus ${elementData.sign}. DOY Y RECIBO amor con facilidad. Mi valor es intrínseco. Cobro lo que valgo sin culpa. En Casa ${elementData.house}, florezco en abundancia de amor y dinero porque ME VALORO."
    }
  }
}

ESTILO: Enfocado en RECIBIR (no solo dar), conexión explícita amor=dinero, valor propio.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// 🎨 CASA 5 - Expresión Personal, Creatividad, Romance, Niño Interior
// =============================================================================

function getCasa5Prompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

Genera una interpretación PSICOLÓGICA PROFUNDA para:

**ELEMENTO:** Casa 5 (expresión creativa, niño interior, romance, placer)
**SIGNO EN CÚSPIDE:** ${elementData.sign}
**PLANETAS EN CASA 5:** ${elementData.planets?.map((p: any) => p.name).join(', ') || 'Ninguno'}

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

Casa 5 NO es solo "creatividad" o "romance". Es:

1. **NIÑO INTERIOR**:
   - Tu capacidad de jugar, divertirte, ser espontáneo/a
   - Si tu niño interior está libre o reprimido
   - Qué te enseñaron sobre "perder el tiempo" en placer

2. **EXPRESIÓN AUTÉNTICA**:
   - Cómo te expresas creativamente (arte, escritura, baile, lo que sea)
   - Si te permites ser visto/a en tu verdad
   - Miedo/facilidad de brillar

3. **ROMANCE Y CORTEJO**:
   - Cómo coqueteas, seduces, cortejas
   - Placer en primeras etapas de amor (antes de compromiso Casa 7)

4. **PLACER SIN CULPA**:
   - Capacidad de disfrutar sin sentir que "deberías estar produciendo"
   - Relación con ocio, diversión, alegría

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🎨 [Título sobre expresión - máx 5 palabras]",
    "descripcionBreve": "Casa 5 en ${elementData.sign}",
    "significado": "[2-3 líneas: Tu niño interior, cómo te expresas creativamente, relación con placer]",
    "efecto": "[1 frase: Efecto principal en tu capacidad de jugar/crear/brillar]",
    "tipo": "[Arquetipo - ej: 'Artista Libre', 'Niño Reprimido']"
  },
  "drawer": {
    "titulo": "🎨 Tu Casa 5: Niño Interior y Expresión en ${elementData.sign}",
    "educativo": "[3-5 párrafos sobre qué es Casa 5, cómo ${elementData.sign} se expresa creativamente, qué planetas están aquí y qué significan]",
    "poderoso": "[4-6 párrafos DISRUPTIVOS: 1) Estado de tu niño interior, 2) ¿Te permites jugar o sientes culpa?, 3) Expresión creativa bloqueada vs libre, 4) Romance y seducción, 5) Ejercicios de reparenting del niño interior, 6) Mensaje sobre permitirte brillar]",
    "poetico": "[2-3 párrafos líricos sobre niño interior como chispa divina, creatividad como fuego sagrado]",
    "sombras": [
      {
        "nombre": "Niño Interior Reprimido",
        "descripcion": "Te sientes culpable por jugar/divertirte, siempre debes ser productivo/a",
        "trampa": "❌ 'Jugar es perder el tiempo / Debo ser serio/productivo siempre'",
        "regalo": "✅ 'Mi niño interior es sagrado. El juego es medicina, no pérdida de tiempo'"
      },
      {
        "nombre": "Miedo a Brillar",
        "descripcion": "Reprimes tu expresión creativa por miedo a ser visto/juzgado",
        "trampa": "❌ 'Mejor no mostrarme / ¿Qué dirán? / No soy suficientemente bueno/a'",
        "regalo": "✅ 'Mi expresión ${elementData.sign} es única y valiosa. Brillo sin disculpas'"
      }
    ],
    "sintesis": {
      "frase": "Tu Casa 5 en ${elementData.sign} es tu portal de alegría y autenticidad",
      "declaracion": "YO, ${userProfile.name}, libero a mi niño interior ${elementData.sign}. JUEGO sin culpa. Me expreso creativamente sin miedo. Brillo en mi autenticidad. Mi alegría es sagrada, no frivolidad."
    }
  }
}

ESTILO: Validante con niño interior, empoderador en expresión, sin juzgar placer.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// 🌙 LUNA - Mejorada con enfoque en infancia y necesidades
// =============================================================================

function getLunaPrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

## ⚠️ LA LUNA EXPLICA EL 80% DE TUS PATRONES ADULTOS

**ELEMENTO:** Luna (infancia emocional, herida nuclear, necesidades)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

## 🎯 METODOLOGÍA OBLIGATORIA:

La Luna NO es solo "emociones". Es:

1. **INFANCIA EMOCIONAL** (Teoría del Apego - Bowlby, Ainsworth):
   - Cómo fuiste tratado/a de niño/a
   - Qué necesitabas y NO recibiste
   - Ambiente emocional de tu hogar

2. **HERIDA NUCLEAR**:
   - Dolor primario que moldea todos tus patrones adultos
   - Necesidad insatisfecha que buscas compensar en relaciones

3. **CÓMO TE CUIDAS HOY**:
   - Si te das lo que necesitas o lo buscas afuera
   - Auto-cuidado vs auto-abandono
   - Reparenting consciente

4. **PATRONES RELACIONALES** (Apego):
   - Apego seguro / ansioso / evitativo
   - Qué repites de tu madre (o cuidador principal)
   - Cómo te vinculas en relaciones íntimas

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌙 [Título sobre infancia - máx 5 palabras]",
    "descripcionBreve": "Luna en ${elementData.sign} en Casa ${elementData.house} (${elementData.degree}°)",
    "significado": "[2-3 líneas: Qué necesitabas de niño/a, herida nuclear, cómo te cuidas HOY]",
    "efecto": "[1 frase: Efecto principal en tus patrones relacionales adultos]",
    "tipo": "[Arquetipo - ej: 'Niño Herido', 'Sanador Emocional']"
  },
  "drawer": {
    "titulo": "🌙 Tu Luna: Infancia Emocional en ${elementData.sign}",
    "educativo": "[3-5 párrafos explicando: 1) Qué es Luna en psicología astrológica (80% patrones adultos), 2) Luna ${elementData.sign} - qué necesitabas emocionalmente, 3) Casa ${elementData.house} - ambiente emocional del hogar, 4) Teoría del Apego - tipos de vínculo, 5) Cómo esto moldea TODOS tus patrones hoy]",
    "poderoso": "[4-6 párrafos BRUTALMENTE HONESTOS pero COMPASIVOS:

      1) INFANCIA EMOCIONAL:
         '${userProfile.name}, tu Luna en ${elementData.sign} en Casa ${elementData.house} revela que de niño/a necesitabas...'
         'Pero lo que recibiste fue...'

      2) HERIDA NUCLEAR:
         'Tu herida primaria (la que explica el 80% de tus patrones): [necesidad insatisfecha específica]'
         'Esto creó la creencia: [creencia limitante sobre ti o el mundo]'

      3) PATRONES ADULTOS HOY:
         'En relaciones románticas: [patrón de apego específico]'
         'En amistad: [patrón específico]'
         'Contigo mismo/a: [auto-cuidado vs auto-abandono]'

      4) REPARENTING:
         '¡ESCUCHA ESTO!'
         'Tu Luna NO necesita que otro te complete. Necesita que TÚ te des lo que faltó'
         'Ejercicio de reparenting: [pasos concretos]'

      5) MENSAJE A TU NIÑO INTERIOR:
         '[Carta de 100-150 palabras del adulto que eres hoy al niño/a que fuiste]'
         'Validación + compasión + nueva promesa'

      Tono: Profundamente compasivo, validante del dolor, empoderador en sanación]",

    "poetico": "[2-3 párrafos líricos sobre Luna como niño interior, jardín emocional que necesita cuidado específico ${elementData.sign}]",

    "sombras": [
      {
        "nombre": "Patrón de Apego [Ansioso/Evitativo/Desorganizado]",
        "descripcion": "Repites en adulto el patrón que aprendiste de niño/a con tu cuidador",
        "trampa": "❌ 'Busco en pareja lo que no recibí de niño/a / Me alejo porque cercanía da miedo'",
        "regalo": "✅ 'Reconozco mi patrón. Puedo crear apego seguro dándome lo que necesito'"
      },
      {
        "nombre": "Auto-Abandono",
        "descripcion": "Cuidas de otros pero no de ti mismo/a, repites el abandono que viviste",
        "trampa": "❌ 'Solo valgo si cuido a otros / Mis necesidades no importan'",
        "regalo": "✅ 'Mi Luna ${elementData.sign} merece cuidado. Me reparo a mí mismo/a primero'"
      }
    ],
    "sintesis": {
      "frase": "Tu Luna ${elementData.sign} es tu niño interior que aún necesita tu amor",
      "declaracion": "YO, ${userProfile.name}, honro a mi niño interior ${elementData.sign} en Casa ${elementData.house}. Le doy lo que no recibió. Rompo el patrón de abandono/ansiedad. Creo apego seguro conmigo mismo/a primero. Mi herida lunar es mi portal de sanación profunda."
    }
  }
}

ESTILO: COMPASIVO, validante del dolor infantil, empoderador en reparenting, teoría del apego.
RESPONDE SOLO JSON VÁLIDO.`;
}

// =============================================================================
// 🔮 PROMPT GENÉRICO (para otros elementos)
// =============================================================================

function getGenericPrompt(
  elementType: 'planet' | 'angle' | 'asteroid' | 'node' | 'house',
  elementName: string,
  elementData: any,
  userProfile: any
): string {
  // Prompt genérico actual del sistema
  return `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA para:

**ELEMENTO:** ${elementName}
**TIPO:** ${elementType}
**SIGNO:** ${elementData.sign || 'N/A'}
**CASA:** ${elementData.house || 'N/A'}
**GRADO:** ${elementData.degree || 'N/A'}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

(Formato JSON estándar con tooltip + drawer)

RESPONDE SOLO JSON VÁLIDO.`;
}
