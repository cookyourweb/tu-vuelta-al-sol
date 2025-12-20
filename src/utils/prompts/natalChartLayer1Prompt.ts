// =============================================================================
// 🎯 NATAL CHART PROMPT - IDENTIDAD PSICOLÓGICA (PROFESIONAL)
// src/utils/prompts/natalChartLayer1Prompt.ts
// =============================================================================
// ✅ FILOSOFÍA: Explicación psicológica/educativa profesional
// ❌ PROHIBIDO: Rituales, mantras, timing, predicciones
// ✅ PERMITIDO: Lenguaje claro, profesional, educativo, patrones psicológicos
// =============================================================================

export interface UserProfile {
  name: string;
  age: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface ChartData {
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    retrograde?: boolean;
  }>;
  houses: Array<{ number: number; sign: string; degree: number }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function findPlanet(planets: ChartData['planets'], ...names: string[]) {
  return planets.find(p => names.some(n => p.name.toLowerCase().includes(n.toLowerCase())));
}

function formatPlanetsForPrompt(planets: ChartData['planets']): string {
  return planets.map(p =>
    `- ${p.name}: ${p.sign} ${p.degree}° Casa ${p.house}${p.retrograde ? ' (R)' : ''}`
  ).join('\n');
}

// =============================================================================
// MAIN PROMPT GENERATOR
// =============================================================================

export function generateNatalChartLayer1Prompt(
  chartData: ChartData,
  userProfile: UserProfile
): string {

  // Extract planets
  const sun = findPlanet(chartData.planets, 'Sol', 'Sun');
  const moon = findPlanet(chartData.planets, 'Luna', 'Moon');
  const mercury = findPlanet(chartData.planets, 'Mercurio', 'Mercury');
  const venus = findPlanet(chartData.planets, 'Venus');
  const mars = findPlanet(chartData.planets, 'Marte', 'Mars');
  const jupiter = findPlanet(chartData.planets, 'Jupiter', 'Júpiter');
  const saturn = findPlanet(chartData.planets, 'Saturno', 'Saturn');
  const northNode = findPlanet(chartData.planets, 'Nodo Norte', 'North Node', 'True Node');
  const southNode = findPlanet(chartData.planets, 'Nodo Sur', 'South Node');

  return `📌 INSTRUCCIONES PARA EL MODELO

Eres un astrólogo psicológico profesional.
Tu función es interpretar la CARTA NATAL como mapa de identidad, NO como predicción.

❌ PROHIBIDO:
- Tránsitos, retornos solares, eventos futuros
- Rituales, mantras, advertencias
- Lenguaje fatalista o místico vacío
- Predicciones de ningún tipo
- Lenguaje "disruptivo" excesivo o sensacionalista

✅ OBLIGATORIO:
- Lenguaje claro, educativo, profundo y empoderador
- Explicar siempre QUÉ significa cada casa
- Escribir en segunda persona ("tú")
- Mantener coherencia psicológica
- Mostrar luz Y sombra (enfoque junguiano)
- Explicar CÓMO funciona la energía desde la infancia hasta ahora

---

📊 DATOS DE NACIMIENTO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Nacimiento: ${userProfile.birthDate} a las ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

---

📋 POSICIONES PLANETARIAS:
${formatPlanetsForPrompt(chartData.planets)}

Ascendente: ${chartData.ascendant.sign} ${chartData.ascendant.degree}°
Medio Cielo: ${chartData.midheaven.sign} ${chartData.midheaven.degree}°

---

⚠️ IMPORTANTE: Responde SOLO con JSON válido siguiendo EXACTAMENTE esta estructura. NO agregues texto antes ni después del JSON.

{
  "capa_1_identidad_psicologica": {
    "titulo": "🔹 CAPA 1 — IDENTIDAD PSICOLÓGICA NATAL",
    "subtitulo": "Quién eres y cómo funciona tu sistema interno",

    "sol": {
      "titulo": "☀️ Sol en ${sun?.sign} en Casa ${sun?.house}",
      "subtitulo": "(Propósito de vida · Identidad · Autoexpresión)",
      "que_significa_casa": "[Explicación clara y breve: La Casa ${sun?.house} representa [área de vida]. Es donde brilla tu identidad y se expresa tu propósito vital.]",
      "identidad_esencial": "[2-3 párrafos profesionales y claros: 'Tu Sol en ${sun?.sign} en Casa ${sun?.house} revela que tu propósito vital se enfoca en [característica]. Tu identidad se construye a través de [cualidad del signo] aplicada a [área de la casa]. Desde la infancia, probablemente te identificabas con [patrón temprano]. Esta energía te impulsa a [manifestación actual en la vida]...']",
      "patron_formativo": "[2-3 líneas: 'Durante la infancia, cuando [situación], internalizaste que [creencia sobre ti mismo]. Este patrón ahora te impulsa a [comportamiento actual relacionado con el propósito].']",
      "sombra_reactiva": "[2-3 líneas: 'Cuando esta energía no se integra, puedes [patrón reactivo del signo en esta casa]. Esto ocurre cuando [trigger o situación].']",
      "luz_consciente": "[2-3 líneas: 'Cuando activas tu Sol conscientemente, te conviertes en [arquetipo positivo del signo]. Tu capacidad de [fortaleza] en [área de casa] es tu expresión más auténtica.']",
      "superpoder_integrado": "[1 frase clara y concreta]"
    },

    "luna": {
      "titulo": "🌙 Luna en ${moon?.sign} en Casa ${moon?.house}",
      "subtitulo": "(Emociones · Necesidades · Seguridad emocional)",
      "que_significa_casa": "[Explicación clara: La Casa ${moon?.house} representa [área emocional de vida]. Es donde buscas seguridad emocional y nutrición.]",
      "mundo_emocional": "[2-3 párrafos: 'Tu Luna en ${moon?.sign} en Casa ${moon?.house} revela que tu sistema emocional funciona a través de [característica del signo]. Necesitas [necesidad emocional específica] para sentirte en equilibrio. Desde la infancia, tu seguridad emocional provino de [experiencia o entorno]. Hoy, te sientes bien cuando [situación o contexto actual]...']",
      "patron_formativo": "[2-3 líneas: 'De niño, aprendiste que [creencia sobre las emociones] cuando [situación familiar o de entorno]. Internalizaste que para estar seguro emocionalmente necesitabas [comportamiento o condición].']",
      "sombra_reactiva": "[2-3 líneas: 'Cuando tu Luna está en modo supervivencia, puedes [patrón reactivo emocional]. Esto ocurre cuando [trigger emocional].']",
      "luz_consciente": "[2-3 líneas: 'Tu inteligencia emocional desarrollada en ${moon?.sign} te permite [capacidad emocional positiva]. En Casa ${moon?.house}, esto se expresa como [fortaleza emocional específica].']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "ascendente": {
      "titulo": "🎭 Ascendente en ${chartData.ascendant.sign}",
      "subtitulo": "(Personalidad visible · Primera impresión · Filtro vital)",
      "que_significa_ascendente": "[Explicación clara: El Ascendente es tu interfaz con el mundo. Es la energía que proyectas antes de hablar y cómo filtras la experiencia de vida.]",
      "mascara_autentica": "[2-3 párrafos: 'Tu Ascendente en ${chartData.ascendant.sign} hace que proyectes [energía característica]. Antes de que hables, la gente percibe [primera impresión]. Esto no es una máscara falsa: es tu forma auténtica de presentarte al mundo. La gente te ve como [percepción externa], mientras que tú te experimentas internamente como [vivencia del Sol]...']",
      "patron_formativo": "[2-3 líneas: 'Este filtro se activó desde tu primer respiro. De bebé, el mundo respondió a tu energía ${chartData.ascendant.sign} con [respuesta del entorno], moldeando cómo te presentas.']",
      "sombra_reactiva": "[2-3 líneas: 'Cuando te sobre-identificas con tu Ascendente, puedes [exceso del signo]. Cuando lo rechazas, puedes [rechazo o negación]. Ninguno es real: son extremos.']",
      "luz_consciente": "[2-3 líneas: 'Cuando usas tu ${chartData.ascendant.sign} conscientemente, abres puertas a [tipo de experiencias]. Tu presencia genera [efecto positivo] de forma natural.']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "mercurio": {
      "titulo": "🧠 Mercurio en ${mercury?.sign} en Casa ${mercury?.house}",
      "subtitulo": "(Cómo piensas y te comunicas)",
      "que_significa_casa": "[Explicación clara: La Casa ${mercury?.house} es donde se activa tu mente y comunicación en [área de vida].]",
      "estilo_mental": "[2-3 párrafos: 'Tu Mercurio en ${mercury?.sign} en Casa ${mercury?.house} revela que tu mente procesa información de forma [característica del signo]. Piensas mejor cuando [condición]. Tu claridad mental llega a través de [método]. Desde niño, probablemente destacabas en [área mental] pero te confundías con [área opuesta]...']",
      "patron_formativo": "[2-3 líneas: 'Tu estilo mental se formó cuando [experiencia educativa temprana]. Aprendiste que [creencia sobre la inteligencia o comunicación].']",
      "sombra_reactiva": "[2-3 líneas: 'Tu mente puede [patrón: dispersarse/obsesionarse/bloquearse]. Esto ocurre cuando [sobrecarga o situación].']",
      "luz_consciente": "[2-3 líneas: 'Tu capacidad de [habilidad mental del signo] en Casa ${mercury?.house} es única. Esto se traduce en [manifestación práctica].']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "venus": {
      "titulo": "💎 Venus en ${venus?.sign} en Casa ${venus?.house}",
      "subtitulo": "(Cómo amas · Valores · Vínculos)",
      "que_significa_casa": "[Explicación clara: La Casa ${venus?.house} es donde se expresan tu amor y tus valores en [área de vida].]",
      "forma_de_amar": "[2-3 párrafos: 'Tu Venus en ${venus?.sign} en Casa ${venus?.house} busca [tipo específico de conexión]. Tu corazón no se abre con palabras bonitas: se abre con [acción/cualidad específica]. Lo que realmente valoras es [valor profundo]. Desde niño, viste que el amor era [modelo observado]. Hoy buscas [necesidad venusina]...']",
      "patron_formativo": "[2-3 líneas: 'Tu Venus se programó cuando observaste que [modelo de amor/valor]. Internalizaste que para ser amado necesitabas [creencia].']",
      "sombra_reactiva": "[2-3 líneas: 'Puedes [patrón de apego/carencia]. Esto ocurre cuando buscas [necesidad profunda] en lugares equivocados.']",
      "luz_consciente": "[2-3 líneas: 'Tu capacidad de [crear belleza/amar profundamente] en ${venus?.sign} es arte. En Casa ${venus?.house}, esto se manifiesta como [expresión única].']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "marte": {
      "titulo": "⚔️ Marte en ${mars?.sign} en Casa ${mars?.house}",
      "subtitulo": "(Cómo enfrentas la vida · Acción)",
      "que_significa_casa": "[Explicación clara: La Casa ${mars?.house} es donde se activa tu acción y assertividad en [área de vida].]",
      "motor_interno": "[2-3 párrafos: 'Tu Marte en ${mars?.sign} en Casa ${mars?.house} es tu motor de arranque. Actúas de forma [característica del signo]. Tu energía se enciende cuando [trigger]. Desde niño, aprendiste que tu acción [era vista como]. Hoy, tu forma de enfrentar retos es [característica]...']",
      "patron_formativo": "[2-3 líneas: 'Tu Marte se calibró cuando [experiencia con autoridad/conflicto]. Aprendiste que tu fuerza era [creencia sobre poder personal].']",
      "sombra_reactiva": "[2-3 líneas: 'Puedes [explotar/reprimirte/agredir pasivamente]. Esto ocurre cuando tu energía vital no tiene dirección consciente.']",
      "luz_consciente": "[2-3 líneas: 'Tu capacidad de [iniciar/defender/ejecutar] en ${mars?.sign} es poder puro. En Casa ${mars?.house}, esto se convierte en [fortaleza específica].']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "jupiter": {
      "titulo": "🍀 Júpiter en ${jupiter?.sign} en Casa ${jupiter?.house}",
      "subtitulo": "(Suerte · Expansión · Confianza)",
      "que_significa_casa": "[Explicación clara: La Casa ${jupiter?.house} es donde se expande tu vida naturalmente en [área].]",
      "expansion_natural": "[2-3 párrafos: 'Tu Júpiter en ${jupiter?.sign} en Casa ${jupiter?.house} atrae [tipo de abundancia]. Donde otros ven escasez, tú ves [posibilidad]. Tu optimismo se basa en [fe en proceso específico]. Creces cuando [condición]. Desde niño, probablemente tenías facilidad para [área]. Hoy, tu expansión viene de [fuente]...']",
      "patron_formativo": "[2-3 líneas: 'Tu fe se formó cuando [experiencia de abundancia/escasez]. Aprendiste que el crecimiento venía de [creencia].']",
      "sombra_reactiva": "[2-3 líneas: 'Puedes [exceso/escapismo/promesas vacías]. Esto ocurre cuando buscas más en lugar de profundizar.']",
      "luz_consciente": "[2-3 líneas: 'Tu capacidad de ver posibilidades en ${jupiter?.sign} es un don. En Casa ${jupiter?.house}, esto se traduce en [manifestación de abundancia].']",
      "superpoder_integrado": "[1 frase clara]"
    },

    "saturno": {
      "titulo": "⏳ Saturno en ${saturn?.sign} en Casa ${saturn?.house}",
      "subtitulo": "(Karma · Responsabilidad · Maestría)",
      "que_significa_casa": "[Explicación clara: La Casa ${saturn?.house} es donde construyes maestría con el tiempo en [área].]",
      "leccion_vital": "[2-3 párrafos: 'Tu Saturno en ${saturn?.sign} en Casa ${saturn?.house} es donde construyes lo que PERDURA. Tu disciplina en [área] no es represión: es escultura de ti mismo. El miedo que sientes en [tema] no es señal de stop: es señal de que IMPORTA. Desde niño, sentiste que en [área] necesitabas ser [exigencia]. Hoy, ese patrón es [manifestación actual]...']",
      "patron_formativo": "[2-3 líneas: 'Tu Saturno se formó cuando [experiencia de límite/autoridad]. Internalizaste que eras [creencia limitante] en [área].']",
      "sombra_reactiva": "[2-3 líneas: 'Puedes [auto-sabotaje/rigidez/evitación]. Esto ocurre cuando tu sistema pregunta si REALMENTE quieres esto.']",
      "luz_consciente": "[2-3 líneas: 'Tu capacidad de construir en ${saturn?.sign} es inquebrantable. En Casa ${saturn?.house}, esto se convierte en [legado duradero].']",
      "superpoder_integrado": "[1 frase clara]"
    }
  },

  "capa_2_direccion_evolutiva": {
    "titulo": "🌟 CAPA 2 — DIRECCIÓN EVOLUTIVA DEL ALMA",

    "nodo_norte": {
      "titulo": "⬆️ Nodo Norte en ${northNode?.sign} en Casa ${northNode?.house}",
      "subtitulo": "(Hacia dónde creces)",
      "direccion_evolutiva": "[2-3 párrafos: 'Tu Nodo Norte en ${northNode?.sign} en Casa ${northNode?.house} es tu GPS evolutivo. Tu alma vino a desarrollar [cualidades del signo]. Esto se SIENTE incómodo porque es NUEVO. La Casa ${northNode?.house} es el área de vida donde esto se activa. No esperes que sea fácil: espera que sea TRANSFORMADOR...']"
    },

    "nodo_sur": {
      "titulo": "⬇️ Nodo Sur en ${southNode?.sign} en Casa ${southNode?.house}",
      "subtitulo": "(Zona de confort que debes trascender)",
      "zona_comfort": "[2-3 párrafos: 'Tu Nodo Sur en ${southNode?.sign} en Casa ${southNode?.house} es tu talento INNATO. Ya dominas [habilidades del signo]. El peligro: refugiarte aquí cuando la vida te pide crecer. Tu desafío: usar tus dones del Nodo Sur PARA activar tu Nodo Norte, no en lugar de...']"
    }
  },

  "integracion_final": {
    "titulo": "🌈 INTEGRACIÓN FINAL",
    "sintesis": "[3-4 párrafos profesionales y empoderadores: '${userProfile.name}, tu carta natal revela una configuración única. Tu Sol ${sun?.sign} en Casa ${sun?.house} te da [propósito]. Tu Luna ${moon?.sign} en Casa ${moon?.house} te nutre emocionalmente con [necesidad]. Tu Ascendente ${chartData.ascendant.sign} proyecta [energía] que abre puertas a [experiencias]. Cuando integras Sol, Luna y Ascendente, te conviertes en [síntesis de arquetipos]. Tu evolución está en moverte del Nodo Sur ${southNode?.sign} hacia el Nodo Norte ${northNode?.sign}. Esta carta no es predicción: es IDENTIDAD. Es tu mapa para vivir alineado con quien realmente eres...']"
  }
}

RECUERDA:
- Lenguaje claro, profesional y educativo
- NUNCA menciones rituales, mantras, timing lunar, o predicciones
- SIEMPRE enfoca en psicología, patrones, arquetipos, integración
- Muestra luz Y sombra (enfoque junguiano)
- Empoderar sin dar instrucciones de "qué hacer"
- Responde SOLO JSON válido, sin texto adicional`;
}
