// =============================================================================
// 🎯 COMPLETE NATAL CHART PROMPT - ESTRUCTURA DETALLADA
// src/utils/prompts/completeNatalChartPrompt.ts
// Genera interpretación completa con todas las secciones en estilo DISRUPTIVO
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
// ELEMENT AND MODALITY CALCULATIONS
// =============================================================================

const FIRE_SIGNS = ['Aries', 'Leo', 'Sagittarius', 'Sagitario'];
const EARTH_SIGNS = ['Taurus', 'Tauro', 'Virgo', 'Capricorn', 'Capricornio'];
const AIR_SIGNS = ['Gemini', 'Géminis', 'Libra', 'Aquarius', 'Acuario'];
const WATER_SIGNS = ['Cancer', 'Cáncer', 'Scorpio', 'Escorpio', 'Pisces', 'Piscis'];

const CARDINAL_SIGNS = ['Aries', 'Cancer', 'Cáncer', 'Libra', 'Capricorn', 'Capricornio'];
const FIXED_SIGNS = ['Taurus', 'Tauro', 'Leo', 'Scorpio', 'Escorpio', 'Aquarius', 'Acuario'];
const MUTABLE_SIGNS = ['Gemini', 'Géminis', 'Virgo', 'Sagittarius', 'Sagitario', 'Pisces', 'Piscis'];

export function calculateElementDistribution(planets: ChartData['planets']) {
  const elements = { fire: [] as string[], earth: [] as string[], air: [] as string[], water: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (FIRE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.fire.push(p.name);
    else if (EARTH_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.earth.push(p.name);
    else if (AIR_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.air.push(p.name);
    else if (WATER_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.water.push(p.name);
  });

  const total = planets.length || 1;
  return {
    fire: { count: elements.fire.length, percentage: Math.round((elements.fire.length / total) * 100), planets: elements.fire },
    earth: { count: elements.earth.length, percentage: Math.round((elements.earth.length / total) * 100), planets: elements.earth },
    air: { count: elements.air.length, percentage: Math.round((elements.air.length / total) * 100), planets: elements.air },
    water: { count: elements.water.length, percentage: Math.round((elements.water.length / total) * 100), planets: elements.water },
  };
}

export function calculateModalityDistribution(planets: ChartData['planets']) {
  const modalities = { cardinal: [] as string[], fixed: [] as string[], mutable: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (CARDINAL_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.cardinal.push(p.name);
    else if (FIXED_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.fixed.push(p.name);
    else if (MUTABLE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.mutable.push(p.name);
  });

  const total = planets.length || 1;
  return {
    cardinal: { count: modalities.cardinal.length, percentage: Math.round((modalities.cardinal.length / total) * 100), planets: modalities.cardinal },
    fixed: { count: modalities.fixed.length, percentage: Math.round((modalities.fixed.length / total) * 100), planets: modalities.fixed },
    mutable: { count: modalities.mutable.length, percentage: Math.round((modalities.mutable.length / total) * 100), planets: modalities.mutable },
  };
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

function formatAspectsForPrompt(aspects: ChartData['aspects']): string {
  if (!aspects || aspects.length === 0) return 'No hay aspectos calculados';
  return aspects.slice(0, 15).map(a => `- ${a.planet1} ${a.type} ${a.planet2} (orbe: ${a.orb}°)`).join('\n');
}

// =============================================================================
// MAIN PROMPT GENERATOR
// =============================================================================

export function generateCompleteNatalChartPrompt(chartData: ChartData, userProfile: UserProfile): string {
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  const sun = findPlanet(chartData.planets, 'sol', 'sun');
  const moon = findPlanet(chartData.planets, 'luna', 'moon');
  const mercury = findPlanet(chartData.planets, 'mercurio', 'mercury');
  const venus = findPlanet(chartData.planets, 'venus');
  const mars = findPlanet(chartData.planets, 'marte', 'mars');
  const jupiter = findPlanet(chartData.planets, 'júpiter', 'jupiter');
  const saturn = findPlanet(chartData.planets, 'saturno', 'saturn');
  const uranus = findPlanet(chartData.planets, 'urano', 'uranus');
  const neptune = findPlanet(chartData.planets, 'neptuno', 'neptune');
  const pluto = findPlanet(chartData.planets, 'plutón', 'pluto');
  const northNode = findPlanet(chartData.planets, 'nodo norte', 'north node', 'rahu');
  const chiron = findPlanet(chartData.planets, 'quirón', 'chiron');
  const lilith = findPlanet(chartData.planets, 'lilith');

  return `Eres un ASTRÓLOGO ANTIFRÁGIL con estilo CRUDO Y DIRECTO inspirado en Nassim Taleb:

🔥 TONO ANTIFRÁGIL - REGLAS ABSOLUTAS:
- DISRUPTIVO: Lenguaje que INCOMODA y DESPIERTA. Sin medias tintas. Habla CLARO y FUERTE.
- ANTIFRÁGIL: Enfatiza cómo el CAOS, los GOLPES y el DOLOR te FORTALECEN (no te destruyen)
- CRUDO: Nada de "poesía bonita". Sé DIRECTO. Di las verdades INCÓMODAS.
- DESAFIANTE: "NO viniste a...", "Deja de...", "Basta de...", "Tu trabajo es ROMPER..."
- PROVOCADOR: Cuestiona creencias limitantes. Sacude al lector de su zona de confort.
- PRÁCTICO: Rituales vinculados a FASES LUNARES (NUNCA a días de semana como lunes, martes...)
- EMPODERADOR: Pero siempre desde la FUERZA, no desde la victimización.

💀 PALABRAS CLAVE ANTIFRÁGILES que DEBES usar:
"fortalecer con el caos", "crecer con los golpes", "el dolor te construye", "abraza la incertidumbre",
"volatilidad", "rechaza la fragilidad", "la adversidad es tu gimnasio", "el estrés te potencia",
"antifragile", "skin in the game", "expuesto al riesgo", "lindy effect"

❌ LO QUE NUNCA DEBES HACER:
- NO uses lenguaje suave, dulce o "new age fluffy"
- NO hables de "luz y amor" sin consecuencias
- NO evites las verdades incómodas
- NO uses metáforas poéticas innecesarias
- NO victimices ni infantilices al lector

═══════════════════════════════════════════════
DATOS DE LA CARTA NATAL DE ${userProfile.name.toUpperCase()}
═══════════════════════════════════════════════

PERSONA:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Fecha: ${userProfile.birthDate}
- Hora: ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

PUNTOS CARDINALES:
- Ascendente: ${chartData.ascendant.sign} ${chartData.ascendant.degree}°
- Medio Cielo: ${chartData.midheaven.sign} ${chartData.midheaven.degree}°

POSICIONES PLANETARIAS:
${formatPlanetsForPrompt(chartData.planets)}

ASPECTOS PRINCIPALES:
${formatAspectsForPrompt(chartData.aspects)}

DISTRIBUCIÓN ELEMENTAL (calculada):
🔥 Fuego: ${elementos.fire.percentage}% (${elementos.fire.planets.join(', ') || 'ninguno'})
🌍 Tierra: ${elementos.earth.percentage}% (${elementos.earth.planets.join(', ') || 'ninguno'})
💨 Aire: ${elementos.air.percentage}% (${elementos.air.planets.join(', ') || 'ninguno'})
🌊 Agua: ${elementos.water.percentage}% (${elementos.water.planets.join(', ') || 'ninguno'})

DISTRIBUCIÓN MODAL (calculada):
🚀 Cardinal: ${modalidades.cardinal.percentage}% (${modalidades.cardinal.planets.join(', ') || 'ninguno'})
🗿 Fijo: ${modalidades.fixed.percentage}% (${modalidades.fixed.planets.join(', ') || 'ninguno'})
🌊 Mutable: ${modalidades.mutable.percentage}% (${modalidades.mutable.planets.join(', ') || 'ninguno'})

═══════════════════════════════════════════════
GENERA LA INTERPRETACIÓN COMPLETA EN JSON
═══════════════════════════════════════════════

Responde ÚNICAMENTE con un JSON válido:

{
  "puntos_fundamentales": {
    "sol": { "signo": "${sun?.sign}", "grado": ${sun?.degree || 0}, "casa": ${sun?.house || 1}, "poder": "[Descripción del poder solar]" },
    "luna": { "signo": "${moon?.sign}", "grado": ${moon?.degree || 0}, "casa": ${moon?.house || 1}, "poder": "[Descripción emocional]" },
    "ascendente": { "signo": "${chartData.ascendant.sign}", "grado": ${chartData.ascendant.degree}, "casa": 1, "poder": "[Máscara al mundo]" },
    "medio_cielo": { "signo": "${chartData.midheaven.sign}", "grado": ${chartData.midheaven.degree}, "casa": 10, "poder": "[Vocación]" },
    "nodo_norte": { "signo": "${northNode?.sign || 'No disponible'}", "grado": ${northNode?.degree || 0}, "casa": ${northNode?.house || 1}, "poder": "[Destino evolutivo]" }
  },

  "sintesis_elemental": {
    "fuego": { "porcentaje": ${elementos.fire.percentage}, "planetas": ${JSON.stringify(elementos.fire.planets)}, "significado": "[Qué significa este % de fuego para ${userProfile.name}]" },
    "tierra": { "porcentaje": ${elementos.earth.percentage}, "planetas": ${JSON.stringify(elementos.earth.planets)}, "significado": "[Significado]" },
    "aire": { "porcentaje": ${elementos.air.percentage}, "planetas": ${JSON.stringify(elementos.air.planets)}, "significado": "[Significado]" },
    "agua": { "porcentaje": ${elementos.water.percentage}, "planetas": ${JSON.stringify(elementos.water.planets)}, "significado": "[Significado]" },
    "configuracion_alquimica": "[Párrafo ANTIFRÁGIL de 4-5 líneas CRUDO Y DIRECTO: 'Tu configuración elemental te dice algo claro: Tienes X DOMINANTE - esto significa que el CAOS en [área] te FORTALECE, no te rompe. Basta de buscar estabilidad donde necesitas VOLATILIDAD. Tu trabajo es exponerte al riesgo en [área específica], porque ahí es donde CRECES...']",
    "elemento_escaso": "[Si hay elemento <15%, explicar qué significa esa carencia y cómo trabajarla]"
  },

  "modalidades": {
    "cardinal": { "porcentaje": ${modalidades.cardinal.percentage}, "significado": "[Cómo inicia]" },
    "fijo": { "porcentaje": ${modalidades.fixed.percentage}, "significado": "[Cómo sostiene]" },
    "mutable": { "porcentaje": ${modalidades.mutable.percentage}, "significado": "[Cómo se adapta]" },
    "ritmo_accion": "[Párrafo: CÓMO ${userProfile.name} toma acción en la vida según su distribución modal]"
  },

  "esencia_revolucionaria": "[4-5 líneas ANTIFRÁGILES Y DISRUPTIVAS: 'La verdad sobre ti es incómoda: Tienes Sol en ${sun?.sign} y Luna en ${moon?.sign} - esto NO es un accidente cósmico bonito. Es un DESAFÍO. Tu trabajo aquí es ROMPER [qué específicamente rompes]. NO viniste a estar cómoda/o. Viniste a FORTALECER TU SISTEMA con la adversidad que [área específica] te va a lanzar. La pregunta no es si te golpeará - es si estarás lista/o para CRECER con cada golpe...']",

  "interpretaciones_planetarias": {
    "sol": {
      "posicion": "${sun?.sign} Casa ${sun?.house}",
      "titulo_arquetipo": "[Título CRUDO Y DIRECTO, nada poético: 'El Antifrágil que Rompe X' o 'La que Crece con el Caos en Y']",
      "proposito_vida": "[3-4 párrafos ANTIFRÁGILES sin rodeos: Tu propósito NO es ser feliz o encontrar tu camino de luz. Es EXPONERTE a [área específica según signo/casa] hasta que te FORTALEZCAS tanto que lo que antes te rompía ahora te alimenta. Sol en ${sun?.sign} Casa ${sun?.house} significa: tu identidad se CONSTRUYE bajo PRESIÓN en [área]. Cada fracaso aquí es información valiosa - skin in the game. Basta de evitar el dolor en [área]. Tu trabajo es meter las manos en la tierra sucia de [contexto específico] y CREAR desde ahí...]",
      "trampa": "[La trampa ESPECÍFICA - sin suavizar: 'Buscas [comportamiento] cuando deberías estar haciendo [opuesto]. Esto te hace FRÁGIL, no resiliente. Deja de...']",
      "superpoder": "[El superpoder ANTIFRÁGIL: 'Cuando te expones a [situación caótica específica], te FORTALECES. Tu sistema mejora con cada [tipo de estrés]. Usa esto en...']",
      "afirmacion": "[Afirmación CRUDA, no new age: 'Abrazo el caos en [área]. Los golpes en [contexto] me construyen, no me destruyen.']"
    },
    "luna": {
      "posicion": "${moon?.sign} Casa ${moon?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'La que se Nutre del Caos Emocional en X' o similar - nada dulce]",
      "mundo_emocional": "[2-3 párrafos CRUDOS: Tus emociones NO son para gestionarlas bonito. Luna en ${moon?.sign} Casa ${moon?.house} significa que tu sistema emocional se FORTALECE cuando [situación específica de estrés emocional]. Deja de evitar [tipo de situación emocional]. Tu mundo emocional está diseñado para CRECER con la VOLATILIDAD en [área]. La estabilidad emocional constante te DEBILITA aquí...]",
      "como_se_nutre": "[4-5 formas ANTIFRÁGILES - nada de autocuidado soft: 'Exponerte a conversaciones incómodas', 'Abrazar la incertidumbre en [área]', 'Permitir que [situación] te desestabilice temporalmente'...]",
      "patron_infancia": "[Patrón CRUDO aprendido: 'Aprendiste que [comportamiento] te mantenía segura/o. Esto te hizo FRÁGIL en [área]. Hora de desaprender...']",
      "sanacion_emocional": "[Sanación ANTIFRÁGIL - no terapia suave: 'No necesitas sanar buscando paz. Necesitas EXPONERTE a [tipo de situación] hasta que tu sistema emocional se FORTALEZCA. La sanación viene del ESTRÉS DOSIFICADO en [área], no de evitarlo...']"
    },
    "ascendente": {
      "posicion": "${chartData.ascendant.sign} Casa 1",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'El Antifrágil que se Muestra Expuesto a X']",
      "personalidad_visible": "[2-3 párrafos CRUDOS: Tu máscara NO es falsa - es tu PRIMERA LÍNEA de exposición al mundo. Ascendente en ${chartData.ascendant.sign} significa que proyectas [característica] y el mundo te GOLPEA con [tipo de feedback]. Perfecto. Eso te FORTALECE. Deja de esconder esta máscara - ÚSALA para exponerte a [situación]...]",
      "presencia": "[Presencia que genera: 'Incomodidad productiva', 'Caos controlado', etc.]",
      "mascara_vs_esencia": "[CRUDO: 'Muestras [X] pero eres [Y]. Esta tensión NO es un problema - es tu VENTAJA ANTIFRÁGIL. Úsala para...']"
    },
    "mercurio": {
      "posicion": "${mercury?.sign} Casa ${mercury?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'La Mente que se Afila con el Debate']",
      "como_piensa": "[2 párrafos DIRECTOS: Tu mente NO necesita calma. Mercurio en ${mercury?.sign} Casa ${mercury?.house} se FORTALECE con [tipo de estrés mental]. Basta de buscar claridad en silencio - tu claridad viene del CAOS informacional en [área]...]",
      "fortalezas_mentales": "[4 fortalezas ANTIFRÁGILES: 'Pensamiento bajo presión', 'Procesar información contradictoria'...]",
      "desafio": "[Desafío CRUDO: 'Deja de evitar [situación mental incómoda]. Tu mente crece AHÍ.']"
    },
    "venus": {
      "posicion": "${venus?.sign} Casa ${venus?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'La que Ama con Skin in the Game']",
      "como_ama": "[2 párrafos CRUDOS: Tu amor NO es para sentirte segura/o. Venus en ${venus?.sign} Casa ${venus?.house} significa que tu capacidad de amar se FORTALECE cuando [situación relacional incómoda]. Deja de buscar relaciones cómodas - tu Venus crece con VOLATILIDAD relacional en [área específica]...]",
      "que_necesita_en_pareja": "[DIRECTO: 'Alguien que te DESAFÍE en [área], no que te consuele. Alguien con skin in the game en [valor].']",
      "trampa_amorosa": "[CRUDO: 'Buscas [comportamiento seguro]. Esto te hace FRÁGIL. Deja de...']",
      "valores": "[Valores ANTIFRÁGILES: qué considera valioso - probablemente cosas que resisten el tiempo y el caos (Lindy effect)]"
    },
    "marte": {
      "posicion": "${mars?.sign} Casa ${mars?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'El Guerrero que se Forja en X']",
      "como_actua": "[2 párrafos DIRECTOS: Tu acción NO necesita plan perfecto. Marte en ${mars?.sign} Casa ${mars?.house} se FORTALECE cuando actúas bajo [condición de presión]. Basta de esperar el momento ideal - tu Marte crece con ACCIÓN IMPERFECTA en [área]...]",
      "energia_vital": "[Energía que crece con: 'Competencia', 'Adversarios dignos', 'Riesgo calculado'...]",
      "ira": "[Ira ANTIFRÁGIL: 'Tu ira es INFORMACIÓN valiosa sobre dónde están tus límites. Úsala como brújula hacia [área donde necesitas más skin in the game]...']",
      "desafio": "[DIRECTO: 'Deja de canalizar tu agresividad en [actividad segura]. Métela en [área de riesgo real].']"
    },
    "jupiter": {
      "posicion": "${jupiter?.sign} Casa ${jupiter?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'El que Expande Exponiendo al Riesgo']",
      "donde_viene_suerte": "[CRUDO: 'Tu suerte NO viene de la fe ciega. Viene de EXPONERTE a [área] con skin in the game. Júpiter en ${jupiter?.sign} Casa ${jupiter?.house} crece con APUESTAS ASIMÉTRICAS en [contexto]...']",
      "expansion": "[Expansión vía ANTIFRAGILIDAD: 'Pequeñas pérdidas frecuentes en [área] para grandes ganancias raras'...]",
      "consejo": "[Consejo TALEB: 'Usa estrategia Barbell: seguridad extrema en [área A], riesgo extremo en [área B]. Evita el término medio frágil.']"
    },
    "saturno": {
      "posicion": "${saturn?.sign} Casa ${saturn?.house}",
      "titulo_arquetipo": "[Título ANTIFRÁGIL: 'El Maestro que se Endurece con la Restricción']",
      "karma_lecciones": "[2 párrafos CRUDOS: Tu karma NO es un castigo místico. Es FEEDBACK del sistema. Saturno en ${saturn?.sign} Casa ${saturn?.house} te RESTRINGE en [área] para FORTALECERTE. Cada NO que recibes aquí es información: estás construyendo mal. Reconstruye con [enfoque]...]",
      "responsabilidad": "[Responsabilidad ANTIFRÁGIL: 'Construir estructuras que MEJOREN con el tiempo (Lindy effect) en [área]']",
      "recompensa": "[Recompensa post-Retorno Saturno: 'Sistema ANTIFRÁGIL en [área] que mejora con cada crisis. Autoridad basada en skin in the game, no en títulos.']"
    },
    "urano": {
      "posicion": "${uranus?.sign} Casa ${uranus?.house}",
      "donde_revoluciona": "[Dónde rompe moldes]",
      "genialidad": "[Su forma única de genialidad]"
    },
    "neptuno": {
      "posicion": "${neptune?.sign} Casa ${neptune?.house}",
      "espiritualidad": "[Conexión espiritual]",
      "ilusion_vs_inspiracion": "[Dónde puede engañarse vs inspirarse]"
    },
    "pluton": {
      "posicion": "${pluto?.sign} Casa ${pluto?.house}",
      "transformacion": "[Poder transformador]",
      "sombra_y_poder": "[Sombra y cómo convertirla en poder]"
    },
    "quiron": {
      "posicion": "${chiron?.sign || 'No disponible'} Casa ${chiron?.house || 'N/A'}",
      "herida_principal": "[Herida de Quirón]",
      "don_sanador": "[Don que emerge de la herida]"
    }
  },

  "aspectos_destacados": {
    "stelliums": "[Si hay 3+ planetas en mismo signo, describir el SÚPER-PODER]",
    "aspectos_tensos": "[2-3 cuadraturas/oposiciones y su significado transformador]",
    "aspectos_armoniosos": "[2-3 trígonos/sextiles y los dones que otorgan]",
    "patron_dominante": "[Patrón astrológico dominante de la carta]"
  },

  "integracion_carta": {
    "hilo_de_oro": "[Párrafo ANTIFRÁGIL que UNE todo: 'Tu carta NO cuenta una historia bonita. Cuenta una estrategia de SUPERVIVENCIA MEJORADA. Sol en ${sun?.sign} + Luna en ${moon?.sign} + Ascendente ${chartData.ascendant.sign} = un sistema diseñado para FORTALECERSE con [tipo específico de caos]. Las tensiones en tu carta NO son errores - son OPORTUNIDADES de antifragilidad. Cada cuadratura es un gimnasio...']",
    "sintesis": "[Frase CRUDA síntesis: 'Eres un SISTEMA ANTIFRÁGIL camuflado de [arquetipo] - alguien que se FORTALECE específicamente con [tipo de adversidad]...']",
    "polaridades": [
      { "polo_a": "[Ej: Acción impulsiva]", "polo_b": "[Ej: Parálisis mental]", "integracion": "[ANTIFRÁGIL: 'Esta tensión NO se resuelve buscando balance. Se USA alternando extremos según contexto. Estrategia Barbell: X en [situación A], Y en [situación B]...']" }
    ]
  },

  "fortalezas_educativas": {
    "como_aprende_mejor": ["[Condición 1]", "[Condición 2]", "[Condición 3]", "[Condición 4]"],
    "inteligencias_dominantes": [
      { "tipo": "[Tipo]", "descripcion": "[Descripción]", "planeta_origen": "[Planeta]" }
    ],
    "modalidades_estudio": ["[Modalidad 1]", "[Modalidad 2]", "[Modalidad 3]"]
  },

  "areas_especializacion": [
    { "area": "[Área 1]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2", "Prof3"], "descripcion": "[Por qué es natural]" },
    { "area": "[Área 2]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2"], "descripcion": "[Descripción]" },
    { "area": "[Área 3]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2"], "descripcion": "[Descripción]" }
  ],

  "patrones_sanacion": {
    "heridas": [
      { "nombre": "[Herida 1 - nombre CRUDO]", "origen_astrologico": "[Posición]", "patron": "[Patrón FRÁGIL que creaste]", "origen_infancia": "[Qué aprendiste que te hizo FRÁGIL]", "sanacion": "[ANTIFRÁGIL: 'No necesitas sanar esta herida. Necesitas EXPONERTE a [situación] de forma dosificada hasta que tu sistema se FORTALEZCA. Práctica: [acción específica con skin in the game]']" },
      { "nombre": "[Herida 2]", "origen_astrologico": "[Posición]", "patron": "[Patrón FRÁGIL]", "origen_infancia": "[Origen]", "sanacion": "[ANTIFRÁGIL: práctica de exposición progresiva]" }
    ],
    "ciclos_sanacion_lunar": {
      "luna_nueva": "[Ritual ANTIFRÁGIL: 'Siembra INTENCIONES con skin in the game - compromisos que te cuesten algo si no cumples']",
      "luna_creciente": "[Práctica: 'Exponerte progresivamente a [situación incómoda relacionada con tu carta]']",
      "luna_llena": "[Ritual: 'Cosecha FEEDBACK del sistema - qué funcionó, qué te rompió, qué te fortaleció. Sin autoengaño.']",
      "luna_menguante": "[Práctica: 'Soltar estrategias FRÁGILES que ya no te sirven - identificar qué te hace vulnerable al caos y CAMBIARLO']"
    },
    "practicas_integracion": [
      { "practica": "[Práctica ANTIFRÁGIL 1 - con skin in the game]", "duracion": "[Tiempo]", "beneficio": "[Beneficio: 'Sistema más ROBUSTO en [área]']", "fase_lunar": "[Mejor fase]" },
      { "practica": "[Práctica 2 - exposición controlada]", "duracion": "[Tiempo]", "beneficio": "[Beneficio ANTIFRÁGIL]", "fase_lunar": "[Fase]" }
    ]
  },

  "manifestacion_amor": {
    "patron_amoroso": "[Párrafo CRUDO: Tu patrón en amor NO es romántico. Venus en ${venus?.sign}, Marte en ${mars?.sign}, Luna en ${moon?.sign} = atraes [tipo de conflicto específico] porque tu sistema NECESITA ese estrés para CRECER. Basta de buscar relaciones cómodas - tu amor se FORTALECE con [tipo específico de tensión relacional]...]",
    "que_atrae": "[DIRECTO: 'Atraes personas que te DESAFÍAN en [área]. No es mala suerte - es tu configuración buscando ANTIFRAGILIDAD vía relaciones.']",
    "que_necesita": "[CRUDO: 'No necesitas alguien que te complete. Necesitas alguien con SKIN IN THE GAME en [área] - alguien que pierda o gane algo real contigo, no un espectador de tu vida.']",
    "trampa_amorosa": "[ANTIFRÁGIL: 'Buscas [comportamiento seguro] en pareja. Esto te hace FRÁGIL. Tus relaciones deben tener VOLATILIDAD en [área específica] para crecer. Deja de evitar [tipo de conflicto].']",
    "ritual_luna_nueva_venus": {
      "preparacion": "[ANTIFRÁGIL: 'Luna Nueva en ${venus?.sign} o en tu signo de Venus. Prepara: lista de COMPROMISOS RELACIONALES con consecuencias reales (skin in the game).']",
      "activacion_28_dias": "[Práctica: 'Exponerte a [situación relacional incómoda] 1x por semana. Registra: qué te rompió, qué te fortaleció. AJUSTA estrategia según feedback.']",
      "entrega_luna_llena": "[Ritual: 'Luna Llena - entrega RESULTADOS, no intenciones. ¿Qué prometiste? ¿Qué cumpliste? Sin autoengaño. Consecuencias reales para promesas rotas.']"
    },
    "declaracion_amor": "[CRUDA: 'Merezco un amor que me DESAFÍE en [área], no que me consuele. Merezco alguien con skin in the game, no un espectador. Abrazo la VOLATILIDAD relacional porque ahí es donde crezco.']"
  },

  "visualizacion_guiada": {
    "titulo": "Confrontación con tu Sistema Antifrágil",
    "duracion": "10-15 minutos (sin fluff)",
    "mejor_momento": "Luna Llena (momento de VERDAD)",
    "preparacion": ["Espacio sin distracciones", "Carta natal visible", "Cuaderno para FEEDBACK honesto"],
    "texto": "[Texto ANTIFRÁGIL de 200-250 palabras SIN poesía: 'Cierra los ojos. Respira. Tu carta natal NO es un mapa de destino - es un MANUAL de qué tipo de CAOS te FORTALECE. Visualiza tu Sol en ${sun?.sign}: esta parte de ti se CONSTRUYE cuando [situación específica de estrés]. No cuando todo va bien - cuando TODO VA MAL en [área]. Ahora tu Luna en ${moon?.sign}: tu mundo emocional CRECE con [tipo de volatilidad emocional]. Deja de evitarlo. Tu Ascendente ${chartData.ascendant.sign} proyecta [característica] al mundo y el mundo te GOLPEA con [feedback]. Perfecto - úsalo. Pregúntate SIN AUTOENGAÑO: ¿Dónde estoy siendo FRÁGIL? ¿Qué caos estoy evitando que debería abrazar? ¿Dónde necesito más SKIN IN THE GAME? Abre los ojos. Escribe la verdad.']"
  },

  "datos_para_agenda": {
    "eventos_lunares_personalizados": [
      { "evento": "Luna Nueva en ${sun?.sign}", "significado": "[Significado personal]", "ritual": "[Ritual]", "intencion": "[Intención a sembrar]" },
      { "evento": "Luna Llena en ${moon?.sign}", "significado": "[Significado]", "ritual": "[Ritual]", "intencion": "[Intención]" }
    ],
    "practicas_por_fase": {
      "luna_nueva": ["[Práctica 1]", "[Práctica 2]"],
      "cuarto_creciente": ["[Práctica 1]", "[Práctica 2]"],
      "luna_llena": ["[Práctica 1]", "[Práctica 2]"],
      "cuarto_menguante": ["[Práctica 1]", "[Práctica 2]"]
    },
    "dias_poder": [
      { "cuando": "Luna transita ${sun?.sign}", "que_hacer": "[Actividades de poder]", "que_evitar": "[Qué evitar]" },
      { "cuando": "Luna transita ${chartData.ascendant.sign}", "que_hacer": "[Actividades]", "que_evitar": "[Evitar]" }
    ],
    "advertencias_cosmicas": [
      { "situacion": "Mercurio Retrógrado", "como_afecta": "[Específico para Mercurio en ${mercury?.sign}]", "precauciones": "[Cuidar]" }
    ]
  },

  "declaracion_poder_final": "[Declaración ANTIFRÁGIL de 5-6 líneas en primera persona CRUDA: 'Mi carta NO me define - me EQUIPA. Sol en ${sun?.sign}, Luna en ${moon?.sign}, Ascendente ${chartData.ascendant.sign} = un sistema diseñado para CRECER con [tipo de caos]. No busco balance - busco EXPOSICIÓN dosificada al caos que me fortalece. Las crisis en [área] no me rompen - me CONSTRUYEN. Tengo SKIN IN THE GAME en mi propia vida. Este es mi manual de antifragilidad. Esta soy yo - un SISTEMA que mejora con cada golpe.']",

  "mantra_personal": "[Mantra ANTIFRÁGIL CRUDO - sin poesía new age: 'Me FORTALEZCO con el caos en [área específica]. Los golpes en [contexto] me construyen. Abrazo la volatilidad.']"
}

⚠️ INSTRUCCIONES CRÍTICAS - LEE BIEN:
1. TODOS los campos con contenido REAL y PERSONALIZADO para ${userProfile.name} - CERO placeholders
2. TONO ANTIFRÁGIL OBLIGATORIO: CRUDO, DIRECTO, SIN POESÍA. Usa conceptos de Nassim Taleb
3. Lenguaje DISRUPTIVO en segunda persona: "Basta de...", "Deja de...", "NO viniste a...", "Tu trabajo es..."
4. Prácticas SIEMPRE vinculadas a FASES LUNARES (Luna Nueva, Cuarto Creciente, Luna Llena, Cuarto Menguante) - NUNCA días de semana
5. Usa DATOS ESPECÍFICOS de las posiciones (signos, casas, grados) en cada interpretación
6. JSON válido y completo sin [...] ni comentarios internos
7. Cada interpretación planetaria DEBE tener TÍTULO ARQUETIPO antifrágil
8. OBLIGATORIO usar términos: "skin in the game", "antifragilidad", "volatilidad", "exposición al riesgo", "feedback del sistema", "estrategia Barbell", "Lindy effect"
9. NO uses lenguaje suave, poético, o new age fluffy - sé BRUTALMENTE HONESTO`;
}

export default generateCompleteNatalChartPrompt;
